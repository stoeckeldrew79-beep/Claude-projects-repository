// Seed data — separate from migrations, which stay schema-only. Content
// here is idempotent (ON CONFLICT DO NOTHING on slug) so re-running is
// safe. Run with `npm run seed`.
//
// "Notorious" articles are factual, publicly documented historical
// cases (criminal convictions, court/SEC records, decades of reporting)
// — the same kind of coverage the FTC, Wikipedia, and financial press
// publish. Where a subject's public account is itself disputed
// (Abagnale), that dispute is part of the story, not omitted.
//
// The records themselves live in ./seed-data/, one module per array. They
// were split out when this file reached 6.9MB — past the point any model or
// editor can load it whole, and with six scheduled content routines all
// appending to the same file. This file is now only the seeding logic; to
// add records, edit the module for that array.
import 'dotenv/config';
import { pool } from './connection';
import { SeedArticle } from './seed-data/types';
import { NOTORIOUS_ARTICLES } from './seed-data/notorious';
import { GUIDE_ARTICLES } from './seed-data/guides';
import { SEED_CATEGORIES } from './seed-data/categories';
import { SEED_SCAMS } from './seed-data/scams';
import { SCAM_TAGS } from './seed-data/scam-tags';
import { SEED_GLOBAL_SOURCES } from './seed-data/global-sources';
import { SEED_STATE_AG_SOURCES } from './seed-data/state-ag-sources';

GUIDE_ARTICLES.push(
  {
    title: `The Qantas Data Breach: How a Vished Call Center Login Exposed 5.7 Million Travelers' Frequent Flyer Details`,
    slug: 'qantas-2025-data-breach-guide',
    author: 'ScamShield Editorial',
    tags: ['guide', 'qantas-2025-breach'],
    sourceUrl: 'https://www.cybersecuritydive.com/news/qantas-cyberattack-57-million-customers/752571/',
    coverImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/Airbus_A380-842,_Qantas_AN1693643.jpg?width=1200',
    coverImageCredit: 'Photo: Konstantin von Wedelstaedt, GFDL, via Wikimedia Commons — a Qantas Airbus A380',
    coverImagePosition: 55,
    // representative photo — replace with an exact match if found
    body: `You don't have to fly Qantas often, or even remember signing up for its Frequent Flyer program years ago, to have been caught up in one of 2025's largest airline data breaches. On June 30, 2025, Qantas detected unusual activity on a third-party platform used by one of its call centers and shut off access within minutes — but by then, attackers had already copied a database holding customer records. When the airline finished its investigation, the number was stark: 5.7 million unique customers had some personal information exposed, making it one of the largest breaches ever disclosed by an Australian company.

The break-in didn't involve a hacked password or a software flaw in Qantas's own booking system. Investigators say the attackers, linked to the loosely organized cybercrime network known as Scattered Spider, targeted a call center Qantas used in Manila and used an AI-assisted voice impersonation to pose as a Qantas employee, talking a real staff member into granting access to the customer platform — the same "vishing," or voice-phishing, playbook that hit MGM Resorts, Caesars Entertainment, and several U.S. insurers in the two years before Qantas was hit. Roughly four million customers had only their name, email address, and Frequent Flyer number exposed; a smaller group of about 1.7 million had more taken, including home address, date of birth, phone number, gender, and even meal preferences. Qantas has said credit card numbers, passwords, PINs, and passport details were not part of the stolen database. After Qantas declined to pay a ransom, the stolen data was ultimately published on the dark web that October, and Australia's federal police opened an active criminal investigation while a proposed class action, brought by law firm Maurice Blackburn on behalf of affected customers, moved forward in the months that followed.

Even without a stolen password or card number, this kind of leak is genuinely useful to a scammer. A file that already contains your real name, email, phone number, and Frequent Flyer number lets a fraudster build a phishing email or text that looks like it's really coming from Qantas — referencing your actual account or a "problem with your points balance" to get you to click a link or hand over login credentials that unlock other accounts.

If you've ever held a Qantas Frequent Flyer account, treat any unexpected email, text, or call referencing your Qantas account, points balance, or travel history with suspicion, and never click a link in one — log into your account directly through the airline's own app or website instead. Change your Frequent Flyer password and enable multi-factor authentication if you haven't already, and reuse that same password nowhere else, since a criminal who already has your email address and a stolen password from an unrelated breach can often just try the same combination on your travel accounts. Watch for phishing attempts that reference specific personal details from the breach, such as your travel history or meal preference, since that level of accuracy is designed to make a scam message feel legitimate. Qantas has offered affected customers a dedicated support line with identity-protection guidance; anyone concerned about identity theft more broadly can check whether their information has surfaced elsewhere using a reputable breach-lookup service such as Have I Been Pwned, and can report suspected fraud or phishing to the FTC at ReportFraud.ftc.gov.`,
  },
  {
    title: `The Episource Breach: How a Vendor Millions of Patients Never Knew About Exposed Their Medical Records`,
    slug: 'episource-2025-data-breach-guide',
    author: 'ScamShield Editorial',
    tags: ['guide', 'episource-2025-breach'],
    sourceUrl: 'https://www.cybersecuritydive.com/news/episource-healthcare-data-breach-impacts-5-4-million/751960/',
    coverImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/Optum_Headquarters,_Eden_Prairie,_MN_(49120017041).jpg?width=1200',
    coverImageCredit: 'Photo: Chad Davis, CC BY 2.0, via Wikimedia Commons — Optum headquarters in Eden Prairie, Minnesota; Episource is an Optum subsidiary',
    coverImagePosition: 50,
    // representative photo — replace with an exact match if found
    body: `Most patients have never heard of Episource, and that's exactly the point of what it does: the company processes medical coding and "risk adjustment" data behind the scenes for health insurance plans and provider groups, meaning your name, diagnoses, and insurance details can pass through its systems without you ever choosing to give Episource anything directly. That invisibility became a serious problem in 2025, when Episource — a subsidiary of Optum, itself part of UnitedHealth Group — disclosed that hackers had broken into its network and stolen records on more than 5.4 million people, later revised upward to roughly 6.7 million, making it one of the largest healthcare data breaches reported that year.

Episource says an intruder accessed its systems between January 27 and February 6, 2025, copying files before the company detected and shut down the activity. The company didn't finish notifying affected individuals until late April, and the breach wasn't formally logged with federal health regulators until June. What was taken varied person to person but could include full names, addresses, phone numbers, dates of birth, Social Security numbers, and detailed health information — insurance plan details, medical record numbers, diagnosis and treatment codes, and Medicare or Medicaid ID numbers. That combination is a near-complete kit for identity theft and medical fraud, since it pairs a Social Security number with enough real medical history to make a fraudulent insurance claim look legitimate. The breach prompted a class-action lawsuit and a letter from U.S. senators demanding answers from UnitedHealth Group, coming less than a year after the company's Change Healthcare subsidiary suffered a separate, even larger ransomware attack that disrupted pharmacy and billing systems nationwide.

The uncomfortable lesson for consumers is that you can do everything right with your own accounts and passwords and still end up exposed, because the breach happened at a data-processing vendor working behind your insurer or doctor's office, not at a company you ever chose to do business with directly. There's no way to know in advance which back-office vendors handle your health data, which is exactly why the response has to focus on watching for the fallout rather than trying to prevent the vendor breach itself.

If you receive a notification letter mentioning Episource — even if you don't recognize the name — read it carefully to see what specific information of yours was involved, and enroll in any free credit monitoring or identity-protection service being offered. Because Social Security numbers were exposed for many victims, place a free credit freeze with all three major bureaus — Equifax, Experian, and TransUnion — regardless of whether a notice ever arrives, since medical-data breaches at obscure vendors are notorious for incomplete or delayed notification. Review your insurance explanation-of-benefits statements for any medical claims or services you don't recognize, since stolen health-insurance and coding data can be used to file fraudulent claims in your name. Watch for phishing emails or calls that reference the breach or claim to offer "compensation," since scammers routinely exploit real breach headlines to run fake follow-up scams. Anyone who suspects identity theft can report it at IdentityTheft.gov, and phishing attempts referencing this breach can be reported to the FTC at ReportFraud.ftc.gov.`,
  },
);

async function seedArticles(articles: SeedArticle[], label: string) {
  for (const article of articles) {
    await pool.query(
      `INSERT INTO articles (title, slug, body, author, tags, source_url, cover_image, cover_image_credit, cover_image_position, published, published_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, true, NOW())
       ON CONFLICT (slug) DO UPDATE SET
         source_url = COALESCE(EXCLUDED.source_url, articles.source_url),
         -- A manually curated photo (set via the Admin panel) is locked
         -- and must survive reseeding — see migration 019. Only an
         -- unlocked row takes seed.ts's photo fields.
         cover_image = CASE WHEN articles.cover_image_locked THEN articles.cover_image
                             ELSE COALESCE(EXCLUDED.cover_image, articles.cover_image) END,
         cover_image_credit = CASE WHEN articles.cover_image_locked THEN articles.cover_image_credit
                                    ELSE COALESCE(EXCLUDED.cover_image_credit, articles.cover_image_credit) END,
         cover_image_position = CASE WHEN articles.cover_image_locked THEN articles.cover_image_position
                                      ELSE COALESCE(EXCLUDED.cover_image_position, articles.cover_image_position) END`,
      [
        article.title,
        article.slug,
        article.body,
        article.author,
        article.tags,
        article.sourceUrl ?? null,
        article.coverImage ?? null,
        article.coverImageCredit ?? null,
        article.coverImagePosition ?? 50,
      ]
    );
  }
  console.log(`seed: upserted ${articles.length} ${label} articles`);
}

async function seedCategoriesAndScams() {
  for (const category of SEED_CATEGORIES) {
    await pool.query(
      `INSERT INTO categories (name, slug, description)
       VALUES ($1, $2, $3)
       ON CONFLICT (slug) DO NOTHING`,
      [category.name, category.slug, category.description]
    );
  }
  console.log(`seed: upserted ${SEED_CATEGORIES.length} categories`);

  let locationsUpserted = 0;
  for (const scam of SEED_SCAMS) {
    const { rows } = await pool.query(
      `INSERT INTO scams (name, slug, description, category_id, alert_level, is_active, sources, source_url, country, is_historical, first_recorded, tags)
       VALUES ($1, $2, $3, (SELECT id FROM categories WHERE slug = $4), $5, true, $6, $7, $8, $9, $10, $11)
       ON CONFLICT (slug) DO UPDATE SET
         name = EXCLUDED.name,
         description = EXCLUDED.description,
         category_id = EXCLUDED.category_id,
         alert_level = EXCLUDED.alert_level,
         sources = EXCLUDED.sources,
         source_url = EXCLUDED.source_url,
         country = EXCLUDED.country,
         is_historical = EXCLUDED.is_historical,
         first_recorded = EXCLUDED.first_recorded,
         tags = EXCLUDED.tags,
         updated_at = NOW()
       RETURNING id`,
      [
        scam.name,
        scam.slug,
        scam.description,
        scam.categorySlug,
        scam.alertLevel ?? null,
        scam.sources,
        scam.sourceUrl ?? null,
        scam.country ?? 'US',
        scam.isHistorical ?? false,
        scam.firstRecorded ?? null,
        SCAM_TAGS[scam.slug] ?? null,
      ]
    );

    if (scam.state) {
      await pool.query(
        `INSERT INTO scam_locations (scam_id, state)
         VALUES ($1, $2)
         ON CONFLICT (scam_id) DO UPDATE SET state = EXCLUDED.state, updated_at = NOW()`,
        [rows[0].id, scam.state]
      );
      locationsUpserted++;
    }
  }
  console.log(`seed: upserted ${SEED_SCAMS.length} scams (${locationsUpserted} with a state location)`);
}

async function seedGlobalSources() {
  for (const source of SEED_GLOBAL_SOURCES) {
    await pool.query(
      `INSERT INTO global_sources (agency_name, country, country_name, url, description, data_type)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (agency_name, country) DO NOTHING`,
      [source.agency_name, source.country, source.country_name, source.url, source.description, source.data_type]
    );
  }
  console.log(`seed: upserted ${SEED_GLOBAL_SOURCES.length} global sources`);
}

async function seedStateAgSources() {
  for (const source of SEED_STATE_AG_SOURCES) {
    await pool.query(
      `INSERT INTO state_ag_sources (state, state_name, agency_name, consumer_protection_url, reports_url, has_published_reports, description)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (state) DO UPDATE SET
         state_name = EXCLUDED.state_name,
         agency_name = EXCLUDED.agency_name,
         consumer_protection_url = EXCLUDED.consumer_protection_url,
         reports_url = EXCLUDED.reports_url,
         has_published_reports = EXCLUDED.has_published_reports,
         description = EXCLUDED.description,
         updated_at = NOW()`,
      [
        source.state,
        source.state_name,
        source.agency_name,
        source.consumer_protection_url,
        source.reports_url ?? null,
        source.has_published_reports,
        source.description,
      ]
    );
  }
  console.log(`seed: upserted ${SEED_STATE_AG_SOURCES.length} state AG sources`);
}

async function main() {
  await seedArticles(NOTORIOUS_ARTICLES, 'notorious');
  await seedArticles(GUIDE_ARTICLES, 'guide');
  await seedCategoriesAndScams();
  await seedGlobalSources();
  await seedStateAgSources();
  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
