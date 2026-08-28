// Seed data — separate from migrations, which stay schema-only. Content
// here is idempotent (ON CONFLICT DO NOTHING on slug) so re-running is
// safe. Run with `npm run seed`.
//
// "Notorious" articles are factual, publicly documented historical
// cases (criminal convictions, court/SEC records, decades of reporting)
// — the same kind of coverage the FTC, Wikipedia, and financial press
// publish. Where a subject's public account is itself disputed
// (Abagnale), that dispute is part of the story, not omitted.
import 'dotenv/config';
import { pool } from './connection';

interface SeedArticle {
  title: string;
  slug: string;
  author: string;
  tags: string[];
  body: string;
  // A real news/court/agency link, used as the "Read the full story" link
  // on profiles that have no rights-cleared photo — optional since photo
  // hunting happens separately (see NotoriousCoverPhotos in Admin.tsx).
  sourceUrl?: string;
  // A verified, rights-cleared (public domain or Creative Commons) photo.
  // Only set these once the license has actually been confirmed by
  // fetching the source page directly — never on an unverified guess.
  coverImage?: string;
  coverImageCredit?: string;
  // Vertical focal point, 0-100 (0 = top, 100 = bottom, 50 = center).
  // Defaults to 50 when coverImage is set without one.
  coverImagePosition?: number;
}

const NOTORIOUS_ARTICLES: SeedArticle[] = [
  {
    title: 'Charles Ponzi: The Man Who Gave Fraud Its Name',
    slug: 'charles-ponzi-the-original-scheme',
    author: 'ScamShield Editorial',
    tags: ['notorious', 'notorious-scammer', 'historical'],
    coverImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/Charles_Ponzi_mug_shot.jpg',
    coverImagePosition: 50,
    body: `In 1920, a Boston businessman named Charles Ponzi promised investors he could double their money in 90 days. His pitch had a real financial instrument behind it: international postal reply coupons, which could in theory be bought cheaply in one country and redeemed for stamps worth more in another. The arbitrage was real. The scale Ponzi claimed to be running it at was not.

Ponzi's company, the Securities Exchange Company, took in roughly $250,000 a day at its peak — the equivalent of millions today. Early investors were paid extravagant returns, not from postal-coupon profits, but from the cash brought in by new investors. Word spread, lines formed outside his Boston office, and for a few months Charles Ponzi was one of the most talked-about men in America.

The scheme required an ever-growing stream of new money to pay off earlier investors, and it collapsed the moment that stream slowed. A Boston Post investigation in the summer of 1920 found there weren't nearly enough postal reply coupons in circulation worldwide to support Ponzi's claimed returns. He was arrested that August, pled guilty to mail fraud, and served time in both state and federal prison. He was later deported to Italy and died in poverty in Rio de Janeiro in 1949.

Ponzi didn't invent the pay-earlier-investors-with-later-investors' -money structure — versions of it predate him by decades — but his scheme was so large and so public that his name became the permanent label for it. Every "Ponzi scheme" since, including Bernie Madoff's, is named after him.`,
    sourceUrl: 'https://www.smithsonianmag.com/history/in-ponzi-we-trust-64016168/',
  },
  {
    title: 'Bernie Madoff and the $65 Billion Lie',
    slug: 'bernie-madoff-largest-ponzi-scheme',
    author: 'ScamShield Editorial',
    tags: ['notorious', 'notorious-scammer', 'historical'],
    coverImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/Bernard_Madoff_2009_mug_shot_(3x4_cropped).jpg',
    coverImagePosition: 50,
    body: `Bernard Madoff spent decades as a respected figure on Wall Street — a former chairman of the NASDAQ stock exchange — running an investment advisory business that quietly became the largest Ponzi scheme in history. For at least 17 years, and likely longer, Madoff paid "returns" to investors using money from new investors, while producing no real trading activity behind the numbers on their statements.

What made Madoff's fraud unusual wasn't dramatic promises of overnight riches — his reported returns were steady and unspectacular, often around 10-12% a year, which was precisely what made them look credible. Feeder funds funneled money to him from pension funds, charities, universities, and wealthy individuals who trusted his reputation and his consistency. Financial analyst Harry Markopolos spent nearly a decade trying to warn the SEC that Madoff's numbers were mathematically impossible to achieve legitimately. He was largely ignored.

The scheme finally collapsed in December 2008, when the financial crisis drove a wave of investors to request withdrawals Madoff could no longer cover. He confessed to his sons that the business was "one big lie," and one of them reported him to federal authorities the next day. Madoff pled guilty in March 2009 to 11 felony counts and was sentenced to 150 years in federal prison. Total paper losses to investors were estimated at roughly $65 billion, though actual cash losses were lower — a distinction that still matters in how the fraud is measured. Madoff died in prison in April 2021.

The Madoff case remains a reference point for how long a fraud can survive when it produces boring, believable numbers instead of outlandish ones, and when the people positioned to catch it don't act on the warnings they're given.`,
    sourceUrl: 'https://www.sec.gov/enforcement-litigation/litigation-releases/lr-20834',
  },
  {
    title: 'The Spanish Prisoner: A 400-Year-Old Con Still Running Today',
    slug: 'the-spanish-prisoner-advance-fee-fraud-origins',
    author: 'ScamShield Editorial',
    tags: ['notorious', 'historical'],
    body: `Long before email, there was a letter. The "Spanish Prisoner" con dates back at least to the late 16th century: a swindler would contact a mark claiming to be in secret communication with a wealthy nobleman imprisoned in Spain under a false identity. To secure his release and reclaim his fortune, the prisoner needed a small sum smuggled to bribe his captors — and in gratitude, he would reward his rescuer with a share of a much larger hidden fortune, sometimes with the added lure of the prisoner's beautiful daughter as an incentive for a well-off mark.

Of course, there was no prisoner. Each payment the victim sent to help "free" him was met with a new complication requiring more money — legal fees, bribes, transport costs — an endless sequence of small asks justified by the promise of an enormous payoff just one more payment away. Victims who had already sent money were reluctant to walk away and lose their initial investment, so they kept paying. This exact psychological mechanic — a modest upfront cost promising a disproportionate reward, sustained by sunk-cost momentum — is the direct blueprint for the advance-fee fraud that still floods inboxes today.

The most famous modern descendant is the "419 scam" (named for the section of Nigeria's criminal code covering fraud), often opening with an email from a supposed government official, banker, or exiled royal who needs help moving a large sum of money out of the country, offering the recipient a generous cut for the use of their bank account. The costume changes — a prince instead of a prisoner, a wire transfer instead of a smuggled bribe — but the mechanism Ponzi's contemporaries would have recognized from a Victorian-era newspaper warning is identical: pay a little now, promised a lot later, and each payment justifies the next.

Advance-fee fraud remains one of the most reported scam categories worldwide precisely because the structure is so durable. It doesn't need new technology to work. It only needs a victim willing to send one more payment.`,
    sourceUrl: 'https://theappendix.net/issues/2013/10/proto-spam-spanish-prisoners-and-confidence-games',
  },
  {
    title: 'Frank Abagnale: The Con Man Who May Have Conned the Story Itself',
    slug: 'frank-abagnale-catch-me-if-you-can-fact-check',
    author: 'ScamShield Editorial',
    tags: ['notorious', 'notorious-scammer', 'historical'],
    coverImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/Abagnale-friendswood-april-26-2021-louisiana-voice.png',
    coverImagePosition: 50,
    body: `Frank Abagnale's own account, told in his 1980 memoir "Catch Me If You Can" and popularized by the 2002 film of the same name, is one of the most famous con-artist stories of the 20th century: a teenager in the 1960s who allegedly impersonated an airline pilot, a doctor, and a lawyer, forged roughly $2.5 million in fraudulent checks across 26 countries, and escaped custody multiple times before eventually being caught and later hired by the FBI to teach fraud prevention.

Abagnale did serve prison time for check fraud, and he has spent decades since as a paid speaker and consultant on financial fraud, including — by his account — work with the FBI. That much is a matter of record.

Much of the rest has not held up well. Investigative journalism, most notably a 2020 book by journalist Alan C. Logan, cross-referenced Abagnale's claims against court records, prison logs, and contemporaneous news coverage, and found large parts of the story — the scale of the forged checks, the impersonations, the dramatic escapes — could not be corroborated, and in several cases were directly contradicted by the documented record. Abagnale has continued to stand by his account.

The reason this belongs on a list of notorious scams isn't the alleged teenage check fraud itself. It's what the gap between the legend and the documented record demonstrates: a good enough story, repeated confidently and often enough, can outrun the fact-checking, get made into a Steven Spielberg film, and become the "true story" cited in fraud-prevention trainings for decades — evidence, ironically, that the same instinct to trust a compelling narrative over verification is exactly what every scam on this site relies on.`,
    sourceUrl: 'https://whyy.org/segments/the-greatest-hoax-on-earth/',
  },
  {
    title: "Anna Sorokin: The Fake Heiress Who Fooled New York",
    slug: 'anna-sorokin-anna-delvey-fake-heiress',
    author: 'ScamShield Editorial',
    tags: ['notorious', 'notorious-scammer'],
    coverImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/Anna_Sorokin,_2022.jpg',
    coverImageCredit: 'Photo: Anna Sorokina (CC BY-SA 4.0)',
    coverImagePosition: 50,
    body: `Between 2013 and 2017, a young woman calling herself "Anna Delvey" moved through New York's social scene claiming to be a wealthy German heiress about to inherit a multimillion-dollar trust fund, planning to open an exclusive private arts club. She stayed in luxury hotels, dined at expensive restaurants, tipped generously, and befriended people with real money and real social standing — all while her actual funds were, at best, a fraction of what she projected.

Her real name was Anna Sorokin, a Russian-born German citizen without the fortune she claimed. She funded her lifestyle through a mix of unpaid hotel bills, bounced checks, and — most damagingly for the friends who trusted her — talking acquaintances into fronting large expenses on the promise of prompt reimbursement that never fully materialized, including one widely reported case involving a $62,000 luxury vacation bill. Banks that extended her credit based on fabricated financial documents lost money directly.

Sorokin was arrested in 2017 and convicted in 2019 on multiple counts of grand larceny and theft of services, amounting to roughly $275,000 defrauded from banks, hotels, and individuals. She was sentenced to four to twelve years in prison, later released on parole, and subsequently detained by immigration authorities over her visa status. Her story became the basis for the Netflix series "Inventing Anna."

What made the con work wasn't a fake ID or a forged document — those came later, when they were needed for specific transactions. It was pure social engineering: a confident performance of wealth, sustained long enough and in front of the right people, that made almost everyone around her assume someone else had already verified she was who she said she was.`,
    sourceUrl: 'https://www.cbsnews.com/news/anna-sorokin-fake-heiress-anna-delvey-sentenced-four-to-12-years-prison/',
  },
  {
    title: 'Elizabeth Holmes and the Blood Test That Never Worked',
    slug: 'elizabeth-holmes-theranos-fraud',
    author: 'ScamShield Editorial',
    tags: ['notorious', 'notorious-scammer'],
    coverImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/Elizabeth_Holmes_2014_cropped.jpg',
    coverImageCredit: 'Photo: Max Morse for TechCrunch (CC BY 2.0)',
    coverImagePosition: 50,
    body: `Elizabeth Holmes founded Theranos in 2003 at age 19, dropping out of Stanford with a pitch that sounded like a genuine medical breakthrough: a device that could run hundreds of lab tests from a single finger-prick of blood, cheaper and faster than a traditional venous draw. By 2014, Theranos was valued at roughly $9 billion, Holmes was profiled as the youngest self-made female billionaire in the country, and her board included former Secretaries of State and Defense.

The technology described to investors, partners, and the public never actually worked as claimed. Internally, Theranos ran the large majority of patient tests on modified, repurposed machines from other manufacturers — sometimes diluting blood samples to make them compatible — while publicly presenting the results as coming from its own proprietary "Edison" devices. A 2015 Wall Street Journal investigation by reporter John Carreyrou was the first to expose the gap between what Theranos claimed and what was actually happening inside its labs.

Holmes and Theranos president Ramesh "Sunny" Balwani were indicted for wire fraud in 2018. Holmes was convicted in January 2022 on charges of defrauding investors — she was acquitted on charges tied to defrauding patients directly — and sentenced to just over 11 years. In early 2026, a federal judge trimmed roughly a year off her sentence after applying a retroactive guideline reduction for certain first-time nonviolent offenders; an appeals court had already upheld her underlying conviction. She remains in federal prison in Texas.

Theranos is a useful case precisely because there was no fake voice on the phone or forged check — just a confident, well-credentialed performance, backed by famous names on the board and years of flattering press coverage, that discouraged the basic due diligence that would have caught it. It took an outside reporter actually checking, rather than trusting the reputation, to unravel it.`,
    sourceUrl: 'https://www.kqed.org/science/1980842/elizabeth-holmes-sentenced-to-11-years-in-prison-for-theranos-fraud',
  },
  {
    title: 'Sam Bankman-Fried and the $8 Billion Hole in FTX',
    slug: 'sam-bankman-fried-ftx-collapse',
    author: 'ScamShield Editorial',
    tags: ['notorious', 'notorious-scammer'],
    coverImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/Sam_Bankman-Fried_(cropped).png',
    coverImageCredit: 'Photo: Cointelegraph (CC BY 3.0)',
    coverImagePosition: 50,
    body: `Sam Bankman-Fried founded the cryptocurrency exchange FTX in 2019, and within a few years built it into one of the largest exchanges in the world — and himself into a media fixture, testifying before Congress, donating heavily to political campaigns, and drawing comparisons to Warren Buffett, all while FTX ran Super Bowl ads and his paper net worth was estimated in the billions.

Behind the scenes, FTX customer deposits — money users believed was simply sitting in their exchange accounts — were secretly funneled to Alameda Research, a sister trading firm Bankman-Fried also controlled, through a backdoor that let Alameda draw on customer funds without the collateral any other user would have needed. When a November 2022 report questioning Alameda's finances triggered a wave of customer withdrawals, FTX couldn't cover them. The exchange collapsed within days, revealing a shortfall of roughly $8 billion.

Bankman-Fried was arrested in the Bahamas in December 2022, extradited to the United States, and convicted in November 2023 on seven counts of fraud and conspiracy. He was sentenced in March 2024 to 25 years in prison. He appealed both the conviction and the sentence; in June 2026, the Second Circuit Court of Appeals unanimously rejected the appeal, leaving the 25-year sentence in place with a projected release date in 2044. A request for a presidential pardon has so far been denied.

FTX is a reminder that celebrity endorsements, slick marketing, and even testimony before Congress describe how a company presents itself, not what its books actually say — and that the same "everything's moving fast, no time to double-check" pressure that makes an individual scam work can operate at the scale of a multibillion-dollar company.`,
    sourceUrl: 'https://www.nbcnews.com/business/business-news/sam-bankman-fried-sentenced-25-years-prison-orchestrating-ftx-fraud-rcna145286',
  },
  {
    title: "Jordan Belfort, the \"Wolf of Wall Street,\" and the Victims Still Waiting to Be Paid",
    slug: 'jordan-belfort-stratton-oakmont-wolf-of-wall-street',
    author: 'ScamShield Editorial',
    tags: ['notorious', 'notorious-scammer', 'historical'],
    coverImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/Jordan_Belfort_-_May_30,_2010.jpg',
    coverImageCredit: 'Photo: Ralph Zuranski (CC BY 2.0)',
    coverImagePosition: 50,
    body: `Through the late 1980s and 1990s, Jordan Belfort ran Stratton Oakmont, a Long Island brokerage built around a classic "pump and dump" scheme: brokers aggressively cold-called investors to buy shares in small, often nearly worthless companies that Stratton Oakmont itself secretly controlled large blocks of. The buying pressure artificially inflated ("pumped") the share price, at which point insiders sold ("dumped") their own shares at the inflated price — leaving ordinary investors holding stock that collapsed once the manufactured demand stopped.

Over roughly a decade, the scheme took in an estimated $200 million from more than 1,500 victims. Belfort also built a notorious corporate culture around the firm, later recounted in his own memoir and dramatized — critics say glamorized — in the 2013 film "The Wolf of Wall Street."

Belfort pleaded guilty in 1999 to securities fraud and money laundering, cooperated with prosecutors against former colleagues, and was sentenced in 2003 to four years in prison, of which he served 22 months, along with $110.4 million in court-ordered restitution to his victims. More than two decades later, court filings show he has repaid only a small fraction of that — roughly $12.8 million as of recent filings — while earning a living as a paid motivational speaker largely built on retelling the very story that created the debt he still owes.

The gap between what Belfort owes and what he's actually paid is worth knowing on its own: it's a straightforward fact-check against the swagger of the "Wolf of Wall Street" mythology, and a reminder that a compelling redemption story and an unpaid restitution order can coexist for decades.`,
    sourceUrl: 'https://www.investmentnews.com/ria-news/jordan-belfort-wolf-of-wall-street-falling-behind-on-restitution/74275',
  },
  {
    title: "Allen Stanford's $7 Billion Offshore Ponzi Scheme",
    slug: 'allen-stanford-stanford-financial-ponzi-scheme',
    author: 'ScamShield Editorial',
    tags: ['notorious', 'notorious-scammer', 'historical'],
    coverImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/Allen_Stanford_mug_shot.jpg',
    coverImagePosition: 50,
    body: `Robert Allen Stanford built Stanford Financial Group into a network of investment firms centered on Stanford International Bank, an offshore bank he ran out of Antigua and Barbuda, where his wealth and political influence earned him an honorary knighthood. Over roughly two decades, the bank sold certificates of deposit promising unusually high, steady returns, eventually reaching somewhere between 18,000 and 30,000 investors in more than 100 countries.

Those CDs weren't backed by the safe, liquid, diversified portfolio Stanford's marketing claimed. Instead, billions of dollars in depositor money went into his own speculative real estate deals, private businesses, and personal spending — including sponsoring a high-profile international cricket tournament — all while investors received audited-looking statements describing a conservative investment portfolio that didn't actually exist as described.

The scheme collapsed in February 2009, just weeks after the Madoff scandal broke, when the SEC filed civil fraud charges and froze Stanford's assets. He was convicted in March 2012 on 13 of 14 counts and sentenced to 110 years in federal prison. At roughly $7 billion, it remains the second-largest Ponzi scheme in U.S. history, after Madoff's.

That Stanford's fraud surfaced within weeks of Madoff's isn't entirely a coincidence: discovery often comes in waves. Once regulators, journalists, and the public are primed to look for one kind of fraud, others hiding nearby tend to surface soon after — which is part of why sustained, boring vigilance matters more than reacting only after the last big scandal.`,
    sourceUrl: 'https://www.justice.gov/archive/usao/txs/1News/Releases/2012%20June/120614%20Stanford.html',
  },
  {
    title: 'Billy McFarland: From Fyre Festival to Fyre Festival II',
    slug: 'billy-mcfarland-fyre-festival',
    author: 'ScamShield Editorial',
    tags: ['notorious', 'notorious-scammer'],
    coverImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/Billy_McFarland_Entrepreneur_2014_(cropped).jpg',
    coverImageCredit: 'Photo: Ian Moran / I to Z Photo + Video (CC BY-SA 3.0)',
    coverImagePosition: 50,
    body: `In 2017, Billy McFarland and rapper Ja Rule marketed the "Fyre Festival" as a luxury music festival on a private Bahamian island, using a viral, influencer-driven campaign — models and celebrities all posting an identical orange square — to sell tickets ranging from hundreds of dollars to over $100,000, promising gourmet catering, luxury villas, and major musical acts.

Attendees who actually showed up found disaster-relief tents instead of villas, prepackaged sandwiches instead of gourmet catering, no real performances, and no functioning way to leave the island. It later emerged that McFarland had misrepresented the festival's finances to investors and vendors throughout the planning process, including fabricated documents used to raise around $26 million.

McFarland pleaded guilty to wire fraud in 2018, was sentenced to six years in federal prison, and forfeited $26 million. He was released in March 2022 after serving less than four years. In 2025, he announced "Fyre Festival II," selling tickets for as much as $1.1 million each — reporting subsequently uncovered multiple irregularities with the new event, and it was postponed indefinitely.

McFarland is unusual on this list for trying the same playbook twice, in public, after already serving prison time for the first version. That he could still sell tickets at all is a reminder that reputational damage alone doesn't reliably stop a repeat offender — and that trusting a slick campaign and social proof over independent verification is exactly the weak point that failed the first time.`,
    sourceUrl: 'https://www.cnn.com/2018/10/12/us/fyre-festival-organizer-prison-trnd',
  },
  {
    title: 'Rita Crundwell: The Small-Town Comptroller Who Stole $53 Million',
    slug: 'rita-crundwell-dixon-illinois-embezzlement',
    author: 'ScamShield Editorial',
    tags: ['notorious', 'historical'],
    body: `Dixon, Illinois, a city of about 16,000 people, employed Rita Crundwell as comptroller starting in 1983 — a position that gave her near-total control over the city's finances with minimal independent oversight. Starting in December 1990, she quietly opened a secret municipal bank account that she alone controlled, and over the next 22 years made 179 transfers totaling roughly $53.7 million out of city funds and into it.

Crundwell used the stolen money to build one of the top quarter-horse breeding operations in the country — hundreds of horses, elaborate stables, national competitions — all while publicly presenting herself as running a lean, cash-strapped city government that regularly needed budget cuts. The fraud went undetected for over two decades partly because she also controlled the city's bookkeeping and bank reconciliations, and outside audits relied on records she herself supplied.

The scheme unraveled in 2012 when a city employee filling in during Crundwell's vacation noticed the secret account. She pleaded guilty to federal program fraud and was sentenced in 2013 to nearly 20 years in federal prison — one of the largest thefts of public funds in U.S. municipal history relative to the size of the town. Her sentence was later commuted, and she was released from custody before completing it.

The case remains a reference point for municipal fraud prevention for a simple reason: no exotic financial instruments were involved, just one person controlling both the money and the paperwork meant to check it, for more than twenty years, in a town too small and too trusting to look closely at either.`,
    sourceUrl: 'https://www.nbcnews.com/news/us-news/horse-loving-bookkeeper-gets-almost-20-years-stealing-53-million-flna1c8378635',
  },
  {
    title: 'Enron: The $74 Billion Collapse Built on Fake Numbers',
    slug: 'enron-accounting-fraud-collapse',
    author: 'ScamShield Editorial',
    tags: ['notorious', 'notorious-scammer', 'historical'],
    body: `Founded from a 1985 merger, Enron grew into one of the largest energy trading companies in America, named "America's Most Innovative Company" by Fortune magazine for six consecutive years through 2000. Its stock was a Wall Street favorite, and its executives were celebrated as visionaries reinventing how energy markets worked.

Behind the growth, Enron's executives — led by CEO Kenneth Lay and COO, later CEO, Jeffrey Skilling — used a web of off-the-books "special purpose entities" to hide billions of dollars in debt and inflate reported profits, with the company's own auditor, Arthur Andersen, signing off on statements that didn't reflect Enron's actual financial condition. When the scheme unraveled in October 2001, Enron's stock collapsed from over $90 to under $1 within weeks, wiping out an estimated $74 billion in shareholder value and thousands of employees' retirement savings, which had been heavily invested in company stock.

Enron filed for bankruptcy in December 2001, then one of the largest bankruptcies in U.S. history. Arthur Andersen, one of the "Big Five" accounting firms, was convicted of obstruction of justice for shredding Enron documents and collapsed as a business — though the conviction was later overturned by the Supreme Court on a technicality, by which point the firm no longer existed anyway. Skilling was convicted in 2006 on 19 counts of fraud and conspiracy and sentenced to 24 years; a 2013 deal reduced that to 14, and he was released in 2019. Lay was convicted alongside Skilling but died of heart disease before sentencing, which under federal law vacated his conviction entirely.

Enron remains the reference case for a specific kind of fraud — not a lone con artist, but an entire company, its board, and its outside auditor collectively failing, or refusing, to catch numbers that didn't add up. It directly led to the Sarbanes-Oxley Act of 2002, the most significant corporate accounting reform in a generation.`,
    sourceUrl: 'https://www.justice.gov/archive/opa/pr/2006/October/06_crm_723.html',
  },
  {
    title: "Wirecard: Germany's Biggest Fraud, and the Executive Who Vanished",
    slug: 'wirecard-jan-marsalek-fraud',
    author: 'ScamShield Editorial',
    tags: ['notorious'],
    body: `Wirecard was a German payments-processing company that grew, on paper, into one of Europe's most valuable fintech firms, joining the prestigious DAX 30 index of Germany's largest public companies in 2018 — a rare feat for a company barely two decades old.

In June 2020, Wirecard's auditor revealed that €1.9 billion (about $2.3 billion) the company claimed was held in trustee bank accounts in the Philippines simply did not exist. The company collapsed within days, filing for insolvency in one of the largest corporate fraud scandals in German history.

Wirecard's chief operating officer, Jan Marsalek, disappeared days before the collapse and has been a fugitive ever since, wanted by German authorities and listed on Interpol's wanted database; investigative reporting from multiple European outlets has since traced him to Russia, reportedly living under a false identity with ties to Russian intelligence. CEO Markus Braun was arrested and has stood trial since December 2022 alongside two other former executives on charges of fraud and market manipulation. As of 2026, that trial is still ongoing with no verdict reached, and Braun has consistently denied the allegations, maintaining he was himself a victim of the fraud rather than its architect.

Wirecard is a reminder that even a company listed on a major stock index, audited annually, and regulated by a G7 country's financial authorities can still turn out to be built on numbers that don't exist — and that "notorious" doesn't always mean "resolved": years after the collapse, one of the case's central figures remains a fugitive, and the other's guilt or innocence is still being decided in court.`,
    sourceUrl: 'https://www.usnews.com/news/world/articles/2025-03-07/wirecard-fugitive-jan-marsalek-from-financial-fraudster-to-russian-spymaster',
  },
  {
    title: 'Bre-X: The Billion-Dollar Gold Mine That Was Never There',
    slug: 'bre-x-gold-mine-fraud',
    author: 'ScamShield Editorial',
    tags: ['notorious', 'historical'],
    body: `Bre-X Minerals was a small Canadian mining company trading for pennies a share until 1995, when it announced a spectacular gold discovery at a remote site called Busang, in the jungles of Indonesian Borneo. Rock samples reportedly showed gold in quantities that would make it one of the richest deposits ever found.

Bre-X's stock price rocketed, reaching a split-adjusted peak of over CAD $280 a share in 1996 and giving the company a market value of more than CAD $6 billion, drawing in mining giants, pension funds, and ordinary retail investors chasing the excitement. The gold was never real: independent testing later found the rock samples had been "salted" — tampered with by adding gold dust from an outside source to fake the assay results.

In March 1997, as due-diligence testing began raising questions, Bre-X's chief geologist Michael de Guzman fell to his death from a helicopter over the Indonesian jungle, in what was ruled a suicide, though theories about his death persist to this day. Weeks later, an independent report confirmed there was effectively no economically recoverable gold at the site. The stock collapsed to nothing, wiping out an estimated 40,000 investors. Because the person most directly tied to faking the samples was dead, and no clear evidence tied Bre-X's other executives to the deception, no one was ever criminally convicted.

Bre-X remains one of the largest mining frauds in history and a case study in how a compelling, exciting story — a resource discovery so big it seemed almost too good to be true — can override the kind of skepticism that easily-checkable evidence might otherwise invite. In this instance, it literally was too good to be true.`,
    sourceUrl: 'https://www.cbc.ca/news/business/no-criminal-charges-in-bre-x-scandal-1.174425',
  },
  {
    title: 'Nirav Modi and the $2 Billion Bank Fraud That Emptied a Vault Without a Robbery',
    slug: 'nirav-modi-punjab-national-bank-fraud',
    author: 'ScamShield Editorial',
    tags: ['notorious'],
    body: `Nirav Modi built an internationally recognized luxury diamond jewelry brand, with boutiques from Mumbai to New York and celebrity clients, before Indian investigators accused him and his uncle Mehul Choksi of orchestrating one of the largest bank frauds in the country's history.

Indian authorities allege that, starting around 2011, Modi's companies obtained fraudulent guarantee letters from staff at Punjab National Bank — India's second-largest state-run bank — without the collateral such guarantees normally require, then used them to secure loans from overseas branches of other Indian banks. By the time the scheme was uncovered in 2018, the alleged fraud totaled roughly ₹14,000 crore, or about $2 billion.

Modi left India shortly before the fraud became public and has been fighting extradition from the United Kingdom ever since, held at HMP Wandsworth in London since his 2019 arrest. He has consistently denied the allegations. After exhausting UK court appeals and a final rejection from the European Court of Human Rights in mid-2026, his extradition to India to face trial appears to be reaching its final stage — though as of this writing he has not yet been tried or convicted of any crime.

The case is a reminder that a criminal accusation and a criminal conviction are two different things, sometimes separated by nearly a decade of legal process across multiple countries — and that "alleged" is doing real, necessary work in every sentence describing Modi's role, right up until an actual verdict is reached.`,
    sourceUrl: 'https://www.businesstoday.in/india/story/nirav-modi-extradition-echr-rejects-final-plea-uk-starts-transfer-process-541227-2026-07-06',
  },
  {
    title: 'Lou Pearlman: The Boy Band Mogul Running a $300 Million Ponzi Scheme',
    slug: 'lou-pearlman-boy-band-ponzi-scheme',
    author: 'ScamShield Editorial',
    tags: ['notorious', 'notorious-scammer'],
    coverImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/Lou-pearlman-mugshot.jpg',
    coverImagePosition: 50,
    body: `Lou Pearlman built and managed some of the biggest boy bands of the 1990s and 2000s, including the Backstreet Boys and *NSYNC, becoming one of the most powerful figures in pop music. Alongside his entertainment business, he ran investment programs — including an "Employee Investment Savings Account" and an airline-leasing venture — that promised safe, above-market returns.

Those investment programs were fictitious. For roughly 15 years, Pearlman used fabricated financial statements, a fake accounting firm, and even a fake bank to convince nearly 1,700 investors, many of them elderly Florida retirees, to hand over a combined $300 million or more, paying "returns" to earlier investors using money from new ones in a classic Ponzi structure.

The scheme unraveled in 2006 amid state and federal investigations, and Pearlman fled the country, eventually arrested in Bali, Indonesia, in 2007. He was extradited, pleaded guilty to conspiracy and money laundering charges, and was sentenced in 2008 to 25 years in prison, with a provision letting him shave time off his sentence for every million dollars he helped recover for victims. He died of cardiac arrest in prison in 2016, having served eight years of the sentence.

Pearlman's case shows how a fraud can hide behind a legitimate, glamorous business for years — investors who might never have handed a stranger $300 million trusted the man who discovered the Backstreet Boys, right up until the "bank" statements he was sending them turned out to describe an institution that didn't exist.`,
    sourceUrl: 'https://www.foxnews.com/story/boy-band-mogul-lou-pearlman-sentenced-to-25-years-in-prison.amp',
  },
  {
    title: 'Marcus Schrenker: The Financial Adviser Who Faked His Own Plane Crash',
    slug: 'marcus-schrenker-faked-plane-crash-fraud',
    author: 'ScamShield Editorial',
    tags: ['notorious'],
    body: `Marcus Schrenker was an Indiana financial adviser and amateur pilot who used roughly $1.5 million stolen from at least nine clients — including a longtime friend and his own aunt — to fund a lavish lifestyle of private planes, luxury cars, and a 10,000-square-foot home, financed in part through a foreign currency investment fund that didn't actually exist.

As regulators and investigators closed in during January 2009, Schrenker filed a fraudulent life insurance claim, then took off in his small plane, radioed a distress call claiming the windshield had shattered and he was bleeding, put the plane on autopilot, and parachuted out over Alabama — apparently hoping the plane's eventual crash would be mistaken for his death and the search for him would end there.

The plan failed almost immediately: air traffic controllers found his story suspicious, and the plane crash-landed largely intact rather than the fiery wreck he likely expected. Schrenker was found two days later at a Florida campground with self-inflicted wrist wounds. He pleaded guilty to federal charges related to the staged crash, and separately to securities fraud, receiving a four-year sentence for the crash and a consecutive 10-year sentence for the fraud.

Beyond the fraud itself — an all-too-common fake investment fund — the staged crash is a reminder of how far a scheme's architect may go once genuinely cornered, and how quickly a plan built to look like an accident can fall apart under the same kind of scrutiny that should have applied to the original investment claims.`,
    sourceUrl: 'https://www.ibj.com/articles/22752-schrenker-sentenced-to-10-years-for-securities-fraud',
  },
  {
    title: 'Ruja Ignatova, the "Cryptoqueen" Behind OneCoin, and the $4 Billion That Vanished With Her',
    slug: 'ruja-ignatova-onecoin-cryptoqueen-fraud',
    author: 'ScamShield Editorial',
    tags: ['notorious', 'notorious-scammer'],
    coverImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/Ruja_Ignatova_FBI_(rightpic).jpg',
    coverImagePosition: 50,
    body: `Ruja Ignatova launched OneCoin in 2014, marketing it worldwide as a revolutionary cryptocurrency positioned to rival Bitcoin, sold through a multi-level-marketing structure that rewarded members for recruiting new investors as much as for the coin itself. Filling packed arenas across Europe, Asia, and Africa with the confidence of a tech visionary, she built OneCoin into a global operation that took in an estimated $4 billion or more from investors before anyone could verify the one thing the entire pitch depended on.

That verification never came, because it couldn't: OneCoin had no genuine blockchain. Investigators later determined the "coin" existed only in a centralized, editable database controlled by the company — the digital equivalent of a private ledger with invented numbers, sold to true believers as decentralized, unforgeable currency. There was nothing behind the price chart members watched climb on their own screens.

In October 2017, with a German arrest warrant issued and prosecutors closing in, Ignatova boarded a flight to Athens and has not been reliably seen in public since. The FBI added her to its Ten Most Wanted Fugitives list in 2022 — a rare distinction for a woman, and for a financial crime rather than a violent one — with a reward for information leading to her capture that the agency raised to $5 million in 2024. Her co-founder, Karl Sebastian Greenwood, was convicted in the United States and sentenced to 20 years in prison in 2023; Ignatova, wherever she is, has never faced trial.

OneCoin is a useful case precisely because the fraud wasn't a subtle accounting trick — it was a claim anyone technical enough could have checked, wrapped in exactly the kind of packed-stadium confidence and multi-level recruitment structure that makes checking feel unnecessary. Years after her disappearance, the money is still gone, the "coin" never existed, and the woman who sold it to millions of people remains, as far as anyone can verify, missing.`,
    sourceUrl: 'https://www.npr.org/2022/07/08/1110577425/cryptoqueen-ruja-ignatovas-international-scheme-landed-her-on-fbis-most-wanted',
  },
  {
    title: 'Michael Milken, the "Junk Bond King," and the Insider-Trading Scheme That Took Down Drexel Burnham',
    slug: 'michael-milken-junk-bond-king-fraud',
    author: 'ScamShield Editorial',
    tags: ['notorious', 'notorious-scammer', 'historical'],
    coverImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/Michael_Milken_1.jpg',
    coverImagePosition: 50,
    body: `Michael Milken built the high-yield "junk bond" market at Drexel Burnham Lambert into one of the most powerful financing engines on Wall Street through the 1980s, using it to fund the era's wave of corporate takeovers and leveraged buyouts. At his peak he was reportedly the highest-paid person in America, earning hundreds of millions of dollars a year and wielding influence that let him reshape entire industries from his famous "X-shaped" trading desk in Beverly Hills.

Behind the legitimate bond business, prosecutors found a web of illegal activity: insider trading, stock parking (secretly using an associate — fellow financier Ivan Boesky — to hide the true ownership of shares), and market manipulation designed to benefit Milken's own trades and clients ahead of the public. The scheme surfaced through the investigation into Boesky, who cooperated with prosecutors after his own insider-trading conviction and helped implicate Milken directly.

Milken was indicted in 1989 on 98 counts of securities fraud and racketeering. He pleaded guilty to six felony counts, was sentenced to 10 years in prison (of which he served about 22 months), paid $600 million in fines and restitution, and was permanently barred from the securities industry. Drexel Burnham Lambert itself collapsed into bankruptcy in 1990, at the time the largest failure of a Wall Street investment bank in history. Milken later received a controversial presidential pardon in 2020, following decades spent funding medical research and rebuilding his public reputation through the Milken Institute.

The case remains a foundational reference point for insider trading and securities fraud investigations — proof that even a financier who genuinely revolutionized a market can also be running a parallel scheme to rig it, and a reminder that philanthropy and a rehabilitated public image, however extensive, are not the same thing as having fully answered for the original conduct.`,
    sourceUrl: 'https://www.foxnews.com/politics/michael-milken-junk-bond-king-pardon-trump',
  },
  {
    title: 'Sam Israel III and the Bayou Hedge Fund Fraud That Ended in a Faked Suicide',
    slug: 'sam-israel-bayou-hedge-fund-fraud',
    author: 'ScamShield Editorial',
    tags: ['notorious', 'notorious-scammer', 'historical'],
    coverImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/Samuel_Israel_III.jpg',
    coverImagePosition: 50,
    body: `Sam Israel III founded the Bayou Hedge Fund Group in 1996, reporting steady, market-beating returns to investors year after year. Behind those numbers, the fund was actually losing money almost from the start; Israel and an accomplice covered the losses by creating a fake accounting firm to produce audited-looking statements that bore no relationship to the fund's real performance, a nearly identical mechanism to the fabricated audits later found at Bernie Madoff's and Lou Pearlman's operations.

The fraud, totaling roughly $450 million, collapsed in 2005 when Israel confessed to investigators. He pleaded guilty to fraud charges and was sentenced in 2008 to 20 years in federal prison. On the day he was scheduled to surrender, Israel instead drove to a bridge over the Hudson River, abandoned his SUV with the words "suicide is painless" — the theme from M*A*S*H — scratched into the dust on the hood, and disappeared with his girlfriend in a camper van, apparently hoping to be presumed dead.

The plan unraveled after roughly a month on the run: following a segment on America's Most Wanted, Israel turned himself in to police. For faking his own death and fleeing justice, he received an additional two years on top of his original 20-year sentence.

Sam Israel's story is a near-exact echo of Marcus Schrenker's staged plane crash a few years later — two financial fraudsters who, facing the consequence of years of fabricated numbers, each concluded that disappearing was more survivable than serving the sentence, and each was caught within weeks. The fake audits bought Israel a decade of runway; the fake death bought him almost nothing.`,
    sourceUrl: 'https://www.foxnews.com/story/hedge-fund-swindler-admits-staging-suicide-to-avoid-jail',
  },
  {
    title: 'Bernard Ebbers and the $11 Billion Accounting Fraud That Sank WorldCom',
    slug: 'bernard-ebbers-worldcom-accounting-fraud',
    author: 'ScamShield Editorial',
    tags: ['notorious', 'notorious-scammer', 'historical'],
    coverImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/Bernard_Ebbers.jpg',
    coverImagePosition: 50,
    body: `Bernard Ebbers built WorldCom from a small Mississippi long-distance reseller into the second-largest telecommunications company in the United States through the 1990s, fueled by an aggressive string of acquisitions, including its $37 billion purchase of MCI. When the telecom industry's growth slowed at the turn of the century, WorldCom's stock price — and Ebbers' own heavily leveraged personal fortune, much of it borrowed against WorldCom shares — depended on the company continuing to look like it was growing.

Rather than report the slowdown, WorldCom's finance team, under pressure from Ebbers and CFO Scott Sullivan, disguised it. Billions of dollars in ordinary operating expenses were improperly reclassified as capital expenditures, a bookkeeping shift that spread costs out over years instead of counting them immediately — making the company appear consistently profitable when it was not. By the time the fraud was uncovered by an internal auditor in June 2002, the misstatement totaled roughly $11 billion, the largest accounting fraud in U.S. history at the time.

WorldCom filed for bankruptcy weeks later — then the largest corporate bankruptcy in U.S. history — wiping out shareholders and costing thousands of employees their jobs. Ebbers was convicted in March 2005 on charges of fraud, conspiracy, and false regulatory filings, and was sentenced to 25 years in prison. He was released in 2019 on compassionate grounds due to declining health and died the following year.

WorldCom, alongside Enron the same year, became a defining case for corporate accounting reform, directly driving passage of the Sarbanes-Oxley Act, which imposed new financial-reporting and internal-control requirements on public companies. It remains a reference point for how a fraud built entirely out of a bookkeeping classification — nothing as dramatic as a fake product or a forged signature — can still cost more than almost any other kind of scam on this list.`,
    sourceUrl: 'https://www.sec.gov/enforcement-litigation/litigation-releases/lr-19301',
  },
  {
    title: 'Charles Keating and the Lincoln Savings Collapse That Cost Taxpayers Billions',
    slug: 'charles-keating-lincoln-savings-fraud',
    author: 'ScamShield Editorial',
    tags: ['notorious', 'notorious-scammer', 'historical'],
    body: `Charles Keating ran Lincoln Savings and Loan, an Irvine, California thrift he acquired in 1984, during the deregulated boom years of the savings-and-loan industry. Rather than sticking to traditional, federally insured home loans, Keating used Lincoln's federally insured deposits to fund speculative real estate ventures and other high-risk investments — and had Lincoln's sales staff aggressively market uninsured junk bonds issued by its parent company to depositors, many of them elderly, who believed they were buying something as safe as the insured savings accounts around them.

As regulators began investigating Lincoln's finances, Keating leaned on political influence he had cultivated through campaign contributions. Five U.S. senators — later dubbed the "Keating Five" — intervened with federal regulators on his behalf, delaying scrutiny of Lincoln for months. When the thrift finally collapsed in 1989, it became one of the most expensive failures of the savings-and-loan crisis, costing taxpayers roughly $3.4 billion through the federal deposit insurance system, while thousands of bondholders lost a combined $200 million in savings that were never insured at all.

Keating was convicted of state and federal fraud, racketeering, and conspiracy charges in the early 1990s, but both convictions were later overturned on appeal over jury-instruction errors. Facing retrial, he pleaded guilty in 1999 to four counts of fraud; under the plea, his sentence was limited to the roughly four and a half years he had already spent in custody.

The Keating Five scandal reshaped how seriously Congress treated its own senators' interventions with regulators, and Lincoln's collapse became a central case study in the savings-and-loan crisis — a reminder that a fraud's victims aren't only the people who bought the bad investment directly, but every taxpayer who ends up covering the federal insurance bill when it fails.`,
    sourceUrl: 'https://www.britannica.com/biography/Charles-Keating',
  },
  {
    title: "Nick Leeson, the \"Rogue Trader\" Who Brought Down Britain's Oldest Bank",
    slug: 'nick-leeson-barings-bank-collapse',
    author: 'ScamShield Editorial',
    tags: ['notorious', 'notorious-scammer', 'historical'],
    body: `Nick Leeson was a derivatives trader running the Singapore office of Barings Bank, a 233-year-old British merchant bank whose clients had once included the British monarchy. Unusually, Leeson was in charge of both trading and settling his own trades, a separation of duties that exists specifically to prevent one person from hiding losses — and its absence let him do exactly that.

Starting in the early 1990s, Leeson made unauthorized bets on Japanese stock index futures, and when those trades lost money, he hid the losses in a secret error account, numbered 88888, rather than report them. To recover the mounting losses, he kept doubling down on new trades, betting the Nikkei index would stay above 19,000 points. When the January 1995 Kobe earthquake sent the Nikkei crashing instead, the losses accelerated far beyond what he could hide or cover.

By the time Leeson fled Singapore in February 1995, the hidden losses had reached roughly £830 million — more than twice Barings' entire available capital. The 233-year-old bank collapsed within days and was sold to the Dutch bank ING for a nominal £1. Leeson was arrested at Frankfurt airport while trying to return to Britain, extradited to Singapore, and sentenced to six and a half years in prison there for fraud and forgery; he was released in 1999.

Barings' collapse became the textbook case for why trading and settlement have to be handled by separate people, and for how much damage a single unsupervised trader can do when that separation doesn't exist. The "rogue trader" label the press gave Leeson has since been applied to a string of similar cases at other banks, each one a variation on the same failure: nobody was watching closely enough to catch a losing bet before it became an unrecoverable one.`,
    sourceUrl: 'https://www.britannica.com/event/bankruptcy-of-Barings-Bank',
  },
  {
    title: '"Pharma Bro" Martin Shkreli and the Hedge Fund Losses He Hid Behind a Public Company',
    slug: 'martin-shkreli-securities-fraud',
    author: 'ScamShield Editorial',
    tags: ['notorious', 'notorious-scammer'],
    coverImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/Mr._Shkreli_(cropped).jpg',
    coverImageCredit: 'Photo: U.S. House Committee on Oversight and Government Reform (Public Domain)',
    coverImagePosition: 50,
    body: `Martin Shkreli became infamous in 2015 as the "Pharma Bro" who raised the price of a life-saving drug, Daraprim, by over 5,000% overnight as CEO of Turing Pharmaceuticals — a legal, if widely condemned, business decision. The securities fraud that actually sent him to prison had nothing to do with drug pricing, and predates that scandal by several years.

Before Turing, Shkreli ran two hedge funds, MSMB Capital and MSMB Healthcare, and told investors they were performing well when in fact both had lost nearly all their money. To cover the losses and keep raising money, prosecutors showed, Shkreli fabricated account statements and used funds from investors in his next venture, the biopharmaceutical company Retrophin, to quietly pay back the earlier hedge fund investors — money that was supposed to be capitalizing Retrophin's business, not settling Shkreli's prior obligations.

A federal jury convicted Shkreli in August 2017 on two counts of securities fraud and one count of conspiracy, while acquitting him on other counts. He was sentenced in March 2018 to seven years in prison and ordered to forfeit nearly $7.4 million. He was released in 2022, and a separate civil case brought by the FTC and several states barred him for life from the pharmaceutical industry over the Daraprim price increase.

Shkreli's case is a reminder that the conduct that makes headlines and the conduct that results in a conviction aren't always the same thing — his fraud was a fairly conventional hedge-fund shell game, dressed up and hidden inside the accounts of a company whose public investors had no idea they were the ones ultimately paying for it.`,
    sourceUrl: 'https://www.npr.org/sections/thetwo-way/2018/03/09/592368883/martin-shkreli-sentenced-to-seven-years-for-securities-fraud',
  },
  {
    title: 'Scott Rothstein: The Lawyer Who Sold Shares in Lawsuits That Didn\'t Exist',
    slug: 'scott-rothstein-rosenfeldt-adler-ponzi-scheme',
    author: 'ScamShield Editorial',
    tags: ['notorious', 'notorious-scammer', 'historical'],
    body: `Scott Rothstein was a prominent Fort Lauderdale attorney and managing shareholder of Rothstein Rosenfeldt Adler, a law firm that grew to more than 70 lawyers largely on the strength of Rothstein's own rainmaking and political connections. Behind that success was a fraud built on a product that sounded plausible to sophisticated investors: shares in structured settlements from confidential employment-discrimination and whistleblower lawsuits Rothstein claimed his firm had won, which investors could buy at a discount and collect the full payout on later.

The lawsuits and settlements did not exist. Rothstein fabricated the underlying legal documents, recruited bank employees to falsely vouch for account balances that backed up his claims, and used new investors' money to pay off earlier investors — a Ponzi structure — while using the firm's apparent success to court politicians, buy multiple homes and yachts, and become one of South Florida's most visible power brokers.

The scheme, totaling roughly $1.2 billion, collapsed in October 2009 when Rothstein ran out of new money to cover it and fled briefly to Morocco before returning and turning himself in. He pleaded guilty in January 2010 to racketeering, money laundering, and fraud charges, and was sentenced in June 2010 to 50 years in federal prison — ten years more than prosecutors had requested, reflecting the scale of the fraud and Rothstein's extensive cooperation notwithstanding.

Rothstein's case stands out for how much of the fraud depended on the credibility of the legal system itself: the "product" being sold wasn't a stock or a currency, but the manufactured appearance of confidential court settlements — and it worked because investors trusted that a licensed attorney with a respected firm wouldn't fabricate the very documents his profession is built on protecting.`,
    sourceUrl: 'https://www.justice.gov/archive/usao/fls/PressReleases/2010/100609-01.html',
  },
  {
    title: 'Jérôme Kerviel and the €4.9 Billion Trade Société Générale Never Approved',
    slug: 'jerome-kerviel-societe-generale-rogue-trader',
    author: 'ScamShield Editorial',
    tags: ['notorious', 'notorious-scammer', 'historical'],
    coverImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/2015_popfinance_crowdfunding_221.jpg',
    coverImageCredit: 'Photo: Max malafosse (CC BY-SA 4.0)',
    coverImagePosition: 50,
    body: `Jérôme Kerviel worked as a junior trader on the futures desk at Société Générale, one of France's largest banks, a job that gave him direct knowledge of the bank's internal risk-control systems from an earlier role in its back office. Starting around 2005, he began placing unauthorized bets on European stock index futures far beyond his trading limits — and used that back-office knowledge to fake offsetting trades that made his real, unhedged positions disappear from the bank's risk reports.

For a time, some of the hidden bets were profitable, briefly making Kerviel look like a star performer. But by January 2008, his concealed positions had grown to nearly €50 billion — more than the bank's entire market value — betting that European markets would keep rising. When the bank's compliance team finally uncovered the fraud and was forced to unwind the position during a market downturn, it locked in a loss of roughly €4.9 billion, at the time the largest trading loss ever caused by a single individual.

Kerviel was convicted in October 2010 of forgery, breach of trust, and unauthorized computer use, and sentenced to three years in prison plus a suspended term; French courts also initially ordered him to repay the full €4.9 billion, though a later appeal reduced that damages award. He maintained throughout that his managers knew, informally, that traders routinely exceeded their limits as long as they were profitable — a defense the courts rejected, though it echoed the argument several other rogue-trading cases have made since.

The Kerviel case became a defining example, alongside Nick Leeson's collapse of Barings Bank over a decade earlier, of how a single trader with enough insider knowledge of a bank's own controls can hide a catastrophic position in plain sight — and of how thin the line can be between a trader deceiving their employer and an employer that simply didn't want to look too closely while the trades were winning.`,
    sourceUrl: 'https://www.societegenerale.com/en/news/newsroom/kerviel-case',
  },
  {
    title: 'Tom Petters and the $3.65 Billion Ponzi Scheme Hidden Inside a Real Business Empire',
    slug: 'tom-petters-ponzi-scheme',
    author: 'ScamShield Editorial',
    tags: ['notorious', 'notorious-scammer', 'historical'],
    body: `Tom Petters built Petters Group Worldwide into a real, visible business empire — it owned Polaroid, the catalog retailer Fingerhut, and a controlling stake in Sun Country Airlines — which made the fraud running underneath it easier for investors to believe. Through a subsidiary called Petters Company Inc., he raised money from hedge funds, retirees, and even pastors and missionaries by promising returns of 15 to 20 percent, telling investors their money was funding the purchase of wholesale electronics and consumer goods that PCI would resell to big-box retailers at a markup.

No such merchandise deals existed at anywhere near the scale claimed. Petters used forged purchase orders and fabricated shipping documents to make the scheme look like a real, profitable wholesale operation, while using new investors' money to pay "returns" to earlier ones — a Ponzi structure hidden behind the legitimate-looking Polaroid and Fingerhut brands. The fraud unraveled in 2008 after a co-conspirator, facing a separate case, wore a wire for the FBI and recorded Petters discussing the scheme directly.

Petters was convicted in December 2009 on twenty counts including wire fraud, mail fraud, and money laundering, and was sentenced in April 2010 to 50 years in federal prison — the longest sentence ever handed down for financial fraud in Minnesota history. Total losses to investors were estimated at $3.65 billion, making it one of the largest Ponzi schemes in U.S. history after Madoff's.

The case is a reminder that owning real, recognizable companies doesn't make a business real — Polaroid and Fingerhut were genuine, operating businesses, and their legitimacy lent credibility to a wholesale-goods scheme that, underneath, was fabricated from top to bottom.`,
    sourceUrl: 'https://www.justice.gov/sites/default/files/usao-mn/legacy/2010/12/21/econ0413.pdf',
  },
  {
    title: '"Crazy Eddie" Antar and the Stock Fraud Behind the Wildest Ads on TV',
    slug: 'eddie-antar-crazy-eddie-stock-fraud',
    author: 'ScamShield Editorial',
    tags: ['notorious', 'notorious-scammer', 'historical'],
    coverImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/Eddie_Antar_mugshot.png',
    coverImagePosition: 50,
    body: `Eddie Antar built Crazy Eddie into one of the most recognizable electronics retail chains in the New York area during the 1970s and '80s, fronted by manic, unmistakable TV commercials promising prices so low they were "INSAAAANE." Behind the storefront, Antar and his family ran a cash-skimming operation for years before the company ever went public in 1984 — quietly pocketing a portion of cash sales and underreporting income to shrink the company's tax bill.

Once Crazy Eddie went public, that same cash Antar had been skimming away suddenly needed to reappear — reported income now needed to look as large as possible to keep the stock price climbing, the opposite incentive from the company's private years. Antar's team began funneling the hidden cash back into the business, falsifying inventory counts, and inflating sales figures at key stores, creating an inventory shortfall investigators later estimated between $40 and $50 million. As the manufactured growth pushed the stock higher, Antar and his family sold off more than $20 million of their own shares to an investing public that had no idea the underlying numbers were fabricated.

The fraud collapsed after a hostile takeover in 1987 gave new owners access to the real books. Facing charges, Antar fled the United States in February 1990, triggering a two-year international manhunt involving the FBI, U.S. Marshals, the SEC, and Interpol before he was located in Israel in 1992 and extradited back to the U.S. the following year. He pleaded guilty to racketeering conspiracy in 1996 and was sentenced to eight years in prison; a related SEC civil judgment held him liable for more than $57 million in disgorgement and interest.

Crazy Eddie's collapse became a staple case study in forensic accounting precisely because the fraud ran in two directions — hiding income before the IPO, then inventing it afterward — showing how the same underlying scheme can flip its entire purpose the moment a private company's incentives change by going public.`,
    sourceUrl: 'https://money.com/crazy-eddie-dies/',
  },
  {
    title: 'Marc Dreier: The Manhattan Lawyer Who Sold $700 Million in Fake Promissory Notes',
    slug: 'marc-dreier-law-firm-fraud',
    author: 'ScamShield Editorial',
    tags: ['notorious', 'notorious-scammer', 'historical'],
    body: `Marc Dreier ran Dreier LLP, a 250-lawyer Manhattan firm he'd built into a real, functioning legal practice — which made him exactly the kind of credible-seeming counterparty who could sell hedge funds something extraordinary: promissory notes issued by his own law firm's real estate clients, paying high returns and backed, he claimed, by those clients' genuine business dealings.

The clients named on the notes were real. The notes themselves, and their supposed sale to Dreier's hedge fund buyers, were not — Dreier fabricated the paperwork and, in some cases, recruited employees to impersonate client representatives on conference calls to convince buyers the deals were legitimate. From 2004 through 2008, he sold roughly $700 million worth of these fictitious notes, and separately misappropriated funds his own law firm was holding in escrow for real clients.

The scheme fell apart in December 2008 when a hedge fund grew suspicious and had Dreier arrested in Toronto while he was impersonating a client's in-house counsel to close a fraudulent deal in person. He pleaded guilty in 2009 to fraud and conspiracy charges; total out-of-pocket losses to victims exceeded $400 million. Judge Jed Rakoff sentenced him to 20 years — far short of the 145 years prosecutors sought, with the judge noting Dreier's fraud, while enormous, lacked the sustained multi-decade betrayal of trust seen in Bernie Madoff's.

Dreier's case is notable for how much of the fraud depended on performance rather than paperwork: fake conference calls, impersonated executives, and the borrowed credibility of a real, respected law firm — proof that a sophisticated buyer doing "diligence" can still be fooled if the person selling them the story is skilled enough at playing every part in it.`,
    sourceUrl: 'https://www.justice.gov/archive/usao/nys/pressreleases/July09/dreiermarcsentencingpr.pdf',
  },
  {
    title: "Dennis Kozlowski and Tyco's $6,000 Shower Curtain",
    slug: 'dennis-kozlowski-tyco-fraud',
    author: 'ScamShield Editorial',
    tags: ['notorious', 'notorious-scammer', 'historical'],
    body: `Dennis Kozlowski spent the 1990s building Tyco International, an industrial conglomerate, into one of the largest companies in America through an aggressive string of acquisitions — and along the way built a personal lifestyle funded largely by money that was never his to spend. As CEO, Kozlowski directed the company to pay him tens of millions of dollars in bonuses and loans that the board had never properly authorized, then had many of those loans quietly forgiven.

The spending became infamous once it became public: a $6,000 gold-and-burgundy shower curtain and a $15,000 umbrella stand for his New York apartment, tens of millions in art purchased partly with company funds routed to avoid New York sales tax, and a $2 million fortieth-birthday party for his wife on the Italian island of Sardinia — complete with a Jimmy Buffett performance and an ice sculpture of Michelangelo's David dispensing vodka — roughly half of which Tyco itself paid for and booked as a business expense.

Kozlowski and Tyco's former CFO, Mark Swartz, were convicted in June 2005 on grand larceny, securities fraud, and falsifying business records, tied to more than $150 million in unauthorized compensation and forgiven loans plus a further $430 million raised through securities fraud. Kozlowski was sentenced to eight and a third to twenty-five years in New York state prison and ordered to pay $134 million in restitution and fines; he served more than six years before being released on parole in 2014.

The Tyco case became one of the defining corporate-excess scandals of the early 2000s accounting-fraud era, alongside Enron and WorldCom — less a hidden bookkeeping scheme than compensation and expenses simply taken without real authorization, hiding in plain sight inside a company's own books until an SEC investigation started asking where the money actually went.`,
    sourceUrl: 'https://www.nbcnews.com/id/wbna9399803',
  },
  {
    title: 'Raj Rajaratnam and the Wiretaps That Ended Insider Trading\'s Quiet Era',
    slug: 'raj-rajaratnam-galleon-insider-trading',
    author: 'ScamShield Editorial',
    tags: ['notorious', 'notorious-scammer', 'historical'],
    coverImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/Raj_Rajaratnam_in_2024.jpg',
    coverImageCredit: 'Photo: Shankar2001 (CC BY-SA 4.0)',
    coverImagePosition: 50,
    body: `Raj Rajaratnam founded the Galleon Group, one of the largest hedge funds in the world at its peak, managing billions of dollars built on what looked like an exceptional research edge. In reality, that edge came substantially from a network of corporate insiders — executives and consultants at companies including IBM, Intel, and Goldman Sachs — whom Rajaratnam cultivated to feed him confidential, market-moving information before it became public.

Rajaratnam would trade on tips about upcoming earnings results, mergers, and other corporate events before the information reached the market, generating profits and avoided losses prosecutors calculated at more than $63 million. What made the case unprecedented was how investigators caught him: rather than building a case solely from suspicious trading patterns after the fact, the FBI obtained wiretaps on Rajaratnam's phone, capturing roughly 2,200 conversations in which he discussed and received inside information in real time — a technique long used in organized-crime and drug cases but never before deployed at this scale against Wall Street insider trading.

Rajaratnam was convicted in May 2011 on 14 counts of securities fraud and conspiracy following a trial built heavily on the wiretap recordings, and was sentenced to 11 years in prison — at the time the longest sentence ever imposed for insider trading — along with a $10 million fine and forfeiture of $53.8 million. The Supreme Court later declined to hear his appeal challenging the case.

The Galleon case reshaped how insider trading gets prosecuted: the wiretap evidence was so effective that federal prosecutors used the same approach in dozens of subsequent Wall Street cases, turning what had been a largely circumstantial, trading-pattern-based crime to prove into one that could be caught on tape, in the insider's own words, while it was happening.`,
    sourceUrl: 'https://www.justice.gov/archive/usao/nys/pressreleases/October11/rajaratnamrajsentencingpr.pdf',
  },
  {
    title: 'Ivan Boesky: The Insider-Trading King Who Turned Informant on Wall Street',
    slug: 'ivan-boesky-insider-trading-scandal',
    author: 'ScamShield Editorial',
    tags: ['notorious', 'notorious-scammer', 'historical'],
    body: `Ivan Boesky was one of the most successful arbitrageurs of the 1980s, a Wall Street trader whose specialty was betting on which companies would be acquired next and buying their stock ahead of the announcement. His reputation for uncanny timing made him wealthy, publicly celebrated, and the inspiration — he later cited it in his own defense — for Gordon Gekko's "greed is good" speech in the film "Wall Street," delivered at a real commencement address Boesky gave the same year his fraud was exposed.

The uncanny timing wasn't skill. Boesky was paying corporate insiders and investment bankers, including Drexel Burnham Lambert's Dennis Levine, for advance word of pending mergers and takeovers before that information became public, then trading on it — the same core crime Michael Milken was later drawn into through his own dealings with Boesky. Boesky's insider network let him buy target-company stock just before announcements sent the price up, profiting at the expense of everyone trading without that advance knowledge.

The SEC caught Levine first, and Levine's cooperation led investigators to Boesky. Facing prosecution, Boesky struck a deal: he pleaded guilty in November 1986 to a single felony securities count, paid a $100 million penalty — at the time the largest ever imposed for insider trading — and agreed to secretly record his own conversations with other Wall Street figures for the SEC, wearing a wire that ultimately helped build the case against Milken. He served roughly two years of a three-and-a-half-year sentence and was permanently barred from the securities industry.

Boesky's case marked the moment insider trading stopped being treated as a quiet, victimless edge and became a defining Wall Street prosecution story of the decade — and his cooperation deal set the template still used today: catch one insider, and use their knowledge of the network to reach everyone above them.`,
    sourceUrl: 'https://www.washingtonpost.com/archive/politics/1986/11/15/wall-street-insider-to-forfeit-100-million/281f0d53-b483-48dc-95e7-8eed903e8855/',
  },
  {
    title: 'Kweku Adoboli and the $2.3 Billion Loss Hidden Inside UBS',
    slug: 'kweku-adoboli-ubs-rogue-trader',
    author: 'ScamShield Editorial',
    tags: ['notorious', 'notorious-scammer', 'historical'],
    coverImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/938149-kweku-adoboli_(7651034606).jpg',
    coverImageCredit: 'Photo: thetaxhaven (CC BY 2.0)',
    coverImagePosition: 50,
    body: `Kweku Adoboli worked as a trader on the exchange-traded funds desk at UBS's London investment bank, a role that came with defined risk limits meant to cap how much the bank could lose on any position he took. Starting around 2008, Adoboli began trading well beyond those authorized limits, and rather than report the resulting losses, he covered them up using fictitious hedge positions — fake internal trades that made his real, unhedged bets disappear from the bank's own risk reports, the same core technique Jérôme Kerviel had used against Société Générale a few years earlier.

The concealment let the losses compound for years without triggering the controls designed to catch them. At the fraud's peak, Adoboli's hidden positions put UBS at risk of losses reaching an estimated $12 billion before the scheme unraveled in September 2011, when he confessed the true size of his positions to colleagues. The bank was ultimately left with a real loss of $2.3 billion — at the time the largest trading loss in British banking history.

Adoboli was convicted in November 2012 on two counts of fraud by abuse of position, with the trial judge telling him he had shown "a strong streak of the gambler" and had wrongly assumed the bank's rules didn't apply to him. He was sentenced to seven years in prison and was released in 2015 after serving half his term; UBS itself was separately fined $47.6 million by British regulators over the control failures that let the losses go undetected for so long.

Adoboli's case, arriving just years after Kerviel's, showed that Barings-style rogue trading hadn't been solved by better internal controls alone — a trader who understood exactly how his bank's oversight systems worked could still hide a catastrophic position in plain sight, so long as it kept looking profitable enough that nobody looked closely.`,
    sourceUrl: 'https://www.ibtimes.co.uk/rogue-trader-kewku-adoboli-ubs-fraud-conviction-406738',
  },
  {
    title: "Lee Farkas and the $2.9 Billion Fraud That Sank Colonial Bank",
    slug: 'lee-farkas-colonial-bank-fraud',
    author: 'ScamShield Editorial',
    tags: ['notorious', 'notorious-scammer', 'historical'],
    body: `Lee Farkas owned and chaired Taylor, Bean & Whitaker (TBW), once one of the largest mortgage lenders in the United States, built on a close financial relationship with Colonial Bank, a major regional bank that processed and funded TBW's mortgages through its Mortgage Warehouse Lending Division. When TBW's own finances began collapsing under overdrafts it couldn't cover, Farkas and his co-conspirators didn't disclose the shortfall — they hid it.

Farkas directed a scheme that shuffled fake and already-sold mortgage loans between TBW and Colonial Bank's books to cover the growing hole, while separately misappropriating more than $1.5 billion from Ocala Funding, a mortgage facility TBW controlled, to pay TBW's own operating expenses. Colonial Bank, believing it held legitimate, adequately collateralized assets, was in fact carrying assets that had already been sold elsewhere or didn't exist as claimed. Farkas personally used the proceeds to buy a private jet, multiple vacation homes, and a collection of antique cars.

The fraud, which prosecutors calculated at $2.9 billion and which had run for more than seven years, collapsed in 2009 when Colonial Bank failed — at the time the sixth-largest bank failure in U.S. history — and TBW filed for bankruptcy the same month, putting thousands of employees out of work. Farkas was convicted in 2011 on 14 counts including conspiracy, bank fraud, wire fraud, and securities fraud, and was sentenced to 30 years in federal prison, with a $38.5 million forfeiture order.

The Colonial Bank collapse is a reminder that mortgage fraud isn't limited to individual borrowers lying on an application — at sufficient scale, the same basic mechanism of moving fake or double-counted assets between books can bring down a major regional bank and cost thousands of ordinary employees their jobs, years after the housing crisis that first exposed how much of the mortgage industry's paperwork didn't hold up to scrutiny.`,
    sourceUrl: 'https://www.justice.gov/archives/opa/pr/former-chairman-taylor-bean-whitaker-sentenced-30-years-prison-and-ordered-forfeit-385',
  },
  {
    title: 'Toshihide Iguchi and the $1.1 Billion Hidden Inside Daiwa Bank for 11 Years',
    slug: 'toshihide-iguchi-daiwa-bank-rogue-trader',
    author: 'ScamShield Editorial',
    tags: ['notorious', 'notorious-scammer', 'historical'],
    coverImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/Toshihide-Iguchi.png',
    coverImageCredit: 'Photo: Globalkitty (CC BY-SA 3.0)',
    coverImagePosition: 50,
    body: `Toshihide Iguchi worked as a bond trader at Daiwa Bank's New York branch, a role that — much like Nick Leeson's at Barings a decade later — combined trading authority with control over settling his own trades. Starting in 1984, unauthorized trades began losing money, and rather than report the losses, Iguchi began covering them up by secretly selling off bank-owned and customer-owned securities held in Daiwa's New York vault without authorization.

The concealment continued for eleven years and an estimated 30,000 unauthorized trades. Iguchi forged trading records, falsified statements, and hid trade confirmations to keep the losses invisible to Daiwa's head office in Japan, all while the hidden hole in the bank's books kept growing. In July 1995, Iguchi finally confessed the full scope of the fraud directly to Daiwa's president in a lengthy letter — but instead of immediately disclosing it to U.S. regulators as required, two senior Daiwa managers allegedly urged him to keep concealing the losses for several more months while the bank tried to manage the fallout quietly.

By the time it became public in September 1995, the hidden losses totaled $1.1 billion. Iguchi was arrested and pleaded guilty to conspiracy and record-falsification charges, and was sentenced in 1996 to four years in federal prison and a $2.6 million fine. Daiwa Bank itself was separately prosecuted for concealing the fraud from U.S. regulators, pleaded guilty, paid a $340 million fine, and was forced to shut down all of its U.S. banking operations entirely — one of the most severe penalties ever imposed on a foreign bank in America.

The Daiwa case became a landmark example of why regulators treat a cover-up as seriously as the underlying loss: the trading losses alone might have been a survivable, disclosable event, but the decade-long concealment — and senior management's participation in extending it even after learning the truth — is what ended Daiwa's ability to operate in the United States at all.`,
    sourceUrl: 'https://www.upi.com/Archives/1995/09/26/Daiwa-Bank-scandal-figure-arrested/6472812088000/',
  },
  {
    title: '"Mr. Copper" Yasuo Hamanaka and the $2.6 Billion Attempt to Corner a Global Metal Market',
    slug: 'yasuo-hamanaka-sumitomo-copper-scandal',
    author: 'ScamShield Editorial',
    tags: ['notorious', 'notorious-scammer', 'historical'],
    body: `Yasuo Hamanaka was Sumitomo Corporation's chief copper trader for more than two decades, controlling such a large share of the world's copper trading that he was nicknamed "Mr. Five Percent" for the portion of global annual supply he was said to influence. For years he was viewed inside Sumitomo as a star performer, generating profits the company was reluctant to question too closely.

Behind that performance, Hamanaka had spent roughly a decade running unauthorized trades far beyond his mandate, and for years used forged signatures of his former supervisors to keep settling trades and hiding losses without proper authorization after his formal trading authority had technically lapsed. He also used his market position in an attempt to corner the world copper market on the London Metal Exchange, building up enormous concentrated positions that depended on prices continuing to move in his favor.

When copper prices moved against him, the losses Hamanaka had been hiding could no longer be contained. Sumitomo announced in June 1996 that it had uncovered unauthorized trading, initially disclosing roughly $1.8 billion in losses — a figure that grew as the full scope became clear, eventually totaling around $2.6 billion, at the time the largest trading loss in history. The company also separately paid $150 million to settle U.S. and U.K. regulatory charges that Hamanaka's scheme had illegally attempted to manipulate global copper prices.

Hamanaka was convicted in Tokyo in 1998 of fraud and forgery, including defrauding Sumitomo's own Hong Kong subsidiary out of $770 million, and was sentenced to eight years in prison; he was released in 2005. The case remains a defining example of commodity-market manipulation: unlike a Ponzi scheme or an accounting fraud, Hamanaka's losses came from actually trying to control the price of a real physical commodity traded globally — proof that a single trader's concealed position can move an entire world market before anyone outside the scheme even realizes what's happening.`,
    sourceUrl: 'https://www.japantimes.co.jp/news/1998/03/26/national/rogue-copper-trader-draws-eight-year-prison-term/',
  },
  {
    title: 'Barry Minkow: The Teenage Fraudster Who Conned Wall Street, Then Conned His Own Church',
    slug: 'barry-minkow-zzzz-best-fraud',
    author: 'ScamShield Editorial',
    tags: ['notorious', 'notorious-scammer'],
    body: `Barry Minkow started a carpet-cleaning business, ZZZZ Best, out of his parents' garage at age 16, and by his early twenties had taken it public, presenting himself to Wall Street as a teenage self-made millionaire running one of the fastest-growing companies in the country. Much of that growth was built on a business that barely existed: ZZZZ Best claimed a large, lucrative insurance-restoration division that supposedly repaired water- and fire-damaged buildings, when in reality the large majority of that division's contracts were entirely fabricated.

To make the fake division look real to auditors and investors, Minkow and his associates staged elaborate fronts — renting office space and construction sites, forging invoices and insurance paperwork, and even taking auditors on guided tours of buildings that had nothing to do with any real ZZZZ Best contract. The scheme also relied heavily on credit card fraud to fund the appearance of legitimate cash flow. ZZZZ Best's stock briefly valued the company at over $200 million before the fraud collapsed in 1987, wiping out investors and lenders to the tune of roughly $100 million.

Minkow was convicted in 1988 on 57 counts including racketeering, securities fraud, and money laundering, and was sentenced to 25 years in federal prison; he served just over seven. After his release in 1995, he reinvented himself as a pastor and fraud investigator, founding the Fraud Discovery Institute and assisting the FBI in uncovering other white-collar schemes — until 2011, when he pleaded guilty to a new fraud, having secretly manipulated a company's stock price while also embezzling more than $3 million from his own San Diego congregation. He was sentenced to five more years in federal prison for that second fraud.

Minkow's case is unusual for having two separate, fully documented fraud convictions decades apart, the second one committed by a man who had spent years publicly building a reputation as a reformed fraud-fighter — a reminder that a demonstrated capacity for elaborate, sustained deception doesn't reliably go away just because the second act looks like redemption.`,
    sourceUrl: 'https://www.justice.gov/usao-sdca/pr/former-inmate-turned-pastor-barry-minkow-pleads-guilty-bilking-congregation',
  },
  {
    title: 'Robert Vesco: The Fugitive Financier Who Looted $224 Million and Vanished for 35 Years',
    slug: 'robert-vesco-ios-fraud-fugitive',
    author: 'ScamShield Editorial',
    tags: ['notorious', 'notorious-scammer', 'historical'],
    body: `Robert Vesco built a career as a corporate takeover specialist before gaining control of Investors Overseas Services (IOS), a sprawling Swiss-based mutual fund complex managing money for hundreds of thousands of investors worldwide. Rather than manage IOS's funds as advertised, Vesco directed them into a web of banks and shell companies he secretly controlled, using the structure to siphon investor money out for himself.

The SEC calculated that Vesco and his associates looted roughly $224 million from IOS's funds, defrauding the ordinary investors whose money was supposed to be professionally invested. Facing prosecution in 1972, Vesco simply left the country rather than answer the charges, beginning one of the longest fugitive runs in American financial history. He was also indicted separately for funneling $250,000 in illegal secret contributions to Richard Nixon's 1972 re-election campaign in an alleged attempt to influence the SEC investigation against him.

For the next three decades, Vesco lived as a wealthy exile across Costa Rica, the Bahamas, Nicaragua, and Antigua, at various points allegedly brokering arms deals and cultivating relationships with foreign governments to secure protection from extradition. He eventually settled in Cuba under Fidel Castro's government, reportedly living under state protection for years, before Cuban authorities themselves arrested and convicted him in 1996 on fraud charges related to a separate business deal gone bad with Cuban officials. He served roughly a decade in a Cuban prison and died in Havana in 2007, having never faced the original U.S. charges.

Vesco's case remains a landmark example of how a fraud can outlast prosecution entirely: unlike almost every other figure in this collection, he was never extradited, never tried in the United States, and effectively spent the second half of his life demonstrating that becoming a permanent fugitive was, for him, a more survivable outcome than facing the consequences of the fraud itself.`,
    sourceUrl: 'https://www.britannica.com/biography/Robert-L-Vesco',
  },
  {
    title: "Reed Slatkin's $593 Million Ponzi Scheme Built on Fellow Scientologists' Trust",
    slug: 'reed-slatkin-scientology-ponzi-scheme',
    author: 'ScamShield Editorial',
    tags: ['notorious', 'notorious-scammer', 'historical'],
    body: `Reed Slatkin was an early internet entrepreneur — a co-founder of EarthLink — and a prominent Scientologist who spent 15 years, from 1986 to 2001, presenting himself to fellow Scientologists as a gifted private investment adviser. He told investors, many of them fellow church members including several celebrities, that he was earning them consistent annual returns of around 24 percent, backed by fabricated account statements showing investment activity that was never actually happening at anywhere near that scale.

In reality, Slatkin was running a Ponzi scheme, paying "returns" to earlier investors using money raised from new ones rather than any real investment gains. Trust within the tight-knit Scientology community was central to how the fraud spread and persisted for so long: victims recruited other victims, largely because Slatkin's standing within the church made his claims seem credible without the kind of outside scrutiny an unaffiliated financial adviser might have faced.

The scheme collapsed in 2001 when Slatkin filed for bankruptcy, and investigators found he had raised roughly $593 million from about 800 investors over the scheme's life. He pleaded guilty in 2002 to 15 felony counts including mail fraud, wire fraud, money laundering, and conspiracy to obstruct justice, and was sentenced to 14 years in federal prison; he served about 10 years. The Church of Scientology itself was not accused of orchestrating the fraud, but separately agreed to repay $3.5 million to the bankruptcy estate that had been donated to Scientology-affiliated causes using defrauded investor money.

Slatkin's case is a clear illustration of "affinity fraud" — schemes that spread through a shared community, religious group, or social network specifically because the fraudster's membership in that group substitutes for the due diligence investors would normally apply to a stranger, letting the fraud reach a scale that a fraudster without that built-in trust could never have achieved.`,
    sourceUrl: 'https://www.sec.gov/enforcement-litigation/litigation-releases/lr-18323',
  },
  {
    title: 'Norman Hsu: The Political Fundraiser Whose Ponzi Scheme Funded His Own Influence',
    slug: 'norman-hsu-political-fundraiser-ponzi-scheme',
    author: 'ScamShield Editorial',
    tags: ['notorious', 'notorious-scammer', 'historical'],
    body: `Norman Hsu spent roughly a decade telling investors he could deliver 14 to 20 percent returns by financing clothing and technology import ventures, raising more than $50 million from hundreds of people who believed they were backing real merchandise deals. In reality, Hsu was running a straightforward Ponzi scheme, paying off earlier investors with money raised from new ones while personally spending much of the rest.

What set Hsu apart was how he used a portion of that stolen money: he became one of the Democratic Party's most prolific political fundraisers of the mid-2000s, personally donating heavily and bundling contributions from others to campaigns including Hillary Clinton's 2008 presidential run, while also hosting a fundraising event for Barack Obama's political action committee. Prosecutors said the lavish giving was a deliberate strategy — raising Hsu's public profile and credibility to help him recruit more investors into the fraud. He also illegally routed contributions through other people's names to get around individual donation limits, a separate federal campaign-finance crime.

The fraud began unraveling in 2007 when reporters discovered Hsu had skipped sentencing on an earlier, unrelated 1990s fraud conviction in California and had been a fugitive for 15 years while building his new fundraising career. He was arrested, and the renewed scrutiny exposed the Ponzi scheme underneath his political giving. Hsu pleaded guilty to fraud and separately was convicted on campaign-finance charges, and in 2009 was sentenced to just over 24 years in federal prison, plus an additional three years to resolve the original California case he had fled.

Hsu's case is a striking example of how stolen money can be recycled into apparent legitimacy: political access and visibility bought with fraud proceeds functioned as marketing for the fraud itself, letting a fugitive con man operate inside rooms with major national political figures for years before anyone checked his background.`,
    sourceUrl: 'https://www.fbi.gov/newyork/press-releases/2009/nyfo092909.htm',
  },
  {
    title: 'Kirk Wright and the Hedge Fund That Targeted His Own NFL Client Base',
    slug: 'kirk-wright-international-management-associates-fraud',
    author: 'ScamShield Editorial',
    tags: ['notorious', 'notorious-scammer', 'historical'],
    body: `Kirk Wright founded International Management Associates, an Atlanta hedge fund that built much of its client base by specifically courting current and former NFL players, marketing itself through sports-industry connections as a trusted destination for athletes' investment money. From 1997 onward, Wright told clients their money was earning steady returns in the market, backing those claims with falsified account statements.

The fund was actually losing money for years, but Wright kept the illusion going by fabricating documents and using new client deposits to make it appear existing accounts were growing. Prosecutors said he personally spent client money on jewelry, real estate, luxury vehicles, and a $500,000 wedding, while investigators eventually calculated that Wright had taken in between $115 million and $185 million from roughly 500 investors. Among the victims were six former NFL players — including Steve Atwater, Blaine Bishop, and Clyde Simmons — who together lost more than $20 million and later sued the NFL Players Association over its vetting of Wright as a registered financial adviser.

Wright was convicted in May 2008 on 47 counts of fraud and money laundering, facing a maximum sentence of up to 710 years. Rather than wait for sentencing, he took his own life in his jail cell ten days after the verdict, hanging himself with a rope made from bedsheets.

The case became a pointed example of affinity fraud aimed specifically at professional athletes — a population with sudden wealth, limited financial oversight infrastructure, and a peer network that made referrals from one trusted teammate to another spread the fraud efficiently — and prompted renewed scrutiny of how sports leagues and players' unions vet the financial advisers marketed to their members.`,
    sourceUrl: 'https://www.cnbc.com/2008/05/21/fund-manager-convicted-faces-up-to-710-years.html',
  },
  {
    title: 'Nevin Shapiro: The $930 Million Ponzi Schemer Behind a College Football Scandal',
    slug: 'nevin-shapiro-capitol-investments-ponzi-scheme',
    author: 'ScamShield Editorial',
    tags: ['notorious', 'notorious-scammer'],
    coverImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/Nevin_Shapiro,_2020_(cropped).jpg',
    coverImageCredit: 'Photo: ILLideL (CC BY-SA 4.0)',
    coverImagePosition: 50,
    body: `Nevin Shapiro founded Capitol Investments USA, telling investors the company profited by purchasing wholesale groceries in bulk and reselling them to retailers at a markup. Between 2005 and 2009, he raised roughly $930 million from investors on the strength of that story, paying "returns" to earlier backers using money raised from new ones rather than any real grocery-trading profits.

Away from the fraud, Shapiro cultivated a second, very public identity as a lavish University of Miami football booster, showering players with cash, jewelry, cars, and paid trips over nearly a decade. He later admitted to providing improper benefits to more than 70 UM athletes and student-athletes, a confession that triggered a major NCAA investigation once his Ponzi scheme collapsed and exposed the source of his spending — the NCAA ultimately placed the university on three years' probation and stripped scholarships as a result.

The Ponzi scheme fell apart in 2009 when Shapiro could no longer raise enough new money to cover what he owed earlier investors. He pleaded guilty to securities fraud and money laundering and was sentenced in 2011 to 20 years in federal prison, along with nearly $83 million in restitution. He served more than a decade before being released during the COVID-19 pandemic due to health issues, and the remainder of his sentence was commuted by President Biden in December 2024.

Shapiro's case is unusual for how directly the stolen money became public spectacle rather than staying hidden: rather than quietly enjoying his gains, he spent lavishly and visibly on a major college sports program, and it was that very visibility — an NCAA investigation into recruiting violations — that ultimately helped expose the underlying fraud.`,
    sourceUrl: 'https://www.espn.com/college-football/story/_/id/6866006/ponzi-schemer-nevin-shapiro-says-provided-benefits-miami-athletes',
  },
  {
    title: "Paul Burks and ZeekRewards, the $600 Million Online Ponzi Disguised as a Rewards Program",
    slug: 'paul-burks-zeekrewards-ponzi-scheme',
    author: 'ScamShield Editorial',
    tags: ['notorious', 'notorious-scammer', 'historical'],
    body: `Paul Burks ran ZeekRewards, an online "rewards" program tied to a penny-auction website called Zeekler, telling participants they could earn substantial daily returns by purchasing sample bids and then reselling them to other users, framed as a business opportunity rather than an investment. Between January 2011 and August 2012, ZeekRewards drew in more than $600 million from roughly one million people in the United States and abroad.

The SEC found that the "returns" paid to participants bore almost no relationship to any real business activity — approximately 98 percent of ZeekRewards' payouts came directly from money contributed by newer participants, the defining structure of a Ponzi scheme, compounded by a recruitment-driven pyramid structure that rewarded participants for bringing in new members. The company's promotional materials never disclosed this to the people signing up.

The SEC shut the operation down in August 2012 with an emergency asset freeze, and Burks agreed to a civil settlement giving up his interest in the company and paying a $4 million penalty. Criminal prosecution followed years later: a federal jury convicted Burks in 2016 on wire fraud, mail fraud, and tax fraud conspiracy charges, with prosecutors by then calculating the scheme's full scope at roughly $900 million. He was sentenced in 2017 to more than 14 years in federal prison and ordered to pay $244 million in restitution.

ZeekRewards is a textbook illustration of how a Ponzi scheme can hide inside an ordinary-sounding online business model — a "rewards program" tied to a real, functioning website — making the underlying math (new money paying old promises) far harder for an everyday participant to spot than a scheme that presents itself plainly as an investment.`,
    sourceUrl: 'https://www.sec.gov/newsroom/press-releases/2012-2012-160htm',
  },
  {
    title: 'Frank Gruttadauria: The Star Broker Who Faked Statements for 15 Years',
    slug: 'frank-gruttadauria-broker-fraud',
    author: 'ScamShield Editorial',
    tags: ['notorious', 'notorious-scammer', 'historical'],
    body: `Frank Gruttadauria was a star branch manager at two well-known Wall Street firms in succession — first Cowen & Co. and SG Cowen Securities, then Lehman Brothers — trusted by dozens of wealthy clients to manage their brokerage accounts out of his Cleveland, Ohio office. Behind that trusted reputation, Gruttadauria was quietly diverting client funds and covering the gap by mailing his clients entirely fabricated account statements, showing balances and returns that bore no relationship to what was actually left in their accounts.

The SEC found that from at least 1996 through October 2000, Gruttadauria misappropriated more than $25 million in customer funds while at Cowen and SG Cowen, and after moving to Lehman Brothers, continued the scheme, ultimately taking more than $40 million from over 50 clients combined across both firms. He maintained a duplicate set of fake statements specifically to show clients and auditors who asked questions, while the real account records told a very different story.

The fraud finally collapsed in 2002 when a client's inquiry exposed the discrepancy between what Gruttadauria was reporting and what his firm's actual records showed. He pleaded guilty to securities and mail fraud and was sentenced to seven years in federal prison. Both SG Cowen and Lehman Brothers separately settled SEC and NYSE enforcement actions over supervisory failures that let Gruttadauria's fraud go undetected for so long. Gruttadauria himself later said he was astonished he had gotten away with it for as long as he had.

The case became a significant example of supervisory failure at the firm level: the fraud wasn't especially technically sophisticated — duplicated paperwork and a trusted manager's reputation were enough — but it exposed how little independent verification some brokerage clients' account statements actually received, even at major, well-regarded firms.`,
    sourceUrl: 'https://www.sec.gov/news/press/2003-96.htm',
  },
  {
    title: 'Christopher Skase and the $1.5 Billion Qintex Collapse He Never Answered For',
    slug: 'christopher-skase-qintex-collapse-fugitive',
    author: 'ScamShield Editorial',
    tags: ['notorious', 'notorious-scammer', 'historical'],
    body: `Christopher Skase built the Qintex Group into one of Australia's most prominent media and resort conglomerates through the 1980s, becoming a celebrated symbol of the decade's corporate excess before it all came apart. When Qintex collapsed in 1989, it left creditors holding losses estimated at roughly $1.5 billion, one of the largest corporate failures in Australian history at the time.

Australian authorities charged Skase with more than 30 company-law offenses, accusing him of misusing his position as a Qintex director in connection with millions of dollars in company funds. Rather than face trial, Skase left Australia in 1991 and settled on the Spanish resort island of Majorca, beginning a decade-long fight against extradition that Spanish courts consistently allowed him to win, largely on the strength of his claims of serious, travel-prohibiting illness.

Those claims became a matter of public dispute: Australian authorities released video, reportedly filmed by tourists, appearing to show Skase walking normally on a Majorca beach, directly contradicting the incapacitation described in his extradition defense. Spain never extradited him. Skase died in Majorca in 2001 of stomach cancer, ten years after fleeing and without ever standing trial in Australia on any of the charges filed against him.

Skase's case remains one of Australia's most prominent examples of a corporate fraud allegation that was never resolved by a court at all — a reminder that even a well-documented, multi-billion-dollar collapse can end not in conviction or acquittal, but in an unresolved decade-long stalemate that outlasts the person accused.`,
    sourceUrl: 'https://www.majorcadailybulletin.com/news/local/2001/08/05/3485/christopher-skase-dies-majorca.html',
  },
  {
    title: "Sam Waksal: The ImClone Tip That Brought Down Martha Stewart Too",
    slug: 'sam-waksal-imclone-insider-trading',
    author: 'ScamShield Editorial',
    tags: ['notorious', 'notorious-scammer', 'historical'],
    body: `Sam Waksal founded and ran ImClone Systems, a biotech company whose future largely hinged on FDA approval of its experimental cancer drug Erbitux. In late December 2001, Waksal learned ahead of the public that the FDA was about to reject ImClone's application — devastating news that would tank the stock once announced.

Rather than simply absorb the loss, Waksal tried to sell his own ImClone shares immediately and tipped off family members, including his daughter, to do the same before the rejection became public. That same tip chain reached his stockbroker's other clients, including Martha Stewart, who sold nearly 4,000 ImClone shares the day before the news broke, avoiding a loss of roughly $45,673 — a relatively small sum that nonetheless triggered one of the most publicized insider-trading scandals of the decade.

Waksal pleaded guilty in 2002 to securities fraud, bank fraud, and tax evasion, and was sentenced to more than seven years in federal prison along with a $3 million fine. Stewart herself was never charged with insider trading directly, since prosecutors couldn't prove she knew the specific reason for the sale — but she was convicted in 2004 of obstruction of justice and lying to federal investigators about the circumstances of her stock sale, and served five months in prison.

The ImClone case is notable for how far a single piece of leaked information traveled before the damage was contained — from a CEO learning bad news early, through a family tip, to a broker's other client, to a criminal case that ultimately sent a media mogul to prison not for the trade itself, but for how she handled being asked about it afterward.`,
    sourceUrl: 'https://www.sec.gov/enforcement-litigation/litigation-releases/lr-19794',
  },
  {
    title: "Angelo Mozilo and the $67.5 Million Settlement Behind Countrywide's Subprime Collapse",
    slug: 'angelo-mozilo-countrywide-financial-fraud',
    author: 'ScamShield Editorial',
    tags: ['notorious', 'notorious-scammer', 'historical'],
    coverImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/Angelo_Mozilo_2002_(cropped).jpeg',
    coverImageCredit: 'Photo: Ron Bennett / HUD (Public Domain)',
    coverImagePosition: 65,
    body: `Angelo Mozilo co-founded Countrywide Financial and built it into the largest mortgage lender in the United States, aggressively expanding into subprime lending — loans to borrowers with weaker credit, often on terms that became unaffordable once introductory rates expired. As the housing market boomed through the 2000s, Countrywide's growth made Mozilo one of the most prominent and highly paid executives in American finance.

The SEC alleged that Mozilo and two other Countrywide executives knew the company's loan portfolio was carrying far more risk than investors were being told, misrepresenting the true quality of the mortgages Countrywide was originating and packaging for sale, even as internal communications showed executives privately describing some of the loan products as dangerous. The SEC separately accused Mozilo of insider trading, alleging he sold Countrywide shares worth tens of millions of dollars while aware of problems he wasn't disclosing to shareholders.

As the subprime mortgage crisis unfolded in 2007 and 2008, Countrywide's loan losses mounted and the company was sold to Bank of America in a rescue acquisition. Federal prosecutors ultimately declined to bring criminal charges against Mozilo, but in October 2010 he agreed to pay $67.5 million to settle the SEC's civil fraud and insider-trading case — without admitting wrongdoing — and accepted a permanent bar from ever again serving as an officer or director of a public company.

Mozilo's case became one of the defining examples of executive accountability, or the lack of it, following the 2008 financial crisis: a company at the center of the subprime lending collapse, a large civil penalty, and no criminal charges at all — a pattern repeated across much of the crisis-era financial industry and a frequent point of criticism about how differently white-collar and street-level fraud get prosecuted.`,
    sourceUrl: 'https://www.sec.gov/news/press/2010/2010-197.htm',
  },
  {
    title: "Robert Maxwell and the £460 Million Vanished From His Employees' Pensions",
    slug: 'robert-maxwell-pension-fund-fraud',
    author: 'ScamShield Editorial',
    tags: ['notorious', 'notorious-scammer', 'historical'],
    coverImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/Robert_Maxwell_1989.jpg',
    coverImagePosition: 50,
    body: `Robert Maxwell built a publishing empire spanning Mirror Group Newspapers, Maxwell Communication Corporation, and the market research firm AGB, becoming one of Britain's most powerful media figures through the 1980s. Behind the public image, Maxwell was quietly using his employees' pension funds as his personal source of liquidity — pledging pension assets as collateral for loans to his private companies and using pension money to prop up the price of his own publicly traded shares.

By the time Maxwell was found dead in the Atlantic Ocean off the Canary Islands on 5 November 1991, having disappeared from his yacht overnight, investigators discovered that roughly £460 million had gone missing from the pension schemes of Mirror Group Newspapers, Maxwell Communication Corporation, and AGB — funds meant to support around 30,000 current and former employees' retirements. His death, officially ruled an accidental drowning, cut off the one person who fully understood how his tangled web of companies actually moved money between them, and the fraud only became fully visible once he was no longer alive to keep shifting funds to cover the gaps.

The Serious Fraud Office charged Maxwell's sons, Kevin and Ian, who had held senior roles in the family businesses, with conspiracy to defraud the pension funds. After an eight-month trial, a London jury acquitted both brothers in January 1996 — meaning no one was ever criminally convicted over the theft of nearly half a billion pounds from company pension schemes, since the one person prosecutors considered most responsible had died before he could be charged.

The Maxwell scandal became the direct catalyst for the UK's Pensions Act 1995, which introduced stricter rules on how pension trustees could invest scheme assets and created new oversight specifically designed to prevent an employer from treating a pension fund as its own bank account. It remains one of the starkest examples of a fraud whose consequences fell hardest on the very people it targeted — pensioners eventually recovered only part of what they'd lost, even with a partial industry and government bailout.`,
    sourceUrl: 'https://moneyweek.com/505757/great-frauds-in-history-robert-maxwell',
  },
  {
    title: 'Asil Nadir and the Polly Peck Collapse He Fled For 17 Years',
    slug: 'asil-nadir-polly-peck-fraud',
    author: 'ScamShield Editorial',
    tags: ['notorious', 'notorious-scammer', 'historical'],
    body: `Asil Nadir built Polly Peck International from a small textile trading company into a sprawling conglomerate spanning fruit distribution, electronics, and other ventures, becoming one of the London Stock Exchange's fastest-growing companies of the 1980s and one of Britain's richest men in the process.

Polly Peck collapsed in 1990 after the UK's Serious Fraud Office opened an investigation into Nadir's handling of the company's finances, and he was charged with 66 counts of theft and false accounting, with prosecutors alleging he had diverted company money to himself, his family, and associates. In May 1993, while out on bail awaiting trial, Nadir fled Britain on a private jet for Northern Cyprus, which had no extradition treaty with the UK — and stayed there as a fugitive for the next 17 years.

Nadir voluntarily returned to the UK in August 2010 to face trial, maintaining his innocence and stating he wanted to clear his name. After a seven-month Old Bailey trial, a jury convicted him in August 2012 on 10 counts of theft totalling nearly £29 million, acquitting him on three other counts, and he was sentenced to 10 years in prison. In 2016, after serving four years, he was transferred to a prison in Turkey under a prisoner-exchange agreement — and was released after spending just a single night there, returning to Northern Cyprus to a warm public welcome.

Nadir, who died in February 2025 at age 83, remained a divisive figure in Britain for decades after Polly Peck's collapse: a former Conservative Party donor whose case became tangled in questions about political influence and delayed prosecution, and a fugitive whose eventual voluntary return and trial closed out one of the longest-running unresolved corporate fraud cases in British history.`,
    sourceUrl: 'https://cyprus-mail.com/2025/02/09/asil-nadir-dead',
  },
  {
    title: "Conrad Black and the Hollinger International Fraud That Ended a Newspaper Empire",
    slug: 'conrad-black-hollinger-international-fraud',
    author: 'ScamShield Editorial',
    tags: ['notorious', 'notorious-scammer', 'historical'],
    coverImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/Conrad_Black_mug_shot.jpg',
    coverImagePosition: 50,
    body: `Conrad Black built Hollinger International into one of the world's largest newspaper empires, owning titles including Britain's Daily Telegraph, Canada's National Post, and the Chicago Sun-Times, and became one of the most prominent media barons of his era. As Hollinger sold off newspaper properties through the early 2000s, prosecutors alleged that Black and several other executives diverted millions of dollars meant for the company into their own pockets, disguised as "non-compete" payments — fees the buyers of Hollinger's newspapers paid supposedly to keep Hollinger itself from launching competing publications, money that should have gone to Hollinger's shareholders rather than its executives.

A federal jury in Chicago convicted Black in July 2007 of three counts of mail fraud and one count of obstruction of justice, while acquitting him of nine other charges including racketeering. The obstruction charge stemmed from video surveillance that caught Black removing 13 boxes of documents from his Toronto office after a court order had specifically barred him from taking away anything that could be evidence for a federal grand jury.

Black was sentenced to six and a half years in prison and ordered to pay a fine, though an appeals court later threw out two of his three fraud convictions on narrower legal grounds, leaving one fraud count and the obstruction conviction standing; he ultimately served roughly three and a half years before his release. In 2019, U.S. President Donald Trump granted Black a full pardon.

Black's case became a widely cited example of how a media proprietor's control over public companies can blur into personal enrichment at shareholders' expense — and of how a single piece of video evidence, showing him carrying boxes out of an office in defiance of a court order, ended up mattering as much to the outcome as the underlying financial fraud itself.`,
    sourceUrl: 'https://www.npr.org/2007/07/13/11948939/conrad-black-convicted-of-fraud',
  },
  {
    title: 'Kenneth Starr: The Financial Adviser to the Stars Who Stole From His Own Clients',
    slug: 'kenneth-starr-celebrity-money-manager-fraud',
    author: 'ScamShield Editorial',
    tags: ['notorious', 'notorious-scammer', 'historical'],
    body: `Kenneth Starr ran a New York financial management firm that built a client roster of wealthy entertainment-industry names, advising on investments, taxes, and personal finances for people whose public profile made them unlikely to closely scrutinize where their money actually went. Behind that reputation, prosecutors found, Starr was quietly diverting client funds for his own use rather than investing them as promised.

Starr pleaded guilty in 2010 to wire fraud, money laundering, and investment adviser fraud, admitting he had cheated nine wealthy and elderly clients out of more than $30 million by secretly funneling their money into risky, undisclosed investments or simply spending it himself, including on his own multimillion-dollar Manhattan apartment. Prosecutors noted that his stable of celebrity clients over the years included figures like Wesley Snipes, Sylvester Stallone, and Martin Scorsese — though there was no indication those particular clients were among the nine victims of the scheme itself.

A federal judge sentenced Starr to seven and a half years in prison. The case drew heavy media attention for the gap between Starr's carefully built image as a trusted adviser to the famous and the far more ordinary reality of the fraud: a money manager quietly draining the accounts of clients — mostly older, wealthy individuals, not the celebrities whose names lent his firm its credibility — who trusted him enough not to ask too many questions.

Starr's case is a reminder that a fraudster's most valuable asset is often reputation by association: a client list full of famous names can function as an implicit credential, even when those names have nothing to do with — and no awareness of — the fraud actually taking place.`,
    sourceUrl: 'https://www.cbsnews.com/news/kenneth-starr-fraud-ex-adviser-to-the-stars-sentenced-in-federal-fraud-case/',
  },
  {
    title: 'Sholam Weiss and the 845-Year Sentence Behind the Largest Insurance Collapse in U.S. History',
    slug: 'sholam-weiss-national-heritage-life-insurance-fraud',
    author: 'ScamShield Editorial',
    tags: ['notorious', 'notorious-scammer', 'historical'],
    coverImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/Sholam_Weiss.jpg',
    coverImageCredit: 'Photo: Lexjuris (CC BY-SA 4.0)',
    coverImagePosition: 50,
    body: `Sholam Weiss was a key figure behind the collapse of Orlando-based National Heritage Life Insurance Company in the 1990s, part of a scheme that federal authorities said siphoned roughly $450 million out of the insurer through worthless stocks and inflated mortgage investments. The company's failure — described by prosecutors as the largest insurance-company collapse caused by criminal acts in U.S. history — wiped out policies held by tens of thousands of ordinary customers across 15 states.

Rather than face the jury's verdict, Weiss fled the country while deliberations were still underway in October 1999, eventually surfacing in Vienna, Austria, where he was apprehended and extradited back to the United States in 2002. In February 2000, in his absence, a federal court in Orlando convicted him on 78 counts of racketeering, wire fraud, money laundering, and obstruction of justice, and sentenced him to 845 years in prison — later reduced to 835 years in 2009 — one of the longest sentences ever handed down for a white-collar crime in American history, alongside a $123.4 million fine and orders to pay $125 million in restitution.

Weiss served just over 18 years before President Trump commuted his sentence on his final night in office in January 2021, citing Weiss's age, health, and the restitution he had already paid; he was released the next day. The commutation drew sharp criticism from the FBI agent who had investigated the case, who said the roughly 29,000 people whose annuities were wiped out would have voted unanimously against it.

The sheer scale of Weiss's original sentence — hundreds of years beyond any human lifespan — became almost as well known as the fraud itself, a symbol of how disproportionate white-collar sentencing calculations can look on paper even when, as this case ultimately showed, executive clemency can still cut a decades-long sentence down to less than two.`,
    sourceUrl: 'https://www.wftv.com/news/local/sentenced-845-years-prison-released-by-trump/XWWR4PN5FVFO5D7UAKB3BQZTQQ/',
  },
  {
    title: 'R. Foster Winans: The Wall Street Journal Columnist Who Traded on His Own Column',
    slug: 'r-foster-winans-heard-on-the-street-insider-trading',
    author: 'ScamShield Editorial',
    tags: ['notorious', 'notorious-scammer', 'historical'],
    body: `R. Foster Winans co-wrote The Wall Street Journal's influential "Heard on the Street" column in the early 1980s, a daily feature widely understood on Wall Street to move stock prices simply by discussing a company favorably or unfavorably. Winans began secretly tipping off a stockbroker at Kidder, Peabody & Co. about which companies his column would cover, and when, before each piece was published — giving the broker, and eventually a small ring of traders, the ability to buy or sell ahead of a price movement Winans's own writing was about to cause.

The scheme ran through 1983 and 1984 and generated roughly $690,000 in trading profits for the group, of which Winans himself was found to have taken around $31,000. He was indicted by then-U.S. Attorney Rudolph Giuliani, and in 1985 a jury convicted him on 59 counts of securities and wire fraud. He was sentenced to 18 months in prison, later reduced to a year and a day, and ultimately served nine months.

The case became legally significant well beyond Winans's own sentence: he appealed his conviction all the way to the U.S. Supreme Court, arguing that leaking a newspaper's own publication schedule wasn't insider trading in any traditional sense, since he hadn't traded on confidential information about a company — only on advance knowledge of his own column's contents. In 1987's Carpenter v. United States, the Court split 4–4 on the securities-fraud question, but unanimously affirmed his conviction on the separate federal mail and wire fraud charges, establishing that misappropriating an employer's confidential information — in this case, The Wall Street Journal's own unpublished schedule — for personal trading profit was itself a federal crime, regardless of whether the information concerned a company's private affairs.

Winans's case remains taught in both law and journalism schools as a foundational example of how a reporter's institutional credibility and advance knowledge can itself become a tradeable, and illegal, commodity — the underlying asset wasn't inside information about a business, but the trust placed in the column itself.`,
    sourceUrl: 'https://en.wikipedia.org/wiki/R._Foster_Winans',
  },
  {
    title: 'Aubrey Lee Price: The Ponzi Schemer Who Faked His Own Suicide',
    slug: 'aubrey-lee-price-faked-death-ponzi-scheme',
    author: 'ScamShield Editorial',
    tags: ['notorious', 'notorious-scammer'],
    body: `Aubrey Lee Price was a Georgia investment adviser and bank director who ran a Ponzi scheme through his firm PFG, LLC and a related entity, Montgomery Prime, telling clients — many of them older, working with the same adviser for years — that their money was being invested in a hedge-fund-style trading strategy. Instead, prosecutors said Price diverted client and bank funds outside the actual investments he described, a shortfall that eventually helped trigger the collapse of a federally insured Georgia bank he also helped direct.

In June 2012, as regulators began closing in, Price disappeared after mailing letters to family members and clients confessing to the fraud and claiming he intended to jump from a high-speed ferry departing Key West, Florida. No body was ever found, and a court later declared him legally dead. The confession letters, combined with his vanishing, triggered a nationwide manhunt and placed him on the FBI's Ten Most Wanted Fugitives list with a $20,000 reward for information leading to his capture.

Price remained missing for a year and a half before a Glynn County, Georgia sheriff's deputy pulled him over for illegally tinted windows on December 31, 2013 — an ordinary traffic stop that ended one of the more unusual fugitive cases in recent federal history. He pleaded guilty to bank fraud, wire fraud, and securities fraud in the Southern District of Georgia, with prosecutors describing total losses to victims and the failed bank exceeding $70 million. In October 2014, a federal judge in Statesboro sentenced him to 30 years in prison.

The case is a reminder that faking a disappearance doesn't make a fraud disappear with it — the paper trail of diverted client funds and bank losses remained exactly where investigators expected to find it, and an unrelated traffic stop was ultimately what ended a manhunt that a staged suicide had been designed to close permanently.`,
    sourceUrl: 'https://www.justice.gov/usao-sdga/pr/aubrey-lee-price-former-bank-director-who-faked-his-own-death-sentenced-30-years-prison',
  },
  {
    title: 'The Stavisky Affair: The Bond Fraud That Toppled a French Government',
    slug: 'stavisky-affair-french-bond-fraud-1934',
    author: 'ScamShield Editorial',
    tags: ['notorious', 'notorious-scammer', 'historical'],
    coverImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/Alexandre_Stavisky_1926.jpg',
    coverImagePosition: 50,
    body: `Serge Alexandre Stavisky was a French financier and con man who built a career on fraudulent bond schemes run through provincial pawnshops, culminating in a fraud centered on the Crédit Municipal de Bayonne, a municipal pawnbroking institution. Stavisky had the institution issue bonds against wildly inflated collateral — including a supposed cache of emeralds he claimed once belonged to the German Empress, later shown to be worthless glass — then had those fraudulent bonds sold to insurance companies and investors as legitimate municipal debt, ultimately placing roughly $18 million worth before the scheme was uncovered.

What made the case explosive wasn't just the fraud itself but how long it had been allowed to continue: Stavisky had cultivated protection among Radical-party politicians, including a government minister, who repeatedly helped delay a prosecution against him that had already been pending for 19 months. When Treasury officials finally exposed the forged bonds on Christmas Eve 1933, the scandal exposed not just a con man but the political establishment that had shielded him.

Stavisky fled Paris and was found shot on January 8, 1934, at a chalet in Chamonix. Police officially ruled it a suicide, but the circumstances — including the angle of the wound — fueled a widespread and lasting suspicion that he had instead been killed by police to prevent testimony that would have implicated the officials protecting him. Prime Minister Camille Chautemps resigned within weeks over revelations of his government's ties to the scandal.

The affair reached its most consequential moment on February 6, 1934, when far-right leagues rioted at the Place de la Concorde in Paris, leaving 15 to 17 people dead and over a thousand wounded, and forcing the resignation of the government led by Édouard Daladier — the only time in France's Third Republic that a sitting government fell as a direct result of street rioting. The crisis and its aftermath helped catalyze the anti-fascist unity that produced the Popular Front two years later, making the Stavisky affair one of the rare financial frauds in history that reshaped a national government rather than just its victims' bank accounts.`,
    sourceUrl: 'https://en.wikipedia.org/wiki/Stavisky_affair',
  },
  {
    title: 'Kobi Alexander: The Comverse CEO Who Fled a Backdating Scandal to Namibia',
    slug: 'kobi-alexander-comverse-options-backdating-fugitive',
    author: 'ScamShield Editorial',
    tags: ['notorious', 'notorious-scammer'],
    coverImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/Kobi_Alexander.JPG',
    coverImageCredit: 'Photo: Jordano1995 (CC BY-SA 3.0)',
    coverImagePosition: 50,
    body: `Kobi Alexander spent roughly a decade as CEO of Comverse Technology secretly backdating stock option grants — choosing dates when the company's stock had hit historic lows, then having Comverse's general counsel fabricate board committee records showing the options had been approved on those earlier, lower-priced dates. That backdating quietly handed Alexander and two other executives in-the-money options worth tens of millions of dollars without ever disclosing the practice to shareholders or regulators. Separately, from 1999 to 2002, Alexander and Comverse's CFO padded option-grant lists submitted to the board with fictitious employee names, building an undisclosed slush fund of "phantom" options they later reallocated to real employees to recruit and retain staff off the books.

The SEC filed civil fraud charges against Alexander, the CFO, and the general counsel in August 2006, with a parallel criminal indictment from federal prosecutors. According to the SEC, Alexander personally gained roughly $138 million from the scheme. Rather than face the charges, Alexander fled first to Israel and then to Namibia, a country with no extradition treaty with the United States at the time, and spent nearly a decade fighting extradition through Namibian courts.

In August 2016, Alexander voluntarily returned to the United States and pleaded guilty to one count of securities fraud in federal court in the Eastern District of New York. He was sentenced to 30 months in prison, and separately agreed to pay $60 million to settle a shareholder lawsuit brought by Comverse investors, waiving more than $72 million in his own outstanding claims against the company as part of that settlement.

Alexander's decade in Namibia is a reminder that fleeing to a country without an extradition treaty doesn't make a fraud case disappear — it just puts the reckoning on hold. The scheme itself worked precisely because backdated paperwork and fabricated board records look, on the surface, exactly like the routine documentation of legitimate compensation decisions, until someone goes back and checks the actual dates against the actual stock price.`,
    sourceUrl: 'https://www.sec.gov/enforcement-litigation/litigation-releases/lr-19796',
  },
  {
    title: 'Boss Tweed: The Tammany Hall Fraud That Looted New York City',
    slug: 'boss-tweed-tammany-hall-courthouse-fraud',
    author: 'ScamShield Editorial',
    tags: ['notorious', 'notorious-scammer', 'historical'],
    coverImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/Tweed-Boss-LOC.jpg',
    coverImagePosition: 50,
    body: `William "Boss" Tweed led the Tammany Hall political machine that controlled New York City government in the years after the Civil War, and used that control to run one of the largest municipal fraud schemes in American history. The clearest example was the construction of a new county courthouse on Chambers Street: originally budgeted at $250,000, the building's cost ballooned to roughly $13 million after Tweed and his associates directed favored contractors to inflate their invoices by five to a hundred times the real cost of materials and labor, with the overcharges quietly kicked back to Tweed's inner circle through a network of bank transactions. Investigators at the time estimated the broader "Tweed Ring" had drained roughly $45 million from the city treasury over about three years, though later historical estimates of the total theft, including patronage and kickback schemes beyond the courthouse alone, have ranged much higher.

Tweed's downfall came from a combination of investigative reporting by The New York Times, which obtained internal financial records exposing the courthouse overcharges, and the relentless editorial cartoons of Thomas Nast in Harper's Weekly, which turned Tweed's face into a national symbol of political corruption even among readers who couldn't follow the financial details. After a first trial in January 1873 ended in a hung jury, a retrial that November convicted Tweed on more than 200 misdemeanor counts of neglect of duty and official misconduct; he was sentenced to twelve consecutive one-year prison terms, later reduced to one year after New York's highest court ruled the consecutive sentencing scheme illegal.

Released but still facing a separate civil suit seeking $3 million in restitution, Tweed was held on $3 million bail he couldn't post. He escaped custody in December 1875 and fled first to Cuba and then to Spain — where, according to the accounts of his capture, Spanish authorities recognized him from one of Nast's own cartoons and arrested him for extradition back to the United States. Returned to prison in November 1876, Tweed died in the Ludlow Street Jail of pneumonia on April 12, 1878, before ever facing the civil suit that had triggered his flight.

Tweed's case remains a foundational study in how fraud hides in plain sight inside routine government paperwork — a courthouse invoice inflated by 100 times looks, line by line, like an ordinary bill, until someone bothers to add up what the work should have actually cost.`,
    sourceUrl: 'https://history.nycourts.gov/figure/boss-tweed/',
  },
  {
    title: 'Ephren Taylor: The "Social Capitalist" Who Ran a Ponzi Scheme Through Black Churches',
    slug: 'ephren-taylor-city-capital-church-ponzi-scheme',
    author: 'ScamShield Editorial',
    tags: ['notorious', 'notorious-scammer'],
    body: `Ephren Taylor II built a public image as "The Social Capitalist" — a young Black entrepreneur, the son of a minister, who marketed himself as the youngest Black CEO of a publicly traded company and toured Black churches across the country under a "Building Wealth" banner. Through his company, City Capital Corporation, and later Capital Genesis, Taylor and chief operating officer Wendy Connor sold congregations on two products: promissory notes that supposedly funded small businesses, and interests in "sweepstakes machines," both pitched as socially conscious investments that would benefit disadvantaged communities while paying steady returns.

Between 2008 and 2010, Taylor and Connor raised more than $11 million from hundreds of investors this way, according to the SEC, which filed civil fraud charges against them in April 2012. In reality, the businesses and charitable projects Taylor described rarely existed as pitched; new investor money was used to pay earlier investors in classic Ponzi fashion, while a substantial share was diverted to fund Taylor's own book promotion, image consultants, and his wife's singing career.

Taylor pleaded guilty to conspiracy to commit mail and wire fraud in October 2014. He was sentenced to 235 months in federal prison — later reduced to 223 months, roughly 18 and a half years — along with three years of supervised release and more than $15.5 million in restitution. Broader reporting on the full scope of the fraud put total losses above $16 million, affecting more than 400 victims, many of whom had trusted Taylor specifically because he presented his investments as an extension of their faith community rather than an ordinary financial pitch.

Taylor's case is a stark illustration of affinity fraud at scale: by embedding himself in congregations and framing his pitch around racial uplift and shared faith, he built a level of trust that bypassed the skepticism a stranger's investment offer would normally face — a reminder that a scammer's chosen community, not just their paperwork, is often the real mechanism of the fraud.`,
    sourceUrl: 'https://www.sec.gov/newsroom/press-releases/2012-2012-62htm',
  },
  {
    title: 'Billy Walters: The Sports Gambler Whose Inside Tip Reached Phil Mickelson',
    slug: 'billy-walters-dean-foods-insider-trading',
    author: 'ScamShield Editorial',
    tags: ['notorious', 'notorious-scammer'],
    body: `Billy Walters, a well-known Las Vegas sports gambler, spent six years, from 2008 to 2014, trading on inside information about Dean Foods Company, a Fortune 500 dairy processor, fed to him by Thomas C. Davis, a Dean Foods board member and its former chairman. Davis passed Walters advance, nonpublic details of upcoming corporate events — including a planned spinoff of one of the company's subsidiaries — which Walters used to net more than $43 million in illegal trading profits.

The case reached beyond Walters and Davis in July 2012, when Walters called professional golfer Phil Mickelson and urged him to buy Dean Foods stock. Mickelson built roughly a $2.4 million position across three brokerage accounts; when the spinoff was announced about a week later, the stock jumped nearly 40%. Mickelson was never criminally charged — the SEC named him only as a "relief defendant," stating he did not engage in wrongdoing — but he was required to repay $931,738.12 in trading profits plus $105,291.69 in interest.

Walters was convicted at trial in the Southern District of New York and sentenced in July 2017 to five years in prison, a $10 million fine, and an initial restitution order of $8.89 million. He appealed to the Second Circuit, which in December 2018 affirmed his conviction and the forfeiture order but vacated and remanded the restitution amount for further proceedings. Walters served roughly three years and nine months of his sentence before President Trump commuted it on January 20, 2021.

The case is a reminder that inside information doesn't have to originate with the person who ultimately profits from it — a boardroom leak can travel through a chain of relationships, from a corporate insider to a gambler to a celebrity golfer, before it ever produces a single suspicious trade, and the further it travels, the harder it can be to see the original leak at the other end.`,
    sourceUrl: 'https://www.sec.gov/newsroom/press-releases/2016-92',
  },
  {
    title: 'Fabrice Tourre: The Goldman Sachs Trader Who Bet Against His Own Clients',
    slug: 'fabrice-tourre-goldman-sachs-abacus-fraud',
    author: 'ScamShield Editorial',
    tags: ['notorious', 'notorious-scammer', 'historical'],
    body: `Fabrice Tourre was a 31-year-old Goldman Sachs vice president principally responsible for structuring and marketing a synthetic collateralized debt obligation called ABACUS 2007-AC1, tied to subprime mortgage-backed securities. Goldman's marketing materials told investors that the portfolio of mortgage securities underlying the deal had been selected by an independent third party, ACA Management. What investors weren't told was that the hedge fund Paulson & Co. had played a significant role in choosing which securities went into that portfolio — and Paulson was simultaneously betting against the deal, meaning the fund most involved in picking the investments was also the one positioned to profit when they failed.

The CDO collapsed as the subprime mortgage market unraveled, costing investors roughly $1 billion. The SEC filed a civil fraud complaint against both Goldman Sachs and Tourre individually in April 2010. Goldman settled that July for $550 million — at the time the largest penalty ever paid by a Wall Street firm to the SEC — without admitting or denying wrongdoing. Tourre, however, refused to settle and took his case to trial.

In a Manhattan federal civil trial in the summer of 2013, a jury found Tourre liable on six of the SEC's seven counts. A federal judge later ordered him to pay more than $825,000, combining a civil penalty with disgorgement of the bonus he'd earned tied to the deal — a smaller sum than the roughly $1.15 million the SEC had originally sought, but still a personal financial reckoning distinct from the corporate settlement. Because the case was civil rather than criminal, Tourre never faced prison time. He later earned a PhD in economics from the University of Chicago, did postdoctoral research at Northwestern, and became an academic economist, eventually joining the faculty at Baruch College's Zicklin School of Business.

Tourre's case is one of the clearest examples of a conflict of interest dressed up as a routine transaction: nothing about ABACUS was fabricated in the way a Ponzi scheme is fabricated — the mortgages were real, the CDO was real — but the single fact investors weren't told, that the deal's chief architect against them had also helped build it, was enough to turn a legitimate financial instrument into a fraud.`,
    sourceUrl: 'https://www.sec.gov/litigation/litreleases/lr-21489',
  },
  {
    title: 'Marc Rich: The Fugitive Oil Trader Who Bought a Presidential Pardon',
    slug: 'marc-rich-fugitive-oil-trader-pardon',
    author: 'ScamShield Editorial',
    tags: ['notorious', 'notorious-scammer', 'historical'],
    body: `Marc Rich built one of the world's largest commodities trading firms, Marc Rich + Co., by operating in the gray zones international sanctions left open — and in 1979, when the Shah of Iran fell and the United States embargoed Iranian oil during the hostage crisis, Rich's Swiss-based, formally non-American company kept buying Iranian crude and reselling it anyway, functioning as a middleman that let Iran's oil keep moving to willing buyers despite the embargo. A federal grand jury in the Southern District of New York returned a 51-count indictment against Rich and his business partner Pincus Green in September 1983, charging tax evasion, mail and wire fraud, racketeering, and illegally trading with a sanctioned nation — tied to more than $48 million in evaded taxes on over $100 million in unreported income from the oil deals.

Rather than face trial, Rich fled to Switzerland in 1983 and simply never came back, running his trading empire from abroad as a fugitive for the better part of two decades. Switzerland's own laws made extradition difficult, and Rich used the distance to keep operating largely unimpeded; the company he founded eventually reorganized into what became Glencore, still one of the largest commodities traders in the world today.

On January 20, 2001, Bill Clinton's final day in office, the president granted Rich a full pardon — one of the most controversial pardons in modern presidential history. The controversy centered less on the underlying facts of Rich's case than on how the pardon came about: Rich's ex-wife, Denise Rich, had donated hundreds of thousands of dollars to the Democratic Party, Clinton's presidential library foundation, and Hillary Clinton's Senate campaign in the years before the pardon, prompting congressional hearings and a Justice Department review into whether the pardon had effectively been bought.

Rich died in Lucerne, Switzerland, in June 2013 at age 78, having spent essentially the entire back half of his life as a man who could never safely set foot in the country where he was indicted. His case remains a study in how far distance and money can carry someone away from accountability — not by beating the charges, but by simply staying beyond the reach of the court that filed them, for long enough that political influence, rather than a verdict, became the thing that finally closed the case.`,
    sourceUrl: 'https://www.cbsnews.com/news/pardoned-financier-marc-rich-dead-at-78/',
  },
  {
    title: 'Dennis Levine: The Insider Trader Whose Confession Exposed Ivan Boesky',
    slug: 'dennis-levine-bank-leu-insider-trading',
    author: 'ScamShield Editorial',
    tags: ['notorious', 'notorious-scammer', 'historical'],
    coverImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/Dennis_Levine_in_2004.jpg',
    coverImageCredit: 'Photo: Ken Rutkowski (CC0)',
    coverImagePosition: 50,
    body: `Dennis Levine was a managing director at Drexel Burnham Lambert who spent roughly five years trading on nonpublic information about pending corporate mergers and acquisitions he learned through his own investment-banking work — information he was supposed to be handling in confidence, not trading on. To hide his identity, Levine routed his trades through a secret account at Bank Leu in Nassau, the Bahamas, held under the alias "Mr. Diamond" through shell entities, and phoned in his orders collect from public pay phones to avoid leaving a traceable line back to himself. Over that period, the SEC alleged, he made roughly $12.6 million in illegal profits trading ahead of takeover announcements in 54 different stocks.

The scheme unraveled almost by accident: Bank Leu employees, noticing how consistently "Mr. Diamond's" trades paid off, began mirroring them in their own accounts, and the pattern of suspicious trading eventually caught Merrill Lynch's attention and was reported up to the SEC. Under pressure from US investigators, Bank Leu disclosed Levine's real identity on May 9, 1986, and he was arrested three days later. He pleaded guilty on June 5, 1986, to securities fraud, tax evasion, and perjury.

What made Levine's case significant beyond his own conviction was what came after it: he cooperated extensively with the SEC and the US Attorney's office, and his testimony directly led investigators to arbitrageur Ivan Boesky, who was subsequently exposed and prosecuted in one of the era's biggest insider-trading scandals. Levine was sentenced to two years in prison, ordered to pay a $362,000 fine, and required to disgorge roughly $11.5 million in illegal profits — at the time the largest such penalty the SEC had obtained.

Levine's case is often remembered less for its own numbers than for the domino effect it triggered: a single insider trader's guilty plea and cooperation agreement unraveled a much larger network of Wall Street misconduct, showing how one relatively contained fraud, once someone inside it starts talking, can expose a whole "nest of vipers" that took years to fully investigate.`,
    sourceUrl: 'https://law.justia.com/cases/federal/appellate-courts/F2/881/1165/94018/',
  },
  {
    title: 'Danny Pang: The Newport Beach Financier Whose $800 Million Scheme Collapsed With Him',
    slug: 'danny-pang-private-equity-management-group-fraud',
    author: 'ScamShield Editorial',
    tags: ['notorious', 'notorious-scammer', 'historical'],
    body: `Danny Pang built Private Equity Management Group, a Newport Beach, California investment firm, around bonds backed by "life settlements" — life insurance policies bought from their original policyholders at a discount, with investors promised repayment from the eventual death benefits. Starting around 2003, Pang sold these bonds primarily to Taiwanese banks and wealthy individual investors, raising hundreds of millions of dollars through institutions including Standard Chartered, Hua Nan Bank, Bank SinoPac, Taichung Bank, EnTie Bank, and Cosmos Bank.

The SEC filed an emergency action against Pang and his firm on April 27, 2009, alleging that the underlying life insurance policies were nowhere near valuable enough to cover what investors were owed — a court-appointed receiver later found investors were owed roughly $823 million in principal against firm assets worth only $213 to $426 million — and that Pang had been paying earlier investors with newer investors' money in classic Ponzi fashion. Investigators also found Pang had forged an insurance policy document, presenting one worth roughly $31 million as if it were worth $108 million, and had fabricated parts of his own resume, including false claims about degrees and a prior career at Morgan Stanley. A federal judge froze his assets, appointed a receiver, and ordered him to surrender his passport.

Pang never faced trial. He was found unresponsive at his Newport Beach home on September 11, 2009, and died the next morning at a nearby hospital; toxicology testing finalized around January 2010 found toxic levels of oxycodone and hydrocodone in his system, and the death was officially ruled a suicide. His family publicly disputed the fraud allegations against him, though no similar public dispute of the suicide finding itself has been documented. With Pang gone, the SEC's civil case proceeded through the receivership against his companies and remaining assets, including a large real estate portfolio that was eventually auctioned off in an effort to recover money for investors.

Pang's case is a reminder that a fraud's collapse doesn't always come with a courtroom reckoning for the person who ran it — when the architect of a scheme dies before trial, the receivership process that follows can recover some money for victims, but the full account of exactly what happened, and why, often dies with them.`,
    sourceUrl: 'https://www.sec.gov/news/press/2009/2009-89.htm',
  },
  {
    title: 'Alan Bond: The America\'s Cup Hero Who Looted His Own Company',
    slug: 'alan-bond-bell-resources-fraud',
    author: 'ScamShield Editorial',
    tags: ['notorious', 'notorious-scammer', 'historical'],
    body: `Alan Bond was one of Australia's most celebrated businessmen, having bankrolled Australia II's victory in the 1983 America's Cup, before his Bond Corporation empire collapsed in the early 1990s in what was, at the time, the largest corporate failure in Australian history. The fraud that ultimately sent him to prison involved a separate public company he controlled, Bell Resources: Bond used his position at the top of that company to improperly transfer roughly A$1.2 billion out of it and into the struggling Bond Corporation, propping up his own empire directly at the expense of Bell Resources' other shareholders.

He was convicted of that fraud in 1997. An Australian court initially handed down a relatively lenient sentence, but after the government appealed, the Western Australia Court of Criminal Appeal increased it to seven years; Bond later won a partial victory at the High Court and was ultimately released in March 2000, having served just over three years. This wasn't his first fraud conviction, either — in 1996, he was separately convicted on four counts of company fraud over a French Impressionist painting, "La Promenade": his public company had sold the artwork to his own private family company for $2.46 million, which that private company then resold roughly a year later for $17 million, pocketing the difference at the public shareholders' expense.

What connects both cases is the same underlying mechanism: rather than a stranger tricking outside victims, Bond used his own control over public companies to move value into his private hands, treating shareholder-owned assets as if they were his personal property to redirect whenever it suited him. Both frauds required no deception of an unsuspecting mark in the traditional sense — the victims were the very shareholders of the companies Bond had been entrusted to run.

Bond died in June 2015 at age 77, following complications from open-heart surgery. His case remains one of the clearest illustrations of a specific kind of fraud that doesn't fit the classic scam-artist mold: a fully legitimate business empire and a celebrated public reputation, used as cover to quietly move billions of dollars of other people's money into one's own pocket, one boardroom transaction at a time.`,
    sourceUrl: 'https://www.abc.net.au/news/2015-06-05/alan-bond-10-things-you-need-to-know/6520736',
  },
  {
    title: 'Robert Brennan: The Boiler-Room Broker Who Hid $16 Million in His Basement',
    slug: 'robert-brennan-first-jersey-securities-fraud',
    author: 'ScamShield Editorial',
    tags: ['notorious', 'notorious-scammer', 'historical'],
    body: `Robert Brennan founded First Jersey Securities in 1974 and turned it into one of the most aggressive "boiler room" brokerages of the 1980s — a firm whose brokers pressured customers, many of them elderly, into buying thinly traded penny stocks that First Jersey itself had underwritten or controlled. The firm's brokers pumped up demand and prices through high-pressure sales tactics, then sold their own holdings into that inflated demand, leaving ordinary customers holding stock that collapsed in value once the pumping stopped — a classic pump-and-dump scheme run at scale across an entire brokerage.

After a 41-day bench trial, a federal judge ruled in July 1995 that Brennan and First Jersey had perpetrated a "massive and continuing fraud," ordering them to disgorge roughly $75 million in ill-gotten gains plus interest. Brennan fought the judgment through the Second Circuit and the Supreme Court, losing both times, and a bankruptcy court later ruled the debt couldn't be discharged even if he filed for personal bankruptcy — which he did anyway, in August 1995, apparently hoping to avoid paying regardless.

That bankruptcy filing became its own separate crime. Investigators found Brennan had concealed roughly $500,000 in casino chips from Atlantic City and $4 million in municipal and bearer bonds hidden in his own basement, directing an associate to secretly liquidate the bonds overseas and reinvest the proceeds — ultimately concealing around $16 million from the bankruptcy court and his creditors. A jury convicted him in April 2001 on seven counts of money laundering and bankruptcy fraud, and he was sentenced that July to nine years and two months in federal prison, with the conviction upheld on appeal in 2003. He was released in January 2011.

Brennan's case shows fraud compounding on itself: a securities scheme that defrauded ordinary investors led to a civil judgment, which he then tried to escape through an even more brazen fraud against the bankruptcy system itself — hiding cash and bonds in his own house rather than simply paying what a federal court had already ruled he owed.`,
    sourceUrl: 'https://law.justia.com/cases/federal/appellate-courts/F3/326/176/526219/',
  },
  {
    title: 'Ivar Kreuger: The "Match King" Who Forged His Way to the Top of the World',
    slug: 'ivar-kreuger-match-king-fraud',
    author: 'ScamShield Editorial',
    tags: ['notorious', 'notorious-scammer', 'historical'],
    body: `Ivar Kreuger built one of the largest business empires the world had ever seen by making an offer few cash-strapped governments could refuse: in exchange for large loans, he'd receive a monopoly on match production and sales in that country. Through this scheme he struck deals with Poland, Greece, France, Germany, and more than a dozen other nations during the 1920s, and by 1928 his Swedish Match empire controlled roughly half of global match production. Wall Street loved him — Boston investment bank Lee Higginson & Co. underwrote and sold millions of dollars of Kreuger securities to American investors, lending his empire the credibility of a blue-chip stock.

The empire was largely a fiction. Kreuger used a web of holding companies — including Kreuger & Toll and International Match Corporation — to shuffle money between entities, obscuring the fact that many of the government loans and "investments" he claimed to have made either didn't exist or had actually been rejected. He paid dividends to existing investors using capital raised from new ones, a Ponzi-like structure dressed up in respectable corporate paperwork. When a match-monopoly deal with Mussolini's Italy fell apart, Kreuger simply forged 42 Italian government bonds with a combined face value in the tens of millions of pounds, complete with a forged signature from Italy's finance minister, and used them as loan collateral.

The scheme unraveled as the Depression deepened. On March 12, 1932, Kreuger was found dead in his Paris apartment of a gunshot wound, in a death French police ruled a suicide (his brother later publicly disputed this, though suicide remains the consensus historical conclusion). Kreuger died before any of the forgeries came to light — it took auditors from Price Waterhouse roughly five years to untangle his roughly 400 companies, and their report described the falsified bookkeeping as so crude that "anyone with but a rudimentary knowledge of bookkeeping could see the books were falsified." A 1930 analysis in Foreign Affairs found that some $400 million of his claimed assets amounted to little more than fictitious entries on a balance sheet.

Kreuger's collapse remains one of history's largest corporate frauds, and its aftermath reshaped American finance: the scandal is widely credited as a direct catalyst for the U.S. Securities Act of 1933 and Securities Exchange Act of 1934, the laws that first required public companies to disclose real, audited financials to investors — a regulatory response built specifically to prevent a repeat of a man who talked his way to running half the world's match supply on paper that didn't hold up.`,
    sourceUrl: 'https://www.britannica.com/money/Ivar-Kreuger',
    coverImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/Kreuger_ca1920.jpg',
    coverImagePosition: 50,
  },
  {
    title: 'Victor Lustig: The Con Man Who Sold the Eiffel Tower — Twice',
    slug: 'victor-lustig-eiffel-tower-con',
    author: 'ScamShield Editorial',
    tags: ['notorious', 'notorious-scammer', 'historical'],
    body: `Victor Lustig, born in Bohemia in what is now the Czech Republic, spent the early twentieth century as a professional swindler working the ocean liners and cities of Europe and the United States. His most audacious con came in 1925: posing as a French government official on forged Ministry of Posts and Telegraphs letterhead, he invited a group of Paris scrap-metal dealers to a secret meeting at the Hôtel de Crillon and told them the Eiffel Tower — then aging, expensive to maintain, and unpopular — was quietly slated for demolition, with its roughly 7,000 tons of iron up for sale as scrap.

Lustig singled out one dealer, André Poisson, who was eager to prove himself among Paris's business elite, and privately implied that a bribe would secure the deal. Poisson paid up, Lustig collected the money and vanished to Vienna, and — banking correctly that an embarrassed Poisson would never report being conned — Lustig returned to Paris about a month later and tried to sell the Tower to an entirely new set of dealers. This time one of them grew suspicious and alerted police, forcing him to flee to the United States for good.

Lustig's other signature con was the "Romanian box," a device he claimed could duplicate paper currency: he'd feed in a real bill, and after a wait two bills would emerge, because he'd secretly preloaded a matching one inside. He sold the boxes for thousands of dollars apiece, again relying on marks' unwillingness to admit they'd bought what amounted to a counterfeiting machine — one victim, a Texas sheriff, was conned a second time when he tracked Lustig down to complain. Lustig's luck ran out in the 1930s, when he partnered with a pharmacist and a chemist to run a genuine counterfeiting operation that produced an estimated $2 million in fake US currency; a tip from his mistress led to his arrest in May 1935, and after a brief escape and recapture he was sentenced to 20 years, served largely at Alcatraz alongside Al Capone.

Lustig died March 11, 1947, of pneumonia at the federal medical facility in Springfield, Missouri, after being transferred from Alcatraz. Unlike frauds built on falsified balance sheets, his cons worked purely on audacity and psychology — a fake title, a fabricated secret, and the well-founded bet that a mark tricked into something illegal or embarrassing would rather absorb the loss quietly than ever report it.`,
    sourceUrl: 'https://www.smithsonianmag.com/history/man-who-sold-eiffel-tower-twice-180958370/',
    coverImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/Victor_Lustig_(cropped).jpg',
    coverImagePosition: 50,
  },
  {
    title: 'Sergei Mavrodi: The MMM Pyramid That Swindled Millions of Russians',
    slug: 'sergei-mavrodi-mmm-ponzi-scheme',
    author: 'ScamShield Editorial',
    tags: ['notorious', 'notorious-scammer', 'historical'],
    body: `Sergei Mavrodi founded MMM in Moscow in 1989, initially as a computer-equipment trading cooperative, before turning it into a public investment scheme in 1994 as Russia's post-Soviet economy lurched through hyperinflation and mass privatization. MMM sold shares directly to the public and promised eye-popping monthly returns, commonly cited in the 20-75% range, funded entirely by the cash brought in by new investors rather than any real underlying business — a textbook Ponzi structure, but one run at a scale and with a media presence (including a heavily aired ad campaign built around a fictional everyman investor, "Lyonya Golubkov") that made it a genuine cultural phenomenon.

The scheme collapsed within days after Russia's Ministry of Finance publicly denounced MMM's unregistered securities on July 22, 1994; share prices crashed from roughly 125,000 rubles to about 1,000 rubles almost overnight, and MMM ceased operations the following day. Estimates of how many Russians lost money vary, but most sources put the number in the range of 10 to 15 million investors — a substantial share of the country's population, wiped out in the same week. Mavrodi was arrested on tax charges days later, then ran for and won a seat in the State Duma later that year specifically to gain the parliamentary immunity that shielded him from prosecution for years; he rarely attended sessions, and was eventually stripped of immunity in 1996.

Mavrodi went into hiding after MMM's formal bankruptcy in December 1997 and wasn't arrested again until 2003. A Moscow court convicted him of fraud in April 2007, though the conviction covered only a narrow slice of the full scheme — roughly 10,000 investors and 110 million rubles (about $4.3 million) — and he was sentenced to four and a half years, but was released immediately, having already served the equivalent time in pretrial detention. Rather than stop, Mavrodi relaunched nearly identical schemes — MMM-2011 and later MMM Global — that expanded internationally, gaining particular traction in Nigeria, where roughly 2.4 million people had signed up by late 2016.

Mavrodi died of a heart attack in Moscow on March 26, 2018, at age 62, having spent almost the entirety of his adult life running variations of the same fraud rather than serving meaningful time for any of them. His case is a stark illustration of how a Ponzi scheme's collapse doesn't always end its operator's career — MMM's implosion in 1994 became merely the first of several, as Mavrodi kept finding new, poorer, less-warned populations to sell the same promise to for another two decades.`,
    sourceUrl: 'https://www.france24.com/en/20180326-author-russias-mmm-pyramid-scheme-who-swindled-millions-dies',
    coverImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/Sergei_Mavrodi.jpg',
    coverImageCredit: 'Photo: State Duma of the Russian Federation (CC BY 4.0)',
    coverImagePosition: 50,
  },
  {
    title: 'Michele Sindona: The Mafia Banker Who Sank America\'s Largest Bank Failure',
    slug: 'michele-sindona-franklin-national-bank-fraud',
    author: 'ScamShield Editorial',
    tags: ['notorious', 'notorious-scammer', 'historical'],
    body: `Michele Sindona started as a tax lawyer in postwar Milan before building an Italian banking empire — including Banca Privata Italiana — while managing money for the Gambino crime family's heroin profits and cultivating close ties to the Vatican Bank. In 1972, through his Liechtenstein holding company, Sindona bought a controlling stake in Franklin National Bank, a New York institution that was at the time the 20th-largest bank in the United States. He would later go on to mentor a younger Italian banker named Roberto Calvi, introducing him to the same Vatican Bank connections that had served Sindona so well.

Franklin National's collapse followed a familiar pattern: massive unauthorized foreign-currency speculation losses, compounded by a fraudulent unauthorized transfer of roughly $30 million to Europe. Regulators declared the bank insolvent on October 8, 1974 — at the time, the largest bank failure in American history. Weeks earlier, Sindona's Italian banking empire had also come apart; Banca Privata Italiana was forced into liquidation in September 1974 with debts around $350 million. Tipped off that an Interpol arrest warrant was coming, Sindona fled to the United States that October to avoid Italian authorities.

American prosecutors caught up with him anyway. After a nine-week trial, a jury convicted Sindona in March 1980 on 65 counts, including fraud, perjury, and misappropriating roughly $45 million in Franklin funds, and he was sentenced to 25 years. Italy wanted him too: Sindona was extradited in September 1984 to face charges connected to Giorgio Ambrosoli, the court-appointed liquidator whose investigation into Sindona's collapsed Italian banks had fed evidence to American prosecutors. Ambrosoli was shot dead outside his Milan home in July 1979 by a hitman paid on Sindona's orders. In March 1986, a Milan court convicted Sindona of ordering that murder and sentenced him to life in prison.

He didn't serve much of it. Four days after his life sentence, in his cell at a maximum-security prison, Sindona drank coffee laced with cyanide and died two days later, on March 22, 1986. Italian authorities' official position leaned toward suicide, but the circumstances — a prisoner under constant guard, eating from sealed containers — left many, including his own lawyer, convinced he was murdered to keep him permanently silent. Sindona's case remains a foundational example of how a single well-connected financier, moving between organized crime, a national bank, and the Vatican's own finances, could bring down record-setting institutions on two continents before the truth of what happened to him could ever be fully settled.`,
    sourceUrl: 'https://www.britannica.com/money/Michele-Sindona',
  },
  {
    title: 'Roberto Calvi: "God\'s Banker" and the Body Under Blackfriars Bridge',
    slug: 'roberto-calvi-banco-ambrosiano-fraud',
    author: 'ScamShield Editorial',
    tags: ['notorious', 'notorious-scammer', 'historical'],
    body: `Roberto Calvi joined Banco Ambrosiano in 1947 and rose to become its chairman in 1975, taking the reins of what was then Italy's largest private bank — one whose biggest shareholder was the Vatican Bank, run at the time by American Archbishop Paul Marcinkus. Calvi had been mentored by fellow financier Michele Sindona, who introduced him to Marcinkus in 1971, and Calvi was also a member of the clandestine P2 Masonic lodge, a network that entangled Italian business, politics, and organized crime throughout the 1970s and 80s.

Calvi's fraud ran through a web of shell companies, mostly registered in Panama, that received an estimated $1.3 billion or more in loans from Banco Ambrosiano and its subsidiaries. The Vatican Bank issued "letters of comfort" assuring creditors it stood behind these shell companies' debts — letters Marcinkus later claimed were meant for internal use only. The money moved through the shells for a mix of purposes: buying up Banco Ambrosiano's own stock to prop up its price, financing Latin American ventures including Nicaragua's Somoza regime, and — by multiple accounts — funneling money to Poland's Solidarity movement, alongside straightforward embezzlement. Convicted in 1981 for illegally moving $27 million out of Italy, Calvi received only a suspended sentence and kept his job as chairman.

The scheme finally came apart in June 1982, when Banco Ambrosiano collapsed with debts estimated as high as $1.5 billion, one of the largest bank failures in European history. Calvi fled Italy using a false passport, and on the morning of June 18, 1982, his body was found hanging from scaffolding under Blackfriars Bridge in London, bricks stuffed in his pockets and roughly $14,000 in mixed currencies on him. A first inquest ruled it suicide; a second, in 1983, returned an open verdict. It wasn't until his body was exhumed in 1998 and an independent 2002 forensic report found injuries inconsistent with a self-hanging that London police reopened the case as a murder investigation.

A 2005-2007 Rome trial tried five defendants, including a Mafia figure, for Calvi's murder — the court found his death was very likely a killing rather than a suicide, but acquitted all five for insufficient evidence, and no one has ever been convicted. More than four decades later, exactly who killed "God's Banker" — and on whose orders — remains formally unresolved, even as the fraud that preceded his death stands as one of the clearest illustrations of how deeply a single bank collapse can entangle organized crime, clandestine political networks, and a national church's own finances.`,
    sourceUrl: 'https://www.bbc.com/culture/article/20250611-the-mysterious-murder-of-gods-banker-roberto-calvi',
  },
  {
    title: 'Nicholas Cosmo: The "Mini-Madoff" Who Ran a Ponzi Scheme From Prison Lessons Learned',
    slug: 'nicholas-cosmo-agape-world-ponzi-scheme',
    author: 'ScamShield Editorial',
    tags: ['notorious', 'notorious-scammer', 'historical'],
    body: `Nicholas Cosmo had already been convicted once before he built his biggest fraud. As a licensed stockbroker in the late 1990s, he pleaded guilty to mail fraud for commingling client funds and forging documents, serving 21 months in prison. Not long after his release, he founded Agape World Inc. on Long Island, New York, telling investors their money would fund short-term "bridge loans" to construction and commercial borrowers — pitches from his sales agents promised returns as high as 12 to 14 percent in a matter of weeks, with almost no risk to principal.

Little to none of the money actually went to bridge loans. Regulators later found Cosmo used incoming investor cash to pay off earlier investors in classic Ponzi fashion, cover sales commissions, and fund his own unauthorized commodity futures trading — a habit that alone cost him roughly $80 million in losses. The scheme collapsed in January 2009, just seven weeks after Bernie Madoff's own arrest, and press coverage at the time quickly dubbed Cosmo "Long Island's Mini-Madoff." Regulators put the total scale of money raised at around $370 to $415 million, with actual investor losses closer to $147 to $195 million across thousands of victims — the exact figures vary by source depending on whether gross amounts raised or net losses are being counted.

Cosmo was arrested on January 26, 2009, and the Commodity Futures Trading Commission filed a parallel civil suit against him the very next day. He pleaded guilty to mail and wire fraud in October 2010, and in October 2011 was sentenced to 25 years in federal prison, along with an order to pay $179 million in restitution to his victims. Several of his sales agents and associates were separately charged and sentenced in the years that followed.

Cosmo's case is a reminder that a prior fraud conviction doesn't always stop someone from running an even larger scheme — if anything, his first conviction taught him exactly what regulators look for, knowledge he then used to build a fraud roughly a hundred times the size of the one that had first put him in prison.`,
    sourceUrl: 'https://www.cftc.gov/LearnAndProtect/CaseStatusReports/cosmoagape',
  },
  {
    title: 'John Rigas and the $2.3 Billion Hidden Inside Adelphia Communications',
    slug: 'john-rigas-adelphia-communications-fraud',
    author: 'ScamShield Editorial',
    tags: ['notorious', 'notorious-scammer', 'historical'],
    body: `John Rigas and his brother bought a small cable franchise in Coudersport, Pennsylvania, for $300 in 1952, and John spent the next five decades building it into Adelphia Communications, one of the largest cable television operators in the United States, serving well over five million subscribers at its peak. Rigas ran the company as a family business, with his sons Timothy, Michael, and James all in senior executive roles — a structure that let the fraud that eventually brought the whole company down stay contained within the family for years.

Starting around 1999, the Rigases hid roughly $2.3 billion in company debt by shifting it onto off-balance-sheet "co-borrowing" credit facilities technically held by Rigas family entities rather than Adelphia itself, keeping the liabilities off the company's own books while lenders still counted on Adelphia's cable systems as collateral. The family used the co-borrowed funds and company money for an extensive list of personal expenses: a $12.8 million private golf course under construction near Coudersport, luxury apartments in Manhattan, Cancun, and Hilton Head, three private jets used for personal trips including an African safari, and $174 million funneled to cover the family's own margin loan calls on other investments.

The scheme unraveled in March 2002, when the hidden liabilities surfaced in a footnote to an earnings release; Adelphia's stock collapsed within days from over $20 to under a dollar, and the company filed for bankruptcy that June. John and Timothy Rigas were convicted in July 2004 on conspiracy, bank fraud, and securities fraud charges, and John was sentenced in 2005 to 15 years — a term the Second Circuit later vacated on appeal, leading to a 2008 resentencing that reduced it to 12 years. The family separately forfeited more than $1.5 billion in assets, and Adelphia itself paid $715 million into a fund for victims.

John Rigas was granted compassionate release in February 2016, at age 91, due to terminal cancer, and died in September 2021 at 96. His case remains one of the clearest examples of a founder-led family business where the same closeness that built the company also let its leaders hide billions in debt from the public markets for years without an outside check.`,
    sourceUrl: 'https://www.sec.gov/news/press/2002-110.htm',
  },
  {
    title: 'Phillip Bennett and the $430 Million Refco Hid Just Weeks After Its IPO',
    slug: 'phillip-bennett-refco-fraud',
    author: 'ScamShield Editorial',
    tags: ['notorious', 'notorious-scammer', 'historical'],
    body: `Refco was the largest retail commodities and futures brokerage in the United States when it went public on the New York Stock Exchange on August 11, 2005, a debut that valued the firm at roughly $3.5 billion. Phillip Bennett, its longtime chairman and CEO, had by then spent years quietly managing a problem investors knew nothing about: roughly $430 million in uncollectible customer trading debt, much of it dating back to the late-1990s Asian financial crisis, that never should have still been sitting on Refco's books as a healthy asset.

Rather than write the bad debt off and take the hit, Bennett ran a "round-trip" concealment scheme through a private entity he controlled, Refco Group Holdings. At the end of each reporting period, a Refco subsidiary would lend money to a hedge fund, which in turn lent those same funds to Bennett's holding company so it could temporarily repay Refco, making the debt vanish from Refco's books until the loans quietly unwound again after the books closed. He repeated this cycle at the close of nearly every reporting period for years, right through Refco's IPO.

The scheme came apart in October 2005, barely two months after the IPO, when Refco disclosed that its CEO controlled an entity owing the company $430 million. Bennett was placed on leave, then arrested and criminally charged within days; Refco filed for Chapter 11 bankruptcy about a week later, at the time one of the largest bankruptcies in U.S. history. Bennett pleaded guilty in February 2008 to securities fraud, wire fraud, bank fraud, and conspiracy, and was sentenced that July to 16 years in prison along with a forfeiture order covering up to $2.4 billion in fraud-tainted transactions — a far larger figure than the original $430 million, reflecting the total scope of dealings the scheme touched over the years. He was released early on compassionate grounds in May 2020, during the COVID-19 pandemic, and deported to the United Kingdom.

Refco's collapse is a stark illustration of how little time can separate a triumphant Wall Street debut from a company's total unraveling: a firm freshly validated by public markets turned out to be concealing a fraud that had been quietly running for years, undetected by auditors, underwriters, and investors alike until its own CEO's private holding company gave it away.`,
    sourceUrl: 'https://www.sec.gov/enforcement-litigation/litigation-releases/lr-20660',
  },
  {
    title: 'Russell Wasendorf Sr. and the Forged Bank Statements Behind Peregrine Financial',
    slug: 'russell-wasendorf-peregrine-financial-fraud',
    author: 'ScamShield Editorial',
    tags: ['notorious', 'notorious-scammer', 'historical'],
    body: `Russell Wasendorf Sr. built Peregrine Financial Group from a small brokerage he started in 1980 into one of the largest independent futures and commodities trading firms in the United States, headquartered in Cedar Falls, Iowa. For roughly two decades, while regulators and auditors believed customer funds were fully accounted for, Wasendorf was quietly draining the firm's customer-segregated bank account for his own use.

He pulled off the deception with remarkably low-tech tools: a scanner, an inkjet printer, and image-editing software to forge the firm's bank statements from its actual bank, U.S. Bank, making it look as though customer funds were safely on deposit. To keep the fraud from being caught, he rented a post office box he controlled and listed it as the return address auditors and regulators would use to confirm account balances directly with the bank — intercepting the real correspondence before it could ever reach anyone who might notice the numbers didn't match. The scheme worked for years specifically because industry regulators had never insisted on verifying those balances electronically, directly with the bank itself, instead of through paperwork Wasendorf controlled.

That changed in July 2012, when the National Futures Association, for the first time, required direct electronic confirmation of account balances with U.S. Bank rather than accepting intermediated statements. On July 9, 2012, with that verification underway and his fraud about to be exposed, Wasendorf attempted suicide in his car outside Peregrine's Cedar Falls headquarters, leaving behind a written confession admitting, "I have committed fraud." He survived. Investigators ultimately determined he had embezzled $215.5 million from more than 13,000 customers over roughly two decades.

Wasendorf pleaded guilty in September 2012 to mail fraud, embezzlement, and lying to regulators, and was sentenced in January 2013 to 50 years in federal prison — the statutory maximum — along with an order to repay the full $215.5 million. His case became a case study in how a fraud can survive for decades not because it was especially sophisticated, but because the one verification step that would have caught it immediately was never required until it finally was.`,
    sourceUrl: 'https://www.cftc.gov/PressRoom/PressReleases/6300-12',
  },
  {
    title: 'Calisto Tanzi and the €14 Billion Hole Behind "Europe\'s Enron"',
    slug: 'calisto-tanzi-parmalat-fraud',
    author: 'ScamShield Editorial',
    tags: ['notorious', 'notorious-scammer', 'historical'],
    body: `Calisto Tanzi took over his family's small dairy and ham business in 1961 and spent the next four decades building it into Parmalat, an Italian multinational food conglomerate operating in more than 30 countries with roughly €7.6 billion in annual sales at its peak. Behind that success, Parmalat was quietly accumulating losses and debt that Tanzi and his executives spent over a decade hiding from investors, auditors, and regulators using a web of offshore shell companies in the Cayman Islands and Luxembourg.

The fraud's centerpiece was a Cayman Islands subsidiary called Bonlat Financing Corporation, which claimed to hold €3.95 billion in a Bank of America account — money that simply didn't exist. On December 19, 2003, Bank of America told Bonlat's auditor it held no such account, and the supporting document turned out to bear a forged signature. Parmalat admitted the same day that its assets were overstated by at least that amount. The company had already missed a bond payment weeks earlier after failing to redeem a separate investment in another offshore entity, and by December 24 it filed for bankruptcy, revealing a hole in its accounts of roughly €14 billion — at the time the largest corporate bankruptcy in European history, quickly dubbed "Europe's Enron."

Tanzi faced three separate criminal trials for different aspects of the collapse. A Milan court convicted him of market manipulation in December 2008, sentencing him to 10 years, later reduced to just over 8 years on appeal; a Parma court convicted him of fraudulent bankruptcy in December 2010, sentencing him to 18 years, later reduced on appeal to roughly 17 and a half years; and a third trial in December 2011 convicted him over the separate bankruptcy of Parmatour, his family's tourism company, adding another 9 years, 2 months. Despite the combined weight of these sentences, Tanzi ultimately served just over two years in prison before being moved to house arrest, reportedly due to his advanced age and health.

Calisto Tanzi died on January 1, 2022, at age 83, having spent his final two decades defined by a fraud that had once made Parmalat's yogurt and milk cartons a fixture on breakfast tables across dozens of countries. His case remains one of the starkest European examples of how a genuinely successful, decades-old family business can mask a catastrophic accounting fraud behind a network of offshore shells — right up until a single forged bank document finally couldn't hold the story together anymore.`,
    sourceUrl: 'https://www.euronews.com/2022/01/01/italy-tanzi',
  },
  {
    title: 'Ramalinga Raju and the Confession That Ended Satyam Computer Services',
    slug: 'ramalinga-raju-satyam-fraud',
    author: 'ScamShield Editorial',
    tags: ['notorious', 'notorious-scammer', 'historical'],
    body: `B. Ramalinga Raju founded Satyam Computer Services in 1987 with about 20 employees and built it into one of India's largest IT services companies, listed on the New York Stock Exchange, employing roughly 53,000 people across 66 countries, and counting nearly 185 Fortune 500 companies as clients by the mid-2000s. For years, Satyam was held up as a symbol of India's booming technology sector — until Raju admitted, in his own words, that the company's success had been substantially fictional.

In December 2008, Satyam's board approved using company funds to acquire two Raju family-owned real estate and infrastructure firms for roughly $1.6 billion, a deal shareholders saw as a thinly disguised bailout of the founder's other businesses. The backlash was immediate and severe — Satyam's stock plunged more than 50% in a single day, forcing the board to reverse the acquisition within hours. Weeks later, on January 7, 2009, Raju sent a letter confessing that he had inflated Satyam's cash and bank balances by an amount commonly cited around ₹7,136 crore, roughly $1.5 billion, through years of fabricated invoices and fictitious interest income — money that existed only on the company's books. His letter contained a line that became instantly famous in Indian business journalism: he described the fraud as "like riding a tiger, not knowing how to get off without being eaten." (Notably, Raju's lawyers later argued in court in 2010 that he hadn't actually written the letter himself, though this claim never seriously disrupted the case against him.)

A special CBI court in Hyderabad convicted Raju and nine co-defendants, including his brother, in April 2015 on charges of criminal conspiracy, cheating, and forgery, sentencing him to 7 years in prison — the maximum available under the specific Indian Penal Code sections charged — plus a fine. He and the other defendants were released on bail about a month later while the case remained under appeal. India's securities regulator, SEBI, separately ordered Raju and his family to disgorge roughly ₹1,800 crore in illegal gains.

Satyam's fraud, sometimes called "India's Enron," is widely credited with pushing India toward stronger corporate governance and auditing standards, in much the same way Enron's collapse reshaped American accounting oversight years earlier. Raju's own words about the fraud — a tiger he couldn't safely dismount — remain one of the more candid public confessions in the history of corporate fraud, offered not under cross-examination but voluntarily, once the pressure of sustaining the lie for over a decade had simply become unsustainable.`,
    sourceUrl: 'https://www.npr.org/sections/thetwo-way/2015/04/09/398503322/founder-of-indian-it-giant-satyam-gets-7-years-in-fraud',
    coverImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flickr_-_World_Economic_Forum_-_Ramalinga_Raju,_Founder_and_Chairman,_Satyam_Computer_Services,_India.jpg',
    coverImageCredit: 'Photo: World Economic Forum (CC BY-SA 2.0)',
    coverImagePosition: 30,
  },
  {
    title: 'Takafumi Horie and the "Livedoor Shock" That Shook Tokyo\'s Stock Market',
    slug: 'takafumi-horie-livedoor-fraud',
    author: 'ScamShield Editorial',
    tags: ['notorious', 'notorious-scammer', 'historical'],
    body: `Takafumi Horie dropped out of the University of Tokyo to found what would become Livedoor, an internet portal company he built into one of the most talked-about companies in Japan during the mid-2000s. Horie became a genuine celebrity in Japan — brash, openly ambitious, and a symbol of a new generation of entrepreneurs unafraid of the country's traditionally conservative business establishment. He made headlines with a failed bid to buy a professional baseball team, a hostile takeover attempt of a major television network, and even an unsuccessful run for Japan's parliament, all while Livedoor's stock kept climbing.

That climb was partly artificial. Because Livedoor grew largely by acquiring other companies in exchange for its own stock rather than cash, executives had a direct incentive to keep the share price inflated. Horie and other senior executives set up a network of subsidiary investment funds that conducted circular stock-swap and stock-split transactions with companies Livedoor already effectively controlled, disguising them as legitimate arm's-length deals and using them to book fictitious profits as real earnings. For the fiscal year through September 2004, prosecutors found Livedoor had reported a profit of about ¥5 billion when the company had actually posted a loss of roughly ¥300 million.

The fraud unraveled on January 16, 2006, when Tokyo prosecutors raided Livedoor's headquarters and executives' homes, triggering a stock market selloff so severe — Livedoor's own shares fell roughly 80% within days — that it became known as the "Livedoor Shock." Horie was arrested a week later and formally charged that February. The Tokyo District Court convicted him in March 2007 of securities law violations and sentenced him to two and a half years in prison, a notably harsh sentence by the standards of Japanese white-collar cases, widely attributed to Horie maintaining his innocence throughout rather than expressing remorse.

Horie appealed all the way to Japan's Supreme Court, which upheld the sentence in April 2011. He began serving his term that June, was paroled after about 21 months, and was released in March 2013. His case remains a landmark in Japanese securities law enforcement — proof that even a company's most visible, media-savvy champion of a new business era could be brought down by the same old mechanism: reported profits that existed only in the accounting, not in the business itself.`,
    sourceUrl: 'https://www.japantimes.co.jp/news/2007/03/17/national/horie-handed-2-12-years/',
    coverImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/Takafumi_Horie.jpg',
    coverImageCredit: 'Photo: 伊豆のぬし釣り / Izu no Nushi Tsuri (CC BY 3.0)',
    coverImagePosition: 50,
  },
  {
    title: 'Chuck Blazer: The FIFA Bribery Scandal\'s Cat-Loving Cooperating Witness',
    slug: 'chuck-blazer-fifa-corruption-scandal',
    author: 'ScamShield Editorial',
    tags: ['notorious', 'notorious-scammer', 'historical'],
    body: `Chuck Blazer spent more than two decades at the top of international soccer administration, serving as general secretary of CONCACAF — the governing body for soccer across North and Central America and the Caribbean — from 1990 to 2011, and sitting on FIFA's powerful executive committee from the mid-1990s until 2013 as its first American member. Behind the official titles, Blazer was quietly building a personal fortune through decades of bribes tied to media and marketing rights deals, living a lifestyle that eventually became a symbol of the scandal itself: he kept a Trump Tower apartment costing roughly $18,000 a month, plus a second, adjoining unit for about $6,000 a month that he maintained largely for his cats.

Blazer later admitted under oath to accepting bribes connected to two of soccer's biggest prizes: a payment tied to France's selection as host of the 1998 World Cup over Morocco, and bribes connected to South Africa's selection as host of the 2010 World Cup. He also failed to report or pay US income tax on roughly $11 million in income from this activity. In November 2011, IRS and FBI agents confronted Blazer — a widely reported detail has them intercepting him riding his motorized scooter on Fifth Avenue — with evidence of his unreported income, and rather than face prosecution alone, he agreed to cooperate.

That cooperation turned Blazer into one of the most consequential informants in sports history. Starting in late 2011, he began secretly recording conversations with fellow FIFA and CONCACAF officials, reportedly even wearing a wire at the 2012 London Olympics, gathering evidence that became central to the US Department of Justice's landmark May 2015 indictment charging 14 defendants — nine soccer officials and five corporate executives — with racketeering, wire fraud, and money laundering conspiracy tied to decades of corruption across international soccer.

Blazer had already pleaded guilty under seal in November 2013 to ten counts including racketeering conspiracy, wire fraud conspiracy, money laundering, and tax evasion, agreeing to forfeit more than $1.9 million as an initial installment on a still-undetermined larger amount. He died in July 2017, at age 72, before he was ever formally sentenced — his cooperation having already helped expose one of the largest corruption scandals in the history of international sports, even as his own personal accounting with the law was left permanently unresolved.`,
    sourceUrl: 'https://www.justice.gov/usao-edny/pr/nine-fifa-officials-and-five-corporate-executives-indicted-racketeering-conspiracy-and',
    coverImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/Chuck_Blazer_2010.jpg',
    coverImageCredit: 'Photo: Rustem Kadyrov / Tatarstan.ru (CC BY 4.0)',
    coverImagePosition: 50,
  },
  {
    title: 'Earl Jones: The Unlicensed Adviser Who Defrauded His Own Family and Neighbors',
    slug: 'earl-jones-montreal-ponzi-scheme',
    author: 'ScamShield Editorial',
    tags: ['notorious', 'notorious-scammer', 'historical'],
    body: `Earl Jones spent nearly three decades running an investment advisory business out of Montreal's West Island — without ever being licensed as an investment adviser or broker anywhere in Canada. Starting around 1982, he built a client base almost entirely through his own personal network: friends, fellow parishioners, and people who knew him socially, mostly retirees looking for a trustworthy adviser to manage their savings. Among his clients were his own brother and sister-in-law, who eventually lost $1 million to him.

Jones's operation was a classic Ponzi scheme dressed up as personal, old-fashioned financial advice. He never actually invested his clients' money; instead, he used funds from new clients to pay a steady, illusory 8% annual return to earlier ones, keeping the scheme alive for 27 years while quietly spending roughly $13 million of the money on himself. Investigators later determined the fraud totaled about $50 million across 158 victims — money that existed only as numbers on statements Jones generated himself, with no real underlying investments behind any of it.

The scheme finally collapsed in July 2009, when Jones could no longer meet client withdrawal requests. He disappeared for over two weeks before surrendering to Quebec provincial police on July 27, 2009, and both of his firms were declared bankrupt within weeks. He pleaded guilty to fraud charges in January 2010 and was sentenced the following month to 11 years in prison; a separate class-action lawsuit against the bank that held his clients' funds settled in 2012 for $17 million, returning victims roughly 45 cents for every dollar they'd lost. Jones was released on parole in March 2014, having served about four years of his sentence.

Jones's case is a reminder that the absence of any license or regulatory registration is itself one of the clearest warning signs in a suspected fraud — nothing about his operation was hidden behind sophisticated financial engineering, only behind the simple, durable trust of people who knew him personally and never thought to check.`,
    sourceUrl: 'https://www.theglobeandmail.com/report-on-business/earl-jones-sentenced-to-11-years/article1390571/',
  },
  {
    title: 'Magnus Peterson and the $536 Million Hedge Fund Fraud Hidden Inside Fake Swap Contracts',
    slug: 'magnus-peterson-weavering-capital-fraud',
    author: 'ScamShield Editorial',
    tags: ['notorious', 'notorious-scammer', 'historical'],
    body: `Magnus Peterson, a Swedish-born financier based in the UK, founded Weavering Capital UK Ltd, which managed the Weavering Macro Fixed Income Fund — a Cayman Islands-domiciled hedge fund that grew to roughly $639 million in assets under management at its peak in 2008. To outside investors, the fund appeared to be a standout performer even as the 2008 financial crisis battered markets elsewhere, posting steady returns that made it one of the more sought-after funds of its kind in London.

The steady returns were fiction. Peterson used interest rate swap contracts with a related-party entity he controlled to disguise the fund's real, mounting losses, booking those swaps at fabricated values that made the fund look liquid and profitable when in reality much of its reported value was tied up in essentially worthless paper traded with his own related company. The scheme let the fund keep reporting gains to investors for years while the assets actually backing those numbers were quietly evaporating.

The fraud came apart in March 2009, when the financial crisis pushed investors to seek redemptions the fund couldn't actually meet — there simply wasn't enough real, liquid money behind the reported numbers. The fund was placed into administration and liquidation, ultimately revealing losses of approximately $536 million. The UK's Serious Fraud Office opened a criminal investigation, charging Peterson in December 2012; his trial began at Southwark Crown Court in October 2014.

A jury convicted Peterson in January 2015 on eight counts of fraud, forgery, false accounting, and fraudulent trading, and he was sentenced later that month to 13 years in prison — at the time, the longest sentence ever handed down in the UK for a hedge fund fraud, and a rare case of a financial-crisis-era collapse resulting in a lengthy prison term rather than merely a regulatory settlement. The UK's Financial Conduct Authority separately banned him from the financial services industry for life. Weavering's collapse remains one of the starkest examples of how a fund's reported performance is only ever as real as the counterparty on the other side of its trades — and how dangerous it becomes when that counterparty is secretly the fund manager himself.`,
    sourceUrl: 'https://www.sfo.gov.uk/2015/01/19/city-hedge-fund-manager-convicted-multi-million-pound-fraud/',
  },
  {
    title: 'Steven Hoffenberg and the $475 Million Towers Financial Ponzi Scheme',
    slug: 'steven-hoffenberg-towers-financial-fraud',
    author: 'ScamShield Editorial',
    tags: ['notorious', 'notorious-scammer', 'historical'],
    body: `Steven Hoffenberg founded Towers Financial Corporation in Manhattan in the early 1970s, building it around a legitimate-sounding business: buying distressed consumer and commercial debt — money owed to hospitals, banks, and phone companies — for pennies on the dollar, then collecting on it. As chairman, president, and CEO, and the owner of roughly 71% of its stock, Hoffenberg used that respectable-looking core business as cover for a Ponzi scheme that grew alongside it through the 1980s and into the early 1990s.

Towers raised money from investors by selling bonds and promissory notes, backed by financial statements the SEC would later allege were fabricated — falsely reporting about $13 million in profit over a four-year period through mid-1991, when the company had actually lost roughly $137 million. New investor money was used to pay off earlier investors and to fund Hoffenberg's own lifestyle, including a Long Island mansion and homes in Manhattan and Florida, while the real debt-collection business never came close to generating the returns being promised. Investors are commonly cited as having lost approximately $475 million in the scheme.

The SEC filed a civil securities-fraud suit against Hoffenberg, Towers, and other officers in February 1993, and the company filed for Chapter 11 bankruptcy the following month. Hoffenberg pleaded guilty in April 1995 to a set of federal charges including mail fraud, tax evasion, and obstruction of an SEC inquiry. In March 1997, U.S. District Judge Robert W. Sweet sentenced him to 20 years in prison, a $1 million fine, and restitution commonly cited at approximately $462–463 million. He served 18 years and was released in 2013.

Hoffenberg's case later drew renewed attention because a young Jeffrey Epstein worked at Towers Financial from roughly 1987 until shortly before its 1993 collapse, paid a substantial monthly salary, and reportedly received a large loan from Hoffenberg — but Epstein was never charged in connection with the fraud, and the two men's later, disputed accounts of Epstein's exact role there remain just that: disputed. Towers Financial itself stands as one of the largest Ponzi schemes ever run through a business that, on paper, actually did something real — a reminder that a genuine underlying operation doesn't rule out fraud layered on top of it.`,
    sourceUrl: 'https://www.sec.gov/files/litigation/litreleases/lr15053.txt',
  },
  {
    title: 'Martin Frankel: The Insurance Reserve-Fund Fraud That Ended in a Hamburg Hotel Room',
    slug: 'martin-frankel-insurance-fraud',
    author: 'ScamShield Editorial',
    tags: ['notorious', 'notorious-scammer', 'historical'],
    body: `Martin Frankel presented himself as a skilled financial trader, but he had no securities license and had already been barred from the industry by Toledo regulators years earlier over improper trading. In the 1990s he found a new way in: using a shell entity called the Thunor Trust — fronted as a group of anonymous wealthy European aristocrats to hide that Frankel himself was really in control — he acquired a string of small insurance companies across six states (Tennessee, Mississippi, Oklahoma, Missouri, Alabama, and Arkansas), most of them selling modest burial and funeral policies to low-income policyholders.

Rather than investing the insurers' reserve funds — money legally required to be held in trust to pay future policyholder claims — as he claimed to be doing, Frankel diverted the money through a maze of more than 30 shell companies into accounts he personally controlled, using fabricated trade confirmations to make it look, on paper, like the funds were safely invested. He also set up a fake Catholic charitable foundation, the St. Francis of Assisi Foundation, complete with a real Vatican Curia official who falsely vouched for its legitimacy, to help move and launder money. In total, he is commonly cited as having diverted approximately $200 million from the insurers he controlled.

As regulators closed in during late April and early May 1999, a fire broke out at Frankel's Greenwich, Connecticut mansion — investigators concluded he had been burning incriminating documents in an apparent attempt to destroy evidence before fleeing. He left the country using false passports and was captured in a Hamburg, Germany hotel in September 1999, found carrying additional forged travel documents and smuggled diamonds. Extradited to the United States in 2001, Frankel pleaded guilty in May 2002 to 24 federal counts including racketeering and wire fraud conspiracy. In December 2004 he was sentenced to 200 months — commonly described as nearly 17 years — in prison and ordered to pay roughly $204 million in restitution; the sentence was reaffirmed on resentencing in 2006 following an unrelated Supreme Court sentencing-guidelines ruling.

Investigators who searched Frankel's properties also found astrological charts he had reportedly used to help guide his trading decisions — an odd footnote to a fraud that, at its core, worked the same way most insurance-reserve schemes do: money that was supposed to be untouchable, sitting safely in trust for policyholders, quietly wasn't there anymore by the time anyone came looking.`,
    sourceUrl: 'https://www.sec.gov/enforcement-litigation/litigation-releases/lr-16888',
  },
  {
    title: 'Gerald Payne and the "Double Your Blessings" Church Ponzi Scheme',
    slug: 'gerald-payne-greater-ministries-fraud',
    author: 'ScamShield Editorial',
    tags: ['notorious', 'notorious-scammer', 'historical'],
    body: `Gerald Payne founded Greater Ministries International in Tampa, Florida, in 1993, presenting it as an evangelical Christian ministry operating out of a converted bank building complete with a chapel, offices, and vaults. Rather than asking members for investments, Payne and his associates asked for "gifts" — framed, with scripture like Luke 6:38 ("Give, and it shall be given unto you"), as an act of faith rather than a financial transaction. In return, participants in what was successively rebranded the "Double Your Money Program," the "Double Your Blessings Program," and the "Faith Promises Program" were promised their gift would be doubled within 17 months.

Underneath the religious framing, Greater Ministries operated as a straightforward Ponzi scheme: there were no real gold or diamond mines backing the promised returns, no legitimate offshore office, and the "Greater International Bank of Nauru" it claimed to operate was, in fact, just a storefront inside the Tampa building. New members' gifts funded "giftbacks" to earlier participants, while directors took a 5% commission and only a small fraction of the money collected ever reached any actual charitable purpose. Recruiting spread member to member through churches nationwide and overseas; the scheme is commonly cited as having raised approximately $400–500 million from roughly 18,000–20,000 victims before federal authorities shut it down in August 1999, with criminal charges already filed that March.

A jury convicted Payne in March 2001 on 19 counts, including conspiracy to commit mail and wire fraud and conspiracy to commit money laundering. He was sentenced that August by U.S. District Judge James Whittemore to 27 years in prison. Several co-defendants were convicted alongside him, including his wife, Betty Payne (roughly 12–13 years), David Whitfield (19 years), Patrick Talbert (roughly 20 years), and Haywood "Don" Hall (roughly 20 years, later returned to the trial court for resentencing on a narrow sentencing-guidelines issue, with his underlying conviction affirmed); two other defendants avoided trial by pleading guilty.

Greater Ministries remains one of the starkest examples of an affinity fraud — a scheme that spread specifically because it recruited through trusted religious communities, using faith itself as the reason members felt safe not asking the questions they might have asked of an ordinary investment pitch.`,
    sourceUrl: 'https://media.ca11.uscourts.gov/opinions/pub/files/200114746.pdf',
  },
  {
    title: 'Andrew Fastow: The Enron CFO Who Hid Billions Inside His Own Side Deals',
    slug: 'andrew-fastow-enron-cfo-fraud',
    author: 'ScamShield Editorial',
    tags: ['notorious', 'notorious-scammer', 'historical'],
    body: `Andrew Fastow joined Enron's finance division in 1990 and rose steadily through the company, becoming Chief Financial Officer in 1998. In that role he was responsible for how Enron, an energy-trading giant, represented its financial health to investors and Wall Street — a job he used to build a hidden financial architecture that made the company look far more profitable and far less indebted than it actually was.

Fastow designed and personally ran a network of off-balance-sheet special purpose entities — commonly known by names like LJM1, LJM2, the Raptor vehicles, and Chewco — that Enron used to move debt off its books and manufacture reported earnings that didn't reflect the underlying business. The arrangement's real conflict of interest was that Fastow didn't just structure these entities on Enron's behalf, he personally managed and invested in several of them, profiting directly from deals he was simultaneously negotiating on the company's side — a setup Enron's own board formally, and improperly, waived its conflict-of-interest rules to allow not once but twice. The SEC's later litigation release documented specific illicit profits, including transactions that funneled millions of dollars through entities Fastow controlled; secondary sources commonly cite his total personal take from these schemes at upwards of $30 million.

Enron fired Fastow on October 24, 2001, once the special-purpose-entity arrangements began coming to light, and the company collapsed into Chapter 11 bankruptcy on December 2, 2001 — at the time the largest bankruptcy filing in US history. Fastow was indicted in October 2002 on 78 counts, but rather than go to trial he pleaded guilty in January 2004 to two counts of conspiracy to commit securities and wire fraud, forfeited $23.8 million, and agreed to cooperate extensively with prosecutors — testimony federal investigators later said was central to convicting CEOs Jeffrey Skilling and Kenneth Lay. His wife, Lea Fastow, separately pleaded guilty to a single misdemeanor tax charge and served one year in prison. Andrew Fastow was sentenced in September 2006 to six years in prison, well below the ten years his original plea exposed him to, largely in recognition of his cooperation, and was released in December 2011.

Fastow's case remains one of the clearest illustrations of how a company's most senior financial officer — the person literally responsible for telling investors the truth about its books — can instead become the architect of the deception, using complexity itself as camouflage: the special-purpose entities were technically disclosed in Enron's filings, buried in language dense enough that almost no one outside the company understood what was actually being hidden inside them.`,
    sourceUrl: 'https://www.sec.gov/enforcement-litigation/litigation-releases/lr-17762',
  },
  {
    title: 'John G. Bennett Jr. and the Christian Charity "Matching Gift" Ponzi Scheme',
    slug: 'john-bennett-new-era-philanthropy-fraud',
    author: 'ScamShield Editorial',
    tags: ['notorious', 'notorious-scammer', 'historical'],
    body: `John G. Bennett Jr. founded the Foundation for New Era Philanthropy in the Philadelphia area in 1989, pitching it to nonprofits, universities, and charities as a way to double their money for a good cause. The offer was that an organization could deposit funds with New Era for a holding period of a few months, after which an anonymous group of wealthy philanthropists would supposedly match the deposit dollar for dollar — turning routine fundraising into what looked like an unusually generous, no-risk multiplier.

There were no anonymous philanthropists. New Era was a Ponzi scheme: money deposited by newly recruited donor organizations was used to pay the "matched" returns owed to earlier depositors, creating a track record of real payouts that made the pitch increasingly credible to more prominent institutions over time. Bennett also personally diverted several million dollars of the funds into his own businesses. The scheme is commonly cited as having moved roughly $354 million through its books in total, with actual unrecovered losses of around $135 million, and its victim list reads like a who's-who of respected American institutions — the University of Pennsylvania, the Philadelphia Orchestra, and the Franklin Institute among them, alongside more than 180 evangelical colleges, seminaries, and Christian charities nationwide that had been drawn in largely through Bennett's standing in evangelical philanthropic circles.

The scheme unraveled in May 1995, after accountant Albert J. Meyer recognized the classic shape of a Ponzi scheme in New Era's structure and alerted both the SEC and a Wall Street Journal reporter; once the paper's questions became public, Bennett could no longer meet a redemption request, and New Era filed for Chapter 11 bankruptcy days later. He was indicted in September 1996 on 82 federal counts including mail fraud, wire fraud, and money laundering. His defense initially pursued an insanity claim, first citing a car accident years earlier and later citing disputed psychiatric diagnoses, before Bennett ultimately entered a plea of no contest in March 1997. He was sentenced that September to 12 years in federal prison and served roughly a decade before his release.

New Era stands out among affinity-style frauds for how far up the trust ladder it reached — not just individual donors but sophisticated, professionally managed institutions with their own finance staff, all persuaded by the promise that goodwill itself, laundered through a wealthy anonymous benefactor, could be turned into free money for a cause everyone involved actually believed in.`,
    sourceUrl: 'https://www.sec.gov/files/litigation/litreleases/lr15095.txt',
  },
  {
    title: 'Lernout & Hauspie: The Belgian Tech Darling Built on Fabricated Korean Sales',
    slug: 'lernout-hauspie-belgian-accounting-fraud',
    author: 'ScamShield Editorial',
    tags: ['notorious', 'notorious-scammer', 'historical'],
    body: `Jo Lernout and Pol Hauspie founded Lernout & Hauspie Speech Products in Ypres, Belgium, in 1987, building a genuine and technically capable speech-recognition and language-technology company that went public on Nasdaq in 1995. By the late 1990s L&H was a rare thing for a Belgian company — a globally hyped tech stock, backed by a $45 million investment from Microsoft in 1997, that briefly reached a market capitalization approaching $10 billion after acquiring well-known names like Dictaphone and Dragon Systems.

Behind the growth story, L&H was manufacturing much of its reported revenue. The SEC later documented three distinct schemes running from 1996 to 2000: roughly $60 million in "sales" to Belgian entities that were really disguised loans, not real transactions; about $110.5 million in fabricated revenue funneled through shell "Language Development Companies," mostly based in Singapore, with few or no actual employees; and, largest and most notorious, close to $175 million in reported sales from L&H's Korean operations, generated through side agreements kept out of the official contract files and fake receivable-factoring arrangements with Korean banks that made non-existent sales look like real, collectible revenue.

Wall Street Journal reporter Jesse Eisinger exposed the Korean revenue scheme in an August 2000 investigation, after another reporter had raised early questions the year before. The stock, which had traded above $72 in March 2000, collapsed to under a dollar by the end of the year; Nasdaq delisted the company in December 2000, and L&H filed for Chapter 11 bankruptcy in the US that November, followed by a Belgian insolvency filing weeks later.

Belgium's Ghent Court of Appeals convicted Lernout, Hauspie, former vice-chairman Nico Willaert, and former CEO Gaston Bastiaens of fraud, forgery, and stock-price manipulation in September 2010, in what was, at the time, Belgium's largest-ever corporate fraud trial; Lernout, Hauspie, and Willaert each received three years of actual imprisonment plus a suspended two-year term and a fine, while Hauspie pleaded guilty and Lernout maintained his innocence throughout, at one point alleging a CIA conspiracy against the company. More than a decade later, in December 2021, a Belgian appeals court ordered Lernout, Hauspie, and several other former board members to pay a combined €655 million in civil damages to thousands of shareholders — a judgment reported as largely symbolic given the defendants' limited means, but a rare instance of a corporate-fraud case still delivering a formal reckoning two decades after the company itself had disappeared.`,
    sourceUrl: 'https://www.sec.gov/enforcement-litigation/litigation-releases/lr-17782',
  },
  {
    title: 'Do Kwon and the $40 Billion Terra/Luna Collapse',
    slug: 'do-kwon-terraform-labs-luna-collapse',
    author: 'ScamShield Editorial',
    tags: ['notorious', 'notorious-scammer', 'historical'],
    body: `Do Kwon co-founded Terraform Labs in 2018 and built the Terra blockchain around two linked cryptocurrencies: TerraUSD (UST), an "algorithmic stablecoin" designed to hold a steady $1 value, and its companion token Luna, which was supposed to absorb UST's price swings through a built-in mint-and-burn arbitrage mechanism rather than any real dollar reserves sitting in a bank. Kwon marketed the system as a self-stabilizing innovation, and drove adoption further by offering roughly 20% annual yields on UST deposits through a companion protocol called Anchor — a return so far outside anything else in finance that it depended entirely on new money continuing to flow in.

The SEC later alleged the stability story was substantially fabricated: that Kwon and Terraform falsely claimed a popular Korean payment app, Chai, was settling real-world transactions on the Terra blockchain when it largely wasn't, and that UST's peg wasn't held up by pure algorithmic design as advertised but was actively propped up behind the scenes through a reserve entity called the Luna Foundation Guard. When UST lost its dollar peg on May 7, 2022, the arbitrage mechanism meant to defend it instead accelerated the collapse, wiping out roughly $40 billion in combined market value within days as Luna's price fell essentially to zero — a catastrophe that rippled through the broader crypto industry and contributed to several other firms' failures that year.

Kwon fled after the collapse and was placed on an Interpol red notice in September 2022. He was arrested in March 2023 at an airport in Montenegro carrying a forged Costa Rican passport, and spent nearly two years in Montenegrin custody while the US and South Korea fought a prolonged extradition battle over him, with Montenegrin courts repeatedly reversing which country he'd be sent to before the country's justice minister finally approved extradition to the United States in December 2024. A New York jury had already found Kwon and Terraform liable for fraud in a parallel SEC civil case in April 2024, resulting in a combined judgment of roughly $4.5 billion.

After his extradition, Kwon pleaded guilty in August 2025 to conspiracy and wire fraud charges, and was sentenced in December 2025 to 15 years in prison — a term longer than prosecutors themselves had requested, reflecting the scale of the losses inflicted on ordinary crypto investors who trusted that "algorithmic stability" meant something closer to safety than it actually did. Terra/Luna remains one of the largest single wealth-destruction events in cryptocurrency history, and a stark illustration of how a technically sophisticated mechanism can still be, underneath the engineering, a story that depends on nobody asking too closely what's actually backing the promise.`,
    sourceUrl: 'https://www.sec.gov/newsroom/press-releases/2023-32',
  },
  {
    title: 'Craig Wright: The Man a Court Ruled Was Never Satoshi Nakamoto',
    slug: 'craig-wright-fake-satoshi-nakamoto-fraud',
    author: 'ScamShield Editorial',
    tags: ['notorious', 'notorious-scammer', 'historical'],
    body: `Craig Wright, an Australian computer scientist, first publicly claimed in 2016 to be Satoshi Nakamoto, the pseudonymous creator of Bitcoin whose true identity had never been confirmed. Rather than simply making the claim and letting the crypto community judge it, Wright spent the following years using it as the basis for lawsuits against Bitcoin developers, exchanges, and platforms, asserting copyright over the Bitcoin white paper itself and intellectual-property rights over foundational Bitcoin technology — turning an unverified identity claim into a legal weapon against people who disagreed with him.

The claim finally got a full judicial test when the Crypto Open Patent Alliance (COPA) sued Wright in England's High Court, seeking a declaration that he wasn't who he said he was. After a six-week trial, Justice James Mellor ruled in March 2024, with a full written judgment following that May, that Wright is not Satoshi Nakamoto, did not create Bitcoin, and did not author its software — describing the evidence against him as "overwhelming." The judgment went well beyond simply rejecting the claim: Mellor found Wright had engaged in "forgery on a grand scale," calling many of the fabricated documents "clumsy," and concluded Wright had deliberately created false evidence and used the courts themselves as a vehicle for fraud, upholding every forgery allegation COPA had raised against him.

The consequences extended past the ruling itself. Mellor issued a worldwide injunction barring Wright from ever again asserting a Satoshi identity claim or bringing related litigation, and referred both Wright and one of his witnesses to England's Crown Prosecution Service to consider prosecution for perjury and forgery — a referral, not a criminal charge, and as of the most recent reporting no criminal case has actually been filed. Wright tested the injunction anyway: in October 2024 he filed a new lawsuit worth more than £900 billion against Bitcoin Core developers and a payments company, in direct violation of Mellor's order. The court found him in contempt, and in December 2024 sentenced him to 12 months in prison, suspended for two years, plus £145,000 in costs; Wright did not appear for the hearing.

Wright's case stands apart from most entries in this collection because the fraud wasn't a pitch for anyone's money directly — it was a fabricated identity, backed by years of forged supporting documents, used to seize legal leverage and reputational authority over one of the most consequential inventions in modern finance. A UK court's final word on the matter was as blunt as the underlying scheme itself: the evidence was manufactured, and the man who manufactured it knew it.`,
    sourceUrl: 'https://www.judiciary.uk/wp-content/uploads/2024/12/COPA-v-Wright-Approved-Judgment-on-Liability-for-Contempt-2024-EWHC-3315-Ch.pdf',
  },
  {
    title: 'Trevor Milton and the Nikola Truck That Only Ever Rolled Downhill',
    slug: 'trevor-milton-nikola-motors-fraud',
    author: 'ScamShield Editorial',
    tags: ['notorious', 'notorious-scammer', 'historical'],
    body: `Trevor Milton founded Nikola Corporation, an electric and hydrogen-fuel-cell truck startup, and took it public in June 2020 through a merger with a special-purpose acquisition company. Within weeks, Nikola's stock had briefly given it a market capitalization larger than Ford's, despite the company having no vehicles in actual production and no revenue expected until the following year — a valuation built almost entirely on Milton's own public promises about what the company's technology could do.

Those promises collapsed in September 2020, when short-seller Hindenburg Research published a report calling Nikola "an intricate fraud built on dozens of lies." Its most vivid finding: a promotional video that appeared to show the "Nikola One" truck driving under its own power had actually been filmed rolling downhill after being towed to the top of a sloped stretch of road in Utah, with the camera angle tilted to disguise the grade — the truck had no working powertrain at the time. Nikola's own response to the report effectively admitted the truck hadn't yet driven under its own propulsion. Prosecutors and the SEC later documented further exaggerations Milton had spread largely through his own social media, including overstated claims about in-house battery and hydrogen production capability and inflated reservation-order figures.

The Department of Justice indicted Milton in July 2021, and a federal jury convicted him in October 2022 on one count of securities fraud and two counts of wire fraud. He was sentenced in December 2023 to four years in prison and a $1 million fine, though he remained free on bond throughout the appeals process and never actually reported to prison. Nikola itself separately settled with the SEC for $125 million without admitting wrongdoing, and the company filed for Chapter 11 bankruptcy in February 2025 — by which point its stock, once worth more than Ford's, had become nearly worthless.

In March 2025, President Trump pardoned Milton, erasing the sentence just as prosecutors were seeking a court order for roughly $680 million in restitution to Nikola shareholders. Reporting connected the pardon to more than $1.8 million Milton and his wife had donated to Trump's 2024 campaign. Whatever one makes of the pardon, the underlying fraud itself remains fully adjudicated by a jury: the case is a reminder that a faked demonstration video can inflate a company's value by billions of dollars for years before the truck, so to speak, actually has to drive itself.`,
    sourceUrl: 'https://www.justice.gov/usao-sdny/pr/trevor-milton-sentenced-four-years-prison-securities-fraud-scheme',
  },
];

// Practical "how it works / red flags / what to do" guides covering the
// major scam categories, the same kind of coverage the FTC's Consumer
// Advice site and AARP's Fraud Watch Network publish — well-documented
// patterns, not fabricated statistics or invented case details.
const GUIDE_ARTICLES: SeedArticle[] = [
  {
    title: 'Romance Scams: How They Work and the Warning Signs',
    slug: 'romance-scams-warning-signs',
    author: 'ScamShield Editorial',
    tags: ['guide', 'romance'],
    sourceUrl: 'https://consumer.ftc.gov/romance-scams',
    body: `A romance scam starts like an ordinary online connection — a dating app match, a friend request, a comment on a post — and moves fast toward intimacy. Within days or weeks, the scammer is expressing deep feelings, planning a future together, and finding reasons a video call or in-person meeting can't quite happen yet: they're on a remote oil rig, deployed overseas, or working on an international contract.

Once trust is established, money requests begin, usually framed as a temporary problem: a medical emergency, a stuck shipment needing customs fees, a plane ticket to finally meet in person. Each payment is followed by a new complication requiring another payment. Some romance scams evolve into "pig butchering" schemes, where the scammer eventually persuades the victim to invest in a fake cryptocurrency platform that shows fabricated gains, encouraging larger and larger deposits before the platform vanishes.

Warning signs: a profile that refuses video calls or always has a reason the camera is broken; professions of love within days; any request to move the conversation off the dating platform quickly; and any request for money, gift cards, or cryptocurrency, no matter how small or how sympathetic the reason.

If you're in this situation: stop sending money immediately, do a reverse image search on their profile photos (stolen photos are common), and don't be embarrassed to talk to a friend or family member about the relationship before sending anything further. Scammers deliberately isolate victims from people who might spot the pattern.`,
  },
  {
    title: 'Tech Support Scams: The Fake Pop-Up That Wants Remote Access',
    slug: 'tech-support-scam-fake-popups',
    author: 'ScamShield Editorial',
    tags: ['guide', 'tech-support'],
    sourceUrl: 'https://consumer.ftc.gov/articles/how-spot-avoid-and-report-tech-support-scams',
    body: `It usually starts with a browser pop-up: a loud warning sound, a message claiming your computer is infected, and a phone number to call for "Microsoft support" or "Apple security." The pop-up is fake — no legitimate operating system or antivirus vendor detects a virus and tells you to call a phone number — but it's designed to look exactly like a real system alert, sometimes locking the browser in full-screen mode to make it harder to close.

Calling the number connects you to a scammer posing as a technician, who will ask you to install remote-access software so they can "diagnose" the problem. Once they have control of your computer, they may show you fabricated evidence of infections, lock you out of your own files, or quietly search for banking information. The call typically ends with a demand for payment — often hundreds of dollars, frequently requested via gift cards or wire transfer — to "fix" a problem that was never real.

The same scam also runs in reverse: an unsolicited phone call claiming to be from a well-known tech company, warning that your computer has already been compromised.

If you see one of these pop-ups: close the browser without calling the number (force-quit if it won't close normally) and don't install anything. If you already granted remote access, disconnect from the internet, run a real antivirus scan from a source you already trust, and change your passwords from a different, uncompromised device.`,
  },
  {
    title: 'Government Impersonation Scams: Fake IRS, SSA, and Police Calls',
    slug: 'government-impersonation-scams',
    author: 'ScamShield Editorial',
    tags: ['guide', 'government-impersonation'],
    sourceUrl: 'https://consumer.ftc.gov/articles/how-avoid-government-impersonation-scam',
    body: `A caller claims to be from the IRS, the Social Security Administration, or local police, and says something is seriously wrong: unpaid taxes, a suspended Social Security number, an outstanding warrant. The tone is urgent and threatening — arrest, deportation, frozen bank accounts — and the caller insists the only way to resolve it immediately is a specific, unusual form of payment: gift cards, a wire transfer, or increasingly, in-person cash pickup by a courier.

These scams work because they weaponize a real fear of authority and legal consequence, combined with manufactured urgency that discourages the victim from hanging up and verifying independently. Caller ID can be spoofed to display a real government phone number, which is not proof the call is legitimate.

The reliable rule: no legitimate government agency in the U.S. demands immediate payment by phone via gift card, wire transfer, or cash courier, and none will threaten immediate arrest over the phone for an unpaid bill. The IRS's first contact about a tax issue is nearly always by mail, not a phone call.

If you get one of these calls: hang up. Do not call back any number the caller provides. If you're concerned there might be a real issue, look up the agency's official phone number independently (not from the call or a text) and contact them directly.`,
  },
  {
    title: 'Business Email Compromise: The Scam That Costs Companies the Most',
    slug: 'business-email-compromise-bec',
    author: 'ScamShield Editorial',
    tags: ['guide', 'business-email-compromise'],
    sourceUrl: 'https://www.ic3.gov/CrimeInfo/BEC',
    body: `Business email compromise (BEC) targets companies rather than individuals, and consistently ranks among the costliest categories of fraud reported to the FBI's Internet Crime Complaint Center, often exceeding the losses from every consumer-facing scam combined. The mechanism is simple: a scammer gains access to, or closely spoofs, an executive's or vendor's email account, then sends a request that looks completely routine — an urgent wire transfer to close a deal, a changed bank account for an existing vendor invoice, a request for employee W-2 data.

What makes BEC effective is that it doesn't rely on malware or a dramatic hack. It relies on the request looking exactly like something that happens legitimately all the time, sent at a moment (end of quarter, an executive traveling, a real ongoing deal) when a slightly unusual request is least likely to raise questions, and often timed for late Friday or before a holiday when verification is slower.

The core defense is procedural, not technical: any request to change payment details or wire funds should be verified through a second communication channel — a phone call to a known, previously verified number, not one provided in the email — before the money moves. This single habit defeats the overwhelming majority of BEC attempts, because the scammer only controls the email channel.

If your business is targeted: contact your bank immediately to attempt a wire recall (speed matters — the window to reverse a fraudulent wire closes fast), and file a report with the FBI's IC3 (ic3.gov).`,
  },
  {
    title: 'The Grandparent Scam: A Panicked Call From "Family"',
    slug: 'grandparent-scam-emergency-call',
    author: 'ScamShield Editorial',
    tags: ['guide', 'grandparent-scam'],
    sourceUrl: 'https://consumer.ftc.gov/features/pass-it-on/impersonator-scams/grandkid-scams',
    body: `The phone rings and a young voice says "Grandma?" or "Grandpa, it's me" — often crying or sounding distressed, sometimes with static or a bad connection making the voice harder to place with certainty. Before the target can ask many questions, the caller (or someone who takes over the call claiming to be a lawyer, bail bondsman, or police officer) explains there's been an accident, an arrest, or some other emergency, and money is urgently needed — often via wire transfer, gift cards, or a cash pickup — and pleads not to tell the parents because it would mean trouble.

The scam relies on emotional urgency overriding the instinct to verify: it's specifically designed to be resolved before there's time to think it through or call another family member to check. Some versions now use AI voice-cloning from a few seconds of audio scraped from social media to make the "grandchild's" voice sound more convincing, though the low-tech version — just guessing at a generic emotional tone — still works often enough that scammers keep using it.

The defense is a simple habit: agree in advance with family members on a code word, or simply commit to always hanging up and calling the grandchild (or their parents) back on a known number before sending anything, no matter how urgent the call sounds or how much the caller pressures against it. A real emergency will still be real five minutes later, after you've verified it.`,
  },
  {
    title: '"Pig Butchering": Inside the Long-Con Crypto Investment Scam',
    slug: 'pig-butchering-crypto-investment-scam',
    author: 'ScamShield Editorial',
    tags: ['guide', 'investment-fraud'],
    sourceUrl: 'https://consumer.ftc.gov/articles/what-know-about-cryptocurrency-scams',
    body: `"Pig butchering" (a direct translation of a term the scam operations themselves use) describes a fraud pattern that fattens a victim up over weeks or months of relationship-building before taking everything at once. It typically begins with what looks like a wrong-number text or a friendly message on a dating app or social media, building an ordinary friendship or romance over time — often without any money request at all at first.

Eventually the scammer mentions they've been making excellent returns on a cryptocurrency trading platform, and offers to help the victim get started. The platform is fake, built to look like a real trading app or exchange, but entirely controlled by the scam operation. Early "investments" show real-looking, steadily growing returns, and small withdrawals are often permitted specifically to build confidence. Once the victim is convinced and has committed a large sum — sometimes their life savings — further withdrawal requests are blocked with new fees, tax demands, or account "verification" requirements, each one a further attempt to extract money, until the victim finally realizes the entire platform and the relationship built around it were fabricated.

These operations are frequently run at industrial scale by organized criminal groups, in some documented cases using trafficked and coerced labor to operate the fake platforms and run the messaging.

Red flags: an online relationship that pivots to investment advice, a platform you can't find independent, non-scammer-provided reviews of, and any situation where withdrawing your own money requires paying an additional fee first. Legitimate investment platforms never charge a fee to access money that's already yours.`,
  },
  {
    title: 'Phishing: The Scam Behind Most Other Scams',
    slug: 'phishing-email-text-basics',
    author: 'ScamShield Editorial',
    tags: ['guide', 'phishing'],
    sourceUrl: 'https://consumer.ftc.gov/articles/how-recognize-avoid-phishing-scams',
    body: `Phishing is less a single scam than the delivery mechanism for many others: an email or text designed to look like it's from a bank, employer, delivery company, or government agency, aiming to get the recipient to click a link, enter credentials on a fake login page, or open a malicious attachment. "Smishing" (SMS phishing) and "vishing" (voice phishing) are the same technique over text and phone calls.

Effective phishing exploits routine, low-attention moments: a "your package couldn't be delivered" text when you're actually expecting a package, a "suspicious sign-in" email that looks exactly like your bank's real notifications, an "invoice attached" email that matches a vendor you actually work with. The link usually leads to a page that's a near-perfect visual copy of the real login page, differing only in the URL — which is why checking the actual domain, not just how the page looks, matters more than anything else.

Modern phishing has gotten harder to spot by eye: the crude spelling errors of a decade ago are increasingly rare, since scammers now use the same tools everyone else does to write clean, professional-sounding messages.

The reliable habits: never click a link in an unexpected message claiming to be from a financial institution — instead, open your browser and type in the institution's known address directly, or use their official app. Hover over (or long-press) a link to preview the actual destination URL before clicking. And treat any message creating artificial urgency ("act within 24 hours or your account will be closed") as a signal to slow down, not speed up.`,
  },
  {
    title: 'Package Delivery Scams: The Text You Weren’t Expecting',
    slug: 'package-delivery-scam-texts',
    author: 'ScamShield Editorial',
    tags: ['guide', 'phishing'],
    sourceUrl: 'https://www.uspis.gov/news/scam-article/smishing-package-tracking-text-scams',
    body: `A text arrives claiming to be from USPS, FedEx, UPS, or a similar carrier: a package couldn't be delivered, or a small customs/redelivery fee is due, with a link to resolve it. The timing is what makes it effective — sent broadly enough that a meaningful share of recipients actually are expecting a delivery, at which point the message feels routine rather than suspicious.

The link leads to a fake payment page designed to harvest credit card details, and sometimes additional personal information under the guise of "verifying your identity" for the redelivery. No major carrier requests payment via a text link for standard delivery or redelivery — legitimate delivery issues are handled through the carrier's own app or website, entered directly, not through a link in an unsolicited text.

If you get one of these texts: don't click the link. If you want to check on an actual package, open the carrier's official app or type their website address in directly and track the shipment using your real tracking number. Report the text as spam, and if you entered any information on the fake page, contact your bank about your card and monitor your statements closely.`,
  },
  {
    title: 'Job Offer Scams: Fake Remote Work and the Overpayment Check',
    slug: 'job-offer-scam-overpayment-check',
    author: 'ScamShield Editorial',
    tags: ['guide', 'employment-fraud'],
    sourceUrl: 'https://consumer.ftc.gov/articles/how-spot-avoid-and-report-fake-check-scams',
    body: `A job offer arrives — often for flexible, well-paid remote work — sometimes after only a brief chat interview, or no interview at all beyond a text exchange. The role is vague ("personal assistant," "mystery shopper," "payment processor"), the pay is generous relative to the minimal qualifications required, and the "employer" quickly sends a check, often for more than an agreed advance or equipment stipend, asking the new hire to deposit it and wire back the difference, or to use it to purchase equipment from a specific vendor.

The check is fraudulent. Banks are required to make deposited funds provisionally available within a few business days, well before the check actually clears through the full bank verification process, which can take weeks. By the time the check bounces, the victim has already wired real money back to the scammer and is left owing their bank the full amount of the fake check that was reversed.

A second common version asks new hires to buy equipment, gift cards, or software licenses upfront with a promise of reimbursement that never arrives, or harvests sensitive personal information (Social Security number, bank details) for "direct deposit setup" and "background checks" from a job that never actually existed.

Red flags: any job that sends money before you've done any work, any request to wire back a portion of a check you just deposited, and an employer who conducts an entire hiring process over text or chat with no video call and no verifiable company presence. A deposited check being "available" in your account balance is never proof that it has actually cleared.`,
  },
  {
    title: 'Charity Scams: When a Disaster Becomes a Business Opportunity for Fraud',
    slug: 'charity-scams-after-disasters',
    author: 'ScamShield Editorial',
    tags: ['guide', 'charity-fraud'],
    sourceUrl: 'https://consumer.ftc.gov/all-scams/charity-scams',
    body: `In the days after a major hurricane, earthquake, wildfire, or other widely covered disaster, solicitations spike — texts, social media posts, and phone calls asking for donations to help victims, often using real news photos and genuine-sounding organization names that are close enough to well-known charities to avoid a second look. Some fraudulent "charities" are set up specifically in the window after a disaster and disappear once donations stop.

The urgency of a real tragedy is exactly what makes people skip the verification they'd normally do — nobody wants to interrogate a stranger raising money for earthquake victims, which is precisely the reaction the scam depends on.

Before donating: look up the organization independently rather than through a link in the solicitation, and check its standing on an independent charity evaluator (such as Charity Navigator or the BBB Wise Giving Alliance) rather than trusting the name alone, since scam charities frequently pick names one word off from a real, well-known organization. Be especially cautious of any solicitation asking for payment via gift card, cryptocurrency, or wire transfer — legitimate charities overwhelmingly accept standard payment methods that offer some fraud protection, like a credit card through their verified website.`,
  },
  {
    title: 'Elder Fraud: Why Scammers Target Older Adults, and How to Protect a Loved One',
    slug: 'elder-fraud-protecting-older-adults',
    author: 'ScamShield Editorial',
    tags: ['guide', 'elder-fraud'],
    sourceUrl: 'https://www.ic3.gov/crimeinfo/elderfraud',
    body: `Adults aged 60 and older are the single largest group of reported fraud losses in the United States — the FBI's Internet Crime Complaint Center recorded more than $7.7 billion in losses from victims in this age group in 2025 alone, by far the largest dollar total of any age bracket and a sharp increase over the year before. Scammers deliberately target older adults not because they're less capable, but because this population often holds more accumulated savings, may be more trusting of unsolicited contact, and — critically — is statistically far less likely to report being victimized, out of embarrassment or fear of losing independence.

The mechanisms vary widely: "grandparent scams" use a panicked, fabricated emergency call to pressure immediate wiring of money; "phantom hacker" schemes convince a victim their bank account has been compromised and walk them through moving their savings into a fake "safe" account actually controlled by the scammer; tech support scams claim a computer is infected and talk a victim into installing remote-access software; and romance and investment scams build trust over weeks or months before requesting money. A growing and particularly cruel category is the recovery scam, where a fraudster contacts someone who has already lost money to an earlier scam, posing as a lawyer, government official, or recovery service that can get the stolen funds back — for an upfront fee that simply disappears along with the rest.

Repeat victimization is common and not accidental: fraudulent telemarketers and scam operations buy and trade "sucker lists" — names, phone numbers, and details of people who have already paid once — because someone who has fallen for a scam before is considered more likely to fall for the next one, not less.

What makes these schemes especially effective is a combination of manufactured urgency and social isolation: many are specifically designed to be resolved before the victim can call a family member or think it through. Watch for warning signs like sudden secrecy about finances, unusual bank withdrawals, or a new "friend" or online contact who discourages contact with family.

If you're helping an older family member, agree in advance on a household rule that no money moves — wire transfer, gift card, cryptocurrency, or cash pickup — without a second person's confirmation, no matter how urgent the caller makes it sound. If you suspect fraud, the Department of Justice's National Elder Fraud Hotline (833-372-8311) can help file a report, and reporting to IC3.gov, even for a small loss, helps investigators connect it to a larger pattern.`,
  },
  {
    title: 'Online Marketplace Scams: What to Watch for Buying and Selling on Facebook Marketplace and Craigslist',
    slug: 'online-marketplace-scams-facebook-craigslist',
    author: 'ScamShield Editorial',
    tags: ['guide', 'online-marketplace'],
    sourceUrl: 'https://consumer.ftc.gov/articles/buying-online-marketplace',
    body: `Online marketplaces like Facebook Marketplace, Craigslist, and OfferUp connect local buyers and sellers directly, without the structured buyer-protection programs and dispute resolution that come standard on larger platforms like Amazon or eBay — which is exactly what makes them attractive to scammers on both sides of a transaction.

As a buyer, the most common trap is a listing for something in high demand or priced well below market value, where the "seller" insists on payment before you can see or inspect the item — sometimes through a wire transfer, gift card, or cryptocurrency, and sometimes through a fake shipping or escrow arrangement that looks legitimate but is entirely fabricated. Once payment goes through, the seller disappears and the item never existed.

As a seller, a common scam starts with a buyer who seems eager to purchase, then insists on paying through a mobile payment app and sends what looks like a legitimate payment confirmation — except no money actually moved, and the scam depends on you shipping or handing over the item before you check your actual account balance. A related version specifically tracked by the FTC has the "buyer" texting a verification code and asking the seller to read it back, supposedly to "verify you're a real person" — the seller who complies has actually just helped the scammer set up a Google Voice number in the seller's name, which can then be used to get around two-factor authentication on other accounts.

The common thread across nearly every marketplace scam is a push to move the transaction outside the platform's built-in protections — a request to pay by wire, gift card, cryptocurrency, or a "verification code" that has nothing to do with the actual sale, or unusual urgency around a deal that otherwise seems too good.

The safer approach: for local items, meet in person in a public place and exchange cash or a protected payment method at the time of pickup; for anything shipped, use the marketplace's own checkout and payment system rather than a side conversation, since that's what carries buyer and seller protections; and never read a verification code sent to your phone to someone else, regardless of the reason given. If something goes wrong, report it to the platform directly and to the FTC at ReportFraud.ftc.gov.`,
  },
  {
    title: 'Gift Card Scams: Why Scammers Always Ask for Them, and Why That\'s the Giveaway',
    slug: 'gift-card-payment-scams',
    author: 'ScamShield Editorial',
    tags: ['guide', 'gift-card-scams'],
    sourceUrl: 'https://consumer.ftc.gov/gift-card-scams',
    body: `Gift cards show up as the payment method in an enormous range of otherwise unrelated scams — a fake IRS agent demanding back taxes, a "grandchild" needing bail money, a tech support caller charging for a fake repair, a romance scammer facing a manufactured emergency. The scam story changes every time; the demand for a gift card almost never does, because gift cards work uniquely well for scammers in ways that go beyond simple convenience.

Once a scammer has a gift card's number and PIN — read aloud over the phone, photographed, or entered on a fake payment page — the money can be drained and moved almost immediately, with no bank to call and no transaction to reverse. The FTC reports that gift card demands from scammers have increased roughly 270% since 2015, with more than $245 million paid to scammers this way since 2018 and a median loss around $840 per victim; Target, Google Play, and eBay gift cards are consistently among the brands scammers request most.

A newer variant skips the phone call entirely: a scammer tampers with cards still on a store rack, either swapping the barcode or scratching off and photographing the PIN before resealing the packaging, then simply monitors the card online and drains it the moment an unsuspecting shopper activates it at checkout — meaning a gift card can already be compromised before anyone has said a word to the eventual victim.

The rule that cuts through every version of this scam: no real government agency, business, family member in a genuine emergency, or utility company ever demands payment specifically and exclusively in gift cards, and legitimate purchases are never completed by reading a card's PIN to someone over the phone. If you're asked to pay this way, stop — and if you've already bought and read off a card's number, contact the retailer immediately, since some can flag or freeze an unspent balance if you act fast enough, and report it to the FTC at ReportFraud.ftc.gov.`,
  },
  {
    title: 'Student Loan Forgiveness Scams: What Real Debt Relief Looks Like',
    slug: 'student-loan-forgiveness-scams',
    author: 'ScamShield Editorial',
    tags: ['guide', 'student-loan-scams'],
    sourceUrl: 'https://consumer.ftc.gov/all-scams/student-loan-education-scams',
    body: `A call, text, or ad promises fast, guaranteed forgiveness of federal student loan debt — sometimes claiming affiliation with the Department of Education or Federal Student Aid — in exchange for an upfront fee, or asks the borrower to hand over their Federal Student Aid (FSA) ID to "process" the forgiveness on their behalf. Both are hard stops: charging an upfront fee for federal student loan debt relief is illegal, and an FSA ID handed to a stranger gives them the same access to a borrower's loan account and personal financial aid information that the borrower has.

These scams cluster around real news — any time a genuine loan forgiveness program, payment pause, or policy change is announced, scam activity spikes, since scammers can reference the real announcement to sound credible while promising a faster or broader benefit than what's actually available. The FTC has also tracked scammers specifically targeting Spanish-speaking borrowers, including one operation that impersonated the Department of Education while charging Puerto Rico residents hundreds of dollars in fees for help that was, and remains, free through official channels.

A separate but related scam targets currently enrolled students directly: a caller impersonating college financial-aid or billing staff claims a tuition payment is overdue and threatens to drop the student from their classes within hours unless payment is sent immediately, exploiting the fact that students rarely question a call that sounds like it's coming from their own school.

The one channel that actually manages federal student loans is StudentAid.gov, directly — never a third party, however official they sound on the phone. If you're contacted about loan forgiveness, hang up and check your loan status by logging into your own StudentAid.gov account, and report the contact to the FTC at ReportFraud.ftc.gov.`,
  },
  {
    title: 'Crypto ATM Scams: Why Fraudsters Send Victims to a Kiosk Instead of a Bank',
    slug: 'crypto-atm-kiosk-scams',
    author: 'ScamShield Editorial',
    tags: ['guide', 'crypto-atm-scams'],
    sourceUrl: 'https://www.ic3.gov/PSA/2026/PSA260515-2',
    body: `A scammer posing as a government official, bank fraud investigator, tech support agent, or romantic partner convinces a victim their money is at risk and that the only way to protect it — or, in a romance or investment version, to grow it — is to withdraw cash and deposit it into a cryptocurrency ATM. The victim is walked through the process step by step: which kiosk to use, how much cash to insert, and finally, a QR code to scan that sends the converted cryptocurrency directly to the scammer's wallet, where it's gone permanently the moment the transaction confirms.

The FBI's Internet Crime Complaint Center reported more than 13,400 complaints involving cryptocurrency kiosks in 2025 alone, with losses exceeding $388 million — a 58% jump in losses from the year before. More than half of all complaints came from people over 50, who together accounted for over $302 million in losses, making this one of the most costly scam categories targeting older adults specifically.

What makes crypto kiosks especially attractive to scammers is the same thing that makes a wire transfer or gift card attractive: the transaction is fast, and once confirmed, it cannot be reversed or recalled by any bank, kiosk operator, or law enforcement agency. Unlike a bank, a crypto kiosk has no fraud department to call minutes after a transaction to freeze it — by the time a victim realizes what happened, the funds have typically already moved through multiple wallets.

The reliable rule: no legitimate government agency, bank, or law enforcement officer will ever instruct you to withdraw cash and deposit it into a cryptocurrency kiosk to "protect," "verify," or "secure" your money — this instruction is, by itself, proof of a scam, regardless of how convincing the caller sounds or how official their story is. If someone directs you toward a crypto ATM, stop, hang up, and verify the situation independently before sending anything. If you've already sent money this way, report it immediately to IC3.gov — the earlier a transaction is reported, the better the (still limited) chance of any recovery.`,
  },
  {
    title: 'Puppy Scams: The Fake Listing Behind a Pet That Never Arrives',
    slug: 'puppy-pet-sale-scams',
    author: 'ScamShield Editorial',
    tags: ['guide', 'pet-scams'],
    sourceUrl: 'https://www.bbb.org/all/petscams',
    body: `An online ad shows an adorable purebred puppy at a price well below what a breeder would normally charge, with the "seller" explaining they can't meet in person — they're relocating, deployed, or the puppy is with a shipper — and asking for payment upfront to secure it. The photos look real because they usually are: stolen from a legitimate breeder's website or social media and reused across dozens of fake listings. The Better Business Bureau estimates that as much as 80% of sponsored pet advertisements online may be fraudulent.

Once the first payment clears, the scam typically doesn't end there — a string of unexpected "last-minute" fees follows, framed as vaccinations, a special climate-controlled crate, pet insurance, or customs clearance for a shipment that was never real to begin with, each one presented as the final cost standing between the buyer and their new pet. The puppy, of course, never arrives, because it never existed.

These scams work because they target something a too-good-to-be-true financial pitch usually can't: genuine emotional attachment, formed the moment a buyer falls for the photo of a specific puppy that feels already like theirs. That emotional investment is exactly why buyers often keep paying "one more fee," reluctant to walk away from a pet they've already started to think of as their own.

Before paying anything: insist on a live video call showing the actual puppy in real time (not a pre-recorded clip), search the listing's photos online to check whether they've been used elsewhere, and never wire money, use a cash app, or pay with a gift card for a pet you haven't seen in person — reputable breeders and shelters overwhelmingly allow an in-person visit before any money changes hands. If you're set on buying online, verify the seller independently through petscams.com or the BBB before sending a deposit.`,
  },
  {
    title: 'Timeshare Resale and Exit Scams: When "Getting Rid of It" Becomes the Scam',
    slug: 'timeshare-resale-exit-scams',
    author: 'ScamShield Editorial',
    tags: ['guide', 'timeshare-scams'],
    sourceUrl: 'https://consumer.ftc.gov/articles/timeshares-vacation-clubs-and-related-scams',
    body: `Timeshare owners looking to sell or get out of a contract are a specifically targeted group, because the underlying problem is real: timeshares are notoriously hard to resell, and that genuine frustration is exactly what two related scams are built to exploit. A "resale" scam cold-calls an owner claiming to already have an interested, ready-to-close buyer, then asks for a few thousand dollars upfront to cover taxes, closing costs, or paperwork fees — money the owner is assured will be refunded at closing. There is no buyer. An "exit" scam instead promises to legally cancel the timeshare contract entirely, charging anywhere from a few thousand to tens of thousands of dollars upfront, often pressured through a high-pressure sales presentation at a hotel or restaurant insisting the owner "must act today."

Both scams share the same tell: a large fee paid before any actual service is delivered, for a result the company can't actually guarantee. Regulatory action has already caught operators doing exactly this at scale — one timeshare-exit company was ordered to pay $140 million in restitution after taking more than $90 million from consumers, mostly older adults, at an average loss of nearly $29,000 per person.

What makes both variants effective is that they don't need to convince anyone a scam is happening — they only need to be marginally more appealing than the genuinely bad options a real timeshare owner is already facing (an unwanted, hard-to-sell asset with ongoing maintenance fees). A caller offering an easy, guaranteed exit or a fast sale is telling an owner exactly what they want to hear.

Real protection starts with the guarantee itself: no legitimate resale or exit company can promise a sale or a successful cancellation, and any company that does is not being honest. Contact your timeshare company directly first — canceling within a state's rescission period, or negotiating an exit, is something an owner can often attempt for free before ever paying a third party. If you do hire a company, verify it independently, get every promise in writing, and favor a reseller that only takes a fee after your timeshare actually sells rather than before.`,
  },
  {
    title: 'Free Trial Scams: When "Just Pay Shipping" Becomes a Recurring Charge',
    slug: 'free-trial-subscription-trap-scams',
    author: 'ScamShield Editorial',
    tags: ['guide', 'subscription-scams'],
    sourceUrl: 'https://consumer.ftc.gov/all-scams/free-trial-scams',
    body: `An online ad for a skincare cream, weight-loss supplement, or similar product offers a "risk-free trial" for the cost of shipping alone — often $4.99 or less — with the actual subscription terms buried in small, faded, or hard-to-find fine print. What isn't made clear: the trial period is short, cancellation has to happen before it ends, and once it does, the same card gets charged the full product price on a recurring basis, sometimes monthly, until the customer notices and manages to cancel.

The FTC has taken enforcement action against operators running exactly this pattern at scale, including one case that resulted in more than $28 million in refunds to consumers deceived by supposed free trial offers for personal care products, and a separate action against a major software company for using a hidden early-termination fee to trap customers into subscription plans they couldn't easily leave. A related version skips the product step entirely: a fake "your subscription is about to renew" notice arrives for a service the recipient never actually signed up for, designed purely to harvest a callback and a credit card number from someone trying to head off a charge that was never coming.

What makes this pattern effective is timing and friction working in the company's favor simultaneously: the trial window is short enough that many people forget to act, and even when they remember, cancellation is deliberately made harder than signup — a phone-only cancellation line with long hold times, a canceled account that mysteriously reactivates, or a "retention" flow designed to wear down anyone trying to leave.

Before entering payment details for any "free" trial: read the actual terms for the exact cancellation deadline and price after the trial ends, set a calendar reminder several days before that date, and check your card statement for the trial company's real charge afterward. If you're billed for something you never signed up for, dispute the charge with your bank or card issuer directly rather than calling a number provided in a text or email, and report the company to the FTC at ReportFraud.ftc.gov.`,
  },
  {
    title: 'QR Code Scams ("Quishing"): The Link You Can\'t See Before You Scan It',
    slug: 'qr-code-quishing-scams',
    author: 'ScamShield Editorial',
    tags: ['guide', 'qr-code-scams'],
    sourceUrl: 'https://consumer.ftc.gov/consumer-alerts/2023/12/scammers-hide-harmful-links-qr-codes-steal-your-information',
    body: `A QR code sitting on a parking meter, a restaurant table, or a public charging station looks exactly like any other — until it's a sticker a scammer placed directly over the real one. Scanning it doesn't lead to the parking app or the menu; it leads to a spoofed payment or login page built to steal card numbers and passwords, or it silently triggers a malware download. The same trick shows up digitally, too: a QR code arrives by text or email, often attached to an urgent message about an "undelivered package," a "problem with your account," or "suspicious activity" that needs to be resolved immediately.

What makes QR codes especially effective for this is that they hide the destination until it's too late to easily back out. A typed or hyperlinked web address can be read before it's clicked, and most email and text filters scan visible links for known scam domains — but a QR code encodes that same address as an image, which slips past those filters and past the human eye doing its own quick check. By the time a phone's camera app shows the actual URL, the scanning motion is already done and the link is one tap away from opening.

The FTC has flagged this pattern specifically at physical payment points like parking meters, where a fraudulent sticker can sit for days generating a steady stream of victims who have no way of knowing the code isn't the real one. The urgency language used in text and email versions serves the same purpose it does in every other phishing scam: it's designed to get a code scanned before anyone stops to think about whether it makes sense.

Before scanning any QR code, check whether it looks like a sticker placed over another code, and treat any QR code that arrives unsolicited by text or email — especially one paired with urgent account or delivery language — with the same suspicion as an unsolicited link. Most phones show a preview of the destination URL before opening it; read that URL carefully for misspellings or an unfamiliar domain before tapping it, and contact the business or agency directly through an independently verified phone number instead of scanning your way to an answer.`,
  },
  {
    title: 'SIM Swap Fraud: How Scammers Hijack Your Phone Number to Get Around Two-Factor Authentication',
    slug: 'sim-swap-fraud-two-factor-bypass',
    author: 'ScamShield Editorial',
    tags: ['guide', 'sim-swap-scams'],
    sourceUrl: 'https://www.ic3.gov/PSA/2022/PSA220208',
    body: `A SIM swap starts with a criminal getting a mobile carrier to move a victim's phone number onto a SIM card the criminal controls — sometimes by impersonating the victim to a carrier's customer service line using personal details gathered elsewhere, sometimes by bribing or co-opting an employee with direct access to make the change, and sometimes through phishing or malware that captures carrier account credentials outright. Once the swap goes through, every call and text meant for the victim's number — including the victim's own service — instead reaches the criminal's device.

That control over the phone number is the entire point: banks, email providers, and crypto exchanges routinely use text-message codes as a second layer of login security, and a criminal holding the victim's number can trigger a "forgot password" request on those accounts and simply receive the one-time verification code meant to prove it's really the account owner. From there, passwords get reset and accounts get drained, often before the victim even realizes anything is wrong — the SIM swap can take effect in minutes, but bank or exchange balances can be emptied just as fast.

The FBI's Internet Crime Complaint Center has tracked a sharp rise in this specific fraud: from 2018 through 2020, IC3 logged 320 SIM swap complaints totaling about $12 million in losses, and in 2021 alone that jumped to 1,611 complaints and more than $68 million in losses — a scale increase that tracks with how much financial and crypto activity now depends on text-message verification codes.

The clearest warning sign is a sudden, unexplained loss of cell service — calls and texts stop going through with no obvious cause, which can mean a number has just been ported away. Treat any unsolicited call asking for a carrier account PIN or password as an attempted takeover and never provide it; verify by calling your carrier's official number directly instead. Where possible, replace SMS-based two-factor authentication with an authenticator app or a hardware security key, ask your carrier to add a PIN or passcode requirement on any SIM or account changes, and avoid publicizing crypto holdings or other high-value assets on social media, since that kind of information is exactly what makes a target worth this level of effort.`,
  },
  {
    title: 'Fake Rental Listing Scams: When the Apartment Isn\'t Really For Rent',
    slug: 'fake-rental-listing-scams-guide',
    author: 'ScamShield Editorial',
    tags: ['guide', 'rental-scams'],
    sourceUrl: 'https://consumer.ftc.gov/articles/rental-listing-scams',
    body: `Fake rental listings work one of two ways: a scammer either hijacks a real, currently listed property — copying its photos and description and swapping in their own contact information, often reposting it on a different site than the original — or invents an entirely fictional listing for a property that isn't actually for rent at all, dangling an unrealistically low price or upscale amenities to draw interest. Either way, the goal is the same: collect a deposit, application fee, or first month's rent, sometimes along with a Social Security number or driver's license copy for a fake "background check," before the renter ever realizes there's no real apartment behind the ad.

The FTC specifically names Facebook and Craigslist as common sources of these listings, and the pattern relies on renters not being able to verify the unit is real before money changes hands. The "landlord" is conveniently always unavailable to show the property in person — claiming to be traveling, working overseas, or on a religious mission — and pushes the renter to wire money, send a gift card code, or pay through a cash app to "hold" the unit sight unseen. Since 2020, consumers have reported nearly 65,000 rental scams to the FTC, totaling about $65 million in losses.

The clearest warning signs are a price noticeably below market rate for the area, refusal or inability to show the unit in person, pressure to decide and pay quickly, and a payment method that can't be reversed — wire transfer, gift cards, and cryptocurrency all fall into this category, and the FTC bluntly compares them to sending cash. A related tell is the same listing appearing more than once under different "owner" names, which usually means it was copied from somewhere else.

Before sending any money, insist on seeing the unit in person or via a live video walkthrough with someone who can show the actual keys and address, search the landlord's name alongside words like "scam" or "complaint," and check local property tax or county assessor records to confirm who actually owns the address. A legitimate landlord will provide a signed lease before asking for a deposit — never send money to "hold" a unit you haven't been able to verify is real.`,
  },
  {
    title: 'AI Voice Cloning Scams: When the Panicked Voice on the Phone Isn\'t Real',
    slug: 'ai-voice-cloning-family-emergency-scams-guide',
    author: 'ScamShield Editorial',
    tags: ['guide', 'ai-voice-cloning'],
    sourceUrl: 'https://consumer.ftc.gov/consumer-alerts/2023/03/scammers-use-ai-enhance-their-family-emergency-schemes',
    body: `A traditional "grandparent scam" relies on a human impersonator doing their best to sound like a panicked relative over a bad phone connection. The newer, more convincing version replaces the impersonator with AI voice-cloning software: as the FTC describes it, "all he needs is a short audio clip of your family member's voice — which he could get from content posted online — and a voice-cloning program" to generate a synthetic version of that person's actual voice, not just an approximation of it.

Just a few seconds of audio scraped from a social media video, voicemail greeting, or public post can be enough to produce a clone convincing enough to fool someone who knows the real voice well. The scammer then places a panicked call posing as that family member — claiming to have been in a car accident, arrested, or kidnapped — and pushes for an urgent wire transfer, cryptocurrency payment, or gift card codes before there's time to think it through, often insisting the call stay secret from other relatives who might slow things down by asking questions.

What makes this variant harder to catch than a typical impersonation scam is that the voice itself, the thing people instinctively trust most on a phone call, is no longer reliable evidence of who's actually speaking. Red flags still apply — urgency, a demand for secrecy, an unusual or hard-to-reverse payment method, and phrasing that feels slightly off from how the person actually talks — but they require a level of composure that's hard to summon in the middle of what sounds like a real family emergency.

The FTC's core advice is to never trust the voice alone: hang up and call the person back directly on a number already saved for them, or contact another family member independently to verify the story, before sending any money. Setting up a family codeword in advance — a word or phrase a genuine emergency caller would be expected to know or provide — gives everyone a fast, low-stress way to confirm a call is real before panic takes over.`,
  },
  {
    title: 'Sextortion: How the Threat Works and Why Paying Doesn\'t Make It Stop',
    slug: 'sextortion-financial-scam-guide',
    author: 'ScamShield Editorial',
    tags: ['guide', 'sextortion'],
    sourceUrl: 'https://www.ic3.gov/PSA/2023/psa230605',
    body: `Sextortion starts with a scammer, often posing as an attractive stranger on social media or a messaging app, building just enough rapport to coerce a victim into sharing a sexually explicit photo or video of themselves. The moment that image exists, the relationship flips: the scammer threatens to send it to the victim's family, friends, and entire contacts list unless a payment is made immediately, usually demanded through gift cards or cryptocurrency because both are difficult to trace or reverse. Some offenders skip the real-image step entirely, taking an ordinary photo and using editing tools to manufacture fake explicit content that looks convincing enough to threaten with anyway.

The scale of this specific, financially motivated variant has grown sharply: the National Center for Missing & Exploited Children logged more than 50,000 reports of financial sextortion in 2025 alone, roughly 137 a day, up 37% from the year before, and the FBI has separately reported a 20% rise in cases targeting minors. Reporting consistently points to teenage boys aged 14 to 17 as the most targeted group, with offenders frequently operating from organized networks overseas. The pressure these threats create has been linked to a number of teen suicides, which is part of why federal agencies treat this as more than a financial-fraud problem.

The single most important fact victims and parents need to hear is one the FBI states directly: complying with the demand does not guarantee the images won't be shared anyway. Paying once often just confirms the victim will pay again, and scammers frequently keep escalating demands rather than stopping. The psychological trap is designed around shame and urgency working together — the same features that make a victim reluctant to tell a parent or report it are exactly what let the extortion continue.

If this happens to you or someone you know, don't pay, don't delete the messages or images (they're evidence), and stop all further contact with the person immediately. Report it to the FBI's Internet Crime Complaint Center at ic3.gov or a local FBI field office, and for anyone under 18, to the National Center for Missing & Exploited Children's CyberTipline at report.cybertip.org or 1-800-THE-LOST — both take the threat seriously and can help get images removed from circulation, something no amount of paying the scammer will actually accomplish.`,
  },
  {
    title: 'Debt Relief and Credit Repair Scams: When "Help" Makes Things Worse',
    slug: 'debt-relief-credit-repair-scams-guide',
    author: 'ScamShield Editorial',
    tags: ['guide', 'debt-relief-scams'],
    sourceUrl: 'https://www.ftc.gov/news-events/news/press-releases/2025/07/ftc-halts-illegal-debt-relief-operation-falsely-impersonated-businesses-government-harming-consumers',
    body: `A debt relief or credit repair company promises to negotiate down a consumer's debt, settle it for pennies on the dollar, or quickly "fix" a bad credit score — all in exchange for a large fee paid upfront, before any actual results. In one FTC enforcement action, a company impersonating consumers' own banks, credit card issuers, and even the federal government charged a military veteran nearly $10,000 and told him to simply stop paying his credit cards, which promptly went into default; he ended up $13,000 deeper in debt with his credit score falling from the high 700s into the 500s, and it nearly cost him his security clearance. That single operation took in roughly $100 million, largely from seniors and veterans.

The upfront-fee model isn't just predatory, it's illegal for exactly this kind of service: the FTC's Telemarketing Sales Rule bars for-profit, telemarketed debt-relief companies from collecting any fee before they've actually settled, reduced, or otherwise changed the terms of a customer's debt. A legitimate company gets paid only after delivering a real result — a company demanding money before doing anything is already breaking the law, regardless of what else it promises.

Credit repair scams run on a related lie: no company, no matter what its ads claim, can legally remove accurate, up-to-date negative information from a credit report. If it's true and current, it stays, and any company promising to erase it anyway is either lying about what it can do or planning to use illegal tactics that can backfire on the consumer. Federal law also requires credit repair companies to give customers a signed contract with a three-day right to cancel before any work begins or any fee is charged.

The clearest warning signs are a demand for payment before any service is performed, instructions to stop paying or stop talking to your actual creditors, a guarantee that debts will be forgiven or negative marks erased, and unsolicited calls offering to fix a financial problem you didn't ask anyone to look into. Before paying anyone for debt or credit help, verify the company is properly registered, ask exactly what happens if they fail to deliver, and remember that no legitimate service can guarantee a creditor will agree to anything in advance.`,
  },
  {
    title: 'Medicare Scams: Why Your Medicare Number Is a Target Even Without Your Money',
    slug: 'medicare-health-insurance-scams-guide',
    author: 'ScamShield Editorial',
    tags: ['guide', 'medicare-scams'],
    sourceUrl: 'https://www.aarp.org/money/scams-fraud/most-common-medicare-scams/',
    body: `Someone claiming to be from Medicare calls offering a "new" or "upgraded" card, or shows up at a health fair with a "free" knee brace, glucose monitor, or genetic testing kit — in every version, the actual product or paperwork is beside the point. What the scammer is really after is the beneficiary's Medicare number itself, because that number alone is enough to bill Medicare directly for services, equipment, or tests that were never actually provided. As one Senior Medicare Patrol director described a genetic-testing scheme, the scammers "would just discard the swabs and use the Medicare number" — the swab was never going to a lab at all.

This is what makes Medicare fraud different from a typical scam: the victim doesn't have to hand over a dollar to be harmed. A stolen Medicare number can generate fraudulent charges against a real beneficiary's account, corrupt their medical records with equipment or diagnoses they never received, and even cause a legitimate future claim to be denied because the record already shows the benefit was "used." Other documented variants include unauthorized hospice enrollment through a complicit doctor, and fake telemedicine charges quietly added onto an otherwise real medical bill.

Medicare itself never calls, texts, or emails beneficiaries out of the blue to sell something or ask them to verify their number — any unsolicited contact along those lines is a Medicare number theft attempt, whether it's dressed up as a discount, a bonus, or a free product. The number deserves the same protection as a Social Security number or credit card: never share it with anyone who calls, and don't hand it over at a booth or door-to-door visit just because a product is offered for "free."

The best defense is simply reviewing the Medicare Summary Notice that arrives after any claim is processed, checking for services or equipment listed that were never actually received. Anything unfamiliar should be reported directly to 1-800-MEDICARE (1-800-633-4227) or the Senior Medicare Patrol at 1-877-808-2468 — both take these reports seriously and can help correct a record before a fraudulent charge affects future coverage.`,
  },
  {
    title: 'Foreclosure Rescue Scams: When "Help" Means Signing Away Your Home',
    slug: 'foreclosure-rescue-loan-modification-scams-guide',
    author: 'ScamShield Editorial',
    tags: ['guide', 'foreclosure-rescue-scams'],
    sourceUrl: 'https://consumer.ftc.gov/articles/mortgage-relief-scams',
    body: `A company or individual promises to negotiate directly with a homeowner's lender, secure a loan modification, or stop a foreclosure outright — and asks for a large fee upfront to get started. Under the FTC's Mortgage Assistance Relief Services Rule, that upfront fee is itself illegal: a company is legally barred from collecting payment for a loan modification before that modification has actually been delivered, which means demanding money before doing anything isn't just a red flag, it's already a violation of federal law.

The scheme often escalates from there. Scammers posing as housing counselors or attorneys tell homeowners to stop paying their real mortgage lender and to stop communicating with them directly, redirecting the homeowner's payments to the scammer instead — money that never actually reaches the lender and does nothing to stop the foreclosure clock running in the background.

The most damaging version of this scam involves the deed itself: a homeowner is talked into signing over ownership of their home, sometimes with the document buried among what they're told is routine loan-modification paperwork, under a promise that the scammer will "rent it back" to them until they can buy it back later. What victims often don't realize is that transferring the deed doesn't transfer the mortgage — the original homeowner remains legally responsible for the loan even after they've lost ownership of the house, while the scammer collects rent on a property they no longer have any real claim to and pockets it.

The clearest warning signs are any request for payment before work is done, instructions to stop paying or stop talking to your actual lender, guarantees that a modification is certain, pressure to sign documents quickly without reading them, and any request to sign over the deed under any pretext. Real help exists and it's free: HUD-approved housing counselors, found through HUD's own counselor directory, and resources like makinghomeaffordable.gov can provide legitimate loan modification assistance without charging a cent upfront. Report a suspected scam to ReportFraud.ftc.gov, the CFPB, or your state attorney general's office.`,
  },
  {
    title: 'Identity Theft Basics: How It Happens and How to Recover',
    slug: 'identity-theft-basics-guide',
    author: 'ScamShield Editorial',
    tags: ['guide', 'identity-theft'],
    sourceUrl: 'https://consumer.ftc.gov/articles/what-know-about-identity-theft',
    body: `Identity theft happens when someone uses personal information — a name, Social Security number, date of birth, address, or account numbers — without permission. That single piece of stolen information can be used in two fundamentally different ways, and understanding the difference matters for spotting each one: existing-account fraud, where a thief uses a card or bank account someone already has, showing up as unauthorized charges or withdrawals on statements a victim already checks; and new-account fraud, where a thief opens something entirely new in the victim's name — a credit card, a utility or phone account, or even a job — using stolen information the victim never sees on any bill they're already reviewing.

Beyond financial accounts, stolen identity information gets used in ways that don't show up on a bank statement at all: filing a fraudulent tax return to claim someone else's refund before they file their own, obtaining medical care or prescriptions under someone else's name and insurance, or even giving a false identity to police during an arrest. These variants are often the hardest to catch early, since nothing about them triggers a typical bank fraud alert.

The clearest warning signs are things that don't happen rather than things that do: mail or bills that stop arriving as expected, which can mean a thief has filed a change of address; unfamiliar accounts appearing on a credit report; or a tax return getting rejected because one has apparently already been filed. Simple, ongoing habits make the biggest difference in prevention — taking mail out of the mailbox promptly, securing documents that contain personal information, and using strong, unique passwords with two-factor authentication wherever it's offered.

The most effective single protection is a credit freeze, which is free to place and lift with each of the three credit bureaus and blocks new accounts from being opened in someone's name without their explicit unlocking of the freeze first. Everyone is also entitled to free credit reports to check regularly for unfamiliar activity. If identity theft does happen, IdentityTheft.gov — the FTC's dedicated recovery site — generates a personalized, step-by-step recovery plan covering more than 30 different types of identity theft, from a stolen credit card to a fraudulent tax return.`,
  },
  {
    title: 'Home Improvement Contractor Scams: Why "Pay Me First" Should End the Conversation',
    slug: 'home-improvement-contractor-scams-guide',
    author: 'ScamShield Editorial',
    tags: ['guide', 'contractor-scams'],
    sourceUrl: 'https://consumer.ftc.gov/articles/how-avoid-home-improvement-scam',
    body: `A contractor shows up unannounced, often claiming to be "already in the neighborhood" working on another job, and offers a deal on repair or renovation work — a new roof, driveway resurfacing, storm damage repair — that sounds too convenient to pass up. The pitch comes with pressure to decide immediately, and a demand for full payment, or a large deposit, in cash before any work begins. Once that money changes hands, the contractor either does the work badly, walks off the job partway through, or simply never shows up again.

A related version of this scam involves financing rather than cash: the contractor arranges a loan, often a home-equity loan, on the homeowner's behalf, without making sure the homeowner actually understands the interest rate or repayment terms — leaving them saddled with expensive debt long after the renovation itself may have gone unfinished or been done poorly. Unlicensed or uninsured contractors are especially common in this pattern, since a legitimate, licensed business doesn't need to rely on door-to-door pressure tactics to find customers.

The clearest warning signs are unsolicited door-knocking, pressure to sign or decide on the spot, a demand for full or cash-only payment before work starts, no proof of licensing or insurance, and pressure to pull the required building permits yourself rather than having the contractor handle it as part of the job. Federal law also gives homeowners a specific protection for contracts signed at home: a three-business-day right to cancel, sometimes called the "cooling-off rule," which the contract itself is required to state.

Before hiring anyone, get multiple written estimates, verify the contractor's license with the relevant state or county office, and check their complaint history with a local home builders association or consumer protection office. Insist on a written contract that spells out the contractor's credentials, the project timeline, the scope of work, and the materials to be used, check your state's legal limit on how much can be required as a deposit, and hold back final payment until the work is actually finished and inspected — not before.`,
  },
  {
    title: 'Auto Warranty Robocalls: The Endless Call About Your "Expiring" Coverage',
    slug: 'auto-warranty-robocall-scams-guide',
    author: 'ScamShield Editorial',
    tags: ['guide', 'auto-warranty'],
    sourceUrl: 'https://consumer.ftc.gov/consumer-alerts/2021/05/hang-auto-warranty-robocalls',
    body: `The call starts with a recording, not a person: an automated voice claiming to represent a "Vehicle Service Department" warns that your car's warranty is about to expire, that the company has "sent you several notices in the mail," and that your file will be closed soon if you don't respond. Pressing a number to "renew" connects you to a live agent selling what's actually a third-party service contract, not a real manufacturer warranty, often for hundreds or thousands of dollars, riddled with exclusions and restrictions that leave real repairs uncovered anyway.

These calls are illegal on their face — legitimate businesses aren't allowed to robocall consumers who haven't given prior consent — which is exactly why they rely entirely on automated dialing at massive scale rather than any real relationship with the people they're calling. At their peak in 2022, the FCC logged roughly a billion auto warranty robocalls in a single month; a coordinated crackdown by the FCC and FTC against several of the operators behind the flood drove that number down sharply, though the pattern has never fully disappeared and remains one of the most common robocall categories reported.

The warning signs are consistent: an unsolicited recorded call about your vehicle's warranty, a claim that you've already been notified by mail, pressure to respond immediately or lose "coverage," a request to pay by credit card over the phone, and a caller ID that shows a local area code despite having no real connection to your area — a spoofing tactic meant to make the call look like it's from someone you might know. None of this resembles how an actual manufacturer or dealer would contact you about a warranty, which is typically by mail, not a recorded phone pitch.

The FTC's advice is blunt: hang up. Don't press any number, since doing so can confirm to the dialer that your number is active and lead to even more calls. Use your phone carrier's or device's built-in call-blocking tools, and report the call at DoNotCall.gov, which creates an official record regulators use to build cases against the companies and networks running these campaigns.`,
  },
  {
    title: 'Lottery and Sweepstakes Scams: You Can\'t Win a Contest You Never Entered',
    slug: 'lottery-sweepstakes-scams-guide',
    author: 'ScamShield Editorial',
    tags: ['guide', 'lottery-sweepstakes'],
    sourceUrl: 'https://consumer.ftc.gov/articles/fake-prize-sweepstakes-and-lottery-scams',
    body: `A call, text, email, or letter announces that you've won a prize — a new car, an iPad, a cash jackpot, sometimes a specific lottery like Publishers Clearing House or a foreign national lottery. To collect it, you're told, you first need to pay something: "taxes," "insurance," "shipping and handling," or "customs duties" on a prize you supposedly already won. Some versions have a scammer falsely claiming to call from the Federal Trade Commission itself, telling the victim that paying a one-time fee for "taxes and insurance" is all that stands between them and the winnings.

The mechanism only works because it inverts how real prizes function: legitimate sweepstakes and lotteries never require a winner to pay money to receive what they've won, and it's illegal for a company to make you pay to increase your odds of winning something. If a "prize" comes with any request for payment or your bank account, credit card, or Social Security number, that single detail is enough to identify it as fake — genuine prize administrators don't need banking details to mail someone a check or a new car. A related giveaway: if you never entered the sweepstakes or bought a lottery ticket in the first place, there's no legitimate way you could have won it.

Once a victim pays, the scam rarely ends there. Instead of receiving a prize, they get more calls demanding additional fees, each with a fresh promise that the money is finally on its way — sometimes accompanied by a fake check the victim is told to deposit and then wire part of the funds back, a check that later bounces and leaves the victim liable for the full amount. Scammers frequently impersonate a real, recognizable name — a well-known sweepstakes company, a government agency, even the FTC itself — specifically to borrow that name's credibility and make the fake prize feel more believable.

If you're contacted about a prize you don't remember entering to win, don't send money, gift cards, cryptocurrency, or account information under any circumstance, and don't deposit an unexpected check tied to a "prize." Report it to the FTC at ReportFraud.ftc.gov, where the same advisory that describes this scam pattern also emphasizes the one rule that cuts through every variation: real prizes are free.`,
  },
  {
    title: 'Utility Scams: The "Pay Now or We Shut You Off Today" Call',
    slug: 'utility-scams-disconnection-threat-guide',
    author: 'ScamShield Editorial',
    tags: ['guide', 'utility-scams'],
    sourceUrl: 'https://consumer.ftc.gov/articles/scammers-pretend-be-your-utility-company',
    body: `A caller identifies themselves as being from your electric, gas, or water company and warns that your service will be shut off within the hour unless you pay an overdue balance immediately. The call, text, or even an in-person visit is timed to create panic — hot summer days and cold winter nights are popular windows, since the threat of losing power or heat pushes people to act before they've had time to think it through or call the utility back to check.

The giveaway is almost always the payment method. Scammers demand payment through a wire transfer, a payment app, cryptocurrency, or by putting money on a gift card and reading them the numbers off the back — all methods that are effectively impossible to reverse once sent, and none of which a real utility company accepts for a bill. Legitimate utilities also don't demand same-day payment to avoid immediate disconnection over the phone; real shutoff processes involve advance written notice and a defined process, not a same-call ultimatum.

Some versions of this scam work the opposite angle, telling a customer they've overpaid and are due a refund, then asking for bank account details to "process" it — a pretext for harvesting account access rather than extorting an immediate payment. Both versions rely on the same core trick: convincing someone the call is really from their utility company, often by spoofing caller ID to display the utility's real name or number.

If you get a call like this, hang up and contact your utility directly using the number on a past bill or the utility's official website — never a number or link given to you in the suspicious call or text itself. Real utility companies will not threaten same-day disconnection over the phone or demand payment by gift card, cryptocurrency, or wire transfer. If you've already paid, report it to the FTC at ReportFraud.ftc.gov and to your actual utility company, which can confirm whether your account is even past due.`,
  },
  {
    title: 'Card Skimming: The Hidden Device Stealing Your Card Number at the Pump',
    slug: 'card-skimming-atm-gas-pump-guide',
    author: 'ScamShield Editorial',
    tags: ['guide', 'card-skimming'],
    sourceUrl: 'https://consumer.ftc.gov/consumer-alerts/2018/08/watch-out-card-skimming-gas-pump',
    body: `A skimmer is a small illegal card reader that criminals secretly attach inside or over a legitimate card slot at a gas pump, ATM, or point-of-sale terminal, capturing your card's magnetic stripe data the moment you swipe or insert it. A hidden pinhole camera or a fake keypad overlay often captures your PIN at the same time, giving thieves everything needed to clone your card or drain an account without ever touching your physical wallet.

What makes skimming especially effective is that the transaction still goes through normally — you get your gas, your cash, or your purchase, with nothing visibly wrong, so there's no immediate sign anything happened. The stolen data is typically collected in bulk from a compromised pump or ATM over days or weeks before the skimmer is removed, and victims often don't discover the theft until unfamiliar charges show up on a statement, sometimes far from where the card was actually used.

Fraud tied specifically to gas pump skimming alone is estimated to cost more than $1 billion a year in the US. Outdoor, unattended payment terminals — gas pumps in particular — are common targets because they're rarely inspected during the day and their internal panels can often be opened with a generic key or simple tools, letting a skimmer be installed inside the housing where it's invisible to a customer glancing at the pump.

Before swiping or inserting a card at a pump or ATM, check whether the card reader wiggles, looks discolored, or sits at a slightly different angle than the panel around it — a loose or ill-fitting reader is the clearest sign of tampering, and the FTC specifically recommends trying to wiggle it before using it. Covering the keypad while entering a PIN blocks a hidden camera from capturing it, and paying inside at the register or using a tap-to-pay/mobile wallet avoids the card reader entirely. Check bank and card statements regularly, and report any unauthorized charges to your card issuer immediately — most card networks limit your liability for fraudulent charges reported promptly.`,
  },
  {
    title: 'Affinity Fraud: When the Investment Pitch Comes From Someone in Your Own Community',
    slug: 'affinity-fraud-investment-scam-guide',
    author: 'ScamShield Editorial',
    tags: ['guide', 'affinity-fraud'],
    sourceUrl: 'https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-alerts/investor-60',
    body: `Affinity fraud is an investment scam that exploits trust within an identifiable group — a religious congregation, an ethnic or immigrant community, a professional association, even an online forum built around a shared interest. The "investment" itself is usually either entirely fake or grossly misrepresented, with fraudsters lying about the risk of loss, the track record, or their own background, and many affinity frauds turn out to be Ponzi or pyramid schemes, where money from new investors is quietly used to pay off earlier ones just long enough to create the appearance of a real, working investment.

What makes affinity fraud so effective isn't a more sophisticated pitch — it's the shortcut around normal skepticism that shared identity provides. Fraudsters frequently recruit a respected leader within the community to promote the investment, someone whose own trusted reputation vouches for it without the promoter necessarily even realizing they're being used; that leader may become a victim too, alongside everyone they convinced. The SEC has documented real cases targeting Dominican and Brazilian immigrant communities with promises of returns over 200%, Asian and Latino communities in a scheme that raised $65 million promising to more than double investors' money in 100 days, African-American churchgoers offered 12-20% annual interest, and a group of 80 evangelical Christian investors who lost a combined $6 million.

The tight-knit nature of the very communities these schemes target also makes them harder to catch: victims often try to resolve suspicions quietly within the group rather than reporting to regulators, reluctant to publicly accuse a fellow member or a respected leader of fraud — which lets the scheme keep running long after problems first surface. Common warning signs include promises of spectacular or guaranteed returns with "no risk," pressure to invest quickly in a "once-in-a-lifetime" opportunity, reluctance to put anything in writing, and a pitch built on "inside" or confidential information that supposedly only this trusted circle has access to.

Being part of a close community is not, by itself, a reason to skip the same due diligence you'd apply to any other investment — verify a promoter's registration and background independently through the SEC's or your state securities regulator's own records, insist on getting terms in writing, and treat pressure to keep an opportunity "just between us" as a red flag rather than a compliment. If you believe you've encountered affinity fraud, report it to the SEC at investor.gov or the FTC at ReportFraud.ftc.gov — shared identity with the person pitching you is exactly what a legitimate investment never actually depends on.`,
  },
  {
    title: 'Money Mule Scams: How a Job Offer or Online Relationship Turns You Into a Criminal\'s Bank Account',
    slug: 'money-mule-scam-guide',
    author: 'ScamShield Editorial',
    tags: ['guide', 'money-mule'],
    sourceUrl: 'https://consumer.ftc.gov/consumer-alerts/2021/12/avoiding-money-mule-scam',
    body: `A money mule is someone who moves illegally obtained money on behalf of someone else — often without ever realizing the money was stolen in the first place. Scammers recruit money mules through online dating sites, job boards, and social media, inventing a reason to send the victim money, usually by check or cryptocurrency, before instructing them to forward that money somewhere else. Two recruitment channels show up constantly: a romantic interest met online who "needs help" moving funds, and a work-from-home job listing that involves "processing payments" or transferring money to "clients" as part of the role.

The mechanism works precisely because it doesn't feel like a scam from the mule's side — no one is asking the victim to hand over their own money, only to help move funds that appear to be part of a legitimate relationship or job. A scammer might deposit a check into the victim's account and ask them to wire part of it elsewhere, or send cryptocurrency for the victim to convert and forward, or ask them to receive packages and reship them. Because the money genuinely moves through the victim's own real bank account or address, it can take weeks for the stolen origin of those funds to surface.

The consequences land squarely on the money mule, not just the original victims the money was stolen from. If a deposited check initially clears and then bounces once the fraud is discovered, the bank will require the mule to repay the full amount, sometimes with fees on top of a frozen or closed account. The FTC states plainly that "if you help a scammer move stolen money — even if you didn't know it was stolen — you could get into legal trouble," since knowingly or unknowingly, participating in moving stolen funds can expose someone to real legal liability.

Treat any request to receive money and then forward it elsewhere as a hard stop, regardless of how the person asking is framed — a romantic partner, a new employer, or a prize or grant administrator. A legitimate job will never require depositing checks into your personal account to relay funds to "vendors" or "clients," and a genuine romantic interest never needs your bank account to move their own money. If you're contacted about an opportunity like this, don't forward any funds, and report it to the FBI's Internet Crime Complaint Center at ic3.gov and the FTC at ReportFraud.ftc.gov.`,
  },
  {
    title: 'Peer-to-Peer Payment App Scams: Why Zelle, Venmo, and Cash App Money Rarely Comes Back',
    slug: 'peer-to-peer-payment-app-scams-guide',
    author: 'ScamShield Editorial',
    tags: ['guide', 'p2p-payment-apps'],
    sourceUrl: 'https://consumer.ftc.gov/consumer-alerts/2020/02/making-mobile-payments-protect-yourself-scams',
    body: `Peer-to-peer payment apps like Zelle, Venmo, and Cash App were built for speed — sending money to a friend takes seconds, and that same instant, irreversible design is exactly what makes them a favorite tool for scammers. Fraudsters exploit these apps in a few consistent ways: impersonating someone the victim knows and claiming an emergency requires an immediate transfer, posing as the app company or the victim's own bank to "verify" an account, or — if they've gained access to a victim's contact list — messaging their contacts while posing as someone requesting a payment that was supposedly already agreed to.

What makes these scams so damaging is baked into how the apps work: transactions are designed to move instantly between individuals, not to be reversed the way a disputed credit card charge can be. The FTC puts the core risk plainly: "Be sure you know who's on the receiving end. Otherwise, you might lose the money you sent — and then some." Once money leaves an account through one of these apps, getting it back generally depends on the recipient voluntarily sending it back or a bank agreeing to investigate — there's no built-in guarantee the way there is with other forms of electronic payment.

The scale of the problem is significant enough that regulators have taken direct action: the Consumer Financial Protection Bureau has pursued the banks behind Zelle over allegations that customers lost hundreds of millions of dollars to scams on the platform over several years. Scammers have also exploited that same regulatory attention by running a scam about the scam — fake social media posts and videos falsely claiming the government is handing out payouts to people who lost money on Zelle or Cash App, a claim consumer protection groups have confirmed is not true and is itself just another way to harvest personal information.

Before sending money to anyone through one of these apps, verify who you're actually paying using a phone number or contact method you already know is real — never one provided in the same message asking for money. Consider turning off access to your contacts within the app if you're uncomfortable with how it's used, read your bank and app statements regularly for anything unfamiliar, and if something goes wrong, contact both the app company and your bank right away to ask about reversing an unauthorized transaction. Report scams to the FTC at ReportFraud.ftc.gov, and treat any claim that a government agency is issuing refunds for P2P app losses as false unless it comes directly from that agency's own official website.`,
  },
  {
    title: 'Fake Debt Collectors: When "Pay Now or Else" Isn\'t a Real Debt at All',
    slug: 'fake-debt-collector-scam-guide',
    author: 'ScamShield Editorial',
    tags: ['guide', 'fake-debt-collector'],
    sourceUrl: 'https://consumer.ftc.gov/articles/fake-abusive-debt-collectors',
    body: `A caller claims to be a debt collector and says you owe money — sometimes for a real debt you already paid off, sometimes for one that was never actually yours, and sometimes for a debt that never existed at all. The FTC has taken action against so-called "phantom debt collectors" who bought lists of consumer information with no real underlying debt attached and simply called demanding payment anyway, betting that enough people would pay out of fear rather than question whether the debt was real.

These calls work by combining unfamiliarity with intimidation: the debt is often one the target genuinely doesn't recognize, paired with threats of arrest, a lawsuit, wage garnishment, or having an employer contacted, all designed to create enough panic that the person pays immediately over the phone with a credit or debit card rather than taking time to verify anything. Real debt collectors are legally required to identify themselves and provide contact information; the FTC notes that fake collectors typically "refuse to give you their mailing address or phone number" and pressure for payment on a debt "you don't recognize" — both of which are red flags on their own, regardless of what's being claimed.

Federal law gives every consumer a real, enforceable right that fake collectors are counting on people not knowing about: debt validation. A legitimate collector must provide written information identifying the original creditor, the amount owed, and an explicit right to dispute the debt within 30 days — and once that dispute is sent in writing, the collector is legally required to stop all collection efforts until it provides real, written verification, like a copy of the original bill. Abusive collection tactics are illegal outright regardless of whether the debt is real: threats of violence, obscene language, and more than seven collection calls within a seven-day period are all specifically prohibited under federal debt collection law.

If you're contacted about a debt, don't pay or provide financial information on the spot no matter how urgent the caller makes it sound — ask for the collector's name, company, and mailing address, and request written validation of the debt before doing anything else. If they refuse to provide that information or keep pressuring for immediate payment, that alone is a strong sign the "debt" isn't legitimate. Report fake or abusive debt collectors to your state attorney general's office, the FTC at ReportFraud.ftc.gov, and the Consumer Financial Protection Bureau.`,
  },
  {
    title: 'Real Estate Closing Wire Fraud: Why You Should Never Trust Wiring Instructions in an Email',
    slug: 'real-estate-closing-wire-fraud-guide',
    author: 'ScamShield Editorial',
    tags: ['guide', 'real-estate-wire-fraud'],
    sourceUrl: 'https://www.consumerfinance.gov/archive/blog/mortgage-closing-scams-how-protect-yourself-and-your-closing-funds/',
    body: `In the days before a home purchase closes, a buyer receives what looks like a routine email from their real estate agent, settlement agent, or title company, with final wiring instructions for the down payment and closing costs — except the email account sending it has been hijacked or spoofed, and the account number in those instructions belongs to the scammer, not the title company. Once the buyer wires the money, it's typically gone within minutes, moved through a chain of accounts before the fraud is even discovered.

The scam works because real estate transactions involve a predictable moment when a large sum of money is expected to move by wire, and because so much of the process now happens by email between parties who've often never met in person — an agent, a lender, a title company, a closing attorney — giving a scammer who's compromised just one of those inboxes everything needed to insert a convincing, well-timed forgery. Closing wire fraud reports to the CFPB surged roughly 1,100% between 2015 and 2017, with nearly $1 billion lost to real estate wire fraud in 2017 alone, and the pattern hasn't gone away since — the same email-based deception now increasingly shows up paired with a spoofed or AI-cloned phone call to make a fraudulent "instruction change" sound even more convincing.

The core warning sign is any change to wiring instructions delivered by email, especially one framed as urgent or last-minute — a legitimate title company will never ask a buyer to send money to a "new" or "updated" account through an unsolicited email. Other red flags include a sender's email address that's almost, but not quite, correct (a single swapped letter or a different domain), pressure to act immediately to avoid missing the closing, and a request to keep the payment change confidential from other parties in the transaction.

The CFPB's core advice is to establish two trusted contacts — typically the real estate agent and the title/settlement company — before closing, and agree in person or by phone on how payment instructions will be confirmed, since a phone call to a number you already had, not one included in a suspicious email, is the only reliable way to verify a wire request. If you've already sent money and suspect fraud, contact your bank immediately to attempt a wire recall, and report it to the FBI's Internet Crime Complaint Center at IC3.gov — the first hours after a fraudulent wire are the best chance of stopping or reversing it before the money moves further.`,
  },
  {
    title: 'Home Title Theft (Deed Fraud): How Scammers Steal Ownership of a Home You Already Own',
    slug: 'home-title-theft-deed-fraud-guide',
    author: 'ScamShield Editorial',
    tags: ['guide', 'home-title-theft'],
    sourceUrl: 'https://consumer.ftc.gov/consumer-alerts/2024/08/home-title-lock-insurance-not-lock-all',
    body: `Home title theft, also called deed fraud, is a form of identity theft where a criminal forges a homeowner's signature on a deed — often a quitclaim deed, chosen specifically because it requires no title warranty and draws less scrutiny when filed — and records it with the county, making it look, on paper, like the real owner willingly transferred the property away. From there, the scammer can sell the home to an unsuspecting buyer, borrow against it as collateral, or rent it out, while the actual owner may have no idea anything happened until a tax bill, a for-sale sign, or a stranger at the door tips them off.

The scheme specifically targets properties least likely to be watched closely: homes owned outright with no mortgage, vacant land, rental properties, and homes belonging to elderly or recently deceased owners, since a paid-off, unmonitored property gives a scammer far more room to operate before anyone notices. Public property records make this research easy — a scammer can look up who owns a given parcel, whether it has a mortgage, and the owner's name, all without ever contacting the real owner, then use identity information gathered elsewhere to impersonate them at the filing stage.

A cottage industry of paid "title lock" or "title monitoring" services has grown up marketing themselves as protection against this exact scam, but the FTC has specifically warned that these services only alert you after a fraudulent deed has already been filed — they don't prevent the transfer from happening in the first place, and several of the free alternatives below do the same monitoring job for free. The real warning signs of an in-progress or completed theft include an unexpected notice about a change to your property tax bill or mailing address, mail from your mortgage lender suddenly stopping, or a letter, notice, or visitor referencing a sale or loan on your property that you never initiated.

Every state's land records or county recorder's office lets you check your own deed for free, and many now offer a free property-fraud alert program that emails you automatically if a new document is recorded against your parcel — a more reliable, no-cost alternative to a paid "lock" service. If you discover a fraudulent deed, start a recovery plan at IdentityTheft.gov, contact your county recorder's office about the process for disputing a forged filing, and consider consulting a real estate attorney, since undoing a fraudulently recorded deed typically requires a court order even after the fraud is proven.`,
  },
  {
    title: 'Fake Check Scams: Why a Cleared Deposit Doesn\'t Mean the Money Is Real',
    slug: 'fake-check-overpayment-scam-guide',
    author: 'ScamShield Editorial',
    tags: ['guide', 'fake-check-scams'],
    sourceUrl: 'https://consumer.ftc.gov/articles/how-spot-avoid-and-report-fake-check-scams',
    body: `A stranger sends a check for more than what's actually owed — for a job, a sold item, a "mystery shopper" assignment, or a sweepstakes prize — and asks the recipient to deposit it, then wire back or send via gift card the difference, framed as a refund, a fee, or funds meant for a third party. The check is fake, but by the time that becomes clear, the victim has already sent their own real money to the scammer.

The scam works because of a gap most people don't realize exists between a check "clearing" and a check actually being confirmed as real. Banks are legally required to make deposited funds available quickly, often within a day or two, but verifying a check's authenticity with the issuing bank can take weeks — meaning the money can show up as available in an account long before anyone has actually confirmed the check is good. Once the fraud is eventually discovered, the bank reverses the deposit and holds the account holder responsible for the full amount, including whatever they already sent to the scammer, even though the balance looked completely real in the meantime.

This mechanism shows up across a wide range of unrelated scam pitches — fake job offers involving a "start-up expense" check, online sales where a buyer "overpays" and asks for the difference back, romance scams asking a partner to deposit and forward funds, and prize notifications requiring a portion sent back for "taxes" — because the check itself is just the delivery vehicle; the real objective is always getting the victim to send real money out before the fake check bounces.

The clearest rule, straight from the FTC: never send money based on funds from a check you didn't expect, no matter how legitimate the deposit looks in an account balance, and be especially wary of any check for more than the amount you're actually owed. If a check arrives unexpectedly, verify it directly with the issuing bank using a phone number looked up independently, not one printed on the check itself, before depositing or spending against it. If you've already sent money in response to a check that turned out to be fake, report it to the FTC at ReportFraud.ftc.gov and to your bank as soon as possible.`,
  },
  {
    title: 'Synthetic Identity Theft: When Fraud Builds a Person Who Never Existed',
    slug: 'synthetic-identity-theft-guide',
    author: 'ScamShield Editorial',
    tags: ['guide', 'synthetic-identity-theft'],
    sourceUrl: 'https://www.federalreserve.gov/newsevents/pressreleases/other20190709a.htm',
    body: `Ordinary identity theft steals a real person's existing financial identity — their name, their accounts, their credit history — and uses it directly. Synthetic identity theft is different and, in some ways, harder to catch: fraudsters combine a real piece of personal information, most often a Social Security number, with fabricated details like a made-up name, address, or date of birth, stitching together a "person" who doesn't actually exist anywhere but on paper and in a credit file.

Social Security numbers belonging to children, people who have died, or people who simply don't use credit are especially valuable for this, since there's no existing credit history to contradict the fabricated identity or notice something's wrong. Once a synthetic identity has a Social Security number attached to a credit application, it can begin building a real credit file of its own — often starting small, with a secured card or a co-signed account, and patiently making on-time payments over months or years to establish what looks like a legitimate, creditworthy borrower.

That patience is the setup for what the industry calls a "bust out": once the synthetic identity has built up enough credit limits across multiple accounts, the fraudster maxes them all out in a short period and disappears, leaving lenders holding debt tied to a borrower who was never a real, traceable person to begin with. Because no actual individual's existing accounts were compromised in the usual sense, synthetic identity fraud is notoriously difficult to detect with the credit-monitoring tools built for ordinary identity theft — the real victim, if the underlying Social Security number belonged to a living person, may not find out anything happened until they're denied a loan, disability benefits, or have a tax return rejected because "their" number already shows unrelated activity attached to it.

If you're notified of unexplained activity tied to your Social Security number — a credit inquiry you didn't make, a rejected tax return citing a duplicate filing, or a denied benefits application — treat it as a possible sign of synthetic identity fraud rather than assuming it's a simple error, and start a recovery plan at IdentityTheft.gov. Parents can specifically check whether a child's Social Security number has ever been used for credit by requesting a manual credit file search from the three credit bureaus, since children have no legitimate reason to have any credit history at all before adulthood, and any file is itself a red flag.`,
  },
];

async function seedArticles(articles: SeedArticle[], label: string) {
  for (const article of articles) {
    await pool.query(
      `INSERT INTO articles (title, slug, body, author, tags, source_url, cover_image, cover_image_credit, cover_image_position, published, published_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, true, NOW())
       ON CONFLICT (slug) DO UPDATE SET
         source_url = COALESCE(articles.source_url, EXCLUDED.source_url),
         cover_image = COALESCE(articles.cover_image, EXCLUDED.cover_image),
         cover_image_credit = COALESCE(articles.cover_image_credit, EXCLUDED.cover_image_credit),
         cover_image_position = COALESCE(articles.cover_image_position, EXCLUDED.cover_image_position)`,
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

interface SeedCategory {
  name: string;
  slug: string;
  description: string;
}

// The taxonomy the FTC's Consumer Sentinel and the FBI's IC3 use to group
// scam reports — not an exhaustive list, but the categories that cover the
// large majority of what gets reported.
const SEED_CATEGORIES: SeedCategory[] = [
  { name: 'Phishing', slug: 'phishing', description: 'Fake emails, texts, or calls designed to steal login credentials or personal information.' },
  { name: 'Romance Scams', slug: 'romance-scams', description: 'Fake online relationships built to manipulate a victim into sending money.' },
  { name: 'Tech Support Scams', slug: 'tech-support-scams', description: 'Fake virus warnings and impersonated tech support used to gain remote access or payment.' },
  { name: 'Government Impersonation', slug: 'government-impersonation', description: 'Callers posing as the IRS, Social Security Administration, or police to demand urgent payment.' },
  { name: 'Business Email Compromise', slug: 'business-email-compromise', description: 'Compromised or spoofed business email used to redirect wire transfers and payments.' },
  { name: 'Investment Fraud', slug: 'investment-fraud', description: 'Fake trading platforms and investment clubs promising outsized, guaranteed returns.' },
  { name: 'Package Delivery Scams', slug: 'package-delivery-scams', description: 'Fake shipping-carrier texts and emails about a delivery problem or fee.' },
  { name: 'Employment Scams', slug: 'employment-scams', description: 'Fake job offers used to extract fees, personal data, or fraudulent check deposits.' },
  { name: 'Charity Scams', slug: 'charity-scams', description: 'Fake or impersonated charities soliciting donations, often after a widely covered disaster.' },
  { name: 'Identity Theft', slug: 'identity-theft', description: 'Schemes designed to harvest and misuse personal or financial information.' },
  { name: 'Online Shopping Scams', slug: 'online-shopping-scams', description: 'Fake storefronts and marketplace listings that take payment without delivering real goods.' },
  { name: 'Lottery & Sweepstakes Scams', slug: 'lottery-sweepstakes-scams', description: 'Fake prize notifications that require a fee or personal information to "release" winnings.' },
  { name: 'Sextortion', slug: 'sextortion', description: 'Threats to release real or fabricated explicit images or video unless a payment is made.' },
  { name: 'Account Takeover', slug: 'account-takeover', description: 'Schemes that hijack an existing online account — email, banking, social media, or shopping — usually through stolen credentials.' },
  { name: 'Insurance Fraud', slug: 'insurance-fraud', description: 'Fake insurance policies, staged claims, and impersonated adjusters or insurers targeting policyholders.' },
  { name: 'Healthcare Fraud', slug: 'healthcare-fraud', description: 'Fake medical products, billing scams, and impersonated healthcare providers or insurers.' },
  { name: 'AI & Deepfake Scams', slug: 'ai-deepfake-scams', description: 'Scams using AI-generated voice, video, or images to impersonate a real person or fabricate evidence.' },
  { name: 'Debt Relief Scams', slug: 'debt-relief-scams', description: 'Fake debt consolidation, settlement, or credit-repair services that collect fees without delivering relief.' },
  { name: 'Timeshare Scams', slug: 'timeshare-scams', description: 'Fraudulent resale, exit, and loan-forgiveness offers targeting timeshare owners for an upfront fee that delivers nothing.' },
  { name: 'Mortgage & Foreclosure Scams', slug: 'mortgage-foreclosure-scams', description: 'Fraudulent loan modification, foreclosure rescue, or title schemes targeting homeowners.' },
  { name: 'Tax Scams', slug: 'tax-scams', description: 'Fake IRS or tax-authority communications and fraudulent tax-preparation schemes.' },
  { name: 'Utility Scams', slug: 'utility-scams', description: 'Fake electric, gas, water, or internet provider threats demanding immediate payment to avoid disconnection.' },
  { name: 'Public Benefits Fraud', slug: 'public-benefits-fraud', description: 'Skimming, phishing, and impersonation schemes targeting SNAP/EBT, unemployment, Social Security, and other public benefit accounts.' },
  { name: 'Family Emergency Scams', slug: 'family-emergency-scams', description: 'Urgent, fabricated crises used to pressure a family member into sending money immediately, without time to verify the story.' },
];

interface SeedScam {
  name: string;
  slug: string;
  description: string;
  categorySlug: string;
  // Historical entries have no current threat level, so this is optional
  // rather than forcing an inapplicable low/medium/high/critical label.
  alertLevel?: 'low' | 'medium' | 'high' | 'critical';
  sources: string[];
  // A real, verified link to the citing agency's page (their scam-alert
  // landing page, or general homepage as a fallback) — used as the "Read
  // more" link on the scam detail page. Only ever a verified real URL,
  // never a guess; left unset when no confirmed link exists yet.
  sourceUrl?: string;
  country?: string;
  isHistorical?: boolean;
  // ISO date (YYYY-MM-DD) of the earliest well-documented instance —
  // only set on isHistorical entries, where a specific real date exists.
  firstRecorded?: string;
}

const SEED_SCAMS: SeedScam[] = [
  {
    name: 'Fake Netflix Billing Email',
    slug: 'netflix-billing-phishing-email',
    description:
      'An email formatted to look like a real Netflix billing notice claims your payment failed and your account will be suspended, linking to a fake login page that harvests your email, password, and card details. Netflix does not ask you to confirm payment information by clicking a link in an email — check or update billing only inside the app or by typing netflix.com directly into your browser.',
    categorySlug: 'phishing',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice'],
    sourceUrl: 'https://consumer.ftc.gov/articles/how-recognize-avoid-phishing-scams',
  },
  {
    name: 'Fake DocuSign Signature Request',
    slug: 'docusign-phishing-email',
    description:
      'An email impersonating DocuSign asks you to review and sign a document, linking to a fake sign-in page designed to steal your email credentials. These are frequently sent to employees at a company, since a "document needs signature" request rarely raises suspicion in an office setting. Verify unexpected signature requests directly with the sender through a separate channel before clicking through.',
    categorySlug: 'phishing',
    alertLevel: 'medium',
    sources: ['FBI IC3'],
    sourceUrl: 'https://www.hhs.gov/sites/default/files/docusign-abuse-sector-alart-tlpclear.pdf',
  },
  {
    name: 'Military Deployment Romance Scam',
    slug: 'military-deployment-romance-scam',
    description:
      'A scammer builds an online relationship using a profile claiming to be a U.S. service member deployed overseas, using a stolen photo of a real service member. The deployment cover story explains away video calls, unusual phone numbers, and delays, while building toward requests for money for things like leave approval, communication fees, or a flight home. The Department of Defense does not charge service members for leave or communication.',
    categorySlug: 'romance-scams',
    alertLevel: 'high',
    sources: ['FTC Consumer Advice', 'DoD Cyber Crime Center'],
    sourceUrl: 'https://consumer.ftc.gov/romance-scams',
  },
  {
    name: 'Widowed-Profile Romance Scam',
    slug: 'widowed-profile-romance-scam',
    description:
      'A dating profile presents as a recently widowed professional, often claiming international work (engineering, medicine, or business abroad) that explains why an in-person meeting keeps falling through. The "widowed" framing is used deliberately to build fast emotional trust and to explain financial hardship later in the conversation. Any request for money from someone you have not met in person is a reason to stop and verify, regardless of how long you have been talking.',
    categorySlug: 'romance-scams',
    alertLevel: 'high',
    sources: ['FTC Consumer Advice'],
    sourceUrl: 'https://consumer.ftc.gov/romance-scams',
  },
  {
    name: 'Fake Microsoft Security Pop-Up',
    slug: 'fake-microsoft-security-popup',
    description:
      'A browser pop-up styled to look like a Windows system alert claims your computer is infected and displays a phone number for "Microsoft support," sometimes locking the browser in full-screen mode. Calling the number connects you to a scammer who asks for remote access to "fix" the fabricated problem, then pressures for payment. No legitimate antivirus or operating system vendor detects an infection and tells you to call a phone number.',
    categorySlug: 'tech-support-scams',
    alertLevel: 'high',
    sources: ['FTC Consumer Advice'],
    sourceUrl: 'https://consumer.ftc.gov/articles/how-spot-avoid-and-report-tech-support-scams',
  },
  {
    name: 'Unsolicited "Your Computer Is Infected" Call',
    slug: 'unsolicited-tech-support-call',
    description:
      'A caller claims to be from a well-known tech company and says they have detected a virus or security breach on your computer, asking you to open a remote-access tool so they can "show you" the problem. Once connected, they may plant fake evidence of infection, lock files, or search for financial information, then demand payment — often by gift card or wire transfer — to resolve an issue that was never real.',
    categorySlug: 'tech-support-scams',
    alertLevel: 'high',
    sources: ['FTC Consumer Advice'],
    sourceUrl: 'https://consumer.ftc.gov/articles/how-spot-avoid-and-report-tech-support-scams',
  },
  {
    name: 'Fake Arrest Warrant Call',
    slug: 'fake-arrest-warrant-call',
    description:
      'A caller impersonating a police officer or court official claims you missed jury duty or have an outstanding warrant, and that immediate payment (by gift card, wire transfer, or in-person cash pickup by a "courier") will prevent arrest. Caller ID may be spoofed to display a real local police non-emergency number. No court or police department resolves a warrant over the phone with a same-call payment demand.',
    categorySlug: 'government-impersonation',
    alertLevel: 'critical',
    sources: ['FTC Consumer Advice'],
    sourceUrl: 'https://consumer.ftc.gov/government-impersonators',
  },
  {
    name: 'Fake CEO Wire Transfer Request',
    slug: 'fake-ceo-wire-transfer-request',
    description:
      'An email spoofed or closely mimicking an executive’s address instructs an employee — usually in finance or accounting — to urgently wire funds for a confidential deal, often timed for when the real executive is traveling and hard to reach for a quick confirmation. The request emphasizes urgency and discretion specifically to discourage the normal verification process. Any wire request received only by email should be confirmed by phone using a number you already had on file, not one provided in the message.',
    categorySlug: 'business-email-compromise',
    alertLevel: 'critical',
    sources: ['FBI IC3'],
    sourceUrl: 'https://www.ic3.gov/PSA/2016/PSA160614',
  },
  {
    name: 'Vendor Invoice Bank Account Change',
    slug: 'vendor-invoice-bank-change-scam',
    description:
      'A scammer who has compromised or spoofed a real vendor’s email sends an invoice, or a note about an upcoming invoice, stating their bank account has changed and providing new payment details. Because the invoice and vendor relationship are genuine, the fraud is only in the redirected account — payments look completely routine until the real vendor calls asking why they haven’t been paid. Always confirm banking-detail changes by phone with a previously verified contact before updating payment records.',
    categorySlug: 'business-email-compromise',
    alertLevel: 'critical',
    sources: ['FBI IC3'],
    sourceUrl: 'https://www.ic3.gov/PSA/2017/PSA170504',
  },
  {
    name: 'Pig Butchering Fake Crypto Platform',
    slug: 'pig-butchering-fake-crypto-platform',
    description:
      'After weeks of relationship-building over text or a dating app, a new contact introduces a cryptocurrency trading platform showing consistent, impressive returns. The platform is fabricated and entirely controlled by the scam operation; early small withdrawals are permitted specifically to build confidence before the victim commits a much larger sum, at which point withdrawals are blocked behind invented fees or "tax" payments. A platform that only allows withdrawals after another payment is a definitive red flag.',
    categorySlug: 'investment-fraud',
    alertLevel: 'critical',
    sources: ['FBI IC3', 'FTC Consumer Advice'],
    sourceUrl: 'https://www.ic3.gov/PSA/2022/psa221003',
  },
  {
    name: 'Guaranteed-Returns Investment Club',
    slug: 'guaranteed-returns-investment-club',
    description:
      'An investment opportunity — often pitched through a social media group, seminar, or referral from an acquaintance — promises fixed, guaranteed returns well above what any legitimate market investment offers, sometimes described as a "club" or "pool" that only insiders can join. Legitimate investments carry risk and cannot guarantee returns; a promised fixed high return is one of the most reliable indicators of fraud, regardless of how credible or personable the person offering it seems.',
    categorySlug: 'investment-fraud',
    alertLevel: 'high',
    sources: ['SEC Office of Investor Education', 'FTC Consumer Advice'],
    sourceUrl: 'https://www.investor.gov/protect-your-investments/fraud/types-fraud',
  },
  {
    name: 'Fake USPS Redelivery Text',
    slug: 'fake-usps-redelivery-text',
    description:
      'A text claiming to be from USPS says a package could not be delivered due to an incomplete address and links to a page requesting a small redelivery fee and your card details. USPS does not request payment by text link for redelivery; if you want to check a real package, use informed delivery or track it directly on usps.com with your actual tracking number.',
    categorySlug: 'package-delivery-scams',
    alertLevel: 'medium',
    sources: ['USPS Postal Inspection Service', 'FTC Consumer Advice'],
    sourceUrl: 'https://www.uspis.gov/news/scam-article/smishing-package-tracking-text-scams',
  },
  {
    name: 'Fake FedEx Customs Fee Text',
    slug: 'fake-fedex-customs-fee-text',
    description:
      'A text or email styled as a FedEx delivery notice claims an international package is being held pending a small customs fee, with a link to pay it. The message is sent broadly enough that a meaningful share of recipients are genuinely expecting some delivery, which makes the fake notice feel plausible. Confirm any real shipment directly through the carrier’s official app or website, never through a link in an unsolicited message.',
    categorySlug: 'package-delivery-scams',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice'],
    sourceUrl: 'https://consumer.ftc.gov/consumer-alerts/2025/04/think-text-message-usps-it-could-be-scam',
  },
  {
    name: 'Fake Remote Job Overpayment Check',
    slug: 'fake-remote-job-overpayment-check',
    description:
      'After a brief, informal hiring process, a new "employer" sends a check for more than the agreed signing bonus or equipment stipend and asks the new hire to deposit it and wire back the difference. The check is fraudulent and will eventually bounce, but not before the bank has made the funds provisionally available — leaving the victim liable for the full amount once the check is reversed, on top of the money already wired back.',
    categorySlug: 'employment-scams',
    alertLevel: 'high',
    sources: ['FTC Consumer Advice'],
    sourceUrl: 'https://consumer.ftc.gov/articles/job-scams',
  },
  {
    name: 'Mystery Shopper Job Scam',
    slug: 'mystery-shopper-job-scam',
    description:
      'An ad or unsolicited message offers paid work "secret shopping" at retail stores or wire-transfer services, often including a check to cover a first assignment’s purchases and fees. The instructions typically ask the new hire to deposit the check, spend part of it at a specified retailer, and wire or gift-card the remainder as part of "evaluating" the transfer service — the check bounces after the money has already been sent. Legitimate mystery-shopping work does not require you to spend your own deposited funds and wire money back.',
    categorySlug: 'employment-scams',
    alertLevel: 'high',
    sources: ['FTC Consumer Advice'],
    sourceUrl: 'https://consumer.ftc.gov/articles/job-scams',
  },
  {
    name: 'Fake Disaster Relief Charity',
    slug: 'fake-disaster-relief-charity',
    description:
      'In the days following a major hurricane, wildfire, or earthquake, a solicitation appears asking for donations to help victims, using real news photography and a name close enough to a well-known relief organization to avoid a second look. Some of these organizations are created specifically in the window after a disaster and disappear once donations taper off. Verify any disaster-relief charity independently through an evaluator like Charity Navigator or the BBB Wise Giving Alliance before donating.',
    categorySlug: 'charity-scams',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice', 'BBB Wise Giving Alliance'],
    sourceUrl: 'https://consumer.ftc.gov/all-scams/charity-scams',
  },
  {
    name: 'Fake Veterans Charity Phone Call',
    slug: 'fake-veterans-charity-call',
    description:
      'A caller solicits donations for wounded veterans or a veterans’ support fund, using patriotic and emotional appeals and pressuring for an immediate pledge on the call itself. Genuine veterans’ charities are registered and can be independently verified; a caller who pressures for an on-the-spot donation and cannot answer basic questions about how funds are used is a strong warning sign. Ask for written information and verify the organization independently before giving.',
    categorySlug: 'charity-scams',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice'],
    sourceUrl: 'https://consumer.ftc.gov/all-scams/charity-scams',
  },
  {
    name: 'Data Breach Follow-Up Phishing',
    slug: 'data-breach-followup-phishing',
    description:
      'After a company discloses a real data breach, scammers send emails impersonating that company’s "security team," offering a link to "check if your data was affected" or to enroll in free credit monitoring. The link leads to a credential-harvesting page that steals exactly the kind of information the real breach notice was warning about. Go directly to the company’s official site to check breach notices and enroll in any monitoring offered, rather than clicking a link in a follow-up email.',
    categorySlug: 'identity-theft',
    alertLevel: 'high',
    sources: ['FTC Consumer Advice'],
    sourceUrl: 'https://consumer.ftc.gov/identity-theft-and-online-security/identity-theft',
  },
  {
    name: 'Fake Credit Monitoring Enrollment Call',
    slug: 'fake-credit-monitoring-call',
    description:
      'A caller claims to represent a credit bureau or monitoring service and offers to "verify" your identity to set up free monitoring after a breach, asking for your Social Security number, date of birth, and account numbers over the phone. Real credit-monitoring enrollment does not require reciting your full SSN to an inbound caller you did not contact first. Hang up and enroll, if you choose to, directly through the bureau’s official website.',
    categorySlug: 'identity-theft',
    alertLevel: 'high',
    sources: ['FTC Consumer Advice'],
    sourceUrl: 'https://consumer.ftc.gov/identity-theft-and-online-security/identity-theft',
  },
  {
    name: 'Fake Discount Online Storefront',
    slug: 'fake-discount-online-storefront',
    description:
      'A newly created online store, often promoted through social media ads, offers name-brand products at steep discounts. Orders are taken and paid for, but nothing ships, or a cheap counterfeit arrives instead of the advertised product, and the store becomes unreachable once enough orders come in. Check for independent reviews of the specific store (not just the product), a real physical address, and pay with a credit card, which offers dispute rights that debit cards and wire transfers do not.',
    categorySlug: 'online-shopping-scams',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice', 'BBB'],
    sourceUrl: 'https://consumer.ftc.gov/scams-online-sales-when-orders-dont-arrive',
  },
  {
    name: 'Marketplace Overpayment Scam',
    slug: 'marketplace-overpayment-scam',
    description:
      'A buyer on an online marketplace sends a check or payment for more than the asking price, claiming it was a mistake by a shipping company or personal assistant, and asks the seller to refund the difference before the original payment has actually cleared. Once the seller refunds the "overpayment," the original payment bounces or is reversed, and the refunded money is gone. Never refund an overpayment before the original payment has fully and irreversibly cleared, which can take well over a week for a check.',
    categorySlug: 'online-shopping-scams',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice'],
    sourceUrl: 'https://consumer.ftc.gov/scams-online-sales-when-orders-dont-arrive',
  },
  {
    name: 'Fake Prize Notification Scam',
    slug: 'fake-prize-notification-scam',
    description:
      'An email, letter, or call claims you’ve won a major sweepstakes or lottery prize, often invoking a real, well-known name, but requires paying "taxes," "processing," or "insurance" fees before the winnings can be released. Legitimate sweepstakes never require a winner to pay money to receive a prize, and you cannot win a lottery or sweepstakes you never entered.',
    categorySlug: 'lottery-sweepstakes-scams',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice'],
    sourceUrl: 'https://consumer.ftc.gov/articles/fake-prize-sweepstakes-and-lottery-scams',
  },
  {
    name: '"You’ve Won a Free Cruise" Robocall',
    slug: 'free-cruise-prize-robocall',
    description:
      'An automated call announces you’ve been selected for a free cruise or vacation package and prompts you to press a number to claim it, which connects to a live agent pushing for a credit card number to cover "port fees" or "taxes" — fees that, if charged, are rarely followed by any actual trip. These robocalls are typically sent in enormous batches at minimal cost, so being "selected" means nothing beyond having a phone number that was dialed. Hang up rather than pressing any number, which can also confirm your number as active to future robocallers.',
    categorySlug: 'lottery-sweepstakes-scams',
    alertLevel: 'low',
    sources: ['FTC Consumer Advice', 'FCC'],
    sourceUrl: 'https://consumer.ftc.gov/articles/fake-prize-sweepstakes-and-lottery-scams',
  },

  // Second wave of current-pattern entries, added to broaden coverage
  // per-category (originally 2 each). Same standard as the entries
  // above: well-established, widely-documented patterns, not invented
  // specifics.
  {
    name: 'Fake Bank Fraud Alert Text',
    slug: 'fake-bank-fraud-alert-text',
    description:
      'A text claims suspicious activity was detected on your debit card and asks you to reply YES or NO, or tap a link to "verify" your account — the link leads to a fake bank login page that harvests your online banking credentials. Your real bank will never ask you to confirm your identity by clicking a link in a text message; if in doubt, call the number printed on the back of your card.',
    categorySlug: 'phishing',
    alertLevel: 'high',
    sources: ['FTC Consumer Advice', 'FBI IC3'],
    sourceUrl: 'https://consumer.ftc.gov/articles/how-recognize-avoid-phishing-scams',
  },
  {
    name: 'Fake Amazon Order Confirmation Email',
    slug: 'fake-amazon-order-confirmation-email',
    description:
      'An email confirms an expensive purchase you never made and includes a "cancel order" or "dispute charge" link, which leads to a fake Amazon sign-in page designed to steal your credentials and card details. Check your actual order history by typing amazon.com directly into your browser, never through a link in an email.',
    categorySlug: 'phishing',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice'],
    sourceUrl: 'https://consumer.ftc.gov/articles/how-recognize-avoid-phishing-scams',
  },
  {
    name: 'Fake IT Helpdesk Password Reset',
    slug: 'fake-it-helpdesk-password-reset',
    description:
      'An email or text posing as your company\'s IT department claims your password has expired and urges you to "reset now" through a link, which leads to a fake corporate sign-in page that harvests real credentials — often the opening move in a larger network breach, not just a one-off theft. Verify with your actual IT department through a known internal channel before entering credentials anywhere prompted by an unsolicited message.',
    categorySlug: 'phishing',
    alertLevel: 'high',
    sources: ['FBI IC3', 'CISA'],
    sourceUrl: 'https://www.ic3.gov/PSA/2024/PSA240411',
  },

  {
    name: 'Oil Rig or Overseas Contractor Romance Scam',
    slug: 'oil-rig-romance-scam',
    description:
      'A dating profile claims to work on an offshore oil rig, as a military contractor, or another remote overseas job, using the isolation of the "location" to explain away video calls and in-person meetings. After weeks of relationship-building, the story shifts to a supposed emergency — medical bills, travel costs to finally meet, or a shipment stuck in customs — that only money can solve.',
    categorySlug: 'romance-scams',
    alertLevel: 'high',
    sources: ['FTC Consumer Advice'],
    sourceUrl: 'https://consumer.ftc.gov/romance-scams',
  },
  {
    name: 'Off-Platform Messaging Push',
    slug: 'off-platform-messaging-push',
    description:
      'Early in a dating-app conversation, a match urges moving to WhatsApp, Telegram, or a personal email address, often claiming the app is "glitchy" or they\'re "about to lose access." This gets the conversation off a platform with reporting tools and fraud monitoring before any request for money begins — a legitimate match has no urgent reason to rush this before you\'ve even met in person.',
    categorySlug: 'romance-scams',
    alertLevel: 'low',
    sources: ['FTC Consumer Advice'],
    sourceUrl: 'https://consumer.ftc.gov/romance-scams',
  },
  {
    name: 'Romance-to-Crypto Investment Pivot',
    slug: 'romance-to-crypto-investment-pivot',
    description:
      'After weeks or months of relationship-building, an online romantic interest introduces a "can\'t miss" cryptocurrency platform or trading opportunity, encouraging escalating deposits before disappearing along with the funds — the on-ramp into what\'s commonly called "pig butchering" (see Investment Fraud). Anyone you\'ve never met in person steering you toward a specific investment platform is a red flag, regardless of how genuine the relationship feels.',
    categorySlug: 'romance-scams',
    alertLevel: 'critical',
    sources: ['FBI IC3', 'FTC Consumer Advice'],
    sourceUrl: 'https://www.ic3.gov/PSA/2021/PSA210916',
  },

  {
    name: 'Fake Apple ID Security Alert Text',
    slug: 'fake-apple-id-security-alert-text',
    description:
      'A text claims your Apple ID was accessed from an unrecognized device or location and includes a link to "secure your account," leading to a fake Apple sign-in page that harvests your Apple ID credentials — often used afterward to lock the real owner out through a password reset. Check account security directly in your device\'s Settings app, never through a link in a text.',
    categorySlug: 'tech-support-scams',
    alertLevel: 'high',
    sources: ['FTC Consumer Advice'],
    sourceUrl: 'https://consumer.ftc.gov/articles/how-spot-avoid-and-report-tech-support-scams',
  },
  {
    name: 'Auto-Renewal Antivirus Refund Call',
    slug: 'antivirus-refund-remote-access-call',
    description:
      'A call or pop-up claims an antivirus subscription auto-renewed for an inflated amount and offers a "refund" — but processing it requires remote access to your computer. During the session, the scammer moves money between your own accounts to make it look like they refunded too much, then claims you need to send the "extra" back via gift cards or wire transfer.',
    categorySlug: 'tech-support-scams',
    alertLevel: 'high',
    sources: ['FTC Consumer Advice', 'FBI IC3'],
    sourceUrl: 'https://consumer.ftc.gov/articles/how-spot-avoid-and-report-tech-support-scams',
  },
  {
    name: 'Fake ISP Service Disconnection Call',
    slug: 'fake-isp-disconnection-call',
    description:
      'An automated or live call claims your internet service will be disconnected within hours over a billing issue, pressuring immediate payment by gift card or wire transfer to avoid it. Contact your actual provider using the number on a past bill, never a callback number given by the caller — real providers don\'t threaten same-day disconnection over the phone.',
    categorySlug: 'tech-support-scams',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice'],
    sourceUrl: 'https://consumer.ftc.gov/articles/how-spot-avoid-and-report-tech-support-scams',
  },

  {
    name: 'Fake Unemployment Benefits Verification Alert',
    slug: 'fake-unemployment-benefits-alert',
    description:
      'A text or email claims your state unemployment account shows suspicious activity or needs identity re-verification, linking to a fake state portal that harvests Social Security numbers and bank details. This is frequently used to file fraudulent unemployment claims in the victim\'s name, sometimes without the victim ever finding out until a tax form arrives for benefits they never received.',
    categorySlug: 'government-impersonation',
    alertLevel: 'high',
    sources: ['FTC Consumer Advice', 'U.S. Department of Labor'],
    sourceUrl: 'https://consumer.ftc.gov/government-impersonators',
  },
  {
    name: 'Fake Immigration Deportation Threat Call',
    slug: 'fake-immigration-deportation-threat-call',
    description:
      'A caller claiming to be from immigration services threatens deportation or visa revocation unless a fee is paid immediately, targeting immigrants and international students who may be less familiar with how U.S. immigration proceedings actually work. Real immigration matters proceed through mailed notices and scheduled hearings, never a surprise phone call demanding same-day payment.',
    categorySlug: 'government-impersonation',
    alertLevel: 'critical',
    sources: ['FTC Consumer Advice', 'FBI IC3'],
    sourceUrl: 'https://consumer.ftc.gov/government-impersonators',
  },
  {
    name: 'Fake Census Bureau Data Request',
    slug: 'fake-census-bureau-data-request',
    description:
      'Outside of the actual census period, a caller or emailer claims to represent the Census Bureau and requests a Social Security number, bank account details, or a "verification fee." The real Census Bureau never asks for Social Security numbers, bank or credit card numbers, or money on behalf of a political party.',
    categorySlug: 'government-impersonation',
    alertLevel: 'medium',
    sources: ['U.S. Census Bureau', 'FTC Consumer Advice'],
    sourceUrl: 'https://www.census.gov/programs-surveys/surveyhelp/fraudulent-activity-and-scams.html',
  },

  {
    name: 'Fake Payroll Direct Deposit Change',
    slug: 'fake-payroll-direct-deposit-change',
    description:
      'An email impersonating an employee, often from a lookalike personal address, asks HR or payroll to update their direct deposit bank details before the next pay cycle — redirecting that employee\'s real paycheck to the scammer\'s account instead. Payroll changes should always be confirmed with the employee directly through a known phone number or in person, not just the email that requested it.',
    categorySlug: 'business-email-compromise',
    alertLevel: 'high',
    sources: ['FBI IC3'],
    sourceUrl: 'https://www.ic3.gov/PSA/2019/PSA190910',
  },
  {
    name: 'Compromised Closing Wire Instructions',
    slug: 'compromised-closing-wire-instructions',
    description:
      'During a real estate closing, a scammer who has compromised a title company\'s or attorney\'s email sends "updated" wire instructions to the buyer just before closing, redirecting the down payment or full purchase amount to their own account. Always confirm wire instructions by phone using a number you already had on file, never one provided in the same email as the instructions — funds sent this way are rarely recoverable.',
    categorySlug: 'business-email-compromise',
    alertLevel: 'critical',
    sources: ['FBI IC3', 'FTC Consumer Advice'],
    sourceUrl: 'https://www.ic3.gov/PSA/2018/PSA180712',
  },
  {
    name: 'Fake Executive Gift Card Request',
    slug: 'fake-executive-gift-card-request',
    description:
      'An email or text impersonating a company executive urgently asks an employee to buy gift cards for a "client gift" or "employee reward" and send the redemption codes, exploiting the employee\'s instinct to respond quickly to leadership. Executives don\'t conduct real business through unverified personal requests for gift cards — confirm any such request through a separate, known channel first.',
    categorySlug: 'business-email-compromise',
    alertLevel: 'medium',
    sources: ['FBI IC3', 'FTC Consumer Advice'],
    sourceUrl: 'https://www.ic3.gov/PSA/2018/PSA181024',
  },

  {
    name: 'Fake Celebrity-Endorsed Crypto Giveaway',
    slug: 'fake-celebrity-crypto-giveaway',
    description:
      'A fake social media post, hijacked verified account, or deepfake video appears to show a celebrity or public figure promoting a cryptocurrency "giveaway" that promises to double any crypto sent to a wallet address. The wallet simply keeps whatever is sent — nothing is ever returned, regardless of how convincing the video looks.',
    categorySlug: 'investment-fraud',
    alertLevel: 'high',
    sources: ['FTC Consumer Advice', 'FBI IC3'],
    sourceUrl: 'https://consumer.ftc.gov/articles/investment-scams',
  },
  {
    name: 'Prime Bank Instrument Fraud',
    slug: 'prime-bank-instrument-fraud',
    description:
      'Promoters offer access to exclusive "prime bank" trading programs supposedly used by major international banks, promising extraordinary guaranteed returns from financial instruments that don\'t actually exist in the form described. The SEC and FBI have been warning about this exact scheme, largely unchanged, for decades.',
    categorySlug: 'investment-fraud',
    alertLevel: 'high',
    sources: ['U.S. Securities and Exchange Commission', 'FBI IC3'],
    sourceUrl: 'https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins',
  },
  {
    name: 'Fake Forex or Day-Trading Signal Service',
    slug: 'fake-forex-signal-service',
    description:
      'A paid "signals" service or self-styled trading guru promises a proven system for guaranteed forex or stock market profits, often showing cherry-picked or fabricated screenshots of gains, collecting subscription fees or steering victims toward opening accounts at affiliated (and equally fake) brokers. No legitimate trading strategy can guarantee returns — that promise alone is disqualifying.',
    categorySlug: 'investment-fraud',
    alertLevel: 'medium',
    sources: ['U.S. Securities and Exchange Commission', 'FTC Consumer Advice'],
    sourceUrl: 'https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins',
  },

  {
    name: 'Fake Address Correction Fee Text',
    slug: 'fake-address-correction-fee-text',
    description:
      'A text claims a package can\'t be delivered due to an "incomplete address" and asks for a small correction fee, collecting card details through a fake carrier-branded payment page. A real delivery issue is resolved through the carrier\'s official app or website, never a link texted to you out of the blue.',
    categorySlug: 'package-delivery-scams',
    alertLevel: 'low',
    sources: ['USPS Postal Inspection Service', 'FTC Consumer Advice'],
    sourceUrl: 'https://www.uspis.gov/news/scam-article/smishing-package-tracking-text-scams',
  },
  {
    name: 'QR Code Delivery Scam',
    slug: 'qr-code-delivery-scam',
    description:
      'A sticker or slip claiming to be from a delivery carrier includes a QR code to "reschedule delivery" or "pay a redelivery fee." QR codes hide the destination web address until after you scan them, making a fake page harder to spot than a typed link would be — scan only codes you can verify came from a legitimate source.',
    categorySlug: 'package-delivery-scams',
    alertLevel: 'medium',
    sources: ['FBI IC3', 'FTC Consumer Advice'],
    sourceUrl: 'https://www.ic3.gov/PSA/2025/PSA250731',
  },
  {
    name: 'Fake Delivery Driver Tip Request',
    slug: 'fake-delivery-driver-tip-request',
    description:
      'A text supposedly from a delivery service asks for a card number to "leave a tip" for the driver on a package that was never actually ordered. This is often less about the small tip amount and more about confirming your number is active and that you\'re willing to enter payment details from an unsolicited text.',
    categorySlug: 'package-delivery-scams',
    alertLevel: 'low',
    sources: ['FTC Consumer Advice'],
    sourceUrl: 'https://consumer.ftc.gov/consumer-alerts/2025/04/think-text-message-usps-it-could-be-scam',
  },

  {
    name: 'Fake Job Requiring an Upfront Training Fee',
    slug: 'fake-job-upfront-training-fee',
    description:
      'After a suspiciously fast hiring process with no real interview, a "new employer" requires payment for training materials, a background check, or equipment before the first day of work. Legitimate employers cover the cost of onboarding their own new hires — they never require you to pay for it.',
    categorySlug: 'employment-scams',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice'],
    sourceUrl: 'https://consumer.ftc.gov/articles/job-scams',
  },
  {
    name: 'Fake Recruiter Personal Information Harvest',
    slug: 'fake-recruiter-info-harvest',
    description:
      'A message claiming to be from a recruiter for a real, well-known company requests a Social Security number and bank details "for HR paperwork" before any formal offer letter exists or the employment relationship has been verified. Real HR paperwork happens after a documented offer, through the company\'s own secure systems — not over email or chat with an unverified recruiter.',
    categorySlug: 'employment-scams',
    alertLevel: 'high',
    sources: ['FTC Consumer Advice', 'FBI IC3'],
    sourceUrl: 'https://consumer.ftc.gov/articles/job-scams',
  },
  {
    name: 'Fake Job-Board "Easy Apply" Phishing Page',
    slug: 'fake-easy-apply-phishing-page',
    description:
      'A job posting on a legitimate job board links out to an external "application portal" that\'s actually a credential-harvesting page mimicking a real company\'s careers site, collecting login credentials that are often reused across other accounts. Apply directly through a company\'s verified careers page when a listing seems off, rather than an external link in the posting.',
    categorySlug: 'employment-scams',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice'],
    sourceUrl: 'https://consumer.ftc.gov/articles/job-scams',
  },

  {
    name: 'Fake Medical Fundraiser',
    slug: 'fake-medical-fundraiser',
    description:
      'A fabricated crowdfunding campaign claims to raise money for a stranger\'s medical treatment, often using stolen photos and an invented story, then disappearing once donations peak — frequently timed around a real, well-publicized tragedy to borrow its urgency. Check a crowdfunding campaign\'s updates, comments, and organizer history before donating to anyone you don\'t personally know.',
    categorySlug: 'charity-scams',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice', 'BBB Scam Tracker'],
    sourceUrl: 'https://consumer.ftc.gov/all-scams/charity-scams',
  },
  {
    name: 'Look-Alike Charity Name Scam',
    slug: 'lookalike-charity-name-scam',
    description:
      'A fraudulent organization uses a name deliberately similar to a real, well-known charity — differing by a single word or abbreviation — to collect donations that never reach any real cause. Check a charity\'s exact legal name against a verification service like Charity Navigator or the BBB Wise Giving Alliance before donating, rather than trusting a name that merely sounds familiar.',
    categorySlug: 'charity-scams',
    alertLevel: 'medium',
    sources: ['BBB Scam Tracker', 'FTC Consumer Advice'],
    sourceUrl: 'https://give.org/news/wise-giving-wednesday-what-is-a-charity-scam',
  },
  {
    name: 'Fake Door-to-Door Charity Collector',
    slug: 'fake-door-to-door-charity-collector',
    description:
      'Someone claiming to collect for a local cause — a fire department, a school, a religious group — solicits cash donations door-to-door or in parking lots without any verifiable ID or paperwork. A real charity representative can always provide their organization\'s EIN and a receipt; a demand for cash only, on the spot, is a warning sign.',
    categorySlug: 'charity-scams',
    alertLevel: 'low',
    sources: ['BBB Scam Tracker', 'FTC Consumer Advice'],
    sourceUrl: 'https://give.org/news/wise-giving-wednesday-what-is-a-charity-scam',
  },

  {
    name: 'SIM Swap Fraud',
    slug: 'sim-swap-fraud',
    description:
      'A scammer convinces a mobile carrier, often through social engineering or a bribed insider, to transfer your phone number to a SIM card they control. From there, they can intercept SMS-based two-factor authentication codes and take over bank, email, and crypto accounts — often within minutes of the swap succeeding. A carrier PIN and app-based (not SMS-based) two-factor authentication meaningfully reduce this risk.',
    categorySlug: 'identity-theft',
    alertLevel: 'critical',
    sources: ['FCC', 'FBI IC3'],
    sourceUrl: 'https://www.fcc.gov/general/frauds-scams-and-alerts-guides',
  },
  {
    name: 'Synthetic Identity Fraud',
    slug: 'synthetic-identity-fraud',
    description:
      'A fraudster combines a real Social Security number, often one belonging to a child or someone with little credit activity, with fabricated personal details to build an entirely new credit identity over months or years, before maxing out credit and disappearing. This is why placing a credit freeze for a minor, and periodically checking that no credit file exists yet in their name, is a real protective step.',
    categorySlug: 'identity-theft',
    alertLevel: 'high',
    sources: ['FTC Consumer Advice', 'FBI IC3'],
    sourceUrl: 'https://consumer.ftc.gov/identity-theft-and-online-security/identity-theft',
  },
  {
    name: 'Mail Theft Identity Theft',
    slug: 'mail-theft-identity-theft',
    description:
      'Thieves steal physical mail — checks, tax documents, pre-approved credit offers — directly from mailboxes to harvest personal and financial information. A locking mailbox, prompt mail pickup, and opting out of pre-approved credit offers by mail meaningfully reduce this long-standing, low-tech risk.',
    categorySlug: 'identity-theft',
    alertLevel: 'medium',
    sources: ['USPS Postal Inspection Service', 'FTC Consumer Advice'],
    sourceUrl: 'https://www.uspis.gov/tips-prevention/identity-theft',
  },

  {
    name: 'Fake Ticket Reseller Scam',
    slug: 'fake-ticket-reseller-scam',
    description:
      'A listing for concert or sports tickets on an unofficial resale site or social media collects payment for tickets that either never arrive or turn out to be counterfeit or already scanned at the venue — a pattern that spikes around high-demand events with limited official ticket availability. Buy only through the venue, artist, or a verified resale platform with a buyer guarantee.',
    categorySlug: 'online-shopping-scams',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice', 'BBB Scam Tracker'],
    sourceUrl: 'https://consumer.ftc.gov/scams-online-sales-when-orders-dont-arrive',
  },
  {
    name: 'Puppy Scam',
    slug: 'puppy-scam',
    description:
      'A fake online listing offers purebred puppies at a below-market price, then adds unexpected "shipping crate," "insurance," or "vet fee" charges before delivery — the puppy never actually exists. Reverse-image-search listing photos and insist on a video call or in-person visit before paying anything toward a pet you haven\'t met.',
    categorySlug: 'online-shopping-scams',
    alertLevel: 'medium',
    sources: ['BBB Scam Tracker', 'FTC Consumer Advice'],
    sourceUrl: 'https://www.bbb.org/all/online-shopping/online-shopping-scams',
  },
  {
    name: 'Fake Rental Listing Scam',
    slug: 'fake-rental-listing-scam',
    description:
      'A listing for an apartment or vacation rental, often a real property\'s photos copied from a legitimate listing, is posted by someone who isn\'t the actual owner or property manager, collecting a deposit or first month\'s rent before disappearing. Never pay a deposit before touring a rental in person (or via a live video call) and verifying the lister actually owns or manages the property.',
    categorySlug: 'online-shopping-scams',
    alertLevel: 'high',
    sources: ['FTC Consumer Advice', 'BBB Scam Tracker'],
    sourceUrl: 'https://consumer.ftc.gov/scams-online-sales-when-orders-dont-arrive',
  },

  {
    name: 'Fake Foreign Lottery Win',
    slug: 'fake-foreign-lottery-win',
    description:
      'A letter or email claims you\'ve won a foreign lottery you never entered, requiring payment of "taxes" or "transfer fees" before winnings can be released. It\'s also illegal for U.S. residents to play most foreign lotteries by mail or phone in the first place — which makes the premise itself a warning sign, independent of the fee request.',
    categorySlug: 'lottery-sweepstakes-scams',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice', 'U.S. Postal Inspection Service'],
    sourceUrl: 'https://consumer.ftc.gov/articles/fake-prize-sweepstakes-and-lottery-scams',
  },
  {
    name: 'Fake "Prize Patrol" Sweepstakes Call',
    slug: 'fake-prize-patrol-call',
    description:
      'A caller impersonating a major, real sweepstakes brand claims you\'ve won a large prize and need to pay fees or taxes before a "prize patrol" can deliver a check in person. Real sweepstakes never require payment to claim a prize, and legitimate winners aren\'t called in advance of a surprise in-person delivery.',
    categorySlug: 'lottery-sweepstakes-scams',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice', 'FCC'],
    sourceUrl: 'https://consumer.ftc.gov/articles/fake-prize-sweepstakes-and-lottery-scams',
  },
  {
    name: 'Fake Government Grant Award',
    slug: 'fake-government-grant-award',
    description:
      'A call or message claims you\'ve been awarded a government grant, sometimes citing a stimulus or relief program, and just need to pay a "processing fee" or provide bank details for direct deposit. The government does not award unsolicited cash grants to individuals it contacts out of the blue.',
    categorySlug: 'lottery-sweepstakes-scams',
    alertLevel: 'high',
    sources: ['FTC Consumer Advice', 'USA.gov'],
    sourceUrl: 'https://consumer.ftc.gov/articles/fake-prize-sweepstakes-and-lottery-scams',
  },

  // Third wave: 3 more entries for each of the original 12 categories,
  // plus 5 entries each for 8 new categories (sextortion, account
  // takeover, insurance fraud, healthcare fraud, AI/deepfake, debt
  // relief, mortgage/foreclosure, tax). Same standard as every entry
  // above — well-established, widely-documented patterns.
  {
    name: 'Fake PayPal Unauthorized Access Alert',
    slug: 'fake-paypal-unauthorized-access-alert',
    description:
      'An email claims unusual activity was detected on a PayPal account and links to a fake PayPal login page that harvests credentials. Check account activity by typing paypal.com directly into a browser, never through a link in an email.',
    categorySlug: 'phishing',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice'],
    sourceUrl: 'https://consumer.ftc.gov/articles/how-recognize-avoid-phishing-scams',
  },
  {
    name: 'Fake Cloud Storage Full Warning',
    slug: 'fake-cloud-storage-full-warning',
    description:
      'An email claims a Google Drive, iCloud, or Dropbox account is full and files will be deleted unless the recipient "upgrades now," linking to a fake sign-in page that harvests the account\'s real credentials.',
    categorySlug: 'phishing',
    alertLevel: 'low',
    sources: ['FTC Consumer Advice'],
    sourceUrl: 'https://consumer.ftc.gov/articles/how-recognize-avoid-phishing-scams',
  },
  {
    name: 'Malicious Invoice Attachment Phishing',
    slug: 'malicious-invoice-attachment-phishing',
    description:
      'An email disguised as an overdue invoice or shipping document carries a malicious attachment that, once opened, installs malware capable of stealing saved passwords and banking credentials directly from the device.',
    categorySlug: 'phishing',
    alertLevel: 'high',
    sources: ['FBI IC3', 'CISA'],
    sourceUrl: 'https://www.ic3.gov/',
  },
  {
    name: 'Sugar Daddy Advance-Fee Scam',
    slug: 'sugar-daddy-advance-fee-scam',
    description:
      'A profile offering a generous "allowance" arrangement asks the other party to first pay a small verification or processing fee, or to accept and forward a check (which later bounces) before any real money ever changes hands.',
    categorySlug: 'romance-scams',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice', 'BBB Scam Tracker'],
    sourceUrl: 'https://consumer.ftc.gov/romance-scams',
  },
  {
    name: 'Long-Distance Engagement Travel Funds Scam',
    slug: 'long-distance-engagement-travel-funds-scam',
    description:
      'After building a long-distance online relationship and even a promised engagement, the scammer claims they\'re finally ready to visit or move but need help covering a flight, visa, or "travel insurance" fee — and the trip never happens.',
    categorySlug: 'romance-scams',
    alertLevel: 'high',
    sources: ['FTC Consumer Advice'],
    sourceUrl: 'https://consumer.ftc.gov/romance-scams',
  },
  {
    name: 'Sick Child Overseas Romance Scam',
    slug: 'sick-child-overseas-romance-scam',
    description:
      'A romance scam profile builds sympathy with a fabricated story about a child from a previous relationship who has fallen seriously ill overseas, requesting money for medical bills to "save" a child who doesn\'t exist.',
    categorySlug: 'romance-scams',
    alertLevel: 'high',
    sources: ['FTC Consumer Advice'],
    sourceUrl: 'https://consumer.ftc.gov/romance-scams',
  },
  {
    name: 'Fake Streaming Service Compromised Account Call',
    slug: 'fake-streaming-account-compromised-call',
    description:
      'A caller claims your Netflix, Amazon, or other streaming account has been compromised and offers to "fix" it by taking remote control of your computer, using the access to look for banking information instead.',
    categorySlug: 'tech-support-scams',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice'],
    sourceUrl: 'https://consumer.ftc.gov/articles/how-spot-avoid-and-report-tech-support-scams',
  },
  {
    name: 'Fake Bank Fraud Department Remote Access Scam',
    slug: 'fake-bank-fraud-department-remote-access',
    description:
      "A caller posing as your bank's fraud department claims your account was compromised and needs \"verification\" through a remote-access screen-sharing app. Real bank fraud teams never ask to remotely control your device.",
    categorySlug: 'tech-support-scams',
    alertLevel: 'critical',
    sources: ['FTC Consumer Advice', 'FBI IC3'],
    sourceUrl: 'https://consumer.ftc.gov/articles/how-spot-avoid-and-report-tech-support-scams',
  },
  {
    name: 'Fake Router Firmware Update Call',
    slug: 'fake-router-firmware-update-call',
    description:
      'A caller claims your home router urgently needs a "critical security update" and talks you through installing remote-access software, which is then used to search the device for saved passwords and financial information.',
    categorySlug: 'tech-support-scams',
    alertLevel: 'high',
    sources: ['FTC Consumer Advice'],
    sourceUrl: 'https://consumer.ftc.gov/articles/how-spot-avoid-and-report-tech-support-scams',
  },
  {
    name: 'Fake Jury Duty Failure-to-Appear Fine',
    slug: 'fake-jury-duty-failure-to-appear-fine',
    description:
      "A caller claims you missed jury duty and owe an immediate fine to avoid arrest, sometimes correctly naming a real local courthouse to sound credible. Actual missed-jury-duty consequences are handled by mail and a real court appearance, never a same-day phone payment demand.",
    categorySlug: 'government-impersonation',
    alertLevel: 'high',
    sources: ['FTC Consumer Advice'],
    sourceUrl: 'https://consumer.ftc.gov/government-impersonators',
  },
  {
    name: 'Fake Urgent Legal Demand Email',
    slug: 'fake-urgent-legal-demand-email',
    description:
      'An email impersonating a lawyer or citing a confidential legal matter (an acquisition, a lawsuit settlement) pressures an assistant or finance employee into an urgent, secretive wire transfer, using the "confidential" framing to discourage checking with anyone else.',
    categorySlug: 'business-email-compromise',
    alertLevel: 'critical',
    sources: ['FBI IC3'],
    sourceUrl: 'https://www.ic3.gov/',
  },
  {
    name: 'Compromised Vendor Portal Credential Phishing',
    slug: 'compromised-vendor-portal-credential-phishing',
    description:
      "A phishing email disguised as an accounts-payable portal notification harvests login credentials from a company's AP staff, giving an attacker a foothold to alter real vendor payment details from inside a trusted system.",
    categorySlug: 'business-email-compromise',
    alertLevel: 'high',
    sources: ['FBI IC3'],
    sourceUrl: 'https://www.ic3.gov/PSA/2020/PSA200406',
  },
  {
    name: 'Fake New-Hire Direct Deposit Setup',
    slug: 'fake-new-hire-direct-deposit-setup',
    description:
      "Posing as a brand-new employee with no prior payroll history to check against, a scammer emails HR with \"updated\" direct deposit details before the employee's first real paycheck is issued, redirecting it from day one.",
    categorySlug: 'business-email-compromise',
    alertLevel: 'medium',
    sources: ['FBI IC3'],
    sourceUrl: 'https://www.ic3.gov/PSA/2019/PSA190910',
  },
  {
    name: 'Fake Real Estate Crowdfunding Platform',
    slug: 'fake-real-estate-crowdfunding-platform',
    description:
      "A slickly designed website solicits small investments toward fractional ownership of real estate properties that don't exist or aren't actually connected to the platform, showing a rising \"portfolio value\" that can never actually be withdrawn.",
    categorySlug: 'investment-fraud',
    alertLevel: 'high',
    sources: ['U.S. Securities and Exchange Commission'],
    sourceUrl: 'https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins',
  },
  {
    name: 'Private Lending Club Ponzi Scheme',
    slug: 'private-lending-club-ponzi-scheme',
    description:
      'An informal "investment club," often recruited through word-of-mouth or a religious or cultural community, promises high fixed returns from private lending. Early members are paid from later members\' contributions until recruitment slows and the scheme collapses.',
    categorySlug: 'investment-fraud',
    alertLevel: 'high',
    sources: ['U.S. Securities and Exchange Commission', 'FTC Consumer Advice'],
    sourceUrl: 'https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins',
  },
  {
    name: 'Rug Pull Token Presale Scam',
    slug: 'rug-pull-token-presale-scam',
    description:
      'Promoters hype an upcoming cryptocurrency token or NFT collection with a professional-looking website and social media buzz, collect funds during a "presale," then abandon the project and disappear with the money once the sale closes.',
    categorySlug: 'investment-fraud',
    alertLevel: 'high',
    sources: ['FBI IC3', 'U.S. Securities and Exchange Commission'],
    sourceUrl: 'https://www.ic3.gov/',
  },
  {
    name: 'Fake DHL Missed Delivery Card',
    slug: 'fake-dhl-missed-delivery-card',
    description:
      'A card left at the door (or a text) claims a DHL delivery was missed and provides a number or link to "reschedule," leading either to a phishing page or a premium-rate phone number that racks up charges per minute.',
    categorySlug: 'package-delivery-scams',
    alertLevel: 'low',
    sources: ['FTC Consumer Advice'],
    sourceUrl: 'https://consumer.ftc.gov/consumer-alerts/2025/04/think-text-message-usps-it-could-be-scam',
  },
  {
    name: 'Fake Amazon Delivery Failed Refund Scam',
    slug: 'fake-amazon-delivery-failed-refund-scam',
    description:
      'A text claims an Amazon delivery failed and a refund is being processed, asking the recipient to confirm their card details to "receive" money that Amazon was never actually planning to refund.',
    categorySlug: 'package-delivery-scams',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice'],
    sourceUrl: 'https://consumer.ftc.gov/consumer-alerts/2025/04/think-text-message-usps-it-could-be-scam',
  },
  {
    name: 'Data Entry Job Starter Kit Fee',
    slug: 'data-entry-job-starter-kit-fee',
    description:
      'A "work from home" data entry job requires purchasing a mandatory training kit or software license before the first assignment, and no real paying work ever materializes after payment.',
    categorySlug: 'employment-scams',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice'],
    sourceUrl: 'https://consumer.ftc.gov/articles/job-scams',
  },
  {
    name: 'Guaranteed Government Job Placement Fee',
    slug: 'guaranteed-government-job-placement-fee',
    description:
      'An ad promises guaranteed placement into a federal or postal job for an upfront "processing" or "exam prep" fee. Actual federal job applications are free and go through USAJobs.gov directly.',
    categorySlug: 'employment-scams',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice', 'USA.gov'],
    sourceUrl: 'https://consumer.ftc.gov/articles/job-scams',
  },
  {
    name: 'Task-Completion Pyramid Scam',
    slug: 'task-completion-pyramid-scam',
    description:
      'Recruited through social media or messaging apps, victims are told they can earn money completing simple online "tasks" (liking videos, rating products), building trust with small real payouts before being told a larger deposit is needed to unlock bigger earnings — a deposit that\'s never returned.',
    categorySlug: 'employment-scams',
    alertLevel: 'high',
    sources: ['FBI IC3', 'FTC Consumer Advice'],
    sourceUrl: 'https://consumer.ftc.gov/consumer-alerts/2024/11/task-scams-create-illusion-making-money',
  },
  {
    name: 'Fake Holiday Toy Drive Scam',
    slug: 'fake-holiday-toy-drive-scam',
    description:
      'Around the winter holidays, a fraudulent "toy drive" solicits cash or gift card donations through social media posts or door-to-door collection, with no real charity or distribution behind it.',
    categorySlug: 'charity-scams',
    alertLevel: 'low',
    sources: ['BBB Scam Tracker'],
    sourceUrl: 'https://give.org/news/wise-giving-wednesday-what-is-a-charity-scam',
  },
  {
    name: 'Fake Animal Rescue Charity',
    slug: 'fake-animal-rescue-charity',
    description:
      "Using heartbreaking photos of injured or abandoned animals, a fraudulent \"rescue\" solicits recurring donations for a shelter that doesn't actually exist or doesn't use donations as described.",
    categorySlug: 'charity-scams',
    alertLevel: 'medium',
    sources: ['BBB Scam Tracker', 'FTC Consumer Advice'],
    sourceUrl: 'https://give.org/news/wise-giving-wednesday-what-is-a-charity-scam',
  },
  {
    name: 'Fake Police or Firefighter Fraternal Donation Call',
    slug: 'fake-police-firefighter-fraternal-donation-call',
    description:
      "A caller claims to represent a local police or firefighter benevolent association, using the uniformed-service association to build trust, but the \"fraternal organization\" keeps most or all of the donated funds rather than passing them to actual first responders.",
    categorySlug: 'charity-scams',
    alertLevel: 'medium',
    sources: ['BBB Scam Tracker', 'FTC Consumer Advice'],
    sourceUrl: 'https://give.org/news/wise-giving-wednesday-what-is-a-charity-scam',
  },
  {
    name: 'Medical Identity Theft',
    slug: 'medical-identity-theft',
    description:
      'A stolen insurance ID or Social Security number is used to receive medical treatment or equipment in the victim\'s name, leaving the real policyholder with unfamiliar charges, a corrupted medical record, and possible denied future claims.',
    categorySlug: 'identity-theft',
    alertLevel: 'high',
    sources: ['FTC Consumer Advice'],
    sourceUrl: 'https://consumer.ftc.gov/identity-theft-and-online-security/identity-theft',
  },
  {
    name: 'Child Identity Theft via School Data Breach',
    slug: 'child-identity-theft-school-data-breach',
    description:
      "A child's Social Security number, obtained through a school district data breach or a family member's own misuse, is used to open credit lines that go undetected for years since children rarely check their own credit.",
    categorySlug: 'identity-theft',
    alertLevel: 'high',
    sources: ['FTC Consumer Advice'],
    sourceUrl: 'https://consumer.ftc.gov/identity-theft-and-online-security/identity-theft',
  },
  {
    name: 'New Account Fraud via Public Records',
    slug: 'new-account-fraud-public-records',
    description:
      "A scammer combines details found in public records (address history, date of birth) with a stolen Social Security number to open new credit cards or loans in a victim's name, often targeting people who haven't frozen their credit.",
    categorySlug: 'identity-theft',
    alertLevel: 'high',
    sources: ['FTC Consumer Advice'],
    sourceUrl: 'https://consumer.ftc.gov/identity-theft-and-online-security/identity-theft',
  },
  {
    name: 'Fake Social Media Influencer Storefront',
    slug: 'fake-influencer-storefront',
    description:
      "A social media ad featuring what looks like an influencer's product recommendation links to a storefront that takes payment for items that are counterfeit, wildly different from advertised, or never shipped at all.",
    categorySlug: 'online-shopping-scams',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice', 'BBB Scam Tracker'],
    sourceUrl: 'https://consumer.ftc.gov/scams-online-sales-when-orders-dont-arrive',
  },
  {
    name: 'Fake Vehicle Listing Scam',
    slug: 'fake-vehicle-listing-scam',
    description:
      "A too-good-to-be-true used car listing, often claiming the seller is relocating or deployed overseas, asks for a deposit or full payment via wire or gift card before any in-person viewing. The vehicle, and often the seller, doesn't exist.",
    categorySlug: 'online-shopping-scams',
    alertLevel: 'high',
    sources: ['FTC Consumer Advice', 'BBB Scam Tracker'],
    sourceUrl: 'https://consumer.ftc.gov/scams-online-sales-when-orders-dont-arrive',
  },
  {
    name: 'Fake Furniture Liquidation Sale Scam',
    slug: 'fake-furniture-liquidation-sale-scam',
    description:
      'A pop-up website or social ad advertises a store-closing or liquidation sale on furniture or appliances at deep discounts, collects payment, and never ships anything, disappearing once complaints start.',
    categorySlug: 'online-shopping-scams',
    alertLevel: 'medium',
    sources: ['BBB Scam Tracker'],
    sourceUrl: 'https://www.bbb.org/all/online-shopping/online-shopping-scams',
  },
  {
    name: 'Fake Second-Chance Lottery Winner Notification',
    slug: 'fake-second-chance-lottery-winner',
    description:
      'A text or call claims a losing lottery ticket was actually entered into a "second chance" drawing and won, requiring a fee to release the prize. Legitimate second-chance drawings never require a winner to pay anything upfront.',
    categorySlug: 'lottery-sweepstakes-scams',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice'],
    sourceUrl: 'https://consumer.ftc.gov/articles/fake-prize-sweepstakes-and-lottery-scams',
  },
  {
    name: 'Fake Class Action Settlement Payout Scam',
    slug: 'fake-class-action-settlement-payout-scam',
    description:
      'A message claims the recipient is owed money from a real, well-publicized class action lawsuit and requests personal or banking information to "process" the payout. Real settlement administrators never solicit this information this way.',
    categorySlug: 'lottery-sweepstakes-scams',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice'],
    sourceUrl: 'https://consumer.ftc.gov/articles/fake-prize-sweepstakes-and-lottery-scams',
  },
  {
    name: 'Fake Unknown Relative Inheritance Scam',
    slug: 'fake-unknown-relative-inheritance-scam',
    description:
      'An email or letter claims a distant, unknown relative has died and left an inheritance, requiring fees or personal information to release the funds — a modern variation of a very old advance-fee scheme.',
    categorySlug: 'lottery-sweepstakes-scams',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice', 'U.S. Postal Inspection Service'],
    sourceUrl: 'https://consumer.ftc.gov/articles/fake-prize-sweepstakes-and-lottery-scams',
  },

  // New category: Sextortion
  {
    name: 'Webcam Blackmail Scam',
    slug: 'webcam-blackmail-scam',
    description:
      'A scammer poses as a romantic interest online, lures the victim into a compromising video chat (sometimes using a recorded loop of a real or fake nude image), secretly records it, then demands payment to avoid sending it to the victim\'s contacts. Paying rarely stops the threats — the FBI recommends reporting instead.',
    categorySlug: 'sextortion',
    alertLevel: 'critical',
    sources: ['FBI IC3'],
    sourceUrl: 'https://www.ic3.gov/PSA/2021/PSA210902',
  },
  {
    name: 'Fake Data Breach Password Blackmail Email',
    slug: 'fake-data-breach-password-blackmail-email',
    description:
      'An email claims to have hacked the victim\'s webcam using a password from a real old data breach — proving legitimacy by quoting that real, breached password — and threatens to release fabricated footage unless paid in cryptocurrency. The password is real from a public breach, but the "hacking" and footage are almost always fabricated.',
    categorySlug: 'sextortion',
    alertLevel: 'high',
    sources: ['FBI IC3', 'FTC Consumer Advice'],
    sourceUrl: 'https://www.ic3.gov/PSA/2020/PSA200420',
  },
  {
    name: 'Fake Minor Predator Extortion Scam',
    slug: 'fake-minor-predator-extortion-scam',
    description:
      'A scammer poses as an underage user on social media or a dating app, then after some messages, claims to actually be a parent or law enforcement threatening legal exposure unless paid — targeting adults through fear of a false accusation.',
    categorySlug: 'sextortion',
    alertLevel: 'high',
    sources: ['FBI IC3'],
    sourceUrl: 'https://www.ic3.gov/',
  },
  {
    name: 'AI-Generated Nude Image Extortion',
    slug: 'ai-generated-nude-image-extortion',
    description:
      'A scammer uses an AI image generator to create a fake nude photo of the victim from an innocuous real photo, often pulled from social media, then threatens to distribute it unless paid — increasingly reported among teenagers targeted through social media.',
    categorySlug: 'sextortion',
    alertLevel: 'critical',
    sources: ['FBI IC3', 'NCMEC'],
    sourceUrl: 'https://www.ic3.gov/PSA/2023/psa230605',
  },
  {
    name: 'Recorded Video Call Extortion via Compromised Account',
    slug: 'recorded-video-call-extortion-compromised-account',
    description:
      'After gaining access to a victim\'s messaging account, often via a prior phishing link, a scammer impersonates the victim to solicit compromising images or video from the victim\'s own contacts, then extorts those contacts using the real material.',
    categorySlug: 'sextortion',
    alertLevel: 'critical',
    sources: ['FBI IC3'],
    sourceUrl: 'https://www.ic3.gov/PSA/2023/psa230605',
  },

  // New category: Account Takeover
  {
    name: 'Credential Stuffing Login Alert Scam',
    slug: 'credential-stuffing-login-alert-scam',
    description:
      'A scammer who purchased a batch of leaked username/password pairs from an old data breach tries them against banking and shopping sites. A victim receives a real "new device sign-in" alert, sometimes followed by a scammer posing as the platform\'s security team to "help" — which is itself a second phishing attempt.',
    categorySlug: 'account-takeover',
    alertLevel: 'high',
    sources: ['FTC Consumer Advice', 'FBI IC3'],
    sourceUrl: 'https://consumer.ftc.gov/articles/how-recover-your-hacked-email-or-social-media-account',
  },
  {
    name: 'Fake Password Reset Confirmation',
    slug: 'fake-password-reset-confirmation',
    description:
      'A text or email claims a password reset was just requested on an account and asks the recipient to reply with a verification code to cancel it. That code is actually the real reset code, and providing it hands the account straight to the attacker.',
    categorySlug: 'account-takeover',
    alertLevel: 'critical',
    sources: ['FTC Consumer Advice'],
    sourceUrl: 'https://consumer.ftc.gov/articles/how-recover-your-hacked-email-or-social-media-account',
  },
  {
    name: 'Social-Engineered Account Recovery Bypass',
    slug: 'social-engineered-account-recovery-bypass',
    description:
      'After gathering a victim\'s email address and some personal details, an attacker uses an account\'s "forgot password" flow along with social-engineered customer support calls to bypass security questions and take over the account.',
    categorySlug: 'account-takeover',
    alertLevel: 'high',
    sources: ['FBI IC3'],
    sourceUrl: 'https://www.ic3.gov/PSA/2025/PSA251125',
  },
  {
    name: 'Compromised Social Media Ad Account Takeover',
    slug: 'compromised-social-media-ad-account-takeover',
    description:
      'A phishing message disguised as a "policy violation" notice from a social platform harvests business ad-account credentials, which are then used to run fraudulent ad campaigns on the victim\'s dime before the real owner is locked out.',
    categorySlug: 'account-takeover',
    alertLevel: 'high',
    sources: ['FTC Consumer Advice'],
    sourceUrl: 'https://consumer.ftc.gov/articles/how-recover-your-hacked-email-or-social-media-account',
  },
  {
    name: 'Session Cookie Theft via Malicious Browser Extension',
    slug: 'session-cookie-theft-browser-extension',
    description:
      'A browser extension marketed as a productivity or shopping-discount tool secretly harvests session cookies, letting an attacker take over logged-in accounts without needing a password at all.',
    categorySlug: 'account-takeover',
    alertLevel: 'high',
    sources: ['CISA', 'FBI IC3'],
    sourceUrl: 'https://www.cisa.gov/',
  },

  // New category: Insurance Fraud
  {
    name: 'Fake Insurance Agent Cold Call',
    slug: 'fake-insurance-agent-cold-call',
    description:
      'A caller posing as an insurance agent offers suspiciously cheap health, auto, or life coverage, collects a premium payment and personal information, and the "policy" never actually exists with any real insurer.',
    categorySlug: 'insurance-fraud',
    alertLevel: 'high',
    sources: ['FTC Consumer Advice'],
    sourceUrl: 'https://consumer.ftc.gov/articles/spot-health-insurance-scams',
  },
  {
    name: 'Post-Disaster Fake Claims Adjuster',
    slug: 'post-disaster-fake-claims-adjuster',
    description:
      'After a hurricane, flood, or other disaster, someone posing as an insurance adjuster offers to "fast-track" a claim in exchange for an upfront fee, or by having the homeowner sign over claim rights to a fraudulent contractor.',
    categorySlug: 'insurance-fraud',
    alertLevel: 'high',
    sources: ['FTC Consumer Advice'],
    sourceUrl: 'https://consumer.ftc.gov/articles/spot-health-insurance-scams',
  },
  {
    name: 'Staged Auto Accident Scam',
    slug: 'staged-auto-accident-scam',
    description:
      'A scammer deliberately causes a minor collision to file an inflated insurance claim against the other driver, sometimes involving a network of fake witnesses and clinics billing for treatment never provided.',
    categorySlug: 'insurance-fraud',
    alertLevel: 'medium',
    sources: ['FBI IC3'],
    sourceUrl: 'https://www.ic3.gov/',
  },
  {
    name: 'Fake Pet Insurance Renewal Scam',
    slug: 'fake-pet-insurance-renewal-scam',
    description:
      'An email mimicking a real pet insurance provider claims a policy is about to lapse and requests updated payment details through a lookalike site, harvesting card information rather than actually renewing anything.',
    categorySlug: 'insurance-fraud',
    alertLevel: 'low',
    sources: ['FTC Consumer Advice'],
    sourceUrl: 'https://consumer.ftc.gov/articles/spot-health-insurance-scams',
  },
  {
    name: 'Ghost Broker Auto Insurance Scam',
    slug: 'ghost-broker-auto-insurance-scam',
    description:
      'A "broker" sells a real-looking auto insurance policy at a steep discount by lying on the application or by simply never placing the policy with an insurer at all — the driver only finds out the coverage never existed after an accident.',
    categorySlug: 'insurance-fraud',
    alertLevel: 'high',
    sources: ['FTC Consumer Advice'],
    sourceUrl: 'https://consumer.ftc.gov/articles/spot-health-insurance-scams',
  },

  // New category: Healthcare Fraud
  {
    name: 'Fake Medicare Card Replacement Call',
    slug: 'fake-medicare-card-replacement-call',
    description:
      'A caller claims new plastic Medicare cards are being issued and requests a Medicare number, Social Security number, or a fee to process the replacement. Medicare does not call beneficiaries out of the blue asking for this information.',
    categorySlug: 'healthcare-fraud',
    alertLevel: 'high',
    sources: ['Medicare.gov', 'FTC Consumer Advice'],
    sourceUrl: 'https://www.medicare.gov/basics/reporting-medicare-fraud-and-abuse',
  },
  {
    name: 'Fake Online Pharmacy',
    slug: 'fake-online-pharmacy',
    description:
      'A website offers prescription medication without a real prescription at steep discounts. The pills are often counterfeit, contain no active ingredient, or contain dangerous, unlisted substances, and the site harvests payment and personal health information.',
    categorySlug: 'healthcare-fraud',
    alertLevel: 'critical',
    sources: ['FDA', 'FTC Consumer Advice'],
    sourceUrl: 'https://www.fda.gov/consumers/health-fraud-scams',
  },
  {
    name: 'Miracle Cure Supplement Scam',
    slug: 'miracle-cure-supplement-scam',
    description:
      'Aggressive online ads promise a supplement that cures or reverses a serious condition, often using fake testimonials and a fabricated doctor\'s endorsement, enrolling buyers in unwanted recurring subscription charges.',
    categorySlug: 'healthcare-fraud',
    alertLevel: 'medium',
    sources: ['FDA', 'FTC Consumer Advice'],
    sourceUrl: 'https://www.fda.gov/consumers/health-fraud-scams',
  },
  {
    name: 'Fake Health Insurance Marketplace Navigator',
    slug: 'fake-health-insurance-marketplace-navigator',
    description:
      'During open enrollment, someone posing as an official ACA marketplace "navigator" signs victims up for a fake or wildly misrepresented health plan to collect a commission, leaving the victim uninsured or under-insured without realizing it.',
    categorySlug: 'healthcare-fraud',
    alertLevel: 'high',
    sources: ['HealthCare.gov', 'FTC Consumer Advice'],
    sourceUrl: 'https://www.healthcare.gov/protect-from-fraud-and-scams/',
  },

  // New category: AI & Deepfake Scams
  {
    name: 'AI Voice Cloning "Grandchild in Trouble" Call',
    slug: 'ai-voice-cloning-grandchild-call',
    description:
      'A scammer uses a short AI-cloned sample of a family member\'s voice, often pulled from social media video, to make a panicked call claiming to be in jail or a hospital, needing immediate money. The voice sounds convincingly real even to close family.',
    categorySlug: 'ai-deepfake-scams',
    alertLevel: 'critical',
    sources: ['FTC Consumer Advice', 'FBI IC3'],
    sourceUrl: 'https://consumer.ftc.gov/consumer-alerts/2024/04/fighting-back-against-harmful-voice-cloning',
  },
  {
    name: 'Deepfake Video Call CEO Fraud',
    slug: 'deepfake-video-call-ceo-fraud',
    description:
      'Building on traditional business email compromise, a scammer uses real-time deepfake video and audio to impersonate a company executive on a live video call, instructing an employee to make an urgent wire transfer — a real case in Hong Kong cost a firm over $25 million.',
    categorySlug: 'ai-deepfake-scams',
    alertLevel: 'critical',
    sources: ['FBI IC3'],
    sourceUrl: 'https://www.ic3.gov/PSA/2022/PSA220216',
  },
  {
    name: 'AI-Generated Fake News Investment Endorsement',
    slug: 'ai-fake-news-investment-endorsement',
    description:
      'A fabricated news article or video, styled to look like a legitimate outlet, uses an AI-generated clip of a well-known public figure "endorsing" an investment platform that is entirely fraudulent.',
    categorySlug: 'ai-deepfake-scams',
    alertLevel: 'high',
    sources: ['U.S. Securities and Exchange Commission', 'FTC Consumer Advice'],
    sourceUrl: 'https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-alerts/artificial-intelligence-fraud',
  },
  {
    name: 'AI Chatbot Romance Scam',
    slug: 'ai-chatbot-romance-scam',
    description:
      'Instead of, or alongside, a human scammer, an AI chatbot conducts a highly personalized, always-available romantic relationship with a victim over weeks or months, eventually steering the conversation toward a request for money or a fraudulent investment.',
    categorySlug: 'ai-deepfake-scams',
    alertLevel: 'high',
    sources: ['FTC Consumer Advice'],
    sourceUrl: 'https://consumer.ftc.gov/consumer-alerts/2024/04/fighting-back-against-harmful-voice-cloning',
  },
  {
    name: 'Deepfake Job Interview Fraudulent Candidate',
    slug: 'deepfake-job-interview-fraudulent-candidate',
    description:
      'On the flip side of consumer scams, fraudulent job applicants use real-time deepfake video during remote interviews to fraudulently obtain employment, sometimes at companies with access to sensitive data, under a false identity.',
    categorySlug: 'ai-deepfake-scams',
    alertLevel: 'medium',
    sources: ['FBI IC3', 'CISA'],
    sourceUrl: 'https://www.ic3.gov/PSA/2022/psa220628',
  },

  // New category: Debt Relief Scams
  {
    name: 'Upfront-Fee Debt Settlement Scam',
    slug: 'upfront-fee-debt-settlement-scam',
    description:
      'A company promises to negotiate down credit card debt in exchange for a large upfront fee, then does little or no real negotiation. Federal law actually prohibits debt-settlement companies from charging fees before they\'ve settled a debt.',
    categorySlug: 'debt-relief-scams',
    alertLevel: 'high',
    sources: ['FTC Consumer Advice', 'CFPB'],
    sourceUrl: 'https://consumer.ftc.gov/all-scams/debt-credit-scams',
  },
  {
    name: 'Fake Student Loan Forgiveness Program',
    slug: 'fake-student-loan-forgiveness-program',
    description:
      'A caller or ad claims a government loan-forgiveness program requires an upfront "processing fee" or the borrower\'s Federal Student Aid ID and password to enroll. Real federal loan forgiveness programs are always free to apply for.',
    categorySlug: 'debt-relief-scams',
    alertLevel: 'high',
    sources: ['U.S. Department of Education', 'FTC Consumer Advice'],
    sourceUrl: 'https://studentaid.gov/articles/avoid-student-loan-forgiveness-scams/',
  },
  {
    name: 'Credit Repair "New Identity" Scam',
    slug: 'credit-repair-new-identity-scam',
    description:
      'A company sells a legally obtained but fraudulently used Credit Privacy Number (CPN), suggesting a client use it in place of their Social Security number to "start fresh." Using a CPN this way is federal fraud, and the client — not the company — bears the legal risk.',
    categorySlug: 'debt-relief-scams',
    alertLevel: 'high',
    sources: ['FTC Consumer Advice', 'CFPB'],
    sourceUrl: 'https://consumer.ftc.gov/all-scams/debt-credit-scams',
  },
  {
    name: 'Fake Debt Collector Threatening Call',
    slug: 'fake-debt-collector-threatening-call',
    description:
      'A caller claiming to be a debt collector, sometimes citing a real, sold-off old debt or one that doesn\'t exist at all, threatens arrest or wage garnishment unless paid immediately via gift card or wire. Legitimate collectors must provide written validation of a debt on request and cannot threaten arrest.',
    categorySlug: 'debt-relief-scams',
    alertLevel: 'high',
    sources: ['CFPB', 'FTC Consumer Advice'],
    sourceUrl: 'https://www.consumerfinance.gov/ask-cfpb/what-is-a-debt-relief-program-and-how-do-i-know-if-i-should-use-one-en-1457/',
  },
  {
    name: 'Timeshare Exit Company Scam',
    slug: 'timeshare-exit-company-scam',
    description:
      'A company promises to get a consumer out of an unwanted timeshare contract for a large upfront fee, then does little or nothing, sometimes leaving the consumer both out the fee and still contractually obligated to the timeshare.',
    categorySlug: 'timeshare-scams',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice', 'BBB Scam Tracker'],
    sourceUrl: 'https://consumer.ftc.gov/consumer-alerts/2022/11/want-get-rid-your-timeshare-read-you-hire-someone-help',
  },
  {
    name: 'Timeshare Resale Scam',
    slug: 'timeshare-resale-scam',
    description:
      'A company cold-calls a timeshare owner claiming to have a buyer already lined up, or that demand is unusually high right now, and asks for an upfront "registration," closing, or processing fee — commonly $500 to $2,000, sometimes charged straight to a credit card — before any sale can go through. The promised buyer never materializes, and the fee is rarely refunded even when the company claims a money-back guarantee.',
    categorySlug: 'timeshare-scams',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice'],
    sourceUrl: 'https://consumer.ftc.gov/consumer-alerts/2014/05/be-lookout-timeshare-resale-phonies',
  },

  // New category: Mortgage & Foreclosure Scams
  {
    name: 'Foreclosure Rescue Fee Scam',
    slug: 'foreclosure-rescue-fee-scam',
    description:
      'A company contacts a homeowner in default promising to stop foreclosure in exchange for an upfront fee, then does no real work. Actual HUD-approved housing counseling is free.',
    categorySlug: 'mortgage-foreclosure-scams',
    alertLevel: 'high',
    sources: ['HUD', 'FTC Consumer Advice'],
    sourceUrl: 'https://www.hud.gov/helping-americans/prevent-loan-scams',
  },
  {
    name: 'Fake Loan Modification Company',
    slug: 'fake-loan-modification-company',
    description:
      'A company impersonates or claims a special relationship with the homeowner\'s actual mortgage lender, collects modification "processing fees," and never actually submits any paperwork to the real servicer.',
    categorySlug: 'mortgage-foreclosure-scams',
    alertLevel: 'high',
    sources: ['CFPB', 'FTC Consumer Advice'],
    sourceUrl: 'https://www.consumerfinance.gov/consumer-tools/mortgages/how-to-spot-and-avoid-foreclosure-relief-scams/',
  },
  {
    name: 'Rent-Back Deed Transfer Scam',
    slug: 'rent-back-deed-transfer-scam',
    description:
      'A scammer convinces a homeowner facing foreclosure to sign over the deed with a promise they can rent the home and buy it back later. The fine print often lets the new "owner" evict them immediately or resets the deal on unaffordable terms.',
    categorySlug: 'mortgage-foreclosure-scams',
    alertLevel: 'critical',
    sources: ['HUD', 'FTC Consumer Advice'],
    sourceUrl: 'https://www.hud.gov/helping-americans/prevent-loan-scams',
  },
  {
    name: 'Fake Mortgage Payoff Wire Fraud',
    slug: 'fake-mortgage-payoff-wire-fraud',
    description:
      'Similar to closing wire fraud, a scammer who has compromised a title or escrow company\'s email sends fraudulent payoff wire instructions during a refinance, redirecting funds meant to pay off the old mortgage.',
    categorySlug: 'mortgage-foreclosure-scams',
    alertLevel: 'critical',
    sources: ['FBI IC3'],
    sourceUrl: 'https://www.ic3.gov/PSA/2018/PSA180712',
  },
  {
    name: 'Reverse Mortgage Counseling Fee Scam',
    slug: 'reverse-mortgage-counseling-fee-scam',
    description:
      'A company falsely claims to be the government-required independent counselor for a reverse mortgage and charges a large fee for a session that federal law requires be low-cost or free through a HUD-approved agency.',
    categorySlug: 'mortgage-foreclosure-scams',
    alertLevel: 'medium',
    sources: ['HUD', 'CFPB'],
    sourceUrl: 'https://www.hud.gov/helping-americans/prevent-loan-scams',
  },

  // New category: Tax Scams
  {
    name: 'Fake IRS Phone Threat',
    slug: 'fake-irs-phone-threat',
    description:
      'A caller impersonating the IRS demands immediate payment, often via gift card or wire, for supposedly owed back taxes, threatening arrest or license revocation. The real IRS first contacts taxpayers by mail, not by surprise phone call.',
    categorySlug: 'tax-scams',
    alertLevel: 'critical',
    sources: ['IRS', 'FTC Consumer Advice'],
    sourceUrl: 'https://www.irs.gov/newsroom/dirty-dozen',
  },
  {
    name: 'Ghost Tax Preparer Scam',
    slug: 'ghost-tax-preparer-scam',
    description:
      'An unlicensed preparer files a client\'s return, promises an inflated refund by fabricating deductions or credits, charges a fee based on the refund size, and doesn\'t sign the return as the preparer — leaving the taxpayer solely liable when the IRS flags it.',
    categorySlug: 'tax-scams',
    alertLevel: 'high',
    sources: ['IRS'],
    sourceUrl: 'https://www.irs.gov/newsroom/dirty-dozen',
  },
  {
    name: 'Fraudulent Tax Refund Identity Theft',
    slug: 'fraudulent-tax-refund-identity-theft',
    description:
      "A scammer files a fraudulent tax return using a victim's stolen Social Security number early in tax season to claim the refund before the real taxpayer files, discovered only when the real return is rejected as a duplicate.",
    categorySlug: 'tax-scams',
    alertLevel: 'high',
    sources: ['IRS', 'FTC Consumer Advice'],
    sourceUrl: 'https://www.irs.gov/newsroom/dirty-dozen',
  },
  {
    name: 'Fake IRS Refund Text or Email',
    slug: 'fake-irs-refund-text-email',
    description:
      'A message claims a tax refund is pending and asks the recipient to click a link and enter bank details to receive it faster. The IRS does not initiate contact by email or text about refunds.',
    categorySlug: 'tax-scams',
    alertLevel: 'medium',
    sources: ['IRS'],
    sourceUrl: 'https://www.irs.gov/newsroom/dirty-dozen',
  },
  {
    name: 'Employee Retention Credit Mill Scam',
    slug: 'employee-retention-credit-mill-scam',
    description:
      'Aggressive ads and calls push businesses to claim a since-tightened pandemic-era tax credit through a "specialist" who charges a large contingency fee, encouraging claims the business doesn\'t actually qualify for and leaving the business liable for repayment plus penalties.',
    categorySlug: 'tax-scams',
    alertLevel: 'high',
    sources: ['IRS'],
    sourceUrl: 'https://www.irs.gov/newsroom/dirty-dozen',
  },

  // Historical entries: real, well-documented frauds with no current
  // threat level (hence no alertLevel), included to make good on the
  // original goal of covering scam history, not just active patterns.
  // Facts checked against the sources listed on each entry.
  {
    name: 'The South Sea Bubble',
    slug: 'south-sea-bubble-1720',
    description:
      'The South Sea Company was granted a British trade monopoly with South America in exchange for absorbing part of the national debt. Directors inflated the stock through bribery and self-dealing rather than real trade revenue, driving the price from around £128 in January 1720 to over £1,000 by August — before it collapsed to under £200 by December, wiping out investors across British society, reportedly including Isaac Newton. The scandal led to a parliamentary investigation and the seizure of directors\' estates, and remains one of the earliest well-documented examples of a market propped up by fraud rather than fundamentals.',
    categorySlug: 'investment-fraud',
    sources: ['Encyclopaedia Britannica', 'UK Parliament archives'],
    sourceUrl: 'https://www.britannica.com/money/South-Sea-Bubble',
    country: 'GB',
    isHistorical: true,
    firstRecorded: '1720-01-01',
  },
  {
    name: 'The Poyais Scheme',
    slug: 'poyais-scheme-1822',
    description:
      'Scottish soldier Gregor MacGregor returned to Britain in 1821 claiming to be "Cazique" of Poyais, a prosperous Central American territory he invented out of whole cloth. He sold land certificates and government bonds worth roughly £200,000, and recruited settlers with a fabricated guidebook describing a developed colony. About 250 emigrants sailed for Poyais in 1822–23 and found only uninhabited jungle; more than half died before rescue. MacGregor was never successfully prosecuted and later ran smaller versions of the same scheme.',
    categorySlug: 'investment-fraud',
    sources: ['Encyclopaedia Britannica', 'Historic UK'],
    sourceUrl: 'https://www.britannica.com/story/the-craziest-scam-gregor-macgregor-creates-his-own-country',
    country: 'GB',
    isHistorical: true,
    firstRecorded: '1822-01-01',
  },
  {
    name: 'The Great Diamond Hoax of 1872',
    slug: 'great-diamond-hoax-1872',
    description:
      'Prospectors Philip Arnold and John Slack salted a claimed diamond field in the Wyoming/Colorado territory with real but low-value industrial diamonds and gemstones bought elsewhere, then let investors "discover" them during a staged site visit. San Francisco financiers, including the Bank of California\'s William Ralston, formed a mining company and paid the pair roughly $600,000 (worth many millions today) for their claim. The fraud unraveled when U.S. government geologist Clarence King independently surveyed the site and found gems in geologically impossible combinations and locations — exposing the whole scheme within weeks of the deal closing.',
    categorySlug: 'investment-fraud',
    sources: ['Smithsonian Magazine', 'U.S. Geological Survey history'],
    sourceUrl: 'https://www.smithsonianmag.com/history/the-great-diamond-hoax-of-1872-2630188/',
    country: 'US',
    isHistorical: true,
    firstRecorded: '1872-01-01',
  },
  {
    name: 'The Tichborne Claimant',
    slug: 'tichborne-claimant-1866',
    description:
      'When Sir Roger Tichborne, heir to an English baronetcy, was lost at sea in 1854, his mother refused to accept his death. In 1866, a butcher from Wagga Wagga, Australia — later identified as Arthur Orton — came forward claiming to be Roger, despite bearing little physical resemblance and lacking Roger\'s fluent French. Orton pursued the claim through a civil trial (1871–72) and a criminal perjury trial (1873–74), both drawing huge public attention, before being convicted and sentenced to 14 years. He maintained the claim for decades and was buried under the name "Sir Roger Tichborne" in 1898, despite a confession in between.',
    categorySlug: 'identity-theft',
    sources: ['Encyclopaedia Britannica', 'UK National Archives'],
    country: 'GB',
    isHistorical: true,
    firstRecorded: '1866-01-01',
  },
  {
    name: 'Cassie Chadwick\'s Carnegie Heiress Fraud',
    slug: 'cassie-chadwick-carnegie-fraud-1904',
    description:
      'Between 1897 and 1904, Cassie Chadwick convinced multiple Ohio banks she was Andrew Carnegie\'s secret illegitimate daughter, using a forged $2 million promissory note as fabricated proof to secure enormous loans against a fortune she never had. Banks competed to lend to her quietly, hoping to earn her favor (and Carnegie\'s business) without asking questions. The scheme collapsed in 1904 when a lender sued to recover an unpaid loan; she was convicted of conspiracy in 1905 and died in prison in 1907.',
    categorySlug: 'identity-theft',
    sources: ['Smithsonian Magazine', 'Ohio History Connection'],
    sourceUrl: 'https://www.smithsonianmag.com/history/the-high-priestess-of-fraudulent-finance-45/',
    country: 'US',
    isHistorical: true,
    firstRecorded: '1897-01-01',
  },
  {
    name: 'The Great Salad Oil Swindle',
    slug: 'great-salad-oil-swindle-1963',
    description:
      'Commodities trader Anthony "Tino" De Angelis borrowed hundreds of millions of dollars against warehouse receipts for vegetable oil inventory that mostly didn\'t exist — storage tanks were filled largely with seawater, topped with a thin layer of real oil to fool inspectors. American Express\'s field warehousing subsidiary had certified the (fake) inventory as collateral, and when the fraud collapsed in late 1963 it caused over $180 million in losses across American Express, Bank of America, and other lenders, and contributed to a stock market dip that coincided with the week of President Kennedy\'s assassination. De Angelis served seven years in prison.',
    categorySlug: 'investment-fraud',
    sources: ['U.S. Securities and Exchange Commission history', 'The Wall Street Journal (Pulitzer Prize-winning coverage)'],
    sourceUrl: 'https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins',
    country: 'US',
    isHistorical: true,
    firstRecorded: '1963-01-01',
  },
  {
    name: 'The Mississippi Bubble',
    slug: 'mississippi-bubble-1720',
    description:
      'Scottish financier John Law convinced France\'s regent to let him establish a national bank issuing paper currency, then merged it with the Compagnie d\'Occident, granted a monopoly over French trade with Louisiana and the Mississippi valley. Speculative buying drove shares from 500 to 10,000 livres between January and December 1719, before Law\'s bank — which had printed roughly five times more paper money than it held in gold — collapsed under a wave of redemptions in 1720. Law was dismissed as France\'s Controller General and fled the country; the collapse contributed to French distrust of paper money and banks for generations.',
    categorySlug: 'investment-fraud',
    sources: ['Encyclopaedia Britannica', 'Federal Reserve Bank of New York (Liberty Street Economics)'],
    sourceUrl: 'https://www.britannica.com/money/Mississippi-Bubble',
    country: 'FR',
    isHistorical: true,
    firstRecorded: '1720-01-01',
  },
  {
    name: 'The Whiskey Ring',
    slug: 'whiskey-ring-1875',
    description:
      'From 1871 to 1875, a network of whiskey distillers bribed federal tax collectors and Treasury officials — mainly centered in St. Louis — to certify far less liquor production than was actually distilled, letting them dodge most of the 70-cents-per-gallon federal excise tax and split the stolen revenue. Treasury Secretary Benjamin Bristow ran a secret investigation that broke the ring open in 1875, leading to 238 indictments and 110 convictions; President Ulysses S. Grant\'s own personal secretary, Orville Babcock, was indicted (and acquitted after Grant\'s testimony), badly damaging the administration\'s reputation.',
    categorySlug: 'tax-scams',
    sources: ['Encyclopaedia Britannica', 'U.S. National Archives'],
    sourceUrl: 'https://www.britannica.com/money/Whiskey-Ring',
    country: 'US',
    isHistorical: true,
    firstRecorded: '1875-01-01',
  },
  {
    name: 'John R. Brinkley\'s "Goat Gland" Medical Fraud',
    slug: 'brinkley-goat-gland-fraud-1922',
    description:
      'John R. Brinkley, who held no accredited medical education, built a fortune in Kansas performing a bogus surgical procedure claiming to cure impotence by transplanting goat testicle tissue into human patients, at fees up to $1,500. He used his own powerful radio station to advertise the procedure and prescribe medications over the air, reaching enormous audiences until the Federal Radio Commission pulled his U.S. broadcast license in 1930 (he then broadcast from a station in Mexico, out of American regulators\' reach). A 1938 exposé in the Journal of the American Medical Association documented patient deaths and injuries, and Brinkley lost a resulting libel suit, which triggered a wave of malpractice claims that bankrupted him.',
    categorySlug: 'healthcare-fraud',
    sources: ['Encyclopaedia Britannica', 'Journal of the American Medical Association archives'],
    country: 'US',
    isHistorical: true,
    firstRecorded: '1922-01-01',
  },
  {
    name: 'Ivar Kreuger\'s "Match King" Fraud',
    slug: 'ivar-kreuger-match-king-fraud-1932',
    description:
      'Swedish industrialist Ivar Kreuger built a global monopoly on match production, becoming one of the world\'s largest lenders to governments in the 1920s by loaning them money in exchange for match-sale monopolies in their countries. To keep raising capital, he ran what forensic auditors later determined was a vast pyramid scheme, hiding fictitious assets and forged bonds across a maze of over 400 subsidiary companies. Kreuger died by suicide in Paris in March 1932 as the scheme unraveled; the collapse of Kreuger & Toll was, at the time, one of the largest corporate frauds in history and was a direct catalyst for the U.S. Securities Act of 1933.',
    categorySlug: 'investment-fraud',
    sources: ['Harvard Business School archives', 'Encyclopaedia Britannica'],
    sourceUrl: 'https://www.britannica.com/money/Ivar-Kreuger',
    country: 'SE',
    isHistorical: true,
    firstRecorded: '1929-01-01',
  },
  {
    name: 'The Panama Canal Lottery Bond Scandal',
    slug: 'panama-canal-lottery-bond-scandal-1892',
    description:
      'The French company building the Panama Canal, led by Ferdinand de Lesseps (celebrated for completing the Suez Canal), ran catastrophically over budget and turned to a lottery-bond scheme in 1888 to raise fresh capital from small French investors — roughly 800,000 of them. The company collapsed within a year, and a 1892 investigation revealed that company directors had bribed over a hundred members of the French parliament to approve the lottery loan. Ferdinand and Charles de Lesseps were convicted and sentenced to prison (Ferdinand\'s sentence was later overturned on a technicality due to his age and health), and the scandal remains one of the largest financial and political corruption cases in French history.',
    categorySlug: 'investment-fraud',
    sources: ['Encyclopaedia Britannica'],
    sourceUrl: 'https://www.britannica.com/event/Panama-Scandal',
    country: 'FR',
    isHistorical: true,
    firstRecorded: '1888-01-01',
  },
  {
    name: 'Robert Vesco\'s IOS Mutual Fund Fraud',
    slug: 'robert-vesco-ios-fraud-1973',
    description:
      'Robert Vesco took control of the Swiss-based Investors Overseas Services (IOS), a sprawling "fund of funds" that sold mutual fund investments to expatriates and international investors worldwide, and looted it by directing its funds into a web of banks and shell companies he secretly owned. As SEC investigators closed in during February 1973, Vesco fled the United States aboard a corporate jet with an estimated $200 million of investor money, eventually renouncing his citizenship and spending decades evading extradition in countries like Costa Rica, Nicaragua, and finally Cuba, where he died in 2007.',
    categorySlug: 'investment-fraud',
    sources: ['Encyclopaedia Britannica', 'U.S. Securities and Exchange Commission history'],
    sourceUrl: 'https://www.britannica.com/biography/Robert-L-Vesco',
    country: 'US',
    isHistorical: true,
    firstRecorded: '1971-01-01',
  },
  {
    name: 'Fake "Suspicious Login" Verification Code Request',
    slug: 'fake-suspicious-login-code-phishing-text',
    description:
      'A text claims suspicious activity on your account and asks you to reply with the verification code you\'re about to receive — in reality, the scammer is triggering a real password reset or login attempt on your actual account at that exact moment, and tricking you into handing over the one-time code that would let them in. Never share a verification code with anyone, even someone claiming to be from the company\'s own security team.',
    categorySlug: 'account-takeover',
    alertLevel: 'high',
    sources: ['FTC Consumer Advice'],
    sourceUrl: 'https://consumer.ftc.gov/articles/how-recover-your-hacked-email-or-social-media-account',
  },
  {
    name: 'Port-Out Fraud via Stolen Personal Information',
    slug: 'port-out-number-fraud',
    description:
      'Using personal information obtained from a data breach or phishing, a scammer contacts your mobile carrier and requests to port your phone number to a new SIM or device they control, without ever visiting a store in person. Once the port completes, they receive your calls and SMS-based two-factor codes, letting them reset passwords on banking and email accounts. Setting a carrier account PIN is one of the few defenses against this.',
    categorySlug: 'account-takeover',
    alertLevel: 'high',
    sources: ['FCC Consumer Guides', 'FTC Consumer Advice'],
    sourceUrl: 'https://www.fcc.gov/general/frauds-scams-and-alerts-guides',
  },
  {
    name: 'Account Takeover via Reused Password from an Unrelated Breach',
    slug: 'reused-password-breach-account-takeover',
    description:
      'After a large, unrelated company suffers a data breach, criminals test the leaked email-and-password combinations against banking, email, and shopping sites at automated scale. Anyone who reused the same password on one of those other services can have accounts taken over within days of a breach making headlines, even if they were never a customer of the breached company. A unique password per site is the direct defense.',
    categorySlug: 'account-takeover',
    alertLevel: 'high',
    sources: ['FBI IC3'],
    sourceUrl: 'https://www.ic3.gov/CSA/2020/200929-1.pdf',
  },
  {
    name: 'OAuth App Consent Phishing',
    slug: 'oauth-consent-phishing-attack',
    description:
      'Instead of stealing a password directly, a scammer sends a link to a real Microsoft or Google sign-in page asking you to "allow" a malicious third-party app to access your email and files. Because the login page itself is genuine, the request can bypass phishing filters and even multi-factor authentication — victims grant a token that keeps working until it is manually revoked. Periodically reviewing and removing unfamiliar "connected apps" is the main defense.',
    categorySlug: 'account-takeover',
    alertLevel: 'medium',
    sources: ['CISA'],
    sourceUrl: 'https://www.cisa.gov/',
  },
  {
    name: 'Fake Two-Factor Authentication "Reset" Support Call',
    slug: 'fake-2fa-reset-support-call',
    description:
      'A scammer calls posing as account security support, claiming your two-factor authentication needs to be "reset" or "verified" due to suspicious activity, then walks the victim through disabling their own 2FA or reading back a reset code — the opposite of what real support would ever ask a customer to do. Legitimate providers never ask a customer to disable their own security features over the phone.',
    categorySlug: 'account-takeover',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice'],
    sourceUrl: 'https://consumer.ftc.gov/articles/how-recover-your-hacked-email-or-social-media-account',
  },
  {
    name: 'AI-Cloned Executive Voice Wire-Approval Call',
    slug: 'ai-voice-clone-executive-approval-call',
    description:
      'A short public recording of an executive\'s voice — from an earnings call, conference talk, or podcast — is fed into AI voice-cloning software to generate a convincing phone call approving an urgent wire transfer or gift card purchase, adding a live "voice" to a business email compromise scheme that once relied on text alone. Any unusual payment request, even one that sounds like a recognized voice on the phone, should be confirmed through a separate, previously known contact method.',
    categorySlug: 'ai-deepfake-scams',
    alertLevel: 'high',
    sources: ['FBI IC3'],
    sourceUrl: 'https://www.ic3.gov/PSA/2024/PSA241203',
  },
  {
    name: 'AI Face-Swap Blackmail Video',
    slug: 'ai-face-swap-blackmail-video',
    description:
      'Ordinary photos scraped from a target\'s public social media profile are fed into face-swap AI tools to generate a fabricated explicit video, which is then sent to the victim — or threatened to be sent to their contacts — demanding payment to prevent release. Because the underlying photos are real but the video is entirely fabricated, victims may not immediately recognize it as fake. Reporting to the platform and law enforcement, not paying, is the recommended response.',
    categorySlug: 'ai-deepfake-scams',
    alertLevel: 'critical',
    sources: ['FBI IC3', 'National Center for Missing & Exploited Children'],
    sourceUrl: 'https://www.ic3.gov/PSA/2023/psa230605',
  },
  {
    name: 'AI-Generated Celebrity Health Product Endorsement Ad',
    slug: 'ai-celebrity-health-product-endorsement-ad',
    description:
      'A short AI-generated video clip shows a recognizable celebrity or news anchor appearing to endorse a weight-loss pill, supplement, or "miracle" health product, run as a paid social media ad. The celebrity has no actual connection to the product; the clip is fabricated from public footage. Checking whether the celebrity or their verified accounts have addressed the ad directly is a quick way to confirm it is fake.',
    categorySlug: 'ai-deepfake-scams',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice'],
    sourceUrl: 'https://consumer.ftc.gov/consumer-alerts/2024/04/fighting-back-against-harmful-voice-cloning',
  },
  {
    name: 'AI-Cloned Voicemail Urgent Callback Scam',
    slug: 'ai-cloned-voicemail-callback-scam',
    description:
      'Rather than a live call, a scammer leaves a short AI-generated voicemail cloned to sound like a family member in distress, asking for an urgent callback to a number that is not the family member\'s real one. The pre-recorded, one-way format lets scammers run many attempts at once and avoids the risk of a live conversation exposing inconsistencies. Always call the family member back at their known number, never one left in the message.',
    categorySlug: 'ai-deepfake-scams',
    alertLevel: 'high',
    sources: ['FTC Consumer Advice'],
    sourceUrl: 'https://consumer.ftc.gov/consumer-alerts/2024/04/fighting-back-against-harmful-voice-cloning',
  },
  {
    name: 'AI-Generated Fake Investment Company Website',
    slug: 'ai-generated-fake-investment-company-website',
    description:
      'Scammers use AI tools to quickly generate a professional-looking corporate website, complete with fabricated leadership bios, fake press mentions, and AI-written "research reports," lending instant legitimacy to an investment pitch that would once have taken months to fake convincingly. A polished site is no longer a reliable sign of legitimacy — checking a firm\'s actual registration with the SEC or FINRA remains necessary regardless of how professional the site looks.',
    categorySlug: 'ai-deepfake-scams',
    alertLevel: 'high',
    sources: ['SEC Office of Investor Education and Advocacy'],
    sourceUrl: 'https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-alerts/artificial-intelligence-fraud',
  },
  {
    name: 'Fake Debt Validation Letter Scam',
    slug: 'fake-debt-validation-letter-scam',
    description:
      'A letter designed to look like an official debt collection notice demands immediate payment on a debt that may not be owed, may already be paid, or may not exist at all — often for a small enough amount that recipients pay rather than dispute it. Under the Fair Debt Collection Practices Act, you can request written validation of any debt before paying, and a real collector must provide it.',
    categorySlug: 'debt-relief-scams',
    alertLevel: 'medium',
    sources: ['Consumer Financial Protection Bureau'],
    sourceUrl: 'https://www.consumerfinance.gov/ask-cfpb/what-is-a-debt-relief-program-and-how-do-i-know-if-i-should-use-one-en-1457/',
  },
  {
    name: 'Fake Wage Garnishment Notice Scam',
    slug: 'fake-wage-garnishment-notice-scam',
    description:
      'A caller or letter claims a court has already ordered your wages garnished over unpaid debt and demands an immediate payment or "processing fee" to stop it, relying on the fact that most people don\'t know real wage garnishment requires a court judgment and prior notice through the court system, not a phone call. Verify any garnishment claim directly with your local court, never through contact information the caller provides.',
    categorySlug: 'debt-relief-scams',
    alertLevel: 'high',
    sources: ['Consumer Financial Protection Bureau', 'FTC Consumer Advice'],
    sourceUrl: 'https://www.consumerfinance.gov/ask-cfpb/what-is-a-debt-relief-program-and-how-do-i-know-if-i-should-use-one-en-1457/',
  },
  {
    name: 'Debt Relief "Pay Us Instead of Your Creditors" Scam',
    slug: 'debt-relief-escrow-account-scam',
    description:
      'A debt settlement company instructs customers to stop paying creditors directly and instead deposit monthly payments into a dedicated "settlement" account the company controls, promising to negotiate reduced payoffs — while collecting high upfront fees and, in fraudulent cases, simply keeping the deposited funds without ever contacting creditors. Federal rules prohibit debt-settlement companies from collecting most fees before actually settling a debt.',
    categorySlug: 'debt-relief-scams',
    alertLevel: 'high',
    sources: ['FTC Consumer Advice'],
    sourceUrl: 'https://consumer.ftc.gov/all-scams/debt-credit-scams',
  },
  {
    name: 'Advance-Fee Debt Consolidation Loan Scam',
    slug: 'advance-fee-debt-consolidation-loan-scam',
    description:
      'A company promises a guaranteed debt-consolidation loan regardless of credit history, but requires an upfront "processing," "insurance," or "collateral" fee before funding — the loan never materializes and the fee is not returned. A legitimate lender deducts its fees from loan proceeds rather than requiring payment before approval.',
    categorySlug: 'debt-relief-scams',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice'],
    sourceUrl: 'https://consumer.ftc.gov/all-scams/debt-credit-scams',
  },
  {
    name: 'Fake Credit Card Interest Rate Reduction Robocall',
    slug: 'fake-credit-card-interest-reduction-robocall',
    description:
      'A robocall claims to be able to lower your credit card interest rate through a "special program," but first requires your card number "to verify eligibility" or an upfront enrollment fee. No such universal program exists — the requested card number is used for unauthorized charges rather than any real rate negotiation. Rate negotiations happen directly with your card issuer, not a third-party robocall.',
    categorySlug: 'debt-relief-scams',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice'],
    sourceUrl: 'https://consumer.ftc.gov/all-scams/debt-credit-scams',
  },
  {
    name: 'Fake Life Insurance Beneficiary Change Scam',
    slug: 'fake-life-insurance-beneficiary-change-scam',
    description:
      'Someone impersonating an insurance agent contacts a policyholder, often an elderly one, claiming a routine "beneficiary verification" is required, and uses the call to redirect the policy\'s beneficiary designation to the scammer or an accomplice. Any beneficiary change should be confirmed directly with the insurer using a phone number from a genuine statement, never one provided by the caller.',
    categorySlug: 'insurance-fraud',
    alertLevel: 'high',
    sources: ['National Association of Insurance Commissioners'],
    sourceUrl: 'https://content.naic.org/insurance-topics/insurance-fraud',
  },
  {
    name: 'Insurance "Assignment of Benefits" Contractor Scam',
    slug: 'insurance-assignment-of-benefits-contractor-scam',
    description:
      'A door-to-door contractor convinces a homeowner to sign an "assignment of benefits" form after a storm, transferring the homeowner\'s right to insurance payment directly to the contractor — who may then inflate repair estimates, file claims without the homeowner\'s ongoing input, or disappear after receiving payment before completing repairs. Homeowners should read any document fully before signing and can request time to review it with their insurer first.',
    categorySlug: 'insurance-fraud',
    alertLevel: 'medium',
    sources: ['National Association of Insurance Commissioners', 'FTC Consumer Advice'],
    sourceUrl: 'https://content.naic.org/insurance-topics/insurance-fraud',
  },
  {
    name: 'Fake Rideshare Driver Commercial Insurance Scam',
    slug: 'fake-rideshare-driver-insurance-scam',
    description:
      'A caller or online ad targets rideshare and delivery drivers with a "special commercial coverage" policy claimed to be required to keep driving for the platform, priced attractively but never actually filed with a state insurance regulator and unable to pay a real claim. Drivers should verify commercial auto coverage requirements directly with their platform and confirm any insurer\'s license with their state\'s department of insurance.',
    categorySlug: 'insurance-fraud',
    alertLevel: 'medium',
    sources: ['National Association of Insurance Commissioners'],
    sourceUrl: 'https://content.naic.org/insurance-topics/insurance-fraud',
  },
  {
    name: 'Fake Short-Term Health Plan Sold as ACA-Compliant',
    slug: 'fake-short-term-health-plan-scam',
    description:
      'A plan is marketed using language that implies full Affordable Care Act compliance and comprehensive coverage, but is actually a limited-duration short-term plan that excludes pre-existing conditions and caps payouts — leaving buyers with large uncovered medical bills a compliant marketplace plan would have paid. Confirming a plan\'s actual status directly on healthcare.gov before enrolling is the safest check.',
    categorySlug: 'insurance-fraud',
    alertLevel: 'medium',
    sources: ['Centers for Medicare & Medicaid Services', 'FTC Consumer Advice'],
    sourceUrl: 'https://www.cms.gov/medicare/medicaid-coordination/center-program-integrity/reporting-fraud',
  },
  {
    name: 'Fake Property Tax Deed Sale "Rescue" Scam',
    slug: 'fake-property-tax-deed-rescue-scam',
    description:
      'Homeowners behind on property taxes are approached by someone offering to "save" their home from an upcoming tax deed sale by taking over the deed temporarily and handling payments, in exchange for the homeowner signing over the property title — after which the homeowner is evicted or the promised repayment never happens. Legitimate tax-delinquency relief goes through the county tax office or a licensed attorney, not a stranger offering to hold the deed.',
    categorySlug: 'mortgage-foreclosure-scams',
    alertLevel: 'high',
    sources: ['Consumer Financial Protection Bureau'],
    sourceUrl: 'https://www.consumerfinance.gov/consumer-tools/mortgages/how-to-spot-and-avoid-foreclosure-relief-scams/',
  },
  {
    name: 'Fake HOA Delinquency Lien Payoff Scam',
    slug: 'fake-hoa-delinquency-payoff-scam',
    description:
      'A letter or call claims a homeowner\'s association has placed a lien for unpaid dues and demands immediate payment to a third-party "resolution service" to avoid foreclosure — bypassing the actual HOA management company entirely and pocketing the payment without resolving any real lien. Homeowners should confirm any HOA lien claim directly with their HOA\'s actual management company using contact information from a prior legitimate statement.',
    categorySlug: 'mortgage-foreclosure-scams',
    alertLevel: 'medium',
    sources: ['Consumer Financial Protection Bureau'],
    sourceUrl: 'https://www.consumerfinance.gov/consumer-tools/mortgages/how-to-spot-and-avoid-foreclosure-relief-scams/',
  },
  {
    name: 'Fake Federal Mortgage Modification Program Fee',
    slug: 'fake-federal-mortgage-modification-fee-scam',
    description:
      'A company claims to represent a federal mortgage modification program and requires an upfront fee to "process" the homeowner\'s application, though federal loan modification assistance is applied for directly through the loan servicer or HUD-approved housing counselors and does not charge homeowners fees. Any company demanding payment before providing mortgage relief services is violating federal rules.',
    categorySlug: 'mortgage-foreclosure-scams',
    alertLevel: 'medium',
    sources: ['Consumer Financial Protection Bureau', 'U.S. Department of Housing and Urban Development'],
    sourceUrl: 'https://www.consumerfinance.gov/consumer-tools/mortgages/how-to-spot-and-avoid-foreclosure-relief-scams/',
  },
  {
    name: 'Fake Law Enforcement Sextortion Threat',
    slug: 'fake-law-enforcement-sextortion-threat',
    description:
      'After obtaining or fabricating compromising images, a scammer poses as a police officer or federal investigator, claiming the victim is under investigation for a sex crime and demanding payment to make the "case" disappear — layering a fake legal threat on top of the original extortion to increase pressure and reduce the odds a victim seeks real law enforcement help. Real law enforcement never resolves a criminal investigation through a private payment.',
    categorySlug: 'sextortion',
    alertLevel: 'critical',
    sources: ['FBI IC3'],
    sourceUrl: 'https://www.ic3.gov/PSA/2023/psa230605',
  },
  {
    name: 'Compromised Dating App Video Call Sextortion',
    slug: 'compromised-dating-app-sextortion',
    description:
      'A scammer builds trust on a dating app and convinces a match to move to video chat, secretly recording the session (sometimes playing a pre-recorded clip of someone else to solicit compromising responses), then threatens to send the recording to the victim\'s contacts unless paid. Declining to move to video with someone not yet met in person, and reporting the account to the platform rather than paying, is the recommended response.',
    categorySlug: 'sextortion',
    alertLevel: 'critical',
    sources: ['FBI IC3'],
    sourceUrl: 'https://www.ic3.gov/PSA/2013/PSA130502.pdf',
  },
  {
    name: 'Sextortion Targeting Minors via Gaming Platforms',
    slug: 'gaming-platform-minor-sextortion',
    description:
      'A scammer poses as a peer on a gaming or messaging platform popular with teenagers, builds a quick rapport, and convinces the minor to share a compromising image, then immediately threatens to send it to the minor\'s friends and family unless paid or given more images. The FBI has specifically warned this pattern has driven both financial losses and, tragically, some victim suicides — reporting to NCMEC\'s CyberTipline and law enforcement immediately, without paying, is the recommended response.',
    categorySlug: 'sextortion',
    alertLevel: 'critical',
    sources: ['FBI IC3', 'National Center for Missing & Exploited Children'],
    sourceUrl: 'https://www.fbi.gov/news/press-releases/fbi-and-partners-issue-national-public-safety-alert-on-financial-sextortion-schemes',
  },
  {
    name: 'Fake Airline Flight Cancellation Rebooking Email',
    slug: 'fake-airline-flight-cancellation-phishing-email',
    description:
      'An email formatted to look like an airline notice claims your upcoming flight was canceled and asks you to click a link to rebook or request a refund, leading to a fake login page that harvests frequent-flyer credentials and payment details. Airlines notify real cancellations through their official app and the verified email on file — checking your booking directly on the airline\'s real site is the safer path.',
    categorySlug: 'phishing',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice'],
    sourceUrl: 'https://consumer.ftc.gov/articles/how-recognize-avoid-phishing-scams',
  },
  {
    name: 'Fake Browser Lock Screen Scam',
    slug: 'fake-browser-lockscreen-scam',
    description:
      'Visiting a compromised or malicious webpage triggers a full-screen popup that locks the browser and displays a fake warning claiming the device is infected or that law enforcement has detected illegal content, listing a phone number to call for "removal." The page is designed to be difficult to close and to panic the visitor into calling; force-closing the browser or restarting the device resolves it without ever needing to call the listed number.',
    categorySlug: 'tech-support-scams',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice'],
    sourceUrl: 'https://consumer.ftc.gov/articles/how-spot-avoid-and-report-tech-support-scams',
  },
  {
    name: 'Fake People-Search Site Data Removal Scam',
    slug: 'fake-people-search-data-removal-scam',
    description:
      'An email or ad claims your personal information was found exposed on a people-search or data-broker site and offers to remove it for a fee, while actually just linking to (or being) the very site collecting and reselling that data, or simply taking payment without removing anything. Most legitimate data brokers offer a free opt-out request process directly on their own site.',
    categorySlug: 'identity-theft',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice'],
    sourceUrl: 'https://consumer.ftc.gov/identity-theft-and-online-security/identity-theft',
  },
  {
    name: 'Fake Limited-Drop Sneaker or Collectible Resale Scam',
    slug: 'fake-limited-drop-resale-scam',
    description:
      'A social media ad or storefront offers a highly sought-after, limited-release sneaker, collectible, or electronics item at a below-market price with urgent "few left" messaging, taking payment through a non-reversible method and never shipping a real item. Checking a seller\'s reviews on an independent platform, not just testimonials on their own site, and using a payment method with buyer protection are the main defenses.',
    categorySlug: 'online-shopping-scams',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice'],
    sourceUrl: 'https://consumer.ftc.gov/scams-online-sales-when-orders-dont-arrive',
  },
  {
    name: 'Fake Vaccine Card Sale Scam',
    slug: 'fake-vaccine-card-sale-scam',
    description:
      'Sellers on social media and online marketplaces offer blank or falsified vaccination cards for purchase, letting buyers falsely claim vaccination status without ever receiving a real vaccine. Beyond the fraud itself, buyers can face criminal charges for using a forged government-associated document, and gain none of the actual immune protection the card claims to represent.',
    categorySlug: 'healthcare-fraud',
    alertLevel: 'medium',
    sources: ['FBI IC3'],
    sourceUrl: 'https://www.ic3.gov/PSA/2021/PSA210330',
  },
  {
    name: 'Fake Durable Medical Equipment Billing Scam',
    slug: 'fake-durable-medical-equipment-billing-scam',
    description:
      'A caller claiming to represent Medicare or a medical supply company offers a "free" back brace, knee brace, or other durable medical equipment, then bills Medicare thousands of dollars for equipment that is never delivered, medically unnecessary, or far more expensive than what was actually shipped. Beneficiaries should review their Medicare Summary Notice for equipment they never requested or received.',
    categorySlug: 'healthcare-fraud',
    alertLevel: 'high',
    sources: ['HHS Office of Inspector General', 'Centers for Medicare & Medicaid Services'],
    sourceUrl: 'https://oig.hhs.gov/fraud/consumer-alerts/',
  },
  {
    name: 'Fake Hospital Billing Overdue Debt Call',
    slug: 'fake-hospital-billing-overdue-debt-call',
    description:
      'A caller claims to be from a hospital\'s billing department, states an old medical bill is overdue and about to go to collections, and demands immediate payment by gift card or wire transfer — using real-sounding hospital names and enough personal detail, sometimes from a genuine prior visit, to seem credible. Real hospital billing offices send written statements and do not demand payment by gift card.',
    categorySlug: 'healthcare-fraud',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice'],
    sourceUrl: 'https://consumer.ftc.gov/articles/what-know-about-medical-identity-theft',
  },
  {
    name: 'Fake At-Home Health Testing Kit Upsell Scam',
    slug: 'fake-at-home-testing-kit-upsell-scam',
    description:
      'An ad offers a free at-home genetic, cardiac, or diabetic testing kit shipped directly to Medicare beneficiaries, but signing up for the "free" kit also enrolls the recipient in recurring monthly billing to Medicare for unnecessary follow-up testing or supplies never authorized by a treating doctor. Beneficiaries should be cautious of any health testing offer that arrives unsolicited rather than through their own physician.',
    categorySlug: 'healthcare-fraud',
    alertLevel: 'medium',
    sources: ['HHS Office of Inspector General'],
    sourceUrl: 'https://oig.hhs.gov/fraud/consumer-alerts/',
  },
  {
    name: 'Fake State Tax Refund Verification Text',
    slug: 'fake-state-tax-refund-verification-text',
    description:
      'A text message claims your state tax refund is on hold pending "identity verification" and links to a fake state revenue department login page that harvests your Social Security number and banking details. State tax agencies communicate refund holds through mailed letters, not unsolicited text links.',
    categorySlug: 'tax-scams',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice'],
    sourceUrl: 'https://consumer.ftc.gov/irs-impersonators',
  },
  {
    name: 'Fake Tax Preparer Refund Skimming Scheme',
    slug: 'fake-tax-preparer-refund-skimming-scheme',
    description:
      'A paid tax preparer files a client\'s return accurately but quietly changes the direct deposit information to route all or part of the refund into an account the preparer controls, then tells the client the refund is delayed or smaller than expected. Checking your refund status directly on the IRS "Where\'s My Refund" tool, independent of what your preparer tells you, can catch this early.',
    categorySlug: 'tax-scams',
    alertLevel: 'high',
    sources: ['Internal Revenue Service', 'FTC Consumer Advice'],
    sourceUrl: 'https://www.irs.gov/newsroom/dirty-dozen',
  },
  {
    name: 'Fake IRS "Offer in Compromise" Fee Scam',
    slug: 'fake-irs-offer-in-compromise-fee-scam',
    description:
      'A company advertises the ability to "settle your tax debt for pennies on the dollar" through the IRS\'s real Offer in Compromise program, charging a large upfront fee for an application most applicants don\'t actually qualify for, then doing little or no real work on the case. The IRS itself publishes free eligibility tools and accepts applications directly without requiring a paid intermediary.',
    categorySlug: 'tax-scams',
    alertLevel: 'medium',
    sources: ['Internal Revenue Service', 'FTC Consumer Advice'],
    sourceUrl: 'https://www.irs.gov/newsroom/dirty-dozen',
  },
  {
    name: 'Fake W-2 Phishing Email to Employers',
    slug: 'fake-w2-phishing-email-to-employer',
    description:
      'An email impersonating a company executive asks a payroll or HR employee to send a PDF of all employee W-2 forms for "an urgent audit," aiming to harvest an entire workforce\'s Social Security numbers and wages in one message rather than targeting individuals one at a time. Payroll staff should verify any bulk request for tax documents through a separate communication channel before sending.',
    categorySlug: 'tax-scams',
    alertLevel: 'high',
    sources: ['Internal Revenue Service', 'FBI IC3'],
    sourceUrl: 'https://www.irs.gov/newsroom/dirty-dozen',
  },
  {
    name: 'Fake Passport Renewal "Expedite Fee" Scam',
    slug: 'fake-passport-renewal-expedite-fee-scam',
    description:
      'A website designed to closely resemble the official State Department passport portal charges a large "expedite" fee for faster processing, when the real expedited service fee is paid directly to the government at a fraction of the cost, if it is needed at all. Passport applications should only be filed through travel.state.gov or an authorized in-person acceptance facility.',
    categorySlug: 'government-impersonation',
    alertLevel: 'medium',
    sources: ['U.S. Department of State'],
    sourceUrl: 'https://travel.state.gov/en/international-travel/travel-advisories/scams.html',
  },
  {
    name: 'Fake FTC / State Attorney General Refund Notice Call',
    slug: 'fake-ftc-refund-notice-call',
    description:
      'A caller claims to represent the FTC or a state attorney general\'s office, stating the recipient is owed a refund from a real settlement but must first pay a processing fee or provide bank details to receive it. The FTC never asks for payment or account information to distribute a legitimate settlement refund — real refund checks or prepaid cards simply arrive without any advance fee.',
    categorySlug: 'government-impersonation',
    alertLevel: 'medium',
    sources: ['Federal Trade Commission'],
    sourceUrl: 'https://consumer.ftc.gov/government-impersonators',
  },
  {
    name: 'Fake Selective Service Registration Fine Call',
    slug: 'fake-selective-service-fine-call',
    description:
      'A caller claims a young man failed to register with Selective Service as legally required and threatens an immediate fine or arrest unless paid over the phone, playing on the fact that many recipients are genuinely unsure whether they registered. Selective Service registration status can be verified directly and for free at sss.gov, and the agency does not collect fines by phone.',
    categorySlug: 'government-impersonation',
    alertLevel: 'medium',
    sources: ['Selective Service System'],
    sourceUrl: 'https://www.sss.gov/',
  },
  {
    name: 'Fake Law Firm Wire Instruction Email',
    slug: 'fake-law-firm-wire-instruction-email',
    description:
      'During a real estate closing or business transaction, a scammer who has compromised or spoofed a law firm\'s email sends updated wire instructions redirecting a client\'s payment to an account the scammer controls, timed to arrive right before a genuine deadline to discourage careful verification. Any changed wire instructions, especially those arriving close to a deadline, should be confirmed by phone using a number from a prior, verified communication.',
    categorySlug: 'business-email-compromise',
    alertLevel: 'high',
    sources: ['FBI IC3'],
    sourceUrl: 'https://www.ic3.gov/PSA/2018/PSA180712',
  },
  {
    name: 'Fake Payroll Provider Login Credential Phishing',
    slug: 'fake-payroll-provider-credential-phishing',
    description:
      'An email impersonating a company\'s payroll software provider asks an employee to log in to "verify" their direct deposit details, leading to a fake login page that harvests the employee\'s actual payroll portal credentials — which the scammer then uses to redirect the employee\'s own paycheck. Employees should navigate to payroll systems directly by typing the URL rather than clicking email links.',
    categorySlug: 'business-email-compromise',
    alertLevel: 'high',
    sources: ['FBI IC3'],
    sourceUrl: 'https://www.ic3.gov/PSA/2018/PSA180918',
  },
  {
    name: 'Fake Domain Renewal Invoice to Business Owner',
    slug: 'fake-domain-renewal-invoice-scam',
    description:
      'An official-looking invoice claims a company\'s website domain or business listing is about to expire and must be renewed immediately through the sender, at a price far above the real registrar\'s rate — and paying it may not even renew the actual domain, leaving the real registration to lapse. Domain renewals should only be handled directly through the registrar the domain was originally purchased from.',
    categorySlug: 'business-email-compromise',
    alertLevel: 'low',
    sources: ['FTC Consumer Advice'],
    sourceUrl: 'https://consumer.ftc.gov/scams',
  },
  {
    name: 'Fake "Delivery Address Confirmation" Smishing Text',
    slug: 'fake-delivery-address-confirmation-text',
    description:
      'A text claims a package cannot be delivered because of an incomplete address and asks the recipient to click a link to "confirm" their address, leading to a page that harvests personal information and a small "redelivery fee" payment used to test a stolen card number. Carriers do not request address confirmation through unsolicited text links.',
    categorySlug: 'package-delivery-scams',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice'],
    sourceUrl: 'https://consumer.ftc.gov/consumer-alerts/2025/04/think-text-message-usps-it-could-be-scam',
  },
  {
    name: 'Fake Package Held at Customs Warehouse Scam',
    slug: 'fake-package-held-customs-warehouse-scam',
    description:
      'A text or email claims an international package is being held at a customs warehouse pending a duty or storage fee payment, with a countdown timer designed to create urgency, though no real package exists — the message is sent broadly regardless of whether the recipient is expecting any shipment at all. Legitimate customs holds are handled by the shipping carrier through their official app or website, never an unsolicited link.',
    categorySlug: 'package-delivery-scams',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice'],
    sourceUrl: 'https://consumer.ftc.gov/consumer-alerts/2025/04/think-text-message-usps-it-could-be-scam',
  },
  {
    name: 'Porch Piracy Tracking-Number Phishing Follow-Up',
    slug: 'porch-piracy-tracking-phishing-followup',
    description:
      'After a real package is stolen from a porch, the victim who posts about it publicly, or searches for the tracking number online, is targeted by a scammer offering to help "track" or "recover" the package through a link that actually harvests login credentials or payment information. Real carrier claims are filed directly through the carrier\'s own claims process, not a link offered by a stranger.',
    categorySlug: 'package-delivery-scams',
    alertLevel: 'low',
    sources: ['FTC Consumer Advice'],
    sourceUrl: 'https://consumer.ftc.gov/consumer-alerts/2025/04/think-text-message-usps-it-could-be-scam',
  },
  {
    name: 'Fake Reshipping / Package Forwarding Job Scam',
    slug: 'fake-reshipping-job-scam',
    description:
      'A "work from home" job offer asks the new hire to receive packages at their home and reship them to another address, often overseas, in exchange for a fee — the packages typically contain merchandise purchased with stolen credit cards, and the reshipper can face real legal liability for handling stolen goods, even unknowingly. A job that consists entirely of receiving and reshipping other people\'s packages is a strong sign of a money-mule or fencing operation.',
    categorySlug: 'employment-scams',
    alertLevel: 'high',
    sources: ['FBI IC3'],
    sourceUrl: 'https://www.ic3.gov/PSA/2011/PSA110510.pdf',
  },
  {
    name: 'Fake Employer Equipment Reimbursement Check Scam',
    slug: 'fake-employer-equipment-reimbursement-check-scam',
    description:
      'A new remote-work hire is sent a check to cover the cost of home-office equipment, told to deposit it and use the funds to purchase equipment from a specific vendor — the check later bounces after the funds have already been spent or wired, leaving the new hire liable for the full amount. Legitimate employers typically purchase or ship equipment directly rather than sending a check for the employee to spend on their behalf.',
    categorySlug: 'employment-scams',
    alertLevel: 'high',
    sources: ['FTC Consumer Advice'],
    sourceUrl: 'https://consumer.ftc.gov/articles/job-scams',
  },
  {
    name: 'Fake LinkedIn Recruiter Direct-Message Job Scam',
    slug: 'fake-linkedin-recruiter-job-scam',
    description:
      'A scammer creates a convincing recruiter profile on a professional networking site and messages job seekers directly with an unusually easy, high-paying remote offer, moving the conversation to a messaging app quickly and eventually asking for an upfront fee for training, equipment, or background-check processing. Verifying a recruiter\'s identity through the company\'s official careers page or a mutual connection before sharing any personal information is the key defense.',
    categorySlug: 'employment-scams',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice'],
    sourceUrl: 'https://consumer.ftc.gov/articles/job-scams',
  },
  {
    name: 'Fake Disaster-Relief Crowdfunding Clone',
    slug: 'fake-disaster-relief-crowdfunding-clone',
    description:
      'Within hours of a major disaster making news, a scammer creates a crowdfunding page using real photos of the disaster and a sympathetic but fabricated personal story, soliciting donations that go directly to the scammer rather than any victim. Donors should look for verified, platform-confirmed fundraisers or give directly to established relief organizations instead of an unverified individual page.',
    categorySlug: 'charity-scams',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice'],
    sourceUrl: 'https://consumer.ftc.gov/all-scams/charity-scams',
  },
  {
    name: 'Fake Children\'s Hospital Donation Call',
    slug: 'fake-childrens-hospital-donation-call',
    description:
      'A caller claims to represent a well-known children\'s hospital or pediatric cancer charity and asks for an immediate donation over the phone, sometimes using a name deliberately similar to a real, respected institution. Donors can verify a charity\'s legitimacy and how it spends its funds through independent sites like Charity Navigator or the BBB Wise Giving Alliance before donating.',
    categorySlug: 'charity-scams',
    alertLevel: 'medium',
    sources: ['Federal Trade Commission'],
    sourceUrl: 'https://consumer.ftc.gov/all-scams/charity-scams',
  },
  {
    name: 'Fake Charity Text-to-Donate Scam',
    slug: 'fake-charity-text-to-donate-scam',
    description:
      'A text message asks the recipient to donate to a charitable cause by texting a keyword to a short code, but the number and keyword are not affiliated with any real registered charity — donations are instead billed to the recipient\'s phone account and pocketed directly. Legitimate text-to-donate campaigns are set up through a charity\'s own verified short code, listed on the charity\'s official website.',
    categorySlug: 'charity-scams',
    alertLevel: 'low',
    sources: ['FTC Consumer Advice'],
    sourceUrl: 'https://consumer.ftc.gov/all-scams/charity-scams',
  },
  {
    name: 'Fake State Lottery Commission Winner Letter',
    slug: 'fake-state-lottery-commission-letter',
    description:
      'A physical letter designed to look like official state lottery commission stationery informs the recipient they\'ve won a prize in a lottery they never entered, requiring a "release fee," "tax prepayment," or "processing fee" sent before the prize can be delivered. Real lottery winnings are never released only after the winner sends money first — taxes on winnings, where owed, are withheld from the prize itself.',
    categorySlug: 'lottery-sweepstakes-scams',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice'],
    sourceUrl: 'https://consumer.ftc.gov/articles/fake-prize-sweepstakes-and-lottery-scams',
  },
  {
    name: 'Fake Social Media Giveaway Winner DM Scam',
    slug: 'fake-social-media-giveaway-winner-dm-scam',
    description:
      'A direct message claims the recipient has won a giveaway hosted by a real, recognizable brand or influencer, asking for a small "shipping fee" or personal information to claim a prize such as free electronics or gift cards — the account is typically an impersonation, not the brand\'s actual verified page. Checking whether the brand\'s verified account has announced any such giveaway is a fast way to confirm it is fake.',
    categorySlug: 'lottery-sweepstakes-scams',
    alertLevel: 'low',
    sources: ['FTC Consumer Advice'],
    sourceUrl: 'https://consumer.ftc.gov/articles/fake-prize-sweepstakes-and-lottery-scams',
  },
  {
    name: 'Fake Sweepstakes Certified-Check Overpayment Scam',
    slug: 'fake-sweepstakes-certified-check-overpayment-scam',
    description:
      'A sweepstakes "winner" notification arrives with a real-looking certified check for far more than the promised prize amount, along with instructions to deposit it and wire back the difference to cover "taxes" or "fees" — the check later bounces after the wired funds are already gone, leaving the victim liable for the full amount deposited. No legitimate sweepstakes requires the winner to send money back after receiving a prize check.',
    categorySlug: 'lottery-sweepstakes-scams',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice'],
    sourceUrl: 'https://consumer.ftc.gov/articles/fake-prize-sweepstakes-and-lottery-scams',
  },
  {
    name: 'Dating App Blackmail Threatening to "Out" a Victim',
    slug: 'dating-app-outing-blackmail-scam',
    description:
      'A scammer connects with a victim through a dating app, quickly moves to explicit photos or video, then threatens to send the material to the victim\'s family, employer, or public contacts unless paid — deliberately targeting victims, often closeted gay or bisexual men, who may feel they have less recourse to involve police for fear of being outed. Law enforcement agencies have specifically flagged this pattern; reporting to the platform and to law enforcement, without paying, remains the recommended response regardless of any fear about exposure.',
    categorySlug: 'sextortion',
    alertLevel: 'critical',
    sources: ['FBI IC3'],
    sourceUrl: 'https://www.ic3.gov/',
  },
  {
    name: 'Sextortion Escalation with a Physical-Address Threat',
    slug: 'sextortion-physical-address-threat-escalation',
    description:
      'After an initial sextortion demand is paid or refused, some scammers escalate by revealing they have found the victim\'s home address or workplace — usually through public records or social media, not any special access — using the new threat of in-person exposure to extract further payments. Escalating threats are a sign the scammer is testing what generates a reaction, not evidence of real physical danger tied to non-payment; continuing to refuse payment and reporting to law enforcement remains the guidance even after this kind of escalation.',
    categorySlug: 'sextortion',
    alertLevel: 'high',
    sources: ['FBI IC3'],
    sourceUrl: 'https://www.ic3.gov/',
  },
  {
    name: 'Group Chat Screenshot Extortion Scam',
    slug: 'group-chat-screenshot-extortion-scam',
    description:
      'A scammer joins a group chat or private server on a messaging or gaming platform, waits for a member to share a compromising image within what feels like a trusted small group, then screenshots it and uses it for extortion outside the group — exploiting the false sense of privacy a small, seemingly friendly group chat creates. Treating any image shared in a group chat as potentially permanent and screenshot-able, regardless of how trusted the group feels, is the practical defense.',
    categorySlug: 'sextortion',
    alertLevel: 'high',
    sources: ['FBI IC3'],
    sourceUrl: 'https://www.ic3.gov/',
  },
  {
    name: 'Fake Rent-to-Own Scam on a Vacant Foreclosed Home',
    slug: 'fake-rent-to-own-vacant-foreclosure-scam',
    description:
      'A scammer identifies a vacant home in foreclosure, often found through public foreclosure filings, then poses as the owner or a property manager and rents or offers a "rent-to-own" agreement on the home to an unsuspecting tenant, collecting a security deposit and first month\'s rent for a property the scammer has no legal right to lease. Prospective tenants can verify actual ownership through their county property records office before signing any lease.',
    categorySlug: 'mortgage-foreclosure-scams',
    alertLevel: 'medium',
    sources: ['Consumer Financial Protection Bureau'],
    sourceUrl: 'https://www.consumerfinance.gov/consumer-tools/mortgages/how-to-spot-and-avoid-foreclosure-relief-scams/',
  },
  {
    name: 'Reverse Mortgage Proceeds Redirection Scam',
    slug: 'reverse-mortgage-proceeds-redirection-scam',
    description:
      'After helping an elderly homeowner complete a legitimate reverse mortgage application, a scammer posing as a financial advisor or family helper convinces the homeowner to direct some or all of the loan proceeds into an "investment" the scammer controls, draining the equity the reverse mortgage was meant to provide for the homeowner\'s own living expenses. Reverse mortgage proceeds should go directly to the homeowner\'s own bank account, never a third party\'s.',
    categorySlug: 'mortgage-foreclosure-scams',
    alertLevel: 'high',
    sources: ['Consumer Financial Protection Bureau', 'U.S. Department of Housing and Urban Development'],
    sourceUrl: 'https://www.consumerfinance.gov/consumer-tools/mortgages/how-to-spot-and-avoid-foreclosure-relief-scams/',
  },
  {
    name: 'Fake "We Buy Houses for Cash" Lowball Foreclosure Scam',
    slug: 'fake-cash-home-buyer-foreclosure-lowball-scam',
    description:
      'A company aggressively targets homeowners in early-stage foreclosure with an offer to buy the home quickly for cash, pressuring a fast signature before the homeowner has time to get an independent appraisal or explore other options — the offer price is often a small fraction of the home\'s actual equity, and legitimate alternatives like a short sale or loan modification are never mentioned. Homeowners facing foreclosure can get free counseling from a HUD-approved housing counselor before accepting any cash offer.',
    categorySlug: 'mortgage-foreclosure-scams',
    alertLevel: 'medium',
    sources: ['Consumer Financial Protection Bureau', 'U.S. Department of Housing and Urban Development'],
    sourceUrl: 'https://www.consumerfinance.gov/consumer-tools/mortgages/how-to-spot-and-avoid-foreclosure-relief-scams/',
  },
  {
    name: 'Fake Zoom Meeting Invite Phishing Email',
    slug: 'fake-zoom-meeting-invite-phishing-email',
    description:
      'An email formatted like a Zoom meeting invitation or "missed meeting" notice links to a fake Zoom login page that harvests corporate email credentials, exploiting how routine meeting invites have become since remote work grew common. Hovering over the link to check the actual destination domain before clicking, or navigating to zoom.us directly, avoids the fake page entirely.',
    categorySlug: 'phishing',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice'],
    sourceUrl: 'https://consumer.ftc.gov/articles/how-recognize-avoid-phishing-scams',
  },
  {
    name: 'Fake HR Benefits Open-Enrollment Phishing Email',
    slug: 'fake-hr-benefits-enrollment-phishing-email',
    description:
      'An email timed to arrive during a company\'s real open-enrollment period impersonates the HR or benefits department, asking employees to "confirm" health insurance selections through a link that harvests login credentials to the company\'s actual HR portal, where personal and financial data can then be accessed or redirected. Employees should navigate to their HR portal directly rather than through an emailed link, especially during enrollment season when such requests seem routine.',
    categorySlug: 'phishing',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice'],
    sourceUrl: 'https://consumer.ftc.gov/articles/how-recognize-avoid-phishing-scams',
  },
  {
    name: 'Fake Toll Account Suspension Phishing Email',
    slug: 'fake-toll-account-suspension-phishing-email',
    description:
      'An email claims your electronic toll account (E-ZPass or a similar regional system) will be suspended due to a billing problem, linking to a fake account login page that harvests payment card details rather than any real toll agency site. Toll agencies manage account issues through their own verified app or website, not a link in an unsolicited email.',
    categorySlug: 'phishing',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice'],
    sourceUrl: 'https://consumer.ftc.gov/articles/how-recognize-avoid-phishing-scams',
  },
  {
    name: 'Humanitarian Doctor Overseas Mission Romance Scam',
    slug: 'humanitarian-doctor-romance-scam',
    description:
      'A scammer\'s profile claims to be a doctor or surgeon on a humanitarian medical mission in a conflict zone or disaster area, using the setting to explain unreliable communication and build sympathy before requesting money for medical supplies, travel, or a supposed emergency affecting the mission. As with any overseas-worker romance scam cover story, a partner never met in person requesting money tied to their claimed profession is the central red flag, regardless of how compelling the humanitarian framing is.',
    categorySlug: 'romance-scams',
    alertLevel: 'high',
    sources: ['FTC Consumer Advice'],
    sourceUrl: 'https://consumer.ftc.gov/romance-scams',
  },
  {
    name: 'Grief Support Group Romance Scam',
    slug: 'grief-support-group-romance-scam',
    description:
      'A scammer joins an online grief support group or forum for recently widowed or bereaved people, presenting as someone who has also lost a spouse, and uses the shared experience to build unusually fast emotional intimacy before pivoting to requests for money. Targeting a community formed specifically around a recent loss makes victims more vulnerable than a general dating platform, since the initial trust is built on shared grief rather than romantic interest alone.',
    categorySlug: 'romance-scams',
    alertLevel: 'high',
    sources: ['FTC Consumer Advice'],
    sourceUrl: 'https://consumer.ftc.gov/romance-scams',
  },
  {
    name: 'Romance Scam "Recovery Service" Scam',
    slug: 'romance-scam-recovery-scam',
    description:
      'After a romance scam victim shares their story publicly or in a support forum, a second scammer poses as a fraud recovery specialist, private investigator, or lawyer claiming they can recover the money already lost — for an upfront fee. No legitimate recovery service requires payment before recovering funds, and most money sent to romance scammers, especially by wire transfer or gift card, cannot actually be recovered.',
    categorySlug: 'romance-scams',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice'],
    sourceUrl: 'https://consumer.ftc.gov/romance-scams',
  },
  {
    name: 'Fake Printer or Router Setup Support Line Scam',
    slug: 'fake-printer-router-setup-support-scam',
    description:
      'Searching online for a legitimate brand\'s tech support number returns a fake number, placed there through paid search ads or search-result manipulation, that connects to a scam call center posing as the manufacturer\'s official support line, which then charges for unnecessary "repairs" or gains remote access to the caller\'s computer. Finding support contact information directly on the manufacturer\'s official website, not through a general search, avoids this.',
    categorySlug: 'tech-support-scams',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice'],
    sourceUrl: 'https://consumer.ftc.gov/articles/how-spot-avoid-and-report-tech-support-scams',
  },
  {
    name: 'Fake Software License Renewal Popup Scam',
    slug: 'fake-software-license-renewal-popup-scam',
    description:
      'A popup while browsing claims a security or office software license has expired and must be renewed immediately, linking to a payment page for software the visitor may never have purchased. Legitimate license renewal notices come through the software\'s own application, not a browser popup triggered by visiting an unrelated webpage.',
    categorySlug: 'tech-support-scams',
    alertLevel: 'low',
    sources: ['FTC Consumer Advice'],
    sourceUrl: 'https://consumer.ftc.gov/articles/how-spot-avoid-and-report-tech-support-scams',
  },
  {
    name: 'Fake Remote "Cleanup" After a Real Malware Infection',
    slug: 'fake-remote-access-cleanup-after-real-infection',
    description:
      'After a victim\'s device is genuinely infected with malware from an unrelated source, a scam caller claiming to detect the infection remotely offers a "cleanup" service, gaining legitimate-seeming remote access to a genuinely compromised device and using that access to install further malware, steal financial information, or extort payment for removing an infection they may have actually worsened. A real infection should be addressed with a reputable, independently chosen security provider, not one that initiated contact.',
    categorySlug: 'tech-support-scams',
    alertLevel: 'high',
    sources: ['FTC Consumer Advice'],
    sourceUrl: 'https://consumer.ftc.gov/articles/how-spot-avoid-and-report-tech-support-scams',
  },
  {
    name: 'Fake Marketplace Escrow Payment Service Scam',
    slug: 'fake-marketplace-escrow-payment-scam',
    description:
      'A seller on an online marketplace insists on using a third-party "escrow" service to hold payment safely until the item is delivered, but the escrow site is fake and controlled by the seller, who simply keeps the payment once it is sent there. Legitimate marketplace transactions use the platform\'s own built-in payment protection, not a separate, seller-suggested escrow website.',
    categorySlug: 'online-shopping-scams',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice'],
    sourceUrl: 'https://consumer.ftc.gov/scams-online-sales-when-orders-dont-arrive',
  },
  {
    name: 'Fake Appliance Warranty Extension Scam',
    slug: 'fake-appliance-warranty-extension-scam',
    description:
      'A mailer, call, or email claims a recently purchased appliance or electronics warranty is about to expire and offers an extended warranty for a fee, often reaching customers whose purchase and warranty information was never actually shared with the sender — the "extended warranty" typically doesn\'t cover what\'s promised, if it exists at all. Extended warranties should only be purchased directly through the retailer or manufacturer where the item was bought.',
    categorySlug: 'online-shopping-scams',
    alertLevel: 'low',
    sources: ['FTC Consumer Advice'],
    sourceUrl: 'https://consumer.ftc.gov/scams-online-sales-when-orders-dont-arrive',
  },
  {
    name: 'Fake Local Pickup Marketplace Scam',
    slug: 'fake-local-pickup-marketplace-scam',
    description:
      'A seller lists a desirable item for local pickup at a below-market price, collects a deposit or full payment through a peer-to-peer payment app to "hold" the item, then cancels contact and never shows up for the meetup — exploiting payment apps that offer no buyer protection for person-to-person transfers. Paying only in person, at the time of a completed transaction, avoids this entirely.',
    categorySlug: 'online-shopping-scams',
    alertLevel: 'low',
    sources: ['FTC Consumer Advice'],
    sourceUrl: 'https://consumer.ftc.gov/scams-online-sales-when-orders-dont-arrive',
  },
  {
    name: 'Fake Renters Insurance Requirement Scam via Landlord Portal',
    slug: 'fake-renters-insurance-landlord-portal-scam',
    description:
      'A tenant is directed, through a fake "property management portal" link designed to look like it\'s from their landlord, to purchase renters insurance through a specific non-existent or fraudulent provider as a lease requirement — the portal harvests payment information without providing any real coverage. Tenants can independently verify insurance requirements directly with their actual property manager and purchase coverage from any licensed insurer of their choosing.',
    categorySlug: 'insurance-fraud',
    alertLevel: 'medium',
    sources: ['National Association of Insurance Commissioners'],
    sourceUrl: 'https://content.naic.org/insurance-topics/insurance-fraud',
  },
  {
    name: 'Fake Travel Insurance Add-On Upsell Scam',
    slug: 'fake-travel-insurance-addon-scam',
    description:
      'During checkout on a fake or spoofed travel booking site, travelers are offered a "required" travel insurance add-on from an unlicensed provider, collected as payment but providing no actual coverage if a claim is later filed. Confirming a travel insurance provider\'s license status with a state department of insurance before purchase is a fast way to check legitimacy.',
    categorySlug: 'insurance-fraud',
    alertLevel: 'low',
    sources: ['National Association of Insurance Commissioners'],
    sourceUrl: 'https://content.naic.org/insurance-topics/insurance-fraud',
  },
  {
    name: 'Fake Small Business Workers\' Compensation Policy Scam',
    slug: 'fake-workers-compensation-policy-scam',
    description:
      'A small business owner is sold a workers\' compensation policy at an attractively low premium by an unlicensed broker or fake insurer, satisfying a legal requirement on paper — until an employee is actually injured and the business discovers the policy was never real, leaving the owner personally liable for the employee\'s medical costs and lost wages. Business owners can verify a workers\' comp carrier\'s license and standing directly with their state\'s department of insurance.',
    categorySlug: 'insurance-fraud',
    alertLevel: 'high',
    sources: ['National Association of Insurance Commissioners'],
    sourceUrl: 'https://content.naic.org/insurance-topics/insurance-fraud',
  },
  {
    name: 'Fake Credit Freeze/Unfreeze Phishing Call',
    slug: 'fake-credit-freeze-unfreeze-phishing-call',
    description:
      'A caller claims to be from a credit bureau and states your credit file needs to be "unfrozen" to process a pending application, walking you through providing your PIN and personal details over the phone. Legitimate credit bureaus only unfreeze a file through their own website, app, or a written request initiated by the consumer themselves — never a call the bureau places to you.',
    categorySlug: 'identity-theft',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice'],
    sourceUrl: 'https://consumer.ftc.gov/identity-theft-and-online-security/identity-theft',
  },
  {
    name: 'Fake Online Notary Signing Service Identity-Harvesting Scam',
    slug: 'fake-notary-signing-service-identity-scam',
    description:
      'An online "notary" or document-preparation service collects scans of a driver\'s license, Social Security card, or passport to "verify identity" for a routine document signing, then resells or misuses that information rather than providing any real notarization service. Using only licensed, verifiable notaries — in person or through an established, state-recognized online notary platform — avoids handing sensitive ID documents to an unverified party.',
    categorySlug: 'identity-theft',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice'],
    sourceUrl: 'https://consumer.ftc.gov/identity-theft-and-online-security/identity-theft',
  },
  {
    name: 'Fake App Store Review Request Phishing Link',
    slug: 'fake-app-store-review-phishing-link',
    description:
      'A text or email formatted to look like a request to review a recent app purchase includes a link to a fake Apple ID or Google account login page, harvesting the credentials that control the victim\'s entire app ecosystem, stored payment methods, and often a linked email account used to reset other passwords. Apple and Google review requests appear inside the app store itself, not through an external link in a text or email.',
    categorySlug: 'account-takeover',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice'],
    sourceUrl: 'https://consumer.ftc.gov/articles/how-recover-your-hacked-email-or-social-media-account',
  },
  {
    name: 'AI-Generated Fake Court Summons Document',
    slug: 'ai-generated-fake-court-summons-scam',
    description:
      'AI document-generation tools are used to produce a convincingly formatted fake court summons or legal notice — complete with a real court\'s letterhead and case-number formatting — served by email or text and demanding an urgent response or payment to avoid a default judgment. Court summonses are legally required to be delivered through formal service of process, not emailed as a PDF; any such notice should be verified directly with the named court\'s clerk.',
    categorySlug: 'ai-deepfake-scams',
    alertLevel: 'high',
    sources: ['FTC Consumer Advice'],
    sourceUrl: 'https://consumer.ftc.gov/consumer-alerts/2024/04/fighting-back-against-harmful-voice-cloning',
  },
  {
    name: 'AI Chatbot Impersonating a Real Financial Advisor',
    slug: 'ai-chatbot-impersonating-financial-advisor',
    description:
      'A chatbot embedded on a fraudulent website is trained on a real, well-known financial advisor\'s or influencer\'s public content to mimic their voice and advice style, then steers users toward a fraudulent investment platform under the appearance of personalized advice from someone the victim already trusts. The real advisor typically has no knowledge their identity or content is being used this way; checking whether an interaction is happening on the advisor\'s verified official platform is the practical defense.',
    categorySlug: 'ai-deepfake-scams',
    alertLevel: 'high',
    sources: ['SEC Office of Investor Education and Advocacy'],
    sourceUrl: 'https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-alerts/artificial-intelligence-fraud',
  },
  {
    name: 'Fake Electric Company Disconnection Threat Call',
    slug: 'fake-electric-disconnection-threat-call',
    description:
      'A caller claims to be from your electric utility, states your account is past due, and threatens same-day disconnection unless payment is made immediately — typically demanding a prepaid debit card or a cash-to-crypto payment kiosk rather than a normal bill payment method. Utilities are required by state regulation to send multiple written disconnection notices well in advance and never demand a specific untraceable payment method over the phone.',
    categorySlug: 'utility-scams',
    alertLevel: 'high',
    sources: ['FTC Consumer Advice'],
    sourceUrl: 'https://consumer.ftc.gov/articles/scammers-pretend-be-your-utility-company',
  },
  {
    name: 'Fake Utility Bill Overpayment Refund Scam',
    slug: 'fake-utility-overpayment-refund-scam',
    description:
      'A caller claims your utility account was overcharged and a refund is owed, but processing the refund requires your bank account or debit card information "to verify eligibility" — the information collected is then used for unauthorized withdrawals rather than any real refund. Utility refunds are applied as a statement credit or mailed check, never requiring you to provide account access over the phone.',
    categorySlug: 'utility-scams',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice'],
    sourceUrl: 'https://consumer.ftc.gov/articles/scammers-pretend-be-your-utility-company',
  },
  {
    name: 'Fake Internet or Cable Provider Equipment Fee Scam',
    slug: 'fake-internet-provider-equipment-fee-scam',
    description:
      'A call or text claims your internet or cable provider is updating equipment nationwide and requires an immediate "activation fee" payment to avoid a service interruption, using a real provider\'s name and branding to appear legitimate. Providers bill equipment or activation charges through the normal monthly statement, not a standalone urgent payment demand.',
    categorySlug: 'utility-scams',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice'],
    sourceUrl: 'https://consumer.ftc.gov/articles/scammers-pretend-be-your-utility-company',
  },
  {
    name: 'Fake Meter Inspector Home Access Scam',
    slug: 'fake-meter-inspector-home-access-scam',
    description:
      'Someone posing as a utility meter inspector or safety technician requests entry to a home to "inspect" the gas, electric, or water meter, using the visit to steal valuables or gather information for a follow-up scam. Real utility employees carry verifiable ID and a scheduled-visit confirmation that can be checked by calling the utility\'s official customer service number before allowing entry.',
    categorySlug: 'utility-scams',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice'],
    sourceUrl: 'https://consumer.ftc.gov/articles/scammers-pretend-be-your-utility-company',
  },
  {
    name: 'Fake Utility-Sponsored Solar Panel Savings Scam',
    slug: 'fake-solar-panel-utility-savings-scam',
    description:
      'A door-to-door or phone solicitor claims to represent a utility-sponsored solar program offering free or heavily discounted panel installation, but the pitch is actually a lead-generation or financing scheme that locks the homeowner into a long-term lease or loan far more expensive than represented — often with the utility having no actual affiliation with the program at all. Homeowners should verify any "utility-sponsored" program directly with their utility before signing anything.',
    categorySlug: 'utility-scams',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice'],
    sourceUrl: 'https://consumer.ftc.gov/articles/scammers-pretend-be-your-utility-company',
  },
  {
    name: 'Fake Prepaid Utility Card Reload Scam',
    slug: 'fake-prepaid-utility-card-reload-scam',
    description:
      'A caller instructs a customer to purchase a specific prepaid debit or gift card, then call back and read the card numbers to "reload" their utility account balance — a payment method no legitimate utility company uses or accepts, designed to be untraceable once the numbers are given out. No utility company requires payment exclusively through a specific retail gift card.',
    categorySlug: 'utility-scams',
    alertLevel: 'high',
    sources: ['FTC Consumer Advice'],
    sourceUrl: 'https://consumer.ftc.gov/articles/scammers-pretend-be-your-utility-company',
  },
  {
    name: 'Fake Package Redirection Request Scam',
    slug: 'fake-package-redirection-request-scam',
    description:
      'A text or call claims a package delivery attempt failed and offers to redirect it to a different address for a small fee, but no such package exists — the fee payment is used to test a stolen card, and any personal information provided feeds into further targeting. Confirming shipment status directly through the retailer\'s own order history, not a link in the message, is the safe check.',
    categorySlug: 'package-delivery-scams',
    alertLevel: 'low',
    sources: ['FTC Consumer Advice'],
    sourceUrl: 'https://consumer.ftc.gov/consumer-alerts/2025/04/think-text-message-usps-it-could-be-scam',
  },
  {
    name: 'Fake Robo-Advisor App Investment Scam',
    slug: 'fake-robo-advisor-app-investment-scam',
    description:
      'A polished mobile app mimics the interface of legitimate automated investment platforms, showing a realistic-looking account balance that appears to grow steadily, but the app is not connected to any real brokerage or the SEC-registered entity it claims to be — deposits are simply taken, and withdrawal requests are delayed indefinitely or denied. Verifying an investment platform\'s registration directly through the SEC\'s or FINRA\'s public databases, not just app store reviews, is the necessary check.',
    categorySlug: 'investment-fraud',
    alertLevel: 'high',
    sources: ['SEC Office of Investor Education and Advocacy'],
    sourceUrl: 'https://www.investor.gov/protect-your-investments/fraud/types-fraud',
  },
  {
    name: 'Fake Missing Child Alert Donation Scam',
    slug: 'fake-missing-child-alert-donation-scam',
    description:
      'A viral social media post about a missing child includes a donation link to help fund the "search effort," but the child either doesn\'t exist, was already found, or the case is real while the donation link is entirely unaffiliated with the family or any law enforcement agency involved. Sharing the alert is harmless, but any donation request attached to it should be verified against the actual law enforcement agency\'s or family\'s confirmed channel before giving.',
    categorySlug: 'charity-scams',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice'],
    sourceUrl: 'https://consumer.ftc.gov/all-scams/charity-scams',
  },
  {
    name: 'Fake Union Apprenticeship Program Fee Scam',
    slug: 'fake-union-apprenticeship-fee-scam',
    description:
      'An ad or message offers guaranteed placement in a well-paying union trade apprenticeship program in exchange for an upfront "registration" or "materials" fee, though real union apprenticeships are typically free to apply for and are administered directly through the union or a joint apprenticeship committee, not a private recruiter charging a fee. Verifying an apprenticeship opportunity directly with the named union local avoids the fee entirely.',
    categorySlug: 'employment-scams',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice'],
    sourceUrl: 'https://consumer.ftc.gov/articles/job-scams',
  },
  {
    name: 'EBT Card Skimming at Point-of-Sale Terminals',
    slug: 'ebt-card-skimming-scam',
    description:
      'Criminals install hidden skimming devices on point-of-sale terminals or ATMs, or use hidden cameras to capture PIN entry, to clone SNAP/EBT card numbers and drain benefits balances — often striking right after benefits are deposited each month. USDA\'s Food and Nutrition Service has expanded state EBT theft replacement rules in response to a nationwide surge in skimming; checking terminals for loose or add-on card readers and covering the PIN pad are practical defenses.',
    categorySlug: 'public-benefits-fraud',
    alertLevel: 'high',
    sources: ['USDA Food and Nutrition Service'],
    sourceUrl: 'https://www.fns.usda.gov/snap/scam-alerts',
  },
  {
    name: 'Fake SNAP Benefits Suspension Text Scam',
    slug: 'fake-snap-benefits-suspension-text-scam',
    description:
      'A text claims SNAP or other public benefits have been suspended due to a "verification issue" and links to a fake state benefits portal login page that harvests the recipient\'s Social Security number and EBT card PIN. State benefits agencies communicate suspensions through official mail and the agency\'s own verified portal, not an unsolicited text link.',
    categorySlug: 'public-benefits-fraud',
    alertLevel: 'medium',
    sources: ['USDA Food and Nutrition Service'],
    sourceUrl: 'https://www.fns.usda.gov/news-item/fraud-alert-usda-warns-text-message-scam-targeting-snap-recipients',
  },
  {
    name: 'Unemployment Benefits Filed in a Victim\'s Name Using Stolen Data',
    slug: 'unemployment-benefits-identity-theft-filing',
    description:
      'Using personal information obtained from a data breach, criminals file a fraudulent unemployment insurance claim in a victim\'s name at a state workforce agency, directing the payments to a bank account or prepaid card they control — the victim typically discovers it only when they receive a 1099-G tax form for benefits they never applied for or received. Reporting a suspicious 1099-G to the state unemployment agency and requesting a corrected form is the necessary follow-up.',
    categorySlug: 'public-benefits-fraud',
    alertLevel: 'high',
    sources: ['U.S. Department of Labor', 'FTC Consumer Advice'],
    sourceUrl: 'https://www.dol.gov/agencies/eta/unemployment-insurance-payment-accuracy/UIFraudReporting',
  },
  {
    name: 'Fake Social Security Disability Advocate Fee Scam',
    slug: 'fake-ssdi-advocate-fee-scam',
    description:
      'A company or individual offers to help file or expedite a Social Security Disability Insurance claim for an upfront fee paid before any work is done, though the Social Security Administration caps and regulates representative fees, which are normally paid only from approved back-benefits and only after a favorable decision. Any representative demanding payment before a claim is decided is charging outside SSA\'s fee rules.',
    categorySlug: 'public-benefits-fraud',
    alertLevel: 'medium',
    sources: ['Social Security Administration'],
    sourceUrl: 'https://www.ssa.gov/scam/',
  },
  {
    name: 'Fake Chargeback Reversal Scam',
    slug: 'fake-chargeback-reversal-scam',
    description:
      'After a cardholder successfully disputes a fraudulent charge, a scammer posing as their bank calls claiming the chargeback was reversed and additional verification is needed to avoid losing the disputed funds permanently, using the follow-up contact to extract the card number or online banking credentials under the guise of "confirming" the reversal. Chargeback status should be checked directly through your bank\'s app or a number from the back of your card, not a number provided by the caller.',
    categorySlug: 'identity-theft',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice'],
    sourceUrl: 'https://consumer.ftc.gov/identity-theft-and-online-security/identity-theft',
  },
  {
    name: 'Shared-Password Crackdown Phishing Email',
    slug: 'shared-password-crackdown-phishing-email',
    description:
      'An email impersonating a streaming service claims new password-sharing detection has flagged the account and requires "re-verification" through a link, timed to coincide with real password-sharing crackdown announcements the actual companies made — the link leads to a fake login page harvesting account and payment credentials. Verifying any such notice by logging in directly through the app rather than an email link avoids the fake page.',
    categorySlug: 'account-takeover',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice'],
    sourceUrl: 'https://consumer.ftc.gov/articles/how-recover-your-hacked-email-or-social-media-account',
  },
  {
    name: 'Fake Dental Discount Plan Membership Scam',
    slug: 'fake-dental-discount-plan-scam',
    description:
      'A membership plan is marketed as providing significant discounts at "thousands of dentists nationwide," collecting an annual fee, but the actual network of participating providers is tiny, outdated, or nonexistent in the buyer\'s area, leaving them with a plan that provides no real discount when they try to use it. Confirming specific, current in-network providers by calling the dentist\'s office directly, not just checking the plan\'s own directory, catches this before purchase.',
    categorySlug: 'healthcare-fraud',
    alertLevel: 'low',
    sources: ['FTC Consumer Advice'],
    sourceUrl: 'https://consumer.ftc.gov/articles/what-know-about-medical-identity-theft',
  },
  {
    name: 'Fake Subscription Box Free-Trial Scam',
    slug: 'fake-subscription-box-free-trial-scam',
    description:
      'An ad offers a "free" trial box of beauty, supplement, or novelty products for only a small shipping fee, but the shipping payment enrolls the buyer in a recurring monthly subscription at a much higher price that is deliberately difficult to cancel, with charges continuing for months before the buyer notices. Reading the full terms before entering payment information for any "free plus shipping" offer, and checking bank statements regularly, catches this early.',
    categorySlug: 'online-shopping-scams',
    alertLevel: 'low',
    sources: ['FTC Consumer Advice'],
    sourceUrl: 'https://consumer.ftc.gov/scams-online-sales-when-orders-dont-arrive',
  },
  {
    name: 'Classic Grandparent Bail-Money Scam',
    slug: 'classic-grandparent-bail-money-scam',
    description:
      'A caller claims to be a grandchild in trouble — arrested, in a car accident, or stranded in a foreign country — and begs the grandparent not to tell their parents, creating both urgency and secrecy that discourage the grandparent from calling another family member to verify the story before sending money, typically by wire transfer or gift card. Hanging up and calling the grandchild directly at their known number, or calling another family member to check, breaks the scam\'s entire structure.',
    categorySlug: 'family-emergency-scams',
    alertLevel: 'high',
    sources: ['FTC Consumer Advice'],
    sourceUrl: 'https://consumer.ftc.gov/articles/scammers-use-fake-emergencies-steal-your-money',
  },
  {
    name: 'Fake Bail Bondsman Follow-Up Call',
    slug: 'fake-bail-bondsman-followup-call',
    description:
      'After an initial family-emergency call, a second scammer poses as a bail bondsman or court clerk to "confirm" the arrest and payment details, adding a layer of apparent independent verification that makes the original story feel more credible. A real bail amount and process can be verified directly with the actual courthouse or jail in the jurisdiction named, using publicly listed contact information, not a number provided during the call.',
    categorySlug: 'family-emergency-scams',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice'],
    sourceUrl: 'https://consumer.ftc.gov/articles/scammers-use-fake-emergencies-steal-your-money',
  },
  {
    name: 'Fake Hospital Emergency Payment Call',
    slug: 'fake-hospital-emergency-payment-call',
    description:
      'A caller claims a family member has been in a serious accident and is receiving emergency treatment, but insurance won\'t cover it without an immediate payment or deposit, pressuring the recipient to send money before they have any chance to call the hospital or the family member directly. Legitimate hospitals do not require a family member to prepay for ongoing emergency treatment over the phone.',
    categorySlug: 'family-emergency-scams',
    alertLevel: 'high',
    sources: ['FTC Consumer Advice'],
    sourceUrl: 'https://consumer.ftc.gov/articles/scammers-use-fake-emergencies-steal-your-money',
  },
  {
    name: 'Stranded Traveler Family-Member Scam',
    slug: 'stranded-traveler-family-member-scam',
    description:
      'A message, sometimes from a compromised or spoofed family member\'s own account, claims they are stranded while traveling — lost wallet, missed flight, detained at a border — and urgently need money wired or sent through a payment app to resolve the situation. Contacting the family member through a separate, independently verified channel, rather than replying within the same possibly-compromised conversation, is the necessary check.',
    categorySlug: 'family-emergency-scams',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice'],
    sourceUrl: 'https://consumer.ftc.gov/articles/scammers-use-fake-emergencies-steal-your-money',
  },
  {
    name: 'Fake Private Student Loan Refinance Fee Scam',
    slug: 'fake-private-student-loan-refinance-fee-scam',
    description:
      'A company advertises refinancing private student loans at an unusually low guaranteed rate, collecting an upfront "application" or "lock-in" fee, but never actually completes a refinance. Real lenders evaluate rate offers based on credit and income before charging any fee, and legitimate refinancing fees, where they exist, come out of the new loan itself.',
    categorySlug: 'debt-relief-scams',
    alertLevel: 'medium',
    sources: ['Consumer Financial Protection Bureau'],
    sourceUrl: 'https://www.consumerfinance.gov/ask-cfpb/what-is-a-debt-relief-program-and-how-do-i-know-if-i-should-use-one-en-1457/',
  },
  {
    name: 'Fake Private Equity Access Scam for Retail Investors',
    slug: 'fake-private-equity-access-scam',
    description:
      'A pitch offers ordinary retail investors access to an exclusive private equity or pre-IPO investment normally reserved for institutional or accredited investors, using the appeal of insider access to justify an unusually large minimum investment — the fund and its claimed track record are fabricated, and the money is never actually invested anywhere. Genuine private equity access for retail investors is heavily regulated and rare; checking SEC filings for any named fund is a necessary step before investing.',
    categorySlug: 'investment-fraud',
    alertLevel: 'high',
    sources: ['SEC Office of Investor Education and Advocacy'],
    sourceUrl: 'https://www.investor.gov/protect-your-investments/fraud/types-fraud',
  },
  {
    name: 'Fake Veteran Service-Dog Training Charity Scam',
    slug: 'fake-veteran-service-dog-charity-scam',
    description:
      'A charity claims to train and provide service dogs for veterans with PTSD or physical disabilities at no cost, soliciting significant donations, but delivers few or no actual dogs to veterans — a pattern regulators have flagged in more than one real enforcement case against charities using this specific appeal. Checking a charity\'s actual program spending ratio through Charity Navigator or a state charity registration search before donating catches this.',
    categorySlug: 'charity-scams',
    alertLevel: 'medium',
    sources: ['Federal Trade Commission'],
    sourceUrl: 'https://consumer.ftc.gov/all-scams/charity-scams',
  },
  {
    name: 'Fake GLP-1 Weight-Loss Drug Counterfeit Scam',
    slug: 'fake-glp1-weight-loss-drug-scam',
    description:
      'Websites and social media ads offer popular prescription weight-loss injectable medications without a prescription, at steep discounts, shipping counterfeit or improperly compounded products that may contain the wrong dose or no active ingredient at all — a pattern that surged alongside genuine shortages and high demand for these drugs. These medications should only be obtained through a licensed pharmacy with a valid prescription, never a site offering them without one.',
    categorySlug: 'healthcare-fraud',
    alertLevel: 'high',
    sources: ['U.S. Food and Drug Administration', 'FTC Consumer Advice'],
    sourceUrl: 'https://www.fda.gov/consumers/health-fraud-scams',
  },
  {
    name: 'Fake Medicaid Recertification Phishing Call',
    slug: 'fake-medicaid-recertification-phishing-call',
    description:
      'A caller claims a Medicaid recipient\'s coverage will lapse unless they "recertify" immediately, asking for a Social Security number and bank account details over the phone to process the renewal. State Medicaid agencies handle recertification through mailed notices and their own official portal or in-person office, not an unsolicited call demanding immediate account information.',
    categorySlug: 'public-benefits-fraud',
    alertLevel: 'medium',
    sources: ['Centers for Medicare & Medicaid Services'],
    sourceUrl: 'https://www.cms.gov/medicare/medicaid-coordination/center-program-integrity/reporting-fraud',
  },
  {
    name: 'Fake WIC Benefits Card Replacement Scam',
    slug: 'fake-wic-card-replacement-scam',
    description:
      'A text or call claims a WIC (Women, Infants, and Children) benefits card has been compromised and offers to send a replacement, but first requests the current card number and PIN "to deactivate the old card" — information then used to drain the existing balance before any real replacement is issued. WIC card issues should be reported directly to the local WIC clinic or state agency, not through a link or number from an unsolicited message.',
    categorySlug: 'public-benefits-fraud',
    alertLevel: 'medium',
    sources: ['USDA Food and Nutrition Service'],
    sourceUrl: 'https://www.fns.usda.gov/snap/scam-alerts',
  },
  {
    name: 'Fake Housing Voucher Waitlist Fee Scam',
    slug: 'fake-housing-voucher-waitlist-fee-scam',
    description:
      'A caller or website claims to offer expedited placement on a Section 8 or public housing waitlist for an upfront processing fee, though real public housing authorities do not charge fees to join or move up a waitlist, and waitlist order cannot legitimately be purchased. Applicants can verify their actual waitlist status directly with their local public housing authority at no cost.',
    categorySlug: 'public-benefits-fraud',
    alertLevel: 'medium',
    sources: ['U.S. Department of Housing and Urban Development'],
    sourceUrl: 'https://www.hud.gov/helping-americans/prevent-loan-scams',
  },
  {
    name: 'Fake Military Emergency Leave Payment Scam',
    slug: 'fake-military-emergency-leave-payment-scam',
    description:
      'A caller claims a family member serving in the military needs emergency funds sent immediately to secure emergency leave or transport home for a family crisis, exploiting the same urgency and distance that make military-deployment romance scams effective, but targeting an existing family relationship rather than a new one. The Department of Defense does not require service members or their families to pay for emergency leave approval or transport.',
    categorySlug: 'family-emergency-scams',
    alertLevel: 'high',
    sources: ['Federal Trade Commission (FTC)'],
    sourceUrl: 'https://consumer.ftc.gov/articles/scammers-use-fake-emergencies-steal-your-money',
  },
  {
    name: 'Fake Kidnapping Ransom Call',
    slug: 'fake-kidnapping-ransom-call',
    description:
      'A caller claims to have kidnapped a family member and demands an immediate ransom payment, often keeping the victim on the phone continuously to prevent them from hanging up and verifying the family member\'s actual whereabouts — in reality, no kidnapping has occurred, and the supposed victim is simply unreachable at that moment for an unrelated reason. If safely possible, contacting the named family member or law enforcement through a second phone while staying on the line is the recommended response.',
    categorySlug: 'family-emergency-scams',
    alertLevel: 'critical',
    sources: ['FBI IC3'],
    sourceUrl: 'https://www.ic3.gov/PSA/2025/PSA251205',
  },
  {
    name: 'Fake Child\'s School Emergency Pickup Scam',
    slug: 'fake-school-emergency-pickup-scam',
    description:
      'A caller impersonating school staff claims a parent\'s child has been injured or is in trouble and needs immediate payment, sometimes for a supposed medical bill or fine, before the parent can pick them up — a scenario designed to bypass the parent\'s instinct to first call the school directly. Schools resolve real emergencies by contacting a parent directly for pickup, not by demanding payment over the phone as a precondition.',
    categorySlug: 'family-emergency-scams',
    alertLevel: 'high',
    sources: ['FTC Consumer Advice'],
    sourceUrl: 'https://consumer.ftc.gov/articles/scammers-use-fake-emergencies-steal-your-money',
  },
  {
    name: 'Fake Boil-Water Notice Sales Scam',
    slug: 'fake-water-utility-boil-water-notice-scam',
    description:
      'A call or text falsely claims a boil-water advisory is in effect and offers to sell a water filtration or testing service "required" during the advisory, or asks for payment to confirm the address is unaffected. Real boil-water advisories are issued and communicated by the local water utility and public health department directly, without any sales pitch attached.',
    categorySlug: 'utility-scams',
    alertLevel: 'low',
    sources: ['FTC Consumer Advice'],
    sourceUrl: 'https://consumer.ftc.gov/articles/scammers-pretend-be-your-utility-company',
  },
  {
    name: 'Fake Smart Meter Installation Fee Scam',
    slug: 'fake-smart-meter-installation-fee-scam',
    description:
      'A caller or door-to-door visitor claims a mandatory smart meter upgrade requires an installation fee paid directly to them, when utilities that roll out smart meters typically do so at no direct cost to the customer, billing any equipment cost through the regular account rather than collecting cash or card payment on the spot. Scheduling and cost of any real meter upgrade can be confirmed by calling the utility\'s official customer service line.',
    categorySlug: 'utility-scams',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice'],
    sourceUrl: 'https://consumer.ftc.gov/articles/scammers-pretend-be-your-utility-company',
  },
  {
    name: 'Fake Utility Rebate Program Phishing Email',
    slug: 'fake-utility-rebate-program-phishing-email',
    description:
      'An email claims the recipient qualifies for a utility company rebate on energy-efficient appliances or a bill credit, linking to a fake form that harvests bank account details to "deposit" the rebate. Real utility rebate programs are applied through the utility\'s own verified website or as a statement credit, never requiring bank login information submitted through an emailed link.',
    categorySlug: 'utility-scams',
    alertLevel: 'low',
    sources: ['FTC Consumer Advice'],
    sourceUrl: 'https://consumer.ftc.gov/articles/scammers-pretend-be-your-utility-company',
  },
  {
    name: 'Fake Tax Preparer Inflated-Refund Promise Scam',
    slug: 'fake-tax-preparer-inflated-refund-scam',
    description:
      'A preparer promises an unusually large refund by fabricating deductions, dependents, or business losses the client never had, signing the return in the client\'s name — the client later faces an IRS audit, penalties, and repayment of the inflated refund, while the preparer who profited from inflated fees is often difficult to locate again. Reviewing your own return line by line before signing, and never signing a blank or incomplete return, is the practical defense.',
    categorySlug: 'tax-scams',
    alertLevel: 'high',
    sources: ['Internal Revenue Service'],
    sourceUrl: 'https://www.irs.gov/newsroom/dirty-dozen',
  },
  {
    name: 'Fake "Do Not Call" Registry Renewal Scam',
    slug: 'fake-do-not-call-registry-renewal-scam',
    description:
      'A call or email claims your number\'s National Do Not Call Registry listing is expiring and requires a fee to renew, though real Do Not Call Registry listings never expire and registering or checking your status is always free directly through donotcall.gov. Any renewal fee request for a government registry that\'s actually free and permanent is an immediate red flag.',
    categorySlug: 'government-impersonation',
    alertLevel: 'low',
    sources: ['Federal Trade Commission'],
    sourceUrl: 'https://consumer.ftc.gov/government-impersonators',
  },
  {
    name: 'Fake Vendor Onboarding Form Credential Harvest',
    slug: 'fake-vendor-onboarding-form-credential-harvest',
    description:
      'A scammer posing as a new or existing vendor sends an accounts payable department a "vendor onboarding" or "banking update" form to complete, which either harvests employee login credentials through a fake portal or directly changes the real vendor\'s payment banking details to an account the scammer controls. Verifying any new or changed vendor banking information by phone, using a number independently looked up rather than one provided in the email, prevents this.',
    categorySlug: 'business-email-compromise',
    alertLevel: 'high',
    sources: ['FBI IC3'],
    sourceUrl: 'https://www.ic3.gov/PSA/2017/PSA170504',
  },
  {
    name: 'Fake Televised Dream Home Giveaway Entry Fee Scam',
    slug: 'fake-dream-home-giveaway-entry-fee-scam',
    description:
      'An email or ad claims the recipient has been selected as a finalist in a televised home or car giveaway sweepstakes, requiring a small entry or processing fee to remain eligible. Legitimate sweepstakes of this kind do not require any payment at any stage, from entry through prize claim; checking the sweepstakes\' official rules directly on the network or brand\'s real website is the fastest way to confirm it is fake.',
    categorySlug: 'lottery-sweepstakes-scams',
    alertLevel: 'low',
    sources: ['FTC Consumer Advice'],
    sourceUrl: 'https://consumer.ftc.gov/articles/fake-prize-sweepstakes-and-lottery-scams',
  },
  {
    name: 'Fake Timeshare Loan Forgiveness Scam',
    slug: 'fake-timeshare-loan-forgiveness-scam',
    description:
      'A company contacts timeshare owners claiming to have arranged a special program to forgive the remaining loan balance on their timeshare purchase, requiring an upfront fee to "process" the forgiveness — no such lender-side forgiveness program exists, and the timeshare loan remains fully due regardless of any fee paid. Timeshare loan questions should go directly to the loan servicer named on the original financing documents.',
    categorySlug: 'timeshare-scams',
    alertLevel: 'medium',
    sources: ['Consumer Financial Protection Bureau'],
    sourceUrl: 'https://www.consumerfinance.gov/ask-cfpb/what-is-a-debt-relief-program-and-how-do-i-know-if-i-should-use-one-en-1457/',
  },
  {
    name: 'Sextortion via a Compromised Employer Email Account',
    slug: 'sextortion-via-compromised-employer-email',
    description:
      'A scammer who has gained access to a victim\'s work email account discovers or fabricates compromising material and threatens to send it to the victim\'s entire company directory or supervisor unless paid, using workplace-wide distribution as added leverage beyond a typical personal-contacts threat. Reporting immediately to the employer\'s IT or security team, not just paying quietly, is the recommended response — a compromised work account is also a security incident the employer needs to know about regardless of the extortion content.',
    categorySlug: 'sextortion',
    alertLevel: 'critical',
    sources: ['FBI IC3'],
    sourceUrl: 'https://www.ic3.gov/',
  },
  {
    name: 'Fake School Meal Program Application Fee Scam',
    slug: 'fake-school-meal-program-fee-scam',
    description:
      'A letter or call claims a family must pay a processing fee to enroll their child in the National School Lunch Program\'s free or reduced-price meal benefit, though applying for this federal program is always free and handled directly through the child\'s school district. Any fee request tied to a free federal benefits program is an immediate sign of a scam.',
    categorySlug: 'public-benefits-fraud',
    alertLevel: 'low',
    sources: ['USDA Food and Nutrition Service'],
    sourceUrl: 'https://www.fns.usda.gov/snap/scam-alerts',
  },
  {
    name: 'Fake Federal Pell Grant Processing Fee Scam',
    slug: 'fake-pell-grant-processing-fee-scam',
    description:
      'A caller or website claims a student must pay an upfront fee to process or "unlock" a Federal Pell Grant award, though applying for federal student aid through the FAFSA is always free and grants are disbursed directly by the student\'s school, never requiring a separate payment to a third party first. The word "free" is literally in the application\'s name — the Free Application for Federal Student Aid — for exactly this reason.',
    categorySlug: 'public-benefits-fraud',
    alertLevel: 'medium',
    sources: ['U.S. Department of Education'],
    sourceUrl: 'https://www.ed.gov/',
  },
  {
    name: 'Fake Overseas Consulate Emergency Fee Scam',
    slug: 'fake-consulate-emergency-passport-fee-scam',
    description:
      'A message claims a traveling family member has lost their passport or been detained abroad and needs an emergency fee wired immediately to the "consulate" to resolve it, using a fabricated or spoofed contact posing as consular staff. Real U.S. embassies and consulates do not request wired payments from family members back home; verifying through the State Department\'s official emergency contact line is the safe path.',
    categorySlug: 'family-emergency-scams',
    alertLevel: 'high',
    sources: ['U.S. Department of State'],
    sourceUrl: 'https://travel.state.gov/en/international-travel/travel-advisories/scams.html',
  },
  {
    name: 'Fake Family Member Car Accident Impound Fee Scam',
    slug: 'fake-family-car-accident-impound-fee-scam',
    description:
      'A caller claims a family member was in a car accident and their vehicle has been impounded, requiring an immediate release fee paid by phone before the family member can retrieve it or avoid additional charges, relying on the same urgency and secrecy pressure as other family-emergency scams. Impound fees, where real, are paid directly at the impound lot or through the local police department, never over the phone to an unverified caller.',
    categorySlug: 'family-emergency-scams',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice'],
    sourceUrl: 'https://consumer.ftc.gov/articles/scammers-use-fake-emergencies-steal-your-money',
  },
  {
    name: 'Fake Utility "Text-to-Pay" Phishing Link',
    slug: 'fake-utility-text-to-pay-phishing-link',
    description:
      'A text formatted like a routine bill-due reminder from a utility includes a payment link that leads to a fake payment page harvesting card details, exploiting how normalized text-based bill reminders and text-to-pay features have become with real utilities. Paying only through the utility\'s official app or website, typed in directly, avoids the fake link entirely.',
    categorySlug: 'utility-scams',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice'],
    sourceUrl: 'https://consumer.ftc.gov/articles/scammers-pretend-be-your-utility-company',
  },
  {
    name: 'Fake Community Solar Bill-Credit Scam',
    slug: 'fake-community-solar-credit-scam',
    description:
      'A solicitor offers enrollment in a "community solar" program claiming to provide guaranteed utility bill credits in exchange for a subscription fee or personal utility account access, but the program is not actually affiliated with any real community solar project or the utility, and the promised bill credits never materialize. Verifying a community solar offer directly with the local utility or state public utility commission before enrolling or sharing account access is the necessary check.',
    categorySlug: 'utility-scams',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice'],
    sourceUrl: 'https://consumer.ftc.gov/articles/scammers-pretend-be-your-utility-company',
  },
  {
    name: 'Fake Viatical/Life Settlement Investment Scam',
    slug: 'fake-life-settlement-viatical-investment-scam',
    description:
      'Investors are offered fractional shares in life insurance policies purchased from terminally ill or elderly policyholders — a real, legal financial product called a viatical or life settlement — promised a payout when the insured person dies, but the scheme is often fraudulent, with fabricated policies, falsified life expectancy estimates, or the same policy sold to multiple investors. These investments are illiquid and hard to value even when legitimate; verifying the specific policy and life expectancy estimate independently, not just through the seller, is essential.',
    categorySlug: 'investment-fraud',
    alertLevel: 'high',
    sources: ['SEC Office of Investor Education and Advocacy'],
    sourceUrl: 'https://www.investor.gov/protect-your-investments/fraud/types-fraud',
  },
  {
    name: 'Fake First Responder Memorial Fund Scam',
    slug: 'fake-first-responder-memorial-fund-scam',
    description:
      'After a police officer or firefighter is killed in the line of duty, a scammer sets up a fake memorial fund soliciting donations for the family, using real news coverage of the tragedy to appear legitimate, while the actual family may never see the money. Donating only through funds explicitly confirmed by the fallen officer\'s own department or an established organization like a state police benevolent association avoids this.',
    categorySlug: 'charity-scams',
    alertLevel: 'medium',
    sources: ['Federal Trade Commission'],
    sourceUrl: 'https://consumer.ftc.gov/all-scams/charity-scams',
  },
  {
    name: 'Fake Long-Term Care Insurance Rate Increase Scam',
    slug: 'fake-long-term-care-insurance-rate-scam',
    description:
      'A caller claims to represent a policyholder\'s long-term care insurer, stating a mandatory rate increase requires immediate payment or account verification to keep the policy active, when real rate changes are communicated through formal written notice from the actual insurer, not an unsolicited call demanding immediate payment. Confirming any claimed rate change directly with the insurer, using contact information from a real policy statement, is the safe check.',
    categorySlug: 'healthcare-fraud',
    alertLevel: 'medium',
    sources: ['National Association of Insurance Commissioners'],
    sourceUrl: 'https://www.naic.org/',
  },
  {
    name: 'Fake Ancestry DNA Test Data-Broker Scam',
    slug: 'fake-ancestry-dna-data-broker-scam',
    description:
      'A "free" DNA ancestry test kit offer collects a saliva sample along with extensive personal and family health information, but the company is not a legitimate genetic testing lab — it resells the collected DNA and personal data to data brokers or insurers rather than providing any real genealogy results. Using only well-established, name-brand DNA testing services with a clear, published privacy policy is the practical defense.',
    categorySlug: 'identity-theft',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice'],
    sourceUrl: 'https://consumer.ftc.gov/identity-theft-and-online-security/identity-theft',
  },
  {
    name: 'Fake Return Label Refund Scam',
    slug: 'fake-return-label-refund-scam',
    description:
      'A text or email claims a recent online return wasn\'t received and offers a "confirmation refund" link to resolve it, but the link harvests payment card details rather than issuing any real refund. Retailers process return refunds automatically once a shipment is scanned, without needing a customer to click a confirmation link; checking a return\'s status directly through the retailer\'s own order history is the safe way to confirm.',
    categorySlug: 'package-delivery-scams',
    alertLevel: 'low',
    sources: ['FTC Consumer Advice'],
    sourceUrl: 'https://consumer.ftc.gov/consumer-alerts/2025/04/think-text-message-usps-it-could-be-scam',
  },
  {
    name: 'Fake Cruise Ship Crew Job Fee Scam',
    slug: 'fake-cruise-ship-crew-job-fee-scam',
    description:
      'An ad offers high-paying cruise ship crew positions requiring an upfront fee for "training certification," a uniform, or a placement guarantee before the applicant can start — real cruise lines and staffing agencies do not charge job seekers a fee to be considered or hired for a position. Applying only through a cruise line\'s own verified careers page avoids this.',
    categorySlug: 'employment-scams',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice'],
    sourceUrl: 'https://consumer.ftc.gov/articles/job-scams',
  },
  {
    name: 'Fake Extended Auto Warranty Robocall',
    slug: 'fake-extended-auto-warranty-robocall',
    description:
      'A robocall claims your vehicle\'s warranty is about to expire and offers an extended vehicle service contract, often based on nothing more than the fact that most cars eventually age out of a factory warranty — the caller has no actual knowledge of your specific vehicle or its warranty status. This is one of the most complained-about robocall categories tracked by the FTC; hanging up and, if genuinely interested in coverage, contacting your dealer or a well-reviewed provider directly avoids the high-pressure pitch.',
    categorySlug: 'insurance-fraud',
    alertLevel: 'medium',
    sources: ['Federal Trade Commission'],
    sourceUrl: 'https://consumer.ftc.gov/consumer-alerts/2021/05/hang-auto-warranty-robocalls',
  },
  {
    name: 'Fake Professional Athlete Impersonation Romance Scam',
    slug: 'fake-athlete-impersonation-romance-scam',
    description:
      'A scammer creates a profile using a real professional athlete\'s stolen photos and a fabricated "secret" or "backup" social media account, building a relationship with a fan who believes they\'ve connected with the real athlete privately, before requesting money for a supposed emergency or travel to meet in person. Real athletes\' verified accounts and public representatives can confirm whether a second "private" account claiming to be them is genuine — it almost never is.',
    categorySlug: 'romance-scams',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice'],
    sourceUrl: 'https://consumer.ftc.gov/romance-scams',
  },
  {
    name: 'Fake Wholesale Liquidation Pallet Scam',
    slug: 'fake-wholesale-liquidation-pallet-scam',
    description:
      'A seller advertises "mystery" liquidation pallets from major retailers claimed to contain hundreds of dollars of returned merchandise for a fraction of the price, but buyers who pay receive nothing, a box of near-worthless items, or a pallet manifest that doesn\'t match what\'s shipped. Buying liquidation inventory only through the retailer\'s own verified liquidation marketplace or an established, reviewed wholesaler avoids this.',
    categorySlug: 'online-shopping-scams',
    alertLevel: 'low',
    sources: ['FTC Consumer Advice'],
    sourceUrl: 'https://consumer.ftc.gov/scams-online-sales-when-orders-dont-arrive',
  },
  {
    name: 'Fake "Free" VPN App Data-Harvesting Scam',
    slug: 'fake-vpn-app-data-harvesting-scam',
    description:
      'A free VPN app marketed as protecting privacy while browsing is actually designed to log and resell the user\'s browsing activity, or to install additional unwanted software, exploiting the trust placed in a tool specifically chosen for privacy. Checking independent security reviews and a provider\'s actual privacy policy, not just app store ratings, before installing any free VPN is the practical defense.',
    categorySlug: 'tech-support-scams',
    alertLevel: 'low',
    sources: ['FTC Consumer Advice'],
    sourceUrl: 'https://consumer.ftc.gov/articles/how-spot-avoid-and-report-tech-support-scams',
  },
  {
    name: 'Fake Background Check "Personal Report" Scam',
    slug: 'fake-background-check-personal-report-scam',
    description:
      'A site offers to run a "free" background check or reveal who has been searching for you, but requires a credit card for "verification" that instead enrolls the user in a recurring paid membership, and often compiles and displays whatever personal information it can scrape regardless of accuracy. Reading full terms before entering payment information for any "free" personal report, and checking bank statements for recurring charges, catches this early.',
    categorySlug: 'identity-theft',
    alertLevel: 'low',
    sources: ['FTC Consumer Advice'],
    sourceUrl: 'https://consumer.ftc.gov/identity-theft-and-online-security/identity-theft',
  },
  {
    name: 'Fake Church Building Fund Scam',
    slug: 'fake-church-building-fund-scam',
    description:
      'A caller or mailer claims to represent a local church or faith-based organization raising funds for a new building or disaster repair, using a name similar to a real, respected congregation, but the organization has no actual affiliation with any real church, and the funds go directly to the scammer. Verifying directly with the actual named church or its diocese or denomination before donating catches this.',
    categorySlug: 'charity-scams',
    alertLevel: 'low',
    sources: ['FTC Consumer Advice'],
    sourceUrl: 'https://consumer.ftc.gov/all-scams/charity-scams',
  },
  {
    name: 'Fake Hearing Aid "Free Trial" Scam',
    slug: 'fake-hearing-aid-free-trial-scam',
    description:
      'An ad offers a free trial of advanced hearing aids for seniors, but "activating" the trial requires a shipping and handling fee that turns out to enroll the buyer in an expensive recurring purchase plan for low-quality, non-medical-grade sound amplifiers rather than real hearing aids. A real audiologist evaluation and a known, established hearing aid provider are the safe path for anyone with genuine hearing loss concerns.',
    categorySlug: 'healthcare-fraud',
    alertLevel: 'low',
    sources: ['FTC Consumer Advice'],
    sourceUrl: 'https://consumer.ftc.gov/articles/what-know-about-medical-identity-theft',
  },
  {
    name: 'Fake Art Fractional-Ownership Investment Scam',
    slug: 'fake-art-fractional-ownership-scam',
    description:
      'A platform offers fractional ownership shares in a claimed valuable painting or sculpture, promising returns as the artwork appreciates, but the artwork\'s authenticity, valuation, or even existence is never independently verified, and investor funds are simply pocketed rather than used to acquire any real art. Independently verifying the specific artwork\'s provenance and appraisal through a recognized, unaffiliated expert is necessary before investing in any fractional art scheme.',
    categorySlug: 'investment-fraud',
    alertLevel: 'high',
    sources: ['SEC Office of Investor Education and Advocacy'],
    sourceUrl: 'https://www.investor.gov/protect-your-investments/fraud/types-fraud',
  },
  {
    name: 'Fake Influencer Brand Ambassador Fee Scam',
    slug: 'fake-influencer-brand-ambassador-fee-scam',
    description:
      'A message offers a paid "brand ambassador" opportunity promoting well-known products on social media, requiring the applicant to first purchase a starter kit of products at their own expense to "qualify," with promised reimbursement or commission that never materializes. Real brand ambassador programs are run directly through the company\'s own verified marketing or partnerships page and do not require upfront personal purchases.',
    categorySlug: 'employment-scams',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice'],
    sourceUrl: 'https://consumer.ftc.gov/articles/job-scams',
  },
  {
    name: 'UK TV Licensing Phishing Email',
    slug: 'uk-tv-licensing-phishing-email',
    description:
      'An email impersonating TV Licensing — the UK body that collects the mandatory television license fee — claims a payment failed or a refund is due, linking to a fake page that harvests bank details, exploiting the fact that nearly every UK household holds a real TV license. TV Licensing communicates real payment issues through post, not urgent email links demanding immediate card details.',
    categorySlug: 'phishing',
    country: 'GB',
    alertLevel: 'medium',
    sources: ['UK Action Fraud'],
    sourceUrl: 'https://www.reportfraud.police.uk/',
  },
  {
    name: 'UK HMRC Tax Rebate Text Scam',
    slug: 'uk-hmrc-tax-rebate-text-scam',
    description:
      'A text claims to be from HMRC (Her Majesty\'s Revenue and Customs) offering a tax rebate, linking to a fake gov.uk look-alike page that harvests banking and personal details. HMRC does not notify tax rebates by text message with a link — genuine rebates are handled through a person\'s own online tax account or by post.',
    categorySlug: 'tax-scams',
    country: 'GB',
    alertLevel: 'medium',
    sources: ['UK Action Fraud', 'HM Revenue & Customs'],
    sourceUrl: 'https://www.reportfraud.police.uk/',
  },
  {
    name: 'UK Royal Mail "Failed Delivery" SMS Scam',
    slug: 'uk-royal-mail-failed-delivery-scam',
    description:
      'A text impersonating Royal Mail claims a parcel could not be delivered due to an outstanding customs or redelivery fee, linking to a fake payment page that harvests card details — one of the most-reported smishing patterns in the UK according to Action Fraud. Royal Mail does not request card payments via a text link for redelivery.',
    categorySlug: 'package-delivery-scams',
    country: 'GB',
    alertLevel: 'medium',
    sources: ['UK Action Fraud'],
    sourceUrl: 'https://www.reportfraud.police.uk/',
  },
  {
    name: 'Canadian CRA Arrest Threat Call',
    slug: 'canada-cra-arrest-threat-call',
    description:
      'A caller impersonating the Canada Revenue Agency claims the recipient owes back taxes and threatens immediate arrest or deportation unless paid via gift card or cryptocurrency, mirroring the well-documented U.S. IRS impersonation pattern but using CRA branding specific to Canadian taxpayers. The CRA does not threaten immediate arrest over the phone or demand payment by gift card.',
    categorySlug: 'tax-scams',
    country: 'CA',
    alertLevel: 'high',
    sources: ['Canadian Anti-Fraud Centre'],
    sourceUrl: 'https://antifraudcentre-centreantifraude.ca/scams-fraudes/extortion-extorsion-eng.htm#a10',
  },
  {
    name: 'Canadian Grandparent Emergency Scam',
    slug: 'canada-grandparent-emergency-scam',
    description:
      'A caller poses as a grandchild in legal trouble in Canada — often claiming a car accident or arrest — asking the grandparent not to tell other family members and requesting money for bail or legal fees, sent via e-transfer or through a courier who collects cash in person. The Canadian Anti-Fraud Centre has tracked this as one of the costliest fraud categories affecting Canadian seniors for years; verifying independently with another family member before sending anything breaks the scam.',
    categorySlug: 'family-emergency-scams',
    country: 'CA',
    alertLevel: 'critical',
    sources: ['Canadian Anti-Fraud Centre'],
    sourceUrl: 'https://antifraudcentre-centreantifraude.ca/scams-fraudes/emergency-urgence-eng.htm',
  },
  {
    name: 'Australian myGov Phishing SMS Scam',
    slug: 'australia-mygov-phishing-sms-scam',
    description:
      'A text claims a problem with the recipient\'s myGov account — Australia\'s centralized portal for Medicare, Centrelink, and tax services — and links to a fake myGov login page harvesting credentials that can then expose Medicare, tax, and welfare payment details all at once. Services Australia and the ATO do not send links to verify myGov login details by SMS.',
    categorySlug: 'government-impersonation',
    country: 'AU',
    alertLevel: 'high',
    sources: ['Scamwatch (Australian Competition and Consumer Commission)'],
    sourceUrl: 'https://www.scamwatch.gov.au/types-of-scams/phishing-scams',
  },
  {
    name: 'Australian Toll Road SMS Scam',
    slug: 'australia-toll-road-sms-scam',
    description:
      'A text impersonating an Australian toll operator like Linkt claims an unpaid toll invoice is overdue and links to a fake payment page harvesting card details — closely mirroring similar toll-scam texts reported across the US and UK, but branded for Australian toll networks specifically. Real toll invoices are managed through the toll operator\'s own app or account portal, not an SMS link.',
    categorySlug: 'phishing',
    country: 'AU',
    alertLevel: 'medium',
    sources: ['Scamwatch (Australian Competition and Consumer Commission)'],
    sourceUrl: 'https://www.scamwatch.gov.au/types-of-scams/phishing-scams',
  },
  {
    name: 'Indian "Digital Arrest" Scam Call',
    slug: 'india-digital-arrest-scam-call',
    description:
      'A caller impersonating Indian police, customs, or the CBI claims the victim\'s identity was used in a crime — often drug trafficking or money laundering — and orders them to stay on a video call continuously in a so-called "digital arrest," while transferring their savings to a "verification" account to avoid immediate arrest. This has become one of the most financially damaging scam patterns reported in India in recent years; real law enforcement never conducts an arrest or investigation entirely over a video call.',
    categorySlug: 'government-impersonation',
    country: 'IN',
    alertLevel: 'critical',
    sources: ['Indian Cyber Crime Coordination Centre (I4C)'],
    sourceUrl: 'https://i4c.mha.gov.in/',
  },
  {
    name: 'German "New Number" WhatsApp Family Scam',
    slug: 'germany-whatsapp-family-member-scam',
    description:
      'A message on WhatsApp claims to be from a family member using a new phone number after losing or breaking their old one, and shortly after establishing contact asks for an urgent transfer to pay a bill on their behalf — a modern, text-based evolution of Germany\'s long-running "Enkeltrick" (grandchild trick) phone scam. Calling the family member at their previously known number, not the new one texting, breaks the scam.',
    categorySlug: 'family-emergency-scams',
    country: 'DE',
    alertLevel: 'high',
    sources: ['German Federal Criminal Police Office (BKA)'],
    sourceUrl: 'https://www.bka.de/SharedDocs/Kurzmeldungen/DE/Warnhinweise/230524_Schockanrufe.html',
  },
  {
    name: 'Irish Revenue Tax Refund Phishing Text',
    slug: 'ireland-revenue-tax-refund-phishing-text',
    description:
      'A text impersonating Ireland\'s Revenue Commissioners claims a tax refund is available through the myAccount portal, linking to a fake login page that harvests PPS numbers and banking details. Revenue does not request personal or banking information via text message links — refunds are processed directly through a taxpayer\'s own verified myAccount login.',
    categorySlug: 'tax-scams',
    country: 'IE',
    alertLevel: 'medium',
    sources: ['Ireland Revenue Commissioners', 'An Garda Síochána'],
    sourceUrl: 'https://www.revenue.ie/en/corporate/communications/fraudulent-emails/index.aspx',
  },
  {
    name: 'Irish An Post Delivery Fee Scam',
    slug: 'ireland-an-post-delivery-fee-scam',
    description:
      'A text impersonating An Post, Ireland\'s postal service, claims a parcel requires a small customs or redelivery fee, linking to a fake payment page that harvests card details — one of the most widely reported smishing campaigns in Ireland according to An Garda Síochána. An Post does not request card payments through unsolicited text links.',
    categorySlug: 'package-delivery-scams',
    country: 'IE',
    alertLevel: 'medium',
    sources: ['An Garda Síochána'],
    sourceUrl: 'https://www.garda.ie/en/crime/fraud/',
  },
  {
    name: 'Singapore Government Official Impersonation Scam',
    slug: 'singapore-government-official-impersonation-scam',
    description:
      'A caller impersonates a Singapore government official — often claiming to be from the police, the Immigration & Checkpoints Authority, or a bank — alleging the victim\'s identity was used in a crime and demanding funds be transferred to a "safe" government account for verification. Singapore\'s police and government agencies never ask the public to transfer money to a "safe account," and have run extensive public campaigns, including the ScamShield app, specifically warning against this exact pattern.',
    categorySlug: 'government-impersonation',
    country: 'SG',
    alertLevel: 'critical',
    sources: ['Singapore Police Force', 'ScamShield (Singapore)'],
    sourceUrl: 'https://www.scamshield.gov.sg/i-want-protection-from-scams/learn-to-recognise-scams/government-officials-impersonation-scams/',
  },
  {
    name: 'Japanese "It\'s Me" Phone Fraud (Ore Ore Sagi)',
    slug: 'japan-ore-ore-sagi-phone-fraud',
    description:
      'A caller claims to be a victim\'s son or grandson in urgent trouble — often citing a workplace mistake, accident, or missed payment — and asks for money to be transferred or handed to a courier immediately, deliberately not stating a name so the elderly victim fills in the blank themselves. Known in Japan as "Ore Ore Sagi" (roughly "it\'s me, it\'s me" fraud), it has been one of the country\'s most persistent fraud categories for over two decades; confirming with the family member directly, at their own known number, breaks the scam.',
    categorySlug: 'family-emergency-scams',
    country: 'JP',
    alertLevel: 'critical',
    sources: ['Japan National Police Agency'],
    sourceUrl: 'https://www.npa.go.jp/bureau/safetylife/sos47/case/oreore/',
  },
  {
    name: 'Dutch WhatsApp Bank Verification Scam',
    slug: 'netherlands-whatsapp-bank-verification-scam',
    description:
      'A message impersonating a Dutch bank via WhatsApp or SMS claims suspicious activity was detected and asks the recipient to confirm a code or click a link to "secure" their account — the code requested is actually the one-time code needed to authorize a real transaction the scammer is initiating. Dutch banks never ask customers to share a verification code received by text; Fraudehelpdesk has flagged this as one of the most common scam reports in the Netherlands.',
    categorySlug: 'account-takeover',
    country: 'NL',
    alertLevel: 'high',
    sources: ['Fraudehelpdesk (Netherlands)'],
    sourceUrl: 'https://www.fraudehelpdesk.nl/fraude/ik-ben-gehackt/',
  },
  {
    name: 'Swedish BankID Phishing Call Scam',
    slug: 'sweden-bankid-phishing-call-scam',
    description:
      'A caller impersonating a bank or government agency convinces the victim to open their BankID app and approve a login or transaction request, framing it as identity verification, while the approval actually authorizes the scammer\'s own fraudulent transfer from the victim\'s account. BankID is Sweden\'s near-universal digital identification system, which makes tricking someone into approving a single request especially damaging; Swedish police advise never approving a BankID request triggered by an unexpected phone call.',
    categorySlug: 'account-takeover',
    country: 'SE',
    alertLevel: 'critical',
    sources: ['Polisen (Swedish Police Authority)'],
    sourceUrl: 'https://polisen.se/utsatt-for-brott/polisanmalan/bedragerier/bedragerier/identitetsbedrageri/',
  },
  {
    name: 'New Zealand Inland Revenue Refund Scam',
    slug: 'newzealand-ird-refund-scam',
    description:
      'A text or email impersonating New Zealand\'s Inland Revenue Department claims a tax refund is ready and links to a fake myIR login page that harvests personal and banking details. IRD does not request bank account confirmation through unsolicited text or email links; genuine refunds are visible directly in a taxpayer\'s own myIR account.',
    categorySlug: 'tax-scams',
    country: 'NZ',
    alertLevel: 'medium',
    sources: ['New Zealand Inland Revenue', 'Netsafe'],
    sourceUrl: 'https://www.ird.govt.nz/managing-my-tax/scams/signs-of-a-scam',
  },
  {
    name: 'French "Arnaque au Président" CEO Fraud',
    slug: 'france-arnaque-au-president-ceo-fraud',
    description:
      'Known in France as "l\'arnaque au président" (the president scam), a fraudster impersonates a company\'s CEO or president, often using a spoofed email or a cloned voice, to pressure an employee — usually in finance — into an urgent, confidential wire transfer, exploiting French corporate culture\'s deference to executive authority. French police and Info Escroqueries have tracked this as a leading cause of major corporate fraud losses in France since it first came to wide public attention in the early 2010s; any urgent, secretive wire request should be verified through a separate, independently obtained contact method.',
    categorySlug: 'business-email-compromise',
    country: 'FR',
    alertLevel: 'high',
    sources: ['Info Escroqueries (France)'],
    sourceUrl: 'https://www.police-nationale.interieur.gouv.fr/actualite/info-escroqueries-plate-forme-pour-signaler-escroqueries-sur-internet',
  },
  {
    name: 'French CAF Family Benefits Phishing Text',
    slug: 'france-caf-benefits-phishing-text',
    description:
      'A text impersonating the CAF (Caisse d\'Allocations Familiales), which administers French family and housing benefits, claims a payment is blocked pending identity verification and links to a fake caf.fr login page harvesting personal and banking details. CAF communicates real account issues through a beneficiary\'s own verified online account or by post, not unsolicited text links.',
    categorySlug: 'public-benefits-fraud',
    country: 'FR',
    alertLevel: 'medium',
    sources: ['Info Escroqueries (France)'],
    sourceUrl: 'https://www.police-nationale.interieur.gouv.fr/actualite/info-escroqueries-plate-forme-pour-signaler-escroqueries-sur-internet',
  },
  {
    name: 'UK Bank "Safe Account" Impersonation Scam',
    slug: 'uk-bank-safe-account-impersonation-scam',
    description:
      'A caller impersonating a UK bank\'s fraud department claims the victim\'s account has been compromised and instructs them to transfer all funds to a new "safe account" to protect it — the new account is actually controlled by the scammer. UK banks and Action Fraud have run extensive public warnings that no legitimate bank will ever ask a customer to move money to a different account for safekeeping.',
    categorySlug: 'account-takeover',
    country: 'GB',
    alertLevel: 'critical',
    sources: ['UK Action Fraud', 'UK Finance'],
    sourceUrl: 'https://www.reportfraud.police.uk/',
  },
  {
    name: 'Canadian Interac e-Transfer Phishing Scam',
    slug: 'canada-interac-etransfer-scam',
    description:
      'A text or email claims a Canadian Interac e-Transfer payment is waiting and links to a fake bank login page to "accept" the funds, harvesting online banking credentials — exploiting how routine e-Transfer notifications are in everyday Canadian banking. Real e-Transfer deposits are accepted directly within a person\'s own banking app, never through a link in an unsolicited text.',
    categorySlug: 'phishing',
    country: 'CA',
    alertLevel: 'medium',
    sources: ['Canadian Anti-Fraud Centre'],
    sourceUrl: 'https://antifraudcentre-centreantifraude.ca/scams-fraudes/phishing-hameconnage-eng.htm',
  },
  {
    name: 'Australian NBN Co Internet Disconnection Scam',
    slug: 'australia-nbn-disconnection-scam',
    description:
      'A caller impersonating NBN Co, Australia\'s national broadband network provider, claims the victim\'s internet connection has been compromised or is about to be disconnected due to a technical issue, requesting remote access to their computer to "fix" it. NBN Co does not call customers directly to request remote access — it works only through a customer\'s own retail internet provider.',
    categorySlug: 'tech-support-scams',
    country: 'AU',
    alertLevel: 'medium',
    sources: ['Scamwatch (Australian Competition and Consumer Commission)'],
    sourceUrl: 'https://www.scamwatch.gov.au/about-us/news-and-alerts/watch-out-for-nbn-scams',
  },
  {
    name: 'German Schufa Credit Score Phishing Email',
    slug: 'germany-schufa-credit-score-phishing-email',
    description:
      'An email impersonating Schufa, Germany\'s dominant credit bureau, claims a negative entry has been added to the recipient\'s credit file and links to a fake login page requesting personal ID and banking details to "dispute" it. Schufa communicates real changes to a credit file by post or through a consumer\'s own verified online account, not an emailed dispute link.',
    categorySlug: 'identity-theft',
    country: 'DE',
    alertLevel: 'medium',
    sources: ['SCHUFA'],
    sourceUrl: 'https://www.schufa.de/newsroom/internetbetrug/phishing-vorsicht-betrug-schufa-mails/',
  },
  {
    name: 'Japanese Convenience Store Prepaid Card Payment Scam',
    slug: 'japan-konbini-prepaid-card-scam',
    description:
      'A caller or message instructs the victim to purchase prepaid cards at a local convenience store (konbini) and read the card codes over the phone to pay a supposed unpaid bill, tax debt, or legal fee — a payment method Japan\'s National Police Agency specifically warns is never used by any legitimate biller. No government agency or real company in Japan accepts prepaid convenience-store card codes as payment.',
    categorySlug: 'government-impersonation',
    country: 'JP',
    alertLevel: 'high',
    sources: ['Japan National Police Agency'],
    sourceUrl: 'https://www.npa.go.jp/bureau/safetylife/sos47/case/fictitious-billing/',
  },
  {
    name: 'Indian Fake Courier / Customs Parcel Scam',
    slug: 'india-courier-customs-parcel-scam',
    description:
      'A call or message claims a parcel addressed to the victim was intercepted by customs and found to contain illegal items or unpaid duty, demanding an immediate payment or personal and banking details to release it or avoid police involvement — frequently escalating into the broader "digital arrest" pattern once initial payment is made. India\'s cybercrime authorities note this scam often specifically targets people who have never ordered anything, relying on fear alone rather than any real shipment.',
    categorySlug: 'government-impersonation',
    country: 'IN',
    alertLevel: 'high',
    sources: ['Indian Cyber Crime Coordination Centre (I4C)'],
    sourceUrl: 'https://i4c.mha.gov.in/',
  },
  {
    name: 'UK Pension Liberation / Early Access Scam',
    slug: 'uk-pension-liberation-scam',
    description:
      'A cold call or advert offers to help someone access their UK pension savings before the legal minimum age, promising a loophole or "liberation" scheme, but the transfer instead moves the pension into a fraudulent or high-risk unregulated investment, often triggering a large tax penalty on top of the loss. The Financial Conduct Authority and Action Fraud have run long-running "ScamSmart" campaigns specifically warning about unsolicited pension transfer offers.',
    categorySlug: 'investment-fraud',
    country: 'GB',
    alertLevel: 'high',
    sources: ['UK Financial Conduct Authority', 'UK Action Fraud'],
    sourceUrl: 'https://www.fca.org.uk/consumers/protect-yourself-scams',
  },
  {
    name: 'Dutch DigiD Phishing Scam',
    slug: 'netherlands-digid-phishing-scam',
    description:
      'A text or email impersonating DigiD, the Dutch government\'s digital identity system used to access tax, healthcare, and benefits accounts, claims the account needs urgent reactivation and links to a fake login page harvesting DigiD credentials — which can then expose a person\'s full range of government service accounts at once. The Dutch government never asks for DigiD login details by email or text link.',
    categorySlug: 'government-impersonation',
    country: 'NL',
    alertLevel: 'high',
    sources: ['Fraudehelpdesk (Netherlands)'],
    sourceUrl: 'https://www.fraudehelpdesk.nl/alert/valse-sms-namens-digid/',
  },
  {
    name: 'Singapore SingPass Phishing Scam',
    slug: 'singapore-singpass-phishing-scam',
    description:
      'A text or email impersonating SingPass, Singapore\'s national digital identity system, claims the account has been flagged for suspicious activity and links to a fake login page harvesting credentials that can unlock access to government, banking, and healthcare services tied to a person\'s SingPass. The Singapore government does not request SingPass credentials through unsolicited text or email links.',
    categorySlug: 'government-impersonation',
    country: 'SG',
    alertLevel: 'high',
    sources: ['Singapore Police Force', 'GovTech Singapore'],
    sourceUrl: 'https://www.scamshield.gov.sg/i-want-protection-from-scams/learn-to-recognise-scams/government-officials-impersonation-scams/',
  },
  {
    name: 'Australian Centrelink Payment Suspension Scam',
    slug: 'australia-centrelink-suspension-scam',
    description:
      'A text or call impersonating Centrelink, Australia\'s welfare payment agency, claims a benefit payment has been suspended pending identity verification and directs the recipient to a fake myGov-style page or asks for personal details over the phone. Services Australia manages real Centrelink account issues through a person\'s own myGov account, not unsolicited links or cold calls demanding immediate verification.',
    categorySlug: 'public-benefits-fraud',
    country: 'AU',
    alertLevel: 'medium',
    sources: ['Scamwatch (Australian Competition and Consumer Commission)', 'Services Australia'],
    sourceUrl: 'https://www.scamwatch.gov.au/',
  },
  {
    name: 'Canadian CBSA Package Seizure Scam',
    slug: 'canada-cbsa-package-seizure-scam',
    description:
      'A call or text impersonating the Canada Border Services Agency claims a package addressed to the victim was seized for containing prohibited items and demands an immediate fine or personal information to resolve it, mirroring similar customs-impersonation scams reported internationally but using Canadian border agency branding specifically. The CBSA does not resolve seizure cases by phone call demanding immediate payment.',
    categorySlug: 'government-impersonation',
    country: 'CA',
    alertLevel: 'medium',
    sources: ['Canadian Anti-Fraud Centre'],
    sourceUrl: 'https://antifraudcentre-centreantifraude.ca/scams-fraudes/extortion-extorsion-eng.htm',
  },
  {
    name: 'Irish Bank Fraud Department Impersonation Call',
    slug: 'ireland-bank-fraud-department-scam',
    description:
      'A caller impersonating a customer\'s Irish bank claims fraudulent activity has been detected and instructs them to move their money to a new "safe" account or to read out a one-time SMS passcode to "verify" their identity — the code is then used to authorize a real fraudulent transfer. Irish banks and An Garda Síochána have run repeated public warnings that a bank will never ask a customer to move funds to another account or share a one-time passcode over the phone.',
    categorySlug: 'account-takeover',
    country: 'IE',
    alertLevel: 'critical',
    sources: ['An Garda Síochána', 'Banking & Payments Federation Ireland'],
    sourceUrl: 'https://www.garda.ie/en/crime/fraud/',
  },
  {
    name: 'Swedish Swish Payment Scam',
    slug: 'sweden-swish-payment-scam',
    description:
      'A seller on a Swedish online marketplace asks a buyer to send payment via Swish, the country\'s near-universal mobile payment app, before shipping an item, then never delivers it — or a scammer posing as a buyer sends a fake "Swish confirmation" screenshot claiming payment was sent when it wasn\'t. Because Swish transfers are instant and difficult to reverse, confirming an actual balance change in one\'s own banking app, not a screenshot, before releasing goods is the necessary check.',
    categorySlug: 'online-shopping-scams',
    country: 'SE',
    alertLevel: 'medium',
    sources: ['Polisen (Swedish Police Authority)'],
    sourceUrl: 'https://polisen.se/utsatt-for-brott/polisanmalan/bedragerier/bedragerier/annonsbedrageri/',
  },
  {
    name: 'NZ Vehicle Registration Renewal Scam',
    slug: 'newzealand-vehicle-rego-renewal-scam',
    description:
      'A text or email impersonating Waka Kotahi NZ Transport Agency claims a vehicle registration is about to expire and links to a fake payment page harvesting card details, exploiting how routine rego renewal reminders already come by text in New Zealand. Real registration renewal is completed only through the official Waka Kotahi website or in person, not a link in an unsolicited message.',
    categorySlug: 'government-impersonation',
    country: 'NZ',
    alertLevel: 'low',
    sources: ['Netsafe (New Zealand)'],
    sourceUrl: 'https://netsafe.org.nz/',
  },
  {
    name: 'French Ameli Health Insurance Phishing Scam',
    slug: 'france-ameli-health-insurance-phishing-scam',
    description:
      'An email or text impersonating Ameli, the online portal for France\'s national health insurance system, claims a reimbursement is pending and links to a fake login page harvesting social security numbers and banking details. Ameli communicates real reimbursement information directly through a person\'s own verified account, not an unsolicited link.',
    categorySlug: 'healthcare-fraud',
    country: 'FR',
    alertLevel: 'medium',
    sources: ['Info Escroqueries (France)'],
    sourceUrl: 'https://www.police-nationale.interieur.gouv.fr/actualite/info-escroqueries-plate-forme-pour-signaler-escroqueries-sur-internet',
  },
  {
    name: 'Japanese LINE App Impersonation Scam',
    slug: 'japan-line-app-impersonation-scam',
    description:
      'A message on LINE, Japan\'s dominant messaging app, claims to be from a friend or family member whose account was hijacked, asking the recipient to buy digital gift cards and send the codes to help them out of an urgent situation — the request actually comes from someone who has taken over the real friend\'s LINE account. Confirming through a separate channel, such as a phone call, before buying any gift card for a "friend in trouble" breaks the scam.',
    categorySlug: 'account-takeover',
    country: 'JP',
    alertLevel: 'high',
    sources: ['Japan National Police Agency'],
    sourceUrl: 'https://www.npa.go.jp/bureau/cyber/countermeasures/unauthorized-access.html',
  },
  {
    name: 'German Zoll (Customs) Parcel Fee Scam',
    slug: 'germany-zoll-customs-parcel-scam',
    description:
      'A text or email impersonating German customs (Zoll) claims an international parcel is being held pending a customs duty payment and links to a fake payment page harvesting card details. German customs does not request duty payments through unsolicited text or email links — genuine customs charges are billed through the shipping carrier or collected on delivery.',
    categorySlug: 'package-delivery-scams',
    country: 'DE',
    alertLevel: 'medium',
    sources: ['German Federal Criminal Police Office (BKA)'],
    sourceUrl: 'https://www.bka.de/',
  },
  {
    name: 'Australian Superannuation Early Release Scam',
    slug: 'australia-superannuation-early-release-scam',
    description:
      'A cold call or online ad offers to help someone access their superannuation retirement savings early through a supposed loophole, but the funds are instead transferred into a fraudulent self-managed super fund or an unrecognized investment, often triggering a large tax penalty in addition to the loss. The Australian Taxation Office and Scamwatch have repeatedly warned that early super access is tightly restricted by law, and any unsolicited offer to "unlock" it early is almost certainly fraudulent.',
    categorySlug: 'investment-fraud',
    country: 'AU',
    alertLevel: 'high',
    sources: ['Scamwatch (Australian Competition and Consumer Commission)', 'Australian Taxation Office'],
    sourceUrl: 'https://www.scamwatch.gov.au/types-of-scams/investment-scams',
  },
  {
    name: 'Singapore WhatsApp Job Scam',
    slug: 'singapore-whatsapp-job-scam',
    description:
      'A WhatsApp message offers an easy, high-paying part-time job — often "liking" social media posts or writing product reviews — that pays small amounts at first to build trust, then asks the worker to deposit their own money into a linked account to unlock larger "bonus tasks," money that is never returned. The Singapore Police Force has flagged these job scams as one of the most costly to residents in recent years; any job requiring an upfront personal deposit is not real employment.',
    categorySlug: 'employment-scams',
    country: 'SG',
    alertLevel: 'high',
    sources: ['Singapore Police Force'],
    sourceUrl: 'https://www.scamshield.gov.sg/i-want-protection-from-scams/learn-to-recognise-scams/job-scams/',
  },
  {
    name: 'Dutch Marktplaats Fake Payment Link Scam',
    slug: 'netherlands-marktplaats-payment-link-scam',
    description:
      'A buyer on Marktplaats, the Netherlands\' largest online marketplace, sends the seller a link claiming to be the platform\'s official secure payment service, but the link leads to a fake page that steals the seller\'s banking login instead of transferring any payment. Marktplaats does not require sellers to click an external link to receive payment; genuine transactions are completed inside the platform\'s own system.',
    categorySlug: 'online-shopping-scams',
    country: 'NL',
    alertLevel: 'medium',
    sources: ['Fraudehelpdesk (Netherlands)'],
    sourceUrl: 'https://www.fraudehelpdesk.nl/fraude-abc/webshop-betrouwbaar/',
  },
  {
    name: 'Indian Fake Instant Loan App Scam',
    slug: 'india-fake-loan-app-scam',
    description:
      'A mobile app offers instant, no-collateral personal loans with minimal verification, but after disbursing a small amount, demands repayment at extreme interest within days and threatens to contact the borrower\'s phone contacts with doctored, humiliating messages unless paid immediately — having harvested the phone\'s full contact list and photos as a condition of installing the app. India\'s Reserve Bank and cybercrime authorities have specifically warned against loan apps not listed with a registered NBFC; checking an app\'s RBI registration before installing is the necessary safeguard.',
    categorySlug: 'debt-relief-scams',
    country: 'IN',
    alertLevel: 'critical',
    sources: ['Reserve Bank of India (via Press Information Bureau)', 'Indian Cyber Crime Coordination Centre (I4C)'],
    sourceUrl: 'https://www.pib.gov.in/PressReleaseIframePage.aspx?PRID=1683572',
  },
  {
    name: 'Canadian Immigration (IRCC) Deportation Threat Scam',
    slug: 'canada-ircc-deportation-threat-scam',
    description:
      'A caller impersonating Immigration, Refugees and Citizenship Canada or the Canada Border Services Agency claims a problem with the victim\'s visa or immigration status and threatens immediate deportation unless a fee is paid or personal documents are provided over the phone. IRCC does not resolve immigration status issues by phone call demanding immediate payment; genuine case updates come through a person\'s own secure IRCC account.',
    categorySlug: 'government-impersonation',
    country: 'CA',
    alertLevel: 'high',
    sources: ['Canadian Anti-Fraud Centre'],
    sourceUrl: 'https://antifraudcentre-centreantifraude.ca/scams-fraudes/extortion-extorsion-eng.htm',
  },
  {
    name: 'Irish Utility Disconnection Scam',
    slug: 'ireland-utility-disconnection-scam',
    description:
      'A caller impersonating an Irish energy provider claims an overdue bill will result in same-day disconnection unless paid immediately via an unusual payment method like a prepaid voucher. Irish energy regulator rules require multiple written disconnection notices in advance; a same-day phone threat is not how a real disconnection process works.',
    categorySlug: 'utility-scams',
    country: 'IE',
    alertLevel: 'medium',
    sources: ['An Garda Síochána', 'Commission for Regulation of Utilities (Ireland)'],
    sourceUrl: 'https://www.garda.ie/en/crime/fraud/',
  },
  {
    name: 'Swedish Pension Authority Phishing Scam',
    slug: 'sweden-pensionsmyndigheten-phishing-scam',
    description:
      'An email or text impersonating Pensionsmyndigheten, Sweden\'s national pension agency, claims a pension recalculation requires the recipient to log in through a provided link, harvesting BankID or personal identification details. The agency communicates real changes to pension payments through a person\'s own verified account or by post, not an unsolicited link.',
    categorySlug: 'government-impersonation',
    country: 'SE',
    alertLevel: 'medium',
    sources: ['Polisen (Swedish Police Authority)'],
    sourceUrl: 'https://polisen.se/utsatt-for-brott/polisanmalan/bedragerier/bedragerier/telefonbedrageri/',
  },
  {
    name: 'German Rundfunkbeitrag (Broadcasting Fee) Threat Scam',
    slug: 'germany-rundfunkbeitrag-phishing-scam',
    description:
      'An email or letter impersonating the collection service for Germany\'s mandatory Rundfunkbeitrag broadcasting fee claims an overdue payment and threatens immediate legal action or a bailiff visit unless paid via an unusual method like a prepaid card, exploiting the fact that nearly every German household is legally required to pay this fee. The real collection service sends formal written reminders through standard channels, not urgent threats demanding an unusual payment method by phone or email.',
    categorySlug: 'government-impersonation',
    country: 'DE',
    alertLevel: 'medium',
    sources: ['German Federal Office for Information Security (BSI)'],
    sourceUrl: 'https://www.bsi.bund.de/DE/Themen/Verbraucherinnen-und-Verbraucher/Cyber-Sicherheitslage/Methoden-der-Cyber-Kriminalitaet/Spam-Phishing-Co/Gefaelschte-Absenderadressen/gefaelschte-absenderadressen_node.html',
  },
  {
    name: 'Japanese ATM "Refund" Scam',
    slug: 'japan-atm-refund-scam',
    description:
      'A caller claims the victim is owed a refund for an overpaid utility or insurance premium and instructs them to go to a nearby ATM, insisting the "refund" can only be processed by following on-screen steps at the machine — in reality, the steps performed transfer money out of the victim\'s account to the scammer rather than depositing any refund in. Japanese banks and police have specifically warned that no legitimate refund is ever processed through ATM instructions given over the phone.',
    categorySlug: 'utility-scams',
    country: 'JP',
    alertLevel: 'high',
    sources: ['Japan National Police Agency'],
    sourceUrl: 'https://www.npa.go.jp/bureau/safetylife/sos47/',
  },
  {
    name: 'NZ Trade Me Marketplace Payment Link Scam',
    slug: 'newzealand-trademe-payment-scam',
    description:
      'A buyer on Trade Me, New Zealand\'s largest online marketplace, sends the seller a link claiming to be an official secure payment or shipping service, but the link leads to a fake page designed to steal banking credentials rather than complete any real transaction. Trade Me transactions are completed within the platform\'s own system; sellers should never need to click an external link to receive payment.',
    categorySlug: 'online-shopping-scams',
    country: 'NZ',
    alertLevel: 'medium',
    sources: ['Netsafe (New Zealand)'],
    sourceUrl: 'https://netsafe.org.nz/online-safety-at-home/shopping-online-safely',
  },
  {
    name: 'Indian UPI QR Code "Receive Payment" Scam',
    slug: 'india-upi-qr-code-scam',
    description:
      'A scammer posing as a buyer on a classifieds site sends a QR code and tells the seller to scan it "to receive payment," but scanning a UPI QR code and entering a PIN always authorizes an outgoing payment, never an incoming one — so the seller unknowingly pays the scammer instead of getting paid. India\'s National Payments Corporation and cybercrime authorities have repeatedly clarified that receiving money via UPI never requires scanning a code or entering a PIN.',
    categorySlug: 'online-shopping-scams',
    country: 'IN',
    alertLevel: 'high',
    sources: ['Indian Cyber Crime Coordination Centre (I4C)', 'National Payments Corporation of India'],
    sourceUrl: 'https://i4c.mha.gov.in/',
  },
  {
    name: 'UK DVLA Vehicle Tax Refund Scam',
    slug: 'uk-dvla-vehicle-tax-refund-scam',
    description:
      'A text or email impersonating the DVLA claims a vehicle tax refund is owed and links to a fake gov.uk-style page harvesting banking details. The DVLA issues real refunds automatically to the account on file when a vehicle is sold or taxed incorrectly, without requiring the recipient to click a link or provide card details.',
    categorySlug: 'government-impersonation',
    country: 'GB',
    alertLevel: 'medium',
    sources: ['UK Action Fraud'],
    sourceUrl: 'https://www.reportfraud.police.uk/',
  },
  {
    name: 'French Colissimo Delivery Fee Scam',
    slug: 'france-colissimo-delivery-scam',
    description:
      'A text impersonating Colissimo, the parcel delivery service of France\'s postal operator La Poste, claims a package requires a small redelivery fee and links to a fake payment page harvesting card details — one of the most reported smishing campaigns tracked by French authorities. Colissimo does not request card payments through unsolicited text links.',
    categorySlug: 'package-delivery-scams',
    country: 'FR',
    alertLevel: 'medium',
    sources: ['Info Escroqueries (France)'],
    sourceUrl: 'https://www.police-nationale.interieur.gouv.fr/actualite/info-escroqueries-plate-forme-pour-signaler-escroqueries-sur-internet',
  },
  {
    name: 'Indian Matrimonial Website Romance Scam',
    slug: 'india-matrimonial-website-scam',
    description:
      'A fake profile on a matrimonial website — often claiming to be a non-resident Indian professional living abroad — builds a relationship toward marriage over weeks, then requests money for a fabricated emergency, a customs fee on a gift shipment, or travel costs to visit in person. India\'s cybercrime authorities have specifically flagged matrimonial-site fraud as distinct from general dating scams, since the marriage-intent framing lowers a victim\'s guard faster than a casual dating context does.',
    categorySlug: 'romance-scams',
    country: 'IN',
    alertLevel: 'high',
    sources: ['Indian Cyber Crime Coordination Centre (I4C)'],
    sourceUrl: 'https://i4c.mha.gov.in/',
  },
  {
    name: 'Swedish Klarna Fake Invoice Scam',
    slug: 'sweden-klarna-fake-invoice-scam',
    description:
      'A letter or email impersonating Klarna, the Swedish buy-now-pay-later company, claims an overdue invoice for a purchase the recipient never made and threatens debt collection unless paid immediately to a provided account, exploiting how common real Klarna invoices are in everyday online shopping. Genuine Klarna invoices are only visible and payable through the recipient\'s own Klarna app or account, not an unsolicited payment demand.',
    categorySlug: 'online-shopping-scams',
    country: 'SE',
    alertLevel: 'medium',
    sources: ['Polisen (Swedish Police Authority)'],
    sourceUrl: 'https://polisen.se/utsatt-for-brott/polisanmalan/bedragerier/bedragerier/annonsbedrageri/',
  },
  {
    name: 'Canadian SIN Suspension Scam',
    slug: 'canada-sin-suspension-scam',
    description:
      'A caller impersonating Service Canada claims the victim\'s Social Insurance Number has been suspended or linked to criminal activity and threatens arrest unless personal information is confirmed or a fee is paid to reactivate it — mirroring the U.S. Social Security Administration impersonation pattern but using Canada\'s SIN system specifically. Service Canada does not suspend SIN numbers or resolve such issues by demanding payment over the phone.',
    categorySlug: 'government-impersonation',
    country: 'CA',
    alertLevel: 'high',
    sources: ['Canadian Anti-Fraud Centre'],
    sourceUrl: 'https://antifraudcentre-centreantifraude.ca/scams-fraudes/extortion-extorsion-eng.htm',
  },
  {
    name: 'Dutch Belastingdienst Tax Refund Phishing Scam',
    slug: 'netherlands-belastingdienst-phishing-scam',
    description:
      'An email or text impersonating the Belastingdienst, the Dutch tax authority, claims a tax refund is pending and links to a fake login page harvesting DigiD credentials and banking details. The Belastingdienst communicates real refund information through a taxpayer\'s own verified account or by post, not an unsolicited link.',
    categorySlug: 'tax-scams',
    country: 'NL',
    alertLevel: 'medium',
    sources: ['Fraudehelpdesk (Netherlands)'],
    sourceUrl: 'https://www.fraudehelpdesk.nl/valse-emails/belastingdienst/',
  },
  {
    name: 'German "Falscher Polizist" Fake Police Shock Call',
    slug: 'germany-falscher-polizist-scam',
    description:
      'A caller claims to be a police officer investigating a burglary ring operating in the victim\'s neighborhood and warns that their cash or valuables are at risk, instructing them to hand everything over to an officer who will come collect it "for safekeeping." Some variants open with a fabricated emergency — a family member in a car accident who needs bail money immediately. German police never collect money or valuables from a private residence, and the BKA specifically warns this remains one of the country\'s costliest fraud categories, disproportionately targeting elderly victims.',
    categorySlug: 'government-impersonation',
    country: 'DE',
    alertLevel: 'critical',
    sources: ['German Federal Criminal Police Office (BKA)'],
    sourceUrl: 'https://www.bka.de/SharedDocs/Kurzmeldungen/DE/Warnhinweise/220411_AnrufeBehoerden.html',
  },
  {
    name: 'Fake Garda Impersonation Call',
    slug: 'ireland-garda-impersonation-call-scam',
    description:
      'A caller claiming to be a member of An Garda Síochána tells the victim their bank card or account has been compromised by a fraud ring and asks them to move their money to a "secure" Garda-monitored account, or to hand over a card and PIN to a courier who will collect it for "evidence." An Garda Síochána has repeatedly warned that its officers never request bank details, PINs, or cash handovers by phone, and that a real Garda visit is always confirmable by calling the victim\'s local station directly using an independently looked-up number.',
    categorySlug: 'government-impersonation',
    country: 'IE',
    alertLevel: 'critical',
    sources: ['An Garda Síochána'],
    sourceUrl: 'https://www.garda.ie/en/crime/fraud/',
  },
  {
    name: 'Impersonation of China Officials Scam',
    slug: 'singapore-china-officials-impersonation-scam',
    description:
      'A caller claiming to be from a Chinese embassy, courier company, or Chinese law enforcement agency tells a Mandarin-speaking victim in Singapore that a parcel or their identity has been linked to a crime in China, then transfers the call to a fake "Chinese police officer" who demands funds be transferred for investigation or to prove innocence. The Singapore Police Force names this specifically as one of its largest scam categories by financial loss and stresses that no genuine Chinese authority will ever conduct an investigation or demand money over a phone call or video call.',
    categorySlug: 'government-impersonation',
    country: 'SG',
    alertLevel: 'critical',
    sources: ['Singapore Police Force'],
    sourceUrl: 'https://www.scamshield.gov.sg/i-want-protection-from-scams/learn-to-recognise-scams/government-officials-impersonation-scams/',
  },
  {
    name: 'Japanese One-Click Fraud (Wan-Kurikku Sagi)',
    slug: 'japan-one-click-fraud-scam',
    description:
      'After clicking a link on an adult content, streaming, or gaming site, a pop-up immediately declares that the victim has "registered" for a paid service and now owes a large fee, often displaying what looks like their IP address or device details to falsely suggest they\'ve been identified and tracked. There was never an actual registration or contract formed, and Japan\'s National Police Agency advises that closing the browser without clicking anything further, and never calling the phone number on the demand, ends the scam completely.',
    categorySlug: 'phishing',
    country: 'JP',
    alertLevel: 'medium',
    sources: ['NISC (National center of Incident readiness and Strategy for Cybersecurity)'],
    sourceUrl: 'https://www.cyber.go.jp/pr/column/20220719.html',
  },
  {
    name: 'Swedish "Skyddat Konto" Safe Account Scam',
    slug: 'sweden-skyddat-konto-safe-account-scam',
    description:
      'A caller posing as a bank employee or police officer tells the victim their account has been compromised and that, to protect their savings, funds must be immediately moved to a new "protected account" (skyddat konto) — an account actually controlled by the scammer. Swedish police (Polisen) and the National Council for Crime Prevention (Brå) have identified this as one of the country\'s largest fraud categories by reported loss, and stress that neither a real bank nor the police will ever ask a customer to transfer money to a different account for safekeeping.',
    categorySlug: 'account-takeover',
    country: 'SE',
    alertLevel: 'critical',
    sources: ['Polisen (Swedish Police Authority)', 'Brottsförebyggande rådet (Brå)'],
    sourceUrl: 'https://polisen.se/utsatt-for-brott/polisanmalan/bedragerier/bedragerier/identitetsbedrageri/',
  },
  {
    name: 'French "Faux Conseiller Bancaire" Fake Bank Advisor Scam',
    slug: 'france-faux-conseiller-bancaire-scam',
    description:
      'A caller impersonating the victim\'s own bank, often using a spoofed number that matches the bank\'s real customer service line, warns of fraudulent activity on the account and instructs the victim to transfer funds to a supposedly secure new account, or to read out a one-time verification code that actually authorizes a transfer the scammer has already initiated. France\'s Info Escroqueries service and Cybermalveillance.gouv.fr warn that a real bank advisor never asks a customer to move money to another account or to disclose a one-time code received by SMS.',
    categorySlug: 'account-takeover',
    country: 'FR',
    alertLevel: 'critical',
    sources: ['Info Escroqueries', 'Cybermalveillance.gouv.fr'],
    sourceUrl: 'https://www.police-nationale.interieur.gouv.fr/actualite/info-escroqueries-plate-forme-pour-signaler-escroqueries-sur-internet',
  },
  {
    name: 'Dutch Nepwebshop (Fake Webshop) Scam',
    slug: 'netherlands-nepwebshop-fake-webshop-scam',
    description:
      'A convincingly designed online store, often advertised through social media ads or search results, offers heavily discounted electronics, designer clothing, or other in-demand goods and accepts payment through bank transfer or a fake iDEAL checkout page, but never ships anything. Fraudehelpdesk consistently ranks nepwebshops (fake webshops) among the most-reported fraud categories in the Netherlands, and recommends checking a shop\'s registration with the Dutch Chamber of Commerce (KVK) and searching its name alongside "oplichting" (scam) before ordering.',
    categorySlug: 'online-shopping-scams',
    country: 'NL',
    alertLevel: 'high',
    sources: ['Fraudehelpdesk (Netherlands)'],
    sourceUrl: 'https://www.fraudehelpdesk.nl/fraude-abc/webshop-betrouwbaar/',
  },
  {
    name: 'New Zealand Bank SMS Phishing Scam',
    slug: 'newzealand-bank-sms-phishing-scam',
    description:
      'A text message impersonating a major New Zealand bank — ANZ, ASB, BNZ, Westpac, or Kiwibank — warns of a blocked card, suspicious login, or failed payment and links to a fake banking login page that harvests credentials and one-time codes, sometimes appearing in the same message thread as genuine past texts from the bank due to sender ID spoofing. Netsafe and the National Cyber Security Centre advise never tapping a link in an unexpected bank text and instead opening the bank\'s official app or typing its known web address directly.',
    categorySlug: 'phishing',
    country: 'NZ',
    alertLevel: 'high',
    sources: ['Netsafe', 'National Cyber Security Centre (NZ)'],
    sourceUrl: 'https://netsafe.org.nz/scams/phishing',
  },
  {
    name: 'Singapore Carousell Purchase Scam',
    slug: 'singapore-carousell-purchase-scam',
    description:
      'A seller on Carousell, Singapore\'s dominant classifieds marketplace, offers a popular item — often electronics or concert tickets — at a below-market price and pushes the buyer to pay upfront via bank transfer or PayNow outside the platform\'s own protections, then stops responding once payment clears. The Singapore Police Force names e-commerce scams among its highest-volume categories and advises using the platform\'s in-app payment and meet-up options rather than transferring money directly to a stranger first.',
    categorySlug: 'online-shopping-scams',
    country: 'SG',
    alertLevel: 'medium',
    sources: ['Singapore Police Force'],
    sourceUrl: 'https://www.scamshield.gov.sg/i-want-protection-from-scams/learn-to-recognise-scams/e-commerce-scams/',
  },
  {
    name: 'Singapore Crypto Investment Scam',
    slug: 'singapore-crypto-investment-scam',
    description:
      'A contact met through social media, a dating app, or a cold message introduces a "guaranteed" cryptocurrency trading platform, walking the victim through small early withdrawals that appear to prove the platform works before encouraging much larger deposits that can never be withdrawn. Singapore Police Force data consistently shows investment scams, heavily weighted toward crypto platforms, as the single costliest scam category by total losses, and warns that no legitimate investment guarantees fixed, above-market returns.',
    categorySlug: 'investment-fraud',
    country: 'SG',
    alertLevel: 'critical',
    sources: ['Singapore Police Force'],
    sourceUrl: 'https://www.scamshield.gov.sg/i-want-protection-from-scams/learn-to-recognise-scams/investment-scams/',
  },
  {
    name: 'New Zealand Customs & Post Parcel Scam',
    slug: 'newzealand-customs-post-parcel-scam',
    description:
      'A text or email claims a parcel is being held by New Zealand Customs or NZ Post pending payment of an outstanding customs duty or redelivery fee, linking to a fake payment page that harvests card details. NZ Post and Netsafe advise checking tracking status only through the carrier\'s own official app or website, since genuine customs charges are invoiced directly by NZ Post itself, not by a text message link.',
    categorySlug: 'package-delivery-scams',
    country: 'NZ',
    alertLevel: 'medium',
    sources: ['Netsafe', 'NZ Post'],
    sourceUrl: 'https://netsafe.org.nz/scams/courier-delivery-scams',
  },
  {
    name: 'New Zealand KiwiSaver Early Withdrawal Scam',
    slug: 'newzealand-kiwisaver-early-withdrawal-scam',
    description:
      'A caller or online adviser claims the victim can access their KiwiSaver retirement savings early, before the legal qualifying conditions are met, by transferring the funds into a "compliant" scheme the scammer controls — which then simply disappears with the money. The Financial Markets Authority warns that KiwiSaver funds can only be released early under narrowly defined circumstances such as significant financial hardship or serious illness, never through a third party offering to bypass the rules for a fee.',
    categorySlug: 'investment-fraud',
    country: 'NZ',
    alertLevel: 'high',
    sources: ['Financial Markets Authority (NZ)'],
    sourceUrl: 'https://www.fma.govt.nz/scams/',
  },
  {
    name: 'Irish PPS Number Suspension Scam',
    slug: 'ireland-pps-number-suspension-scam',
    description:
      'A caller impersonating the Department of Social Protection claims the victim\'s Personal Public Service (PPS) Number has been suspended or linked to fraudulent welfare claims, demanding personal details or a payment to reactivate it under threat of losing benefit payments or facing legal action. The Department of Social Protection does not suspend PPS Numbers or request payment over the phone, and directs anyone contacted this way to hang up and contact their local Intreo office directly.',
    categorySlug: 'government-impersonation',
    country: 'IE',
    alertLevel: 'high',
    sources: ['Department of Social Protection (Ireland)'],
    sourceUrl: 'https://www.gov.ie/en/department-of-social-protection/',
  },
  {
    name: 'Australia Post Parcel Redelivery Scam',
    slug: 'australia-post-parcel-redelivery-scam',
    description:
      'A text message impersonating Australia Post claims a parcel couldn\'t be delivered due to an unpaid fee and links to a fake redelivery page that harvests card details, often arriving in waves timed around major online shopping events. Australia Post and Scamwatch advise that genuine delivery issues are tracked through the official Auspost app or website using a real tracking number, never through a link in an unsolicited text.',
    categorySlug: 'package-delivery-scams',
    country: 'AU',
    alertLevel: 'medium',
    sources: ['Australia Post', 'Scamwatch (ACCC)'],
    sourceUrl: 'https://auspost.com.au/about-us/about-our-site/online-security-scams-fraud/scam-alerts',
  },
  {
    name: 'German Kleinanzeigen Marketplace Payment Scam',
    slug: 'germany-kleinanzeigen-marketplace-scam',
    description:
      'A buyer or seller on Kleinanzeigen, Germany\'s largest classifieds marketplace, sends a fake shipping-service or escrow payment link that mimics the platform\'s real "sicher bezahlen" (safe payment) system, harvesting card or banking details when the other party enters payment information to "release" the item or funds. Verbraucherzentrale advises completing all payment and shipping steps only inside Kleinanzeigen\'s own app, never through a link sent directly by the other party in chat.',
    categorySlug: 'online-shopping-scams',
    country: 'DE',
    alertLevel: 'medium',
    sources: ['Verbraucherzentrale (Germany)'],
    sourceUrl: 'https://www.verbraucherzentrale.de/wissen/digitale-welt/onlinehandel/abzocke-online-wie-erkenne-ich-fakeshops-im-internet-13166',
  },
  {
    name: 'Japan Post Parcel Redelivery SMS Scam',
    slug: 'japan-post-parcel-redelivery-sms-scam',
    description:
      'A text message impersonating Japan Post (Yu-Pack) or a private courier claims a delivery attempt failed and links to a fake redelivery-scheduling page that prompts installation of a malicious app disguised as a tracking tool, or harvests payment details for a fabricated redelivery fee. Japan\'s National Police Agency advises checking delivery status only through a carrier\'s official app or by typing its known web address directly, never through a link in an unsolicited text.',
    categorySlug: 'package-delivery-scams',
    country: 'JP',
    alertLevel: 'medium',
    sources: ['Japan Post', 'National Police Agency (Japan)'],
    sourceUrl: 'https://www.post.japanpost.jp/notification/notice/fraud-mail.html',
  },
  {
    name: 'Dutch Tikkie Payment Request Scam',
    slug: 'netherlands-tikkie-payment-request-scam',
    description:
      'A message claiming to be from a friend, family member, or online seller includes a Tikkie link — the Netherlands\' dominant payment-request app — disguised as a request to pay back a small amount, but the link actually leads to a fake banking page that harvests login credentials once the victim tries to "pay." Fraudehelpdesk warns that a genuine Tikkie request only ever asks for the amount stated and never redirects to a bank login page outside the official app.',
    categorySlug: 'phishing',
    country: 'NL',
    alertLevel: 'medium',
    sources: ['Fraudehelpdesk (Netherlands)'],
    sourceUrl: 'https://www.fraudehelpdesk.nl/fraude-cat/phishing/',
  },
  {
    name: 'Indian Telegram Stock Tip Investment Scam',
    slug: 'india-telegram-stock-tip-scam',
    description:
      'A Telegram or WhatsApp group promising "guaranteed" stock-market or IPO returns, often impersonating a well-known brokerage or fund manager, walks members through a fake trading app showing rapidly growing paper profits before blocking withdrawals once a large enough deposit is made. India\'s SEBI has issued repeated public warnings that it does not endorse any such tip-sharing groups and that guaranteed above-market returns are the clearest sign of a fraudulent investment scheme.',
    categorySlug: 'investment-fraud',
    country: 'IN',
    alertLevel: 'critical',
    sources: ['Securities and Exchange Board of India (SEBI)'],
    sourceUrl: 'https://investor.sebi.gov.in/spot-any-scam.html',
  },
  {
    name: 'Canada Post Parcel Scam',
    slug: 'canada-post-parcel-scam',
    description:
      'A text message impersonating Canada Post claims a parcel is being held for an unpaid customs or redelivery fee and links to a fake payment page that harvests card details — a distinct, more common everyday version of the more serious CBSA package-seizure scam. Canada Post confirms it never asks for payment or personal information through a text message link, and recommends checking any delivery notice directly through its own app or website.',
    categorySlug: 'package-delivery-scams',
    country: 'CA',
    alertLevel: 'medium',
    sources: ['Canada Post', 'Canadian Anti-Fraud Centre'],
    sourceUrl: 'https://www.canadapost-postescanada.ca/cpc/en/personal/protecting-yourself-from-fraud-and-scams.page',
  },
  {
    name: 'Swedish PostNord Parcel Scam',
    slug: 'sweden-postnord-parcel-scam',
    description:
      'A text message impersonating PostNord, Sweden\'s dominant postal carrier, claims a parcel couldn\'t be delivered due to a small unpaid customs or redelivery fee and links to a fake payment page designed to harvest card or BankID details. Polisen and PostNord advise checking any delivery notice through PostNord\'s own official app rather than a link in an unsolicited text, since genuine fees are never collected this way.',
    categorySlug: 'package-delivery-scams',
    country: 'SE',
    alertLevel: 'medium',
    sources: ['PostNord', 'Polisen (Swedish Police Authority)'],
    sourceUrl: 'https://www.postnord.se/privat/forberedelser/kann-igen-falska-sms-och-mejl/',
  },
  {
    name: 'Singapore Unlicensed Moneylending (Loan Shark) Scam',
    slug: 'singapore-unlicensed-moneylending-scam',
    description:
      'A message or ad offers a fast, no-collateral loan with minimal paperwork, but after a small upfront "processing fee" is paid, the lender either disappears or reveals exorbitant hidden interest and begins harassment tactics — including threats and mass messages to the victim\'s contacts — to pressure repayment. The Singapore Police Force maintains a public register of licensed moneylenders and stresses that a legal lender never demands upfront fees or contacts a borrower\'s family and friends over a debt.',
    categorySlug: 'debt-relief-scams',
    country: 'SG',
    alertLevel: 'high',
    sources: ['Singapore Police Force'],
    sourceUrl: 'https://www.police.gov.sg/Advisories/Scams',
  },
  {
    name: 'German Money Mule Job Offer Scam',
    slug: 'germany-money-mule-job-offer-scam',
    description:
      'A job listing promising easy pay for "financial agent" or "package forwarding" work asks the applicant to receive money into their own bank account and forward it elsewhere, or to receive and reship packages — work that actually launders stolen funds or goods and exposes the "employee," not the scammer, to money-laundering charges. German consumer-protection groups and police warn that legitimate employers never ask a new hire to move money or goods through their personal bank account or address.',
    categorySlug: 'employment-scams',
    country: 'DE',
    alertLevel: 'high',
    sources: ['German Federal Criminal Police Office (BKA)'],
    sourceUrl: 'https://www.bka.de/SharedDocs/Kurzmeldungen/DE/Warnhinweise/220802_AppTesting.html',
  },
  {
    name: 'Australian Crypto Investment Scam',
    slug: 'australia-crypto-investment-scam',
    description:
      'An ad on social media or a message from a new online contact promotes a cryptocurrency trading platform showing steadily rising "returns" on a dashboard the victim can watch grow, encouraging progressively larger deposits before withdrawals are blocked with demands for further "release" or "tax" fees. Scamwatch consistently ranks investment scams as Australia\'s costliest category by total reported losses, and warns that no legitimate platform guarantees fixed or rapidly compounding returns.',
    categorySlug: 'investment-fraud',
    country: 'AU',
    alertLevel: 'critical',
    sources: ['Scamwatch (ACCC)'],
    sourceUrl: 'https://www.scamwatch.gov.au/types-of-scams/investment-scams',
  },
  {
    name: 'Japanese SNS Investment and Romance Scam',
    slug: 'japan-sns-investment-romance-scam',
    description:
      'A contact made through social media or a messaging app builds a romantic or friendly relationship over weeks before introducing a cryptocurrency or foreign-exchange trading opportunity, walking the victim through a fake platform that shows fabricated gains to encourage larger deposits that can never be withdrawn. Japan\'s National Police Agency has flagged this combined "SNS-type" investment and romance fraud as one of the fastest-growing scam categories in the country, with total damages now exceeding those of traditional phone-based tokushu sagi fraud.',
    categorySlug: 'investment-fraud',
    country: 'JP',
    alertLevel: 'critical',
    sources: ['Japan National Police Agency'],
    sourceUrl: 'https://www.npa.go.jp/bureau/safetylife/sos47/case/sns-romance/investment/',
  },
  {
    name: 'Irish Fake Celebrity-Endorsed Investment Ad Scam',
    slug: 'ireland-celebrity-investment-ad-scam',
    description:
      'A social media ad features a well-known Irish broadcaster, businessperson, or celebrity apparently endorsing a cryptocurrency or trading platform promising guaranteed daily returns — the endorsement is fabricated, often using AI-generated video or a doctored news clip, and the person featured has no connection to the scheme. The Central Bank of Ireland and CCPC have repeatedly warned that no legitimate investment firm needs a celebrity endorsement to guarantee returns, and that the celebrities featured are targets of the fraud too, not participants in it.',
    categorySlug: 'investment-fraud',
    country: 'IE',
    alertLevel: 'critical',
    sources: ['Central Bank of Ireland', 'Competition and Consumer Protection Commission (CCPC)'],
    sourceUrl: 'https://www.centralbank.ie/consumer-hub/scams-fraud',
  },
  {
    name: 'Dutch Postcode Loterij Fake Lottery Win Scam',
    slug: 'netherlands-postcode-loterij-scam',
    description:
      'A message claims the recipient has won a prize in the Nederlandse Postcode Loterij, the Netherlands\' widely played postcode-based lottery, but releasing the winnings requires first paying a "processing fee" or providing banking details — the real lottery never requires a fee to release genuine winnings, and notifies actual winners directly, not through an unsolicited text or email. Fraudehelpdesk lists lottery-win scams impersonating well-known Dutch lotteries as a recurring seasonal spike, particularly around the lottery\'s televised draw dates.',
    categorySlug: 'lottery-sweepstakes-scams',
    country: 'NL',
    alertLevel: 'medium',
    sources: ['Fraudehelpdesk (Netherlands)'],
    sourceUrl: 'https://www.fraudehelpdesk.nl/fraude/ik-heb-een-loterij-gewonnen/',
  },
  {
    name: 'Indian Fake Government Job Recruitment Scam',
    slug: 'india-fake-government-job-scam',
    description:
      'A recruitment ad or agent promises a coveted government position — railways, police, or a state department — in exchange for an upfront "processing," "training kit," or "guaranteed selection" fee, producing forged offer letters and fake interview calls to sustain the illusion before disappearing once payment is collected. Indian state police and the Staff Selection Commission repeatedly warn that all genuine government recruitment is free and conducted only through official public exam boards, never through a fee-charging middleman or agent.',
    categorySlug: 'employment-scams',
    country: 'IN',
    alertLevel: 'high',
    sources: ['National Cyber Crime Reporting Portal (NCRP)'],
    sourceUrl: 'https://cybercrime.gov.in/pdf/Job%20Fraud%20Brochure%20Final.pdf',
  },
  {
    name: 'New Zealand Fake Job Offer Scam',
    slug: 'newzealand-fake-job-offer-scam',
    description:
      'A job listing on LinkedIn, Seek, or Facebook offers remote, high-paying work with minimal qualifications, then asks the applicant to pay upfront for a "starter kit," training course, or background-check fee, or to deposit a fraudulent check and wire back the "overpayment" before the check bounces. Netsafe and Employment New Zealand advise that a genuine employer never asks a new hire to pay for their own equipment or training before a role begins, or to handle company funds through a personal account.',
    categorySlug: 'employment-scams',
    country: 'NZ',
    alertLevel: 'medium',
    sources: ['Netsafe', 'Employment New Zealand'],
    sourceUrl: 'https://netsafe.org.nz/',
  },
  {
    name: 'French AMF Unauthorized Investment Platform Scam',
    slug: 'france-amf-investment-scam',
    description:
      'A slick trading website or app, often promoted through targeted social media ads, promises high guaranteed returns on forex, crypto, or "diamond" investments, but is never actually registered to operate in France, and initial small withdrawals are used to build trust before larger deposits vanish entirely. The Autorité des marchés financiers (AMF) maintains a public blacklist of unauthorized platforms and warns that a real investment firm operating in France must be registered with the AMF or the ACPR, which any consumer can verify before depositing money.',
    categorySlug: 'investment-fraud',
    country: 'FR',
    alertLevel: 'critical',
    sources: ['Autorité des marchés financiers (AMF)'],
    sourceUrl: 'https://www.amf-france.org/en/warnings/blacklists',
  },
  {
    name: 'Canadian Securities Regulator Investment Scam',
    slug: 'canada-csa-investment-scam',
    description:
      'An online ad or unsolicited message promotes a cryptocurrency or forex trading platform showing a rapidly growing account balance, encouraging the victim to deposit progressively larger sums before withdrawals are blocked with demands for further "release" or "tax" payments. The Canadian Securities Administrators, the umbrella group of provincial securities regulators, maintains a public list of unregistered firms and investor warnings, and stresses that any platform managing Canadians\' investments must be registered with a provincial regulator.',
    categorySlug: 'investment-fraud',
    country: 'CA',
    alertLevel: 'critical',
    sources: ['Canadian Securities Administrators (CSA)', 'Canadian Anti-Fraud Centre'],
    sourceUrl: 'https://www.securities-administrators.ca/investor-alerts/',
  },
  {
    name: 'Swedish Vinted and Blocket Marketplace Scam',
    slug: 'sweden-vinted-blocket-marketplace-scam',
    description:
      'A seller on Vinted or Blocket, Sweden\'s most popular secondhand marketplaces, asks the buyer to complete payment outside the platform\'s own protected checkout — often through a fake shipping-label link or a direct Swish transfer — and never ships the item, or a buyer sends a fake payment confirmation screenshot to pressure a seller into shipping before funds actually arrive. Polisen advises keeping all payment and shipping steps inside the marketplace\'s own official app, since that is the only way a buyer or seller is covered if something goes wrong.',
    categorySlug: 'online-shopping-scams',
    country: 'SE',
    alertLevel: 'medium',
    sources: ['Polisen (Swedish Police Authority)'],
    sourceUrl: 'https://polisen.se/utsatt-for-brott/polisanmalan/bedragerier/bedragerier/annonsbedrageri/',
  },
  {
    name: 'German Fake Charity Donation Scam',
    slug: 'germany-fake-charity-donation-scam',
    description:
      'In the days after a widely covered disaster, a fake charity collects door-to-door, by phone, or through a slick-looking website using a name deliberately similar to a well-known relief organization, keeping the donations for itself rather than passing them to victims. The DZI (Deutsches Zentralinstitut für soziale Fragen) maintains Germany\'s donation-seal registry and advises checking for its "DZI Spenden-Siegel" or donating directly through an established organization\'s own verified website rather than a collector or link that approached the donor first.',
    categorySlug: 'charity-scams',
    country: 'DE',
    alertLevel: 'medium',
    sources: ['DZI (Deutsches Zentralinstitut für soziale Fragen)'],
    sourceUrl: 'https://www.dzi.de/spendenberatung/',
  },
  {
    name: 'Dutch AFM Unauthorized Investment Scam',
    slug: 'netherlands-afm-investment-scam',
    description:
      'A trading platform advertised through social media or a cold WhatsApp message promises high, steady returns on crypto or forex trading, often using a fake Dutch celebrity endorsement generated with AI, and blocks withdrawals once a large enough deposit is collected. The Autoriteit Financiële Markten (AFM) maintains a public warning list of unauthorized investment providers and stresses that any firm offering investment services in the Netherlands must hold a genuine AFM license, which can be verified directly on the regulator\'s own register.',
    categorySlug: 'investment-fraud',
    country: 'NL',
    alertLevel: 'critical',
    sources: ['Autoriteit Financiële Markten (AFM)'],
    sourceUrl: 'https://www.afm.nl/nl-nl/consumenten/waarschuwingen/bekijk-de-waarschuwingen',
  },
  {
    name: 'Irish HSE Healthcare Phishing Scam',
    slug: 'ireland-hse-healthcare-phishing-scam',
    description:
      'A text or email impersonating the Health Service Executive (HSE) claims an issue with a medical card renewal, a vaccination record, or an outstanding health-service payment, linking to a fake login page that harvests PPS numbers and personal health details. The HSE does not request personal or payment information through unsolicited text or email links, and directs anyone unsure about a message\'s authenticity to verify it by contacting their GP practice or local HSE office directly.',
    categorySlug: 'healthcare-fraud',
    country: 'IE',
    alertLevel: 'medium',
    sources: ['Health Service Executive (Ireland)'],
    sourceUrl: 'https://www2.hse.ie/services/cyber-attack/scams-attempted-fraud/',
  },
  {
    name: 'Australian Disaster Relief Charity Scam',
    slug: 'australia-disaster-charity-scam',
    description:
      'In the days following a widely covered bushfire, flood, or cyclone, a fake charity solicits donations by phone, door-to-door, or through a website using a name deliberately similar to a well-known Australian relief organization, keeping the funds instead of passing them to affected communities. Scamwatch advises checking a charity\'s registration on the Australian Charities and Not-for-profits Commission (ACNC) register and donating directly through an established organization\'s own verified website rather than a link or collector that approached the donor first.',
    categorySlug: 'charity-scams',
    country: 'AU',
    alertLevel: 'medium',
    sources: ['Scamwatch (ACCC)', 'Australian Charities and Not-for-profits Commission (ACNC)'],
    sourceUrl: 'https://www.scamwatch.gov.au/types-of-scams/donation-scams',
  },
  {
    name: 'Indian SIM Swap KYC Update Scam',
    slug: 'india-sim-swap-kyc-scam',
    description:
      'A caller or text claiming to be from a mobile carrier says the victim\'s SIM card will be deactivated unless their "KYC" (Know Your Customer) details are urgently updated, walking them through steps that actually authorize a SIM swap onto a card the fraudster controls — once complete, the fraudster receives the victim\'s OTP codes and can drain bank accounts linked to that phone number. India\'s Department of Telecommunications and the NCRP warn that no carrier deactivates a SIM without an in-person or officially verified request, and that KYC updates are never processed by following instructions from an unsolicited call or text.',
    categorySlug: 'identity-theft',
    country: 'IN',
    alertLevel: 'critical',
    sources: ['National Cyber Crime Reporting Portal (NCRP)', 'Department of Telecommunications (India)'],
    sourceUrl: 'https://cybercrime.gov.in/',
  },
  {
    name: 'Singapore Internet Love Scam',
    slug: 'singapore-internet-love-scam',
    description:
      'A relationship built over weeks or months through a dating app or social media, often with a scammer claiming to be an overseas professional unable to meet in person, eventually leads to requests for money — a medical emergency, a stuck shipment, or a business opportunity the victim is invited to "invest" in alongside the relationship itself. The Singapore Police Force names Internet Love Scams among its most damaging categories by average loss per victim, and advises never sending money to someone met only online, however long the relationship has developed.',
    categorySlug: 'romance-scams',
    country: 'SG',
    alertLevel: 'high',
    sources: ['Singapore Police Force'],
    sourceUrl: 'https://www.scamshield.gov.sg/i-want-protection-from-scams/learn-to-recognise-scams/internet-love-scams/',
  },
  {
    name: 'Japanese National Tax Agency Phishing Scam',
    slug: 'japan-tax-office-phishing-scam',
    description:
      'A text or email impersonating Japan\'s National Tax Agency claims an overdue tax payment or a pending refund, linking to a fake payment or login page that harvests banking credentials and My Number (Japan\'s national ID) details. Japan\'s National Tax Agency states it never requests payment or personal information by unsolicited text or email link, and that genuine tax correspondence arrives by postal mail or through a taxpayer\'s own verified e-Tax account.',
    categorySlug: 'tax-scams',
    country: 'JP',
    alertLevel: 'medium',
    sources: ['Japan National Tax Agency'],
    sourceUrl: 'https://www.nta.go.jp/information/attention/attention.htm',
  },
  {
    name: 'New Zealand Disaster Relief Charity Scam',
    slug: 'newzealand-disaster-charity-scam',
    description:
      'Following a widely covered earthquake, flood, or cyclone, a fake charity solicits donations by phone, social media, or a website using a name deliberately similar to a well-known New Zealand relief organization, keeping the funds rather than passing them to affected communities. Netsafe and the Department of Internal Affairs advise checking a charity\'s registration on the official Charities Register before donating, and giving directly through an established organization\'s own verified website rather than a link or collector that approached the donor first.',
    categorySlug: 'charity-scams',
    country: 'NZ',
    alertLevel: 'medium',
    sources: ['Netsafe', 'Charities Services (New Zealand)'],
    sourceUrl: 'https://netsafe.org.nz/',
  },
  {
    name: 'German BaFin Unauthorized Investment Scam',
    slug: 'germany-bafin-investment-scam',
    description:
      'A trading platform advertised through social media or a cold message promises high, steady returns on crypto or forex trading, often using a fake endorsement from a German celebrity or news outlet, and blocks withdrawals once a large enough deposit has been collected. BaFin (the Federal Financial Supervisory Authority) maintains a public warning list of unauthorized providers and stresses that any firm offering investment services in Germany must hold a genuine BaFin license, which can be verified directly on the regulator\'s own database.',
    categorySlug: 'investment-fraud',
    country: 'DE',
    alertLevel: 'critical',
    sources: ['BaFin (Federal Financial Supervisory Authority)'],
    sourceUrl: 'https://www.bafin.de/DE/verbraucherinnen-verbraucher/news-warnungen/warnmeldungen/warnmeldungen_node.html',
  },
  {
    name: 'French Webcam Sextortion Scam',
    slug: 'france-sextortion-webcam-scam',
    description:
      'A contact met on social media or a dating app quickly moves the conversation to video chat and records the victim in a compromising moment, either through consensual webcam activity or a screen-recorded fake video, then threatens to send the footage to the victim\'s contacts unless a payment is made, often escalating with repeated demands even after payment. Cybermalveillance.gouv.fr and Info Escroqueries advise cutting off contact immediately, never paying, and preserving evidence to report to police, since payment does not reliably stop further threats.',
    categorySlug: 'sextortion',
    country: 'FR',
    alertLevel: 'critical',
    sources: ['Cybermalveillance.gouv.fr', 'Info Escroqueries'],
    sourceUrl: 'https://www.cybermalveillance.gouv.fr/',
  },
  {
    name: 'Canadian Utility Disconnection Scam',
    slug: 'canada-utility-disconnection-scam',
    description:
      'A caller impersonating a local hydro, gas, or water utility claims the victim\'s account is overdue and threatens same-day disconnection unless payment is made immediately, typically demanding a prepaid gift card or e-transfer to a personal account. The Canadian Anti-Fraud Centre and Canadian utility providers confirm that real utilities never demand immediate payment by gift card and always provide written notice with an appeals process before any disconnection.',
    categorySlug: 'utility-scams',
    country: 'CA',
    alertLevel: 'medium',
    sources: ['Canadian Anti-Fraud Centre'],
    sourceUrl: 'https://antifraudcentre-centreantifraude.ca/scams-fraudes/extortion-extorsion-eng.htm#a6',
  },
  {
    name: 'Swedish Romance Scam (Kärleksbedrägeri)',
    slug: 'sweden-romance-scam-karleksbedrageri',
    description:
      'A relationship built over weeks or months through a dating app or social media, often with a scammer claiming to work abroad in the military, on an oil rig, or as a doctor, eventually leads to a fabricated crisis — a medical emergency, a stuck shipment of gifts, or a stranded flight — that only money from the victim can resolve. Polisen names kärleksbedrägeri (romance fraud) among Sweden\'s most damaging fraud categories by average loss per victim, and warns that a partner who has never met in person but urgently needs money is the clearest sign of the scam.',
    categorySlug: 'romance-scams',
    country: 'SE',
    alertLevel: 'high',
    sources: ['Polisen (Swedish Police Authority)'],
    sourceUrl: 'https://polisen.se/utsatt-for-brott/polisanmalan/bedrageri/bedragerier/romansbedrageri/',
  },
  {
    name: 'Singapore OTP Bank Phishing Scam',
    slug: 'singapore-otp-bank-phishing-scam',
    description:
      'A text message impersonating a major Singapore bank — DBS, OCBC, or UOB — warns of a suspicious transaction or account lock and links to a fake login page that harvests banking credentials and the one-time password (OTP) sent to the victim\'s phone, sometimes appearing in the same message thread as genuine past bank texts due to sender ID spoofing. The Singapore Police Force and MAS advise never entering an OTP on a page reached through a text link, since a genuine bank never asks for an OTP to "verify" or "unlock" an account.',
    categorySlug: 'phishing',
    country: 'SG',
    alertLevel: 'critical',
    sources: ['Singapore Police Force', 'Monetary Authority of Singapore (MAS)'],
    sourceUrl: 'https://www.scamshield.gov.sg/i-want-protection-from-scams/learn-to-recognise-scams/phishing-scams/',
  },
  {
    name: 'Dutch "Hoi Mam" WhatsApp Family Emergency Scam',
    slug: 'netherlands-whatsapp-family-emergency-scam',
    description:
      'A WhatsApp message opening with "Hoi mam" or "Hoi pap" claims to be from a child who has lost or broken their phone and is texting from a new number, quickly following up with an urgent request to pay a bill or transfer money on their behalf before the parent can verify. Fraudehelpdesk named this "WhatsAppfraude" pattern one of the most-reported scams in the Netherlands at its peak, and advises calling the family member\'s known number directly, never replying to or transferring money based on the new-number message alone.',
    categorySlug: 'family-emergency-scams',
    country: 'NL',
    alertLevel: 'high',
    sources: ['Fraudehelpdesk (Netherlands)'],
    sourceUrl: 'https://www.fraudehelpdesk.nl/fraude/ik-krijg-een-whatsapp-bericht-van-een-bekende/',
  },
  {
    name: 'Irish DoneDeal Marketplace Scam',
    slug: 'ireland-donedeal-marketplace-scam',
    description:
      'A seller on DoneDeal, Ireland\'s largest classifieds marketplace, lists a popular item — often a car, phone, or concert ticket — well below market price and pressures the buyer to pay by bank transfer before collection, then stops responding once payment clears; a reverse version has a "buyer" send a fake payment confirmation to pressure a seller into shipping before funds actually arrive. The CCPC advises completing payment and collection in person where possible, and treating any request to pay upfront by transfer for an item not yet seen as a serious warning sign.',
    categorySlug: 'online-shopping-scams',
    country: 'IE',
    alertLevel: 'medium',
    sources: ['Competition and Consumer Protection Commission (CCPC)'],
    sourceUrl: 'https://www.ccpc.ie/manage-your-money/scams-and-frauds/common-scams',
  },
  {
    name: 'Australian Gumtree Marketplace Scam',
    slug: 'australia-gumtree-marketplace-scam',
    description:
      'A seller on Gumtree, one of Australia\'s most popular classifieds sites, lists a desirable item at an unusually low price and asks the buyer to pay upfront via bank transfer or gift card before pickup, then disappears once payment is sent — a reverse version targets sellers with a fake "overpayment" that requires refunding the difference before the original payment (which never arrives) is confirmed. Scamwatch advises meeting in person to inspect and pay for an item together, and treating any pressure to pay before seeing an item, or to refund an "overpayment," as a clear warning sign.',
    categorySlug: 'online-shopping-scams',
    country: 'AU',
    alertLevel: 'medium',
    sources: ['Scamwatch (ACCC)'],
    sourceUrl: 'https://www.scamwatch.gov.au/types-of-scams/buying-and-selling-scams',
  },
  {
    name: 'Japanese Mercari Marketplace Scam',
    slug: 'japan-mercari-marketplace-scam',
    description:
      'A seller on Mercari, Japan\'s dominant secondhand marketplace app, directs a buyer to complete payment outside the app\'s own escrow system — often through a bank transfer or a fake external payment link — to avoid platform fees, then never ships the item; because Mercari\'s built-in escrow only releases funds to the seller after the buyer confirms receipt, moving payment outside it removes that protection entirely. Japan\'s National Police Agency and Mercari itself advise completing every step of a transaction inside the app, since a request to pay "off-platform" to save on fees is one of the clearest signs of a marketplace scam.',
    categorySlug: 'online-shopping-scams',
    country: 'JP',
    alertLevel: 'medium',
    sources: ['Japan National Police Agency'],
    sourceUrl: 'https://www.npa.go.jp/bureau/cyber/countermeasures/fake-shop.html',
  },
  {
    name: 'New Zealand Dating App Romance Scam',
    slug: 'newzealand-dating-app-romance-scam',
    description:
      'A relationship built over weeks through a dating app, often with a scammer claiming to work overseas in construction, the military, or as a doctor, eventually leads to a fabricated emergency — medical bills, a stuck shipment of gifts, or a stranded flight home — that only the victim\'s money can resolve, sometimes escalating over months as new crises appear each time the previous debt is paid. Netsafe names romance scams among its most financially damaging categories and advises treating any online-only partner\'s urgent request for money, however compelling the story, as a reason to stop and verify independently before sending anything.',
    categorySlug: 'romance-scams',
    country: 'NZ',
    alertLevel: 'high',
    sources: ['Netsafe'],
    sourceUrl: 'https://netsafe.org.nz/scams/romance-scams',
  },
  {
    name: 'Indian Fake Customer Care Number Scam',
    slug: 'india-fake-customer-care-scam',
    description:
      'Searching online for a company\'s customer care number — commonly for a bank, airline, or e-commerce platform like Amazon or Flipkart — surfaces a fraudulent number planted through fake listings or paid ads, and the "support agent" who answers requests remote-access software or banking OTPs to "process" a refund or complaint, then drains the victim\'s account. India\'s NCRP and CERT-In advise always using the phone number or support link listed directly on a company\'s own official app or website, never one found through a general web search.',
    categorySlug: 'tech-support-scams',
    country: 'IN',
    alertLevel: 'high',
    sources: ['National Cyber Crime Reporting Portal (NCRP)', 'CERT-In'],
    sourceUrl: 'https://cybercrime.gov.in/',
  },
  {
    name: 'UK Energy Rebate and Smart Meter Scam',
    slug: 'uk-energy-rebate-smart-meter-scam',
    description:
      'A text or doorstep visitor claims to be from Ofgem, the victim\'s energy supplier, or a government energy-rebate scheme, offering a discount or grant that requires paying an upfront "processing fee" or providing bank details, or offering a free smart-meter "upgrade" that is actually used to gain access to the home or harvest personal information. Ofgem and Report Fraud confirm that genuine energy rebates and smart meter installations are never conditional on an upfront payment, and that real energy suppliers do not cold-call demanding immediate bank details to release a rebate.',
    categorySlug: 'utility-scams',
    country: 'GB',
    alertLevel: 'medium',
    sources: ['Ofgem', 'Report Fraud (formerly Action Fraud)'],
    sourceUrl: 'https://www.ofgem.gov.uk/avoid-and-report-energy-scams',
  },
  {
    name: 'Canadian Kijiji Marketplace Scam',
    slug: 'canada-kijiji-marketplace-scam',
    description:
      'A seller on Kijiji, Canada\'s most widely used classifieds site, lists a desirable item — often a vehicle or electronics — well below market value and pressures the buyer to send an Interac e-Transfer before pickup, then stops responding once payment clears; a reverse version sends a fake "overpayment" e-Transfer confirmation to pressure a seller into shipping before real funds arrive. The Canadian Anti-Fraud Centre advises meeting in person to inspect an item before paying, and treating any pressure to pay by e-Transfer for an item not yet seen as a clear warning sign.',
    categorySlug: 'online-shopping-scams',
    country: 'CA',
    alertLevel: 'medium',
    sources: ['Canadian Anti-Fraud Centre'],
    sourceUrl: 'https://antifraudcentre-centreantifraude.ca/scams-fraudes/merchandise-marchandises-eng.htm',
  },
  {
    name: 'Swedish Fake Job Offer Scam',
    slug: 'sweden-fake-job-offer-scam',
    description:
      'A job listing found through social media or a messaging app offers well-paid remote work with minimal qualifications, then asks the applicant to pay upfront for a starter kit or training course, or to receive and forward money through their own bank account as part of the "job" — the latter actually launders stolen funds and exposes the worker, not the scammer, to criminal liability. Arbetsförmedlingen (the Swedish Public Employment Service) and Polisen warn that a genuine employer never asks a new hire to pay for their own equipment before starting, or to move money through a personal account as part of their duties.',
    categorySlug: 'employment-scams',
    country: 'SE',
    alertLevel: 'high',
    sources: ['Arbetsförmedlingen (Swedish Public Employment Service)', 'Polisen (Swedish Police Authority)'],
    sourceUrl: 'https://polisen.se/aktuellt/nyheter/nationell/2026/januari/varning-for-falska-jobbannonser-om-snabba-pengar/',
  },
  {
    name: 'German AI Voice-Cloning CEO Fraud',
    slug: 'germany-ai-voice-cloning-ceo-fraud',
    description:
      'An employee receives an urgent phone call in what sounds exactly like their CEO or a senior executive\'s voice, cloned from public interviews or earnings calls using AI, instructing an immediate wire transfer for a confidential deal or emergency — a technological escalation of Germany\'s long-running "Arnaque au Président"-style CEO fraud, now using synthetic audio instead of just a spoofed phone number or email. The BKA has documented a rising number of these AI voice-cloning incidents targeting German businesses, and recommends verifying any urgent, unusual money-transfer request through a separate, independently confirmed channel before acting, regardless of how convincing the voice sounds.',
    categorySlug: 'ai-deepfake-scams',
    country: 'DE',
    alertLevel: 'critical',
    sources: ['German Federal Criminal Police Office (BKA)'],
    sourceUrl: 'https://www.bka.de/',
  },
  {
    name: 'Indian Fake Insurance Policy Scam',
    slug: 'india-fake-insurance-policy-scam',
    description:
      'A cold caller claiming to represent a well-known insurer offers a policy with unusually high guaranteed returns or a "bonus" for renewing early, collecting premium payments for a policy that is either entirely fictitious or misrepresents the real terms of coverage, leaving the victim without valid insurance when a claim is eventually needed. The Insurance Regulatory and Development Authority of India (IRDAI) maintains a public list of registered insurers and agents, and warns that no legitimate policy guarantees investment-style returns or requires payment to an agent\'s personal account rather than the insurer\'s official channels.',
    categorySlug: 'insurance-fraud',
    country: 'IN',
    alertLevel: 'high',
    sources: ['Insurance Regulatory and Development Authority of India (IRDAI)'],
    sourceUrl: 'https://policyholder.gov.in/be-alert',
  },
  {
    name: 'Singapore Toto/4D Fake Lottery Win Scam',
    slug: 'singapore-toto-4d-lottery-scam',
    description:
      'A message claims the recipient has won a prize in Toto or 4D, Singapore Pools\' official lottery games, but releasing the winnings requires first paying a "processing" or "tax" fee — the real Singapore Pools never requires any payment to release genuine winnings, and does not contact winners by unsolicited text or social media message. The Singapore Police Force advises verifying any claimed lottery win directly through Singapore Pools\' own official outlets or website, never through a link or number provided in the message itself.',
    categorySlug: 'lottery-sweepstakes-scams',
    country: 'SG',
    alertLevel: 'medium',
    sources: ['Singapore Police Force'],
    sourceUrl: 'https://www.police.gov.sg/Advisories/Scams',
  },
  {
    name: 'Dutch Toeslagen Benefits Phishing Scam',
    slug: 'netherlands-toeslagen-benefits-phishing-scam',
    description:
      'A text or email impersonating the Belastingdienst\'s Toeslagen (benefits) service claims an issue with housing, healthcare, or childcare allowance payments and links to a fake DigiD login page that harvests credentials and banking details, distinct from the separate income-tax-refund version of this scam. Fraudehelpdesk and the Belastingdienst confirm that genuine correspondence about benefit payments arrives through a recipient\'s own verified Mijn Toeslagen account or by post, never through a link in an unsolicited text or email.',
    categorySlug: 'public-benefits-fraud',
    country: 'NL',
    alertLevel: 'medium',
    sources: ['Fraudehelpdesk (Netherlands)'],
    sourceUrl: 'https://www.fraudehelpdesk.nl/',
  },
  {
    name: 'Irish Romance Scam',
    slug: 'ireland-romance-scam',
    description:
      'A relationship built over weeks or months through a dating app or social media, often with a scammer claiming to work overseas in construction, the military, or as a doctor, eventually leads to a fabricated crisis — a medical emergency, customs fees on a gift shipment, or a stranded flight home — that only the victim\'s money can resolve. An Garda Síochána runs periodic awareness campaigns specifically on romance fraud and advises that an online-only partner who has never video-called live or met in person, and who has an urgent financial crisis, is one of the clearest warning signs.',
    categorySlug: 'romance-scams',
    country: 'IE',
    alertLevel: 'high',
    sources: ['An Garda Síochána'],
    sourceUrl: 'https://www.garda.ie/en/crime/fraud/am-i-a-victim-of-a-romance-scam-.html',
  },
  {
    name: 'Australian Tax Office Impersonation Scam',
    slug: 'australia-ato-tax-scam',
    description:
      'A caller or text impersonating the Australian Taxation Office (ATO) claims an outstanding tax debt or a warrant for arrest, demanding immediate payment through gift cards, cryptocurrency, or a bank transfer to avoid legal action. The ATO confirms it will never threaten immediate arrest, demand payment by gift card or cryptocurrency, or ask for payment over the phone during an unsolicited call, and directs anyone unsure about contact to log in directly to their own myGov or ATO online account to check their real tax status.',
    categorySlug: 'tax-scams',
    country: 'AU',
    alertLevel: 'high',
    sources: ['Australian Taxation Office (ATO)', 'Scamwatch (ACCC)'],
    sourceUrl: 'https://www.ato.gov.au/online-services/scams-cyber-safety-and-identity-protection/scam-alerts',
  },
  {
    name: 'French DGFiP Tax Refund Phishing Scam',
    slug: 'france-dgfip-tax-phishing-scam',
    description:
      'A text or email impersonating the Direction générale des Finances publiques (DGFiP), France\'s tax administration, claims a refund is pending and links to a fake impots.gouv.fr login page that harvests tax numbers and banking details, distinct from the separate CAF family-benefits version of this scam. The DGFiP confirms that genuine refund information is only ever available through a taxpayer\'s own verified impots.gouv.fr account, never through a link in an unsolicited text or email.',
    categorySlug: 'tax-scams',
    country: 'FR',
    alertLevel: 'medium',
    sources: ['Direction générale des Finances publiques (DGFiP)'],
    sourceUrl: 'https://www.impots.gouv.fr/actualite/attention-aux-arnaques',
  },
  {
    name: 'Japanese International Romance Scam',
    slug: 'japan-international-romance-scam',
    description:
      'A relationship built through a dating app or social media with someone claiming to be a foreign military officer, doctor, or engineer working overseas develops over months of messages and calls before a fabricated crisis — customs fees on a valuable gift shipment, a medical emergency, or a stuck business payment — requires the victim to send money, sometimes repeatedly as new complications appear. Japan\'s National Police Agency tracks this as a distinct pattern from the SNS-based investment-romance hybrid scam, since it relies purely on emotional appeals rather than a fake trading platform, and advises treating any online-only partner\'s urgent request for money as a certain sign of fraud.',
    categorySlug: 'romance-scams',
    country: 'JP',
    alertLevel: 'high',
    sources: ['Japan National Police Agency'],
    sourceUrl: 'https://www.npa.go.jp/bureau/safetylife/sos47/case/sns-romance/romance/',
  },
  {
    name: 'New Zealand Business Email Compromise Scam',
    slug: 'newzealand-business-email-compromise-scam',
    description:
      'A business receives what looks like a routine email from a known supplier or an executive, but the account has actually been compromised or closely spoofed, instructing a change to bank details on an upcoming invoice or an urgent wire transfer for a time-sensitive deal. NCSC New Zealand has specifically flagged business email compromise as a leading driver of its largest quarterly financial-loss spikes, and recommends verifying any changed payment details or unusual transfer request by phone, using a number already on file rather than one provided in the email itself.',
    categorySlug: 'business-email-compromise',
    country: 'NZ',
    alertLevel: 'critical',
    sources: ['National Cyber Security Centre (NCSC) — formerly CERT NZ'],
    sourceUrl: 'https://www.ownyouronline.govt.nz/business/get-protected/guides/protect-your-business-against-email-compromise/',
  },
  {
    name: 'Canadian Sextortion Scam',
    slug: 'canada-sextortion-scam',
    description:
      'A stranger who made contact through social media or a gaming platform convinces the victim, often a teenager, to share an explicit image or video, then immediately threatens to send it to family, friends, and classmates unless a payment is made, frequently continuing to demand more money even after payment. The Canadian Centre for Child Protection and the RCMP have run extensive public campaigns on the sharp rise in sextortion targeting young people, and advise never paying, immediately blocking and reporting the account, and telling a trusted adult or the police rather than handling it alone.',
    categorySlug: 'sextortion',
    country: 'CA',
    alertLevel: 'critical',
    sources: ['Canadian Centre for Child Protection', 'Royal Canadian Mounted Police (RCMP)'],
    sourceUrl: 'https://cybertip.ca/en/online-harms/sextortion/',
  },
  {
    name: 'UK Ghost Broker Car Insurance Scam',
    slug: 'uk-ghost-broker-insurance-scam',
    description:
      'A "broker" advertising unusually cheap car insurance online or through social media sells a policy that is either entirely fake or fraudulently altered after purchase to hide details like a driver\'s real age or claims history, leaving the buyer uninsured and potentially facing prosecution without knowing it. The UK\'s Insurance Fraud Bureau names this practice "ghost broking" and warns that a genuine broker will always be listed on the Financial Conduct Authority\'s register, which any buyer can check before paying for a policy.',
    categorySlug: 'insurance-fraud',
    country: 'GB',
    alertLevel: 'high',
    sources: ['Insurance Fraud Bureau (UK)', 'Financial Conduct Authority (FCA)'],
    sourceUrl: 'https://www.insurancefraudbureau.org/',
  },
  {
    name: 'UK Fake Rental Property Deposit Scam',
    slug: 'uk-fake-rental-deposit-scam',
    description:
      'A rental listing for an unusually cheap, well-located property — often copied from a genuine listing with the contact details swapped out — pressures a prospective tenant to pay a deposit or first month\'s rent before viewing in person, citing high demand or the "landlord" being abroad, then goes silent once payment clears. Action Fraud reports thousands of rental fraud cases a year, with losses averaging around £1,400 per victim and a sharp seasonal spike each September as students search for accommodation ahead of the new term. Action Fraud advises always viewing a property in person (or having someone you trust do so) before paying anything, and searching online for the listing\'s photos and address to check whether they\'ve been copied from a genuine ad elsewhere.',
    categorySlug: 'online-shopping-scams',
    country: 'GB',
    alertLevel: 'high',
    sources: ['UK Action Fraud'],
    sourceUrl: 'https://www.actionfraud.police.uk/a-z-of-fraud/rental-fraud',
  },
  {
    name: 'UK Clone Firm Investment Scam',
    slug: 'uk-clone-firm-investment-scam',
    description:
      'A fraudster sets up a fake investment firm using the real name, address, and Firm Reference Number of a genuine, FCA-authorised company, copying its website with only small changes — usually a different phone number or email address — then cold-calls or advertises to convince investors they\'re dealing with the real, regulated firm. The FCA reports over £78 million lost to clone firm scams in a single year, with average individual losses exceeding £45,000, since victims believe they\'re protected by the real firm\'s regulatory status right up until their money disappears. The FCA\'s advice: always contact a firm using the phone number listed on the FCA\'s own register, never one provided by the person who contacted you, since a firm\'s real regulatory status means nothing if you\'re actually talking to a clone.',
    categorySlug: 'investment-fraud',
    country: 'GB',
    alertLevel: 'critical',
    sources: ['UK Financial Conduct Authority', 'National Crime Agency'],
    sourceUrl: 'https://www.fca.org.uk/consumers/clone-firms-individuals',
  },
  {
    name: 'Indian Income Tax Refund Phishing Scam',
    slug: 'india-income-tax-refund-phishing-scam',
    description:
      'A text or email impersonating India\'s Income Tax Department claims a refund is pending and links to a fake e-filing portal that harvests PAN card numbers and banking credentials, distinct from the more elaborate "digital arrest" and customs-parcel impersonation scams already common in India. The Income Tax Department confirms that refund status is only ever available through a taxpayer\'s own verified account on the official incometax.gov.in portal, never through a link in an unsolicited text or email.',
    categorySlug: 'tax-scams',
    country: 'IN',
    alertLevel: 'medium',
    sources: ['National Cyber Crime Reporting Portal (NCRP)'],
    sourceUrl: 'https://cybercrime.gov.in/',
  },
  {
    name: 'German Bürgergeld Benefits Phishing Scam',
    slug: 'germany-burgergeld-benefits-phishing-scam',
    description:
      'A text or email impersonating the Bundesagentur für Arbeit claims an issue with a recipient\'s Bürgergeld (basic income support) payment and links to a fake login page that harvests personal and banking details, threatening suspension of benefits if the recipient doesn\'t act immediately. The Bundesagentur für Arbeit confirms that genuine correspondence about benefit payments arrives by post or through a recipient\'s own verified online account, never through a link in an unsolicited text or email demanding immediate action.',
    categorySlug: 'public-benefits-fraud',
    country: 'DE',
    alertLevel: 'medium',
    sources: ['Bundesagentur für Arbeit'],
    sourceUrl: 'https://www.arbeitsagentur.de/news/fake-anrufe',
  },
  {
    name: 'German DHL Package Tracking Phishing SMS',
    slug: 'germany-dhl-tracking-phishing-sms',
    description:
      'A text message impersonating DHL claims a package couldn\'t be delivered and links to a fake tracking page that harvests personal and card details, or installs malware disguised as a tracking app — distinct from the customs-fee variant targeting international shipments, since this version simply invents a routine domestic delivery problem. Germany\'s Verbraucherzentrale confirms these messages are sent in bulk regardless of whether the recipient is actually expecting a parcel, and that DHL never sends tracking links by SMS, so the safest response is to check delivery status only by logging into the DHL app or website directly.',
    categorySlug: 'package-delivery-scams',
    country: 'DE',
    alertLevel: 'high',
    sources: ['Verbraucherzentrale (Germany)'],
    sourceUrl: 'https://www.verbraucherzentrale.de/wissen/digitale-welt/mobilfunk-und-festnetz/paketdienstsms-vorsicht-abzocke-58988',
  },
  {
    name: 'German Romance Scam (Liebesbetrug)',
    slug: 'germany-romance-scam-liebesbetrug',
    description:
      'A relationship built over weeks or months on a dating site or social network, with the scammer posing as an attractive professional working abroad, eventually produces a fabricated crisis — a relative\'s medical operation, a stolen passport, an unpaid hotel bill during a business trip, often set in West Africa — that only a wire transfer via Western Union or MoneyGram can resolve. German police prevention guidance (polizei-beratung.de) notes that scammers deliberately make themselves "indispensable in daily life" through constant contact without ever meeting in person, and that requests for copies of ID documents (framed as needed to open a joint account) are increasingly used for document forgery rather than the stated purpose. Victims lost at least €50 million to romance scams in Germany in 2024 alone, according to a survey of all 16 state criminal police offices.',
    categorySlug: 'romance-scams',
    country: 'DE',
    alertLevel: 'high',
    sources: ['Bundeskriminalamt (BKA)', 'Polizeiliche Kriminalprävention'],
    sourceUrl: 'https://www.polizei-beratung.de/themen-und-tipps/betrug/scamming/',
  },
  {
    name: 'German Fake Microsoft Tech Support Scam (Support-Betrug)',
    slug: 'germany-support-betrug-fake-microsoft-tech-support',
    description:
      'A cold call or an alarming pop-up warning claims a Windows PC is infected with malware, then walks the victim through "diagnostic" steps that display a generic, meaningless infection code as if it were unique proof of a problem, before pressuring them to install remote-access software or pay up to around €400 for bogus "cleanup" software. Once remote access is granted, the caller can steal banking credentials directly from the computer or install ransomware. Germany\'s Federal Office for Information Security (BSI) has issued explicit warnings confirming the pattern is active and ongoing, and consumer advocates note the caller ID is often spoofed to display a genuine-looking German phone number.',
    categorySlug: 'tech-support-scams',
    country: 'DE',
    alertLevel: 'high',
    sources: ['Bundesamt für Sicherheit in der Informationstechnik (BSI)', 'Verbraucherzentrale'],
    sourceUrl: 'https://www.verbraucherzentrale.de/wissen/vertraege-reklamation/abzocke/warnung-abzocke-durch-angebliche-microsoftmitarbeiter-24641',
  },
  {
    name: 'German Sparkasse Online Banking "Reactivation" Phishing',
    slug: 'germany-sparkasse-online-banking-reactivation-phishing',
    description:
      'A text message or email impersonating Sparkasse, or sometimes Volksbank/Raiffeisenbank, warns that the recipient\'s S-pushTAN online banking authorization is expiring or has been deactivated, and must be "confirmed" or reactivated immediately through a link. The link leads to a spoofed login page that captures both the victim\'s online banking credentials and a one-time TAN code, which the scammers immediately relay to authorize a real transfer out of the account before the code expires — exploiting the specific TAN-confirmation step German online banking relies on for every transfer. Verbraucherzentrale\'s Phishing-Radar has tracked recurring waves of this exact message, flagging fresh instances as recently as August 2026.',
    categorySlug: 'phishing',
    country: 'DE',
    alertLevel: 'critical',
    sources: ['Verbraucherzentrale Phishing-Radar'],
    sourceUrl: 'https://www.verbraucherzentrale.de/wissen/digitale-welt/mobilfunk-und-festnetz/fakesms-zu-onlinebanking-steuerbescheiden-und-gerichtsverfahren-67038',
  },
  {
    name: 'German Fake Prize Notification Scam (Falsches Gewinnversprechen)',
    slug: 'germany-falsches-gewinnversprechen-fake-prize-scam',
    description:
      'A letter or email congratulates the recipient on winning a prize worth hundreds of euros in a contest they never entered, listing an inconsistent prize amount and no verifiable sender address, and instructing them to call a listed phone number with a "win code" to claim it. Calling connects to an operator who either harvests further personal and banking details or pressures the caller into an expensive subscription or an upfront "processing fee" before any prize — which never actually arrives. Regional consumer protection offices, including Verbraucherzentrale Sachsen, have documented and warned about this exact pattern arriving by post to households that never entered any competition.',
    categorySlug: 'lottery-sweepstakes-scams',
    country: 'DE',
    alertLevel: 'medium',
    sources: ['Verbraucherzentrale Sachsen'],
    sourceUrl: 'https://www.verbraucherzentrale-sachsen.de/pressemeldungen/vertraege-reklamation/abzocke/falsches-gewinnversprechen-per-post-113972',
  },
  {
    name: 'Australian Lottery Win Scam',
    slug: 'australia-lottery-scam',
    description:
      'A call, text, or letter claims the recipient has won a prize in Lotto, Powerball, or a similarly named Australian lottery draw, but releasing the winnings requires first paying a "release fee," "tax," or courier charge — the real lottery operators never require payment to release a genuine prize and do not contact winners this way, since Australian lottery wins are claimed directly through the operator\'s own official channels. Scamwatch advises treating any unsolicited win notification tied to a lottery the recipient doesn\'t remember entering as fraudulent, since Australian lotteries only pay out to entrants who actually purchased a ticket.',
    categorySlug: 'lottery-sweepstakes-scams',
    country: 'AU',
    alertLevel: 'medium',
    sources: ['Scamwatch (ACCC)'],
    sourceUrl: 'https://www.scamwatch.gov.au/types-of-scams/unexpected-money-scams',
  },
  {
    name: 'Singapore Business Email Compromise Scam',
    slug: 'singapore-business-email-compromise-scam',
    description:
      'A company\'s finance team receives what appears to be a routine email from a known supplier or an executive, but the account has actually been compromised or closely spoofed, instructing an urgent change to bank details on an outstanding invoice or a time-sensitive wire transfer. The Singapore Police Force names business email compromise among its costliest scam categories for companies specifically, and recommends verifying any changed payment details or unusual transfer request by phone using a number already on file, never one provided in the email itself.',
    categorySlug: 'business-email-compromise',
    country: 'SG',
    alertLevel: 'critical',
    sources: ['Singapore Police Force'],
    sourceUrl: 'https://www.police.gov.sg/Advisories/Scams',
  },
  {
    name: 'French France Travail Benefits Phishing Scam',
    slug: 'france-travail-phishing-scam',
    description:
      'An email or text impersonating France Travail (the French national employment agency, formerly Pôle emploi) warns that a jobseeker\'s registration will be cancelled within 48 hours unless they "regularize their situation" through a link, or claims a benefit payment has been blocked and asks the recipient to confirm banking details to release it. France Travail\'s own security guidance warns that genuine messages never come from an address outside francetravail.fr or pole-emploi.fr, never demand banking or Social Security details by email, and never rely on manufactured urgency like a 48-hour deadline — legitimate account actions happen through a jobseeker\'s own verified portal login.',
    categorySlug: 'public-benefits-fraud',
    country: 'FR',
    alertLevel: 'medium',
    sources: ['France Travail'],
    sourceUrl: 'https://www.francetravail.fr/candidat/soyez-vigilants/attention--mise-en-garde-contre.html',
  },
  {
    name: 'French Leboncoin Marketplace Scam',
    slug: 'france-leboncoin-marketplace-scam',
    description:
      'A seller on Leboncoin, France\'s dominant classifieds marketplace, lists a desirable item well below market value and pressures the buyer to pay upfront via bank transfer before pickup, then stops responding once payment clears; a reverse version sends a fake payment confirmation to pressure a seller into shipping before real funds arrive. Info Escroqueries and Leboncoin itself advise completing payment and handover in person where possible, and treating any pressure to pay before seeing an item as a clear warning sign.',
    categorySlug: 'online-shopping-scams',
    country: 'FR',
    alertLevel: 'medium',
    sources: ['Info Escroqueries'],
    sourceUrl: 'https://www.police-nationale.interieur.gouv.fr/actualite/info-escroqueries-plate-forme-pour-signaler-escroqueries-sur-internet',
  },
  {
    name: 'French Romance Scam (Arnaque Sentimentale)',
    slug: 'france-romance-scam-arnaque-sentimentale',
    description:
      'A relationship begun on a dating site or social network develops over weeks or months into what feels like a genuine romantic or close friendship, building emotional trust and dependency before the scammer starts asking for money under a series of urgent pretexts, with each request larger than the last until the victim can no longer pay. Cybermalveillance.gouv.fr, France\'s national cybersecurity assistance service, warns that a victim who refuses to keep paying may then be blackmailed with intimate photos or videos they shared during the relationship. French police recorded 3,400 confirmed reports of romance scams in 2024, a figure rising steadily since 2021, though officials estimate only 5 to 15 percent of victims ever file a complaint — nearly 80 percent of victims are women over 50, and losses in a single case can reach into the hundreds of thousands of euros over a relationship lasting months or years.',
    categorySlug: 'romance-scams',
    country: 'FR',
    alertLevel: 'high',
    sources: ['Cybermalveillance.gouv.fr', 'Info Escroqueries'],
    sourceUrl: 'https://www.cybermalveillance.gouv.fr/tous-nos-contenus/fiches-reflexes/comment-reagir-en-cas-descroquerie-sentimentale',
  },
  {
    name: 'Dutch Romance Scam',
    slug: 'netherlands-romance-scam',
    description:
      'A relationship built over weeks or months through a dating app or social media, often with a scammer claiming to work overseas in construction, the military, or as a doctor, eventually leads to a fabricated crisis — a medical emergency, customs fees on a gift shipment, or a stranded flight home — that only the victim\'s money can resolve. Fraudehelpdesk names "daten met een malafide match" (dating a fraudulent match) among its most damaging fraud categories by average loss, and advises treating any online-only partner\'s urgent request for money as a certain sign of fraud, however long the relationship has developed.',
    categorySlug: 'romance-scams',
    country: 'NL',
    alertLevel: 'high',
    sources: ['Fraudehelpdesk (Netherlands)'],
    sourceUrl: 'https://www.fraudehelpdesk.nl/fraude/datingfraude/',
  },
  {
    name: 'Dutch PostNL Delivery Phishing SMS',
    slug: 'netherlands-postnl-phishing-sms',
    description:
      'A text message impersonating PostNL, the Netherlands\' national postal carrier, claims a package couldn\'t be delivered or was returned to the sorting center and links to a fake tracking or redelivery page that harvests personal and payment details — sometimes instead demanding a small customs or shipping fee through the fake link. PostNL confirms it never asks customers to pay through a link in an email or text message, and recommends checking delivery status only through the official app or website, or via the anti-phishing verification code PostNL includes in its genuine emails.',
    categorySlug: 'package-delivery-scams',
    country: 'NL',
    alertLevel: 'high',
    sources: ['Fraudehelpdesk (Netherlands)'],
    sourceUrl: 'https://opgelicht.avrotros.nl/alerts/phishing-sms-namens-postnl-in-omloop-werk-je-gegevens-bij-voor-een-nieuwe-bezorging-13773',
  },
  {
    name: 'Dutch Microsoft Helpdesk Tech Support Scam',
    slug: 'netherlands-microsoft-helpdesk-scam',
    description:
      'An unsolicited caller claiming to be from Microsoft support warns that the victim\'s computer has a virus or a suspicious IP address, and talks them through installing remote-access software to "fix" the fabricated problem. Fraudehelpdesk warns that once the scammer has control of the computer, they ask the victim to log into online banking under the pretense of "installing antivirus software" or "paying for helpdesk services," then use the remote-access connection to alter the payment amount or destination before the transfer completes. Microsoft never initiates unsolicited contact about a computer problem, and Fraudehelpdesk advises hanging up immediately and never installing software at the request of an unexpected caller.',
    categorySlug: 'tech-support-scams',
    country: 'NL',
    alertLevel: 'high',
    sources: ['Fraudehelpdesk (Netherlands)'],
    sourceUrl: 'https://www.fraudehelpdesk.nl/alert/telefoontjes-namens-de-helpdesk-van-microsoft/',
  },
  {
    name: 'New Zealand Tech Support Scam',
    slug: 'newzealand-tech-support-scam',
    description:
      'A caller claiming to be from Microsoft, Google, or a New Zealand internet provider such as Spark or Chorus warns of a virus or connection fault and talks the victim into installing remote-access software, then either charges a large fee for fake "repairs" or uses the access to search the device for banking details. Netsafe advises that legitimate tech companies and ISPs never make unsolicited calls about a device problem, never ask for remote access to fix one, and never request payment by gift card or cryptocurrency.',
    categorySlug: 'tech-support-scams',
    country: 'NZ',
    alertLevel: 'high',
    sources: ['Netsafe'],
    sourceUrl: 'https://netsafe.org.nz/scams/tech-support-scams',
  },
  {
    name: 'New Zealand Webcam Blackmail (Sextortion) Scam',
    slug: 'newzealand-webcam-blackmail-scam',
    description:
      'An email claims the sender hijacked the recipient\'s webcam while they visited an adult website and recorded compromising footage, threatening to send it to every contact in their address book unless a ransom — typically NZD $1,700 to $3,000, often demanded in cryptocurrency — is paid within a short deadline, sometimes including an old leaked password as false proof of access. CERT NZ has received no confirmed reports of such a video actually existing or being sent, and advises against paying, replying, or engaging with the sender in any way — simply blocking the message and, if the same password is reused elsewhere, changing it.',
    categorySlug: 'sextortion',
    country: 'NZ',
    alertLevel: 'high',
    sources: ['CERT NZ', 'Netsafe'],
    sourceUrl: 'https://netsafe.org.nz/webcam-blackmail-scams/',
  },
  {
    name: 'New Zealand Work and Income Benefit Phishing Scam',
    slug: 'newzealand-work-and-income-benefit-phishing-scam',
    description:
      'A text or email impersonating Work and Income (part of New Zealand\'s Ministry of Social Development) claims a one-off payment, benefit top-up, or welfare loan is available, or that a current payment is at risk, and links to a fake login page asking for a username and password to "verify" the account. Work and Income states plainly that it will never contact a client to ask for their username or password, and that any message asking for these details by text or email link is not genuine — a real benefit query or update is only ever handled by logging into MyMSD directly or contacting Work and Income through its official phone line.',
    categorySlug: 'public-benefits-fraud',
    country: 'NZ',
    alertLevel: 'medium',
    sources: ['Ministry of Social Development (NZ)'],
    sourceUrl: 'https://www.workandincome.govt.nz/about-this-site/security.html',
  },
  {
    name: 'Swedish AI and Crypto Investment Scam',
    slug: 'sweden-ai-crypto-investment-scam',
    description:
      'An online ad or social media message features a fabricated endorsement — often an AI-generated deepfake video of a well-known Swedish public figure — promoting an automated trading platform that claims to use artificial intelligence to guarantee high returns on a cryptocurrency investment, walking the victim through a small initial deposit before pressuring much larger transfers that can never be withdrawn. Sweden\'s Financial Supervisory Authority (Finansinspektionen) reports that AI and crypto lures are now common in investment fraud and maintains a public warning list of firms known to offer investments illegally; genuine regulated investment firms in Sweden are always listed in FI\'s own company register, which is free to check before sending any money.',
    categorySlug: 'investment-fraud',
    country: 'SE',
    alertLevel: 'critical',
    sources: ['Finansinspektionen', 'Polisen'],
    sourceUrl: 'https://fi.se/sv/for-konsumenter/bedragerier/',
  },
  {
    name: 'Swedish Skatteverket Tax Refund Phishing Scam',
    slug: 'sweden-skatteverket-refund-phishing-scam',
    description:
      'A text or email impersonating Skatteverket, Sweden\'s tax agency, claims a tax refund is waiting and links to a fake page asking the recipient to confirm bank account details or log in with BankID, timed especially around the spring tax declaration period. Skatteverket confirms it never requests account details by email or SMS and never sends refund links by text — a genuine refund is paid automatically to the bank account already registered with the agency, checkable directly by logging into "Mina sidor" on skatteverket.se, and suspicious texts can be forwarded to 7726 (SPAM) to report them.',
    categorySlug: 'tax-scams',
    country: 'SE',
    alertLevel: 'medium',
    sources: ['Skatteverket'],
    sourceUrl: 'https://www.skatteverket.se/omoss/kontaktaoss/mejlaoss/omnatbedragerier.4.8bcb26d16a5646a148128ae.html',
  },
  {
    name: 'Swedish Microsoft Tech Support Scam',
    slug: 'sweden-microsoft-tech-support-scam',
    description:
      'An unsolicited caller claiming to represent Microsoft warns that the victim\'s computer is infected with a virus and talks them into installing remote-access software, then charges for a bogus "cleaning service" — often repeating the transaction multiple times once the scammer has control of the computer and can see everything on screen. Swedish police have prosecuted organized rings running this scheme at scale, including a case before Örebro District Court where pensioners were systematically targeted through fake warnings impersonating Windows security alerts. Microsoft never initiates unsolicited contact about a computer problem, and Swedish police advise hanging up immediately and never granting remote access to an unexpected caller.',
    categorySlug: 'tech-support-scams',
    country: 'SE',
    alertLevel: 'high',
    sources: ['Polisen'],
    sourceUrl: 'https://www.svt.se/nyheter/inrikes/polisen-varnar-for-microsoft-bedragare',
  },
  {
    name: 'Irish Fake Recruitment Scam',
    slug: 'ireland-fake-recruitment-scam',
    description:
      'A job advert on a well-known recruitment platform uses a real, well-known company\'s name and branding without its knowledge, offering an attractive remote or flexible role and moving communication quickly to a messaging app for a fast "interview." The fake employer then asks the applicant to pay upfront for equipment, training materials, or a background-check fee, or to hand over personal and banking details under the guise of payroll setup. An Garda Síochána\'s National Economic Crime Bureau has flagged recruitment scams as a rising fraud category and advises independently verifying any employer directly through the real company\'s own official channels before paying anything or sharing personal information during a hiring process.',
    categorySlug: 'employment-scams',
    country: 'IE',
    alertLevel: 'medium',
    sources: ['An Garda Síochána'],
    sourceUrl: 'https://www.garda.ie/en/crime/fraud/',
  },
  {
    name: 'Irish National Lottery Impersonation Scam',
    slug: 'ireland-national-lottery-impersonation-scam',
    description:
      'An email or letter claims the recipient has won a large cash prize in the Irish National Lottery, even though they never bought a ticket, and asks for an upfront "processing" or "release" fee, or for banking details to transfer the winnings. The Competition and Consumer Protection Commission (CCPC) confirms Ireland\'s National Lottery never contacts winners by email and never requires any fee to release a genuine prize — a real win can only come from a ticket the person actually bought and can produce themselves.',
    categorySlug: 'lottery-sweepstakes-scams',
    country: 'IE',
    alertLevel: 'medium',
    sources: ['Competition and Consumer Protection Commission (CCPC)'],
    sourceUrl: 'https://www.ccpc.ie/manage-your-money/scams-and-frauds/common-scams',
  },
  {
    name: 'Irish MyGovID Phishing Scam',
    slug: 'ireland-mygovid-phishing-scam',
    description:
      'A text or email impersonating MyGovID, the digital identity service used to access Irish government services like welfare payments and tax records, claims the account needs to be "verified" or "reactivated" and links to a fake site built to look exactly like MyGovID or MyWelfare, harvesting a name, PPS Number, and bank account details once entered. MyGovID confirms it will never text, email, or call asking for personal or financial details unless the person themselves first contacted the help desk, and that its only real domains are mygovid.ie and gov.ie — genuine correspondence never includes a link asking someone to "validate" their account.',
    categorySlug: 'phishing',
    country: 'IE',
    alertLevel: 'high',
    sources: ['Department of Social Protection (Ireland)'],
    sourceUrl: 'https://www.mygovid.ie/en-IE/Security',
  },
  {
    name: 'India AI Deepfake Sextortion Video Call Scam',
    slug: 'india-ai-deepfake-sextortion-scam',
    description:
      'A scammer initiates a video call, often through a fake profile or a hacked messaging contact, and uses real-time AI face-swapping and screen-recording tools to make it appear the victim engaged in explicit activity on camera, then threatens to send the fabricated footage to family, employers, or social media contacts unless a payment is made immediately, exploiting shame and panic to prevent the victim from pausing to verify what actually happened. India\'s Indian Cyber Crime Coordination Centre (I4C) has flagged AI-generated sextortion as a fast-growing category built on the same synthetic-media tools increasingly used across digital arrest and romance scams, and advises ending the call immediately, not paying, and reporting through the National Cyber Crime Reporting Portal rather than engaging with the caller.',
    categorySlug: 'sextortion',
    country: 'IN',
    alertLevel: 'critical',
    sources: ['Indian Cyber Crime Coordination Centre (I4C)'],
    sourceUrl: 'https://i4c.mha.gov.in/',
  },
  {
    name: 'India Fake Temple and Relief Fund Donation Scam',
    slug: 'india-fake-temple-relief-fund-donation-scam',
    description:
      'A fake website, QR code, or social media campaign impersonates a well-known cause — a major temple building fund, a national disaster relief fund, or a natural-calamity appeal — using official-looking branding and a fabricated UPI ID resembling the genuine one to collect donations that never reach the real cause, often surging around major festivals or in the aftermath of widely covered disasters. Indian cybercrime authorities advise verifying any charity through NGO Darpan, the government\'s official registry of nonprofit organizations, and donating only through a cause\'s own verified website or officially published payment details rather than a link or QR code shared in a message or social post.',
    categorySlug: 'charity-scams',
    country: 'IN',
    alertLevel: 'medium',
    sources: ['National Cyber Crime Reporting Portal (NCRP)'],
    sourceUrl: 'https://cybercrime.gov.in/',
  },
  {
    name: 'Japan "Yami Baito" Dark Part-Time Job Recruitment Scam',
    slug: 'japan-yami-baito-dark-part-time-job-scam',
    description:
      'A job ad on social media or a messaging app offers unusually high pay for vague, simple-sounding work — "just follow a script" phone work, or transporting packages and cash — and asks applicants to hand over ID photos and personal details before revealing what the job actually involves. The real work turns out to be a direct role in a fraud operation: acting as the caller, cash collector, or courier in phone and remittance scams targeting other victims, and once recruits have provided identifying information, they are often threatened into continuing under fear the recruiters know who they are and where they live. Japan\'s National Police Agency has issued repeated public warnings about these "yami baito" (dark part-time job) postings, noting that recruiters increasingly disguise them as ordinary jobs, and advises treating any job that hides its actual duties or demands ID before explaining the work as a serious warning sign.',
    categorySlug: 'employment-scams',
    country: 'JP',
    alertLevel: 'critical',
    sources: ['National Police Agency (Japan)'],
    sourceUrl: 'https://www.npa.go.jp/bureau/safetylife/yamibaito/hanzaishaboshu.html',
  },
  {
    name: 'Japan Fake Security Warning Support Scam',
    slug: 'japan-fake-security-warning-support-scam',
    description:
      'A pop-up appears while browsing, filling the screen with a loud alarm sound and a warning that the computer is infected with a virus, displaying a phone number to call for "official" support — calling connects to a scammer who talks the victim into installing remote-access software and paying for fake antivirus or repair services. Japan\'s Information-technology Promotion Agency (IPA) has reported monthly consultation volume on these fake security warnings reaching record highs, and advises never calling the number shown, never granting remote access, and simply closing the browser or restarting the device if such a warning appears.',
    categorySlug: 'tech-support-scams',
    country: 'JP',
    alertLevel: 'high',
    sources: ['Information-technology Promotion Agency (IPA)'],
    sourceUrl: 'https://www.ipa.go.jp/security/anshin/measures/fakealert.html',
  },
  {
    name: 'Japan Deepfake Celebrity Investment Scam Ads',
    slug: 'japan-deepfake-celebrity-investment-scam-ads',
    description:
      'AI-manipulated video and voice footage of real, famous Japanese figures — most prominently entrepreneur Yusaku Maezawa — is used in ads on Facebook, Instagram, LINE, and YouTube to promote fake "exclusive investment communities" promising guaranteed returns. Victims who respond are moved into LINE, WhatsApp, or Telegram groups run by human handlers who build trust over days or weeks before soliciting money transfers. Japan\'s National Police Agency has recorded thousands of these SNS-based celebrity-impersonation investment fraud cases in a single recent year, and Maezawa\'s own reporting hotline logged over 180 complaints in its first ten days; Japanese authorities have since issued formal administrative guidance to Meta, Google, TikTok, X, and LINE Yahoo demanding advertiser identity verification.',
    categorySlug: 'ai-deepfake-scams',
    country: 'JP',
    alertLevel: 'critical',
    sources: ['National Police Agency (Japan)'],
    sourceUrl: 'https://tokunaga-lawfirm.com/column/2026/05/19/kiriya-hiroto-toushi-sagi/',
  },
  {
    name: 'Japan Post-Disaster Donation Fraud',
    slug: 'japan-post-disaster-donation-fraud',
    description:
      'After a major disaster such as the January 2024 Noto Peninsula earthquake, scammers impersonate legitimate relief organizations and public bodies by phone, mail, and social media to solicit donations, directing victims to personal bank accounts, e-money, or QR codes instead of verified charity accounts — some also pose as a disaster-affected relative asking for emergency money. Japan\'s National Consumer Affairs Center and Financial Services Agency issued official warnings after the Noto earthquake, noting the same pattern followed the 2011 Tōhoku and 2016 Kumamoto earthquakes, and advise the public to independently verify any donation account number against those publicized through television or newspaper coverage before transferring money.',
    categorySlug: 'charity-scams',
    country: 'JP',
    alertLevel: 'high',
    sources: ['National Consumer Affairs Center of Japan (NCAC)', 'Financial Services Agency (Japan)'],
    sourceUrl: 'https://www.kokusen.go.jp/news/data/n-20240112_2.html',
  },
  {
    name: 'Japan Business Email Compromise (BEC) Fraud',
    slug: 'japan-business-email-compromise-fraud',
    description:
      'A company employee receives what looks like a routine email from a genuine business partner or vendor, requesting an invoice payment be sent to "corrected" bank details — the message actually comes from a spoofed or compromised account impersonating the real counterpart. Japan Airlines disclosed in December 2017 that it lost roughly ¥380 million across two such incidents: in the larger case, fraudsters impersonating a foreign aircraft-leasing partner sent a fake corrected invoice that changed only the payee bank details, and a Tokyo headquarters employee wired about ¥360 million to a fraudulent Hong Kong account before the fraud was discovered. Japan\'s Information-technology Promotion Agency (IPA) has since used cases like this in ongoing guidance urging Japanese companies to verify any change in payment details by phone, through a previously known number, before wiring funds.',
    categorySlug: 'business-email-compromise',
    country: 'JP',
    alertLevel: 'high',
    sources: ['Information-technology Promotion Agency (IPA)'],
    sourceUrl: 'https://www.ipa.go.jp/security/bec/index.html',
  },
  {
    name: 'Singapore Courier Impersonation Phishing Scam',
    slug: 'singapore-courier-impersonation-phishing-scam',
    description:
      'A message via Apple iMessage, WhatsApp, or email — often from a foreign number or an address impersonating a recognized courier such as SingPost, DHL, NinjaVan, or J&T Express — claims a parcel delivery failed or a customs fee is owed, linking to a fake page that harvests personal and banking details. The Singapore Police Force has flagged a sharp rise in these courier impersonation scams, noting SingPost itself never sends clickable payment links by WhatsApp or SMS and only uses official @singpost.com email addresses, never personal accounts like Gmail or Hotmail.',
    categorySlug: 'package-delivery-scams',
    country: 'SG',
    alertLevel: 'high',
    sources: ['Singapore Police Force'],
    sourceUrl: 'https://www.police.gov.sg/Advisories/Scams',
  },
  {
    name: 'Singapore Malware Sextortion Scam',
    slug: 'singapore-malware-sextortion-scam',
    description:
      'A contact made through a dating app or online sexual-services platform invites the victim to a "naked chat" over video, but first asks them to download a mobile app via a link to join the call — the app is actually malware that silently steals the phone\'s entire contact list. Once explicit images or video are captured during the call, the scammer threatens to send them to the victim\'s harvested contacts — family, colleagues, friends — unless a payment is made. The Singapore Police Force advises never installing an app to join a video call from someone met online, and to report immediately rather than pay if targeted, since paying does not guarantee the material won\'t be released anyway.',
    categorySlug: 'sextortion',
    country: 'SG',
    alertLevel: 'critical',
    sources: ['Singapore Police Force'],
    sourceUrl: 'https://www.police.gov.sg/Advisories/Scams',
  },
  {
    name: 'Australian Online Romance Scam',
    slug: 'australia-online-romance-scam',
    description:
      'A relationship built over weeks or months through a dating app, social media, or an online forum leads to a scammer carefully building trust before shifting the conversation toward requests for money, gifts, or personal information, often introducing a fabricated crisis or a "guaranteed" investment opportunity once the emotional connection feels established. Scamwatch reported more than $28.6 million in romance scam losses across 2025 alone, a 21.8 percent increase on the year before, with people aged 65 and over suffering the highest total losses and more than 80 percent of losses originating from contact made on dating platforms and social media. The National Anti-Scam Centre advises never sending money or investing based on the advice of someone met only online, no matter how long the relationship has developed.',
    categorySlug: 'romance-scams',
    country: 'AU',
    alertLevel: 'critical',
    sources: ['National Anti-Scam Centre / Scamwatch (ACCC)'],
    sourceUrl: 'https://www.scamwatch.gov.au/types-of-scams/relationship-scams',
  },
  {
    name: 'Australian Task-Based Job Scam',
    slug: 'australia-task-based-job-scam',
    description:
      'A recruiter contacts the victim through WhatsApp or another messaging app offering flexible, well-paid remote work completing simple repetitive tasks, such as rating products online, and sets up a cryptocurrency account to track "earnings." An initial small payout is released to build trust, but the app soon requires the victim to "top up" their account with their own money to unlock further tasks and withdraw commissions — a top-up that is never returned. Scamwatch recorded a more than 740 percent increase in losses to job scams in 2025, reaching $19.6 million with a median individual loss of $6,000, and advises that no genuine job ever requires paying money before earning any.',
    categorySlug: 'employment-scams',
    country: 'AU',
    alertLevel: 'critical',
    sources: ['National Anti-Scam Centre / Scamwatch (ACCC)'],
    sourceUrl: 'https://www.scamwatch.gov.au/types-of-scams/jobs-and-employment-scams',
  },
  {
    name: 'Canadian Romance Scam',
    slug: 'canada-romance-scam',
    description:
      'A relationship built over weeks or months through a dating app or social media, often with a scammer claiming an "exotic" job that explains why they can never meet in person — working on an oil rig, deployed with the military overseas, or a doctor with an international aid organization — eventually leads to a fabricated emergency or investment opportunity that only the victim\'s money can resolve. The Canadian Anti-Fraud Centre reported nearly $63 million in romance scam losses in 2025 alone, up from $58 million in 2024, while estimating that only 5 to 10 percent of victims ever report the fraud due to shame and stigma — meaning true losses are likely far higher. Increasingly, scammers use AI-generated photos and video to make the fabricated persona more convincing, and push victims toward cryptocurrency transfers specifically because they are nearly impossible to reverse.',
    categorySlug: 'romance-scams',
    country: 'CA',
    alertLevel: 'critical',
    sources: ['Canadian Anti-Fraud Centre'],
    sourceUrl: 'https://antifraudcentre-centreantifraude.ca/scams-fraudes/romance-rencontre-eng.htm',
  },
  {
    name: 'Canadian Lottery and Prize Scam',
    slug: 'canada-lottery-prize-scam',
    description:
      'A phone call, email, or letter claims the recipient has won a large lottery prize, cash award, or vehicle through a contest they never entered, but releasing the winnings requires first paying a "processing fee" or covering taxes — commonly demanded through Apple gift cards or a wire transfer. The Canadian Anti-Fraud Centre and RCMP confirm that no legitimate lottery or sweepstakes ever requires a fee or tax payment before releasing a genuine prize, and advise treating any unsolicited notification of an unentered win as certain fraud, regardless of how official the caller or letterhead appears.',
    categorySlug: 'lottery-sweepstakes-scams',
    country: 'CA',
    alertLevel: 'medium',
    sources: ['Canadian Anti-Fraud Centre'],
    sourceUrl: 'https://antifraudcentre-centreantifraude.ca/scams-fraudes/prize-prix-eng.htm',
  },
  {
    name: 'California EDD Text Phishing Scam',
    slug: 'california-edd-text-phishing-scam',
    description:
      'A text message impersonating the California Employment Development Department (EDD) or its former debit-card partner Bank of America warns of a problem with an unemployment or disability claim and links to a fake page designed to harvest personal and banking details. EDD confirms it only sends legitimate texts from specific short codes and that any linked site must actually contain "edd.ca.gov" — scammers have kept referencing the old Bank of America relationship even after EDD switched payment processors in 2024, relying on outdated details to seem credible to claimants who haven\'t kept up with the change.',
    categorySlug: 'public-benefits-fraud',
    alertLevel: 'high',
    sources: ['California Employment Development Department (EDD)'],
    sourceUrl: 'https://www.edd.ca.gov/en/newsroom/benefitting-californians/2024/best-practices-to-protect-yourself-and-avoid-scammers/',
  },
  {
    name: 'State DMV Unpaid Toll Text Scam',
    slug: 'state-dmv-unpaid-toll-text-scam',
    description:
      'A text message impersonating a state toll agency or DMV claims an unpaid toll or fee is owed, threatening late penalties or license suspension to create urgency, and links to a page that steals personal and financial information. State DMVs across the country — including Virginia, West Virginia, Vermont, Colorado, and Iowa — have issued matching warnings confirming they never send text messages about toll bills or fees, and advise forwarding suspicious texts to 7726 (SPAM) or reporting them to the FTC rather than clicking any link.',
    categorySlug: 'government-impersonation',
    alertLevel: 'high',
    sources: ['Virginia DMV'],
    sourceUrl: 'https://www.dmv.virginia.gov/news/virginia-dmv-warns-customers-toll-charge-text-scam',
  },
  {
    name: 'California Franchise Tax Board Refund Phishing',
    slug: 'california-franchise-tax-board-refund-phishing',
    description:
      'A text message impersonating the California Franchise Tax Board (FTB) — the state\'s own tax authority, separate from the IRS — dangles a fake tax refund to lure recipients into clicking a link and entering their Social Security number, password, banking details, or credit card number on a spoofed page. California Attorney General Rob Bonta issued a consumer alert specifically warning taxpayers about this text-based scam, noting it exploits the same refund-anticipation psychology as IRS impersonation scams but targets the state-level tax system many people don\'t think to double-check.',
    categorySlug: 'tax-scams',
    alertLevel: 'high',
    sources: ['California Attorney General'],
    sourceUrl: 'https://oag.ca.gov/news/press-releases/attorney-general-bonta-warns-californians-text-based-scams-targeting-taxpayers',
  },
  {
    name: 'DoorDash Dasher Account-Takeover Phishing',
    slug: 'doordash-dasher-account-takeover-phishing',
    description:
      'A caller or texter posing as "DoorDash Support" targets active drivers with a fabricated pretext — a customer supposedly canceled an order and needs the driver\'s password to remove it, a bonus or "financial assistance" is offered in exchange for login details, or the driver is told their password is urgently needed to keep working. Handing over credentials lets the scammer redirect the driver\'s earnings and banking details. DoorDash\'s own help center states flatly that the company "will never need your password to pay you," making any request for it, regardless of the reason given, an automatic red flag.',
    categorySlug: 'account-takeover',
    alertLevel: 'high',
    sources: ['DoorDash Help Center'],
    sourceUrl: 'https://help.doordash.com/en-us/dashers/article/how-can-i-protect-my-doordash-account-information',
  },
  {
    name: 'Airbnb and Vrbo Off-Platform Payment Scam',
    slug: 'airbnb-vrbo-off-platform-payment-scam',
    description:
      'A "host" with a legitimate-looking, sometimes stolen, Airbnb or Vrbo listing moves the conversation to text or WhatsApp and offers a discount for paying directly via Zelle, Venmo, or wire transfer instead of through the platform\'s official checkout. Once the payment is sent, the scammer disappears — since the transaction happened off-app, the guest has no booking, no working contact for the host, and none of the platform\'s payment protection. The Better Business Bureau documented a real case in which a victim wired $11,348 for a booking that never existed.',
    categorySlug: 'online-shopping-scams',
    alertLevel: 'high',
    sources: ['Better Business Bureau (BBB)'],
    sourceUrl: 'https://www.bbb.org/article/scams/29117-bbb-scam-alert-how-to-spot-this-newly-common-vacation-rental-scam',
  },
  {
    name: 'Fraudulent Gig-Platform 1099 Identity Theft',
    slug: 'gig-platform-1099-identity-theft',
    description:
      'A criminal uses a stolen Social Security number to pass a background check and open a driver account on a gig platform like Uber in someone else\'s name, then drives under that stolen identity. The real SSN owner, who never worked for the platform, only discovers the fraud when an unexpected IRS notice arrives reporting 1099 income they never earned. Documented cases include a Kern County, California man saddled with a fraudulent $53,000 1099 and a Los Angeles couple who received two erroneous forms; the FTC has logged 354 complaints matching this specific pattern since 2020.',
    categorySlug: 'identity-theft',
    alertLevel: 'medium',
    sources: ['Federal Trade Commission (FTC)'],
    sourceUrl: 'https://spectrumnews1.com/ca/southern-california/public-safety/2026/02/26/uber-identity-theft',
  },
  {
    name: 'Irish Fake Tech Support Vishing Scam',
    slug: 'ireland-fake-tech-support-vishing-scam',
    description:
      'A cold caller claiming to represent a trusted brand — Eir, Microsoft, or Apple are the examples the CCPC itself cites — greets the victim by name and claims there\'s a problem with their internet speed or device, offering to run a "speed test" to prove it. The caller then talks the victim through bogus fixes, asks for card payment for unnecessary "repairs," and often requests remote access to the device, which is instead used to install malware and harvest personal and financial data.',
    categorySlug: 'tech-support-scams',
    country: 'IE',
    alertLevel: 'high',
    sources: ['Competition and Consumer Protection Commission (CCPC)'],
    sourceUrl: 'https://www.ccpc.ie/consumers/money/scams/phishing/',
  },
  {
    name: 'Irish Unregistered Charity Door-to-Door Collection',
    slug: 'ireland-unregistered-charity-collection-scam',
    description:
      'Unregistered individuals or groups conduct house-to-house collections, often for clothing banks, using leaflets claiming to benefit children in poverty, people with disabilities, or homeless and abused children, with no transparency about where the money actually goes. The Charities Regulator of Ireland received 30 public reports of this pattern in a single year and describes it as an increasing trend, noting that a legitimate charity collection must display a registered charity name, number, and contact details that can be verified against the regulator\'s public register.',
    categorySlug: 'charity-scams',
    country: 'IE',
    alertLevel: 'medium',
    sources: ['Charities Regulator of Ireland'],
    sourceUrl: 'https://www.thejournal.ie/house-donations-charity-unregistered-regulator-3771228-Dec2017/',
  },
  {
    name: 'Irish "Hi Mum/Hi Dad" WhatsApp Scam',
    slug: 'ireland-hi-mum-hi-dad-whatsapp-scam',
    description:
      'A message arrives from an unknown number claiming to be the recipient\'s son or daughter, explaining they\'ve broken or lost their phone and this is their temporary new number, before asking for money with a promise to pay it back within a day or two. Unlike a staged online romance scam, no relationship is built and no dating platform is involved — it simply exploits an existing parent-child bond over WhatsApp or SMS. An Garda Síochána and the Banking and Payments Federation of Ireland (BPFI) have both confirmed the pattern, with BPFI describing it as a scam that "has only started cropping up in Ireland recently" and urging people to think twice before sending money to a third party based on a text alone.',
    categorySlug: 'family-emergency-scams',
    country: 'IE',
    alertLevel: 'high',
    sources: ['An Garda Síochána', 'Banking and Payments Federation of Ireland (BPFI)'],
    sourceUrl: 'https://www.thejournal.ie/fraud-arrests-increase-scams-5947424-Dec2022/',
  },
  {
    name: 'Medicare Open Enrollment "Confirm Your Number" Cold Call',
    slug: 'medicare-open-enrollment-cold-call-scam',
    description:
      'During the annual Medicare Open Enrollment window each fall, a caller claiming to be from "Medicare" or an affiliated plan says the beneficiary must confirm their Medicare number, Social Security number, or bank details immediately to keep coverage active, or must switch plans right there on the phone. Caller ID is often spoofed to look legitimate. The FTC confirms real Medicare representatives never initiate contact this way — Medicare communicates by mail, not unsolicited calls, texts, or emails — and advises hanging up and calling 1-800-MEDICARE directly to verify anything.',
    categorySlug: 'healthcare-fraud',
    alertLevel: 'high',
    sources: ['Federal Trade Commission (FTC)'],
    sourceUrl: 'https://consumer.ftc.gov/consumer-alerts/2025/09/medicare-open-enrollment-season-learn-how-protect-yourself-scams',
  },
  {
    name: '"Free" Genetic Testing Medicare Fraud',
    slug: 'free-genetic-testing-medicare-fraud',
    description:
      'A "free" genetic test, DNA cancer screening, or cheek-swab kit is offered at a health fair, senior center, mall kiosk, or via telemarketing and door-to-door visits, using the free offer as a pretext to collect the target\'s Medicare number. Medicare is then billed thousands of dollars for tests that were never medically necessary and never ordered by the beneficiary\'s own treating physician — and if Medicare denies the claim, the beneficiary can end up liable for the cost themselves. HHS\'s Office of Inspector General warns to refuse any unsolicited testing kit and to insist any genetic test go through an existing doctor first.',
    categorySlug: 'healthcare-fraud',
    alertLevel: 'high',
    sources: ['HHS Office of Inspector General (OIG)'],
    sourceUrl: 'https://oig.hhs.gov/fraud/consumer-alerts/fraud-alert-genetic-testing-scam',
  },
  {
    name: 'High-Pressure Medicare Advantage Plan Switch',
    slug: 'high-pressure-medicare-advantage-plan-switch',
    description:
      'A caller posing as a licensed agent or "official Medicare agent" during open enrollment claims a beneficiary\'s current plan is being discontinued or that they\'ll lose coverage unless they switch to a different Medicare Advantage or Part D plan immediately — sometimes enrolling the beneficiary in a new plan without genuine, informed consent. State consumer protection offices note that no one can legally claim to be an "official Medicare agent," that legitimate agents must give beneficiaries time to review options, and that any high-pressure "you\'ll lose coverage" pitch during enrollment season is a red flag on its own.',
    categorySlug: 'healthcare-fraud',
    alertLevel: 'medium',
    sources: ['Michigan Attorney General Consumer Protection'],
    sourceUrl: 'https://www.michigan.gov/consumerprotection/protect-yourself/consumer-alerts/scams/medicare-open-enrollment',
  },
  {
    name: 'Fake FEMA Inspector Upfront-Fee Scam',
    slug: 'fake-fema-inspector-upfront-fee-scam',
    description:
      'After a hurricane, wildfire, flood, or tornado, someone calling, texting, or showing up in person claims to be a FEMA inspector or employee and asks for banking details, a Social Security number, or an upfront payment to "process" or "expedite" a disaster assistance application or home inspection. Real FEMA assistance and inspections are always free, and a genuine FEMA inspector already has an applicant\'s registration number on file — so any request for money or that number is a clear sign of fraud, even if the caller has a counterfeit badge or FEMA-branded clothing.',
    categorySlug: 'government-impersonation',
    alertLevel: 'critical',
    sources: ['Federal Trade Commission (FTC)'],
    sourceUrl: 'https://www.consumer.ftc.gov/consumer-alerts/2025/07/spot-avoid-fema-impersonators',
  },
  {
    name: 'Fake FEMA Grant Text Phishing',
    slug: 'fake-fema-grant-text-phishing',
    description:
      'An unsolicited text or email claims the recipient is "eligible" for a FEMA disaster relief grant or payment and links to a spoofed FEMA-branded page designed to harvest Social Security numbers, bank account details, or payment information. FEMA only contacts people who have already applied for or inquired about assistance — an unsolicited message reaching someone who never applied is, by itself, proof the message isn\'t really from FEMA.',
    categorySlug: 'government-impersonation',
    alertLevel: 'high',
    sources: ['Federal Trade Commission (FTC)'],
    sourceUrl: 'https://www.consumer.ftc.gov/consumer-alerts/2025/07/spot-avoid-fema-impersonators',
  },
  {
    name: 'Fake "FEMA-Certified" Disaster Recovery Contractor',
    slug: 'fake-fema-certified-disaster-contractor-scam',
    description:
      'An out-of-town contractor who arrives quickly after a storm, fire, or flood claims to be "FEMA-approved" or "FEMA-certified" to seem trustworthy, collects a large upfront payment or full payment before starting repair work, then either disappears or does substandard work with no way to hold them accountable. FEMA states plainly that it does not license, certify, or endorse any contractor — so the claim itself, on its own, is enough to prove someone is lying, and legitimate contractors don\'t need to invoke FEMA\'s name to prove they\'re real.',
    categorySlug: 'government-impersonation',
    alertLevel: 'high',
    sources: ['Federal Emergency Management Agency (FEMA)'],
    sourceUrl: 'https://www.consumer.ftc.gov/consumer-alerts/2025/07/spot-avoid-fema-impersonators',
  },
  {
    name: 'New Zealand "Mum, I Dropped My Phone" SMS Scam',
    slug: 'new-zealand-dropped-phone-sms-scam',
    description:
      'A text or WhatsApp message claims to be from the recipient\'s adult child, explaining their phone was damaged and this is a temporary new number to reach them on. Once the "parent" responds, the scammer stays in character and asks for bank account or credit card details to help pay for a replacement phone. New Zealand\'s National Cyber Security Centre warns this exploits an existing family relationship rather than building a fake one, and advises never sharing financial details by text — verify by contacting the family member on their known number instead.',
    categorySlug: 'family-emergency-scams',
    country: 'NZ',
    alertLevel: 'high',
    sources: ['National Cyber Security Centre (NCSC NZ)'],
    sourceUrl: 'https://www.ncsc.govt.nz/alerts/mum-i-dropped-my-phone-sms-scam-targeting-new-zealanders/',
  },
  {
    name: 'New Zealand AI Deepfake Celebrity Investment Scam',
    slug: 'new-zealand-deepfake-celebrity-investment-scam',
    description:
      'A Facebook or Instagram ad uses AI-generated deepfake video of a well-known New Zealand public figure — including, in one documented case, Prime Minister Christopher Luxon — appearing to personally endorse a cryptocurrency investment platform. Victims who respond are moved to WhatsApp or Signal and coached by a fake "investment adviser" into an initial small deposit, then larger transfers, often after installing remote-access software that hands control of their accounts to the scammer. In one confirmed case, a 72-year-old Taranaki pensioner lost NZ$224,000 this way in 2024, and the scammers were later caught on a secret recording attempting to extort even more money from her afterward.',
    categorySlug: 'ai-deepfake-scams',
    country: 'NZ',
    alertLevel: 'critical',
    sources: ['NZ Herald'],
    sourceUrl: 'https://www.nzherald.co.nz/nz/pensioner-loses-224k-after-being-tricked-by-ai-deepfake-christopher-luxon-cryptocurrency-investment-scam/YLG3EQMOAZATVARBL5ITDRL2DA/',
  },
  {
    name: 'Fake Lotto NZ "You\'ve Been Selected" Text',
    slug: 'new-zealand-fake-lotto-selected-text',
    description:
      'A text message impersonating Lotto NZ tells the recipient they\'ve been "selected" to win, rather than that they entered and won a specific draw, and links to a page that harvests card and personal details to "claim" the prize. Genuine Lotto NZ messages only ever come through the short-code 3361 used for text-to-play subscribers, so a "win" notification from any other number is fraudulent by definition — the same underlying script scammers have previously dressed up as supermarket and courier-delivery texts, now trading on Lotto NZ\'s brand trust instead.',
    categorySlug: 'lottery-sweepstakes-scams',
    country: 'NZ',
    alertLevel: 'medium',
    sources: ['Netsafe'],
    sourceUrl: 'https://www.nzherald.co.nz/nz/scammer-posing-as-lotto-nz-targets-kiwis-with-fake-text-messages/TQ5WCB5WC65Z2FQ35G4K6XPKOU/',
  },
  {
    name: 'Fake Unclaimed Property Lookup Site',
    slug: 'fake-unclaimed-property-lookup-site',
    description:
      'A website mimics missingmoney.com or a state treasurer\'s official unclaimed property search tool and charges a fee to "search," "verify," or "process" a claim that is entirely free through the real, government-run system. State treasury offices confirm they will never request payment, a credit card, or banking information to search for or release unclaimed funds, and warn consumers to use only the official free search tools rather than a look-alike site found through an ad or search result.',
    categorySlug: 'government-impersonation',
    alertLevel: 'medium',
    sources: ['Kentucky State Treasury'],
    sourceUrl: 'https://treasury.ky.gov/unclaimedproperty/Pages/scam.aspx',
  },
  {
    name: 'Unclaimed Funds Upfront Fee Scam',
    slug: 'unclaimed-funds-upfront-fee-scam',
    description:
      'An unsolicited call, text, or letter — sometimes printed on fake NAUPA letterhead — claims a specific amount of money is waiting for the recipient, then demands a "processing fee," "release tax," or personal and banking information before the funds can be sent, often with pressure that a deadline is about to expire. The FTC states plainly that real unclaimed-property programs never initiate contact this way and never charge a fee or require banking details to release money that\'s legitimately owed to someone.',
    categorySlug: 'government-impersonation',
    alertLevel: 'high',
    sources: ['Federal Trade Commission (FTC)'],
    sourceUrl: 'https://consumer.ftc.gov/consumer-alerts/2026/03/how-handle-unexpected-calls-about-unclaimed-funds',
  },
  {
    name: 'Unlicensed Unclaimed Property "Heir Locator" Overcharging',
    slug: 'unclaimed-property-heir-locator-overcharging',
    description:
      'A third-party "finder" or "heir locator" firm contacts someone about unclaimed property they could search for and claim themselves at no cost, then charges a large percentage-based fee to file the claim on their behalf — sometimes above what state law actually allows. California law, for example, caps this kind of finder fee at 10% of the property\'s value for agreements made after the official unclaimed-property notice is published, and voids fee agreements signed after a claim has already been filed; most other states set similar statutory caps, making an above-cap fee a clear legal violation rather than just an aggressive sales tactic.',
    categorySlug: 'government-impersonation',
    alertLevel: 'low',
    sources: ['California State Controller\'s Office'],
    sourceUrl: 'https://www.sco.ca.gov/upd_investigator_about.html',
  },
  {
    name: '"my Social Security" Account Takeover and Payment Redirect',
    slug: 'myssa-account-takeover-payment-redirect',
    description:
      'A criminal uses a victim\'s stolen personal information — name, Social Security number, and date of birth — to open or take over their "my Social Security" online account, then silently changes the direct-deposit bank details so the victim\'s monthly benefit payment is rerouted to an account the criminal controls. There\'s no phone call or warning sign at all; victims typically only discover it when an expected payment simply doesn\'t arrive. SSA\'s Office of Inspector General has documented more than $33 million redirected from over 20,000 beneficiaries this way between 2013 and 2018 alone.',
    categorySlug: 'account-takeover',
    alertLevel: 'high',
    sources: ['Social Security Administration Office of Inspector General (SSA OIG)'],
    sourceUrl: 'https://oig.ssa.gov/news-releases/2013-05-03-newsroom-news-releases-may3advisory/',
  },
  {
    name: 'Fake "Claim Your Benefits" SSA Application Phishing Email',
    slug: 'fake-claim-ssa-benefits-application-phishing',
    description:
      'An email impersonating the Social Security Administration, sent from a non-government address under a sender name like "Social Administration," urges someone who hasn\'t yet filed for retirement benefits to click a link and "apply now" before missing out. The link mimics ssa.gov but actually leads to a fraudulent page built to harvest personal information — a tactic aimed specifically at people who are close to retirement age but haven\'t started their claim yet, since they\'re the ones most likely to believe a "you need to act now" message about benefits they haven\'t received before.',
    categorySlug: 'phishing',
    alertLevel: 'medium',
    sources: ['Social Security Administration Office of Inspector General (SSA OIG)'],
    sourceUrl: 'https://oig.ssa.gov/assets/uploads/scam-alert-2025-claim-benefits.pdf',
  },
  {
    name: 'French Fake Tech Support Scam (Faux Support Technique)',
    slug: 'france-fake-tech-support-scam',
    description:
      'A frightening pop-up or fake antivirus alert claims a computer is infected and displays a phone number to call for urgent repair. Victims who call are pressured into paying for fictitious remote "repairs" or ongoing subscriptions, and in some cases the remote access granted during the call is used to reach into online banking. France\'s Cybermalveillance.gouv.fr, Microsoft, and the Paris prosecutor\'s cybercrime unit jointly flagged this as one of the most common cyberthreats facing individuals in France, with the Paris unit alone logging 585 complaints and €374,000 in declared losses in 2023.',
    categorySlug: 'tech-support-scams',
    country: 'FR',
    alertLevel: 'high',
    sources: ['Cybermalveillance.gouv.fr', 'Parquet de Paris'],
    sourceUrl: 'https://www.cybermalveillance.gouv.fr/tous-nos-contenus/fiches-reflexes/arnaques-au-faux-support-technique',
  },
  {
    name: 'Fake EDF Utility Agent Home Visit Scam',
    slug: 'france-fake-edf-utility-agent-scam',
    description:
      'Someone shows up at a home claiming to be a technician from EDF, France\'s main electricity provider, asking to come inside to "verify the electrical installation." No legitimate ID is shown, and the real purpose is theft during the visit or scoping the home for a future burglary — targets are typically elderly or isolated people, and visits are often timed around lunchtime when neighbors are less likely to notice. French authorities advise always demanding to see a professional ID card and calling the gendarmerie directly if there\'s any doubt before letting anyone in.',
    categorySlug: 'utility-scams',
    country: 'FR',
    alertLevel: 'high',
    sources: ['Gendarmerie nationale', 'Préfecture de la Moselle'],
    sourceUrl: 'https://www.moselle.gouv.fr/Actualites/Securite/Protection-publique-et-securite-civile/Arnaques-aux-faux-agents',
  },
  {
    name: 'French Fake Grandchild Emergency Call (Arnaque au Faux Petit-Fils)',
    slug: 'france-fake-grandchild-emergency-scam',
    description:
      'A caller opens with something like "Coucou mamie, tu me reconnais?" and claims to be the victim\'s grandchild, suddenly in trouble — a car accident, an arrest — and begs for urgent money while insisting no one else be told. Unlike a slow-building online romance scam, this plays out entirely over a single phone call aimed at elderly, often isolated victims, sometimes with a courier sent to collect cash in person. In one confirmed February 2025 case, an 89-year-old woman in Montpellier handed over €1,000 before her son-in-law intervened and had the collector apprehended; more recent reporting has flagged an AI voice-cloning variant of the same scam beginning to appear.',
    categorySlug: 'family-emergency-scams',
    country: 'FR',
    alertLevel: 'critical',
    sources: ['CNEWS'],
    sourceUrl: 'https://www.cnews.fr/france/2025-02-25/arnaque-au-petit-fils-attention-cette-escroquerie-de-plus-en-plus-repandue',
  },
  {
    name: 'Government Impersonation Crypto ATM Scam',
    slug: 'government-impersonation-crypto-atm-scam',
    description:
      'Someone posing as a government agency, law enforcement, utility company, or tech support creates urgency — claiming fraud on an account, unpaid taxes, or an imminent service disconnection — and directs the victim to withdraw cash, travel to a specific Bitcoin ATM, and scan a QR code the caller supplies. The moment the cash is deposited and converted, it moves directly into a wallet the scammer controls and is effectively unrecoverable. The FTC found this exact impersonation combination behind roughly 86% of reported Bitcoin ATM fraud losses in the first half of 2024 alone, totaling more than $65 million with a median loss of $10,000, and separately found adults 60 and older were more than three times as likely as younger adults to report this type of loss, accounting for roughly 71% of it.',
    categorySlug: 'government-impersonation',
    alertLevel: 'critical',
    sources: ['Federal Trade Commission (FTC)'],
    sourceUrl: 'https://www.ftc.gov/news-events/data-visualizations/data-spotlight/2024/09/bitcoin-atms-payment-portal-scammers',
  },
  {
    name: 'Romance Scam Crypto ATM Cash Conversion',
    slug: 'romance-scam-crypto-atm-cash-conversion',
    description:
      'After building a fake online relationship, a romance scammer instructs the victim to withdraw a large sum of cash and deposit it at a specific crypto ATM rather than sending it through a bank wire or exchange. The FBI has flagged this specific step as its own scheme, not just a detail of the broader romance scam: unlike a bank transfer, which typically takes a day or two to settle and can sometimes be recalled, a crypto ATM deposit makes the scammer the instant owner of the funds, which are frequently moved overseas immediately, making recovery extremely difficult once the deposit is made.',
    categorySlug: 'romance-scams',
    alertLevel: 'critical',
    sources: ['FBI Internet Crime Complaint Center (IC3)'],
    sourceUrl: 'https://www.ic3.gov/PSA/2021/PSA211104',
  },
  {
    name: 'Fake Airline Customer Service Number Scam',
    slug: 'fake-airline-customer-service-number-scam',
    description:
      'A fake airline "customer service" phone number, promoted through paid search ads or manipulated search rankings, appears alongside or above a real airline\'s actual number when someone searches for help with a flight. The person who answers claims to be airline support and either charges a bogus fee to process a rebooking or refund, or talks the caller into installing remote-access software or handing over payment card details. The FTC and BBB have jointly warned travelers to get airline contact numbers directly from the airline\'s own app or website rather than trusting whatever ranks first in a search.',
    categorySlug: 'government-impersonation',
    alertLevel: 'high',
    sources: ['Federal Trade Commission (FTC)', 'Better Business Bureau (BBB)'],
    sourceUrl: 'https://consumer.ftc.gov/consumer-alerts/2024/07/scammers-impersonate-airline-customer-service-representatives',
  },
  {
    name: 'Fake Airline Social Media "Angler Phishing" Scam',
    slug: 'fake-airline-social-media-angler-phishing',
    description:
      'A traveler who publicly complains on social media about a delayed or cancelled flight gets a reply from an account posing as the airline\'s official support team, offering to help. The fake account asks for a booking confirmation number, phone number, or bank details directly in the conversation, or links to a spoofed airline website built to harvest that information, which is then used for identity theft or unauthorized charges. The FTC specifically warns this tactic — sometimes called "angler phishing" — works because it reaches people at the exact moment they\'re frustrated and looking for a fast response from someone official-looking.',
    categorySlug: 'phishing',
    alertLevel: 'high',
    sources: ['Federal Trade Commission (FTC)'],
    sourceUrl: 'https://consumer.ftc.gov/consumer-alerts/2024/07/scammers-impersonate-airline-customer-service-representatives',
  },
  {
    name: 'Fake Vacation Rental and Package Deal Scam',
    slug: 'fake-vacation-rental-package-deal-scam',
    description:
      'An unrealistically cheap vacation rental or travel package listing, often for a popular destination, either doesn\'t exist at all or turns out to be nothing like the photos and description once payment goes through. The Better Business Bureau\'s vacation-fraud research describes scammers who "make up deals wholesale, hoping to get the consumer to pay up before they disappear," including one documented case where a consumer paid $3,200 for a promised Seychelles yacht trip that bore no resemblance to what was actually delivered.',
    categorySlug: 'online-shopping-scams',
    alertLevel: 'medium',
    sources: ['Better Business Bureau (BBB)'],
    sourceUrl: 'https://www.bbb.org/all/scamstudies/vacation-study1/vacation-full-study',
  },
  {
    name: 'UK Martin Lewis Deepfake Investment Scam Ads',
    slug: 'uk-martin-lewis-deepfake-investment-scam',
    description:
      'A Facebook or Instagram ad uses AI-generated deepfake video of Martin Lewis, the founder of MoneySavingExpert, appearing to personally endorse a crypto or trading platform such as "Quantum AI." Lewis has publicly said he felt "sick" seeing the fake footage and has stressed he has never appeared in a third-party ad to endorse any product — documented victims include one man who lost £140,000 and another who lost £75,000, and several are now part of a group legal claim against Meta over the fraudulent advertising.',
    categorySlug: 'ai-deepfake-scams',
    country: 'GB',
    alertLevel: 'critical',
    sources: ['BBC'],
    sourceUrl: 'https://www.bbc.co.uk/news/uk-66130785',
  },
  {
    name: 'UK Romance Fraud',
    slug: 'uk-romance-fraud',
    description:
      'A relationship built over weeks or months on a dating app or social media leads to a fabricated crisis that only the victim\'s money can resolve. City of London Police reported more than 10,700 romance fraud cases in 2025, a 29% jump from the year before, with victims losing over £102 million — an average of £9,500 each, and in some cases as much as £1 million. People aged 55 to 74 accounted for nearly half of all money lost, and police have specifically warned that offenders increasingly use AI-generated images and messages to build more convincing fake profiles.',
    categorySlug: 'romance-scams',
    country: 'GB',
    alertLevel: 'critical',
    sources: ['City of London Police'],
    sourceUrl: 'https://www.cityoflondon.police.uk/news/city-of-london/news/2025/june/a-wrong-turn-on-love-lane-city-of-london-police-take-over-city-streets-to-warn-of-the-dangers-of-romance-fraud-with-more-than-106-million-lost-in-the-last-year/',
  },
  {
    name: 'UK Fake Tech Support Pop-Up Scam',
    slug: 'uk-fake-tech-support-popup-scam',
    description:
      'A pop-up impersonating Microsoft or Windows claims a computer is infected and displays a number to call for support, or a cold caller claims to be from Microsoft or BT reporting the same problem. The "technician" talks the victim into installing remote-access software, then either charges for bogus repairs or uses that access to reach directly into online banking. Action Fraud has separately warned that some scammers have gone a step further and impersonate Action Fraud itself in automated calls, specifically to gain the same kind of remote computer access.',
    categorySlug: 'tech-support-scams',
    country: 'GB',
    alertLevel: 'high',
    sources: ['Action Fraud'],
    sourceUrl: 'https://www.actionfraud.police.uk/cssfraud',
  },
  {
    name: 'Soundalike Fake Veterans Charity',
    slug: 'soundalike-fake-veterans-charity',
    description:
      'A registered nonprofit uses a name deliberately similar to a well-known, legitimate veterans organization, then solicits donations by phone, mail, or robocall while spending almost none of the money on actual veterans. In the FTC\'s 2018 "Operation Donate with Honor" sweep across all 50 states, one such operation — soliciting under names like American Disabled Veterans Foundation and Military Families of America — spent roughly 95% of every dollar raised on fundraising costs, administrative expenses, and its founder\'s own salary, resulting in a $20.4 million judgment.',
    categorySlug: 'charity-scams',
    alertLevel: 'medium',
    sources: ['Federal Trade Commission (FTC)'],
    sourceUrl: 'https://www.ftc.gov/news-events/news/press-releases/2018/07/ftc-states-combat-fraudulent-charities-falsely-claim-help-veterans-servicemembers',
  },
  {
    name: 'Fictitious Veteran Persona Fundraising Scam',
    slug: 'fictitious-veteran-persona-fundraising-scam',
    description:
      'Someone forms a charity front with a sympathetic, veteran-focused name and personally solicits donations under a fabricated military alias, rather than simply mimicking an existing charity\'s name. In a Southern District of Indiana case, two men formed "Wounded Warrior Fund, Inc." and "Wounded Warrior Foundation, Inc." and solicited donations across three states while posing under aliases like "Sergeant Bob Johnson" — none of the roughly $125,000 collected went to any veterans program, and four defendants were ultimately convicted and sentenced to federal prison.',
    categorySlug: 'charity-scams',
    alertLevel: 'medium',
    sources: ['U.S. Department of Justice'],
    sourceUrl: 'https://www.justice.gov/usao-sdin/pr/four-defendants-face-fraud-charges-bogus-fundraising-efforts-wounded-military-veterans',
  },
  {
    name: 'Unaccredited VA Disability Claims Fee Scheme',
    slug: 'unaccredited-va-disability-claims-fee-scheme',
    description:
      'An unaccredited individual or company charges a veteran a fee to help file an initial VA disability claim, often through aggressive marketing or a "Disability Benefits Questionnaire" package promising a higher rating — despite the fact that it\'s illegal to charge for that assistance. By law, no one may charge a fee for help filing an initial VA disability claim; VA-accredited representatives can only charge after a decision has already been issued, under VA fee-agreement rules, making an upfront charge for initial help a legal violation on its own.',
    categorySlug: 'public-benefits-fraud',
    alertLevel: 'medium',
    sources: ['VA Office of Inspector General (VA OIG)'],
    sourceUrl: 'https://www.vaoig.gov/fraud-alert-disability-benefits-questionnaire-fraud-schemes',
  },
  {
    name: 'Fake Process Server Phantom Debt Call',
    slug: 'fake-process-server-phantom-debt-call',
    description:
      'A caller identifying as a private process server, not police or a court, claims a lawsuit has already been filed or is about to be filed over a debt, and threatens arrest, wage garnishment, or property seizure unless paid immediately by card. To add pressure, these operations often also call the target\'s relatives, friends, and coworkers about the supposed debt — the FTC has sued debt collectors specifically for this combination of impersonating process servers and contacting third parties to coerce payment.',
    categorySlug: 'debt-relief-scams',
    alertLevel: 'high',
    sources: ['Federal Trade Commission (FTC)'],
    sourceUrl: 'https://www.ftc.gov/business-guidance/blog/2016/01/disguise-limit-ftc-sues-debt-collectors-who-claimed-official-affiliation',
  },
  {
    name: 'Fake Law Firm Debt Lawsuit Settlement Scam',
    slug: 'fake-law-firm-debt-lawsuit-settlement-scam',
    description:
      'A caller or letter claims to represent a law firm — sometimes borrowing the actual name of a real, unaffiliated firm — pursuing a lawsuit over an old or entirely fabricated debt, and pressures the target to pay immediately to "settle before court" or avoid a default judgment. In one 2025 FTC enforcement action, an operation calling itself "Blackstone Legal" used the names of unaffiliated real businesses and law firms, falsely told consumers they were about to be sued, and included the last four digits of the target\'s real Social Security number in its letters to appear legitimate.',
    categorySlug: 'debt-relief-scams',
    alertLevel: 'high',
    sources: ['Federal Trade Commission (FTC)'],
    sourceUrl: 'https://www.ftc.gov/news-events/news/press-releases/2025/03/ftc-action-leads-court-order-halting-phantom-debt-collection-scheme-took-millions-consumers',
  },
  {
    name: 'Fake Court Subpoena Phishing Email',
    slug: 'fake-court-subpoena-phishing-email',
    description:
      'An email is designed to look like an official federal court subpoena, complete with a realistic court seal and docket number, instructing the recipient to click a link to "respond" or view the document. The link doesn\'t lead anywhere near a real court — it installs malware or a keylogger instead. A federal district court has issued a direct public warning about exactly this scheme, stating plainly that federal courts will never use a phone call or email to request personal or financial information.',
    categorySlug: 'phishing',
    alertLevel: 'high',
    sources: ['U.S. District Court, N.D. Indiana'],
    sourceUrl: 'https://www.innd.uscourts.gov/news/subpoena-scam-emails-district-court',
  },
  {
    name: 'Canadian Tech Support Scam',
    slug: 'canadian-tech-support-scam',
    description:
      'An unsolicited pop-up or cold call impersonating Microsoft or another major tech company claims a device is infected and displays a number to call. The "technician" who answers talks the victim into granting remote access to "run diagnostics," then either charges for unnecessary repair services or antivirus software, or uses that access to steal financial information directly — payment is typically demanded through gift cards or a money transfer.',
    categorySlug: 'tech-support-scams',
    country: 'CA',
    alertLevel: 'high',
    sources: ['Canadian Anti-Fraud Centre (CAFC)'],
    sourceUrl: 'https://fcnb.ca/en/news-alerts/cafc-bulletin-tech-support-scam',
  },
  {
    name: 'Canadian Overpayment Cheque Employment Scam',
    slug: 'canadian-overpayment-cheque-employment-scam',
    description:
      'A fake "employer" hires someone, often for a remote or work-from-home role, then sends a cheque or Interac e-Transfer for more than the agreed pay — supposedly to cover equipment or expenses — and asks the new hire to send the difference back to a third party. The original payment later bounces, leaving the victim on the hook to their own bank for the full amount they already forwarded. The Canadian Anti-Fraud Centre reports losses in this category have quadrupled since 2022, from roughly $7 million to more than $49 million in 2024 across over 2,300 victims.',
    categorySlug: 'employment-scams',
    country: 'CA',
    alertLevel: 'high',
    sources: ['Canadian Anti-Fraud Centre (CAFC)'],
    sourceUrl: 'https://competition-bureau.canada.ca/en/fraud-and-scams/tips-and-advice/job-and-employment-scams',
  },
  {
    name: 'Canadian AI Deepfake Investment Scam',
    slug: 'canadian-ai-deepfake-investment-scam',
    description:
      'A social media ad uses AI-generated deepfake video or audio of a well-known Canadian public figure — confirmed cases include Prime Minister Mark Carney and a fabricated CBC News segment that never actually aired — falsely appearing to endorse a cryptocurrency or investment platform. In one documented case, a senior in Sault Ste. Marie lost nearly $1 million after a deepfake video of Carney urging a small initial crypto "investment" led her into an escalating scheme; a retiree in Prince Albert, Saskatchewan separately lost $3,000 to the same deepfake pattern.',
    categorySlug: 'ai-deepfake-scams',
    country: 'CA',
    alertLevel: 'critical',
    sources: ['Canadian Anti-Fraud Centre (CAFC)'],
    sourceUrl: 'https://antifraudcentre-centreantifraude.ca/features-vedette/2024/07/bulletin-deepfakes-hypertrucage-eng.htm',
  },
  {
    name: 'FAFSA Processing Fee Scam',
    slug: 'fafsa-processing-fee-scam',
    description:
      'A company advertises help getting a student "more financial aid" or guarantees FAFSA processing for a fee, often billed as a "processing," "redemption," or "disbursement" charge. The FAFSA itself is always free to file directly at studentaid.gov, so the company isn\'t doing anything a student couldn\'t do themselves for nothing — and in some cases, victims are asked to hand over their FSA ID and password to a third party, which violates federal policy and can expose the student to penalties if false information ends up on the form. The FTC states it plainly: "Never pay anyone to fill out or process your FAFSA. That\'s probably a scam."',
    categorySlug: 'debt-relief-scams',
    alertLevel: 'medium',
    sources: ['Federal Trade Commission (FTC)'],
    sourceUrl: 'https://consumer.ftc.gov/articles/how-avoid-scholarship-and-financial-aid-scams',
  },
  {
    name: 'FSA Portal Refund-Redirect Phishing',
    slug: 'fsa-portal-refund-redirect-phishing',
    description:
      'A phishing email impersonating a student\'s school portal harvests login credentials for their financial-aid account, then the attacker logs in and changes the direct-deposit destination so the student\'s federal aid refund is quietly rerouted to the attacker\'s own bank account instead. The Department of Education\'s Federal Student Aid office has issued a direct warning about this exact campaign, and federal regulators have separately flagged financial-aid account takeover as an active fraud pattern tied to student aid disbursement season.',
    categorySlug: 'account-takeover',
    alertLevel: 'high',
    sources: ['U.S. Department of Education, Federal Student Aid'],
    sourceUrl: 'https://fsapartners.ed.gov/knowledge-center/library/electronic-announcements/2018-08-31/active-phishing-campaign-targeting-student-email-accounts',
  },
  {
    name: 'Ghost Student FAFSA Identity Fraud',
    slug: 'ghost-student-fafsa-identity-fraud',
    description:
      'A fraud ring uses stolen identities, or pays recruited "straw students" to lend their own, to enroll at colleges — sometimes solely to trigger financial aid disbursements rather than to actually attend classes — then diverts the aid money for itself, leaving the real people whose identities were used with damaged credit and a fraudulent enrollment record to untangle. In one federal case out of Michigan, prosecutors charged two people separately over roughly $16 million and $3 million in fraudulently claimed federal student aid, one scheme alone using more than 1,200 "straw student" identities.',
    categorySlug: 'identity-theft',
    alertLevel: 'medium',
    sources: ['U.S. Department of Justice'],
    sourceUrl: 'https://www.justice.gov/usao-edmi/pr/two-detroiters-charged-stealing-over-12-million-separate-federal-student-aid-fraud-0',
  },
  {
    name: 'Student Money-Mule Recruitment Scam',
    slug: 'student-money-mule-recruitment-scam',
    description:
      'A fake "personal assistant" or easy remote-job listing, sometimes an email impersonating a professor or college office, targets college students specifically. Once a student accepts, the scammer mails a fraudulent check and instructs them to deposit it and wire part of the money elsewhere for a fabricated reason, like buying equipment or paying a vendor. The check later bounces, leaving the student owing their own bank the full amount they already wired out — and without realizing it, they\'ve just moved stolen money for a criminal. The FTC\'s own warning is direct: "If they tell you to deposit a check and use some of the money for any reason, that\'s a scam."',
    categorySlug: 'employment-scams',
    alertLevel: 'high',
    sources: ['Federal Trade Commission (FTC)'],
    sourceUrl: 'https://consumer.ftc.gov/consumer-alerts/2024/04/college-students-are-targeted-jobs-scams-too-0',
  },
  {
    name: 'Fake Online Textbook Storefront Scam',
    slug: 'fake-online-textbook-storefront-scam',
    description:
      'A bargain textbook website takes payment from college students at checkout and never ships anything, becoming unreachable afterward — no working phone number, no functioning contact form. The Better Business Bureau documented one such case, "Booktiz," which listed a New York City street address that turned out to belong to a completely unrelated business, while the site\'s actual domain registration traced to Panama — a storefront built entirely to look real just long enough to collect payment from students shopping for cheap textbooks at the start of a semester.',
    categorySlug: 'online-shopping-scams',
    alertLevel: 'medium',
    sources: ['Better Business Bureau (BBB)'],
    sourceUrl: 'https://www.bbb.org/us/ny/new-york/profile/online-retailer/booktiz-0121-182416',
  },
  {
    name: 'Singapore Fake Tech Support Scam',
    slug: 'singapore-fake-tech-support-scam',
    description:
      'A browser pop-up falsely claims a device is infected, impersonating Microsoft and displaying a phone number to call. Victims who call are transferred to a scammer posing as a police officer who accuses them of money laundering, then pressures them into bank transfers, handing over login credentials, or granting remote access to their device. The Singapore Police Force and Cyber Security Agency issued a joint advisory after at least 10 reported cases since February 2026 resulted in losses topping S$1.7 million.',
    categorySlug: 'tech-support-scams',
    country: 'SG',
    alertLevel: 'critical',
    sources: ['Singapore Police Force', 'Cyber Security Agency of Singapore (CSA)'],
    sourceUrl: 'https://www.police.gov.sg/Media-Hub/News/2026/06/20260609_joint_advisory_on_technical_support_scams_involving_the_impersonation_of_microsoft',
  },
  {
    name: 'Singapore SP Group Utility Phishing Scam',
    slug: 'singapore-sp-group-utility-phishing-scam',
    description:
      'An email or text message impersonating SP Group, Singapore\'s main electricity and gas provider, claims an outstanding or overcharged bill and pushes urgency — often a warning that a payment link will expire soon. The link leads to a fake SP Group site that harvests personal and card details, which are then used for unauthorized transactions, sometimes in a foreign currency. The Singapore Police Force reported at least 7 cases of this exact pattern since October 2024, with losses of at least S$12,000.',
    categorySlug: 'utility-scams',
    country: 'SG',
    alertLevel: 'high',
    sources: ['Singapore Police Force'],
    sourceUrl: 'https://www.police.gov.sg/media-hub/news/2024/20241107_police_advisory_on_phishing_scams_involving_the_impersonation_of_sp_group',
  },
  {
    name: 'Singapore AI Deepfake Government Impersonation Investment Scam',
    slug: 'singapore-ai-deepfake-government-impersonation-scam',
    description:
      'Scammers use AI-fabricated video of senior Singapore government officials — including a fake Zoom "video conference" featuring deepfaked appearances of the President, Prime Minister, and Monetary Authority of Singapore officials — to build trust before a fake "lawyer" solicits a large fund transfer, one confirmed case costing a victim S$4.9 million. An earlier, separate wave of deepfake videos of the Prime Minister and Deputy Prime Minister circulated on Facebook promoting bogus crypto investment schemes with "guaranteed returns," prompting both leaders to publicly warn the videos were fake.',
    categorySlug: 'ai-deepfake-scams',
    country: 'SG',
    alertLevel: 'critical',
    sources: ['Singapore Police Force'],
    sourceUrl: 'https://www.police.gov.sg/media-hub/news/2026/05/20260516_footage_from_zoom_video_conference_involving_impersonation_of_senior_government_officials',
  },
  {
    name: 'AI Voice-Cloned Virtual Kidnapping Ransom Call',
    slug: 'ai-voice-cloned-virtual-kidnapping-call',
    description:
      'Scammers clone a family member\'s voice from a short public sample — a social media video, a voicemail greeting — then stage a live, real-time "kidnapping" call: the cloned voice sobs and pleads for help before a second scammer takes over, threatens violence, and demands cash ransom, often starting near $1 million before "negotiating" down to a smaller amount while pressuring the victim to stay on the line and not hang up to verify. In one documented case, a Scottsdale, Arizona mother received a call with a cloned voice of her 15-year-old daughter crying "these bad men have me," with a demand negotiated down to $50,000 cash — while her daughter was safely skiing, unaware anything had happened. Unlike a single recorded plea, this is a live, two-voice hostage negotiation designed to keep victims too panicked to check.',
    categorySlug: 'family-emergency-scams',
    alertLevel: 'critical',
    sources: ['U.S. Senate Judiciary Committee'],
    sourceUrl: 'https://www.judiciary.senate.gov/imo/media/doc/2023-06-13%20PM%20-%20Testimony%20-%20DeStefano.pdf',
  },
  {
    name: 'Fake Delivery-Platform Support Impersonation',
    slug: 'fake-delivery-platform-support-impersonation',
    description:
      'Scammers pose as "support" for food-delivery platforms like Uber Eats, DoorDash, or Grubhub and contact active drivers or restaurant partners with one of two pretexts: offering a free tablet or printer to handle orders, then asking for "verification" details to ship it, or claiming there\'s a problem with an order and asking for bank account access or an emailed/texted verification code to process a "refund." Handing over that code lets scammers take over the victim\'s account and drain their earnings directly. The FTC warns this targets both drivers and the restaurants themselves, using fake hardware-shipment and fake-refund pretexts rather than a direct password request.',
    categorySlug: 'employment-scams',
    alertLevel: 'high',
    sources: ['Federal Trade Commission (FTC)'],
    sourceUrl: 'https://consumer.ftc.gov/consumer-alerts/2023/07/scammers-impersonate-delivery-service-support-rip-drivers-restaurants',
  },
  {
    name: 'Fictitious Law Firm Crypto "Fund Recovery" Scam',
    slug: 'fictitious-law-firm-crypto-fund-recovery-scam',
    description:
      'After a crypto-investment scam victim is identified — often pulled from a prior scam\'s own victim list — a second wave of scammers poses as a law firm, using real-looking letterhead, fabricated affiliations with the FBI or CFPB, or citing an invented regulator name, and even referencing the exact dates and amounts of the victim\'s prior wire transfers to appear legitimate. Victims are moved into WhatsApp groups with fake attorneys and "foreign bank processors," then charged upfront "bank verification fees" or told to route money through third-party "trading companies" for secrecy — resulting in a second round of losses on top of the original scam. The FBI warns this differs from typical recovery scams by combining law-firm and government impersonation with staged WhatsApp groups specifically targeting people already known to have lost crypto.',
    categorySlug: 'investment-fraud',
    alertLevel: 'high',
    sources: ['FBI Internet Crime Complaint Center (IC3)'],
    sourceUrl: 'https://www.ic3.gov/PSA/2025/PSA250813',
  },
  {
    name: 'Michigan UIA "Pay a Fee to Unlock Your Benefits" Phone Scam',
    slug: 'michigan-uia-pay-fee-unlock-benefits-scam',
    description:
      'Scammers cold-call Michigan residents using spoofed local numbers, claiming to work for the Unemployment Insurance Agency (UIA) — in one case, giving a fake employee number and title — and tell the victim they\'re owed a specific sum in unpaid benefits, such as $4,000, that will only be released after a one-time fee, such as $105, is paid. Michigan\'s Department of Labor and Economic Opportunity confirms the UIA never charges any fee to apply for or release approved benefits; the U.S. Department of Labor separately flagged an AI-generated version of the same call script targeting North Dakota residents.',
    categorySlug: 'public-benefits-fraud',
    alertLevel: 'high',
    sources: ['Michigan Department of Labor and Economic Opportunity (LEO)'],
    sourceUrl: 'https://www.michigan.gov/leo/news/2026/08/20/uia-warns-of-phone-scam-promising-unpaid-benefits-for-a-fee',
  },
  {
    name: 'PG&E "Barcode/QR Code" Utility Shutoff Scam',
    slug: 'pge-barcode-qr-code-shutoff-scam',
    description:
      'Scammers call Pacific Gas & Electric customers threatening imminent service disconnection over an unpaid bill, then follow up by text or email with a barcode or QR code and instructions to take it to a nearby store or pharmacy so a cashier can process the "payment" — a newer twist on the classic gift-card disconnection threat, designed to be just as untraceable. PG&E confirms it will never request payment by barcode, QR code, or prepaid debit card, and reported customers lost over $211,000 to impersonation scams in just the first half of 2026, already outpacing all of 2025\'s $301,000 in reported losses.',
    categorySlug: 'utility-scams',
    alertLevel: 'high',
    sources: ['Pacific Gas and Electric Company (PG&E)'],
    sourceUrl: 'https://investor.pgecorp.com/news-events/press-releases/press-release-details/2026/PGE-Warns-Customers-About-Emerging-Barcode-Scam-Heres-What-You-Should-Know/default.aspx',
  },
  {
    name: 'Fake SBA Disaster Loan Broker Advance-Fee Scam',
    slug: 'fake-sba-disaster-loan-broker-scam',
    description:
      'After a hurricane or other declared disaster, someone claiming to represent the U.S. Small Business Administration proactively contacts a survivor — by phone, spoofed caller ID, or a look-alike email that isn\'t from an actual @sba.gov address — offering to fast-track approval of a federal disaster loan in exchange for an upfront fee, or pushing a high-interest "bridge loan" while the real application is still pending. The SBA\'s Office of Inspector General states plainly that the agency never initiates contact about a disaster loan and never charges a fee for disaster assistance, inspections, or help completing an application, making any unsolicited outreach demanding payment proof of fraud on its own — a distinct step from FEMA-impersonation schemes, since this specifically targets the SBA loan application survivors file after registering with FEMA.',
    categorySlug: 'government-impersonation',
    alertLevel: 'medium',
    sources: ['U.S. Small Business Administration, Office of Inspector General'],
    sourceUrl: 'https://www.sba.gov/about-sba/oversight-advocacy/office-inspector-general/protect-yourself-scams-fraud',
  },
  {
    name: 'Swedish "New Number" Child-in-Crisis SMS Scam',
    slug: 'swedish-new-number-child-in-crisis-sms-scam',
    description:
      'A scammer texts posing as the victim\'s child or grandchild, claiming to have a new phone number after losing or breaking their old phone, and asks the parent to save the new number and delete the old one. Once that trust is established, the "child" asks for urgent money — typically to cover a bill or bank transfer that must clear before an account is supposedly locked. Swedish police logged roughly 300 filed reports of this exact pattern in July 2025 alone during a documented summer surge, with the real number believed to be significantly higher since many victims never report it.',
    categorySlug: 'family-emergency-scams',
    country: 'SE',
    alertLevel: 'high',
    sources: ['Polismyndigheten (Swedish Police)'],
    sourceUrl: 'https://polisen.se/aktuellt/nyheter/nord/2026/maj/sms-bedragerier/',
  },
  {
    name: 'Swedish CEO Fraud (VD-bedrägeri)',
    slug: 'swedish-ceo-fraud-vd-bedrageri',
    description:
      'Fraudsters research a company through LinkedIn or Facebook — sometimes combined with data from a breach — to identify its CEO or another executive, then email or call an employee with payment authority while impersonating that executive, instructing an urgent and confidential wire transfer. Swedish police report companies losing hundreds of millions of kronor in total to this pattern, with some individual companies defrauded of more than SEK 100 million in a single incident; funds are typically routed through accounts in other European countries and onward to Asia, and police say they receive new reports multiple times a week.',
    categorySlug: 'business-email-compromise',
    country: 'SE',
    alertLevel: 'critical',
    sources: ['Polismyndigheten (Swedish Police)', 'SVT Nyheter'],
    sourceUrl: 'https://www.svt.se/nyheter/inrikes/polisen-varnar-for-foretagsbedragare',
  },
  {
    name: 'Swedish AI Voice-Cloning Fraud (AI-klonade röster)',
    slug: 'swedish-ai-voice-cloning-fraud',
    description:
      'Using as little as a few seconds of audio pulled from social media, a voicemail greeting, or a video, scammers clone a real person\'s voice with AI tools and use it in real-time phone calls — impersonating a company CEO instructing a financial transfer, or a distressed relative asking a family member for money. Sweden\'s national police fraud center (bedrägericentrum) has confirmed multiple real cases, notably in western Sweden, and is actively warning the public that the technique is now compounding older CEO-fraud and family-emergency scam patterns rather than replacing them.',
    categorySlug: 'ai-deepfake-scams',
    country: 'SE',
    alertLevel: 'high',
    sources: ['Polismyndigheten (Swedish Police)', 'SVT Nyheter'],
    sourceUrl: 'https://www.svt.se/nyheter/utrikes/ai-klonade-roster-anvands-i-bedragerier-roststolder-artificiell-intelligens',
  },
  {
    name: 'Home Title Theft (Quitclaim Deed Fraud)',
    slug: 'home-title-theft-quitclaim-deed-fraud',
    description:
      'Scammers search public property records for vacant land, paid-off homes, or homes owned by elderly or deceased people, then forge the owner\'s signature on a quitclaim deed — chosen because it requires no title warranty and draws less scrutiny at filing — and record it with the county to transfer "ownership" to themselves or a shell entity. From there they can sell the property, take out a mortgage against it, or rent it out, leaving the real owner to fight for their title back in court. The FBI\'s Boston field office has documented "title pirate" cases including one perpetrator who stole more than 30 homes this way, and nationwide IC3 data logged over 12,000 real estate fraud complaints and $275 million in losses in 2025, with seniors disproportionately targeted.',
    categorySlug: 'mortgage-foreclosure-scams',
    alertLevel: 'critical',
    sources: ['FBI Boston Field Office', 'FBI Internet Crime Complaint Center (IC3)'],
    sourceUrl: 'https://www.fbi.gov/contact-us/field-offices/boston/news/fbi-boston-warns-quit-claim-deed-fraud-is-on-the-rise-',
  },
  {
    name: 'New-Construction/ADU Builder Deposit Scam',
    slug: 'new-construction-adu-builder-deposit-scam',
    description:
      'A construction company — sometimes a shell entity, sometimes a real contractor operating fraudulently — presents polished proposals for a new home or backyard accessory dwelling unit (ADU), claiming deep expertise in local permitting and zoning to build trust, then collects a large upfront deposit, in documented cases as much as $250,000. The company cashes the check within days, then stalls indefinitely: no permits are ever pulled and no ground is ever broken. Arizona\'s Attorney General issued a specific 2026 consumer warning after tracking this exact pattern targeting homeowners building backyard ADUs.',
    categorySlug: 'mortgage-foreclosure-scams',
    alertLevel: 'high',
    sources: ["Arizona Attorney General's Office"],
    sourceUrl: 'https://www.azag.gov/press-release/attorney-general-mayes-warns-arizonans-construction-fraud-targeting-adu-projects',
  },
  {
    name: 'Zombie Second Mortgage Foreclosure Threat',
    slug: 'zombie-second-mortgage-foreclosure-threat',
    description:
      'Debt buyers purchase long-dormant second mortgages or HELOCs originated during the mid-2000s housing boom, on which the original lender stopped billing during the financial crisis and which the homeowner reasonably believed were forgiven, modified away, or discharged in bankruptcy. Years or decades later, the debt collector resurfaces, tacking on accumulated interest and fees, and threatens foreclosure to collect on a lien the homeowner had no idea was still active. The CFPB has found this collection tactic is often illegal outright, since the debt is frequently time-barred under the state statute of limitations — making it predatory debt collection weaponizing a real but legally dead lien, not a rescue-fee or fake-modification scheme.',
    categorySlug: 'mortgage-foreclosure-scams',
    alertLevel: 'high',
    sources: ['Consumer Financial Protection Bureau (CFPB)'],
    sourceUrl: 'https://www.consumerfinance.gov/about-us/blog/zombie-second-mortgages-when-collectors-come-for-long-forgotten-home-loans/',
  },
  {
    name: 'Unauthorized ACA Plan-Switching by Rogue Brokers',
    slug: 'unauthorized-aca-plan-switching-rogue-brokers',
    description:
      'A licensed insurance agent or broker with legitimate access to HealthCare.gov\'s marketplace systems — or a scammer using a consumer\'s stolen Social Security number and date of birth — switches a person\'s ACA marketplace health plan, or attaches themselves as that person\'s "agent of record," without ever contacting them, collecting the ongoing sales commission for themselves. Victims often only discover it when their doctor turns out to be out-of-network, their deductible resets mid-year, or they face a surprise tax bill after their subsidy eligibility was improperly changed. CMS logged nearly 74,000 unauthorized plan-switch complaints and over 134,000 unauthorized-enrollment complaints in just the first half of 2024 alone, and had suspended more than 850 agents and brokers by October 2024.',
    categorySlug: 'insurance-fraud',
    alertLevel: 'high',
    sources: ['Centers for Medicare & Medicaid Services (CMS)'],
    sourceUrl: 'https://www.cms.gov/newsroom/press-releases/cms-statement-system-changes-stop-unauthorized-agent-broker-marketplace-activity',
  },
  {
    name: 'Medicare "Flex Card" Free Benefits Scam',
    slug: 'medicare-flex-card-free-benefits-scam',
    description:
      'During Medicare\'s fall open enrollment period, ads, robocalls, and social media posts claim "Medicare" is issuing a flex card worth several hundred dollars for groceries, food, or other expenses, directing victims to a fake application site that harvests their Social Security number, Medicare number, credit card, or bank account details. Some real Medicare Advantage plans do legitimately offer flex cards, but only to members already enrolled in a plan that includes the benefit — Original Medicare never issues one and never solicits enrollees this way, and stolen Medicare numbers collected through the fake site get used for identity theft or fraudulent claims.',
    categorySlug: 'healthcare-fraud',
    alertLevel: 'high',
    sources: ['Senior Medicare Patrol (SMP)'],
    sourceUrl: 'https://smpresource.org/flex-card-scam-circulates/',
  },
  {
    name: 'Fake ACA "Cash Subsidy Card" Marketing Scam',
    slug: 'fake-aca-cash-subsidy-card-marketing-scam',
    description:
      'Ads, sometimes using AI-generated fake celebrity endorsements, promise enrollees hundreds of dollars a month in "subsidy cash" or gift cards for gas, groceries, or bills just for signing up for a marketplace health plan — misrepresenting how the ACA\'s premium tax credit actually works, since it\'s paid directly to the insurer to lower the premium and enrollees never receive a cash payout. Lead-generation brokers use this bait, and sometimes coach victims to misstate their income to qualify for a larger subsidy, to enroll people in a plan purely for the sales commission, leaving victims liable for a subsidy-reconciliation tax bill later or stuck with coverage they never actually wanted.',
    categorySlug: 'healthcare-fraud',
    alertLevel: 'high',
    sources: ['Federal Trade Commission (FTC)'],
    sourceUrl: 'https://consumer.ftc.gov/consumer-alerts/2024/11/looking-marketplace-health-insurance-open-enrollment-season-avoid-scammers',
  },
  {
    name: 'Dutch Bank Helpdesk Spoofing Fraud (Bankhelpdeskfraude)',
    slug: 'dutch-bank-helpdesk-spoofing-fraud',
    description:
      'A caller spoofs their phone number to display the victim\'s real bank on caller ID, claims fraudulent activity has been detected on the account, and pressures the victim into moving their money into a "safe" or "vault" account that is actually controlled by the criminals — the victim transfers the money themselves rather than having a code or login stolen outright. Some callers pose as police investigating a nearby burglary, or ask the victim to install remote-access software, and the stolen funds are laundered through recruited "money mules." Dutch consumer group Consumentenbond reports losses in the millions of euros annually, with bank reimbursement rates for victims falling from around 92% in 2021 to roughly 50% by 2025-2026.',
    categorySlug: 'account-takeover',
    country: 'NL',
    alertLevel: 'critical',
    sources: ['Politie (Dutch National Police)', 'Consumentenbond'],
    sourceUrl: 'https://www.politie.nl/informatie/wat-is-telefonische-helpdeskfraude-bank.html',
  },
  {
    name: 'Dutch "Vriend in Nood" Hacked Friend Fraud',
    slug: 'dutch-vriend-in-nood-hacked-friend-fraud',
    description:
      'A message arrives over WhatsApp, SMS, Telegram, or another app from what looks like a real friend\'s account — because it was actually hacked, or a lookalike account was created using their name and photo — claiming an urgent need for money, commonly framed as a lost or broken phone leaving them temporarily locked out of online banking. Victims who pay are frequently asked for a second transfer before discovering, only after contacting the real friend through another channel, that the account had been compromised the whole time. Dutch police logged roughly 100 reports a day of this pattern at its 2020 peak, up sharply from about 130 a week before.',
    categorySlug: 'account-takeover',
    country: 'NL',
    alertLevel: 'high',
    sources: ['Politie (Dutch National Police)'],
    sourceUrl: 'https://www.politie.nl/informatie/wat-is-whatsapp-fraude-vriend-in-noodfraude.html',
  },
  {
    name: 'Dutch Parking Meter QR Code Scam (Quishing)',
    slug: 'dutch-parking-meter-qr-code-scam',
    description:
      'Criminals stick fraudulent QR-code stickers directly onto public parking payment machines — documented in Amsterdam, Maastricht, Sittard-Geleen, and elsewhere — so that a driver scanning the code to pay is instead sent to a fake site mimicking a real parking app, which captures their full card details instead of processing an actual parking payment. Dutch police specifically warn drivers to check for a sticker or raised edge over a machine\'s original code and to pay only through an official parking app rather than scanning a code directly on the machine, since this hybrid physical-and-digital tactic captures far more than the price of a parking session.',
    categorySlug: 'phishing',
    country: 'NL',
    alertLevel: 'high',
    sources: ['Politie (Dutch National Police)'],
    sourceUrl: 'https://www.politie.nl/informatie/wat-is-fraude-met-qr-codes-quishing.html',
  },
  {
    name: 'Fake ICE/Immigration-Bond "Detained Relative" Scam',
    slug: 'fake-ice-immigration-bond-detained-relative-scam',
    description:
      'Scammers impersonating ICE agents, immigration attorneys, or notaries contact the family of someone believed to be in immigration detention — or fabricate a detention entirely — and claim an "immigration bond" or fee, often citing a specific dollar figure, must be paid immediately to secure the person\'s release or stop a deportation. Some versions stage a fake virtual court hearing or a fake bond-approval document to add credibility, and always demand payment by gift card, cryptocurrency, or wire transfer — methods ICE and USCIS never actually use to collect a bond.',
    categorySlug: 'family-emergency-scams',
    alertLevel: 'high',
    sources: ['District of Columbia Department of Insurance, Securities and Banking', 'Federal Trade Commission (FTC)'],
    sourceUrl: 'https://disb.dc.gov/page/ice-agent-imposter-scam',
  },
  {
    name: 'Cryptocurrency Bail-Bond Scam Using Public Arrest Records',
    slug: 'cryptocurrency-bail-bond-public-arrest-records-scam',
    description:
      'Scammers scrape publicly available arrest-record websites to identify people who were genuinely, recently arrested, then call the arrestee\'s family members directly, falsely posing as a bail bondsman who can prevent the relative from being incarcerated. Payment is demanded specifically in cryptocurrency, along with gift cards or money-transmitter services, all irreversible once sent; a related variant plays a recording of the actual arrestee\'s voice to make the call appear to originate from inside the jail. Unlike a follow-up call confirming an already-fabricated emergency, this scam starts from a real public arrest record and contacts the family as the first and only call.',
    categorySlug: 'family-emergency-scams',
    alertLevel: 'high',
    sources: ['Washington State Department of Financial Institutions'],
    sourceUrl: 'https://dfi.wa.gov/consumer/alerts/cryptocurrency-bail-bond-scam',
  },
  {
    name: 'Social Security Benefit Suspension Threat Scam',
    slug: 'social-security-benefit-suspension-threat-scam',
    description:
      'Scammers contact Social Security recipients by phone, text, email, or mail falsely claiming their Social Security number or benefits will be suspended or discontinued — sometimes citing an office closure or alleged criminal activity — unless they call back immediately. Once on the phone, victims are pressured to hand over personal information or make an immediate payment by gift card, wire transfer, cryptocurrency, prepaid debit card, or mailed cash. The Social Security Administration states plainly that it will never threaten to suspend a benefit or demand payment through any of these untraceable methods.',
    categorySlug: 'public-benefits-fraud',
    alertLevel: 'high',
    sources: ['Social Security Administration Office of the Inspector General'],
    sourceUrl: 'https://oig.ssa.gov/scam-alerts/2025-07-17-social-security-benefit-suspension-scam/',
  },
  {
    name: 'Fake Social Security "Benefit Increase" Offer Scam',
    slug: 'fake-social-security-benefit-increase-offer-scam',
    description:
      'Criminals impersonating the Social Security Administration contact beneficiaries by phone, email, text, social media, or mail, promising extra money — often framed as a cost-of-living adjustment increase — or offering to help set up an online "my Social Security" account. Victims are directed to a fake SSA-lookalike website to submit personal and financial details, then told to pay a "processing fee" by gift card, prepaid debit card, cryptocurrency, wire transfer, or mailed cash to unlock the promised increase. It\'s the inverse of the benefit-suspension threat scam: instead of fear, this version works by dangling money the recipient was never actually owed.',
    categorySlug: 'public-benefits-fraud',
    alertLevel: 'medium',
    sources: ['Social Security Administration Office of the Inspector General'],
    sourceUrl: 'https://oig.ssa.gov/scam-alerts/2025-07-17-offers-to-increase-your-social-security-benefit-are-from-criminals/',
  },
  {
    name: 'Fraudulent "Social Security Statement Ready" Email Scam',
    slug: 'fraudulent-social-security-statement-ready-email-scam',
    description:
      'A phishing email styled with official Social Security Administration logos and formatting claims "your Social Security statement is ready to download," creating urgency to click an embedded link or open an attachment. Unlike a direct payment-demand scam, this one is built to steal credentials or install malware: the link either routes the victim to a fake SSA lookalike site designed to harvest personal and financial information, or the attachment installs malicious software directly. The Social Security Administration\'s Office of the Inspector General notes that genuine agency emails only ever come from an address ending in .gov.',
    categorySlug: 'public-benefits-fraud',
    alertLevel: 'medium',
    sources: ['Social Security Administration Office of the Inspector General'],
    sourceUrl: 'https://oig.ssa.gov/scam-alerts/2026-02-20-ssa-office-of-the-inspector-general-warns-public-of-surge-in-fraudulent-social-security-statement-emails/',
  },
  {
    name: 'Indian Task-Based "Work From Home" Job Scam',
    slug: 'indian-task-based-work-from-home-job-scam',
    description:
      'Victims are recruited over WhatsApp or Telegram with offers of easy paid "tasks" — liking YouTube videos, rating hotels or products, or installing apps — and are actually paid a small real amount at first to build trust. Once hooked, they\'re moved into a "VIP" or "Premium Task Group" where unlocking higher-value tasks requires first depositing money, with the promised bigger payout always just one more deposit away until the scammer disappears. India\'s Indian Cyber Crime Coordination Centre identified this pattern as the single largest category of cybercrime complaints in the country in 2023.',
    categorySlug: 'employment-scams',
    country: 'IN',
    alertLevel: 'high',
    sources: ['Indian Cyber Crime Coordination Centre (I4C)', 'West Bengal Police Cyber Crime Wing'],
    sourceUrl: 'https://aninews.in/news/national/general-news/work-from-home-or-part-time-job-scams-top-cyber-crimes-in-india-says-i4c20240103184451/',
  },
  {
    name: 'Indian Fake Trading App / Fraudulent FPI Investment Scheme',
    slug: 'indian-fake-trading-app-fpi-investment-scheme',
    description:
      'Fraudsters posing as employees or affiliates of SEBI-registered Foreign Portfolio Investors lure victims through WhatsApp groups, online "trading courses," and live broadcasts into downloading an unofficial app that claims to offer institutional-grade access to buy shares and subscribe to IPOs without a real trading or demat account. The app displays fabricated profits to encourage larger deposits, and when victims try to withdraw, they\'re told to first pay a "capital gains tax" or similar fee to a private account — money that never comes back. SEBI issued a formal advisory on this exact scheme in February 2024 after receiving numerous investor complaints.',
    categorySlug: 'investment-fraud',
    country: 'IN',
    alertLevel: 'critical',
    sources: ['Securities and Exchange Board of India (SEBI)'],
    sourceUrl: 'https://www.sebi.gov.in/media-and-notifications/press-releases/feb-2024/sebi-issues-advisory-against-fraudulent-trading-schemes-claiming-to-be-offered-to-indian-residents-by-fpis_81733.html',
  },
  {
    name: 'Indian Fake Electricity Bill Disconnection Scam',
    slug: 'indian-fake-electricity-bill-disconnection-scam',
    description:
      'Victims receive an SMS or WhatsApp message from an unofficial number claiming their electricity bill is unpaid and that power will be disconnected within hours unless they act immediately, sometimes followed by a call from someone posing as a "lineman" or "junior engineer." The message pushes the victim to call a number or click a link or app file, which is then used either to demand urgent UPI payment or to talk the victim into installing a remote-access app that lets the scammer drain their bank account directly. Haryana Police and Mumbai Police have both issued public advisories confirming that electricity distribution companies never send disconnection threats by SMS or WhatsApp.',
    categorySlug: 'utility-scams',
    country: 'IN',
    alertLevel: 'high',
    sources: ['Haryana Police', 'Mumbai Police'],
    sourceUrl: 'https://www.tribuneindia.com/news/haryana/fake-bill-messages-being-sent-cops-395300',
  },
  {
    name: 'Hijacked Email Thread Invoice Wire Fraud',
    slug: 'hijacked-email-thread-invoice-wire-fraud',
    description:
      'A scammer compromises an employee\'s own email mailbox — not the vendor\'s — and quietly monitors it, often using auto-forwarding rules, until a real, ongoing invoice conversation with a legitimate vendor is underway. The scammer then inserts fraudulent wire instructions directly into that authentic email thread, impersonating the vendor\'s staff, so the request carries none of the usual red flags of a cold phishing email since it appears mid-conversation inside a thread the employee already trusts. A finance employee at an Arkansas school district lost over $3.2 million this way in December 2025, when fraudulent wire instructions impersonating a real contractor were inserted into an active invoice thread after her mailbox was compromised.',
    categorySlug: 'business-email-compromise',
    alertLevel: 'critical',
    sources: ['Arkansas Democrat-Gazette', 'Cybersecurity and Infrastructure Security Agency (CISA)'],
    sourceUrl: 'https://www.arkansasonline.com/news/2026/may/19/emails-show-how-pine-bluff-school-district-was/',
  },
  {
    name: 'Fake Company Bulk Purchase Order Fraud',
    slug: 'fake-company-bulk-purchase-order-fraud',
    description:
      'A scammer registers a lookalike domain for a real, creditworthy business — swapping a letter, adding a hyphen — and uses it to impersonate that company while placing large purchase orders with legitimate vendors for goods like construction materials, agricultural supplies, computer hardware, or solar equipment. Using fabricated credit references and forged tax forms, they request 30- or 60-day payment terms, take delivery of the goods, and simply never pay, with the vendor only discovering the fraud when collection fails or they contact the real company directly. Unlike most business email compromise scams, this one isn\'t a wire-redirection trick at all — it\'s outright theft of physical goods through an impersonated buyer identity and fraudulent credit terms.',
    categorySlug: 'business-email-compromise',
    alertLevel: 'high',
    sources: ['FBI Internet Crime Complaint Center (IC3)'],
    sourceUrl: 'https://www.ic3.gov/PSA/2023/PSA230324',
  },
  {
    name: 'Social Media Tax Credit Misinformation Scam',
    slug: 'social-media-tax-credit-misinformation-scam',
    description:
      'Promoters and influencers on TikTok and other social platforms tell viewers that "everyone qualifies" for tax credits that don\'t actually exist as described — including a fabricated "Self-Employment Tax Credit" falsely advertised as worth up to $32,000 — and coach people to file or amend returns claiming them regardless of actual eligibility. Since 2022, this misinformation has driven more than 32,000 taxpayers to file false claims, resulting in over $162 million in frivolous-return penalties on top of delayed or denied refunds and direct IRS enforcement action against the filers who followed the advice.',
    categorySlug: 'tax-scams',
    alertLevel: 'high',
    sources: ['Internal Revenue Service (IRS)'],
    sourceUrl: 'https://www.irs.gov/newsroom/irs-assesses-162-million-in-penalties-over-false-tax-credit-claims-tied-to-social-media',
  },
  {
    name: 'EFIN Phishing Scam Targeting Tax Professionals',
    slug: 'efin-phishing-scam-tax-professionals',
    description:
      'Scammers pose as a tax-software provider and email professional tax preparers asking them to fax back their Electronic Filing Identification Number (EFIN) for "verification." A preparer who complies hands the attacker the exact credentials needed to file fraudulent returns and steal client data directly through the firm\'s own legitimate e-file access — a supply-chain-style attack that targets the tax-preparation industry itself rather than individual taxpayers, potentially exposing every one of that preparer\'s clients at once.',
    categorySlug: 'tax-scams',
    alertLevel: 'high',
    sources: ['Internal Revenue Service (IRS)'],
    sourceUrl: 'https://www.irs.gov/newsroom/tax-pros-watch-out-for-efin-scams',
  },
  {
    name: 'Fake IRS IP PIN Phone Scam',
    slug: 'fake-irs-ip-pin-phone-scam',
    description:
      'A caller impersonating the IRS or a tax preparer asks a taxpayer to "verify" or provide their six-digit Identity Protection PIN (IP PIN) — the very number the IRS issues specifically to stop someone else from filing a fraudulent return in that person\'s name. Handing it over defeats the taxpayer\'s own anti-identity-theft safeguard, letting the scammer combine a stolen Social Security number with the now-compromised IP PIN to file a fraudulent return. The IRS states flatly that it will never call, email, text, or message a taxpayer through social media to request an IP PIN.',
    categorySlug: 'tax-scams',
    alertLevel: 'medium',
    sources: ['Internal Revenue Service (IRS)'],
    sourceUrl: 'https://www.irs.gov/identity-theft-fraud-scams/get-an-identity-protection-pin',
  },
  {
    name: 'Australian Bank Impersonation SMS Spoofing Scam',
    slug: 'australian-bank-impersonation-sms-spoofing-scam',
    description:
      'Scammers use SMS spoofing software to copy a real bank\'s sender ID, so fraudulent texts land in the same conversation thread as a victim\'s genuine past messages from their bank — making them appear completely legitimate at a glance. The texts claim a suspicious transaction or account compromise and push the victim to call an embedded number or urgently transfer funds to a "safe" account, which sends the money straight to the scammer. Australia\'s National Anti-Scam Centre logged 14,603 reports of this pattern in 2022 alone, with losses exceeding $20 million and an average loss of roughly $22,000, some cases reaching $500,000.',
    categorySlug: 'account-takeover',
    country: 'AU',
    alertLevel: 'critical',
    sources: ['National Anti-Scam Centre / Scamwatch (ACCC)'],
    sourceUrl: 'https://www.accc.gov.au/media-release/bank-impersonation-scams-robbing-australians-of-their-life-savings',
  },
  {
    name: 'Australian "Hi Mum/Dad" Family Impersonation Messaging Scam',
    slug: 'australian-hi-mum-dad-family-impersonation-scam',
    description:
      'Scammers message victims via WhatsApp or SMS from an unknown number, posing as their child claiming to have lost or broken their phone and texting from a new one. After building rapport, they claim to be locked out of online banking and ask the "parent" to urgently pay a bill, contractor, or replacement-phone cost on their behalf. In just the first seven months of 2022, more than 1,150 Australians lost a combined $2.6 million to this pattern, with people over 55 accounting for 95% of reported losses; by 2024 the scam had evolved to incorporate AI voice cloning.',
    categorySlug: 'family-emergency-scams',
    country: 'AU',
    alertLevel: 'high',
    sources: ['National Anti-Scam Centre / Scamwatch (ACCC)'],
    sourceUrl: 'https://www.accc.gov.au/media-release/accc-warning-of-suspicious-messages-as-hi-mum-scams-spike',
  },
  {
    name: 'Australian Medicare Text and Email Phishing Scam',
    slug: 'australian-medicare-text-email-phishing-scam',
    description:
      'Victims receive an SMS or email impersonating Medicare, Australia\'s public healthcare system, claiming they\'ve lost access to the service or are owed a rebate — sometimes a specific figure like $200 — with a link to "reclaim" it. Clicking leads to a fake form asking the victim to update their payment or bank details and enter a one-time PIN to "confirm" their identity, handing scammers both banking credentials and the OTP needed to access the account. Scamwatch logged 1,492 reports of Medicare-impersonation SMS scams in less than two months at the start of 2024 alone; Services Australia confirms it never asks customers to click a link in a text message to receive a payment or rebate.',
    categorySlug: 'healthcare-fraud',
    country: 'AU',
    alertLevel: 'medium',
    sources: ['Services Australia', 'National Anti-Scam Centre / Scamwatch (ACCC)'],
    sourceUrl: 'https://www.abc.net.au/news/2024-02-28/new-medicare-scam/103514070',
  },
  {
    name: 'Sextortion "Recovery Scam"',
    slug: 'sextortion-recovery-scam',
    description:
      'For-profit companies advertise to or directly contact people who have already been sextorted, offering to "recover," remove, or prevent further distribution of the images in exchange for an upfront fee, often $2,000 to $5,000 in documented cases. They use unenforceable fake cease-and-desist letters, false claims of government connections, and high-pressure tactics that actively discourage victims from contacting law enforcement — the FBI has found some of these firms are directly or indirectly tied to the original extortion itself. Genuine help through the FBI, NCMEC\'s CyberTipline, or a local field office is always free.',
    categorySlug: 'sextortion',
    alertLevel: 'high',
    sources: ['FBI Internet Crime Complaint Center (IC3)'],
    sourceUrl: 'https://www.ic3.gov/PSA/2023/PSA230407',
  },
  {
    name: 'Prison-Run Catfishing Sextortion Ring Targeting Military Service Members',
    slug: 'prison-run-catfishing-sextortion-military',
    description:
      'Organized rings, in one documented case run by inmates using contraband cellphones from South Carolina and North Carolina prisons, pose as young women on dating apps to build relationships with active-duty service members, exchange photos, then switch to posing as the "woman\'s" father or law enforcement, falsely claiming the photos depict an underage girl and demanding money to avoid prosecution. One ring, tracked by NCIS as "Operation Surprise Party," defrauded roughly 442 service members of a combined $560,000 before DOJ indictments and sentencing. NCIS has issued a dedicated advisory warning that junior enlisted members, disproportionately single and frequently online, are the primary target.',
    categorySlug: 'sextortion',
    alertLevel: 'critical',
    sources: ['U.S. Department of Justice', 'Naval Criminal Investigative Service (NCIS)'],
    sourceUrl: 'https://www.justice.gov/usao-sc/pr/south-carolina-inmate-sentenced-federal-prison-role-military-sextortion-scheme',
  },
  {
    name: 'Green Card Diversity Visa Lottery Fee Scam',
    slug: 'green-card-diversity-visa-lottery-fee-scam',
    description:
      'Scammers send emails or letters impersonating the U.S. Department of State claiming the recipient won the real Diversity Visa lottery — sometimes targeting people who never even entered — then demand fees "to process the application" or "secure a spot," payable in advance by check, money order, or wire transfer. The real Diversity Visa program never notifies winners by letter or email; winners can only check their status through the government\'s own official site, and every legitimate fee is paid in person at the embassy or consulate interview, never in advance by mail or wire.',
    categorySlug: 'lottery-sweepstakes-scams',
    alertLevel: 'high',
    sources: ['Federal Trade Commission (FTC)'],
    sourceUrl: 'https://www.ftc.gov/media/79859',
  },
  {
    name: 'Fake Charity-Branded Sweepstakes Call',
    slug: 'fake-charity-branded-sweepstakes-call',
    description:
      'Callers using Washington D.C.-area codes impersonate a federal agency — sometimes the real FTC, sometimes a fictitious "Consumer Protection Agency" — and tell victims they\'ve won a large cash prize through a sweepstakes falsely claimed to be run by a well-known, real charity such as the Make-A-Wish Foundation. Victims are told to provide banking information or wire several thousand dollars to cover "taxes and insurance" before the prize can be released, even though the charity being named has no actual sweepstakes program at all.',
    categorySlug: 'lottery-sweepstakes-scams',
    alertLevel: 'high',
    sources: ["Nevada Attorney General's Office"],
    sourceUrl: 'https://ag.nv.gov/News/PR/2017/Attorney_General_Laxalt_Warns_of_Fraudulent_Make-A-Wish_Foundation_Sweepstakes_Scam/',
  },
  {
    name: 'Fake Gas/Grocery Voucher Postcard Scam',
    slug: 'fake-gas-grocery-voucher-postcard-scam',
    description:
      'A postcard, social media post, or "survey" — recent versions use the fictitious sender name "AAPP," designed to resemble AARP, along with a QR code — tells the recipient a gas or grocery voucher, commonly worth $300 to $500 and sometimes impersonating a real brand like Shell, is reserved for them and will be lost if they don\'t act immediately. Calling the number or scanning the code leads to a request for a small "processing" or "shipping" fee of a few dollars, which actually harvests card details and triggers ongoing, unauthorized recurring charges — in one documented case, repeated $89.95 charges — rather than delivering any voucher at all.',
    categorySlug: 'lottery-sweepstakes-scams',
    alertLevel: 'medium',
    sources: ['Better Business Bureau (BBB)'],
    sourceUrl: 'https://www.bbb.org/article/news-releases/27243-bbb-scam-alert-cash-strapped-drivers-scammed-with-fake-gas-gift-cards',
  },
  {
    name: 'Japanese Cash Card Swap Theft Fraud (Cash Card Sagito)',
    slug: 'japanese-cash-card-swap-theft-fraud',
    description:
      'A caller impersonating a police officer or bank-association employee tells the victim their cash card or account has been used fraudulently and arranges an in-person "protection procedure" visit. A second scammer, posing as an official, has the victim seal the real card and a note of their PIN into an envelope, then creates a distraction — such as sending the victim to fetch a personal seal — and swaps the envelope for an identical decoy containing playing cards, stealing the real card to drain the account at ATMs before the theft is even noticed. This physical-theft-by-deception mechanism is distinct from ATM "refund" scams, which manipulate a victim into operating an ATM themselves rather than stealing their card outright.',
    categorySlug: 'government-impersonation',
    country: 'JP',
    alertLevel: 'critical',
    sources: ['National Police Agency (Japan)'],
    sourceUrl: 'https://www.npa.go.jp/bureau/safetylife/sos47/case/cashcard/',
  },
  {
    name: 'Japan Amazon Account Suspension SMS Phishing Scam',
    slug: 'japan-amazon-account-suspension-sms-phishing',
    description:
      'A text message impersonating Amazon Japan claims the recipient\'s account has been suspended, a payment method has failed, or a video-streaming fee is unpaid, pressuring an immediate click to avoid "legal action." The link leads to a lookalike fake Amazon login page — confirmed spoofed domains follow patterns like "user-amazon.[x].top" — that harvests the victim\'s ID and password, then routes them to a second page collecting full card details, including the security code, for unauthorized use.',
    categorySlug: 'phishing',
    country: 'JP',
    alertLevel: 'high',
    sources: ['National Consumer Affairs Center of Japan (NCAC)', 'Council of Anti-Phishing Japan'],
    sourceUrl: 'https://www.kokusen.go.jp/news/data/n-20221221_2.html',
  },
  {
    name: 'Japanese Fake Police Deepfake Video-Call Fraud',
    slug: 'japanese-fake-police-deepfake-video-call-fraud',
    description:
      'A caller claiming to be a police officer, prosecutor, or telecom representative tells the victim their bank account or phone contract was used in a crime, such as money laundering, and that they face arrest unless they "cooperate." To build credibility, scammers show a fake arrest warrant or police ID over a video call — increasingly through a fake police website with a built-in video-call feature displaying a deepfaked "officer" — then direct the victim to transfer funds to a designated account to "protect" them from the investigation. Japan\'s National Police Agency recorded 11,014 cases of this fraud type in 2025 alone, nearly 40% of all "tokushu sagi" special fraud cases and roughly ¥100.5 billion in losses, making it the single largest fraud category in the country.',
    categorySlug: 'government-impersonation',
    country: 'JP',
    alertLevel: 'critical',
    sources: ['National Police Agency (Japan)'],
    sourceUrl: 'https://www.npa.go.jp/bureau/safetylife/sos47/new-topics/241218/02.html',
  },
  {
    name: 'AI Deepfake FBI/IC3 "Fund Recovery" Re-Scam',
    slug: 'ai-deepfake-fbi-ic3-fund-recovery-rescam',
    description:
      'Scammers target people who already lost money to an earlier scam, contacting them by email, phone, social media, or ads with a false claim that they can recover the stolen funds. To appear credible during real-time video calls, they generate AI deepfake video of FBI agents, IC3 personnel, or other authority figures, then direct victims to a spoofed IC3-lookalike website to hand over personal and financial information, or to pay a bogus "recovery fee" — turning to AI-generated video specifically to overcome the skepticism a scam victim would normally have the second time around.',
    categorySlug: 'ai-deepfake-scams',
    alertLevel: 'high',
    sources: ['FBI Internet Crime Complaint Center (IC3)'],
    sourceUrl: 'https://www.ic3.gov/PSA/2026/PSA260720',
  },
  {
    name: 'AI Voice-Clone Bypass of Bank "Voice ID" Authentication',
    slug: 'ai-voice-clone-bypass-bank-voice-id',
    description:
      'Rather than tricking a person, fraudsters feed a short public sample of someone\'s voice — pulled from social media, a podcast, or an interview — into AI voice-cloning software to generate synthetic audio that defeats a bank\'s automated phone "Voice ID" biometric authentication, gaining account access without ever holding a live conversation with anyone. Journalist investigations demonstrated the technique working against major bank voice-authentication systems, prompting the US Senate Banking Committee to formally question several of the country\'s largest banks about the security of their voice-biometric login tools.',
    categorySlug: 'ai-deepfake-scams',
    alertLevel: 'high',
    sources: ['U.S. Senate Committee on Banking, Housing, and Urban Affairs'],
    sourceUrl: 'https://www.banking.senate.gov/newsroom/majority/brown-presses-banks-voice-authentication-services',
  },
  {
    name: 'AI-Enhanced Deepfake Disaster Charity Scam',
    slug: 'ai-enhanced-deepfake-disaster-charity-scam',
    description:
      'After a hurricane, wildfire, flood, or other mass-casualty event, fraudsters use AI-generated images and video — mixing real disaster footage with fabricated celebrity or official appearances — to make fake charity solicitations look more convincing and urgent, then route "donations" through gift cards, cryptocurrency, or peer-to-peer payment apps instead of any real relief fund. The FBI specifically warns that AI is now used to "increase perceived legitimacy" of these post-disaster charity scams, a layer of deception beyond the older, non-AI version of the same fake-charity mechanism.',
    categorySlug: 'ai-deepfake-scams',
    alertLevel: 'high',
    sources: ['FBI Internet Crime Complaint Center (IC3)'],
    sourceUrl: 'https://www.ic3.gov/PSA/2025/PSA250116',
  },
  {
    name: 'Unauthorized Third-Party Energy Supplier Switch ("Slamming")',
    slug: 'unauthorized-third-party-energy-supplier-switch',
    description:
      'In deregulated electricity and gas markets, door-to-door or phone salespeople posing as affiliated with a customer\'s real utility enroll them with a third-party supplier at much higher rates without valid consent — sometimes using the customer\'s own confidential account data to create an online account or "authorize" the switch without their knowledge. Pennsylvania\'s Public Utility Commission documented this at scale against one supplier, alleging nearly 9,000 marketing-regulation violations including unauthorized switches on 339 customer accounts, some of them enrolled after the customer had already died, and thousands of cases of accessing confidential customer data without consent.',
    categorySlug: 'utility-scams',
    alertLevel: 'medium',
    sources: ['Pennsylvania Public Utility Commission (PA PUC)'],
    sourceUrl: 'https://www.puc.pa.gov/press-release/2020/investigation-of-deceptive-energy-marketing-allegations-results-in-complaint-against-texas-based-verde-energy-usa-88plus-million-civil-penalty-and-pa-license-revocation-sought-by-prosecutors',
  },
  {
    name: 'Fake LIHEAP "Benefit Verification" Door-to-Door Scam',
    slug: 'fake-liheap-benefit-verification-door-to-door-scam',
    description:
      'Scammers go door-to-door targeting known or suspected recipients of LIHEAP, the federal Low-Income Home Energy Assistance Program, claiming they need to see the household\'s utility bill and personal information to "verify" that the correct funds were applied. State human services agencies confirm this is always fraudulent — LIHEAP funds are paid directly to the utility or fuel provider as a grant, so neither the state nor the utility ever needs to solicit this information at the door, making the visit really just a pretext for identity theft.',
    categorySlug: 'utility-scams',
    alertLevel: 'medium',
    sources: ['Pennsylvania Department of Human Services'],
    sourceUrl: 'https://www.cbsnews.com/pittsburgh/news/pennsylvania-department-of-human-services-door-to-door-liheap-scam/',
  },
  {
    name: 'Fake Lead Pipe Testing/Replacement Fee Scam',
    slug: 'fake-lead-pipe-testing-replacement-fee-scam',
    description:
      'As cities run real, free lead-service-line testing and replacement programs required under the federal Lead and Copper Rule, scammers pose as utility workers offering on-the-spot lead testing or citing "replacement" work, then request payment or push their way into the home. Real utilities warn that genuine lead testing is typically done through mail-in kits homeowners use themselves — a utility never sends an employee to collect cash at the door — so anyone requesting payment in person while claiming to test or replace lead pipes is an impostor.',
    categorySlug: 'utility-scams',
    alertLevel: 'medium',
    sources: ['Denver Water'],
    sourceUrl: 'https://www.denverwater.org/tap/how-spot-scam-or-fake-water-worker',
  },
  {
    name: 'German Grandchild Trick / Shock Call (Enkeltrick / Schockanruf)',
    slug: 'german-enkeltrick-schockanruf',
    description:
      'A live, real-time phone call — not a text message — in which a caller impersonates a distressed relative claiming to have caused a serious accident or crime. The call is often handed off mid-conversation to an accomplice posing as a police officer or prosecutor, who demands "bail" or "compensation" to avoid the relative\'s imprisonment. Victims, predominantly elderly, are pressured into handing cash or jewelry to a courier who comes to their home or a meeting point, with the scammer staying on the phone throughout the handover to maintain psychological pressure. Germany\'s Federal Criminal Police Office recorded roughly €49 million in losses from this pattern in 2025, with a closely related "fake police officer" variant causing a further €49.5 million.',
    categorySlug: 'family-emergency-scams',
    country: 'DE',
    alertLevel: 'critical',
    sources: ['Bundeskriminalamt (BKA)'],
    sourceUrl: 'https://www.bka.de/SharedDocs/Kurzmeldungen/DE/Warnhinweise/230524_Schockanrufe.html',
  },
  {
    name: 'German Home-Work Advance-Fee Job Scam (Heimarbeit)',
    slug: 'german-heimarbeit-advance-fee-job-scam',
    description:
      'Fraudulent "work from home" job ads promising easy pay for simple piecework, such as assembling pens or stuffing envelopes, ask victims to pay an upfront fee, typically €50 to €500, for a "starter kit," materials, or a registration fee, sometimes disguised as a magazine subscription with the cost supposedly deductible from future earnings. After payment, the company either vanishes, refuses to buy back completed work by citing bogus quality issues, or was never a real business to begin with — leaving the jobseeker out the upfront fee with no pay for any work at all.',
    categorySlug: 'employment-scams',
    country: 'DE',
    alertLevel: 'medium',
    sources: ['Verbraucherzentrale Hamburg'],
    sourceUrl: 'https://www.vzhh.de/themen/einkauf-reise-freizeit/nebenjobs/nebenjob-fuer-zu-hause-online-geld-verdienen',
  },
  {
    name: 'German Fake Tax Office / Elster Refund Phishing',
    slug: 'german-fake-elster-tax-refund-phishing',
    description:
      'Fraudulent emails and text messages impersonate Germany\'s official online tax portal, Elster, or the Federal Central Tax Office, claiming the recipient has an outstanding tax refund that could not be processed and must be claimed through a linked form within a short deadline, often just 48 hours. The messages mimic official logos and formal government language convincingly, but the link leads to a fake site built to harvest personal data, banking details, or the victim\'s real Elster portal login credentials.',
    categorySlug: 'tax-scams',
    country: 'DE',
    alertLevel: 'high',
    sources: ['Verbraucherzentrale NRW'],
    sourceUrl: 'https://www.verbraucherzentrale.nrw/wissen/digitale-welt/phishingradar/betrug-phishingmails-und-falsche-sms-von-ministerien-und-behoerden-76907',
  },
  {
    name: 'Funeral Home Impersonation Grief Scam',
    slug: 'funeral-home-impersonation-grief-scam',
    description:
      'Scammers scan online obituaries and funeral home websites for names, family relationships, and service dates, then call grieving relatives with the caller ID spoofed to match the real funeral home\'s number. Posing as funeral home staff, they claim an unpaid balance is owed for the deceased\'s services or cremation and demand immediate payment by wire transfer, gift card, or crypto — exploiting the family\'s grief and urgency before anyone has a chance to verify the real bill.',
    categorySlug: 'family-emergency-scams',
    alertLevel: 'high',
    sources: ['Federal Trade Commission (FTC)'],
    sourceUrl: 'https://www.ftc.gov/business-guidance/blog/2023/06/scammers-impersonate-funeral-home-staff-prey-mourning-families-can-it-get-any-lower',
  },
  {
    name: 'Storm-Chaser Roofing Deductible Waiver Fraud',
    slug: 'storm-chaser-roofing-deductible-waiver-fraud',
    description:
      'After a hailstorm or hurricane, door-to-door "storm chaser" roofing contractors offer homeowners a free roof by promising to waive or absorb their insurance deductible, then inflate the invoice submitted to the insurer to cover the difference — making the homeowner an unwitting party to insurance fraud, since the real cost of the work no longer matches what\'s billed. At least two dozen states, including Texas and Florida, now specifically criminalize a contractor paying, waiving, or rebating a policyholder\'s deductible, and regulators warn the resulting roofs are often shoddy or left unfinished once the contractor has been paid.',
    categorySlug: 'insurance-fraud',
    alertLevel: 'high',
    sources: ['Texas Department of Insurance'],
    sourceUrl: 'https://tdi.texas.gov/tips/state-law-cracks-down-on-roof-scams.html',
  },
  {
    name: 'Fake VA Benefits Overpayment Collection Scam',
    slug: 'fake-va-benefits-overpayment-collection-scam',
    description:
      'Scammers text, email, or call veterans posing as VA employees or the VA Debt Management Center, claiming the veteran was overpaid disability or pension benefits and must immediately repay the amount or provide banking details to "correct" it. Messages use spoofed caller ID reading "VA" or "Debt Center," fake VA logos and letterhead, and links to phishing pages built to mimic va.gov, pressuring urgent payment via gift card, wire, or crypto.',
    categorySlug: 'government-impersonation',
    alertLevel: 'high',
    sources: ['U.S. Department of Veterans Affairs'],
    sourceUrl: 'https://news.va.gov/145291/protecting-veterans-from-fraud-and-scams/',
  },
  {
    name: 'Vacant Land Owner Impersonation Sale Fraud',
    slug: 'vacant-land-owner-impersonation-sale-fraud',
    description:
      'Criminals research public county property records to identify vacant land or homes owned free-and-clear, then impersonate the real owner using fake IDs, spoofed email and phone numbers, and forged notary seals to "sell" the property to an unsuspecting buyer who has never met the true owner. Unlike quitclaim-deed forgery, which files a fraudulent document with the county in the owner\'s name, this scheme involves live impersonation of the owner (and sometimes the closing attorney) during the sale itself — increasingly aided by AI-generated documents or a cloned voice on verification calls — with sale proceeds routed to a co-conspirator to launder before the real owner ever learns the parcel was sold.',
    categorySlug: 'mortgage-foreclosure-scams',
    alertLevel: 'critical',
    sources: ['FBI Internet Crime Complaint Center (IC3)'],
    sourceUrl: 'https://www.ic3.gov/PSA/2026/PSA260616',
  },
  {
    name: 'AI-Cloned Voice Seller Impersonation in Closing Wire Fraud',
    slug: 'ai-cloned-voice-seller-impersonation-closing-wire-fraud',
    description:
      'Fraudsters use AI voice-cloning tools, which need as little as 10-30 seconds of sample audio, to impersonate a seller, title officer, or closing attorney on a live phone or video call and instruct a title company or escrow agent to redirect net sale proceeds or a payoff wire to a new account. Documented cases include a fully deepfaked video call that fooled both a buyer and a title company into a fraudulent multimillion-dollar sale, with industry and FBI figures putting AI-enabled real estate wire fraud losses at roughly $200 million in the first quarter of 2025 alone.',
    categorySlug: 'ai-deepfake-scams',
    alertLevel: 'critical',
    sources: ['National Association of Realtors'],
    sourceUrl: 'https://www.nar.realtor/news/real-estate-news/whats-real-what-isnt-how-to-spot-deepfakes-ai-real-estate-scams',
  },
  {
    name: 'Irish Rental and Student Accommodation Deposit Scam',
    slug: 'irish-rental-deposit-scam',
    description:
      'Fraudsters post fake rental listings on legitimate platforms like Daft.ie, posing as a landlord based abroad or otherwise unavailable, often at a suspiciously cheap price for the location, then pressure a prospective tenant to wire a deposit or first month\'s rent before ever viewing the property in person. A local-imposter variant involves someone who does show a real property but collects deposits from multiple prospective tenants for the same unit before disappearing with all of them. An Garda Síochána\'s Economic Crime Bureau logged 230 reports and over €410,000 lost to rental fraud in the first half of 2026 alone, up from 160 reports over the same period a year earlier, with a seasonal spike each year as students search for accommodation ahead of the college term.',
    categorySlug: 'online-shopping-scams',
    country: 'IE',
    alertLevel: 'high',
    sources: ['An Garda Síochána'],
    sourceUrl: 'https://www.garda.ie/en/crime/fraud/i-believe-i-am-the-victim-of-rental-fraud-what-do-i-do-.html',
  },
  {
    name: 'Irish Business Email Compromise / Invoice Redirect Fraud',
    slug: 'irish-business-email-compromise-invoice-redirect-fraud',
    description:
      'Fraudsters compromise or spoof a supplier\'s or executive\'s email account and send an Irish business an urgent request to pay a legitimate-looking invoice to a "new" bank account, or impersonate a CEO or CFO instructing an employee to bypass normal payment authorisation for an urgent transfer. The request typically lands after extensive reconnaissance — via LinkedIn, a company website, or a hacked mailbox — timed to look routine, and An Garda Síochána\'s Economic Crime Bureau has linked one international laundering operation, Operation Skein, to over €70 million moved through Irish accounts this way.',
    categorySlug: 'business-email-compromise',
    country: 'IE',
    alertLevel: 'critical',
    sources: ['An Garda Síochána'],
    sourceUrl: 'https://www.garda.ie/en/about-us/our-departments/office-of-corporate-communications/news-media/ceo-fraud_ie.pdf',
  },
  {
    name: 'Irish eFlow Motorway Toll Smishing Scam',
    slug: 'irish-eflow-toll-smishing-scam',
    description:
      'A text message impersonating eFlow, the operator of Ireland\'s M50 motorway toll, claims an unpaid toll or "radar ticket" and threatens vehicle registration or driving licence suspension unless it\'s paid immediately through a link. The link leads to a cloned site, often hosted on a suspicious domain, built to harvest full card payment details rather than process any real toll. The scam has recurred in escalating waves since 2023, with Transport Infrastructure Ireland taking down more than 70 fake eFlow websites at the height of one campaign and An Garda Síochána repeatedly warning the public to check any toll notice directly through eflow.ie rather than a link in a text.',
    categorySlug: 'government-impersonation',
    country: 'IE',
    alertLevel: 'medium',
    sources: ['CCPC (Competition and Consumer Protection Commission)', 'An Garda Síochána'],
    sourceUrl: 'https://www.ccpc.ie/manage-your-money/scams-and-frauds/common-scams/phishing',
  },
  {
    name: 'Texas Homestead Designation Fee Scam',
    slug: 'texas-homestead-designation-fee-scam',
    description:
      'Companies mail Texas homeowners official-looking letters offering to file a "Designation of Homestead" for a fee ranging from $35 to over $100, sometimes billed as a percentage of "recovered" savings. Homeowners often confuse this paid, unnecessary filing with the standard homestead tax exemption, which every Texas county appraisal district already files for free, and some who sign the solicitation\'s agreement and later refuse to pay have been threatened with or taken to small claims court.',
    categorySlug: 'tax-scams',
    alertLevel: 'medium',
    sources: ['Texas Attorney General', 'Harris County Appraisal District'],
    sourceUrl: 'https://www.texasattorneygeneral.gov/news/releases/ag-paxton-issues-consumer-alert-misleading-homestead-tax-exemption-offers',
  },
  {
    name: 'Post-Hurricane Storm-Chaser Contractor and Insurance Fraud',
    slug: 'post-hurricane-storm-chaser-contractor-fraud',
    description:
      'In the aftermath of a major hurricane, unlicensed door-to-door "contractors" and storm chasers target affected homeowners, offering to repair roofs, clear debris, or sell discounted building materials, often demanding full payment upfront in cash, doing shoddy or no work, and pressuring victims to sign incomplete contracts before an insurance adjuster has even inspected the damage. North Carolina\'s insurance commissioner issued a formal warning after Hurricane Helene urging residents to verify a contractor\'s license before paying anything and to avoid upfront cash payments entirely.',
    categorySlug: 'insurance-fraud',
    alertLevel: 'high',
    sources: ['North Carolina Department of Insurance'],
    sourceUrl: 'https://www.ncdoi.gov/news/press-releases/2024/10/03/aftermath-helene-commissioner-causey-cautions-public-be-lookout-scammers-and-storm-related-fraud',
  },
  {
    name: 'State Pension Direct-Deposit Redirection Fraud',
    slug: 'state-pension-direct-deposit-redirection-fraud',
    description:
      'Scammers targeting state pension-system retirees and beneficiaries submit falsified direct-deposit change requests, often by fax, to redirect a victim\'s monthly pension payment to a fraudulent account, sometimes following a spoofed robocall impersonating the retiree\'s bank. New Hampshire\'s retirement system caught and blocked a wave of these attempts before any funds were diverted, and the state\'s Department of Justice warned other retirees to verify any request to change pension payment banking details directly with the retirement system itself, never through a form or number provided in an unsolicited call or fax.',
    categorySlug: 'public-benefits-fraud',
    alertLevel: 'high',
    sources: ['New Hampshire Department of Justice'],
    sourceUrl: 'https://www.doj.nh.gov/news-and-media/consumer-alert-nh-state-retirees-warned-fraudulent-attempts-redirect-pension',
  },
  {
    name: 'Fake Amazon Quality Recall Refund Text',
    slug: 'fake-amazon-quality-recall-refund-text',
    description:
      'An unsolicited text claims Amazon\'s "routine quality inspection" found a recent purchase defective or recalled and offers a full refund with no return required — just a link to click. The link leads to a phishing page built to steal payment or account credentials rather than issue any refund, and the text is deliberately vague about which "item" is affected since the sender has no real order data and is targeting recipients at random, hoping some recently ordered something from Amazon.',
    categorySlug: 'online-shopping-scams',
    alertLevel: 'high',
    sources: ['Federal Trade Commission (FTC)'],
    sourceUrl: 'https://consumer.ftc.gov/consumer-alerts/2025/07/scammy-texts-offering-refunds-amazon-purchases',
  },
  {
    name: 'Cryptocurrency Kiosk QR-Code Redirect Scam',
    slug: 'cryptocurrency-kiosk-qr-code-redirect-scam',
    description:
      'Scammers impersonating a government agency, a bank, or tech support convince a victim — usually after inventing a "fraud alert" or an unpaid bill — that the only way to resolve the problem is to withdraw cash and feed it into a cryptocurrency ATM. The scammer sends a QR code by phone or text for the victim to scan at the kiosk, which routes the deposited cash directly into the scammer\'s wallet instead of any account belonging to the victim. The FBI logged more than 13,400 complaints and over $388 million in losses to this pattern in 2025 alone, a 58% year-over-year increase, with more than half the losses hitting victims over 50.',
    categorySlug: 'investment-fraud',
    alertLevel: 'critical',
    sources: ['FBI Internet Crime Complaint Center (IC3)'],
    sourceUrl: 'https://www.ic3.gov/PSA/2026/PSA260515-2',
  },
  {
    name: 'Crypto Investment Courier Cash-Pickup Scam',
    slug: 'crypto-investment-courier-cash-pickup-scam',
    description:
      'After luring a victim, often through a fake investment platform or a romance-app contact, into a bogus crypto trading app showing fabricated gains, scammers claim a bank has flagged the transfer or that taxes and fees must be paid in cash before any profit can be withdrawn. Instead of a wire transfer or a kiosk, the victim is told to withdraw cash and hand it in person to a courier who arrives with a "verification" code — after which fake balance updates keep the victim paying further rounds of fees in a repeating cycle. The FBI\'s June 2026 advisory on this pattern specifically flags senior citizens as the primary target.',
    categorySlug: 'investment-fraud',
    alertLevel: 'critical',
    sources: ['FBI Internet Crime Complaint Center (IC3)'],
    sourceUrl: 'https://www.ic3.gov/PSA/2026/PSA260615',
  },
  {
    name: 'NZ Police Impersonation Cryptocurrency Recovery Scam',
    slug: 'nz-police-impersonation-crypto-recovery-scam',
    description:
      'Scammers posing as New Zealand Police detectives contact people who own cryptocurrency, claiming their personal details or ID documents were "found on a person who has been arrested." After confirming the victim holds crypto, a second scammer posing as a cryptocurrency company representative takes over the call and convinces the victim to hand over their wallet password or seed phrase, often via a fake webpage made to look like a legitimate crypto platform. The scammers spoof real police phone numbers and email addresses to appear credible, and New Zealand Police say victims have lost millions of dollars collectively.',
    categorySlug: 'account-takeover',
    country: 'NZ',
    alertLevel: 'high',
    sources: ['New Zealand Police'],
    sourceUrl: 'https://www.police.govt.nz/news/release/police-warn-scammers-impersonating-nz-police-targeting-cryptocurrency-wallet-holders',
  },
  {
    name: 'NZ Immigration Visa Phone Scam',
    slug: 'nz-immigration-visa-phone-scam',
    description:
      'Callers falsely claiming to be from "The Immigration Bureau" or Immigration New Zealand tell recipients there\'s a serious problem with their visa and prompt them to press a number for English or Chinese service to be connected to an "operator," who then demands payment, requests passport or bank details, or threatens deportation if the target doesn\'t comply — using spoofed New Zealand mobile numbers to appear legitimate. Immigration New Zealand has confirmed it never contacts people by phone to request payment, and reaffirmed the warning as part of a joint "Fighting Visa Fraud" campaign with Australia, Canada, and the UK.',
    categorySlug: 'phishing',
    country: 'NZ',
    alertLevel: 'high',
    sources: ['Immigration New Zealand'],
    sourceUrl: 'https://www.immigration.govt.nz/about-us/news-centre/recent-immigration-phone-scams/',
  },
  {
    name: 'NZ WeChat Rental Bond Scam Targeting Overseas Renters',
    slug: 'nz-wechat-rental-bond-scam',
    description:
      'Scammers pose as landlords or real estate agents on WeChat, targeting people in China who are seeking rental accommodation in Auckland before they\'ve arrived in New Zealand. They send fake ID documents or tenancy paperwork to appear legitimate, get the victim to digitally sign a fraudulent tenancy agreement, and have them wire thousands of dollars to a New Zealand bank account to "secure" the property — often followed by further demands, claiming another tenant is interested or that furnishings need to be paid for. Victims typically only discover the fraud after arriving in New Zealand and finding the property already occupied by someone else, or that it doesn\'t exist at all.',
    categorySlug: 'online-shopping-scams',
    country: 'NZ',
    alertLevel: 'high',
    sources: ['New Zealand Police'],
    sourceUrl: 'https://www.police.govt.nz/news/release/rental-scammers-targeting-chinese-people-seeking-new-zealand-accommodation',
  },
  {
    name: 'Washington Secretary of State Fake Business-Filing Notice Scam',
    slug: 'washington-secretary-of-state-fake-filing-notice-scam',
    description:
      'Scammers mail Washington small-business owners letters designed to look like official Secretary of State notices, complete with the state seal, the business\'s real name, and its actual Unified Business Identifier number pulled from public records. The letters bill $200 or more for "required" filings that are either unnecessary or available directly from the state for far less, and threaten fines, penalties, or business dissolution for non-payment; investigators found a Sacramento, California return address and a QR code routing to a lookalike .org site rather than the real .gov domain.',
    categorySlug: 'government-impersonation',
    alertLevel: 'medium',
    sources: ['Washington State Attorney General'],
    sourceUrl: 'https://www.atg.wa.gov/news/news-releases/scam-alert-fraudulent-secretary-state-notices-targeting-washington-small',
  },
  {
    name: 'State Nursing Board License-Suspension Extortion Call',
    slug: 'state-nursing-board-license-suspension-extortion-call',
    description:
      'Callers impersonate a state Board of Nursing investigator, sometimes handing off to a second caller posing as an FBI agent, and tell a nurse her license has been suspended pending an investigation unless she immediately pays a "surety bond" — one documented Idaho case demanded $17,500 — falsely promised back later. The scammers use the target\'s real license number and address, pulled from public licensing records, to make the contact seem legitimate, and a companion mail scam sends fake official documents purportedly from the state board and the Department of Justice.',
    categorySlug: 'government-impersonation',
    alertLevel: 'high',
    sources: ['Idaho Attorney General', 'Idaho Board of Nursing'],
    sourceUrl: 'https://ibn.idaho.gov/pressrelease/consumer-alert-attorney-general-and-board-of-nursing-warn-of-scam-targeting-idaho-nurses/',
  },
  {
    name: 'Spoofed Public Utility Commission "Supplier Switch Cancellation Fee" Call',
    slug: 'spoofed-public-utility-commission-supplier-switch-fee-call',
    description:
      'Callers falsely claim to be from a state Public Utility Commission and tell the consumer their electric or gas utility reported a request to switch them to a different supplier, then demand an immediate "cancellation fee" over the phone to stop the switch and avoid service termination, sometimes falsely claiming to have a recording of the consumer authorizing it. The calls spoof the real PUC office phone number as caller ID, so returning the call appears to confirm legitimacy — Pennsylvania\'s PUC logged more than 70 consumer calls about this scam in a single day in March 2025 and stated it never calls consumers directly to demand payment or confirm supplier switches.',
    categorySlug: 'utility-scams',
    alertLevel: 'medium',
    sources: ['Pennsylvania Public Utility Commission'],
    sourceUrl: 'https://www.puc.pa.gov/press-release/2025/consumers-alert-utility-scam-calls-spoofing-puc-phone-number-03272025',
  },
  {
    name: 'Back-to-School "Federal Student Tax" IRS Impersonation Call',
    slug: 'back-to-school-federal-student-tax-irs-impersonation-call',
    description:
      'As the school year begins, callers impersonating the IRS, often with spoofed caller ID, tell students and their parents they owe a nonexistent "Federal Student Tax," demanding immediate payment by wire transfer or gift card and threatening arrest for non-payment. The IRS has issued repeated back-to-school-season warnings specifically about this scheme, which targets students at a time when many are newly managing their own finances and less familiar with how real IRS collection actually works — the agency never calls to demand immediate payment or threatens arrest over the phone.',
    categorySlug: 'tax-scams',
    alertLevel: 'high',
    sources: ['Internal Revenue Service (IRS)'],
    sourceUrl: 'https://www.irs.gov/newsroom/irs-warns-of-back-to-school-scams-encourages-students-parents-schools-to-stay-alert',
  },
  {
    name: 'Fake Salvation Army Bell Ringer / Stolen Red Kettle Scam',
    slug: 'fake-salvation-army-bell-ringer-scam',
    description:
      'During the winter holiday shopping season, imposters set up unauthorized or outright stolen red kettles outside stores, or pose as bell ringers without any actual affiliation, collecting cash donations that never reach the charity. Genuine bell ringers wear an official apron or badge and never take cash directly by hand, since donations go straight into a locked kettle; local Salvation Army chapters have issued public warnings after confirmed imposter sightings collecting cash at retail locations during the giving season.',
    categorySlug: 'charity-scams',
    alertLevel: 'low',
    sources: ['The Salvation Army'],
    sourceUrl: 'https://www.wmtv15news.com/2025/12/19/salvation-army-dane-county-warns-fake-red-kettle-bell-ringers-spotted-west-towne-mall/',
  },
  {
    name: 'Predatory Lowball Cash-for-Land Offers to Wildfire Survivors',
    slug: 'predatory-lowball-cash-for-land-wildfire-survivors',
    description:
      'In the weeks after a major wildfire, investors blitz displaced homeowners with unsolicited cash offers to buy their burned lots for a fraction of pre-fire value, pressuring them to sign before getting an appraisal or legal advice. After California\'s January 2025 Eaton and Palisades fires, corporate buyers made roughly half of all property sales in the hard-hit Altadena area within weeks of the disaster, prompting Governor Newsom to issue an executive order temporarily banning unsolicited undervalued purchase offers in affected ZIP codes while the state attorney general investigated.',
    categorySlug: 'mortgage-foreclosure-scams',
    alertLevel: 'high',
    sources: ['California Governor\'s Office'],
    sourceUrl: 'https://www.gov.ca.gov/2025/01/14/governor-newsom-issues-order-to-protect-fire-victims-from-predatory-real-estate-speculators/',
  },
  {
    name: 'French QR Code Parking Meter Scam (Quishing)',
    slug: 'french-qr-code-parking-meter-quishing-scam',
    description:
      'Fraudsters affix fake QR-code stickers directly onto legitimate parking meters or EV charging stations, inviting drivers to scan and pay for parking via smartphone. The QR code redirects to a convincing fake payment page that mimics the official parking operator\'s site, harvesting the victim\'s bank card details and CVV instead of actually processing a parking payment. Cybermalveillance.gouv.fr documented this as part of a broader "quishing" trend, logging over 1.2 million phishing reports in 2024, with several municipalities issuing local warnings after confirmed incidents.',
    categorySlug: 'phishing',
    country: 'FR',
    alertLevel: 'medium',
    sources: ['Cybermalveillance.gouv.fr'],
    sourceUrl: 'https://www.cybermalveillance.gouv.fr/tous-nos-contenus/actualites/quishing-hameconnage-qr-code',
  },
  {
    name: 'French Rental Listing Deposit Scam (Arnaque à la Location Immobilière)',
    slug: 'french-rental-listing-deposit-scam',
    description:
      'Scammers post attractive, below-market rental listings, often using stolen photos of real properties, on legitimate platforms such as SeLoger and PAP.fr, posing as owners who claim to be abroad or otherwise unavailable for an in-person visit. They pressure prospective tenants to urgently wire a deposit or first month\'s rent to "reserve" the unit before someone else supposedly takes it, then vanish once payment is sent. Cybermalveillance.gouv.fr publishes a dedicated advisory on rental-listing fraud, directing victims to file a report through the national Thésée police portal or SignalConso when a professional was involved.',
    categorySlug: 'online-shopping-scams',
    country: 'FR',
    alertLevel: 'high',
    sources: ['Cybermalveillance.gouv.fr'],
    sourceUrl: 'https://www.cybermalveillance.gouv.fr/tous-nos-contenus/fiches-reflexes/arnaques-location-immobiliere',
  },
  {
    name: 'French Crypto "Trading Robot" Pyramid Scam',
    slug: 'french-crypto-trading-robot-pyramid-scam',
    description:
      'Fraudulent platforms recruit French victims with promises of "automatic trading robots" delivering unrealistic guaranteed returns of 5-15% per month, sold via monthly or annual subscription fees of hundreds to thousands of euros, with all deposits and withdrawals required in cryptocurrency through unauthorized brokers. Victims are pushed to recruit new subscribers for tiered bonuses in a pyramid-style structure marketed around "financial freedom" and "passive income," spread through social media and in-person conference-style events. France\'s AMF has added dozens of new names to its unauthorized crypto-asset blacklist since the start of 2025 and separately warned of fake trading platforms promoted through cloned fake news sites impersonating well-known French outlets.',
    categorySlug: 'investment-fraud',
    country: 'FR',
    alertLevel: 'high',
    sources: ['AMF (Autorité des marchés financiers)'],
    sourceUrl: 'https://www.amf-france.org/en/news-publications/news-releases/amf-warns-public-about-fraudulent-investment-offers-through-trading-robots',
  },
  {
    name: 'Tennessee Workers\' Compensation Court Impersonation Scam',
    slug: 'tennessee-workers-compensation-court-impersonation-scam',
    description:
      'Scammers contact injured Tennessee workers by phone, text, email, or video call, falsely posing as a judge, attorney, or state employee from the Court of Workers\' Compensation Claims. Victims are told they owe a fee to "receive benefits" or finalize a settlement, sometimes after being lured into a staged fake online hearing, and are pressured to pay via gift cards, wire transfer, or cryptocurrency; the state\'s Bureau of Workers\' Compensation has confirmed the scam continues to specifically target Spanish-speaking claimants.',
    categorySlug: 'government-impersonation',
    alertLevel: 'high',
    sources: ['Tennessee Bureau of Workers\' Compensation'],
    sourceUrl: 'https://www.tn.gov/workforce/injuries-at-work/bwc-newsroom/2026/2/24/scam-alert--impersonators-targeting-workers--compensation-claimants.html',
  },
  {
    name: 'New York Gaming Commission Mega Millions Imposter Call',
    slug: 'new-york-gaming-commission-mega-millions-imposter-call',
    description:
      'A caller claiming to be a high-ranking Mega Millions official phones a victim to announce a large jackpot win, one documented case citing "$18.6 million and two Mercedes-Benz vehicles," but says taxes, processing, or claiming fees must be paid first before the prize can be released. The caller creates urgency by claiming the check or vehicle warranty will expire, demands payment via prepaid debit cards, gift cards, or wire transfer, and also harvests Social Security numbers and bank account details in the process — a live-call, name-harvesting escalation of the classic prize scam that prompted a formal alert from the New York State Gaming Commission.',
    categorySlug: 'lottery-sweepstakes-scams',
    alertLevel: 'high',
    sources: ['New York State Gaming Commission'],
    sourceUrl: 'https://gaming.ny.gov/news/consumer-alert-beware-mega-millions-imposter-scam',
  },
  {
    name: 'Illinois DMV Registration-Suspension Text Scam',
    slug: 'illinois-dmv-registration-suspension-text-scam',
    description:
      'Unsolicited texts impersonating the Illinois Secretary of State or DMV falsely warn that a recipient\'s vehicle registration or driver\'s license will be suspended unless they click a link or pay a fine by a fabricated enforcement deadline, citing invented regulations to create panic distinct from an ordinary unpaid-toll pretext. Secretary of State Alexi Giannoulias\'s office has issued repeated public warnings confirming it never sends such texts, and that the only legitimate SMS the office sends is an appointment reminder.',
    categorySlug: 'government-impersonation',
    alertLevel: 'medium',
    sources: ['Illinois Secretary of State'],
    sourceUrl: 'https://www.ilsos.gov/news/2026/march-22-2026-giannoulias-warns-public-about-fraudulent-dmv-text-scams.html',
  },
  {
    name: 'Gamified "Task Scam" Job App',
    slug: 'gamified-task-scam-job-app',
    description:
      'An unsolicited text or messaging-app offer promises easy money for simple tasks like liking videos or "boosting" products in an app that displays a fake, ever-rising earnings tally, sometimes even sending a small real payout of $5 to $20 early on to build trust. To unlock further tasks or withdraw the accumulated "earnings," the app tells victims to deposit their own money, usually in cryptocurrency, which simply disappears — the on-screen earnings were never real or payable to begin with. The FTC has reported these game-like online job scams surging from essentially zero reports in 2020 to roughly 20,000 in just the first half of 2024, with crypto losses to job scams reaching $41 million in that same period.',
    categorySlug: 'employment-scams',
    alertLevel: 'high',
    sources: ['Federal Trade Commission (FTC)'],
    sourceUrl: 'https://consumer.ftc.gov/consumer-alerts/2025/08/how-spot-avoid-task-scams',
  },
  {
    name: 'Zelle "Pay Yourself" Enrollment-Hijack Scam',
    slug: 'zelle-pay-yourself-enrollment-hijack-scam',
    description:
      'A scammer impersonating a bank\'s fraud department, often after a spoofed "did you attempt this transfer?" text, tells the victim a fraudulent charge is pending and instructs them to "send yourself money" on Zelle to reverse or secure it. In walking the victim through this, the scammer gets them to read back the one-time passcode the bank texted to enroll a new payee on the account — but that code actually links the scammer\'s own bank account to the victim\'s Zelle profile, so the "self" transfers that follow really route straight to the scammer. Zelle\'s own operator, Early Warning Services, published a dedicated warning after the pattern showed up repeatedly at member banks.',
    categorySlug: 'account-takeover',
    alertLevel: 'high',
    sources: ['Early Warning Services (Zelle)'],
    sourceUrl: 'https://www.zelle.com/how-to-spot-a-pay-yourself-scam',
  },
  {
    name: 'Bank-to-Fake-Law-Enforcement Handoff Account Takeover',
    slug: 'bank-to-fake-law-enforcement-handoff-account-takeover',
    description:
      'A caller poses as bank fraud-department staff about "suspicious activity" on an account, then transfers the victim to a second scammer posing as a police officer or federal agent who claims the victim\'s stolen identity was used to illegally purchase firearms — using that fear and false authority to extract login credentials and one-time MFA codes. The stolen credentials are used to lock the real account holder out and move funds into cryptocurrency-linked accounts to frustrate recovery; some versions use fake bank-login ads in search results to harvest the initial credentials before the calls even begin. The FBI\'s IC3 opened this as a newly tracked category in a November 2025 advisory after logging more than 5,100 complaints and over $262 million in losses since the start of that year.',
    categorySlug: 'account-takeover',
    alertLevel: 'critical',
    sources: ['FBI Internet Crime Complaint Center (IC3)'],
    sourceUrl: 'https://www.ic3.gov/PSA/2025/PSA251125',
  },
  {
    name: 'UK FCA "Data Breach" Impersonation Scam',
    slug: 'uk-fca-data-breach-impersonation-scam',
    description:
      'Fraudsters send texts, emails, calls, or WhatsApp messages impersonating the Financial Conduct Authority itself, commonly claiming a victim\'s details were found in a "fraud report" or exposed in a data breach, or that the FCA has recovered funds from an illegal crypto wallet in the victim\'s name. Victims are given a phone number to call, where they\'re asked for bank details, PINs, or passwords, or told to transfer money for "safekeeping" — the scam also specifically targets people who were already victims of a prior fraud or romance scam, with a false promise of helping recover what they lost. The FCA logged 4,465 reports and 480 victims in just the first half of 2025, nearly two-thirds of them aged 56 or older.',
    categorySlug: 'government-impersonation',
    country: 'GB',
    alertLevel: 'high',
    sources: ['Financial Conduct Authority (FCA)'],
    sourceUrl: 'https://www.fca.org.uk/news/press-releases/fake-fca-scams-reported-6-months-2025',
  },
  {
    name: 'UK Crypto "Safe Wallet" Police Impersonation Scam',
    slug: 'uk-crypto-safe-wallet-police-impersonation-scam',
    description:
      'A caller impersonating a police officer tells a cryptocurrency holder that a suspect has been arrested with their ID, or that stolen crypto details linked to them were found on a seized phone. A second call follows from someone posing as a representative of a crypto exchange, instructing the victim to move their holdings to a "safe wallet" or hand over their seed phrase "to protect it" — which instead drains the wallet to an address the criminals control. A UK gang was jailed in July 2026 for running exactly this scheme through fake police-branded websites, netting more than £4 million from eight victims.',
    categorySlug: 'account-takeover',
    country: 'GB',
    alertLevel: 'critical',
    sources: ['Regional Organised Crime Unit (ROCU)', 'Metropolitan Police'],
    sourceUrl: 'https://www.rocu.police.uk/news/2026/march/cryptocurrency-holders-warned-after-scam-phone-calls-across-eastern-region/',
  },
  {
    name: 'UK "Hi Mum, Hi Dad" WhatsApp Family Impersonation Scam',
    slug: 'uk-hi-mum-hi-dad-whatsapp-scam',
    description:
      'A scammer messages a parent on WhatsApp or SMS from an unknown number, opening with "Hi Mum" or "Hi Dad" and claiming to be their child texting from a new phone after losing or damaging the old one. After some rapport-building conversation, they ask for urgent money, typically to replace the phone or pay a bill, providing bank details for a "temporary" account and sometimes following up with further requests. Action Fraud logged 1,235 reports and over £1.5 million in losses in just a few months when the pattern first spread nationally, and more recent versions add AI-generated voice notes cloned from the real relative\'s voice pulled from social media clips.',
    categorySlug: 'family-emergency-scams',
    country: 'GB',
    alertLevel: 'medium',
    sources: ['Action Fraud (UK)'],
    sourceUrl: 'https://www.actionfraud.police.uk/alert/friendinneed',
  },
];

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

  for (const scam of SEED_SCAMS) {
    await pool.query(
      `INSERT INTO scams (name, slug, description, category_id, alert_level, is_active, sources, source_url, country, is_historical, first_recorded)
       VALUES ($1, $2, $3, (SELECT id FROM categories WHERE slug = $4), $5, true, $6, $7, $8, $9, $10)
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
         updated_at = NOW()`,
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
      ]
    );
  }
  console.log(`seed: upserted ${SEED_SCAMS.length} scams`);
}

interface SeedGlobalSource {
  agency_name: string;
  country: string;
  country_name: string;
  url: string;
  description: string;
  data_type: 'annual_report' | 'open_dataset' | 'public_stats';
}

// The major national fraud-reporting bodies that publish something the
// public can actually read. Deliberately no seeded `global_stats` rows —
// no unverified number gets shown to a user. An admin adds a stat only
// after checking it against the agency's own report (see the admin panel's
// Global Sources section); until then, the page shows an honest "no
// verified figures yet" state per source, same principle as Trend Watch's
// low-data handling.
const SEED_GLOBAL_SOURCES: SeedGlobalSource[] = [
  {
    agency_name: 'Federal Trade Commission — Consumer Sentinel Network',
    country: 'US',
    country_name: 'United States',
    url: 'https://www.ftc.gov/exploredata',
    description:
      'The FTC collects millions of consumer fraud, identity theft, and do-not-call complaints. The raw complaint database is restricted to law enforcement, but the FTC publishes aggregate figures and visualizations (by category, state, and year) publicly.',
    data_type: 'public_stats',
  },
  {
    agency_name: 'FBI Internet Crime Complaint Center (IC3)',
    country: 'US',
    country_name: 'United States',
    url: 'https://www.ic3.gov/',
    description:
      'The FBI\'s central hub for reporting cyber-enabled crime. Publishes an annual report aggregating and analyzing complaint data to identify internet crime trends; does not offer a public API or raw dataset.',
    data_type: 'annual_report',
  },
  {
    agency_name: 'National Anti-Scam Centre / Scamwatch (ACCC)',
    country: 'AU',
    country_name: 'Australia',
    url: 'https://www.scamwatch.gov.au/research-and-resources/targeting-scams-report',
    description:
      'The Australian Competition and Consumer Commission runs Scamwatch and publishes an annual "Targeting Scams" report combining data from Scamwatch, ReportCyber, the Australian Financial Crimes Exchange, IDCARE, and ASIC.',
    data_type: 'annual_report',
  },
  {
    agency_name: 'Canadian Anti-Fraud Centre',
    country: 'CA',
    country_name: 'Canada',
    url: 'https://open.canada.ca/data/en/dataset/6a09c998-cddb-4a22-beff-4dca67ab892f',
    description:
      'A joint RCMP/OPP/Competition Bureau centre that collects fraud reports from the Canadian public. Its Fraud Reporting System dataset is published on Canada\'s Open Government Portal and updated quarterly — the most genuinely open, machine-readable source found so far.',
    data_type: 'open_dataset',
  },
  {
    agency_name: 'Report Fraud (formerly Action Fraud)',
    country: 'GB',
    country_name: 'United Kingdom',
    url: 'https://www.reportfraud.police.uk/',
    description:
      "The UK's national fraud and cybercrime reporting service, run by the City of London Police. Replaced Action Fraud on December 4, 2025 (full public launch January 2026); case data now feeds Report Fraud Analysis Services, formerly the National Fraud Intelligence Bureau.",
    data_type: 'public_stats',
  },
  {
    agency_name: 'National Cyber Security Centre (NCSC) — formerly CERT NZ',
    country: 'NZ',
    country_name: 'New Zealand',
    url: 'https://www.ncsc.govt.nz/insights-and-research/insights-reports/',
    description:
      "New Zealand's government cyber security response agency. CERT NZ was fully merged into the NCSC and its standalone brand retired; the combined agency publishes quarterly \"Cyber Security Insights\" reports covering reported scam, phishing, and fraud activity. Scam reports for the public also route through the non-profit Netsafe.",
    data_type: 'public_stats',
  },
  {
    agency_name: 'Competition and Consumer Protection Commission (CCPC)',
    country: 'IE',
    country_name: 'Ireland',
    url: 'https://www.ccpc.ie/consumers/money/scams/',
    description:
      "Ireland's statutory consumer protection body. Publishes scam awareness case studies and helpline-based figures; it doesn't run a national crime-reporting system itself and directs fraud victims to also report to An Garda Síochána, the national police.",
    data_type: 'public_stats',
  },
  {
    agency_name: 'An Garda Síochána',
    country: 'IE',
    country_name: 'Ireland',
    url: 'https://www.garda.ie/en/information-centre/statistics/',
    description:
      "Ireland's national police service. Publishes provisional crime statistics, including recorded fraud offences, on a half-yearly and year-end basis — the actual source of Ireland's national fraud figures that CCPC directs victims toward.",
    data_type: 'public_stats',
  },
  {
    agency_name: 'Singapore Police Force — ScamShield',
    country: 'SG',
    country_name: 'Singapore',
    url: 'https://www.scamshield.gov.sg/',
    description:
      'A joint Singapore government initiative (Police Force, Ministry of Home Affairs, and GovTech) pairing a scam-detection app with public reporting tools. The Police publish detailed Annual and Mid-Year Scam and Cybercrime Briefs with category-level figures.',
    data_type: 'annual_report',
  },
  {
    agency_name: 'BSI (Federal Office for Information Security)',
    country: 'DE',
    country_name: 'Germany',
    url: 'https://www.bsi.bund.de/EN/Themen/Verbraucherinnen-und-Verbraucher/Cyber-Sicherheitslage/Methoden-der-Cyber-Kriminalitaet/methoden-der-cyber-kriminalitaet_node.html',
    description:
      "Germany's federal cyber security agency. Publishes public guidance on cybercrime methods and threat trends; individual fraud reports go to local police (Polizei) or the Federal Criminal Police Office (BKA), which BSI works alongside rather than replaces.",
    data_type: 'public_stats',
  },
  {
    agency_name: 'Bundeskriminalamt (BKA) — Cybercrime Bundeslagebild',
    country: 'DE',
    country_name: 'Germany',
    url: 'https://www.bka.de/DE/AktuelleInformationen/StatistikenLagebilder/Lagebilder/Cybercrime/cybercrime_node.html',
    description:
      "Germany's Federal Criminal Police Office. Publishes an annual \"Bundeslagebild Cybercrime\" report with nationwide case counts and financial-damage figures for cybercrime, including fraud committed online — the closest German equivalent to the FTC/IC3-style report-and-loss data.",
    data_type: 'annual_report',
  },
  {
    agency_name: 'National Consumer Affairs Center of Japan (NCAC)',
    country: 'JP',
    country_name: 'Japan',
    url: 'https://www.kokusen.go.jp/',
    description:
      "Japan's national consumer affairs body, reachable via the nationwide #188 hotline that routes callers to their local consumer center. Cyber-specific fraud is separately handled by the National Police Agency and the Japan Cybercrime Control Center (JC3).",
    data_type: 'public_stats',
  },
  {
    agency_name: 'National Police Agency (Japan)',
    country: 'JP',
    country_name: 'Japan',
    url: 'https://www.npa.go.jp/bureau/safetylife/sos47/circumstances/statistics/',
    description:
      'Japan\'s national police agency. Publishes annual and half-yearly statistics on "tokushu sagi" (specified/organized fraud) — the umbrella category covering fake-police calls, family-emergency impersonation, and refund scams — the actual source of Japan\'s national fraud case counts and damage figures that NCAC does not itself track.',
    data_type: 'public_stats',
  },
  {
    agency_name: 'Fraudehelpdesk (Dutch National Anti-Fraud Hotline)',
    country: 'NL',
    country_name: 'Netherlands',
    url: 'https://www.fraudehelpdesk.nl/',
    description:
      "The Netherlands' national fraud hotline, listed as the government's designated fraud contact point on Rijksoverheid.nl. It has no investigative power itself — it logs reports to build a national fraud picture and refers victims to the appropriate authority (usually the police).",
    data_type: 'public_stats',
  },
  {
    agency_name: 'National Cyber Crime Reporting Portal (NCRP)',
    country: 'IN',
    country_name: 'India',
    url: 'https://cybercrime.gov.in/',
    description:
      "India's official cybercrime and financial-fraud reporting portal, run by the Ministry of Home Affairs' Indian Cyber Crime Coordination Centre (I4C), backed by the toll-free 1930 helpline dedicated to reporting financial fraud.",
    data_type: 'public_stats',
  },
  {
    agency_name: 'Service statistique ministériel de la sécurité intérieure (SSMSI)',
    country: 'FR',
    country_name: 'France',
    url: 'https://www.interieur.gouv.fr/ssmsi',
    description:
      "France's Interior Ministry statistical service. Publishes the annual \"Insécurité et délinquance\" report and tracks digital-crime trends, including complaints filed through Thésée, the ministry's official online scam-reporting platform.",
    data_type: 'annual_report',
  },
  {
    agency_name: 'Brottsförebyggande rådet (Brå)',
    country: 'SE',
    country_name: 'Sweden',
    url: 'https://bra.se/statistik/statistik-om-rattsvasendet/anmalda-brott',
    description:
      "Sweden's National Council for Crime Prevention. Publishes the annual \"Anmälda brott\" (reported crimes) statistics, including the bedrägeribrott (fraud crime) category, plus periodic reports estimating criminal proceeds from completed fraud.",
    data_type: 'annual_report',
  },
];

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

async function main() {
  await seedArticles(NOTORIOUS_ARTICLES, 'notorious');
  await seedArticles(GUIDE_ARTICLES, 'guide');
  await seedCategoriesAndScams();
  await seedGlobalSources();
  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
