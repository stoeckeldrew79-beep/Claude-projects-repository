// One-off backfill: adds a real source-story link to the three new
// notorious profiles (Kerviel, Petters, Antar) added alongside this
// script. Only touches source_url on existing rows, matching by slug —
// safe to run repeatedly. Delete this file after it's been run once.
import 'dotenv/config';
import { pool } from './connection';

const SOURCES: Record<string, string> = {
  'jerome-kerviel-societe-generale-rogue-trader': 'https://www.aljazeera.com/economy/2014/3/19/french-rogue-traders-jail-sentence-upheld',
  'tom-petters-ponzi-scheme': 'https://archives.fbi.gov/archives/minneapolis/press-releases/2010/mp040810.htm',
  'eddie-antar-crazy-eddie-stock-fraud': 'https://www.sec.gov/enforcement-litigation/litigation-releases/lr-16544',
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
