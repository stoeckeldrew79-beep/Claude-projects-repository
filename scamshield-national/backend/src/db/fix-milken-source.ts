// One-off fix: the original sechistorical.org source link for Michael
// Milken's profile turned out to be a dead 404. Replace it with a UPI
// Archives wire story covering his 1990 guilty plea. Run once, then delete.
import 'dotenv/config';
import { pool } from './connection';

async function main() {
  const result = await pool.query(
    `UPDATE articles SET source_url = $1 WHERE slug = $2`,
    [
      'https://www.upi.com/Archives/1990/04/24/Milken-pleads-guilty-to-six-felony-counts/4380640929600',
      'michael-milken-junk-bond-king-fraud',
    ]
  );
  console.log(`Updated ${result.rowCount} row(s).`);
  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
