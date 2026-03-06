#!/usr/bin/env node
import 'dotenv/config';
import * as db from './db.js';

const baseUrl = (process.env.SMOKE_BASE_URL || `http://localhost:${process.env.PORT || 3000}`).replace(/\/$/, '');
const adminPassword = process.env.ADMIN_PASSWORD || 'Parcel@123';
const staffProvisionKey = (process.env.STAFF_PROVISION_KEY || process.env.ADMIN_PASSWORD || '').trim();
const allowLegacyStaticLogin = ['1', 'true', 'yes'].includes(String(process.env.ALLOW_LEGACY_STAFF_LOGIN || '').toLowerCase());
const resolveStaffPassword = (staffId) => {
  const normalizedId = String(staffId || '').trim().toUpperCase();
  return (
    process.env[`STAFF_PASSWORD_${normalizedId}`]
    || process.env[`STAFF_PASS_${normalizedId}`]
    || adminPassword
  );
};
const adminOpsPassword = resolveStaffPassword('ADM001');
const investorStaffPassword = resolveStaffPassword('INV001');
const keepData = ['1', 'true', 'yes'].includes(String(process.env.SMOKE_KEEP_DATA || '').toLowerCase());

const timestamp = Date.now();
const randomPart = Math.random().toString(36).slice(2, 8);

const context = {
  userEmail: `smoke.user.${timestamp}.${randomPart}@parcellinkuae.com`,
  userPassword: 'SmokePass!123',
  suiteNumber: '',
  userToken: '',
  trackingCode: '',
  receiptNumber: '',
  investorEmail: `smoke.investor.${timestamp}.${randomPart}@parcellinkuae.com`,
  investorInquiryId: '',
  careerEmail: `smoke.career.${timestamp}.${randomPart}@parcellinkuae.com`,
  careerApplicationId: '',
  autoAdminEmail: `smoke.admin.${timestamp}.${randomPart}@parcellinkuae.com`,
  autoAdminPassword: 'SmokeAdmin!123',
  autoAdminResetPassword: 'SmokeAdmin!456',
  autoAdminStaffId: '',
  autoInvestorEmail: `smoke.auto.investor.${timestamp}.${randomPart}@parcellinkuae.com`,
  autoInvestorPassword: 'SmokeInvestor!123',
  autoInvestorStaffId: ''
};

const results = [];

function assertCondition(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function request(method, path, body, extraHeaders = {}) {
  const headers = { ...extraHeaders };
  if (body) headers['Content-Type'] = 'application/json';
  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers: Object.keys(headers).length ? headers : undefined,
    body: body ? JSON.stringify(body) : undefined
  });

  const rawBody = await response.text();
  let parsedBody = rawBody;

  try {
    parsedBody = rawBody ? JSON.parse(rawBody) : {};
  } catch {
    parsedBody = rawBody;
  }

  return { response, rawBody, parsedBody };
}

async function requestExpectSuccess(method, path, body, extraHeaders = {}) {
  const { response, parsedBody, rawBody } = await request(method, path, body, extraHeaders);

  if (!response.ok) {
    const message = typeof parsedBody === 'object' && parsedBody
      ? parsedBody.message || parsedBody.error || rawBody || `HTTP ${response.status}`
      : rawBody || `HTTP ${response.status}`;
    throw new Error(`${method} ${path} failed (${response.status}): ${message}`);
  }

  return { response, data: parsedBody };
}

async function runStep(name, handler) {
  try {
    const detail = await handler();
    results.push({ name, ok: true, detail: detail || '' });
    console.log(`✅ ${name}${detail ? ` - ${detail}` : ''}`);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    results.push({ name, ok: false, detail: message });
    console.error(`❌ ${name} - ${message}`);
    throw err;
  }
}

async function safeQuery(queryText, params = []) {
  try {
    await db.query(queryText, params);
  } catch (err) {
    if (err?.message && /does not exist/i.test(err.message)) {
      return;
    }
    throw err;
  }
}

async function cleanup() {
  if (keepData) {
    console.log('ℹ️ Cleanup skipped because SMOKE_KEEP_DATA is enabled.');
    return;
  }

  if (context.receiptNumber || context.userEmail) {
    await safeQuery(
      'DELETE FROM receipts WHERE receipt_number = $1 OR LOWER(user_email) = LOWER($2)',
      [context.receiptNumber || '', context.userEmail || '']
    );
  }

  if (context.trackingCode) {
    await safeQuery(
      'DELETE FROM parcel_status_history WHERE parcel_id IN (SELECT id FROM parcels WHERE tracking_code = $1)',
      [context.trackingCode]
    );
    await safeQuery('DELETE FROM parcels WHERE tracking_code = $1', [context.trackingCode]);
  }

  if (context.userEmail) {
    await safeQuery('DELETE FROM users WHERE LOWER(email) = LOWER($1)', [context.userEmail]);
  }

  if (context.investorInquiryId || context.investorEmail) {
    await safeQuery(
      'DELETE FROM investor_interest_submissions WHERE inquiry_id = $1 OR LOWER(email) = LOWER($2)',
      [context.investorInquiryId || '', context.investorEmail || '']
    );
  }

  if (context.careerApplicationId || context.careerEmail) {
    await safeQuery(
      'DELETE FROM career_applications WHERE application_id = $1 OR LOWER(email) = LOWER($2)',
      [context.careerApplicationId || '', context.careerEmail || '']
    );
  }

  if (context.autoAdminStaffId || context.autoAdminEmail || context.autoInvestorStaffId || context.autoInvestorEmail) {
    await safeQuery(
      `DELETE FROM staff_accounts
       WHERE staff_id = $1
          OR LOWER(email) = LOWER($2)
          OR staff_id = $3
          OR LOWER(email) = LOWER($4)`,
      [
        context.autoAdminStaffId || '',
        context.autoAdminEmail || '',
        context.autoInvestorStaffId || '',
        context.autoInvestorEmail || ''
      ]
    );
  }

  console.log('🧹 Smoke-test data cleanup completed.');
}

async function main() {
  let failed = false;

  try {
    await runStep('API status check', async () => {
      const { response, rawBody } = await request('GET', '/api/status');
      assertCondition(response.ok, `Expected 200 but got ${response.status}`);
      return `status=${response.status}`;
    });

    await runStep('Database health check', async () => {
      const { response, data } = await requestExpectSuccess('GET', '/api/db-health');
      assertCondition(data.success === true, 'Database health success flag is not true');
      return `status=${response.status}`;
    });

    await runStep('User registration', async () => {
      const { response, data } = await requestExpectSuccess('POST', '/api/register', {
        fullName: 'Smoke Automation User',
        email: context.userEmail,
        password: context.userPassword
      });
      assertCondition(data.success === true, 'Registration success flag is false');
      context.suiteNumber = data.suiteNumber || '';
      assertCondition(/^PL\d{6,}$/.test(context.suiteNumber), `Unexpected suite format: ${context.suiteNumber}`);
      return `status=${response.status};suite=${context.suiteNumber}`;
    });

    await runStep('Login with email', async () => {
      const { response, data } = await requestExpectSuccess('POST', '/api/login', {
        identifier: context.userEmail,
        password: context.userPassword
      });
      assertCondition(data.success === true, 'Email login success flag is false');
      context.userToken = data.token || '';
      assertCondition(Boolean(context.userToken), 'Login token was not returned');
      return `status=${response.status}`;
    });

    await runStep('Login with suite number', async () => {
      const { response, data } = await requestExpectSuccess('POST', '/api/login', {
        identifier: context.suiteNumber,
        password: context.userPassword
      });
      assertCondition(data.success === true, 'Suite login success flag is false');
      return `status=${response.status}`;
    });

    await runStep('Create parcel', async () => {
      const { response, data } = await requestExpectSuccess('POST', '/api/parcels', {
        senderName: 'Smoke Sender',
        receiverName: 'Smoke Receiver',
        from: 'Dubai',
        to: 'Abu Dhabi',
        weight: 8,
        length: 25,
        width: 16,
        height: 10,
        notes: 'Smoke test parcel'
      }, { Authorization: `Bearer ${context.userToken}` });
      assertCondition(data.success === true, 'Parcel create success flag is false');
      context.trackingCode = data.trackingCode || '';
      assertCondition(/^PL-\d{8}-\d{6}$/.test(context.trackingCode), `Unexpected tracking format: ${context.trackingCode}`);
      return `status=${response.status};tracking=${context.trackingCode}`;
    });

    await runStep('Track parcel', async () => {
      const { response, data } = await requestExpectSuccess('GET', `/api/track?code=${encodeURIComponent(context.trackingCode)}`);
      assertCondition(data.success === true, 'Track success flag is false');
      return `status=${response.status}`;
    });

    await runStep('Update parcel status', async () => {
      const { response, data } = await requestExpectSuccess('POST', `/api/parcels/${encodeURIComponent(context.trackingCode)}/status`, {
        status: 'In Transit',
        location: 'Dubai Hub',
        remark: 'Smoke update'
      });
      assertCondition(data.success === true, 'Status update success flag is false');
      return `status=${response.status}`;
    });

    await runStep('Create payment + receipt', async () => {
      const { response, data } = await requestExpectSuccess('POST', '/api/payments', {
        trackingCode: context.trackingCode,
        userEmail: context.userEmail,
        amount: 120,
        paymentMethod: 'Card',
        cardDetails: { last4: '4242' }
      }, { Authorization: `Bearer ${context.userToken}` });
      assertCondition(data.success === true, 'Payment success flag is false');
      context.receiptNumber = data.receiptNumber || '';
      assertCondition(/^RCP-\d{8}-\d{5}$/.test(context.receiptNumber), `Unexpected receipt format: ${context.receiptNumber}`);
      return `status=${response.status};receipt=${context.receiptNumber}`;
    });

    await runStep('Fetch receipts', async () => {
      const { response, data } = await requestExpectSuccess(
        'GET',
        `/api/receipts/${encodeURIComponent(context.userEmail)}`,
        null,
        { Authorization: `Bearer ${context.userToken}` }
      );
      const count = Array.isArray(data.receipts) ? data.receipts.length : 0;
      assertCondition(data.success === true, 'Receipts success flag is false');
      assertCondition(count >= 1, 'No receipts returned');
      return `status=${response.status};count=${count}`;
    });

    await runStep('Staff login (operations)', async () => {
      const { response, parsedBody } = await request('POST', '/api/staff-login', {
        staffId: 'ADM001',
        password: adminOpsPassword
      });
      if (response.ok) {
        return `status=${response.status};dept=${parsedBody.staff?.department || 'N/A'}`;
      }
      const message = parsedBody?.message || '';
      if (!allowLegacyStaticLogin && /Invalid Staff ID/i.test(message)) {
        return `status=${response.status};mode=legacy-disabled`;
      }
      throw new Error(`POST /api/staff-login failed (${response.status}): ${message || 'Unknown error'}`);
    });

    await runStep('Staff login (investor)', async () => {
      const { response, parsedBody } = await request('POST', '/api/staff-login', {
        staffId: 'INV001',
        password: investorStaffPassword
      });
      if (response.ok) {
        return `status=${response.status};dept=${parsedBody.staff?.department || 'N/A'}`;
      }
      const message = parsedBody?.message || '';
      if (!allowLegacyStaticLogin && /Invalid Staff ID/i.test(message)) {
        return `status=${response.status};mode=legacy-disabled`;
      }
      throw new Error(`POST /api/staff-login failed (${response.status}): ${message || 'Unknown error'}`);
    });

    await runStep('Auto-register admin staff account', async () => {
      assertCondition(Boolean(staffProvisionKey), 'STAFF_PROVISION_KEY or ADMIN_PASSWORD is required for staff provisioning tests');

      const { response, data } = await requestExpectSuccess('POST', '/api/staff/register', {
        fullName: 'Smoke Auto Admin',
        email: context.autoAdminEmail,
        password: context.autoAdminPassword,
        accountType: 'admin',
        role: 'Operations Admin',
        department: 'Management',
        provisionKey: staffProvisionKey
      });

      assertCondition(data.success === true, 'Auto admin registration failed');
      context.autoAdminStaffId = data.data?.staffId || '';
      assertCondition(/^ADM\d{3,}$/.test(context.autoAdminStaffId), `Unexpected auto admin staff ID format: ${context.autoAdminStaffId}`);
      return `status=${response.status};staffId=${context.autoAdminStaffId}`;
    });

    await runStep('Auto-admin login with generated ID', async () => {
      const { response, data } = await requestExpectSuccess('POST', '/api/staff-login', {
        staffId: context.autoAdminStaffId,
        password: context.autoAdminPassword
      });

      assertCondition(data.success === true, 'Generated admin login failed');
      return `status=${response.status};dept=${data.staff?.department || 'N/A'}`;
    });

    await runStep('Legacy static login behavior after provisioning', async () => {
      const { response, parsedBody, rawBody } = await request('POST', '/api/staff-login', {
        staffId: 'ADM001',
        password: adminOpsPassword
      });

      if (allowLegacyStaticLogin) {
        assertCondition(response.ok, 'Expected legacy ADM001 login to remain enabled when ALLOW_LEGACY_STAFF_LOGIN=true');
        return `status=${response.status};mode=enabled`;
      }

      assertCondition(!response.ok, 'Expected legacy ADM001 login to be disabled after first provisioned account');
      const message = typeof parsedBody === 'object' && parsedBody
        ? parsedBody.message || ''
        : rawBody || '';
      return `status=${response.status};mode=disabled;message=${message || 'N/A'}`;
    });

    await runStep('Reset auto-admin password', async () => {
      const { response, data } = await requestExpectSuccess('POST', '/api/staff/reset-password', {
        staffId: context.autoAdminStaffId,
        newPassword: context.autoAdminResetPassword,
        provisionKey: staffProvisionKey
      });

      assertCondition(data.success === true, 'Auto admin password reset failed');
      return `status=${response.status};staffId=${data.data?.staffId || context.autoAdminStaffId}`;
    });

    await runStep('Auto-admin login with reset password', async () => {
      const { response, data } = await requestExpectSuccess('POST', '/api/staff-login', {
        staffId: context.autoAdminStaffId,
        password: context.autoAdminResetPassword
      });

      assertCondition(data.success === true, 'Auto admin login with reset password failed');
      return `status=${response.status};dept=${data.staff?.department || 'N/A'}`;
    });

    await runStep('List generated staff accounts', async () => {
      const { response, data } = await requestExpectSuccess('POST', '/api/staff/accounts/search', {
        accountType: 'admin',
        search: context.autoAdminStaffId,
        limit: 20,
        provisionKey: staffProvisionKey
      });

      const accounts = Array.isArray(data.data?.accounts) ? data.data.accounts : [];
      const found = accounts.some((entry) => String(entry.staffId || '').toUpperCase() === context.autoAdminStaffId.toUpperCase());
      assertCondition(found, `Generated admin account ${context.autoAdminStaffId} was not found in listing`);
      return `status=${response.status};count=${accounts.length}`;
    });

    await runStep('Auto-register investor staff account', async () => {
      assertCondition(Boolean(staffProvisionKey), 'STAFF_PROVISION_KEY or ADMIN_PASSWORD is required for staff provisioning tests');

      const { response, data } = await requestExpectSuccess('POST', '/api/staff/register', {
        fullName: 'Smoke Auto Investor',
        email: context.autoInvestorEmail,
        password: context.autoInvestorPassword,
        accountType: 'investor',
        provisionKey: staffProvisionKey
      });

      assertCondition(data.success === true, 'Auto investor registration failed');
      context.autoInvestorStaffId = data.data?.staffId || '';
      assertCondition(/^INV\d{3,}$/.test(context.autoInvestorStaffId), `Unexpected auto investor staff ID format: ${context.autoInvestorStaffId}`);
      return `status=${response.status};staffId=${context.autoInvestorStaffId}`;
    });

    await runStep('Auto-investor login with generated ID', async () => {
      const { response, data } = await requestExpectSuccess('POST', '/api/staff-login', {
        staffId: context.autoInvestorStaffId,
        password: context.autoInvestorPassword
      });

      assertCondition(data.success === true, 'Generated investor login failed');
      return `status=${response.status};dept=${data.staff?.department || 'N/A'}`;
    });

    await runStep('Submit investor interest', async () => {
      const { response, data } = await requestExpectSuccess('POST', '/api/investor-interest', {
        name: 'Smoke Investor',
        email: context.investorEmail,
        phone: '+971551234567',
        initialInvestment: 5000,
        startDate: new Date().toISOString().slice(0, 10)
      });
      assertCondition(data.success === true, 'Investor submit success flag is false');
      context.investorInquiryId = data.inquiryId || '';
      assertCondition(/^INV-\d{13}-[A-Z0-9]{6}$/.test(context.investorInquiryId), `Unexpected inquiry format: ${context.investorInquiryId}`);
      return `status=${response.status};inquiry=${context.investorInquiryId}`;
    });

    await runStep('Load investor dashboard', async () => {
      const { response, data } = await requestExpectSuccess('GET', `/api/investor-interest/${encodeURIComponent(context.investorInquiryId)}/dashboard`);
      const timelineCount = Array.isArray(data.dashboard?.timeline) ? data.dashboard.timeline.length : 0;
      assertCondition(data.success === true, 'Investor dashboard success flag is false');
      assertCondition(timelineCount >= 1, 'Investor dashboard timeline is empty');
      return `status=${response.status};timeline=${timelineCount}`;
    });

    await runStep('Submit career application', async () => {
      const { response, data } = await requestExpectSuccess('POST', '/api/career-applications', {
        fullName: 'Smoke Career User',
        email: context.careerEmail,
        phone: '+971551998877',
        roleInterest: 'Dispatch Coordinator',
        message: 'Smoke career submission',
        cvFileName: 'smoke_cv.pdf'
      });
      assertCondition(data.success === true, 'Career submit success flag is false');
      context.careerApplicationId = data.data?.applicationId || '';
      assertCondition(/^CAR-\d{13}-[A-Z0-9]{6}$/.test(context.careerApplicationId), `Unexpected career format: ${context.careerApplicationId}`);
      return `status=${response.status};application=${context.careerApplicationId}`;
    });
  } catch {
    failed = true;
  } finally {
    try {
      await cleanup();
    } catch (cleanupErr) {
      failed = true;
      console.error('❌ Cleanup error:', cleanupErr?.message || cleanupErr);
    }

    await db.closePool().catch(() => {});

    const passed = results.filter((entry) => entry.ok).length;
    const failedCount = results.filter((entry) => !entry.ok).length;
    console.log(`\n📋 Summary: ${passed} passed, ${failedCount} failed`);

    if (failed || failedCount > 0) {
      process.exitCode = 1;
    }
  }
}

main();
