// One-off fix: Angelo Mozilo's cover photo focal point. Center (50%)
// showed mostly forehead/hair with his eyes barely at the bottom edge of
// the crop — the source photo has more headroom above him than a typical
// tight headshot. Shifting down should reveal more of his actual face.
// Fine-tune further from the admin panel's focus slider if still off.
import 'dotenv/config';
import { pool } from './connection';

async function main() {
  const result = await pool.query(
    `UPDATE articles SET cover_image_position = $1 WHERE slug = $2`,
    [65, 'angelo-mozilo-countrywide-financial-fraud']
  );
  console.log(`Updated ${result.rowCount} row(s).`);
  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
