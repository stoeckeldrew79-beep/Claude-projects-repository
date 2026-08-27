// One-off fix: the Marc Rich Notorious profile's source_url was a dead
// money.cnn.com link (CNN retired that legacy domain). The seed script's
// COALESCE-based upsert protects existing non-null values, so a plain
// `npm run seed` won't propagate the corrected URL to an already-seeded
// database — this directly updates the row instead.
import 'dotenv/config';
import { pool } from './connection';

async function main() {
  const result = await pool.query(
    `UPDATE articles SET source_url = $1 WHERE slug = $2`,
    ['https://www.cbsnews.com/news/pardoned-financier-marc-rich-dead-at-78/', 'marc-rich-fugitive-oil-trader-pardon']
  );
  console.log(`Updated ${result.rowCount} row(s).`);
  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
