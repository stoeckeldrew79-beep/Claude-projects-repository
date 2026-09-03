// One-off fix: set Michael Milken's cover photo focal point. Top (0%)
// showed the ceiling/top of his head; center (50%) showed his mouth/chin.
// His face sits in between, roughly a quarter of the way down the frame.
// Fine-tune further from the admin panel's focus slider if still off.
import 'dotenv/config';
import { pool } from './connection';

async function main() {
  const result = await pool.query(
    `UPDATE articles SET cover_image_position = $1 WHERE slug = $2`,
    [28, 'michael-milken-junk-bond-king-fraud']
  );
  console.log(`Updated ${result.rowCount} row(s).`);
  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
