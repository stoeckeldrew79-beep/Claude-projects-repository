// One-off backfill: adds a real source-story link to the three new
// notorious profiles (Dreier, Kozlowski, Rajaratnam) added alongside
// this script. Only touches source_url on existing rows, matching by
// slug — safe to run repeatedly. Delete this file after it's been run once.
import 'dotenv/config';
import { pool } from './connection';

const SOURCES: Record<string, string> = {
  'marc-dreier-law-firm-fraud': 'https://www.npr.org/2009/07/14/106585548/lawyer-gets-20-years-in-400-million-fraud',
  'dennis-kozlowski-tyco-fraud': 'https://www.sec.gov/enforcement-litigation/litigation-releases/lr-17722',
  'raj-rajaratnam-galleon-insider-trading': 'https://www.aljazeera.com/amp/economy/2011/10/14/insider-trader-sentenced-to-11-years-in-us',
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
