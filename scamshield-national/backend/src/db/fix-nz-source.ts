// One-off fix: CERT NZ was fully merged into the NCSC and its brand
// retired. Renaming the existing global_sources row in place (rather
// than re-seeding) so it keeps its id and any stats already attached
// to it. Safe to delete this file after running it once.
import 'dotenv/config';
import { pool } from './connection';

async function main() {
  const { rowCount } = await pool.query(
    `UPDATE global_sources
     SET agency_name = 'National Cyber Security Centre (NCSC) — formerly CERT NZ',
         url = 'https://www.ncsc.govt.nz/insights-and-research/insights-reports/',
         description = 'New Zealand''s government cyber security response agency. CERT NZ was fully merged into the NCSC and its standalone brand retired; the combined agency publishes quarterly "Cyber Security Insights" reports covering reported scam, phishing, and fraud activity. Scam reports for the public also route through the non-profit Netsafe.'
     WHERE country = 'NZ' AND agency_name = 'CERT NZ (National Cyber Security Centre)'`
  );
  console.log(rowCount ? 'Updated NZ source name.' : 'No matching row found — it may already be renamed.');
  await pool.end();
}

main();
