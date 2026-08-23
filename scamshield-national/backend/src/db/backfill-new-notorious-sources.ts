// One-off backfill: adds a real source-story link to the three new
// notorious profiles (Ebbers, Keating, Leeson) added alongside this
// script. Only touches source_url on existing rows, matching by slug —
// safe to run repeatedly. Delete this file after it's been run once.
import 'dotenv/config';
import { pool } from './connection';

const SOURCES: Record<string, string> = {
  'bernard-ebbers-worldcom-accounting-fraud': 'https://www.justice.gov/usao-sdny/united-states-v-bernard-ebbers',
  'charles-keating-lincoln-savings-fraud': 'https://www.upi.com/Archives/1999/04/06/Charles-Keating-pleads-guilty/5571923371200/',
  'nick-leeson-barings-bank-collapse': 'https://www.britannica.com/event/bankruptcy-of-Barings-Bank',
};

async function main() {
  for (const [slug, url] of Object.entries(SOURCES)) {
    const result = await pool.query(`UPDATE articles SET source_url = $1 WHERE slug = $2`, [url, slug]);
    console.log(`${slug}: ${result.rowCount} row(s) updated`);
  }
  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
