// One-off backfill: adds a real source-story link to each notorious
// profile, most pointing to the primary DOJ/FBI/SEC press release for
// that case, with a well-established outlet as fallback where no
// government press release exists (e.g. state-level or foreign cases).
// Only touches source_url on existing rows, matching by slug — safe to
// run repeatedly. Delete this file after it's been run once.
import 'dotenv/config';
import { pool } from './connection';

const SOURCES: Record<string, string> = {
  'charles-ponzi-the-original-scheme': 'https://www.smithsonianmag.com/history/in-ponzi-we-trust-64016168/',
  'bernie-madoff-largest-ponzi-scheme': 'https://archives.fbi.gov/archives/newyork/press-releases/2009/nyfo062909.htm',
  'frank-abagnale-catch-me-if-you-can-fact-check': 'https://whyy.org/segments/the-greatest-hoax-on-earth/',
  'anna-sorokin-anna-delvey-fake-heiress':
    'https://www.cbsnews.com/news/anna-sorokin-anna-delvey-convicted-fake-heiress-scammed-new-york-city/',
  'elizabeth-holmes-theranos-fraud':
    'https://www.justice.gov/usao-ndca/pr/elizabeth-holmes-sentenced-more-11-years-defrauding-theranos-investors-hundreds',
  'sam-bankman-fried-ftx-collapse': 'https://www.justice.gov/usao-sdny/pr/samuel-bankman-fried-sentenced-25-years-prison',
  'jordan-belfort-stratton-oakmont-wolf-of-wall-street': 'https://www.biography.com/business-leaders/jordan-belfort',
  'allen-stanford-stanford-financial-ponzi-scheme':
    'https://www.justice.gov/archives/opa/pr/allen-stanford-sentenced-110-years-prison-orchestrating-7-billion-investment-fraud-scheme',
  'billy-mcfarland-fyre-festival':
    'https://www.justice.gov/usao-sdny/pr/william-mcfarland-sentenced-6-years-prison-manhattan-federal-court-engaging-multiple',
  'rita-crundwell-dixon-illinois-embezzlement':
    'https://www.justice.gov/usao-ndil/pr/former-dixon-comptroller-rita-crundwell-sentenced-nearly-20-years-federal-prison-537',
  'enron-accounting-fraud-collapse':
    'https://www.justice.gov/archives/opa/pr/former-enron-ceo-jeffrey-skilling-resentenced-168-months-fraud-conspiracy-charges',
  'wirecard-jan-marsalek-fraud': 'https://www.acfe.com/fraud-magazine/all-issues/issue/article?s=2021-marapr-cover-wirecard',
  'bre-x-gold-mine-fraud': 'https://www.cbc.ca/news/business/no-criminal-charges-in-bre-x-scandal-1.174425',
  'nirav-modi-punjab-national-bank-fraud':
    'https://www.deccanherald.com/india/uk-judge-notes-confidential-impediment-in-nirav-modi-extradition-case-3546182',
  'lou-pearlman-boy-band-ponzi-scheme': 'https://www.hollywoodreporter.com/news/general-news/lou-pearlman-ordered-repay-300-115786/',
  'marcus-schrenker-faked-plane-crash-fraud': 'https://www.ibj.com/articles/22752-schrenker-sentenced-to-10-years-for-securities-fraud',
  'ruja-ignatova-onecoin-cryptoqueen-fraud': 'https://www.fbi.gov/news/stories/ruja-ignatova-added-to-fbis-ten-most-wanted-fugitives-list',
  'michael-milken-junk-bond-king-fraud': 'https://www.sechistorical.org/museum/galleries/wwr/wwr05d-markets-milken.php',
  'sam-israel-bayou-hedge-fund-fraud': 'https://archives.fbi.gov/archives/newyork/press-releases/2009/nyfo071509.htm',
};

async function main() {
  let updated = 0;
  for (const [slug, url] of Object.entries(SOURCES)) {
    const { rowCount } = await pool.query('UPDATE articles SET source_url = $1 WHERE slug = $2', [url, slug]);
    if (rowCount) updated += rowCount;
    else console.log(`  no match for slug: ${slug}`);
  }
  console.log(`Updated source_url on ${updated} of ${Object.keys(SOURCES).length} notorious profiles.`);
  await pool.end();
}

main();
