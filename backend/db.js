import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

const connectionString = (process.env.DATABASE_URL || '').trim();
const dbSslEnabled = ['1', 'true', 'yes'].includes(String(process.env.DB_SSL || '').toLowerCase());
const useSsl = dbSslEnabled || (process.env.NODE_ENV === 'production' && Boolean(connectionString));

// PostgreSQL connection pool
const pool = new Pool({
  ...(connectionString
    ? {
        connectionString,
        ssl: useSsl ? { rejectUnauthorized: false } : false,
      }
    : {
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'devpass',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432', 10),
        database: process.env.DB_NAME || 'parcellink',
        ssl: useSsl ? { rejectUnauthorized: false } : false,
      }),
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

function formatDbError(err) {
  if (!err) {
    return 'Unknown database error';
  }

  if (err.message && String(err.message).trim()) {
    return String(err.message);
  }

  if (Array.isArray(err.errors) && err.errors.length) {
    return err.errors
      .map((entry) => {
        const code = entry?.code || 'ERR';
        const address = entry?.address || '';
        const port = entry?.port ? `:${entry.port}` : '';
        return `${code} ${address}${port}`.trim();
      })
      .join(' | ');
  }

  if (err.code) {
    return String(err.code);
  }

  return 'Unknown database error';
}

// Query helper with logging
export async function query(text, params = []) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log(`[DB Query] ${duration}ms - ${text.substring(0, 80)}...`);
    return res;
  } catch (err) {
    console.error('[DB Error]', formatDbError(err), text.substring(0, 80));
    throw err;
  }
}

// Transaction helper
export async function transaction(callback) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('[Transaction Error]', err.message);
    throw err;
  } finally {
    client.release();
  }
}

// User helpers
export async function getUserByEmail(email) {
  const normalizedEmail = (email || '').trim().toLowerCase();
  const res = await query('SELECT * FROM users WHERE LOWER(email) = LOWER($1)', [normalizedEmail]);
  return res.rows[0];
}

export async function getUserBySuiteNumber(suiteNumber) {
  const normalizedSuiteNumber = (suiteNumber || '').trim();
  const res = await query('SELECT * FROM users WHERE UPPER(suite_number) = UPPER($1)', [normalizedSuiteNumber]);
  return res.rows[0];
}

export async function createUser(fullName, email, suiteNumber, passwordHash) {
  const normalizedEmail = (email || '').trim().toLowerCase();
  const normalizedSuiteNumber = (suiteNumber || '').trim().toUpperCase();
  const userId = `USR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const res = await query(
    'INSERT INTO users (user_id, full_name, email, suite_number, password_hash) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [userId, fullName, normalizedEmail, normalizedSuiteNumber, passwordHash]
  );
  return res.rows[0];
}

export async function ensureStaffAccountsTable() {
  await query(`
    CREATE TABLE IF NOT EXISTS staff_accounts (
      id SERIAL PRIMARY KEY,
      staff_id VARCHAR(20) UNIQUE NOT NULL,
      account_type VARCHAR(20) NOT NULL CHECK (account_type IN ('admin', 'investor')),
      full_name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      role VARCHAR(120) NOT NULL,
      department VARCHAR(120) NOT NULL,
      status VARCHAR(20) NOT NULL DEFAULT 'active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT staff_id_format CHECK (staff_id ~ '^(ADM|INV)[0-9]{3,}$'),
      CONSTRAINT staff_email_lowercase CHECK (email = LOWER(email))
    )
  `);

  await query('CREATE INDEX IF NOT EXISTS idx_staff_accounts_staff_id ON staff_accounts(staff_id)');
  await query('CREATE INDEX IF NOT EXISTS idx_staff_accounts_email ON staff_accounts(LOWER(email))');
  await query('CREATE INDEX IF NOT EXISTS idx_staff_accounts_type_status ON staff_accounts(account_type, status)');
}

export async function getStaffAccountByEmail(email) {
  await ensureStaffAccountsTable();
  const normalizedEmail = (email || '').trim().toLowerCase();
  const res = await query('SELECT * FROM staff_accounts WHERE LOWER(email) = LOWER($1) LIMIT 1', [normalizedEmail]);
  return res.rows[0];
}

export async function getStaffAccountByStaffId(staffId) {
  await ensureStaffAccountsTable();
  const normalizedStaffId = (staffId || '').trim().toUpperCase();
  const res = await query('SELECT * FROM staff_accounts WHERE UPPER(staff_id) = UPPER($1) LIMIT 1', [normalizedStaffId]);
  return res.rows[0];
}

export async function createStaffAccount({
  prefix,
  minimumCounter = 0,
  accountType,
  fullName,
  email,
  passwordHash,
  role,
  department,
  status = 'active'
}) {
  await ensureStaffAccountsTable();

  const normalizedPrefix = (prefix || '').trim().toUpperCase();
  if (!['ADM', 'INV'].includes(normalizedPrefix)) {
    throw new Error('Unsupported staff ID prefix. Use ADM or INV.');
  }

  const normalizedAccountType = (accountType || '').trim().toLowerCase();
  if (!['admin', 'investor'].includes(normalizedAccountType)) {
    throw new Error('Unsupported staff account type. Use admin or investor.');
  }

  const normalizedEmail = (email || '').trim().toLowerCase();
  const normalizedStatus = (status || 'active').trim().toLowerCase();
  const counterFloor = Number.isFinite(Number(minimumCounter))
    ? Math.max(0, Number(minimumCounter))
    : 0;

  return transaction(async (client) => {
    await client.query('LOCK TABLE staff_accounts IN EXCLUSIVE MODE');

    const maxResult = await client.query(
      `SELECT COALESCE(MAX(CAST(SUBSTRING(staff_id FROM '[0-9]+$') AS INTEGER)), 0) AS max_number
       FROM staff_accounts
       WHERE staff_id ~ $1`,
      [`^${normalizedPrefix}[0-9]+$`]
    );

    const maxNumber = Number(maxResult.rows[0]?.max_number || 0);
    const nextNumber = Math.max(maxNumber, counterFloor) + 1;
    const staffId = `${normalizedPrefix}${String(nextNumber).padStart(3, '0')}`;

    const insertResult = await client.query(
      `INSERT INTO staff_accounts
        (staff_id, account_type, full_name, email, password_hash, role, department, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        staffId,
        normalizedAccountType,
        fullName,
        normalizedEmail,
        passwordHash,
        role,
        department,
        normalizedStatus
      ]
    );

    return insertResult.rows[0];
  });
}

export async function updateStaffAccountPassword(staffId, passwordHash) {
  await ensureStaffAccountsTable();
  const normalizedStaffId = (staffId || '').trim().toUpperCase();

  const res = await query(
    `UPDATE staff_accounts
     SET password_hash = $1,
         updated_at = CURRENT_TIMESTAMP
     WHERE UPPER(staff_id) = UPPER($2)
     RETURNING *`,
    [passwordHash, normalizedStaffId]
  );

  return res.rows[0];
}

export async function listStaffAccounts({ accountType = '', search = '', limit = 50 } = {}) {
  await ensureStaffAccountsTable();

  const conditions = [];
  const params = [];

  const normalizedType = (accountType || '').trim().toLowerCase();
  if (['admin', 'investor'].includes(normalizedType)) {
    params.push(normalizedType);
    conditions.push(`account_type = $${params.length}`);
  }

  const normalizedSearch = (search || '').trim().toLowerCase();
  if (normalizedSearch) {
    params.push(`%${normalizedSearch}%`);
    const searchParamIndex = params.length;
    conditions.push(`(
      LOWER(staff_id) LIKE $${searchParamIndex}
      OR LOWER(full_name) LIKE $${searchParamIndex}
      OR LOWER(email) LIKE $${searchParamIndex}
      OR LOWER(role) LIKE $${searchParamIndex}
      OR LOWER(department) LIKE $${searchParamIndex}
    )`);
  }

  const numericLimit = Number(limit);
  const safeLimit = Number.isFinite(numericLimit)
    ? Math.max(1, Math.min(200, Math.trunc(numericLimit)))
    : 50;

  params.push(safeLimit);
  const limitParamIndex = params.length;

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const res = await query(
    `SELECT
      staff_id,
      account_type,
      full_name,
      email,
      role,
      department,
      status,
      created_at,
      updated_at
     FROM staff_accounts
     ${whereClause}
     ORDER BY created_at DESC
     LIMIT $${limitParamIndex}`,
    params
  );

  return res.rows;
}

export async function hasAnyStaffAccounts() {
  await ensureStaffAccountsTable();
  const res = await query('SELECT COUNT(*)::int AS total FROM staff_accounts');
  const total = Number(res.rows[0]?.total || 0);
  return total > 0;
}

// Parcel helpers
export async function getParcelByTrackingCode(trackingCode) {
  const compact = (trackingCode || '').toString().trim().toUpperCase().replace(/-/g, '');
  const normalized = compact.startsWith('PL') ? compact : `PL${compact}`;
  const res = await query(
    "SELECT * FROM parcels WHERE UPPER(REPLACE(tracking_code, '-', '')) = UPPER($1)",
    [normalized]
  );
  return res.rows[0];
}

export async function getParcelsByUserId(userId) {
  const res = await query('SELECT * FROM parcels WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
  return res.rows;
}

export async function createParcel(parcelData) {
  const {
    trackingCode, userId, senderName, senderEmail, senderPhone,
    receiverName, receiverEmail, receiverPhone, senderLocation, receiverLocation,
    packageType, weight, length, width, height, baseCost, discountPercentage, finalCost, notes
  } = parcelData;

  const normalizedTrackingCode = (trackingCode || '').trim().toUpperCase();

  const res = await query(
    `INSERT INTO parcels (
      tracking_code, user_id, sender_name, sender_email, sender_phone,
      receiver_name, receiver_email, receiver_phone, sender_location, receiver_location,
      package_type, weight, length, width, height, base_cost, discount_percentage, final_cost, notes
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
    RETURNING *`,
    [
      normalizedTrackingCode, userId, senderName, senderEmail, senderPhone,
      receiverName, receiverEmail, receiverPhone, senderLocation, receiverLocation,
      packageType, weight, length, width, height, baseCost, discountPercentage, finalCost, notes
    ]
  );
  return res.rows[0];
}

export async function updateParcelStatus(parcelId, status) {
  const res = await query('UPDATE parcels SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *', [status, parcelId]);
  return res.rows[0];
}

// Status history helpers
export async function addStatusHistory(parcelId, status, location, remark) {
  const res = await query(
    'INSERT INTO parcel_status_history (parcel_id, status, location, remark) VALUES ($1, $2, $3, $4) RETURNING *',
    [parcelId, status, location, remark]
  );
  return res.rows[0];
}

export async function getStatusHistory(parcelId) {
  const res = await query(
    'SELECT * FROM parcel_status_history WHERE parcel_id = $1 ORDER BY timestamp ASC',
    [parcelId]
  );
  return res.rows;
}

// Receipt helpers
export async function createReceipt(receiptData) {
  const { receiptNumber, parcelId, userEmail, amount, paymentMethod } = receiptData;
  const normalizedReceiptNumber = (receiptNumber || '').trim().toUpperCase();
  const normalizedUserEmail = (userEmail || '').trim().toLowerCase();
  const res = await query(
    `INSERT INTO receipts (receipt_number, parcel_id, user_email, amount, payment_method)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [normalizedReceiptNumber, parcelId, normalizedUserEmail, amount, paymentMethod]
  );
  return res.rows[0];
}

export async function getReceiptsByEmail(email) {
  const normalizedEmail = (email || '').trim().toLowerCase();
  const res = await query(
    'SELECT * FROM receipts WHERE LOWER(user_email) = LOWER($1) ORDER BY paid_at DESC',
    [normalizedEmail]
  );
  return res.rows;
}

export async function getReceiptByNumber(receiptNumber) {
  const compact = (receiptNumber || '').toString().trim().toUpperCase().replace(/-/g, '');
  const normalized = compact.startsWith('RCP') ? compact : `RCP${compact}`;
  const res = await query(
    "SELECT * FROM receipts WHERE UPPER(REPLACE(receipt_number, '-', '')) = UPPER($1)",
    [normalized]
  );
  return res.rows[0];
}

// Partner helpers
export async function getPartners(activeOnly = true) {
  const query_text = activeOnly
    ? 'SELECT * FROM partners WHERE is_active = TRUE ORDER BY name ASC'
    : 'SELECT * FROM partners ORDER BY name ASC';
  const res = await query(query_text);
  return res.rows;
}

export async function getPartnerById(partnerId) {
  const res = await query('SELECT * FROM partners WHERE partner_id = $1', [partnerId]);
  return res.rows[0];
}

// Investor interest helpers
export async function ensureInvestorInterestTable() {
  await query(`
    CREATE TABLE IF NOT EXISTS investor_interest_submissions (
      id SERIAL PRIMARY KEY,
      inquiry_id VARCHAR(50) UNIQUE NOT NULL,
      full_name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      phone_number VARCHAR(30) NOT NULL,
      initial_investment DECIMAL(12, 2) NOT NULL CHECK (initial_investment > 0),
      investment_start_date DATE NOT NULL,
      status VARCHAR(20) DEFAULT 'new',
      confirmed_at TIMESTAMP,
      source_page VARCHAR(100) DEFAULT 'admin-investor-portal',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await query('ALTER TABLE investor_interest_submissions ADD COLUMN IF NOT EXISTS confirmed_at TIMESTAMP');
  await query('CREATE INDEX IF NOT EXISTS idx_investor_interest_email ON investor_interest_submissions(LOWER(email))');
  await query('CREATE INDEX IF NOT EXISTS idx_investor_interest_created_at ON investor_interest_submissions(created_at DESC)');
}

export async function createInvestorInterest({ fullName, email, phoneNumber, initialInvestment, investmentStartDate }) {
  await ensureInvestorInterestTable();

  const inquiryId = `INV-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  const res = await query(
    `INSERT INTO investor_interest_submissions
      (inquiry_id, full_name, email, phone_number, initial_investment, investment_start_date, status, confirmed_at)
     VALUES ($1, $2, $3, $4, $5, $6, 'confirmed', CURRENT_TIMESTAMP)
     RETURNING *`,
    [inquiryId, fullName, email.toLowerCase(), phoneNumber, initialInvestment, investmentStartDate]
  );
  return res.rows[0];
}

export async function getInvestorInterestByInquiryId(inquiryId) {
  await ensureInvestorInterestTable();
  const res = await query(
    'SELECT * FROM investor_interest_submissions WHERE inquiry_id = $1 LIMIT 1',
    [inquiryId]
  );
  return res.rows[0];
}

export async function updateUserPassword(email, passwordHash) {
  const normalizedEmail = (email || '').trim().toLowerCase();
  const res = await query(
    `UPDATE users
     SET password_hash = $1,
         updated_at = CURRENT_TIMESTAMP
     WHERE LOWER(email) = LOWER($2)
     RETURNING *`,
    [passwordHash, normalizedEmail]
  );
  return res.rows[0];
}

export async function getLatestInvestorInterestByEmail(email) {
  await ensureInvestorInterestTable();
  const normalizedEmail = (email || '').trim().toLowerCase();
  const res = await query(
    `SELECT * FROM investor_interest_submissions
     WHERE LOWER(email) = LOWER($1)
     ORDER BY created_at DESC
     LIMIT 1`,
    [normalizedEmail]
  );
  return res.rows[0];
}

// Career application helpers
export async function ensureCareerApplicationsTable() {
  await query(`
    CREATE TABLE IF NOT EXISTS career_applications (
      id SERIAL PRIMARY KEY,
      application_id VARCHAR(50) UNIQUE NOT NULL,
      full_name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      phone VARCHAR(30) NOT NULL,
      role_interest VARCHAR(150) NOT NULL,
      message TEXT,
      cv_file_name VARCHAR(255),
      status VARCHAR(20) DEFAULT 'new',
      submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await query('CREATE INDEX IF NOT EXISTS idx_career_applications_email ON career_applications(LOWER(email))');
  await query('CREATE INDEX IF NOT EXISTS idx_career_applications_submitted_at ON career_applications(submitted_at DESC)');
}

export async function createCareerApplication({ fullName, email, phone, roleInterest, message = '', cvFileName = '' }) {
  await ensureCareerApplicationsTable();

  const applicationId = `CAR-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  const normalizedEmail = (email || '').trim().toLowerCase();

  const res = await query(
    `INSERT INTO career_applications
      (application_id, full_name, email, phone, role_interest, message, cv_file_name, status)
     VALUES ($1, $2, $3, $4, $5, $6, $7, 'new')
     RETURNING *`,
    [applicationId, fullName, normalizedEmail, phone, roleInterest, message, cvFileName]
  );

  return res.rows[0];
}

// Health check
export async function testConnection() {
  try {
    const res = await query('SELECT NOW()');
    return { success: true, timestamp: res.rows[0] };
  } catch (err) {
    return { success: false, error: formatDbError(err) };
  }
}

// Close pool
export async function closePool() {
  await pool.end();
  console.log('[DB] Connection pool closed');
}

export default pool;
