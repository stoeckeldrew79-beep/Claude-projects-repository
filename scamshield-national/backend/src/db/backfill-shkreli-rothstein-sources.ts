// One-off backfill: adds a real source-story link to the two new
// notorious profiles (Shkreli, Rothstein) added alongside this script.
// Only touches source_url on existing rows, matching by slug — safe to
// run repeatedly. Delete this file after it's been run once.
import 'dotenv/config';
import { pool } from './connection';

const SOURCES: Record<string, string> = {
  'martin-shkreli-securities-fraud':
    'https://www.justice.gov/usao-edny/pr/martin-shkreli-sentenced-seven-years-imprisonment-multi-million-dollar-fraud-scheme',
  'scott-rothstein-rosenfeldt-adler-ponzi-scheme': 'https://archives.fbi.gov/archives/miami/press-releases/2010/mm060910.htm',
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
