// One-off fix: `npm run seed` upserts every scam currently listed in
// seed.ts, but it has no step that deletes a row whose slug was later
// removed from that list. When 8 duplicate scam entries were cut from
// SEED_SCAMS (each one describing the same scam as another, already-
// existing entry, just under a different name/slug), the corresponding
// rows were only deleted directly from the database used to verify that
// change — any other already-seeded database (including a long-running
// local dev database) still carries these 8 orphaned rows, since a plain
// reseed can never remove them on its own. This directly deletes them.
import 'dotenv/config';
import { pool } from './connection';

const ORPHANED_DUPLICATE_SLUGS = [
  'fake-delivery-platform-support-line-scam',
  'fake-ssa-suspension-call',
  'fake-unpaid-toll-text',
  'fake-ssa-benefit-increase-verification',
  'fake-international-customs-fee-text',
  'free-genetic-testing-kit-scam',
  'overseas-contractor-project-romance-scam',
  'fake-ssa-cola-benefit-increase-scam',
];

async function main() {
  const result = await pool.query(`DELETE FROM scams WHERE slug = ANY($1)`, [ORPHANED_DUPLICATE_SLUGS]);
  console.log(`Deleted ${result.rowCount} orphaned duplicate row(s).`);
  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
