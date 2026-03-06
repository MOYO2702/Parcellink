#!/usr/bin/env node
import 'dotenv/config';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import * as db from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function initSchema() {
  try {
    const schemaPath = path.join(__dirname, 'schema.sql');
    const sql = await fs.readFile(schemaPath, 'utf8');

    if (!sql.trim()) {
      throw new Error('schema.sql is empty');
    }

    const health = await db.testConnection();
    if (!health.success) {
      throw new Error(`Database connection failed: ${health.error}`);
    }

    await db.query(sql);
    console.log('[DB Init] ✓ Schema initialized successfully.');
  } catch (err) {
    console.error('[DB Init] ✗', err.message);
    process.exitCode = 1;
  } finally {
    await db.closePool().catch(() => {});
  }
}

initSchema();
