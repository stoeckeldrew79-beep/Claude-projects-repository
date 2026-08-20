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
}

const NOTORIOUS_ARTICLES: SeedArticle[] = [
  {
    title: 'Charles Ponzi: The Man Who Gave Fraud Its Name',
    slug: 'charles-ponzi-the-original-scheme',
    author: 'ScamShield Editorial',
    tags: ['notorious', 'notorious-scammer', 'historical'],
    body: `In 1920, a Boston businessman named Charles Ponzi promised investors he could double their money in 90 days. His pitch had a real financial instrument behind it: international postal reply coupons, which could in theory be bought cheaply in one country and redeemed for stamps worth more in another. The arbitrage was real. The scale Ponzi claimed to be running it at was not.

Ponzi's company, the Securities Exchange Company, took in roughly $250,000 a day at its peak — the equivalent of millions today. Early investors were paid extravagant returns, not from postal-coupon profits, but from the cash brought in by new investors. Word spread, lines formed outside his Boston office, and for a few months Charles Ponzi was one of the most talked-about men in America.

The scheme required an ever-growing stream of new money to pay off earlier investors, and it collapsed the moment that stream slowed. A Boston Post investigation in the summer of 1920 found there weren't nearly enough postal reply coupons in circulation worldwide to support Ponzi's claimed returns. He was arrested that August, pled guilty to mail fraud, and served time in both state and federal prison. He was later deported to Italy and died in poverty in Rio de Janeiro in 1949.

Ponzi didn't invent the pay-earlier-investors-with-later-investors' -money structure — versions of it predate him by decades — but his scheme was so large and so public that his name became the permanent label for it. Every "Ponzi scheme" since, including Bernie Madoff's, is named after him.`,
  },
  {
    title: 'Bernie Madoff and the $65 Billion Lie',
    slug: 'bernie-madoff-largest-ponzi-scheme',
    author: 'ScamShield Editorial',
    tags: ['notorious', 'notorious-scammer', 'historical'],
    body: `Bernard Madoff spent decades as a respected figure on Wall Street — a former chairman of the NASDAQ stock exchange — running an investment advisory business that quietly became the largest Ponzi scheme in history. For at least 17 years, and likely longer, Madoff paid "returns" to investors using money from new investors, while producing no real trading activity behind the numbers on their statements.

What made Madoff's fraud unusual wasn't dramatic promises of overnight riches — his reported returns were steady and unspectacular, often around 10-12% a year, which was precisely what made them look credible. Feeder funds funneled money to him from pension funds, charities, universities, and wealthy individuals who trusted his reputation and his consistency. Financial analyst Harry Markopolos spent nearly a decade trying to warn the SEC that Madoff's numbers were mathematically impossible to achieve legitimately. He was largely ignored.

The scheme finally collapsed in December 2008, when the financial crisis drove a wave of investors to request withdrawals Madoff could no longer cover. He confessed to his sons that the business was "one big lie," and one of them reported him to federal authorities the next day. Madoff pled guilty in March 2009 to 11 felony counts and was sentenced to 150 years in federal prison. Total paper losses to investors were estimated at roughly $65 billion, though actual cash losses were lower — a distinction that still matters in how the fraud is measured. Madoff died in prison in April 2021.

The Madoff case remains a reference point for how long a fraud can survive when it produces boring, believable numbers instead of outlandish ones, and when the people positioned to catch it don't act on the warnings they're given.`,
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
  },
  {
    title: 'Frank Abagnale: The Con Man Who May Have Conned the Story Itself',
    slug: 'frank-abagnale-catch-me-if-you-can-fact-check',
    author: 'ScamShield Editorial',
    tags: ['notorious', 'notorious-scammer', 'historical'],
    body: `Frank Abagnale's own account, told in his 1980 memoir "Catch Me If You Can" and popularized by the 2002 film of the same name, is one of the most famous con-artist stories of the 20th century: a teenager in the 1960s who allegedly impersonated an airline pilot, a doctor, and a lawyer, forged roughly $2.5 million in fraudulent checks across 26 countries, and escaped custody multiple times before eventually being caught and later hired by the FBI to teach fraud prevention.

Abagnale did serve prison time for check fraud, and he has spent decades since as a paid speaker and consultant on financial fraud, including — by his account — work with the FBI. That much is a matter of record.

Much of the rest has not held up well. Investigative journalism, most notably a 2020 book by journalist Alan C. Logan, cross-referenced Abagnale's claims against court records, prison logs, and contemporaneous news coverage, and found large parts of the story — the scale of the forged checks, the impersonations, the dramatic escapes — could not be corroborated, and in several cases were directly contradicted by the documented record. Abagnale has continued to stand by his account.

The reason this belongs on a list of notorious scams isn't the alleged teenage check fraud itself. It's what the gap between the legend and the documented record demonstrates: a good enough story, repeated confidently and often enough, can outrun the fact-checking, get made into a Steven Spielberg film, and become the "true story" cited in fraud-prevention trainings for decades — evidence, ironically, that the same instinct to trust a compelling narrative over verification is exactly what every scam on this site relies on.`,
  },
  {
    title: "Anna Sorokin: The Fake Heiress Who Fooled New York",
    slug: 'anna-sorokin-anna-delvey-fake-heiress',
    author: 'ScamShield Editorial',
    tags: ['notorious', 'notorious-scammer'],
    body: `Between 2013 and 2017, a young woman calling herself "Anna Delvey" moved through New York's social scene claiming to be a wealthy German heiress about to inherit a multimillion-dollar trust fund, planning to open an exclusive private arts club. She stayed in luxury hotels, dined at expensive restaurants, tipped generously, and befriended people with real money and real social standing — all while her actual funds were, at best, a fraction of what she projected.

Her real name was Anna Sorokin, a Russian-born German citizen without the fortune she claimed. She funded her lifestyle through a mix of unpaid hotel bills, bounced checks, and — most damagingly for the friends who trusted her — talking acquaintances into fronting large expenses on the promise of prompt reimbursement that never fully materialized, including one widely reported case involving a $62,000 luxury vacation bill. Banks that extended her credit based on fabricated financial documents lost money directly.

Sorokin was arrested in 2017 and convicted in 2019 on multiple counts of grand larceny and theft of services, amounting to roughly $275,000 defrauded from banks, hotels, and individuals. She was sentenced to four to twelve years in prison, later released on parole, and subsequently detained by immigration authorities over her visa status. Her story became the basis for the Netflix series "Inventing Anna."

What made the con work wasn't a fake ID or a forged document — those came later, when they were needed for specific transactions. It was pure social engineering: a confident performance of wealth, sustained long enough and in front of the right people, that made almost everyone around her assume someone else had already verified she was who she said she was.`,
  },
  {
    title: 'Elizabeth Holmes and the Blood Test That Never Worked',
    slug: 'elizabeth-holmes-theranos-fraud',
    author: 'ScamShield Editorial',
    tags: ['notorious', 'notorious-scammer'],
    body: `Elizabeth Holmes founded Theranos in 2003 at age 19, dropping out of Stanford with a pitch that sounded like a genuine medical breakthrough: a device that could run hundreds of lab tests from a single finger-prick of blood, cheaper and faster than a traditional venous draw. By 2014, Theranos was valued at roughly $9 billion, Holmes was profiled as the youngest self-made female billionaire in the country, and her board included former Secretaries of State and Defense.

The technology described to investors, partners, and the public never actually worked as claimed. Internally, Theranos ran the large majority of patient tests on modified, repurposed machines from other manufacturers — sometimes diluting blood samples to make them compatible — while publicly presenting the results as coming from its own proprietary "Edison" devices. A 2015 Wall Street Journal investigation by reporter John Carreyrou was the first to expose the gap between what Theranos claimed and what was actually happening inside its labs.

Holmes and Theranos president Ramesh "Sunny" Balwani were indicted for wire fraud in 2018. Holmes was convicted in January 2022 on charges of defrauding investors — she was acquitted on charges tied to defrauding patients directly — and sentenced to just over 11 years. In early 2026, a federal judge trimmed roughly a year off her sentence after applying a retroactive guideline reduction for certain first-time nonviolent offenders; an appeals court had already upheld her underlying conviction. She remains in federal prison in Texas.

Theranos is a useful case precisely because there was no fake voice on the phone or forged check — just a confident, well-credentialed performance, backed by famous names on the board and years of flattering press coverage, that discouraged the basic due diligence that would have caught it. It took an outside reporter actually checking, rather than trusting the reputation, to unravel it.`,
  },
  {
    title: 'Sam Bankman-Fried and the $8 Billion Hole in FTX',
    slug: 'sam-bankman-fried-ftx-collapse',
    author: 'ScamShield Editorial',
    tags: ['notorious', 'notorious-scammer'],
    body: `Sam Bankman-Fried founded the cryptocurrency exchange FTX in 2019, and within a few years built it into one of the largest exchanges in the world — and himself into a media fixture, testifying before Congress, donating heavily to political campaigns, and drawing comparisons to Warren Buffett, all while FTX ran Super Bowl ads and his paper net worth was estimated in the billions.

Behind the scenes, FTX customer deposits — money users believed was simply sitting in their exchange accounts — were secretly funneled to Alameda Research, a sister trading firm Bankman-Fried also controlled, through a backdoor that let Alameda draw on customer funds without the collateral any other user would have needed. When a November 2022 report questioning Alameda's finances triggered a wave of customer withdrawals, FTX couldn't cover them. The exchange collapsed within days, revealing a shortfall of roughly $8 billion.

Bankman-Fried was arrested in the Bahamas in December 2022, extradited to the United States, and convicted in November 2023 on seven counts of fraud and conspiracy. He was sentenced in March 2024 to 25 years in prison. He appealed both the conviction and the sentence; in June 2026, the Second Circuit Court of Appeals unanimously rejected the appeal, leaving the 25-year sentence in place with a projected release date in 2044. A request for a presidential pardon has so far been denied.

FTX is a reminder that celebrity endorsements, slick marketing, and even testimony before Congress describe how a company presents itself, not what its books actually say — and that the same "everything's moving fast, no time to double-check" pressure that makes an individual scam work can operate at the scale of a multibillion-dollar company.`,
  },
  {
    title: "Jordan Belfort, the \"Wolf of Wall Street,\" and the Victims Still Waiting to Be Paid",
    slug: 'jordan-belfort-stratton-oakmont-wolf-of-wall-street',
    author: 'ScamShield Editorial',
    tags: ['notorious', 'notorious-scammer', 'historical'],
    body: `Through the late 1980s and 1990s, Jordan Belfort ran Stratton Oakmont, a Long Island brokerage built around a classic "pump and dump" scheme: brokers aggressively cold-called investors to buy shares in small, often nearly worthless companies that Stratton Oakmont itself secretly controlled large blocks of. The buying pressure artificially inflated ("pumped") the share price, at which point insiders sold ("dumped") their own shares at the inflated price — leaving ordinary investors holding stock that collapsed once the manufactured demand stopped.

Over roughly a decade, the scheme took in an estimated $200 million from more than 1,500 victims. Belfort also built a notorious corporate culture around the firm, later recounted in his own memoir and dramatized — critics say glamorized — in the 2013 film "The Wolf of Wall Street."

Belfort pleaded guilty in 1999 to securities fraud and money laundering, cooperated with prosecutors against former colleagues, and was sentenced in 2003 to four years in prison, of which he served 22 months, along with $110.4 million in court-ordered restitution to his victims. More than two decades later, court filings show he has repaid only a small fraction of that — roughly $12.8 million as of recent filings — while earning a living as a paid motivational speaker largely built on retelling the very story that created the debt he still owes.

The gap between what Belfort owes and what he's actually paid is worth knowing on its own: it's a straightforward fact-check against the swagger of the "Wolf of Wall Street" mythology, and a reminder that a compelling redemption story and an unpaid restitution order can coexist for decades.`,
  },
  {
    title: "Allen Stanford's $7 Billion Offshore Ponzi Scheme",
    slug: 'allen-stanford-stanford-financial-ponzi-scheme',
    author: 'ScamShield Editorial',
    tags: ['notorious', 'notorious-scammer', 'historical'],
    body: `Robert Allen Stanford built Stanford Financial Group into a network of investment firms centered on Stanford International Bank, an offshore bank he ran out of Antigua and Barbuda, where his wealth and political influence earned him an honorary knighthood. Over roughly two decades, the bank sold certificates of deposit promising unusually high, steady returns, eventually reaching somewhere between 18,000 and 30,000 investors in more than 100 countries.

Those CDs weren't backed by the safe, liquid, diversified portfolio Stanford's marketing claimed. Instead, billions of dollars in depositor money went into his own speculative real estate deals, private businesses, and personal spending — including sponsoring a high-profile international cricket tournament — all while investors received audited-looking statements describing a conservative investment portfolio that didn't actually exist as described.

The scheme collapsed in February 2009, just weeks after the Madoff scandal broke, when the SEC filed civil fraud charges and froze Stanford's assets. He was convicted in March 2012 on 13 of 14 counts and sentenced to 110 years in federal prison. At roughly $7 billion, it remains the second-largest Ponzi scheme in U.S. history, after Madoff's.

That Stanford's fraud surfaced within weeks of Madoff's isn't entirely a coincidence: discovery often comes in waves. Once regulators, journalists, and the public are primed to look for one kind of fraud, others hiding nearby tend to surface soon after — which is part of why sustained, boring vigilance matters more than reacting only after the last big scandal.`,
  },
  {
    title: 'Billy McFarland: From Fyre Festival to Fyre Festival II',
    slug: 'billy-mcfarland-fyre-festival',
    author: 'ScamShield Editorial',
    tags: ['notorious', 'notorious-scammer'],
    body: `In 2017, Billy McFarland and rapper Ja Rule marketed the "Fyre Festival" as a luxury music festival on a private Bahamian island, using a viral, influencer-driven campaign — models and celebrities all posting an identical orange square — to sell tickets ranging from hundreds of dollars to over $100,000, promising gourmet catering, luxury villas, and major musical acts.

Attendees who actually showed up found disaster-relief tents instead of villas, prepackaged sandwiches instead of gourmet catering, no real performances, and no functioning way to leave the island. It later emerged that McFarland had misrepresented the festival's finances to investors and vendors throughout the planning process, including fabricated documents used to raise around $26 million.

McFarland pleaded guilty to wire fraud in 2018, was sentenced to six years in federal prison, and forfeited $26 million. He was released in March 2022 after serving less than four years. In 2025, he announced "Fyre Festival II," selling tickets for as much as $1.1 million each — reporting subsequently uncovered multiple irregularities with the new event, and it was postponed indefinitely.

McFarland is unusual on this list for trying the same playbook twice, in public, after already serving prison time for the first version. That he could still sell tickets at all is a reminder that reputational damage alone doesn't reliably stop a repeat offender — and that trusting a slick campaign and social proof over independent verification is exactly the weak point that failed the first time.`,
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
  },
  {
    title: 'Lou Pearlman: The Boy Band Mogul Running a $300 Million Ponzi Scheme',
    slug: 'lou-pearlman-boy-band-ponzi-scheme',
    author: 'ScamShield Editorial',
    tags: ['notorious', 'notorious-scammer'],
    body: `Lou Pearlman built and managed some of the biggest boy bands of the 1990s and 2000s, including the Backstreet Boys and *NSYNC, becoming one of the most powerful figures in pop music. Alongside his entertainment business, he ran investment programs — including an "Employee Investment Savings Account" and an airline-leasing venture — that promised safe, above-market returns.

Those investment programs were fictitious. For roughly 15 years, Pearlman used fabricated financial statements, a fake accounting firm, and even a fake bank to convince nearly 1,700 investors, many of them elderly Florida retirees, to hand over a combined $300 million or more, paying "returns" to earlier investors using money from new ones in a classic Ponzi structure.

The scheme unraveled in 2006 amid state and federal investigations, and Pearlman fled the country, eventually arrested in Bali, Indonesia, in 2007. He was extradited, pleaded guilty to conspiracy and money laundering charges, and was sentenced in 2008 to 25 years in prison, with a provision letting him shave time off his sentence for every million dollars he helped recover for victims. He died of cardiac arrest in prison in 2016, having served eight years of the sentence.

Pearlman's case shows how a fraud can hide behind a legitimate, glamorous business for years — investors who might never have handed a stranger $300 million trusted the man who discovered the Backstreet Boys, right up until the "bank" statements he was sending them turned out to describe an institution that didn't exist.`,
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
    body: `The phone rings and a young voice says "Grandma?" or "Grandpa, it's me" — often crying or sounding distressed, sometimes with static or a bad connection making the voice harder to place with certainty. Before the target can ask many questions, the caller (or someone who takes over the call claiming to be a lawyer, bail bondsman, or police officer) explains there's been an accident, an arrest, or some other emergency, and money is urgently needed — often via wire transfer, gift cards, or a cash pickup — and pleads not to tell the parents because it would mean trouble.

The scam relies on emotional urgency overriding the instinct to verify: it's specifically designed to be resolved before there's time to think it through or call another family member to check. Some versions now use AI voice-cloning from a few seconds of audio scraped from social media to make the "grandchild's" voice sound more convincing, though the low-tech version — just guessing at a generic emotional tone — still works often enough that scammers keep using it.

The defense is a simple habit: agree in advance with family members on a code word, or simply commit to always hanging up and calling the grandchild (or their parents) back on a known number before sending anything, no matter how urgent the call sounds or how much the caller pressures against it. A real emergency will still be real five minutes later, after you've verified it.`,
  },
  {
    title: '"Pig Butchering": Inside the Long-Con Crypto Investment Scam',
    slug: 'pig-butchering-crypto-investment-scam',
    author: 'ScamShield Editorial',
    tags: ['guide', 'investment-fraud'],
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
    body: `A text arrives claiming to be from USPS, FedEx, UPS, or a similar carrier: a package couldn't be delivered, or a small customs/redelivery fee is due, with a link to resolve it. The timing is what makes it effective — sent broadly enough that a meaningful share of recipients actually are expecting a delivery, at which point the message feels routine rather than suspicious.

The link leads to a fake payment page designed to harvest credit card details, and sometimes additional personal information under the guise of "verifying your identity" for the redelivery. No major carrier requests payment via a text link for standard delivery or redelivery — legitimate delivery issues are handled through the carrier's own app or website, entered directly, not through a link in an unsolicited text.

If you get one of these texts: don't click the link. If you want to check on an actual package, open the carrier's official app or type their website address in directly and track the shipment using your real tracking number. Report the text as spam, and if you entered any information on the fake page, contact your bank about your card and monitor your statements closely.`,
  },
  {
    title: 'Job Offer Scams: Fake Remote Work and the Overpayment Check',
    slug: 'job-offer-scam-overpayment-check',
    author: 'ScamShield Editorial',
    tags: ['guide', 'employment-fraud'],
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
    body: `In the days after a major hurricane, earthquake, wildfire, or other widely covered disaster, solicitations spike — texts, social media posts, and phone calls asking for donations to help victims, often using real news photos and genuine-sounding organization names that are close enough to well-known charities to avoid a second look. Some fraudulent "charities" are set up specifically in the window after a disaster and disappear once donations stop.

The urgency of a real tragedy is exactly what makes people skip the verification they'd normally do — nobody wants to interrogate a stranger raising money for earthquake victims, which is precisely the reaction the scam depends on.

Before donating: look up the organization independently rather than through a link in the solicitation, and check its standing on an independent charity evaluator (such as Charity Navigator or the BBB Wise Giving Alliance) rather than trusting the name alone, since scam charities frequently pick names one word off from a real, well-known organization. Be especially cautious of any solicitation asking for payment via gift card, cryptocurrency, or wire transfer — legitimate charities overwhelmingly accept standard payment methods that offer some fraud protection, like a credit card through their verified website.`,
  },
];

async function seedArticles(articles: SeedArticle[], label: string) {
  for (const article of articles) {
    await pool.query(
      `INSERT INTO articles (title, slug, body, author, tags, published, published_at)
       VALUES ($1, $2, $3, $4, $5, true, NOW())
       ON CONFLICT (slug) DO NOTHING`,
      [article.title, article.slug, article.body, article.author, article.tags]
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
  { name: 'Mortgage & Foreclosure Scams', slug: 'mortgage-foreclosure-scams', description: 'Fraudulent loan modification, foreclosure rescue, or title schemes targeting homeowners.' },
  { name: 'Tax Scams', slug: 'tax-scams', description: 'Fake IRS or tax-authority communications and fraudulent tax-preparation schemes.' },
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
  },
  {
    name: 'Fake DocuSign Signature Request',
    slug: 'docusign-phishing-email',
    description:
      'An email impersonating DocuSign asks you to review and sign a document, linking to a fake sign-in page designed to steal your email credentials. These are frequently sent to employees at a company, since a "document needs signature" request rarely raises suspicion in an office setting. Verify unexpected signature requests directly with the sender through a separate channel before clicking through.',
    categorySlug: 'phishing',
    alertLevel: 'medium',
    sources: ['FBI IC3'],
  },
  {
    name: 'Military Deployment Romance Scam',
    slug: 'military-deployment-romance-scam',
    description:
      'A scammer builds an online relationship using a profile claiming to be a U.S. service member deployed overseas, using a stolen photo of a real service member. The deployment cover story explains away video calls, unusual phone numbers, and delays, while building toward requests for money for things like leave approval, communication fees, or a flight home. The Department of Defense does not charge service members for leave or communication.',
    categorySlug: 'romance-scams',
    alertLevel: 'high',
    sources: ['FTC Consumer Advice', 'DoD Cyber Crime Center'],
  },
  {
    name: 'Widowed-Profile Romance Scam',
    slug: 'widowed-profile-romance-scam',
    description:
      'A dating profile presents as a recently widowed professional, often claiming international work (engineering, medicine, or business abroad) that explains why an in-person meeting keeps falling through. The "widowed" framing is used deliberately to build fast emotional trust and to explain financial hardship later in the conversation. Any request for money from someone you have not met in person is a reason to stop and verify, regardless of how long you have been talking.',
    categorySlug: 'romance-scams',
    alertLevel: 'high',
    sources: ['FTC Consumer Advice'],
  },
  {
    name: 'Fake Microsoft Security Pop-Up',
    slug: 'fake-microsoft-security-popup',
    description:
      'A browser pop-up styled to look like a Windows system alert claims your computer is infected and displays a phone number for "Microsoft support," sometimes locking the browser in full-screen mode. Calling the number connects you to a scammer who asks for remote access to "fix" the fabricated problem, then pressures for payment. No legitimate antivirus or operating system vendor detects an infection and tells you to call a phone number.',
    categorySlug: 'tech-support-scams',
    alertLevel: 'high',
    sources: ['FTC Consumer Advice'],
  },
  {
    name: 'Unsolicited "Your Computer Is Infected" Call',
    slug: 'unsolicited-tech-support-call',
    description:
      'A caller claims to be from a well-known tech company and says they have detected a virus or security breach on your computer, asking you to open a remote-access tool so they can "show you" the problem. Once connected, they may plant fake evidence of infection, lock files, or search for financial information, then demand payment — often by gift card or wire transfer — to resolve an issue that was never real.',
    categorySlug: 'tech-support-scams',
    alertLevel: 'high',
    sources: ['FTC Consumer Advice'],
  },
  {
    name: 'Fake Social Security Suspension Call',
    slug: 'fake-ssa-suspension-call',
    description:
      'A caller claims your Social Security number has been "suspended" due to suspicious activity or a crime committed in your name, and that resolving it requires immediate payment or moving your money to a "safe" government-controlled account. The Social Security Administration will not call to threaten suspension of your number, and never asks for payment by gift card, wire transfer, or cash. Hang up and, if concerned, contact the SSA directly using the number on ssa.gov.',
    categorySlug: 'government-impersonation',
    alertLevel: 'critical',
    sources: ['SSA Office of Inspector General', 'FTC Consumer Advice'],
  },
  {
    name: 'Fake Arrest Warrant Call',
    slug: 'fake-arrest-warrant-call',
    description:
      'A caller impersonating a police officer or court official claims you missed jury duty or have an outstanding warrant, and that immediate payment (by gift card, wire transfer, or in-person cash pickup by a "courier") will prevent arrest. Caller ID may be spoofed to display a real local police non-emergency number. No court or police department resolves a warrant over the phone with a same-call payment demand.',
    categorySlug: 'government-impersonation',
    alertLevel: 'critical',
    sources: ['FTC Consumer Advice'],
  },
  {
    name: 'Fake CEO Wire Transfer Request',
    slug: 'fake-ceo-wire-transfer-request',
    description:
      'An email spoofed or closely mimicking an executive’s address instructs an employee — usually in finance or accounting — to urgently wire funds for a confidential deal, often timed for when the real executive is traveling and hard to reach for a quick confirmation. The request emphasizes urgency and discretion specifically to discourage the normal verification process. Any wire request received only by email should be confirmed by phone using a number you already had on file, not one provided in the message.',
    categorySlug: 'business-email-compromise',
    alertLevel: 'critical',
    sources: ['FBI IC3'],
  },
  {
    name: 'Vendor Invoice Bank Account Change',
    slug: 'vendor-invoice-bank-change-scam',
    description:
      'A scammer who has compromised or spoofed a real vendor’s email sends an invoice, or a note about an upcoming invoice, stating their bank account has changed and providing new payment details. Because the invoice and vendor relationship are genuine, the fraud is only in the redirected account — payments look completely routine until the real vendor calls asking why they haven’t been paid. Always confirm banking-detail changes by phone with a previously verified contact before updating payment records.',
    categorySlug: 'business-email-compromise',
    alertLevel: 'critical',
    sources: ['FBI IC3'],
  },
  {
    name: 'Pig Butchering Fake Crypto Platform',
    slug: 'pig-butchering-fake-crypto-platform',
    description:
      'After weeks of relationship-building over text or a dating app, a new contact introduces a cryptocurrency trading platform showing consistent, impressive returns. The platform is fabricated and entirely controlled by the scam operation; early small withdrawals are permitted specifically to build confidence before the victim commits a much larger sum, at which point withdrawals are blocked behind invented fees or "tax" payments. A platform that only allows withdrawals after another payment is a definitive red flag.',
    categorySlug: 'investment-fraud',
    alertLevel: 'critical',
    sources: ['FBI IC3', 'FTC Consumer Advice'],
  },
  {
    name: 'Guaranteed-Returns Investment Club',
    slug: 'guaranteed-returns-investment-club',
    description:
      'An investment opportunity — often pitched through a social media group, seminar, or referral from an acquaintance — promises fixed, guaranteed returns well above what any legitimate market investment offers, sometimes described as a "club" or "pool" that only insiders can join. Legitimate investments carry risk and cannot guarantee returns; a promised fixed high return is one of the most reliable indicators of fraud, regardless of how credible or personable the person offering it seems.',
    categorySlug: 'investment-fraud',
    alertLevel: 'high',
    sources: ['SEC Office of Investor Education', 'FTC Consumer Advice'],
  },
  {
    name: 'Fake USPS Redelivery Text',
    slug: 'fake-usps-redelivery-text',
    description:
      'A text claiming to be from USPS says a package could not be delivered due to an incomplete address and links to a page requesting a small redelivery fee and your card details. USPS does not request payment by text link for redelivery; if you want to check a real package, use informed delivery or track it directly on usps.com with your actual tracking number.',
    categorySlug: 'package-delivery-scams',
    alertLevel: 'medium',
    sources: ['USPS Postal Inspection Service', 'FTC Consumer Advice'],
  },
  {
    name: 'Fake FedEx Customs Fee Text',
    slug: 'fake-fedex-customs-fee-text',
    description:
      'A text or email styled as a FedEx delivery notice claims an international package is being held pending a small customs fee, with a link to pay it. The message is sent broadly enough that a meaningful share of recipients are genuinely expecting some delivery, which makes the fake notice feel plausible. Confirm any real shipment directly through the carrier’s official app or website, never through a link in an unsolicited message.',
    categorySlug: 'package-delivery-scams',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice'],
  },
  {
    name: 'Fake Remote Job Overpayment Check',
    slug: 'fake-remote-job-overpayment-check',
    description:
      'After a brief, informal hiring process, a new "employer" sends a check for more than the agreed signing bonus or equipment stipend and asks the new hire to deposit it and wire back the difference. The check is fraudulent and will eventually bounce, but not before the bank has made the funds provisionally available — leaving the victim liable for the full amount once the check is reversed, on top of the money already wired back.',
    categorySlug: 'employment-scams',
    alertLevel: 'high',
    sources: ['FTC Consumer Advice'],
  },
  {
    name: 'Mystery Shopper Job Scam',
    slug: 'mystery-shopper-job-scam',
    description:
      'An ad or unsolicited message offers paid work "secret shopping" at retail stores or wire-transfer services, often including a check to cover a first assignment’s purchases and fees. The instructions typically ask the new hire to deposit the check, spend part of it at a specified retailer, and wire or gift-card the remainder as part of "evaluating" the transfer service — the check bounces after the money has already been sent. Legitimate mystery-shopping work does not require you to spend your own deposited funds and wire money back.',
    categorySlug: 'employment-scams',
    alertLevel: 'high',
    sources: ['FTC Consumer Advice'],
  },
  {
    name: 'Fake Disaster Relief Charity',
    slug: 'fake-disaster-relief-charity',
    description:
      'In the days following a major hurricane, wildfire, or earthquake, a solicitation appears asking for donations to help victims, using real news photography and a name close enough to a well-known relief organization to avoid a second look. Some of these organizations are created specifically in the window after a disaster and disappear once donations taper off. Verify any disaster-relief charity independently through an evaluator like Charity Navigator or the BBB Wise Giving Alliance before donating.',
    categorySlug: 'charity-scams',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice', 'BBB Wise Giving Alliance'],
  },
  {
    name: 'Fake Veterans Charity Phone Call',
    slug: 'fake-veterans-charity-call',
    description:
      'A caller solicits donations for wounded veterans or a veterans’ support fund, using patriotic and emotional appeals and pressuring for an immediate pledge on the call itself. Genuine veterans’ charities are registered and can be independently verified; a caller who pressures for an on-the-spot donation and cannot answer basic questions about how funds are used is a strong warning sign. Ask for written information and verify the organization independently before giving.',
    categorySlug: 'charity-scams',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice'],
  },
  {
    name: 'Data Breach Follow-Up Phishing',
    slug: 'data-breach-followup-phishing',
    description:
      'After a company discloses a real data breach, scammers send emails impersonating that company’s "security team," offering a link to "check if your data was affected" or to enroll in free credit monitoring. The link leads to a credential-harvesting page that steals exactly the kind of information the real breach notice was warning about. Go directly to the company’s official site to check breach notices and enroll in any monitoring offered, rather than clicking a link in a follow-up email.',
    categorySlug: 'identity-theft',
    alertLevel: 'high',
    sources: ['FTC Consumer Advice'],
  },
  {
    name: 'Fake Credit Monitoring Enrollment Call',
    slug: 'fake-credit-monitoring-call',
    description:
      'A caller claims to represent a credit bureau or monitoring service and offers to "verify" your identity to set up free monitoring after a breach, asking for your Social Security number, date of birth, and account numbers over the phone. Real credit-monitoring enrollment does not require reciting your full SSN to an inbound caller you did not contact first. Hang up and enroll, if you choose to, directly through the bureau’s official website.',
    categorySlug: 'identity-theft',
    alertLevel: 'high',
    sources: ['FTC Consumer Advice'],
  },
  {
    name: 'Fake Discount Online Storefront',
    slug: 'fake-discount-online-storefront',
    description:
      'A newly created online store, often promoted through social media ads, offers name-brand products at steep discounts. Orders are taken and paid for, but nothing ships, or a cheap counterfeit arrives instead of the advertised product, and the store becomes unreachable once enough orders come in. Check for independent reviews of the specific store (not just the product), a real physical address, and pay with a credit card, which offers dispute rights that debit cards and wire transfers do not.',
    categorySlug: 'online-shopping-scams',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice', 'BBB'],
  },
  {
    name: 'Marketplace Overpayment Scam',
    slug: 'marketplace-overpayment-scam',
    description:
      'A buyer on an online marketplace sends a check or payment for more than the asking price, claiming it was a mistake by a shipping company or personal assistant, and asks the seller to refund the difference before the original payment has actually cleared. Once the seller refunds the "overpayment," the original payment bounces or is reversed, and the refunded money is gone. Never refund an overpayment before the original payment has fully and irreversibly cleared, which can take well over a week for a check.',
    categorySlug: 'online-shopping-scams',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice'],
  },
  {
    name: 'Fake Prize Notification Scam',
    slug: 'fake-prize-notification-scam',
    description:
      'An email, letter, or call claims you’ve won a major sweepstakes or lottery prize, often invoking a real, well-known name, but requires paying "taxes," "processing," or "insurance" fees before the winnings can be released. Legitimate sweepstakes never require a winner to pay money to receive a prize, and you cannot win a lottery or sweepstakes you never entered.',
    categorySlug: 'lottery-sweepstakes-scams',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice'],
  },
  {
    name: '"You’ve Won a Free Cruise" Robocall',
    slug: 'free-cruise-prize-robocall',
    description:
      'An automated call announces you’ve been selected for a free cruise or vacation package and prompts you to press a number to claim it, which connects to a live agent pushing for a credit card number to cover "port fees" or "taxes" — fees that, if charged, are rarely followed by any actual trip. These robocalls are typically sent in enormous batches at minimal cost, so being "selected" means nothing beyond having a phone number that was dialed. Hang up rather than pressing any number, which can also confirm your number as active to future robocallers.',
    categorySlug: 'lottery-sweepstakes-scams',
    alertLevel: 'low',
    sources: ['FTC Consumer Advice', 'FCC'],
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
  },
  {
    name: 'Fake Amazon Order Confirmation Email',
    slug: 'fake-amazon-order-confirmation-email',
    description:
      'An email confirms an expensive purchase you never made and includes a "cancel order" or "dispute charge" link, which leads to a fake Amazon sign-in page designed to steal your credentials and card details. Check your actual order history by typing amazon.com directly into your browser, never through a link in an email.',
    categorySlug: 'phishing',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice'],
  },
  {
    name: 'Fake IT Helpdesk Password Reset',
    slug: 'fake-it-helpdesk-password-reset',
    description:
      'An email or text posing as your company\'s IT department claims your password has expired and urges you to "reset now" through a link, which leads to a fake corporate sign-in page that harvests real credentials — often the opening move in a larger network breach, not just a one-off theft. Verify with your actual IT department through a known internal channel before entering credentials anywhere prompted by an unsolicited message.',
    categorySlug: 'phishing',
    alertLevel: 'high',
    sources: ['FBI IC3', 'CISA'],
  },

  {
    name: 'Oil Rig or Overseas Contractor Romance Scam',
    slug: 'oil-rig-romance-scam',
    description:
      'A dating profile claims to work on an offshore oil rig, as a military contractor, or another remote overseas job, using the isolation of the "location" to explain away video calls and in-person meetings. After weeks of relationship-building, the story shifts to a supposed emergency — medical bills, travel costs to finally meet, or a shipment stuck in customs — that only money can solve.',
    categorySlug: 'romance-scams',
    alertLevel: 'high',
    sources: ['FTC Consumer Advice'],
  },
  {
    name: 'Off-Platform Messaging Push',
    slug: 'off-platform-messaging-push',
    description:
      'Early in a dating-app conversation, a match urges moving to WhatsApp, Telegram, or a personal email address, often claiming the app is "glitchy" or they\'re "about to lose access." This gets the conversation off a platform with reporting tools and fraud monitoring before any request for money begins — a legitimate match has no urgent reason to rush this before you\'ve even met in person.',
    categorySlug: 'romance-scams',
    alertLevel: 'low',
    sources: ['FTC Consumer Advice'],
  },
  {
    name: 'Romance-to-Crypto Investment Pivot',
    slug: 'romance-to-crypto-investment-pivot',
    description:
      'After weeks or months of relationship-building, an online romantic interest introduces a "can\'t miss" cryptocurrency platform or trading opportunity, encouraging escalating deposits before disappearing along with the funds — the on-ramp into what\'s commonly called "pig butchering" (see Investment Fraud). Anyone you\'ve never met in person steering you toward a specific investment platform is a red flag, regardless of how genuine the relationship feels.',
    categorySlug: 'romance-scams',
    alertLevel: 'critical',
    sources: ['FBI IC3', 'FTC Consumer Advice'],
  },

  {
    name: 'Fake Apple ID Security Alert Text',
    slug: 'fake-apple-id-security-alert-text',
    description:
      'A text claims your Apple ID was accessed from an unrecognized device or location and includes a link to "secure your account," leading to a fake Apple sign-in page that harvests your Apple ID credentials — often used afterward to lock the real owner out through a password reset. Check account security directly in your device\'s Settings app, never through a link in a text.',
    categorySlug: 'tech-support-scams',
    alertLevel: 'high',
    sources: ['FTC Consumer Advice'],
  },
  {
    name: 'Auto-Renewal Antivirus Refund Call',
    slug: 'antivirus-refund-remote-access-call',
    description:
      'A call or pop-up claims an antivirus subscription auto-renewed for an inflated amount and offers a "refund" — but processing it requires remote access to your computer. During the session, the scammer moves money between your own accounts to make it look like they refunded too much, then claims you need to send the "extra" back via gift cards or wire transfer.',
    categorySlug: 'tech-support-scams',
    alertLevel: 'high',
    sources: ['FTC Consumer Advice', 'FBI IC3'],
  },
  {
    name: 'Fake ISP Service Disconnection Call',
    slug: 'fake-isp-disconnection-call',
    description:
      'An automated or live call claims your internet service will be disconnected within hours over a billing issue, pressuring immediate payment by gift card or wire transfer to avoid it. Contact your actual provider using the number on a past bill, never a callback number given by the caller — real providers don\'t threaten same-day disconnection over the phone.',
    categorySlug: 'tech-support-scams',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice'],
  },

  {
    name: 'Fake Unemployment Benefits Verification Alert',
    slug: 'fake-unemployment-benefits-alert',
    description:
      'A text or email claims your state unemployment account shows suspicious activity or needs identity re-verification, linking to a fake state portal that harvests Social Security numbers and bank details. This is frequently used to file fraudulent unemployment claims in the victim\'s name, sometimes without the victim ever finding out until a tax form arrives for benefits they never received.',
    categorySlug: 'government-impersonation',
    alertLevel: 'high',
    sources: ['FTC Consumer Advice', 'U.S. Department of Labor'],
  },
  {
    name: 'Fake Immigration Deportation Threat Call',
    slug: 'fake-immigration-deportation-threat-call',
    description:
      'A caller claiming to be from immigration services threatens deportation or visa revocation unless a fee is paid immediately, targeting immigrants and international students who may be less familiar with how U.S. immigration proceedings actually work. Real immigration matters proceed through mailed notices and scheduled hearings, never a surprise phone call demanding same-day payment.',
    categorySlug: 'government-impersonation',
    alertLevel: 'critical',
    sources: ['FTC Consumer Advice', 'FBI IC3'],
  },
  {
    name: 'Fake Census Bureau Data Request',
    slug: 'fake-census-bureau-data-request',
    description:
      'Outside of the actual census period, a caller or emailer claims to represent the Census Bureau and requests a Social Security number, bank account details, or a "verification fee." The real Census Bureau never asks for Social Security numbers, bank or credit card numbers, or money on behalf of a political party.',
    categorySlug: 'government-impersonation',
    alertLevel: 'medium',
    sources: ['U.S. Census Bureau', 'FTC Consumer Advice'],
  },

  {
    name: 'Fake Payroll Direct Deposit Change',
    slug: 'fake-payroll-direct-deposit-change',
    description:
      'An email impersonating an employee, often from a lookalike personal address, asks HR or payroll to update their direct deposit bank details before the next pay cycle — redirecting that employee\'s real paycheck to the scammer\'s account instead. Payroll changes should always be confirmed with the employee directly through a known phone number or in person, not just the email that requested it.',
    categorySlug: 'business-email-compromise',
    alertLevel: 'high',
    sources: ['FBI IC3'],
  },
  {
    name: 'Compromised Closing Wire Instructions',
    slug: 'compromised-closing-wire-instructions',
    description:
      'During a real estate closing, a scammer who has compromised a title company\'s or attorney\'s email sends "updated" wire instructions to the buyer just before closing, redirecting the down payment or full purchase amount to their own account. Always confirm wire instructions by phone using a number you already had on file, never one provided in the same email as the instructions — funds sent this way are rarely recoverable.',
    categorySlug: 'business-email-compromise',
    alertLevel: 'critical',
    sources: ['FBI IC3', 'FTC Consumer Advice'],
  },
  {
    name: 'Fake Executive Gift Card Request',
    slug: 'fake-executive-gift-card-request',
    description:
      'An email or text impersonating a company executive urgently asks an employee to buy gift cards for a "client gift" or "employee reward" and send the redemption codes, exploiting the employee\'s instinct to respond quickly to leadership. Executives don\'t conduct real business through unverified personal requests for gift cards — confirm any such request through a separate, known channel first.',
    categorySlug: 'business-email-compromise',
    alertLevel: 'medium',
    sources: ['FBI IC3', 'FTC Consumer Advice'],
  },

  {
    name: 'Fake Celebrity-Endorsed Crypto Giveaway',
    slug: 'fake-celebrity-crypto-giveaway',
    description:
      'A fake social media post, hijacked verified account, or deepfake video appears to show a celebrity or public figure promoting a cryptocurrency "giveaway" that promises to double any crypto sent to a wallet address. The wallet simply keeps whatever is sent — nothing is ever returned, regardless of how convincing the video looks.',
    categorySlug: 'investment-fraud',
    alertLevel: 'high',
    sources: ['FTC Consumer Advice', 'FBI IC3'],
  },
  {
    name: 'Prime Bank Instrument Fraud',
    slug: 'prime-bank-instrument-fraud',
    description:
      'Promoters offer access to exclusive "prime bank" trading programs supposedly used by major international banks, promising extraordinary guaranteed returns from financial instruments that don\'t actually exist in the form described. The SEC and FBI have been warning about this exact scheme, largely unchanged, for decades.',
    categorySlug: 'investment-fraud',
    alertLevel: 'high',
    sources: ['U.S. Securities and Exchange Commission', 'FBI IC3'],
  },
  {
    name: 'Fake Forex or Day-Trading Signal Service',
    slug: 'fake-forex-signal-service',
    description:
      'A paid "signals" service or self-styled trading guru promises a proven system for guaranteed forex or stock market profits, often showing cherry-picked or fabricated screenshots of gains, collecting subscription fees or steering victims toward opening accounts at affiliated (and equally fake) brokers. No legitimate trading strategy can guarantee returns — that promise alone is disqualifying.',
    categorySlug: 'investment-fraud',
    alertLevel: 'medium',
    sources: ['U.S. Securities and Exchange Commission', 'FTC Consumer Advice'],
  },

  {
    name: 'Fake Address Correction Fee Text',
    slug: 'fake-address-correction-fee-text',
    description:
      'A text claims a package can\'t be delivered due to an "incomplete address" and asks for a small correction fee, collecting card details through a fake carrier-branded payment page. A real delivery issue is resolved through the carrier\'s official app or website, never a link texted to you out of the blue.',
    categorySlug: 'package-delivery-scams',
    alertLevel: 'low',
    sources: ['USPS Postal Inspection Service', 'FTC Consumer Advice'],
  },
  {
    name: 'QR Code Delivery Scam',
    slug: 'qr-code-delivery-scam',
    description:
      'A sticker or slip claiming to be from a delivery carrier includes a QR code to "reschedule delivery" or "pay a redelivery fee." QR codes hide the destination web address until after you scan them, making a fake page harder to spot than a typed link would be — scan only codes you can verify came from a legitimate source.',
    categorySlug: 'package-delivery-scams',
    alertLevel: 'medium',
    sources: ['FBI IC3', 'FTC Consumer Advice'],
  },
  {
    name: 'Fake Delivery Driver Tip Request',
    slug: 'fake-delivery-driver-tip-request',
    description:
      'A text supposedly from a delivery service asks for a card number to "leave a tip" for the driver on a package that was never actually ordered. This is often less about the small tip amount and more about confirming your number is active and that you\'re willing to enter payment details from an unsolicited text.',
    categorySlug: 'package-delivery-scams',
    alertLevel: 'low',
    sources: ['FTC Consumer Advice'],
  },

  {
    name: 'Fake Job Requiring an Upfront Training Fee',
    slug: 'fake-job-upfront-training-fee',
    description:
      'After a suspiciously fast hiring process with no real interview, a "new employer" requires payment for training materials, a background check, or equipment before the first day of work. Legitimate employers cover the cost of onboarding their own new hires — they never require you to pay for it.',
    categorySlug: 'employment-scams',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice'],
  },
  {
    name: 'Fake Recruiter Personal Information Harvest',
    slug: 'fake-recruiter-info-harvest',
    description:
      'A message claiming to be from a recruiter for a real, well-known company requests a Social Security number and bank details "for HR paperwork" before any formal offer letter exists or the employment relationship has been verified. Real HR paperwork happens after a documented offer, through the company\'s own secure systems — not over email or chat with an unverified recruiter.',
    categorySlug: 'employment-scams',
    alertLevel: 'high',
    sources: ['FTC Consumer Advice', 'FBI IC3'],
  },
  {
    name: 'Fake Job-Board "Easy Apply" Phishing Page',
    slug: 'fake-easy-apply-phishing-page',
    description:
      'A job posting on a legitimate job board links out to an external "application portal" that\'s actually a credential-harvesting page mimicking a real company\'s careers site, collecting login credentials that are often reused across other accounts. Apply directly through a company\'s verified careers page when a listing seems off, rather than an external link in the posting.',
    categorySlug: 'employment-scams',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice'],
  },

  {
    name: 'Fake Medical Fundraiser',
    slug: 'fake-medical-fundraiser',
    description:
      'A fabricated crowdfunding campaign claims to raise money for a stranger\'s medical treatment, often using stolen photos and an invented story, then disappearing once donations peak — frequently timed around a real, well-publicized tragedy to borrow its urgency. Check a crowdfunding campaign\'s updates, comments, and organizer history before donating to anyone you don\'t personally know.',
    categorySlug: 'charity-scams',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice', 'BBB Scam Tracker'],
  },
  {
    name: 'Look-Alike Charity Name Scam',
    slug: 'lookalike-charity-name-scam',
    description:
      'A fraudulent organization uses a name deliberately similar to a real, well-known charity — differing by a single word or abbreviation — to collect donations that never reach any real cause. Check a charity\'s exact legal name against a verification service like Charity Navigator or the BBB Wise Giving Alliance before donating, rather than trusting a name that merely sounds familiar.',
    categorySlug: 'charity-scams',
    alertLevel: 'medium',
    sources: ['BBB Scam Tracker', 'FTC Consumer Advice'],
  },
  {
    name: 'Fake Door-to-Door Charity Collector',
    slug: 'fake-door-to-door-charity-collector',
    description:
      'Someone claiming to collect for a local cause — a fire department, a school, a religious group — solicits cash donations door-to-door or in parking lots without any verifiable ID or paperwork. A real charity representative can always provide their organization\'s EIN and a receipt; a demand for cash only, on the spot, is a warning sign.',
    categorySlug: 'charity-scams',
    alertLevel: 'low',
    sources: ['BBB Scam Tracker', 'FTC Consumer Advice'],
  },

  {
    name: 'SIM Swap Fraud',
    slug: 'sim-swap-fraud',
    description:
      'A scammer convinces a mobile carrier, often through social engineering or a bribed insider, to transfer your phone number to a SIM card they control. From there, they can intercept SMS-based two-factor authentication codes and take over bank, email, and crypto accounts — often within minutes of the swap succeeding. A carrier PIN and app-based (not SMS-based) two-factor authentication meaningfully reduce this risk.',
    categorySlug: 'identity-theft',
    alertLevel: 'critical',
    sources: ['FCC', 'FBI IC3'],
  },
  {
    name: 'Synthetic Identity Fraud',
    slug: 'synthetic-identity-fraud',
    description:
      'A fraudster combines a real Social Security number, often one belonging to a child or someone with little credit activity, with fabricated personal details to build an entirely new credit identity over months or years, before maxing out credit and disappearing. This is why placing a credit freeze for a minor, and periodically checking that no credit file exists yet in their name, is a real protective step.',
    categorySlug: 'identity-theft',
    alertLevel: 'high',
    sources: ['FTC Consumer Advice', 'FBI IC3'],
  },
  {
    name: 'Mail Theft Identity Theft',
    slug: 'mail-theft-identity-theft',
    description:
      'Thieves steal physical mail — checks, tax documents, pre-approved credit offers — directly from mailboxes to harvest personal and financial information. A locking mailbox, prompt mail pickup, and opting out of pre-approved credit offers by mail meaningfully reduce this long-standing, low-tech risk.',
    categorySlug: 'identity-theft',
    alertLevel: 'medium',
    sources: ['USPS Postal Inspection Service', 'FTC Consumer Advice'],
  },

  {
    name: 'Fake Ticket Reseller Scam',
    slug: 'fake-ticket-reseller-scam',
    description:
      'A listing for concert or sports tickets on an unofficial resale site or social media collects payment for tickets that either never arrive or turn out to be counterfeit or already scanned at the venue — a pattern that spikes around high-demand events with limited official ticket availability. Buy only through the venue, artist, or a verified resale platform with a buyer guarantee.',
    categorySlug: 'online-shopping-scams',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice', 'BBB Scam Tracker'],
  },
  {
    name: 'Puppy Scam',
    slug: 'puppy-scam',
    description:
      'A fake online listing offers purebred puppies at a below-market price, then adds unexpected "shipping crate," "insurance," or "vet fee" charges before delivery — the puppy never actually exists. Reverse-image-search listing photos and insist on a video call or in-person visit before paying anything toward a pet you haven\'t met.',
    categorySlug: 'online-shopping-scams',
    alertLevel: 'medium',
    sources: ['BBB Scam Tracker', 'FTC Consumer Advice'],
  },
  {
    name: 'Fake Rental Listing Scam',
    slug: 'fake-rental-listing-scam',
    description:
      'A listing for an apartment or vacation rental, often a real property\'s photos copied from a legitimate listing, is posted by someone who isn\'t the actual owner or property manager, collecting a deposit or first month\'s rent before disappearing. Never pay a deposit before touring a rental in person (or via a live video call) and verifying the lister actually owns or manages the property.',
    categorySlug: 'online-shopping-scams',
    alertLevel: 'high',
    sources: ['FTC Consumer Advice', 'BBB Scam Tracker'],
  },

  {
    name: 'Fake Foreign Lottery Win',
    slug: 'fake-foreign-lottery-win',
    description:
      'A letter or email claims you\'ve won a foreign lottery you never entered, requiring payment of "taxes" or "transfer fees" before winnings can be released. It\'s also illegal for U.S. residents to play most foreign lotteries by mail or phone in the first place — which makes the premise itself a warning sign, independent of the fee request.',
    categorySlug: 'lottery-sweepstakes-scams',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice', 'U.S. Postal Inspection Service'],
  },
  {
    name: 'Fake "Prize Patrol" Sweepstakes Call',
    slug: 'fake-prize-patrol-call',
    description:
      'A caller impersonating a major, real sweepstakes brand claims you\'ve won a large prize and need to pay fees or taxes before a "prize patrol" can deliver a check in person. Real sweepstakes never require payment to claim a prize, and legitimate winners aren\'t called in advance of a surprise in-person delivery.',
    categorySlug: 'lottery-sweepstakes-scams',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice', 'FCC'],
  },
  {
    name: 'Fake Government Grant Award',
    slug: 'fake-government-grant-award',
    description:
      'A call or message claims you\'ve been awarded a government grant, sometimes citing a stimulus or relief program, and just need to pay a "processing fee" or provide bank details for direct deposit. The government does not award unsolicited cash grants to individuals it contacts out of the blue.',
    categorySlug: 'lottery-sweepstakes-scams',
    alertLevel: 'high',
    sources: ['FTC Consumer Advice', 'USA.gov'],
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
  },
  {
    name: 'Fake Cloud Storage Full Warning',
    slug: 'fake-cloud-storage-full-warning',
    description:
      'An email claims a Google Drive, iCloud, or Dropbox account is full and files will be deleted unless the recipient "upgrades now," linking to a fake sign-in page that harvests the account\'s real credentials.',
    categorySlug: 'phishing',
    alertLevel: 'low',
    sources: ['FTC Consumer Advice'],
  },
  {
    name: 'Malicious Invoice Attachment Phishing',
    slug: 'malicious-invoice-attachment-phishing',
    description:
      'An email disguised as an overdue invoice or shipping document carries a malicious attachment that, once opened, installs malware capable of stealing saved passwords and banking credentials directly from the device.',
    categorySlug: 'phishing',
    alertLevel: 'high',
    sources: ['FBI IC3', 'CISA'],
  },
  {
    name: 'Sugar Daddy Advance-Fee Scam',
    slug: 'sugar-daddy-advance-fee-scam',
    description:
      'A profile offering a generous "allowance" arrangement asks the other party to first pay a small verification or processing fee, or to accept and forward a check (which later bounces) before any real money ever changes hands.',
    categorySlug: 'romance-scams',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice', 'BBB Scam Tracker'],
  },
  {
    name: 'Long-Distance Engagement Travel Funds Scam',
    slug: 'long-distance-engagement-travel-funds-scam',
    description:
      'After building a long-distance online relationship and even a promised engagement, the scammer claims they\'re finally ready to visit or move but need help covering a flight, visa, or "travel insurance" fee — and the trip never happens.',
    categorySlug: 'romance-scams',
    alertLevel: 'high',
    sources: ['FTC Consumer Advice'],
  },
  {
    name: 'Sick Child Overseas Romance Scam',
    slug: 'sick-child-overseas-romance-scam',
    description:
      'A romance scam profile builds sympathy with a fabricated story about a child from a previous relationship who has fallen seriously ill overseas, requesting money for medical bills to "save" a child who doesn\'t exist.',
    categorySlug: 'romance-scams',
    alertLevel: 'high',
    sources: ['FTC Consumer Advice'],
  },
  {
    name: 'Fake Streaming Service Compromised Account Call',
    slug: 'fake-streaming-account-compromised-call',
    description:
      'A caller claims your Netflix, Amazon, or other streaming account has been compromised and offers to "fix" it by taking remote control of your computer, using the access to look for banking information instead.',
    categorySlug: 'tech-support-scams',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice'],
  },
  {
    name: 'Fake Bank Fraud Department Remote Access Scam',
    slug: 'fake-bank-fraud-department-remote-access',
    description:
      "A caller posing as your bank's fraud department claims your account was compromised and needs \"verification\" through a remote-access screen-sharing app. Real bank fraud teams never ask to remotely control your device.",
    categorySlug: 'tech-support-scams',
    alertLevel: 'critical',
    sources: ['FTC Consumer Advice', 'FBI IC3'],
  },
  {
    name: 'Fake Router Firmware Update Call',
    slug: 'fake-router-firmware-update-call',
    description:
      'A caller claims your home router urgently needs a "critical security update" and talks you through installing remote-access software, which is then used to search the device for saved passwords and financial information.',
    categorySlug: 'tech-support-scams',
    alertLevel: 'high',
    sources: ['FTC Consumer Advice'],
  },
  {
    name: 'Fake Unpaid Toll Text',
    slug: 'fake-unpaid-toll-text',
    description:
      'A text claims a small toll-road balance is overdue and threatens late fees or license suspension unless paid immediately through a link to a fake payment page — a wave of these has hit U.S. drivers, impersonating real toll agencies by name.',
    categorySlug: 'government-impersonation',
    alertLevel: 'medium',
    sources: ['FBI IC3', 'FTC Consumer Advice'],
  },
  {
    name: 'Fake Jury Duty Failure-to-Appear Fine',
    slug: 'fake-jury-duty-failure-to-appear-fine',
    description:
      "A caller claims you missed jury duty and owe an immediate fine to avoid arrest, sometimes correctly naming a real local courthouse to sound credible. Actual missed-jury-duty consequences are handled by mail and a real court appearance, never a same-day phone payment demand.",
    categorySlug: 'government-impersonation',
    alertLevel: 'high',
    sources: ['FTC Consumer Advice'],
  },
  {
    name: 'Fake Social Security Benefit Increase Verification',
    slug: 'fake-ssa-benefit-increase-verification',
    description:
      'A call or letter claims a cost-of-living benefit increase requires "verifying" your Social Security number and bank account details over the phone before it can be processed. The SSA does not require this to apply an automatic, already-scheduled increase.',
    categorySlug: 'government-impersonation',
    alertLevel: 'medium',
    sources: ['Social Security Administration', 'FTC Consumer Advice'],
  },
  {
    name: 'Fake Urgent Legal Demand Email',
    slug: 'fake-urgent-legal-demand-email',
    description:
      'An email impersonating a lawyer or citing a confidential legal matter (an acquisition, a lawsuit settlement) pressures an assistant or finance employee into an urgent, secretive wire transfer, using the "confidential" framing to discourage checking with anyone else.',
    categorySlug: 'business-email-compromise',
    alertLevel: 'critical',
    sources: ['FBI IC3'],
  },
  {
    name: 'Compromised Vendor Portal Credential Phishing',
    slug: 'compromised-vendor-portal-credential-phishing',
    description:
      "A phishing email disguised as an accounts-payable portal notification harvests login credentials from a company's AP staff, giving an attacker a foothold to alter real vendor payment details from inside a trusted system.",
    categorySlug: 'business-email-compromise',
    alertLevel: 'high',
    sources: ['FBI IC3'],
  },
  {
    name: 'Fake New-Hire Direct Deposit Setup',
    slug: 'fake-new-hire-direct-deposit-setup',
    description:
      "Posing as a brand-new employee with no prior payroll history to check against, a scammer emails HR with \"updated\" direct deposit details before the employee's first real paycheck is issued, redirecting it from day one.",
    categorySlug: 'business-email-compromise',
    alertLevel: 'medium',
    sources: ['FBI IC3'],
  },
  {
    name: 'Fake Real Estate Crowdfunding Platform',
    slug: 'fake-real-estate-crowdfunding-platform',
    description:
      "A slickly designed website solicits small investments toward fractional ownership of real estate properties that don't exist or aren't actually connected to the platform, showing a rising \"portfolio value\" that can never actually be withdrawn.",
    categorySlug: 'investment-fraud',
    alertLevel: 'high',
    sources: ['U.S. Securities and Exchange Commission'],
  },
  {
    name: 'Private Lending Club Ponzi Scheme',
    slug: 'private-lending-club-ponzi-scheme',
    description:
      'An informal "investment club," often recruited through word-of-mouth or a religious or cultural community, promises high fixed returns from private lending. Early members are paid from later members\' contributions until recruitment slows and the scheme collapses.',
    categorySlug: 'investment-fraud',
    alertLevel: 'high',
    sources: ['U.S. Securities and Exchange Commission', 'FTC Consumer Advice'],
  },
  {
    name: 'Rug Pull Token Presale Scam',
    slug: 'rug-pull-token-presale-scam',
    description:
      'Promoters hype an upcoming cryptocurrency token or NFT collection with a professional-looking website and social media buzz, collect funds during a "presale," then abandon the project and disappear with the money once the sale closes.',
    categorySlug: 'investment-fraud',
    alertLevel: 'high',
    sources: ['FBI IC3', 'U.S. Securities and Exchange Commission'],
  },
  {
    name: 'Fake International Customs Fee Text',
    slug: 'fake-international-customs-fee-text',
    description:
      'A text claims a package is being held at customs and requires an immediate small fee to release it, linking to a payment page that harvests card details rather than releasing any actual package.',
    categorySlug: 'package-delivery-scams',
    alertLevel: 'low',
    sources: ['FTC Consumer Advice'],
  },
  {
    name: 'Fake DHL Missed Delivery Card',
    slug: 'fake-dhl-missed-delivery-card',
    description:
      'A card left at the door (or a text) claims a DHL delivery was missed and provides a number or link to "reschedule," leading either to a phishing page or a premium-rate phone number that racks up charges per minute.',
    categorySlug: 'package-delivery-scams',
    alertLevel: 'low',
    sources: ['FTC Consumer Advice'],
  },
  {
    name: 'Fake Amazon Delivery Failed Refund Scam',
    slug: 'fake-amazon-delivery-failed-refund-scam',
    description:
      'A text claims an Amazon delivery failed and a refund is being processed, asking the recipient to confirm their card details to "receive" money that Amazon was never actually planning to refund.',
    categorySlug: 'package-delivery-scams',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice'],
  },
  {
    name: 'Data Entry Job Starter Kit Fee',
    slug: 'data-entry-job-starter-kit-fee',
    description:
      'A "work from home" data entry job requires purchasing a mandatory training kit or software license before the first assignment, and no real paying work ever materializes after payment.',
    categorySlug: 'employment-scams',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice'],
  },
  {
    name: 'Guaranteed Government Job Placement Fee',
    slug: 'guaranteed-government-job-placement-fee',
    description:
      'An ad promises guaranteed placement into a federal or postal job for an upfront "processing" or "exam prep" fee. Actual federal job applications are free and go through USAJobs.gov directly.',
    categorySlug: 'employment-scams',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice', 'USA.gov'],
  },
  {
    name: 'Task-Completion Pyramid Scam',
    slug: 'task-completion-pyramid-scam',
    description:
      'Recruited through social media or messaging apps, victims are told they can earn money completing simple online "tasks" (liking videos, rating products), building trust with small real payouts before being told a larger deposit is needed to unlock bigger earnings — a deposit that\'s never returned.',
    categorySlug: 'employment-scams',
    alertLevel: 'high',
    sources: ['FBI IC3', 'FTC Consumer Advice'],
  },
  {
    name: 'Fake Holiday Toy Drive Scam',
    slug: 'fake-holiday-toy-drive-scam',
    description:
      'Around the winter holidays, a fraudulent "toy drive" solicits cash or gift card donations through social media posts or door-to-door collection, with no real charity or distribution behind it.',
    categorySlug: 'charity-scams',
    alertLevel: 'low',
    sources: ['BBB Scam Tracker'],
  },
  {
    name: 'Fake Animal Rescue Charity',
    slug: 'fake-animal-rescue-charity',
    description:
      "Using heartbreaking photos of injured or abandoned animals, a fraudulent \"rescue\" solicits recurring donations for a shelter that doesn't actually exist or doesn't use donations as described.",
    categorySlug: 'charity-scams',
    alertLevel: 'medium',
    sources: ['BBB Scam Tracker', 'FTC Consumer Advice'],
  },
  {
    name: 'Fake Police or Firefighter Fraternal Donation Call',
    slug: 'fake-police-firefighter-fraternal-donation-call',
    description:
      "A caller claims to represent a local police or firefighter benevolent association, using the uniformed-service association to build trust, but the \"fraternal organization\" keeps most or all of the donated funds rather than passing them to actual first responders.",
    categorySlug: 'charity-scams',
    alertLevel: 'medium',
    sources: ['BBB Scam Tracker', 'FTC Consumer Advice'],
  },
  {
    name: 'Medical Identity Theft',
    slug: 'medical-identity-theft',
    description:
      'A stolen insurance ID or Social Security number is used to receive medical treatment or equipment in the victim\'s name, leaving the real policyholder with unfamiliar charges, a corrupted medical record, and possible denied future claims.',
    categorySlug: 'identity-theft',
    alertLevel: 'high',
    sources: ['FTC Consumer Advice'],
  },
  {
    name: 'Child Identity Theft via School Data Breach',
    slug: 'child-identity-theft-school-data-breach',
    description:
      "A child's Social Security number, obtained through a school district data breach or a family member's own misuse, is used to open credit lines that go undetected for years since children rarely check their own credit.",
    categorySlug: 'identity-theft',
    alertLevel: 'high',
    sources: ['FTC Consumer Advice'],
  },
  {
    name: 'New Account Fraud via Public Records',
    slug: 'new-account-fraud-public-records',
    description:
      "A scammer combines details found in public records (address history, date of birth) with a stolen Social Security number to open new credit cards or loans in a victim's name, often targeting people who haven't frozen their credit.",
    categorySlug: 'identity-theft',
    alertLevel: 'high',
    sources: ['FTC Consumer Advice'],
  },
  {
    name: 'Fake Social Media Influencer Storefront',
    slug: 'fake-influencer-storefront',
    description:
      "A social media ad featuring what looks like an influencer's product recommendation links to a storefront that takes payment for items that are counterfeit, wildly different from advertised, or never shipped at all.",
    categorySlug: 'online-shopping-scams',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice', 'BBB Scam Tracker'],
  },
  {
    name: 'Fake Vehicle Listing Scam',
    slug: 'fake-vehicle-listing-scam',
    description:
      "A too-good-to-be-true used car listing, often claiming the seller is relocating or deployed overseas, asks for a deposit or full payment via wire or gift card before any in-person viewing. The vehicle, and often the seller, doesn't exist.",
    categorySlug: 'online-shopping-scams',
    alertLevel: 'high',
    sources: ['FTC Consumer Advice', 'BBB Scam Tracker'],
  },
  {
    name: 'Fake Furniture Liquidation Sale Scam',
    slug: 'fake-furniture-liquidation-sale-scam',
    description:
      'A pop-up website or social ad advertises a store-closing or liquidation sale on furniture or appliances at deep discounts, collects payment, and never ships anything, disappearing once complaints start.',
    categorySlug: 'online-shopping-scams',
    alertLevel: 'medium',
    sources: ['BBB Scam Tracker'],
  },
  {
    name: 'Fake Second-Chance Lottery Winner Notification',
    slug: 'fake-second-chance-lottery-winner',
    description:
      'A text or call claims a losing lottery ticket was actually entered into a "second chance" drawing and won, requiring a fee to release the prize. Legitimate second-chance drawings never require a winner to pay anything upfront.',
    categorySlug: 'lottery-sweepstakes-scams',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice'],
  },
  {
    name: 'Fake Class Action Settlement Payout Scam',
    slug: 'fake-class-action-settlement-payout-scam',
    description:
      'A message claims the recipient is owed money from a real, well-publicized class action lawsuit and requests personal or banking information to "process" the payout. Real settlement administrators never solicit this information this way.',
    categorySlug: 'lottery-sweepstakes-scams',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice'],
  },
  {
    name: 'Fake Unknown Relative Inheritance Scam',
    slug: 'fake-unknown-relative-inheritance-scam',
    description:
      'An email or letter claims a distant, unknown relative has died and left an inheritance, requiring fees or personal information to release the funds — a modern variation of a very old advance-fee scheme.',
    categorySlug: 'lottery-sweepstakes-scams',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice', 'U.S. Postal Inspection Service'],
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
  },
  {
    name: 'Fake Data Breach Password Blackmail Email',
    slug: 'fake-data-breach-password-blackmail-email',
    description:
      'An email claims to have hacked the victim\'s webcam using a password from a real old data breach — proving legitimacy by quoting that real, breached password — and threatens to release fabricated footage unless paid in cryptocurrency. The password is real from a public breach, but the "hacking" and footage are almost always fabricated.',
    categorySlug: 'sextortion',
    alertLevel: 'high',
    sources: ['FBI IC3', 'FTC Consumer Advice'],
  },
  {
    name: 'Fake Minor Predator Extortion Scam',
    slug: 'fake-minor-predator-extortion-scam',
    description:
      'A scammer poses as an underage user on social media or a dating app, then after some messages, claims to actually be a parent or law enforcement threatening legal exposure unless paid — targeting adults through fear of a false accusation.',
    categorySlug: 'sextortion',
    alertLevel: 'high',
    sources: ['FBI IC3'],
  },
  {
    name: 'AI-Generated Nude Image Extortion',
    slug: 'ai-generated-nude-image-extortion',
    description:
      'A scammer uses an AI image generator to create a fake nude photo of the victim from an innocuous real photo, often pulled from social media, then threatens to distribute it unless paid — increasingly reported among teenagers targeted through social media.',
    categorySlug: 'sextortion',
    alertLevel: 'critical',
    sources: ['FBI IC3', 'NCMEC'],
  },
  {
    name: 'Recorded Video Call Extortion via Compromised Account',
    slug: 'recorded-video-call-extortion-compromised-account',
    description:
      'After gaining access to a victim\'s messaging account, often via a prior phishing link, a scammer impersonates the victim to solicit compromising images or video from the victim\'s own contacts, then extorts those contacts using the real material.',
    categorySlug: 'sextortion',
    alertLevel: 'critical',
    sources: ['FBI IC3'],
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
  },
  {
    name: 'Fake Password Reset Confirmation',
    slug: 'fake-password-reset-confirmation',
    description:
      'A text or email claims a password reset was just requested on an account and asks the recipient to reply with a verification code to cancel it. That code is actually the real reset code, and providing it hands the account straight to the attacker.',
    categorySlug: 'account-takeover',
    alertLevel: 'critical',
    sources: ['FTC Consumer Advice'],
  },
  {
    name: 'Social-Engineered Account Recovery Bypass',
    slug: 'social-engineered-account-recovery-bypass',
    description:
      'After gathering a victim\'s email address and some personal details, an attacker uses an account\'s "forgot password" flow along with social-engineered customer support calls to bypass security questions and take over the account.',
    categorySlug: 'account-takeover',
    alertLevel: 'high',
    sources: ['FBI IC3'],
  },
  {
    name: 'Compromised Social Media Ad Account Takeover',
    slug: 'compromised-social-media-ad-account-takeover',
    description:
      'A phishing message disguised as a "policy violation" notice from a social platform harvests business ad-account credentials, which are then used to run fraudulent ad campaigns on the victim\'s dime before the real owner is locked out.',
    categorySlug: 'account-takeover',
    alertLevel: 'high',
    sources: ['FTC Consumer Advice'],
  },
  {
    name: 'Session Cookie Theft via Malicious Browser Extension',
    slug: 'session-cookie-theft-browser-extension',
    description:
      'A browser extension marketed as a productivity or shopping-discount tool secretly harvests session cookies, letting an attacker take over logged-in accounts without needing a password at all.',
    categorySlug: 'account-takeover',
    alertLevel: 'high',
    sources: ['CISA', 'FBI IC3'],
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
  },
  {
    name: 'Post-Disaster Fake Claims Adjuster',
    slug: 'post-disaster-fake-claims-adjuster',
    description:
      'After a hurricane, flood, or other disaster, someone posing as an insurance adjuster offers to "fast-track" a claim in exchange for an upfront fee, or by having the homeowner sign over claim rights to a fraudulent contractor.',
    categorySlug: 'insurance-fraud',
    alertLevel: 'high',
    sources: ['FTC Consumer Advice'],
  },
  {
    name: 'Staged Auto Accident Scam',
    slug: 'staged-auto-accident-scam',
    description:
      'A scammer deliberately causes a minor collision to file an inflated insurance claim against the other driver, sometimes involving a network of fake witnesses and clinics billing for treatment never provided.',
    categorySlug: 'insurance-fraud',
    alertLevel: 'medium',
    sources: ['FBI IC3'],
  },
  {
    name: 'Fake Pet Insurance Renewal Scam',
    slug: 'fake-pet-insurance-renewal-scam',
    description:
      'An email mimicking a real pet insurance provider claims a policy is about to lapse and requests updated payment details through a lookalike site, harvesting card information rather than actually renewing anything.',
    categorySlug: 'insurance-fraud',
    alertLevel: 'low',
    sources: ['FTC Consumer Advice'],
  },
  {
    name: 'Ghost Broker Auto Insurance Scam',
    slug: 'ghost-broker-auto-insurance-scam',
    description:
      'A "broker" sells a real-looking auto insurance policy at a steep discount by lying on the application or by simply never placing the policy with an insurer at all — the driver only finds out the coverage never existed after an accident.',
    categorySlug: 'insurance-fraud',
    alertLevel: 'high',
    sources: ['FTC Consumer Advice'],
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
  },
  {
    name: 'Free Genetic Testing Kit Scam',
    slug: 'free-genetic-testing-kit-scam',
    description:
      'A caller or booth at a public event offers a "free" genetic or COVID testing kit in exchange for a Medicare number, then bills Medicare thousands of dollars for tests that are never actually performed or medically necessary.',
    categorySlug: 'healthcare-fraud',
    alertLevel: 'high',
    sources: ['Medicare.gov', 'FBI IC3'],
  },
  {
    name: 'Fake Online Pharmacy',
    slug: 'fake-online-pharmacy',
    description:
      'A website offers prescription medication without a real prescription at steep discounts. The pills are often counterfeit, contain no active ingredient, or contain dangerous, unlisted substances, and the site harvests payment and personal health information.',
    categorySlug: 'healthcare-fraud',
    alertLevel: 'critical',
    sources: ['FDA', 'FTC Consumer Advice'],
  },
  {
    name: 'Miracle Cure Supplement Scam',
    slug: 'miracle-cure-supplement-scam',
    description:
      'Aggressive online ads promise a supplement that cures or reverses a serious condition, often using fake testimonials and a fabricated doctor\'s endorsement, enrolling buyers in unwanted recurring subscription charges.',
    categorySlug: 'healthcare-fraud',
    alertLevel: 'medium',
    sources: ['FDA', 'FTC Consumer Advice'],
  },
  {
    name: 'Fake Health Insurance Marketplace Navigator',
    slug: 'fake-health-insurance-marketplace-navigator',
    description:
      'During open enrollment, someone posing as an official ACA marketplace "navigator" signs victims up for a fake or wildly misrepresented health plan to collect a commission, leaving the victim uninsured or under-insured without realizing it.',
    categorySlug: 'healthcare-fraud',
    alertLevel: 'high',
    sources: ['HealthCare.gov', 'FTC Consumer Advice'],
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
  },
  {
    name: 'Deepfake Video Call CEO Fraud',
    slug: 'deepfake-video-call-ceo-fraud',
    description:
      'Building on traditional business email compromise, a scammer uses real-time deepfake video and audio to impersonate a company executive on a live video call, instructing an employee to make an urgent wire transfer — a real case in Hong Kong cost a firm over $25 million.',
    categorySlug: 'ai-deepfake-scams',
    alertLevel: 'critical',
    sources: ['FBI IC3'],
  },
  {
    name: 'AI-Generated Fake News Investment Endorsement',
    slug: 'ai-fake-news-investment-endorsement',
    description:
      'A fabricated news article or video, styled to look like a legitimate outlet, uses an AI-generated clip of a well-known public figure "endorsing" an investment platform that is entirely fraudulent.',
    categorySlug: 'ai-deepfake-scams',
    alertLevel: 'high',
    sources: ['U.S. Securities and Exchange Commission', 'FTC Consumer Advice'],
  },
  {
    name: 'AI Chatbot Romance Scam',
    slug: 'ai-chatbot-romance-scam',
    description:
      'Instead of, or alongside, a human scammer, an AI chatbot conducts a highly personalized, always-available romantic relationship with a victim over weeks or months, eventually steering the conversation toward a request for money or a fraudulent investment.',
    categorySlug: 'ai-deepfake-scams',
    alertLevel: 'high',
    sources: ['FTC Consumer Advice'],
  },
  {
    name: 'Deepfake Job Interview Fraudulent Candidate',
    slug: 'deepfake-job-interview-fraudulent-candidate',
    description:
      'On the flip side of consumer scams, fraudulent job applicants use real-time deepfake video during remote interviews to fraudulently obtain employment, sometimes at companies with access to sensitive data, under a false identity.',
    categorySlug: 'ai-deepfake-scams',
    alertLevel: 'medium',
    sources: ['FBI IC3', 'CISA'],
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
  },
  {
    name: 'Fake Student Loan Forgiveness Program',
    slug: 'fake-student-loan-forgiveness-program',
    description:
      'A caller or ad claims a government loan-forgiveness program requires an upfront "processing fee" or the borrower\'s Federal Student Aid ID and password to enroll. Real federal loan forgiveness programs are always free to apply for.',
    categorySlug: 'debt-relief-scams',
    alertLevel: 'high',
    sources: ['U.S. Department of Education', 'FTC Consumer Advice'],
  },
  {
    name: 'Credit Repair "New Identity" Scam',
    slug: 'credit-repair-new-identity-scam',
    description:
      'A company sells a legally obtained but fraudulently used Credit Privacy Number (CPN), suggesting a client use it in place of their Social Security number to "start fresh." Using a CPN this way is federal fraud, and the client — not the company — bears the legal risk.',
    categorySlug: 'debt-relief-scams',
    alertLevel: 'high',
    sources: ['FTC Consumer Advice', 'CFPB'],
  },
  {
    name: 'Fake Debt Collector Threatening Call',
    slug: 'fake-debt-collector-threatening-call',
    description:
      'A caller claiming to be a debt collector, sometimes citing a real, sold-off old debt or one that doesn\'t exist at all, threatens arrest or wage garnishment unless paid immediately via gift card or wire. Legitimate collectors must provide written validation of a debt on request and cannot threaten arrest.',
    categorySlug: 'debt-relief-scams',
    alertLevel: 'high',
    sources: ['CFPB', 'FTC Consumer Advice'],
  },
  {
    name: 'Timeshare Exit Company Scam',
    slug: 'timeshare-exit-company-scam',
    description:
      'A company promises to get a consumer out of an unwanted timeshare contract for a large upfront fee, then does little or nothing, sometimes leaving the consumer both out the fee and still contractually obligated to the timeshare.',
    categorySlug: 'debt-relief-scams',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice', 'BBB Scam Tracker'],
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
  },
  {
    name: 'Fake Loan Modification Company',
    slug: 'fake-loan-modification-company',
    description:
      'A company impersonates or claims a special relationship with the homeowner\'s actual mortgage lender, collects modification "processing fees," and never actually submits any paperwork to the real servicer.',
    categorySlug: 'mortgage-foreclosure-scams',
    alertLevel: 'high',
    sources: ['CFPB', 'FTC Consumer Advice'],
  },
  {
    name: 'Rent-Back Deed Transfer Scam',
    slug: 'rent-back-deed-transfer-scam',
    description:
      'A scammer convinces a homeowner facing foreclosure to sign over the deed with a promise they can rent the home and buy it back later. The fine print often lets the new "owner" evict them immediately or resets the deal on unaffordable terms.',
    categorySlug: 'mortgage-foreclosure-scams',
    alertLevel: 'critical',
    sources: ['HUD', 'FTC Consumer Advice'],
  },
  {
    name: 'Fake Mortgage Payoff Wire Fraud',
    slug: 'fake-mortgage-payoff-wire-fraud',
    description:
      'Similar to closing wire fraud, a scammer who has compromised a title or escrow company\'s email sends fraudulent payoff wire instructions during a refinance, redirecting funds meant to pay off the old mortgage.',
    categorySlug: 'mortgage-foreclosure-scams',
    alertLevel: 'critical',
    sources: ['FBI IC3'],
  },
  {
    name: 'Reverse Mortgage Counseling Fee Scam',
    slug: 'reverse-mortgage-counseling-fee-scam',
    description:
      'A company falsely claims to be the government-required independent counselor for a reverse mortgage and charges a large fee for a session that federal law requires be low-cost or free through a HUD-approved agency.',
    categorySlug: 'mortgage-foreclosure-scams',
    alertLevel: 'medium',
    sources: ['HUD', 'CFPB'],
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
  },
  {
    name: 'Ghost Tax Preparer Scam',
    slug: 'ghost-tax-preparer-scam',
    description:
      'An unlicensed preparer files a client\'s return, promises an inflated refund by fabricating deductions or credits, charges a fee based on the refund size, and doesn\'t sign the return as the preparer — leaving the taxpayer solely liable when the IRS flags it.',
    categorySlug: 'tax-scams',
    alertLevel: 'high',
    sources: ['IRS'],
  },
  {
    name: 'Fraudulent Tax Refund Identity Theft',
    slug: 'fraudulent-tax-refund-identity-theft',
    description:
      "A scammer files a fraudulent tax return using a victim's stolen Social Security number early in tax season to claim the refund before the real taxpayer files, discovered only when the real return is rejected as a duplicate.",
    categorySlug: 'tax-scams',
    alertLevel: 'high',
    sources: ['IRS', 'FTC Consumer Advice'],
  },
  {
    name: 'Fake IRS Refund Text or Email',
    slug: 'fake-irs-refund-text-email',
    description:
      'A message claims a tax refund is pending and asks the recipient to click a link and enter bank details to receive it faster. The IRS does not initiate contact by email or text about refunds.',
    categorySlug: 'tax-scams',
    alertLevel: 'medium',
    sources: ['IRS'],
  },
  {
    name: 'Employee Retention Credit Mill Scam',
    slug: 'employee-retention-credit-mill-scam',
    description:
      'Aggressive ads and calls push businesses to claim a since-tightened pandemic-era tax credit through a "specialist" who charges a large contingency fee, encouraging claims the business doesn\'t actually qualify for and leaving the business liable for repayment plus penalties.',
    categorySlug: 'tax-scams',
    alertLevel: 'high',
    sources: ['IRS'],
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
  },
  {
    name: 'Port-Out Fraud via Stolen Personal Information',
    slug: 'port-out-number-fraud',
    description:
      'Using personal information obtained from a data breach or phishing, a scammer contacts your mobile carrier and requests to port your phone number to a new SIM or device they control, without ever visiting a store in person. Once the port completes, they receive your calls and SMS-based two-factor codes, letting them reset passwords on banking and email accounts. Setting a carrier account PIN is one of the few defenses against this.',
    categorySlug: 'account-takeover',
    alertLevel: 'high',
    sources: ['FCC Consumer Guides', 'FTC Consumer Advice'],
  },
  {
    name: 'Account Takeover via Reused Password from an Unrelated Breach',
    slug: 'reused-password-breach-account-takeover',
    description:
      'After a large, unrelated company suffers a data breach, criminals test the leaked email-and-password combinations against banking, email, and shopping sites at automated scale. Anyone who reused the same password on one of those other services can have accounts taken over within days of a breach making headlines, even if they were never a customer of the breached company. A unique password per site is the direct defense.',
    categorySlug: 'account-takeover',
    alertLevel: 'high',
    sources: ['FBI IC3'],
  },
  {
    name: 'OAuth App Consent Phishing',
    slug: 'oauth-consent-phishing-attack',
    description:
      'Instead of stealing a password directly, a scammer sends a link to a real Microsoft or Google sign-in page asking you to "allow" a malicious third-party app to access your email and files. Because the login page itself is genuine, the request can bypass phishing filters and even multi-factor authentication — victims grant a token that keeps working until it is manually revoked. Periodically reviewing and removing unfamiliar "connected apps" is the main defense.',
    categorySlug: 'account-takeover',
    alertLevel: 'medium',
    sources: ['CISA'],
  },
  {
    name: 'Fake Two-Factor Authentication "Reset" Support Call',
    slug: 'fake-2fa-reset-support-call',
    description:
      'A scammer calls posing as account security support, claiming your two-factor authentication needs to be "reset" or "verified" due to suspicious activity, then walks the victim through disabling their own 2FA or reading back a reset code — the opposite of what real support would ever ask a customer to do. Legitimate providers never ask a customer to disable their own security features over the phone.',
    categorySlug: 'account-takeover',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice'],
  },
  {
    name: 'AI-Cloned Executive Voice Wire-Approval Call',
    slug: 'ai-voice-clone-executive-approval-call',
    description:
      'A short public recording of an executive\'s voice — from an earnings call, conference talk, or podcast — is fed into AI voice-cloning software to generate a convincing phone call approving an urgent wire transfer or gift card purchase, adding a live "voice" to a business email compromise scheme that once relied on text alone. Any unusual payment request, even one that sounds like a recognized voice on the phone, should be confirmed through a separate, previously known contact method.',
    categorySlug: 'ai-deepfake-scams',
    alertLevel: 'high',
    sources: ['FBI IC3'],
  },
  {
    name: 'AI Face-Swap Blackmail Video',
    slug: 'ai-face-swap-blackmail-video',
    description:
      'Ordinary photos scraped from a target\'s public social media profile are fed into face-swap AI tools to generate a fabricated explicit video, which is then sent to the victim — or threatened to be sent to their contacts — demanding payment to prevent release. Because the underlying photos are real but the video is entirely fabricated, victims may not immediately recognize it as fake. Reporting to the platform and law enforcement, not paying, is the recommended response.',
    categorySlug: 'ai-deepfake-scams',
    alertLevel: 'critical',
    sources: ['FBI IC3', 'National Center for Missing & Exploited Children'],
  },
  {
    name: 'AI-Generated Celebrity Health Product Endorsement Ad',
    slug: 'ai-celebrity-health-product-endorsement-ad',
    description:
      'A short AI-generated video clip shows a recognizable celebrity or news anchor appearing to endorse a weight-loss pill, supplement, or "miracle" health product, run as a paid social media ad. The celebrity has no actual connection to the product; the clip is fabricated from public footage. Checking whether the celebrity or their verified accounts have addressed the ad directly is a quick way to confirm it is fake.',
    categorySlug: 'ai-deepfake-scams',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice'],
  },
  {
    name: 'AI-Cloned Voicemail Urgent Callback Scam',
    slug: 'ai-cloned-voicemail-callback-scam',
    description:
      'Rather than a live call, a scammer leaves a short AI-generated voicemail cloned to sound like a family member in distress, asking for an urgent callback to a number that is not the family member\'s real one. The pre-recorded, one-way format lets scammers run many attempts at once and avoids the risk of a live conversation exposing inconsistencies. Always call the family member back at their known number, never one left in the message.',
    categorySlug: 'ai-deepfake-scams',
    alertLevel: 'high',
    sources: ['FTC Consumer Advice'],
  },
  {
    name: 'AI-Generated Fake Investment Company Website',
    slug: 'ai-generated-fake-investment-company-website',
    description:
      'Scammers use AI tools to quickly generate a professional-looking corporate website, complete with fabricated leadership bios, fake press mentions, and AI-written "research reports," lending instant legitimacy to an investment pitch that would once have taken months to fake convincingly. A polished site is no longer a reliable sign of legitimacy — checking a firm\'s actual registration with the SEC or FINRA remains necessary regardless of how professional the site looks.',
    categorySlug: 'ai-deepfake-scams',
    alertLevel: 'high',
    sources: ['SEC Office of Investor Education and Advocacy'],
  },
  {
    name: 'Fake Debt Validation Letter Scam',
    slug: 'fake-debt-validation-letter-scam',
    description:
      'A letter designed to look like an official debt collection notice demands immediate payment on a debt that may not be owed, may already be paid, or may not exist at all — often for a small enough amount that recipients pay rather than dispute it. Under the Fair Debt Collection Practices Act, you can request written validation of any debt before paying, and a real collector must provide it.',
    categorySlug: 'debt-relief-scams',
    alertLevel: 'medium',
    sources: ['Consumer Financial Protection Bureau'],
  },
  {
    name: 'Fake Wage Garnishment Notice Scam',
    slug: 'fake-wage-garnishment-notice-scam',
    description:
      'A caller or letter claims a court has already ordered your wages garnished over unpaid debt and demands an immediate payment or "processing fee" to stop it, relying on the fact that most people don\'t know real wage garnishment requires a court judgment and prior notice through the court system, not a phone call. Verify any garnishment claim directly with your local court, never through contact information the caller provides.',
    categorySlug: 'debt-relief-scams',
    alertLevel: 'high',
    sources: ['Consumer Financial Protection Bureau', 'FTC Consumer Advice'],
  },
  {
    name: 'Debt Relief "Pay Us Instead of Your Creditors" Scam',
    slug: 'debt-relief-escrow-account-scam',
    description:
      'A debt settlement company instructs customers to stop paying creditors directly and instead deposit monthly payments into a dedicated "settlement" account the company controls, promising to negotiate reduced payoffs — while collecting high upfront fees and, in fraudulent cases, simply keeping the deposited funds without ever contacting creditors. Federal rules prohibit debt-settlement companies from collecting most fees before actually settling a debt.',
    categorySlug: 'debt-relief-scams',
    alertLevel: 'high',
    sources: ['FTC Consumer Advice'],
  },
  {
    name: 'Advance-Fee Debt Consolidation Loan Scam',
    slug: 'advance-fee-debt-consolidation-loan-scam',
    description:
      'A company promises a guaranteed debt-consolidation loan regardless of credit history, but requires an upfront "processing," "insurance," or "collateral" fee before funding — the loan never materializes and the fee is not returned. A legitimate lender deducts its fees from loan proceeds rather than requiring payment before approval.',
    categorySlug: 'debt-relief-scams',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice'],
  },
  {
    name: 'Fake Credit Card Interest Rate Reduction Robocall',
    slug: 'fake-credit-card-interest-reduction-robocall',
    description:
      'A robocall claims to be able to lower your credit card interest rate through a "special program," but first requires your card number "to verify eligibility" or an upfront enrollment fee. No such universal program exists — the requested card number is used for unauthorized charges rather than any real rate negotiation. Rate negotiations happen directly with your card issuer, not a third-party robocall.',
    categorySlug: 'debt-relief-scams',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice'],
  },
  {
    name: 'Fake Life Insurance Beneficiary Change Scam',
    slug: 'fake-life-insurance-beneficiary-change-scam',
    description:
      'Someone impersonating an insurance agent contacts a policyholder, often an elderly one, claiming a routine "beneficiary verification" is required, and uses the call to redirect the policy\'s beneficiary designation to the scammer or an accomplice. Any beneficiary change should be confirmed directly with the insurer using a phone number from a genuine statement, never one provided by the caller.',
    categorySlug: 'insurance-fraud',
    alertLevel: 'high',
    sources: ['National Association of Insurance Commissioners'],
  },
  {
    name: 'Insurance "Assignment of Benefits" Contractor Scam',
    slug: 'insurance-assignment-of-benefits-contractor-scam',
    description:
      'A door-to-door contractor convinces a homeowner to sign an "assignment of benefits" form after a storm, transferring the homeowner\'s right to insurance payment directly to the contractor — who may then inflate repair estimates, file claims without the homeowner\'s ongoing input, or disappear after receiving payment before completing repairs. Homeowners should read any document fully before signing and can request time to review it with their insurer first.',
    categorySlug: 'insurance-fraud',
    alertLevel: 'medium',
    sources: ['National Association of Insurance Commissioners', 'FTC Consumer Advice'],
  },
  {
    name: 'Fake Rideshare Driver Commercial Insurance Scam',
    slug: 'fake-rideshare-driver-insurance-scam',
    description:
      'A caller or online ad targets rideshare and delivery drivers with a "special commercial coverage" policy claimed to be required to keep driving for the platform, priced attractively but never actually filed with a state insurance regulator and unable to pay a real claim. Drivers should verify commercial auto coverage requirements directly with their platform and confirm any insurer\'s license with their state\'s department of insurance.',
    categorySlug: 'insurance-fraud',
    alertLevel: 'medium',
    sources: ['National Association of Insurance Commissioners'],
  },
  {
    name: 'Fake Short-Term Health Plan Sold as ACA-Compliant',
    slug: 'fake-short-term-health-plan-scam',
    description:
      'A plan is marketed using language that implies full Affordable Care Act compliance and comprehensive coverage, but is actually a limited-duration short-term plan that excludes pre-existing conditions and caps payouts — leaving buyers with large uncovered medical bills a compliant marketplace plan would have paid. Confirming a plan\'s actual status directly on healthcare.gov before enrolling is the safest check.',
    categorySlug: 'insurance-fraud',
    alertLevel: 'medium',
    sources: ['Centers for Medicare & Medicaid Services', 'FTC Consumer Advice'],
  },
  {
    name: 'Fake Property Tax Deed Sale "Rescue" Scam',
    slug: 'fake-property-tax-deed-rescue-scam',
    description:
      'Homeowners behind on property taxes are approached by someone offering to "save" their home from an upcoming tax deed sale by taking over the deed temporarily and handling payments, in exchange for the homeowner signing over the property title — after which the homeowner is evicted or the promised repayment never happens. Legitimate tax-delinquency relief goes through the county tax office or a licensed attorney, not a stranger offering to hold the deed.',
    categorySlug: 'mortgage-foreclosure-scams',
    alertLevel: 'high',
    sources: ['Consumer Financial Protection Bureau'],
  },
  {
    name: 'Fake HOA Delinquency Lien Payoff Scam',
    slug: 'fake-hoa-delinquency-payoff-scam',
    description:
      'A letter or call claims a homeowner\'s association has placed a lien for unpaid dues and demands immediate payment to a third-party "resolution service" to avoid foreclosure — bypassing the actual HOA management company entirely and pocketing the payment without resolving any real lien. Homeowners should confirm any HOA lien claim directly with their HOA\'s actual management company using contact information from a prior legitimate statement.',
    categorySlug: 'mortgage-foreclosure-scams',
    alertLevel: 'medium',
    sources: ['Consumer Financial Protection Bureau'],
  },
  {
    name: 'Fake Federal Mortgage Modification Program Fee',
    slug: 'fake-federal-mortgage-modification-fee-scam',
    description:
      'A company claims to represent a federal mortgage modification program and requires an upfront fee to "process" the homeowner\'s application, though federal loan modification assistance is applied for directly through the loan servicer or HUD-approved housing counselors and does not charge homeowners fees. Any company demanding payment before providing mortgage relief services is violating federal rules.',
    categorySlug: 'mortgage-foreclosure-scams',
    alertLevel: 'medium',
    sources: ['Consumer Financial Protection Bureau', 'U.S. Department of Housing and Urban Development'],
  },
  {
    name: 'Fake Law Enforcement Sextortion Threat',
    slug: 'fake-law-enforcement-sextortion-threat',
    description:
      'After obtaining or fabricating compromising images, a scammer poses as a police officer or federal investigator, claiming the victim is under investigation for a sex crime and demanding payment to make the "case" disappear — layering a fake legal threat on top of the original extortion to increase pressure and reduce the odds a victim seeks real law enforcement help. Real law enforcement never resolves a criminal investigation through a private payment.',
    categorySlug: 'sextortion',
    alertLevel: 'critical',
    sources: ['FBI IC3'],
  },
  {
    name: 'Compromised Dating App Video Call Sextortion',
    slug: 'compromised-dating-app-sextortion',
    description:
      'A scammer builds trust on a dating app and convinces a match to move to video chat, secretly recording the session (sometimes playing a pre-recorded clip of someone else to solicit compromising responses), then threatens to send the recording to the victim\'s contacts unless paid. Declining to move to video with someone not yet met in person, and reporting the account to the platform rather than paying, is the recommended response.',
    categorySlug: 'sextortion',
    alertLevel: 'critical',
    sources: ['FBI IC3'],
  },
  {
    name: 'Sextortion Targeting Minors via Gaming Platforms',
    slug: 'gaming-platform-minor-sextortion',
    description:
      'A scammer poses as a peer on a gaming or messaging platform popular with teenagers, builds a quick rapport, and convinces the minor to share a compromising image, then immediately threatens to send it to the minor\'s friends and family unless paid or given more images. The FBI has specifically warned this pattern has driven both financial losses and, tragically, some victim suicides — reporting to NCMEC\'s CyberTipline and law enforcement immediately, without paying, is the recommended response.',
    categorySlug: 'sextortion',
    alertLevel: 'critical',
    sources: ['FBI IC3', 'National Center for Missing & Exploited Children'],
  },
  {
    name: 'Fake Airline Flight Cancellation Rebooking Email',
    slug: 'fake-airline-flight-cancellation-phishing-email',
    description:
      'An email formatted to look like an airline notice claims your upcoming flight was canceled and asks you to click a link to rebook or request a refund, leading to a fake login page that harvests frequent-flyer credentials and payment details. Airlines notify real cancellations through their official app and the verified email on file — checking your booking directly on the airline\'s real site is the safer path.',
    categorySlug: 'phishing',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice'],
  },
  {
    name: 'Fake Browser Lock Screen Scam',
    slug: 'fake-browser-lockscreen-scam',
    description:
      'Visiting a compromised or malicious webpage triggers a full-screen popup that locks the browser and displays a fake warning claiming the device is infected or that law enforcement has detected illegal content, listing a phone number to call for "removal." The page is designed to be difficult to close and to panic the visitor into calling; force-closing the browser or restarting the device resolves it without ever needing to call the listed number.',
    categorySlug: 'tech-support-scams',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice'],
  },
  {
    name: 'Overseas Contractor Project Romance Scam',
    slug: 'overseas-contractor-project-romance-scam',
    description:
      'A scammer\'s profile claims to be an engineer or contractor working on an overseas project — an oil rig, a construction site, a shipping vessel — using the remote location to explain unusual hours and poor connectivity, before requesting money for a supposed project-related emergency, customs fee, or medical bill. The core red flag is the same as any romance scam: a partner never met in person asking for money tied to their claimed job.',
    categorySlug: 'romance-scams',
    alertLevel: 'high',
    sources: ['FTC Consumer Advice'],
  },
  {
    name: 'Fake People-Search Site Data Removal Scam',
    slug: 'fake-people-search-data-removal-scam',
    description:
      'An email or ad claims your personal information was found exposed on a people-search or data-broker site and offers to remove it for a fee, while actually just linking to (or being) the very site collecting and reselling that data, or simply taking payment without removing anything. Most legitimate data brokers offer a free opt-out request process directly on their own site.',
    categorySlug: 'identity-theft',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice'],
  },
  {
    name: 'Fake Limited-Drop Sneaker or Collectible Resale Scam',
    slug: 'fake-limited-drop-resale-scam',
    description:
      'A social media ad or storefront offers a highly sought-after, limited-release sneaker, collectible, or electronics item at a below-market price with urgent "few left" messaging, taking payment through a non-reversible method and never shipping a real item. Checking a seller\'s reviews on an independent platform, not just testimonials on their own site, and using a payment method with buyer protection are the main defenses.',
    categorySlug: 'online-shopping-scams',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice'],
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
      `INSERT INTO scams (name, slug, description, category_id, alert_level, is_active, sources, country, is_historical, first_recorded)
       VALUES ($1, $2, $3, (SELECT id FROM categories WHERE slug = $4), $5, true, $6, $7, $8, $9)
       ON CONFLICT (slug) DO NOTHING`,
      [
        scam.name,
        scam.slug,
        scam.description,
        scam.categorySlug,
        scam.alertLevel ?? null,
        scam.sources,
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
    agency_name: 'Action Fraud (National Fraud Intelligence Bureau)',
    country: 'GB',
    country_name: 'United Kingdom',
    url: 'https://www.actionfraud.police.uk/fraud-stats',
    description:
      "The UK's national fraud and cybercrime reporting service, run by the City of London Police. Publishes a public fraud statistics page; the underlying case data feeds law enforcement's National Fraud Intelligence Bureau, not a public API.",
    data_type: 'public_stats',
  },
  {
    agency_name: 'CERT NZ (National Cyber Security Centre)',
    country: 'NZ',
    country_name: 'New Zealand',
    url: 'https://www.cert.govt.nz/insights-and-research/quarterly-report/',
    description:
      "New Zealand's government cyber security response agency. Publishes quarterly \"Cyber Security Insights\" reports covering reported scam, phishing, and fraud activity; scam reports for the public also route through the non-profit Netsafe.",
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
    agency_name: 'National Consumer Affairs Center of Japan (NCAC)',
    country: 'JP',
    country_name: 'Japan',
    url: 'https://www.kokusen.go.jp/',
    description:
      "Japan's national consumer affairs body, reachable via the nationwide #188 hotline that routes callers to their local consumer center. Cyber-specific fraud is separately handled by the National Police Agency and the Japan Cybercrime Control Center (JC3).",
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
