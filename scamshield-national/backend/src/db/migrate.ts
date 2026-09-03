import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { pool } from './connection';

const MIGRATIONS_DIR = path.join(__dirname, 'migrations');
const MIGRATIONS_TABLE = 'schema_migrations';

async function ensureMigrationsTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS ${MIGRATIONS_TABLE} (
      filename VARCHAR(255) PRIMARY KEY,
      applied_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
}

async function appliedMigrations(): Promise<Set<string>> {
  const { rows } = await pool.query(`SELECT filename FROM ${MIGRATIONS_TABLE}`);
  return new Set(rows.map((r) => r.filename));
}

async function run() {
  await ensureMigrationsTable();
  const applied = await appliedMigrations();

  const files = fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith('.sql'))
    .sort();

  for (const file of files) {
    if (applied.has(file)) {
      console.log(`skip  ${file} (already applied)`);
      continue;
    }
    const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), 'utf8');
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query(sql);
      await client.query(`INSERT INTO ${MIGRATIONS_TABLE} (filename) VALUES ($1)`, [file]);
      await client.query('COMMIT');
      console.log(`apply ${file}`);
    } catch (err) {
      await client.query('ROLLBACK');
      console.error(`failed ${file}`);
      throw err;
    } finally {
      client.release();
    }
  }

  await pool.end();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
