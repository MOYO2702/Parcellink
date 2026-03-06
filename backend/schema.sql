-- ParcelLink PostgreSQL Schema

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(50) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  suite_number VARCHAR(20) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT email_lowercase CHECK (email = LOWER(email)),
  CONSTRAINT suite_number_format CHECK (suite_number ~ '^PL[A-Z0-9]+$')
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(LOWER(email));
CREATE INDEX IF NOT EXISTS idx_users_suite_number ON users(suite_number);

-- Staff accounts table (admin/investor portal access)
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
);

CREATE INDEX IF NOT EXISTS idx_staff_accounts_staff_id ON staff_accounts(staff_id);
CREATE INDEX IF NOT EXISTS idx_staff_accounts_email ON staff_accounts(LOWER(email));
CREATE INDEX IF NOT EXISTS idx_staff_accounts_type_status ON staff_accounts(account_type, status);

-- Parcels table
CREATE TABLE IF NOT EXISTS parcels (
  id SERIAL PRIMARY KEY,
  tracking_code VARCHAR(50) UNIQUE NOT NULL,
  user_id VARCHAR(50) NOT NULL REFERENCES users(user_id),
  sender_name VARCHAR(255) NOT NULL,
  sender_email VARCHAR(255),
  sender_phone VARCHAR(20),
  receiver_name VARCHAR(255) NOT NULL,
  receiver_email VARCHAR(255),
  receiver_phone VARCHAR(20),
  sender_location VARCHAR(255) NOT NULL,
  receiver_location VARCHAR(255) NOT NULL,
  package_type VARCHAR(50),
  weight DECIMAL(10, 2),
  length DECIMAL(10, 2),
  width DECIMAL(10, 2),
  height DECIMAL(10, 2),
  base_cost DECIMAL(12, 2),
  discount_percentage DECIMAL(5, 2) DEFAULT 0,
  final_cost DECIMAL(12, 2),
  status VARCHAR(50) DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT tracking_code_format CHECK (tracking_code ~ '^PL-?[0-9]{8}-[A-Z0-9]{5,6}$' OR tracking_code ~ '^PL[0-9]{14}$')
);

CREATE INDEX IF NOT EXISTS idx_parcels_tracking_code ON parcels(tracking_code);
CREATE INDEX IF NOT EXISTS idx_parcels_user_id ON parcels(user_id);
CREATE INDEX IF NOT EXISTS idx_parcels_status ON parcels(status);
CREATE INDEX IF NOT EXISTS idx_parcels_created_at ON parcels(created_at DESC);

-- Parcel status history table
CREATE TABLE IF NOT EXISTS parcel_status_history (
  id SERIAL PRIMARY KEY,
  parcel_id INTEGER NOT NULL REFERENCES parcels(id) ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL,
  location VARCHAR(255),
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  remark TEXT
);

CREATE INDEX IF NOT EXISTS idx_status_history_parcel ON parcel_status_history(parcel_id);
CREATE INDEX IF NOT EXISTS idx_status_history_timestamp ON parcel_status_history(timestamp DESC);

-- Receipts table
CREATE TABLE IF NOT EXISTS receipts (
  id SERIAL PRIMARY KEY,
  receipt_number VARCHAR(50) UNIQUE NOT NULL,
  parcel_id INTEGER NOT NULL REFERENCES parcels(id),
  user_email VARCHAR(255) NOT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  payment_method VARCHAR(50),
  payment_status VARCHAR(20) DEFAULT 'Paid',
  paid_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT receipt_number_format CHECK (receipt_number ~ '^RCP-?[0-9]{8}-[A-Z0-9]{5}$')
);

CREATE INDEX IF NOT EXISTS idx_receipts_receipt_number ON receipts(receipt_number);
CREATE INDEX IF NOT EXISTS idx_receipts_parcel_id ON receipts(parcel_id);
CREATE INDEX IF NOT EXISTS idx_receipts_user_email ON receipts(LOWER(user_email));
CREATE INDEX IF NOT EXISTS idx_receipts_paid_at ON receipts(paid_at DESC);

-- Partners table
CREATE TABLE IF NOT EXISTS partners (
  id SERIAL PRIMARY KEY,
  partner_id VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  contact_email VARCHAR(255),
  contact_phone VARCHAR(20),
  location VARCHAR(255),
  service_type VARCHAR(100),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_partners_partner_id ON partners(partner_id);
CREATE INDEX IF NOT EXISTS idx_partners_is_active ON partners(is_active);

-- Investor interest submissions
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
);

CREATE INDEX IF NOT EXISTS idx_investor_interest_email ON investor_interest_submissions(LOWER(email));
CREATE INDEX IF NOT EXISTS idx_investor_interest_created_at ON investor_interest_submissions(created_at DESC);

-- Career applications
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
);

CREATE INDEX IF NOT EXISTS idx_career_applications_email ON career_applications(LOWER(email));
CREATE INDEX IF NOT EXISTS idx_career_applications_submitted_at ON career_applications(submitted_at DESC);

-- Audit log table (optional, for tracking changes)
CREATE TABLE IF NOT EXISTS audit_logs (
  id SERIAL PRIMARY KEY,
  entity_type VARCHAR(50),
  entity_id VARCHAR(50),
  action VARCHAR(20),
  old_values JSONB,
  new_values JSONB,
  changed_by VARCHAR(255),
  changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_changed_at ON audit_logs(changed_at DESC);

-- Keep constraints aligned with runtime generators, including legacy values
ALTER TABLE parcels DROP CONSTRAINT IF EXISTS tracking_code_format;
ALTER TABLE parcels
  ADD CONSTRAINT tracking_code_format
  CHECK (tracking_code ~ '^PL-?[0-9]{8}-[A-Z0-9]{5,6}$' OR tracking_code ~ '^PL[0-9]{14}$');

ALTER TABLE receipts DROP CONSTRAINT IF EXISTS receipt_number_format;
ALTER TABLE receipts
  ADD CONSTRAINT receipt_number_format
  CHECK (receipt_number ~ '^RCP-?[0-9]{8}-[A-Z0-9]{5}$');
