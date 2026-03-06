#!/usr/bin/env node
/**
 * Migration script: JSON → PostgreSQL
 * Usage: node backend/migrate_to_pg.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as db from './db.js';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// File paths
const userFile = path.join(__dirname, 'users.json');
const parcelFile = path.join(__dirname, 'parcels.json');
const receiptFile = path.join(__dirname, 'receipts.json');
const partnerFile = path.join(__dirname, 'partners.json');

// Helper: safely read JSON
function readJson(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      return [];
    }
    const data = fs.readFileSync(filePath, 'utf-8');
    return data.trim() ? JSON.parse(data) : [];
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err.message);
    return [];
  }
}

// Migrate all data
async function migrate() {
  console.log('[Migration] Starting JSON → PostgreSQL migration...\n');

  const health = await db.testConnection();
  if (!health.success) {
    console.error('[Migration] ❌ Database connection failed:', health.error);
    process.exit(1);
  }
  console.log('[Migration] ✓ Database connected');

  try {
    // 1. Migrate users
    console.log('\n[Users] Reading from users.json...');
    const users = readJson(userFile);
    let userCount = 0;

    for (const user of users) {
      try {
        const existing = await db.getUserByEmail(user.email);
        if (!existing) {
          await db.createUser(
            user.fullName,
            user.email,
            user.suiteNumber,
            user.passwordHash
          );
          userCount++;
        } else {
          console.log(`  ⊘ User ${user.email} already exists, skipping`);
        }
      } catch (err) {
        console.error(`  ✗ Error migrating user ${user.email}:`, err.message);
      }
    }
    console.log(`[Users] ✓ Migrated ${userCount}/${users.length} users`);

    // 2. Migrate parcels (with status history)
    console.log('\n[Parcels] Reading from parcels.json...');
    const parcels = readJson(parcelFile);
    let parcelCount = 0;
    const systemUserEmail = process.env.SYSTEM_USER_EMAIL || 'system@parcellink.local';
    let systemUser = null;

    for (const parcel of parcels) {
      try {
        const existing = await db.getParcelByTrackingCode(parcel.trackingCode);
        if (!existing) {
          const parcelUserEmail = parcel.userEmail || parcel.senderEmail || '';
          let user = parcelUserEmail ? await db.getUserByEmail(parcelUserEmail) : null;

          if (!user) {
            if (!systemUser) {
              systemUser = await db.getUserByEmail(systemUserEmail);
            }
            if (!systemUser) {
              const systemSuite = 'PLSYS001';
              const systemPasswordHash = '$2a$10$1bNIWxl2I8u2LmjzJ5J9iOjN0U4Vb4Nle.rgHj2JgQm7p8v4rYp9a';
              systemUser = await db.createUser(
                'ParcelLink System',
                systemUserEmail,
                systemSuite,
                systemPasswordHash
              );
              console.log(`  ✓ Created system user ${systemUserEmail} for orphan parcels`);
            }
            user = systemUser;
          }

          const newParcel = await db.createParcel({
            trackingCode: parcel.trackingCode,
            userId: user.user_id,
            senderName: parcel.senderName,
            senderEmail: parcel.senderEmail,
            senderPhone: parcel.senderPhone,
            receiverName: parcel.receiverName,
            receiverEmail: parcel.receiverEmail,
            receiverPhone: parcel.receiverPhone,
            senderLocation: parcel.from || parcel.senderLocation,
            receiverLocation: parcel.to || parcel.receiverLocation,
            packageType: parcel.packageType,
            weight: parcel.dimensions?.weight,
            length: parcel.dimensions?.length,
            width: parcel.dimensions?.width,
            height: parcel.dimensions?.height,
            baseCost: parcel.pricing?.baseCost,
            discountPercentage: parcel.pricing?.discountPercentage || 0,
            finalCost: parcel.pricing?.finalCost,
            notes: parcel.notes
          });

          // Add status history
          if (parcel.statusHistory && Array.isArray(parcel.statusHistory)) {
            for (const status of parcel.statusHistory) {
              await db.addStatusHistory(
                newParcel.id,
                status.status,
                status.location,
                status.remark
              );
            }
          }

          parcelCount++;
        } else {
          console.log(`  ⊘ Parcel ${parcel.trackingCode} already exists, skipping`);
        }
      } catch (err) {
        console.error(`  ✗ Error migrating parcel ${parcel.trackingCode}:`, err.message);
      }
    }
    console.log(`[Parcels] ✓ Migrated ${parcelCount}/${parcels.length} parcels`);

    // 3. Migrate receipts
    console.log('\n[Receipts] Reading from receipts.json...');
    const receipts = readJson(receiptFile);
    let receiptCount = 0;

    for (const receipt of receipts) {
      try {
        const existing = await db.getReceiptByNumber(receipt.receiptNumber);
        if (!existing) {
          const parcel = await db.getParcelByTrackingCode(receipt.trackingCode);
          if (!parcel) {
            console.log(`  ⊘ Receipt ${receipt.receiptNumber}: parcel not found, skipping`);
            continue;
          }

          await db.createReceipt({
            receiptNumber: receipt.receiptNumber,
            parcelId: parcel.id,
            userEmail: receipt.userEmail,
            amount: receipt.amount,
            paymentMethod: receipt.paymentMethod
          });
          receiptCount++;
        } else {
          console.log(`  ⊘ Receipt ${receipt.receiptNumber} already exists, skipping`);
        }
      } catch (err) {
        console.error(`  ✗ Error migrating receipt ${receipt.receiptNumber}:`, err.message);
      }
    }
    console.log(`[Receipts] ✓ Migrated ${receiptCount}/${receipts.length} receipts`);

    // 4. Migrate partners (optional)
    console.log('\n[Partners] Reading from partners.json...');
    const partners = readJson(partnerFile);
    let partnerCount = 0;

    for (const partner of partners) {
      try {
        const existing = await db.getPartnerById(partner.id || partner.partner_id);
        if (!existing) {
          const partnerId = partner.id || partner.partner_id || `PRT-${Date.now()}`;
          const res = await db.query(
            `INSERT INTO partners (partner_id, name, contact_email, contact_phone, location, service_type, is_active)
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [
              partnerId,
              partner.name,
              partner.contact_email,
              partner.contact_phone,
              partner.location,
              partner.service_type,
              partner.is_active !== false
            ]
          );
          partnerCount++;
        } else {
          console.log(`  ⊘ Partner ${partner.id || partner.partner_id} already exists, skipping`);
        }
      } catch (err) {
        console.error(`  ✗ Error migrating partner ${partner.name}:`, err.message);
      }
    }
    console.log(`[Partners] ✓ Migrated ${partnerCount}/${partners.length} partners`);

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('[Migration] ✓ Migration completed successfully!');
    console.log(`  Users:    ${userCount}/${users.length}`);
    console.log(`  Parcels:  ${parcelCount}/${parcels.length}`);
    console.log(`  Receipts: ${receiptCount}/${receipts.length}`);
    console.log(`  Partners: ${partnerCount}/${partners.length}`);
    console.log('='.repeat(60));

  } catch (err) {
    console.error('[Migration] ✗ Fatal error:', err.message);
    process.exit(1);
  } finally {
    await db.closePool();
  }
}

// Run migration
migrate();
