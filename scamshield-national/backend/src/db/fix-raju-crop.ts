// One-off fix: Ramalinga Raju's cover photo focal point. The row was
// created (with no cover image yet) before this photo was found, so its
// cover_image_position was already written as the 50 default — the seed
// script's COALESCE-based upsert protects existing values and won't
// overwrite it just because seed.ts now specifies 30. The photo is a
// tall WEF conference shot (2731x4096), so center (50%) would likely cut
// through the torso rather than the face; forcing it down to 30 instead.
import 'dotenv/config';
import { pool } from './connection';

async function main() {
  const result = await pool.query(
    `UPDATE articles SET cover_image_position = $1 WHERE slug = $2`,
    [30, 'ramalinga-raju-satyam-fraud']
  );
  console.log(`Updated ${result.rowCount} row(s).`);
  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
