#!/usr/bin/env node
import 'dotenv/config';
import nodemailer from 'nodemailer';

function getEnv(name) {
  const value = process.env[name];
  return typeof value === 'string' ? value.trim() : '';
}

const requiredKeys = ['EMAIL_HOST', 'EMAIL_PORT', 'EMAIL_USER', 'EMAIL_PASS'];
const missingKeys = requiredKeys.filter((key) => !getEnv(key));

if (missingKeys.length > 0) {
  console.error(`[SMTP Check] Missing required env keys: ${missingKeys.join(', ')}`);
  process.exit(1);
}

const smtpPort = Number(getEnv('EMAIL_PORT'));
if (!Number.isFinite(smtpPort) || smtpPort <= 0) {
  console.error('[SMTP Check] EMAIL_PORT must be a valid number.');
  process.exit(1);
}

const secureEnv = getEnv('EMAIL_SECURE').toLowerCase();
const isSecureFromEnv = secureEnv === '1' || secureEnv === 'true' || secureEnv === 'yes';
const smtpSecure = isSecureFromEnv || smtpPort === 465;

const transporter = nodemailer.createTransport({
  host: getEnv('EMAIL_HOST'),
  port: smtpPort,
  secure: smtpSecure,
  auth: {
    user: getEnv('EMAIL_USER'),
    pass: getEnv('EMAIL_PASS')
  }
});

try {
  await transporter.verify();
  console.log('[SMTP Check] ✅ Connection and authentication successful.');
  console.log(`[SMTP Check] Host=${getEnv('EMAIL_HOST')} Port=${smtpPort} Secure=${smtpSecure}`);
  process.exit(0);
} catch (err) {
  const message = err && err.message ? err.message : String(err);
  console.error('[SMTP Check] ❌ Verification failed.');
  console.error(`[SMTP Check] ${message}`);

  if (message.includes('Invalid login') || message.includes('535')) {
    console.error('[SMTP Check] Hint: verify EMAIL_USER/EMAIL_PASS and use an app password if MFA is enabled.');
  }
  if (message.includes('timed out') || message.includes('ECONNREFUSED')) {
    console.error('[SMTP Check] Hint: verify EMAIL_HOST/EMAIL_PORT and check firewall/network restrictions.');
  }
  if (message.includes('certificate')) {
    console.error('[SMTP Check] Hint: confirm EMAIL_SECURE matches the port (465=true, 587=false).');
  }

  process.exit(1);
}
