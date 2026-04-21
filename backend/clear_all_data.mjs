#!/usr/bin/env node
/**
 * Clear all demo/test data from PostgreSQL database
 * Keeps schema intact, removes all user data, parcels, receipts, etc.
 */
import 'dotenv/config';
import * as db from './db.js';

async function clearAllData() {
  try {
    console.log('[Data Clear] Starting database cleanup...');
    
    // Clear tables in order of dependencies (respect foreign keys)
    const tables = [
      'password_reset_tokens',
      'parcel_status_history',
      'receipts',
      'parcels',
      'career_applications',
      'investor_interest_submissions',
      'partners',
      'staff_accounts',
      'users'
    ];

    for (const table of tables) {
      try {
        await db.query(`TRUNCATE TABLE ${table} CASCADE;`);
        console.log(`[Data Clear] ✓ Cleared ${table}`);
      } catch (err) {
        // Table might not exist, continue
        console.log(`[Data Clear] ⊘ ${table} not found (skipped)`);
      }
    }

    console.log('[Data Clear] ✓ All data cleared successfully!');
    console.log('[Data Clear] ✓ Schema remains intact.');
    console.log('[Data Clear] Ready for fresh start - users must register new accounts.');
  } catch (err) {
    console.error('[Data Clear] ✗ Error:', err.message);
    process.exitCode = 1;
  } finally {
    await db.closePool().catch(() => {});
  }
}

clearAllData();
