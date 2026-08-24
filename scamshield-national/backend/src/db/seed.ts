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
  {
    title: 'Ruja Ignatova, the "Cryptoqueen" Behind OneCoin, and the $4 Billion That Vanished With Her',
    slug: 'ruja-ignatova-onecoin-cryptoqueen-fraud',
    author: 'ScamShield Editorial',
    tags: ['notorious', 'notorious-scammer'],
    body: `Ruja Ignatova launched OneCoin in 2014, marketing it worldwide as a revolutionary cryptocurrency positioned to rival Bitcoin, sold through a multi-level-marketing structure that rewarded members for recruiting new investors as much as for the coin itself. Filling packed arenas across Europe, Asia, and Africa with the confidence of a tech visionary, she built OneCoin into a global operation that took in an estimated $4 billion or more from investors before anyone could verify the one thing the entire pitch depended on.

That verification never came, because it couldn't: OneCoin had no genuine blockchain. Investigators later determined the "coin" existed only in a centralized, editable database controlled by the company — the digital equivalent of a private ledger with invented numbers, sold to true believers as decentralized, unforgeable currency. There was nothing behind the price chart members watched climb on their own screens.

In October 2017, with a German arrest warrant issued and prosecutors closing in, Ignatova boarded a flight to Athens and has not been reliably seen in public since. The FBI added her to its Ten Most Wanted Fugitives list in 2022 — a rare distinction for a woman, and for a financial crime rather than a violent one — with a reward for information leading to her capture that the agency raised to $5 million in 2024. Her co-founder, Karl Sebastian Greenwood, was convicted in the United States and sentenced to 20 years in prison in 2023; Ignatova, wherever she is, has never faced trial.

OneCoin is a useful case precisely because the fraud wasn't a subtle accounting trick — it was a claim anyone technical enough could have checked, wrapped in exactly the kind of packed-stadium confidence and multi-level recruitment structure that makes checking feel unnecessary. Years after her disappearance, the money is still gone, the "coin" never existed, and the woman who sold it to millions of people remains, as far as anyone can verify, missing.`,
  },
  {
    title: 'Michael Milken, the "Junk Bond King," and the Insider-Trading Scheme That Took Down Drexel Burnham',
    slug: 'michael-milken-junk-bond-king-fraud',
    author: 'ScamShield Editorial',
    tags: ['notorious', 'notorious-scammer', 'historical'],
    body: `Michael Milken built the high-yield "junk bond" market at Drexel Burnham Lambert into one of the most powerful financing engines on Wall Street through the 1980s, using it to fund the era's wave of corporate takeovers and leveraged buyouts. At his peak he was reportedly the highest-paid person in America, earning hundreds of millions of dollars a year and wielding influence that let him reshape entire industries from his famous "X-shaped" trading desk in Beverly Hills.

Behind the legitimate bond business, prosecutors found a web of illegal activity: insider trading, stock parking (secretly using an associate — fellow financier Ivan Boesky — to hide the true ownership of shares), and market manipulation designed to benefit Milken's own trades and clients ahead of the public. The scheme surfaced through the investigation into Boesky, who cooperated with prosecutors after his own insider-trading conviction and helped implicate Milken directly.

Milken was indicted in 1989 on 98 counts of securities fraud and racketeering. He pleaded guilty to six felony counts, was sentenced to 10 years in prison (of which he served about 22 months), paid $600 million in fines and restitution, and was permanently barred from the securities industry. Drexel Burnham Lambert itself collapsed into bankruptcy in 1990, at the time the largest failure of a Wall Street investment bank in history. Milken later received a controversial presidential pardon in 2020, following decades spent funding medical research and rebuilding his public reputation through the Milken Institute.

The case remains a foundational reference point for insider trading and securities fraud investigations — proof that even a financier who genuinely revolutionized a market can also be running a parallel scheme to rig it, and a reminder that philanthropy and a rehabilitated public image, however extensive, are not the same thing as having fully answered for the original conduct.`,
  },
  {
    title: 'Sam Israel III and the Bayou Hedge Fund Fraud That Ended in a Faked Suicide',
    slug: 'sam-israel-bayou-hedge-fund-fraud',
    author: 'ScamShield Editorial',
    tags: ['notorious', 'notorious-scammer', 'historical'],
    body: `Sam Israel III founded the Bayou Hedge Fund Group in 1996, reporting steady, market-beating returns to investors year after year. Behind those numbers, the fund was actually losing money almost from the start; Israel and an accomplice covered the losses by creating a fake accounting firm to produce audited-looking statements that bore no relationship to the fund's real performance, a nearly identical mechanism to the fabricated audits later found at Bernie Madoff's and Lou Pearlman's operations.

The fraud, totaling roughly $450 million, collapsed in 2005 when Israel confessed to investigators. He pleaded guilty to fraud charges and was sentenced in 2008 to 20 years in federal prison. On the day he was scheduled to surrender, Israel instead drove to a bridge over the Hudson River, abandoned his SUV with the words "suicide is painless" — the theme from M*A*S*H — scratched into the dust on the hood, and disappeared with his girlfriend in a camper van, apparently hoping to be presumed dead.

The plan unraveled after roughly a month on the run: following a segment on America's Most Wanted, Israel turned himself in to police. For faking his own death and fleeing justice, he received an additional two years on top of his original 20-year sentence.

Sam Israel's story is a near-exact echo of Marcus Schrenker's staged plane crash a few years later — two financial fraudsters who, facing the consequence of years of fabricated numbers, each concluded that disappearing was more survivable than serving the sentence, and each was caught within weeks. The fake audits bought Israel a decade of runway; the fake death bought him almost nothing.`,
  },
  {
    title: 'Bernard Ebbers and the $11 Billion Accounting Fraud That Sank WorldCom',
    slug: 'bernard-ebbers-worldcom-accounting-fraud',
    author: 'ScamShield Editorial',
    tags: ['notorious', 'notorious-scammer', 'historical'],
    body: `Bernard Ebbers built WorldCom from a small Mississippi long-distance reseller into the second-largest telecommunications company in the United States through the 1990s, fueled by an aggressive string of acquisitions, including its $37 billion purchase of MCI. When the telecom industry's growth slowed at the turn of the century, WorldCom's stock price — and Ebbers' own heavily leveraged personal fortune, much of it borrowed against WorldCom shares — depended on the company continuing to look like it was growing.

Rather than report the slowdown, WorldCom's finance team, under pressure from Ebbers and CFO Scott Sullivan, disguised it. Billions of dollars in ordinary operating expenses were improperly reclassified as capital expenditures, a bookkeeping shift that spread costs out over years instead of counting them immediately — making the company appear consistently profitable when it was not. By the time the fraud was uncovered by an internal auditor in June 2002, the misstatement totaled roughly $11 billion, the largest accounting fraud in U.S. history at the time.

WorldCom filed for bankruptcy weeks later — then the largest corporate bankruptcy in U.S. history — wiping out shareholders and costing thousands of employees their jobs. Ebbers was convicted in March 2005 on charges of fraud, conspiracy, and false regulatory filings, and was sentenced to 25 years in prison. He was released in 2019 on compassionate grounds due to declining health and died the following year.

WorldCom, alongside Enron the same year, became a defining case for corporate accounting reform, directly driving passage of the Sarbanes-Oxley Act, which imposed new financial-reporting and internal-control requirements on public companies. It remains a reference point for how a fraud built entirely out of a bookkeeping classification — nothing as dramatic as a fake product or a forged signature — can still cost more than almost any other kind of scam on this list.`,
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
  },
  {
    title: '"Pharma Bro" Martin Shkreli and the Hedge Fund Losses He Hid Behind a Public Company',
    slug: 'martin-shkreli-securities-fraud',
    author: 'ScamShield Editorial',
    tags: ['notorious', 'notorious-scammer'],
    body: `Martin Shkreli became infamous in 2015 as the "Pharma Bro" who raised the price of a life-saving drug, Daraprim, by over 5,000% overnight as CEO of Turing Pharmaceuticals — a legal, if widely condemned, business decision. The securities fraud that actually sent him to prison had nothing to do with drug pricing, and predates that scandal by several years.

Before Turing, Shkreli ran two hedge funds, MSMB Capital and MSMB Healthcare, and told investors they were performing well when in fact both had lost nearly all their money. To cover the losses and keep raising money, prosecutors showed, Shkreli fabricated account statements and used funds from investors in his next venture, the biopharmaceutical company Retrophin, to quietly pay back the earlier hedge fund investors — money that was supposed to be capitalizing Retrophin's business, not settling Shkreli's prior obligations.

A federal jury convicted Shkreli in August 2017 on two counts of securities fraud and one count of conspiracy, while acquitting him on other counts. He was sentenced in March 2018 to seven years in prison and ordered to forfeit nearly $7.4 million. He was released in 2022, and a separate civil case brought by the FTC and several states barred him for life from the pharmaceutical industry over the Daraprim price increase.

Shkreli's case is a reminder that the conduct that makes headlines and the conduct that results in a conviction aren't always the same thing — his fraud was a fairly conventional hedge-fund shell game, dressed up and hidden inside the accounts of a company whose public investors had no idea they were the ones ultimately paying for it.`,
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
  },
  {
    title: 'Jérôme Kerviel and the €4.9 Billion Trade Société Générale Never Approved',
    slug: 'jerome-kerviel-societe-generale-rogue-trader',
    author: 'ScamShield Editorial',
    tags: ['notorious', 'notorious-scammer', 'historical'],
    body: `Jérôme Kerviel worked as a junior trader on the futures desk at Société Générale, one of France's largest banks, a job that gave him direct knowledge of the bank's internal risk-control systems from an earlier role in its back office. Starting around 2005, he began placing unauthorized bets on European stock index futures far beyond his trading limits — and used that back-office knowledge to fake offsetting trades that made his real, unhedged positions disappear from the bank's risk reports.

For a time, some of the hidden bets were profitable, briefly making Kerviel look like a star performer. But by January 2008, his concealed positions had grown to nearly €50 billion — more than the bank's entire market value — betting that European markets would keep rising. When the bank's compliance team finally uncovered the fraud and was forced to unwind the position during a market downturn, it locked in a loss of roughly €4.9 billion, at the time the largest trading loss ever caused by a single individual.

Kerviel was convicted in October 2010 of forgery, breach of trust, and unauthorized computer use, and sentenced to three years in prison plus a suspended term; French courts also initially ordered him to repay the full €4.9 billion, though a later appeal reduced that damages award. He maintained throughout that his managers knew, informally, that traders routinely exceeded their limits as long as they were profitable — a defense the courts rejected, though it echoed the argument several other rogue-trading cases have made since.

The Kerviel case became a defining example, alongside Nick Leeson's collapse of Barings Bank over a decade earlier, of how a single trader with enough insider knowledge of a bank's own controls can hide a catastrophic position in plain sight — and of how thin the line can be between a trader deceiving their employer and an employer that simply didn't want to look too closely while the trades were winning.`,
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
  },
  {
    title: '"Crazy Eddie" Antar and the Stock Fraud Behind the Wildest Ads on TV',
    slug: 'eddie-antar-crazy-eddie-stock-fraud',
    author: 'ScamShield Editorial',
    tags: ['notorious', 'notorious-scammer', 'historical'],
    body: `Eddie Antar built Crazy Eddie into one of the most recognizable electronics retail chains in the New York area during the 1970s and '80s, fronted by manic, unmistakable TV commercials promising prices so low they were "INSAAAANE." Behind the storefront, Antar and his family ran a cash-skimming operation for years before the company ever went public in 1984 — quietly pocketing a portion of cash sales and underreporting income to shrink the company's tax bill.

Once Crazy Eddie went public, that same cash Antar had been skimming away suddenly needed to reappear — reported income now needed to look as large as possible to keep the stock price climbing, the opposite incentive from the company's private years. Antar's team began funneling the hidden cash back into the business, falsifying inventory counts, and inflating sales figures at key stores, creating an inventory shortfall investigators later estimated between $40 and $50 million. As the manufactured growth pushed the stock higher, Antar and his family sold off more than $20 million of their own shares to an investing public that had no idea the underlying numbers were fabricated.

The fraud collapsed after a hostile takeover in 1987 gave new owners access to the real books. Facing charges, Antar fled the United States in February 1990, triggering a two-year international manhunt involving the FBI, U.S. Marshals, the SEC, and Interpol before he was located in Israel in 1992 and extradited back to the U.S. the following year. He pleaded guilty to racketeering conspiracy in 1996 and was sentenced to eight years in prison; a related SEC civil judgment held him liable for more than $57 million in disgorgement and interest.

Crazy Eddie's collapse became a staple case study in forensic accounting precisely because the fraud ran in two directions — hiding income before the IPO, then inventing it afterward — showing how the same underlying scheme can flip its entire purpose the moment a private company's incentives change by going public.`,
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
  },
  {
    title: 'Raj Rajaratnam and the Wiretaps That Ended Insider Trading\'s Quiet Era',
    slug: 'raj-rajaratnam-galleon-insider-trading',
    author: 'ScamShield Editorial',
    tags: ['notorious', 'notorious-scammer', 'historical'],
    body: `Raj Rajaratnam founded the Galleon Group, one of the largest hedge funds in the world at its peak, managing billions of dollars built on what looked like an exceptional research edge. In reality, that edge came substantially from a network of corporate insiders — executives and consultants at companies including IBM, Intel, and Goldman Sachs — whom Rajaratnam cultivated to feed him confidential, market-moving information before it became public.

Rajaratnam would trade on tips about upcoming earnings results, mergers, and other corporate events before the information reached the market, generating profits and avoided losses prosecutors calculated at more than $63 million. What made the case unprecedented was how investigators caught him: rather than building a case solely from suspicious trading patterns after the fact, the FBI obtained wiretaps on Rajaratnam's phone, capturing roughly 2,200 conversations in which he discussed and received inside information in real time — a technique long used in organized-crime and drug cases but never before deployed at this scale against Wall Street insider trading.

Rajaratnam was convicted in May 2011 on 14 counts of securities fraud and conspiracy following a trial built heavily on the wiretap recordings, and was sentenced to 11 years in prison — at the time the longest sentence ever imposed for insider trading — along with a $10 million fine and forfeiture of $53.8 million. The Supreme Court later declined to hear his appeal challenging the case.

The Galleon case reshaped how insider trading gets prosecuted: the wiretap evidence was so effective that federal prosecutors used the same approach in dozens of subsequent Wall Street cases, turning what had been a largely circumstantial, trading-pattern-based crime to prove into one that could be caught on tape, in the insider's own words, while it was happening.`,
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
      `INSERT INTO articles (title, slug, body, author, tags, source_url, published, published_at)
       VALUES ($1, $2, $3, $4, $5, $6, true, NOW())
       ON CONFLICT (slug) DO NOTHING`,
      [article.title, article.slug, article.body, article.author, article.tags, article.sourceUrl ?? null]
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
  {
    name: 'Fake Vaccine Card Sale Scam',
    slug: 'fake-vaccine-card-sale-scam',
    description:
      'Sellers on social media and online marketplaces offer blank or falsified vaccination cards for purchase, letting buyers falsely claim vaccination status without ever receiving a real vaccine. Beyond the fraud itself, buyers can face criminal charges for using a forged government-associated document, and gain none of the actual immune protection the card claims to represent.',
    categorySlug: 'healthcare-fraud',
    alertLevel: 'medium',
    sources: ['FBI IC3'],
  },
  {
    name: 'Fake Durable Medical Equipment Billing Scam',
    slug: 'fake-durable-medical-equipment-billing-scam',
    description:
      'A caller claiming to represent Medicare or a medical supply company offers a "free" back brace, knee brace, or other durable medical equipment, then bills Medicare thousands of dollars for equipment that is never delivered, medically unnecessary, or far more expensive than what was actually shipped. Beneficiaries should review their Medicare Summary Notice for equipment they never requested or received.',
    categorySlug: 'healthcare-fraud',
    alertLevel: 'high',
    sources: ['HHS Office of Inspector General', 'Centers for Medicare & Medicaid Services'],
  },
  {
    name: 'Fake Hospital Billing Overdue Debt Call',
    slug: 'fake-hospital-billing-overdue-debt-call',
    description:
      'A caller claims to be from a hospital\'s billing department, states an old medical bill is overdue and about to go to collections, and demands immediate payment by gift card or wire transfer — using real-sounding hospital names and enough personal detail, sometimes from a genuine prior visit, to seem credible. Real hospital billing offices send written statements and do not demand payment by gift card.',
    categorySlug: 'healthcare-fraud',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice'],
  },
  {
    name: 'Fake At-Home Health Testing Kit Upsell Scam',
    slug: 'fake-at-home-testing-kit-upsell-scam',
    description:
      'An ad offers a free at-home genetic, cardiac, or diabetic testing kit shipped directly to Medicare beneficiaries, but signing up for the "free" kit also enrolls the recipient in recurring monthly billing to Medicare for unnecessary follow-up testing or supplies never authorized by a treating doctor. Beneficiaries should be cautious of any health testing offer that arrives unsolicited rather than through their own physician.',
    categorySlug: 'healthcare-fraud',
    alertLevel: 'medium',
    sources: ['HHS Office of Inspector General'],
  },
  {
    name: 'Fake State Tax Refund Verification Text',
    slug: 'fake-state-tax-refund-verification-text',
    description:
      'A text message claims your state tax refund is on hold pending "identity verification" and links to a fake state revenue department login page that harvests your Social Security number and banking details. State tax agencies communicate refund holds through mailed letters, not unsolicited text links.',
    categorySlug: 'tax-scams',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice'],
  },
  {
    name: 'Fake Tax Preparer Refund Skimming Scheme',
    slug: 'fake-tax-preparer-refund-skimming-scheme',
    description:
      'A paid tax preparer files a client\'s return accurately but quietly changes the direct deposit information to route all or part of the refund into an account the preparer controls, then tells the client the refund is delayed or smaller than expected. Checking your refund status directly on the IRS "Where\'s My Refund" tool, independent of what your preparer tells you, can catch this early.',
    categorySlug: 'tax-scams',
    alertLevel: 'high',
    sources: ['Internal Revenue Service', 'FTC Consumer Advice'],
  },
  {
    name: 'Fake IRS "Offer in Compromise" Fee Scam',
    slug: 'fake-irs-offer-in-compromise-fee-scam',
    description:
      'A company advertises the ability to "settle your tax debt for pennies on the dollar" through the IRS\'s real Offer in Compromise program, charging a large upfront fee for an application most applicants don\'t actually qualify for, then doing little or no real work on the case. The IRS itself publishes free eligibility tools and accepts applications directly without requiring a paid intermediary.',
    categorySlug: 'tax-scams',
    alertLevel: 'medium',
    sources: ['Internal Revenue Service', 'FTC Consumer Advice'],
  },
  {
    name: 'Fake W-2 Phishing Email to Employers',
    slug: 'fake-w2-phishing-email-to-employer',
    description:
      'An email impersonating a company executive asks a payroll or HR employee to send a PDF of all employee W-2 forms for "an urgent audit," aiming to harvest an entire workforce\'s Social Security numbers and wages in one message rather than targeting individuals one at a time. Payroll staff should verify any bulk request for tax documents through a separate communication channel before sending.',
    categorySlug: 'tax-scams',
    alertLevel: 'high',
    sources: ['Internal Revenue Service', 'FBI IC3'],
  },
  {
    name: 'Fake Passport Renewal "Expedite Fee" Scam',
    slug: 'fake-passport-renewal-expedite-fee-scam',
    description:
      'A website designed to closely resemble the official State Department passport portal charges a large "expedite" fee for faster processing, when the real expedited service fee is paid directly to the government at a fraction of the cost, if it is needed at all. Passport applications should only be filed through travel.state.gov or an authorized in-person acceptance facility.',
    categorySlug: 'government-impersonation',
    alertLevel: 'medium',
    sources: ['U.S. Department of State'],
  },
  {
    name: 'Fake FTC / State Attorney General Refund Notice Call',
    slug: 'fake-ftc-refund-notice-call',
    description:
      'A caller claims to represent the FTC or a state attorney general\'s office, stating the recipient is owed a refund from a real settlement but must first pay a processing fee or provide bank details to receive it. The FTC never asks for payment or account information to distribute a legitimate settlement refund — real refund checks or prepaid cards simply arrive without any advance fee.',
    categorySlug: 'government-impersonation',
    alertLevel: 'medium',
    sources: ['Federal Trade Commission'],
  },
  {
    name: 'Fake Selective Service Registration Fine Call',
    slug: 'fake-selective-service-fine-call',
    description:
      'A caller claims a young man failed to register with Selective Service as legally required and threatens an immediate fine or arrest unless paid over the phone, playing on the fact that many recipients are genuinely unsure whether they registered. Selective Service registration status can be verified directly and for free at sss.gov, and the agency does not collect fines by phone.',
    categorySlug: 'government-impersonation',
    alertLevel: 'medium',
    sources: ['Selective Service System'],
  },
  {
    name: 'Fake Law Firm Wire Instruction Email',
    slug: 'fake-law-firm-wire-instruction-email',
    description:
      'During a real estate closing or business transaction, a scammer who has compromised or spoofed a law firm\'s email sends updated wire instructions redirecting a client\'s payment to an account the scammer controls, timed to arrive right before a genuine deadline to discourage careful verification. Any changed wire instructions, especially those arriving close to a deadline, should be confirmed by phone using a number from a prior, verified communication.',
    categorySlug: 'business-email-compromise',
    alertLevel: 'high',
    sources: ['FBI IC3'],
  },
  {
    name: 'Fake Payroll Provider Login Credential Phishing',
    slug: 'fake-payroll-provider-credential-phishing',
    description:
      'An email impersonating a company\'s payroll software provider asks an employee to log in to "verify" their direct deposit details, leading to a fake login page that harvests the employee\'s actual payroll portal credentials — which the scammer then uses to redirect the employee\'s own paycheck. Employees should navigate to payroll systems directly by typing the URL rather than clicking email links.',
    categorySlug: 'business-email-compromise',
    alertLevel: 'high',
    sources: ['FBI IC3'],
  },
  {
    name: 'Fake Domain Renewal Invoice to Business Owner',
    slug: 'fake-domain-renewal-invoice-scam',
    description:
      'An official-looking invoice claims a company\'s website domain or business listing is about to expire and must be renewed immediately through the sender, at a price far above the real registrar\'s rate — and paying it may not even renew the actual domain, leaving the real registration to lapse. Domain renewals should only be handled directly through the registrar the domain was originally purchased from.',
    categorySlug: 'business-email-compromise',
    alertLevel: 'low',
    sources: ['FTC Consumer Advice'],
  },
  {
    name: 'Fake "Delivery Address Confirmation" Smishing Text',
    slug: 'fake-delivery-address-confirmation-text',
    description:
      'A text claims a package cannot be delivered because of an incomplete address and asks the recipient to click a link to "confirm" their address, leading to a page that harvests personal information and a small "redelivery fee" payment used to test a stolen card number. Carriers do not request address confirmation through unsolicited text links.',
    categorySlug: 'package-delivery-scams',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice'],
  },
  {
    name: 'Fake Package Held at Customs Warehouse Scam',
    slug: 'fake-package-held-customs-warehouse-scam',
    description:
      'A text or email claims an international package is being held at a customs warehouse pending a duty or storage fee payment, with a countdown timer designed to create urgency, though no real package exists — the message is sent broadly regardless of whether the recipient is expecting any shipment at all. Legitimate customs holds are handled by the shipping carrier through their official app or website, never an unsolicited link.',
    categorySlug: 'package-delivery-scams',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice'],
  },
  {
    name: 'Porch Piracy Tracking-Number Phishing Follow-Up',
    slug: 'porch-piracy-tracking-phishing-followup',
    description:
      'After a real package is stolen from a porch, the victim who posts about it publicly, or searches for the tracking number online, is targeted by a scammer offering to help "track" or "recover" the package through a link that actually harvests login credentials or payment information. Real carrier claims are filed directly through the carrier\'s own claims process, not a link offered by a stranger.',
    categorySlug: 'package-delivery-scams',
    alertLevel: 'low',
    sources: ['FTC Consumer Advice'],
  },
  {
    name: 'Fake Reshipping / Package Forwarding Job Scam',
    slug: 'fake-reshipping-job-scam',
    description:
      'A "work from home" job offer asks the new hire to receive packages at their home and reship them to another address, often overseas, in exchange for a fee — the packages typically contain merchandise purchased with stolen credit cards, and the reshipper can face real legal liability for handling stolen goods, even unknowingly. A job that consists entirely of receiving and reshipping other people\'s packages is a strong sign of a money-mule or fencing operation.',
    categorySlug: 'employment-scams',
    alertLevel: 'high',
    sources: ['FBI IC3'],
  },
  {
    name: 'Fake Employer Equipment Reimbursement Check Scam',
    slug: 'fake-employer-equipment-reimbursement-check-scam',
    description:
      'A new remote-work hire is sent a check to cover the cost of home-office equipment, told to deposit it and use the funds to purchase equipment from a specific vendor — the check later bounces after the funds have already been spent or wired, leaving the new hire liable for the full amount. Legitimate employers typically purchase or ship equipment directly rather than sending a check for the employee to spend on their behalf.',
    categorySlug: 'employment-scams',
    alertLevel: 'high',
    sources: ['FTC Consumer Advice'],
  },
  {
    name: 'Fake LinkedIn Recruiter Direct-Message Job Scam',
    slug: 'fake-linkedin-recruiter-job-scam',
    description:
      'A scammer creates a convincing recruiter profile on a professional networking site and messages job seekers directly with an unusually easy, high-paying remote offer, moving the conversation to a messaging app quickly and eventually asking for an upfront fee for training, equipment, or background-check processing. Verifying a recruiter\'s identity through the company\'s official careers page or a mutual connection before sharing any personal information is the key defense.',
    categorySlug: 'employment-scams',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice'],
  },
  {
    name: 'Fake Disaster-Relief Crowdfunding Clone',
    slug: 'fake-disaster-relief-crowdfunding-clone',
    description:
      'Within hours of a major disaster making news, a scammer creates a crowdfunding page using real photos of the disaster and a sympathetic but fabricated personal story, soliciting donations that go directly to the scammer rather than any victim. Donors should look for verified, platform-confirmed fundraisers or give directly to established relief organizations instead of an unverified individual page.',
    categorySlug: 'charity-scams',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice'],
  },
  {
    name: 'Fake Children\'s Hospital Donation Call',
    slug: 'fake-childrens-hospital-donation-call',
    description:
      'A caller claims to represent a well-known children\'s hospital or pediatric cancer charity and asks for an immediate donation over the phone, sometimes using a name deliberately similar to a real, respected institution. Donors can verify a charity\'s legitimacy and how it spends its funds through independent sites like Charity Navigator or the BBB Wise Giving Alliance before donating.',
    categorySlug: 'charity-scams',
    alertLevel: 'medium',
    sources: ['Federal Trade Commission'],
  },
  {
    name: 'Fake Charity Text-to-Donate Scam',
    slug: 'fake-charity-text-to-donate-scam',
    description:
      'A text message asks the recipient to donate to a charitable cause by texting a keyword to a short code, but the number and keyword are not affiliated with any real registered charity — donations are instead billed to the recipient\'s phone account and pocketed directly. Legitimate text-to-donate campaigns are set up through a charity\'s own verified short code, listed on the charity\'s official website.',
    categorySlug: 'charity-scams',
    alertLevel: 'low',
    sources: ['FTC Consumer Advice'],
  },
  {
    name: 'Fake State Lottery Commission Winner Letter',
    slug: 'fake-state-lottery-commission-letter',
    description:
      'A physical letter designed to look like official state lottery commission stationery informs the recipient they\'ve won a prize in a lottery they never entered, requiring a "release fee," "tax prepayment," or "processing fee" sent before the prize can be delivered. Real lottery winnings are never released only after the winner sends money first — taxes on winnings, where owed, are withheld from the prize itself.',
    categorySlug: 'lottery-sweepstakes-scams',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice'],
  },
  {
    name: 'Fake Social Media Giveaway Winner DM Scam',
    slug: 'fake-social-media-giveaway-winner-dm-scam',
    description:
      'A direct message claims the recipient has won a giveaway hosted by a real, recognizable brand or influencer, asking for a small "shipping fee" or personal information to claim a prize such as free electronics or gift cards — the account is typically an impersonation, not the brand\'s actual verified page. Checking whether the brand\'s verified account has announced any such giveaway is a fast way to confirm it is fake.',
    categorySlug: 'lottery-sweepstakes-scams',
    alertLevel: 'low',
    sources: ['FTC Consumer Advice'],
  },
  {
    name: 'Fake Sweepstakes Certified-Check Overpayment Scam',
    slug: 'fake-sweepstakes-certified-check-overpayment-scam',
    description:
      'A sweepstakes "winner" notification arrives with a real-looking certified check for far more than the promised prize amount, along with instructions to deposit it and wire back the difference to cover "taxes" or "fees" — the check later bounces after the wired funds are already gone, leaving the victim liable for the full amount deposited. No legitimate sweepstakes requires the winner to send money back after receiving a prize check.',
    categorySlug: 'lottery-sweepstakes-scams',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice'],
  },
  {
    name: 'Dating App Blackmail Threatening to "Out" a Victim',
    slug: 'dating-app-outing-blackmail-scam',
    description:
      'A scammer connects with a victim through a dating app, quickly moves to explicit photos or video, then threatens to send the material to the victim\'s family, employer, or public contacts unless paid — deliberately targeting victims, often closeted gay or bisexual men, who may feel they have less recourse to involve police for fear of being outed. Law enforcement agencies have specifically flagged this pattern; reporting to the platform and to law enforcement, without paying, remains the recommended response regardless of any fear about exposure.',
    categorySlug: 'sextortion',
    alertLevel: 'critical',
    sources: ['FBI IC3'],
  },
  {
    name: 'Sextortion Escalation with a Physical-Address Threat',
    slug: 'sextortion-physical-address-threat-escalation',
    description:
      'After an initial sextortion demand is paid or refused, some scammers escalate by revealing they have found the victim\'s home address or workplace — usually through public records or social media, not any special access — using the new threat of in-person exposure to extract further payments. Escalating threats are a sign the scammer is testing what generates a reaction, not evidence of real physical danger tied to non-payment; continuing to refuse payment and reporting to law enforcement remains the guidance even after this kind of escalation.',
    categorySlug: 'sextortion',
    alertLevel: 'high',
    sources: ['FBI IC3'],
  },
  {
    name: 'Group Chat Screenshot Extortion Scam',
    slug: 'group-chat-screenshot-extortion-scam',
    description:
      'A scammer joins a group chat or private server on a messaging or gaming platform, waits for a member to share a compromising image within what feels like a trusted small group, then screenshots it and uses it for extortion outside the group — exploiting the false sense of privacy a small, seemingly friendly group chat creates. Treating any image shared in a group chat as potentially permanent and screenshot-able, regardless of how trusted the group feels, is the practical defense.',
    categorySlug: 'sextortion',
    alertLevel: 'high',
    sources: ['FBI IC3'],
  },
  {
    name: 'Fake Rent-to-Own Scam on a Vacant Foreclosed Home',
    slug: 'fake-rent-to-own-vacant-foreclosure-scam',
    description:
      'A scammer identifies a vacant home in foreclosure, often found through public foreclosure filings, then poses as the owner or a property manager and rents or offers a "rent-to-own" agreement on the home to an unsuspecting tenant, collecting a security deposit and first month\'s rent for a property the scammer has no legal right to lease. Prospective tenants can verify actual ownership through their county property records office before signing any lease.',
    categorySlug: 'mortgage-foreclosure-scams',
    alertLevel: 'medium',
    sources: ['Consumer Financial Protection Bureau'],
  },
  {
    name: 'Reverse Mortgage Proceeds Redirection Scam',
    slug: 'reverse-mortgage-proceeds-redirection-scam',
    description:
      'After helping an elderly homeowner complete a legitimate reverse mortgage application, a scammer posing as a financial advisor or family helper convinces the homeowner to direct some or all of the loan proceeds into an "investment" the scammer controls, draining the equity the reverse mortgage was meant to provide for the homeowner\'s own living expenses. Reverse mortgage proceeds should go directly to the homeowner\'s own bank account, never a third party\'s.',
    categorySlug: 'mortgage-foreclosure-scams',
    alertLevel: 'high',
    sources: ['Consumer Financial Protection Bureau', 'U.S. Department of Housing and Urban Development'],
  },
  {
    name: 'Fake "We Buy Houses for Cash" Lowball Foreclosure Scam',
    slug: 'fake-cash-home-buyer-foreclosure-lowball-scam',
    description:
      'A company aggressively targets homeowners in early-stage foreclosure with an offer to buy the home quickly for cash, pressuring a fast signature before the homeowner has time to get an independent appraisal or explore other options — the offer price is often a small fraction of the home\'s actual equity, and legitimate alternatives like a short sale or loan modification are never mentioned. Homeowners facing foreclosure can get free counseling from a HUD-approved housing counselor before accepting any cash offer.',
    categorySlug: 'mortgage-foreclosure-scams',
    alertLevel: 'medium',
    sources: ['Consumer Financial Protection Bureau', 'U.S. Department of Housing and Urban Development'],
  },
  {
    name: 'Fake Zoom Meeting Invite Phishing Email',
    slug: 'fake-zoom-meeting-invite-phishing-email',
    description:
      'An email formatted like a Zoom meeting invitation or "missed meeting" notice links to a fake Zoom login page that harvests corporate email credentials, exploiting how routine meeting invites have become since remote work grew common. Hovering over the link to check the actual destination domain before clicking, or navigating to zoom.us directly, avoids the fake page entirely.',
    categorySlug: 'phishing',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice'],
  },
  {
    name: 'Fake HR Benefits Open-Enrollment Phishing Email',
    slug: 'fake-hr-benefits-enrollment-phishing-email',
    description:
      'An email timed to arrive during a company\'s real open-enrollment period impersonates the HR or benefits department, asking employees to "confirm" health insurance selections through a link that harvests login credentials to the company\'s actual HR portal, where personal and financial data can then be accessed or redirected. Employees should navigate to their HR portal directly rather than through an emailed link, especially during enrollment season when such requests seem routine.',
    categorySlug: 'phishing',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice'],
  },
  {
    name: 'Fake Toll Account Suspension Phishing Email',
    slug: 'fake-toll-account-suspension-phishing-email',
    description:
      'An email claims your electronic toll account (E-ZPass or a similar regional system) will be suspended due to a billing problem, linking to a fake account login page that harvests payment card details rather than any real toll agency site. Toll agencies manage account issues through their own verified app or website, not a link in an unsolicited email.',
    categorySlug: 'phishing',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice'],
  },
  {
    name: 'Humanitarian Doctor Overseas Mission Romance Scam',
    slug: 'humanitarian-doctor-romance-scam',
    description:
      'A scammer\'s profile claims to be a doctor or surgeon on a humanitarian medical mission in a conflict zone or disaster area, using the setting to explain unreliable communication and build sympathy before requesting money for medical supplies, travel, or a supposed emergency affecting the mission. As with any overseas-worker romance scam cover story, a partner never met in person requesting money tied to their claimed profession is the central red flag, regardless of how compelling the humanitarian framing is.',
    categorySlug: 'romance-scams',
    alertLevel: 'high',
    sources: ['FTC Consumer Advice'],
  },
  {
    name: 'Grief Support Group Romance Scam',
    slug: 'grief-support-group-romance-scam',
    description:
      'A scammer joins an online grief support group or forum for recently widowed or bereaved people, presenting as someone who has also lost a spouse, and uses the shared experience to build unusually fast emotional intimacy before pivoting to requests for money. Targeting a community formed specifically around a recent loss makes victims more vulnerable than a general dating platform, since the initial trust is built on shared grief rather than romantic interest alone.',
    categorySlug: 'romance-scams',
    alertLevel: 'high',
    sources: ['FTC Consumer Advice'],
  },
  {
    name: 'Romance Scam "Recovery Service" Scam',
    slug: 'romance-scam-recovery-scam',
    description:
      'After a romance scam victim shares their story publicly or in a support forum, a second scammer poses as a fraud recovery specialist, private investigator, or lawyer claiming they can recover the money already lost — for an upfront fee. No legitimate recovery service requires payment before recovering funds, and most money sent to romance scammers, especially by wire transfer or gift card, cannot actually be recovered.',
    categorySlug: 'romance-scams',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice'],
  },
  {
    name: 'Fake Printer or Router Setup Support Line Scam',
    slug: 'fake-printer-router-setup-support-scam',
    description:
      'Searching online for a legitimate brand\'s tech support number returns a fake number, placed there through paid search ads or search-result manipulation, that connects to a scam call center posing as the manufacturer\'s official support line, which then charges for unnecessary "repairs" or gains remote access to the caller\'s computer. Finding support contact information directly on the manufacturer\'s official website, not through a general search, avoids this.',
    categorySlug: 'tech-support-scams',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice'],
  },
  {
    name: 'Fake Software License Renewal Popup Scam',
    slug: 'fake-software-license-renewal-popup-scam',
    description:
      'A popup while browsing claims a security or office software license has expired and must be renewed immediately, linking to a payment page for software the visitor may never have purchased. Legitimate license renewal notices come through the software\'s own application, not a browser popup triggered by visiting an unrelated webpage.',
    categorySlug: 'tech-support-scams',
    alertLevel: 'low',
    sources: ['FTC Consumer Advice'],
  },
  {
    name: 'Fake Remote "Cleanup" After a Real Malware Infection',
    slug: 'fake-remote-access-cleanup-after-real-infection',
    description:
      'After a victim\'s device is genuinely infected with malware from an unrelated source, a scam caller claiming to detect the infection remotely offers a "cleanup" service, gaining legitimate-seeming remote access to a genuinely compromised device and using that access to install further malware, steal financial information, or extort payment for removing an infection they may have actually worsened. A real infection should be addressed with a reputable, independently chosen security provider, not one that initiated contact.',
    categorySlug: 'tech-support-scams',
    alertLevel: 'high',
    sources: ['FTC Consumer Advice'],
  },
  {
    name: 'Fake Marketplace Escrow Payment Service Scam',
    slug: 'fake-marketplace-escrow-payment-scam',
    description:
      'A seller on an online marketplace insists on using a third-party "escrow" service to hold payment safely until the item is delivered, but the escrow site is fake and controlled by the seller, who simply keeps the payment once it is sent there. Legitimate marketplace transactions use the platform\'s own built-in payment protection, not a separate, seller-suggested escrow website.',
    categorySlug: 'online-shopping-scams',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice'],
  },
  {
    name: 'Fake Appliance Warranty Extension Scam',
    slug: 'fake-appliance-warranty-extension-scam',
    description:
      'A mailer, call, or email claims a recently purchased appliance or electronics warranty is about to expire and offers an extended warranty for a fee, often reaching customers whose purchase and warranty information was never actually shared with the sender — the "extended warranty" typically doesn\'t cover what\'s promised, if it exists at all. Extended warranties should only be purchased directly through the retailer or manufacturer where the item was bought.',
    categorySlug: 'online-shopping-scams',
    alertLevel: 'low',
    sources: ['FTC Consumer Advice'],
  },
  {
    name: 'Fake Local Pickup Marketplace Scam',
    slug: 'fake-local-pickup-marketplace-scam',
    description:
      'A seller lists a desirable item for local pickup at a below-market price, collects a deposit or full payment through a peer-to-peer payment app to "hold" the item, then cancels contact and never shows up for the meetup — exploiting payment apps that offer no buyer protection for person-to-person transfers. Paying only in person, at the time of a completed transaction, avoids this entirely.',
    categorySlug: 'online-shopping-scams',
    alertLevel: 'low',
    sources: ['FTC Consumer Advice'],
  },
  {
    name: 'Fake Renters Insurance Requirement Scam via Landlord Portal',
    slug: 'fake-renters-insurance-landlord-portal-scam',
    description:
      'A tenant is directed, through a fake "property management portal" link designed to look like it\'s from their landlord, to purchase renters insurance through a specific non-existent or fraudulent provider as a lease requirement — the portal harvests payment information without providing any real coverage. Tenants can independently verify insurance requirements directly with their actual property manager and purchase coverage from any licensed insurer of their choosing.',
    categorySlug: 'insurance-fraud',
    alertLevel: 'medium',
    sources: ['National Association of Insurance Commissioners'],
  },
  {
    name: 'Fake Travel Insurance Add-On Upsell Scam',
    slug: 'fake-travel-insurance-addon-scam',
    description:
      'During checkout on a fake or spoofed travel booking site, travelers are offered a "required" travel insurance add-on from an unlicensed provider, collected as payment but providing no actual coverage if a claim is later filed. Confirming a travel insurance provider\'s license status with a state department of insurance before purchase is a fast way to check legitimacy.',
    categorySlug: 'insurance-fraud',
    alertLevel: 'low',
    sources: ['National Association of Insurance Commissioners'],
  },
  {
    name: 'Fake Small Business Workers\' Compensation Policy Scam',
    slug: 'fake-workers-compensation-policy-scam',
    description:
      'A small business owner is sold a workers\' compensation policy at an attractively low premium by an unlicensed broker or fake insurer, satisfying a legal requirement on paper — until an employee is actually injured and the business discovers the policy was never real, leaving the owner personally liable for the employee\'s medical costs and lost wages. Business owners can verify a workers\' comp carrier\'s license and standing directly with their state\'s department of insurance.',
    categorySlug: 'insurance-fraud',
    alertLevel: 'high',
    sources: ['National Association of Insurance Commissioners'],
  },
  {
    name: 'Fake Credit Freeze/Unfreeze Phishing Call',
    slug: 'fake-credit-freeze-unfreeze-phishing-call',
    description:
      'A caller claims to be from a credit bureau and states your credit file needs to be "unfrozen" to process a pending application, walking you through providing your PIN and personal details over the phone. Legitimate credit bureaus only unfreeze a file through their own website, app, or a written request initiated by the consumer themselves — never a call the bureau places to you.',
    categorySlug: 'identity-theft',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice'],
  },
  {
    name: 'Fake Online Notary Signing Service Identity-Harvesting Scam',
    slug: 'fake-notary-signing-service-identity-scam',
    description:
      'An online "notary" or document-preparation service collects scans of a driver\'s license, Social Security card, or passport to "verify identity" for a routine document signing, then resells or misuses that information rather than providing any real notarization service. Using only licensed, verifiable notaries — in person or through an established, state-recognized online notary platform — avoids handing sensitive ID documents to an unverified party.',
    categorySlug: 'identity-theft',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice'],
  },
  {
    name: 'Fake App Store Review Request Phishing Link',
    slug: 'fake-app-store-review-phishing-link',
    description:
      'A text or email formatted to look like a request to review a recent app purchase includes a link to a fake Apple ID or Google account login page, harvesting the credentials that control the victim\'s entire app ecosystem, stored payment methods, and often a linked email account used to reset other passwords. Apple and Google review requests appear inside the app store itself, not through an external link in a text or email.',
    categorySlug: 'account-takeover',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice'],
  },
  {
    name: 'AI-Generated Fake Court Summons Document',
    slug: 'ai-generated-fake-court-summons-scam',
    description:
      'AI document-generation tools are used to produce a convincingly formatted fake court summons or legal notice — complete with a real court\'s letterhead and case-number formatting — served by email or text and demanding an urgent response or payment to avoid a default judgment. Court summonses are legally required to be delivered through formal service of process, not emailed as a PDF; any such notice should be verified directly with the named court\'s clerk.',
    categorySlug: 'ai-deepfake-scams',
    alertLevel: 'high',
    sources: ['FTC Consumer Advice'],
  },
  {
    name: 'AI Chatbot Impersonating a Real Financial Advisor',
    slug: 'ai-chatbot-impersonating-financial-advisor',
    description:
      'A chatbot embedded on a fraudulent website is trained on a real, well-known financial advisor\'s or influencer\'s public content to mimic their voice and advice style, then steers users toward a fraudulent investment platform under the appearance of personalized advice from someone the victim already trusts. The real advisor typically has no knowledge their identity or content is being used this way; checking whether an interaction is happening on the advisor\'s verified official platform is the practical defense.',
    categorySlug: 'ai-deepfake-scams',
    alertLevel: 'high',
    sources: ['SEC Office of Investor Education and Advocacy'],
  },
  {
    name: 'Fake Electric Company Disconnection Threat Call',
    slug: 'fake-electric-disconnection-threat-call',
    description:
      'A caller claims to be from your electric utility, states your account is past due, and threatens same-day disconnection unless payment is made immediately — typically demanding a prepaid debit card or a cash-to-crypto payment kiosk rather than a normal bill payment method. Utilities are required by state regulation to send multiple written disconnection notices well in advance and never demand a specific untraceable payment method over the phone.',
    categorySlug: 'utility-scams',
    alertLevel: 'high',
    sources: ['FTC Consumer Advice'],
  },
  {
    name: 'Fake Utility Bill Overpayment Refund Scam',
    slug: 'fake-utility-overpayment-refund-scam',
    description:
      'A caller claims your utility account was overcharged and a refund is owed, but processing the refund requires your bank account or debit card information "to verify eligibility" — the information collected is then used for unauthorized withdrawals rather than any real refund. Utility refunds are applied as a statement credit or mailed check, never requiring you to provide account access over the phone.',
    categorySlug: 'utility-scams',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice'],
  },
  {
    name: 'Fake Internet or Cable Provider Equipment Fee Scam',
    slug: 'fake-internet-provider-equipment-fee-scam',
    description:
      'A call or text claims your internet or cable provider is updating equipment nationwide and requires an immediate "activation fee" payment to avoid a service interruption, using a real provider\'s name and branding to appear legitimate. Providers bill equipment or activation charges through the normal monthly statement, not a standalone urgent payment demand.',
    categorySlug: 'utility-scams',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice'],
  },
  {
    name: 'Fake Meter Inspector Home Access Scam',
    slug: 'fake-meter-inspector-home-access-scam',
    description:
      'Someone posing as a utility meter inspector or safety technician requests entry to a home to "inspect" the gas, electric, or water meter, using the visit to steal valuables or gather information for a follow-up scam. Real utility employees carry verifiable ID and a scheduled-visit confirmation that can be checked by calling the utility\'s official customer service number before allowing entry.',
    categorySlug: 'utility-scams',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice'],
  },
  {
    name: 'Fake Utility-Sponsored Solar Panel Savings Scam',
    slug: 'fake-solar-panel-utility-savings-scam',
    description:
      'A door-to-door or phone solicitor claims to represent a utility-sponsored solar program offering free or heavily discounted panel installation, but the pitch is actually a lead-generation or financing scheme that locks the homeowner into a long-term lease or loan far more expensive than represented — often with the utility having no actual affiliation with the program at all. Homeowners should verify any "utility-sponsored" program directly with their utility before signing anything.',
    categorySlug: 'utility-scams',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice'],
  },
  {
    name: 'Fake Prepaid Utility Card Reload Scam',
    slug: 'fake-prepaid-utility-card-reload-scam',
    description:
      'A caller instructs a customer to purchase a specific prepaid debit or gift card, then call back and read the card numbers to "reload" their utility account balance — a payment method no legitimate utility company uses or accepts, designed to be untraceable once the numbers are given out. No utility company requires payment exclusively through a specific retail gift card.',
    categorySlug: 'utility-scams',
    alertLevel: 'high',
    sources: ['FTC Consumer Advice'],
  },
  {
    name: 'Fake Package Redirection Request Scam',
    slug: 'fake-package-redirection-request-scam',
    description:
      'A text or call claims a package delivery attempt failed and offers to redirect it to a different address for a small fee, but no such package exists — the fee payment is used to test a stolen card, and any personal information provided feeds into further targeting. Confirming shipment status directly through the retailer\'s own order history, not a link in the message, is the safe check.',
    categorySlug: 'package-delivery-scams',
    alertLevel: 'low',
    sources: ['FTC Consumer Advice'],
  },
  {
    name: 'Fake Robo-Advisor App Investment Scam',
    slug: 'fake-robo-advisor-app-investment-scam',
    description:
      'A polished mobile app mimics the interface of legitimate automated investment platforms, showing a realistic-looking account balance that appears to grow steadily, but the app is not connected to any real brokerage or the SEC-registered entity it claims to be — deposits are simply taken, and withdrawal requests are delayed indefinitely or denied. Verifying an investment platform\'s registration directly through the SEC\'s or FINRA\'s public databases, not just app store reviews, is the necessary check.',
    categorySlug: 'investment-fraud',
    alertLevel: 'high',
    sources: ['SEC Office of Investor Education and Advocacy'],
  },
  {
    name: 'Fake Missing Child Alert Donation Scam',
    slug: 'fake-missing-child-alert-donation-scam',
    description:
      'A viral social media post about a missing child includes a donation link to help fund the "search effort," but the child either doesn\'t exist, was already found, or the case is real while the donation link is entirely unaffiliated with the family or any law enforcement agency involved. Sharing the alert is harmless, but any donation request attached to it should be verified against the actual law enforcement agency\'s or family\'s confirmed channel before giving.',
    categorySlug: 'charity-scams',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice'],
  },
  {
    name: 'Fake Union Apprenticeship Program Fee Scam',
    slug: 'fake-union-apprenticeship-fee-scam',
    description:
      'An ad or message offers guaranteed placement in a well-paying union trade apprenticeship program in exchange for an upfront "registration" or "materials" fee, though real union apprenticeships are typically free to apply for and are administered directly through the union or a joint apprenticeship committee, not a private recruiter charging a fee. Verifying an apprenticeship opportunity directly with the named union local avoids the fee entirely.',
    categorySlug: 'employment-scams',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice'],
  },
  {
    name: 'EBT Card Skimming at Point-of-Sale Terminals',
    slug: 'ebt-card-skimming-scam',
    description:
      'Criminals install hidden skimming devices on point-of-sale terminals or ATMs, or use hidden cameras to capture PIN entry, to clone SNAP/EBT card numbers and drain benefits balances — often striking right after benefits are deposited each month. USDA\'s Food and Nutrition Service has expanded state EBT theft replacement rules in response to a nationwide surge in skimming; checking terminals for loose or add-on card readers and covering the PIN pad are practical defenses.',
    categorySlug: 'public-benefits-fraud',
    alertLevel: 'high',
    sources: ['USDA Food and Nutrition Service'],
  },
  {
    name: 'Fake SNAP Benefits Suspension Text Scam',
    slug: 'fake-snap-benefits-suspension-text-scam',
    description:
      'A text claims SNAP or other public benefits have been suspended due to a "verification issue" and links to a fake state benefits portal login page that harvests the recipient\'s Social Security number and EBT card PIN. State benefits agencies communicate suspensions through official mail and the agency\'s own verified portal, not an unsolicited text link.',
    categorySlug: 'public-benefits-fraud',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice'],
  },
  {
    name: 'Unemployment Benefits Filed in a Victim\'s Name Using Stolen Data',
    slug: 'unemployment-benefits-identity-theft-filing',
    description:
      'Using personal information obtained from a data breach, criminals file a fraudulent unemployment insurance claim in a victim\'s name at a state workforce agency, directing the payments to a bank account or prepaid card they control — the victim typically discovers it only when they receive a 1099-G tax form for benefits they never applied for or received. Reporting a suspicious 1099-G to the state unemployment agency and requesting a corrected form is the necessary follow-up.',
    categorySlug: 'public-benefits-fraud',
    alertLevel: 'high',
    sources: ['U.S. Department of Labor', 'FTC Consumer Advice'],
  },
  {
    name: 'Fake Social Security Disability Advocate Fee Scam',
    slug: 'fake-ssdi-advocate-fee-scam',
    description:
      'A company or individual offers to help file or expedite a Social Security Disability Insurance claim for an upfront fee paid before any work is done, though the Social Security Administration caps and regulates representative fees, which are normally paid only from approved back-benefits and only after a favorable decision. Any representative demanding payment before a claim is decided is charging outside SSA\'s fee rules.',
    categorySlug: 'public-benefits-fraud',
    alertLevel: 'medium',
    sources: ['Social Security Administration'],
  },
  {
    name: 'Fake Chargeback Reversal Scam',
    slug: 'fake-chargeback-reversal-scam',
    description:
      'After a cardholder successfully disputes a fraudulent charge, a scammer posing as their bank calls claiming the chargeback was reversed and additional verification is needed to avoid losing the disputed funds permanently, using the follow-up contact to extract the card number or online banking credentials under the guise of "confirming" the reversal. Chargeback status should be checked directly through your bank\'s app or a number from the back of your card, not a number provided by the caller.',
    categorySlug: 'identity-theft',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice'],
  },
  {
    name: 'Shared-Password Crackdown Phishing Email',
    slug: 'shared-password-crackdown-phishing-email',
    description:
      'An email impersonating a streaming service claims new password-sharing detection has flagged the account and requires "re-verification" through a link, timed to coincide with real password-sharing crackdown announcements the actual companies made — the link leads to a fake login page harvesting account and payment credentials. Verifying any such notice by logging in directly through the app rather than an email link avoids the fake page.',
    categorySlug: 'account-takeover',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice'],
  },
  {
    name: 'Fake Dental Discount Plan Membership Scam',
    slug: 'fake-dental-discount-plan-scam',
    description:
      'A membership plan is marketed as providing significant discounts at "thousands of dentists nationwide," collecting an annual fee, but the actual network of participating providers is tiny, outdated, or nonexistent in the buyer\'s area, leaving them with a plan that provides no real discount when they try to use it. Confirming specific, current in-network providers by calling the dentist\'s office directly, not just checking the plan\'s own directory, catches this before purchase.',
    categorySlug: 'healthcare-fraud',
    alertLevel: 'low',
    sources: ['FTC Consumer Advice'],
  },
  {
    name: 'Fake Subscription Box Free-Trial Scam',
    slug: 'fake-subscription-box-free-trial-scam',
    description:
      'An ad offers a "free" trial box of beauty, supplement, or novelty products for only a small shipping fee, but the shipping payment enrolls the buyer in a recurring monthly subscription at a much higher price that is deliberately difficult to cancel, with charges continuing for months before the buyer notices. Reading the full terms before entering payment information for any "free plus shipping" offer, and checking bank statements regularly, catches this early.',
    categorySlug: 'online-shopping-scams',
    alertLevel: 'low',
    sources: ['FTC Consumer Advice'],
  },
  {
    name: 'Classic Grandparent Bail-Money Scam',
    slug: 'classic-grandparent-bail-money-scam',
    description:
      'A caller claims to be a grandchild in trouble — arrested, in a car accident, or stranded in a foreign country — and begs the grandparent not to tell their parents, creating both urgency and secrecy that discourage the grandparent from calling another family member to verify the story before sending money, typically by wire transfer or gift card. Hanging up and calling the grandchild directly at their known number, or calling another family member to check, breaks the scam\'s entire structure.',
    categorySlug: 'family-emergency-scams',
    alertLevel: 'high',
    sources: ['FTC Consumer Advice'],
  },
  {
    name: 'Fake Bail Bondsman Follow-Up Call',
    slug: 'fake-bail-bondsman-followup-call',
    description:
      'After an initial family-emergency call, a second scammer poses as a bail bondsman or court clerk to "confirm" the arrest and payment details, adding a layer of apparent independent verification that makes the original story feel more credible. A real bail amount and process can be verified directly with the actual courthouse or jail in the jurisdiction named, using publicly listed contact information, not a number provided during the call.',
    categorySlug: 'family-emergency-scams',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice'],
  },
  {
    name: 'Fake Hospital Emergency Payment Call',
    slug: 'fake-hospital-emergency-payment-call',
    description:
      'A caller claims a family member has been in a serious accident and is receiving emergency treatment, but insurance won\'t cover it without an immediate payment or deposit, pressuring the recipient to send money before they have any chance to call the hospital or the family member directly. Legitimate hospitals do not require a family member to prepay for ongoing emergency treatment over the phone.',
    categorySlug: 'family-emergency-scams',
    alertLevel: 'high',
    sources: ['FTC Consumer Advice'],
  },
  {
    name: 'Stranded Traveler Family-Member Scam',
    slug: 'stranded-traveler-family-member-scam',
    description:
      'A message, sometimes from a compromised or spoofed family member\'s own account, claims they are stranded while traveling — lost wallet, missed flight, detained at a border — and urgently need money wired or sent through a payment app to resolve the situation. Contacting the family member through a separate, independently verified channel, rather than replying within the same possibly-compromised conversation, is the necessary check.',
    categorySlug: 'family-emergency-scams',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice'],
  },
  {
    name: 'Fake Private Student Loan Refinance Fee Scam',
    slug: 'fake-private-student-loan-refinance-fee-scam',
    description:
      'A company advertises refinancing private student loans at an unusually low guaranteed rate, collecting an upfront "application" or "lock-in" fee, but never actually completes a refinance. Real lenders evaluate rate offers based on credit and income before charging any fee, and legitimate refinancing fees, where they exist, come out of the new loan itself.',
    categorySlug: 'debt-relief-scams',
    alertLevel: 'medium',
    sources: ['Consumer Financial Protection Bureau'],
  },
  {
    name: 'Fake Private Equity Access Scam for Retail Investors',
    slug: 'fake-private-equity-access-scam',
    description:
      'A pitch offers ordinary retail investors access to an exclusive private equity or pre-IPO investment normally reserved for institutional or accredited investors, using the appeal of insider access to justify an unusually large minimum investment — the fund and its claimed track record are fabricated, and the money is never actually invested anywhere. Genuine private equity access for retail investors is heavily regulated and rare; checking SEC filings for any named fund is a necessary step before investing.',
    categorySlug: 'investment-fraud',
    alertLevel: 'high',
    sources: ['SEC Office of Investor Education and Advocacy'],
  },
  {
    name: 'Fake Veteran Service-Dog Training Charity Scam',
    slug: 'fake-veteran-service-dog-charity-scam',
    description:
      'A charity claims to train and provide service dogs for veterans with PTSD or physical disabilities at no cost, soliciting significant donations, but delivers few or no actual dogs to veterans — a pattern regulators have flagged in more than one real enforcement case against charities using this specific appeal. Checking a charity\'s actual program spending ratio through Charity Navigator or a state charity registration search before donating catches this.',
    categorySlug: 'charity-scams',
    alertLevel: 'medium',
    sources: ['Federal Trade Commission'],
  },
  {
    name: 'Fake GLP-1 Weight-Loss Drug Counterfeit Scam',
    slug: 'fake-glp1-weight-loss-drug-scam',
    description:
      'Websites and social media ads offer popular prescription weight-loss injectable medications without a prescription, at steep discounts, shipping counterfeit or improperly compounded products that may contain the wrong dose or no active ingredient at all — a pattern that surged alongside genuine shortages and high demand for these drugs. These medications should only be obtained through a licensed pharmacy with a valid prescription, never a site offering them without one.',
    categorySlug: 'healthcare-fraud',
    alertLevel: 'high',
    sources: ['U.S. Food and Drug Administration', 'FTC Consumer Advice'],
  },
  {
    name: 'Fake Medicaid Recertification Phishing Call',
    slug: 'fake-medicaid-recertification-phishing-call',
    description:
      'A caller claims a Medicaid recipient\'s coverage will lapse unless they "recertify" immediately, asking for a Social Security number and bank account details over the phone to process the renewal. State Medicaid agencies handle recertification through mailed notices and their own official portal or in-person office, not an unsolicited call demanding immediate account information.',
    categorySlug: 'public-benefits-fraud',
    alertLevel: 'medium',
    sources: ['Centers for Medicare & Medicaid Services'],
  },
  {
    name: 'Fake WIC Benefits Card Replacement Scam',
    slug: 'fake-wic-card-replacement-scam',
    description:
      'A text or call claims a WIC (Women, Infants, and Children) benefits card has been compromised and offers to send a replacement, but first requests the current card number and PIN "to deactivate the old card" — information then used to drain the existing balance before any real replacement is issued. WIC card issues should be reported directly to the local WIC clinic or state agency, not through a link or number from an unsolicited message.',
    categorySlug: 'public-benefits-fraud',
    alertLevel: 'medium',
    sources: ['USDA Food and Nutrition Service'],
  },
  {
    name: 'Fake Housing Voucher Waitlist Fee Scam',
    slug: 'fake-housing-voucher-waitlist-fee-scam',
    description:
      'A caller or website claims to offer expedited placement on a Section 8 or public housing waitlist for an upfront processing fee, though real public housing authorities do not charge fees to join or move up a waitlist, and waitlist order cannot legitimately be purchased. Applicants can verify their actual waitlist status directly with their local public housing authority at no cost.',
    categorySlug: 'public-benefits-fraud',
    alertLevel: 'medium',
    sources: ['U.S. Department of Housing and Urban Development'],
  },
  {
    name: 'Fake Military Emergency Leave Payment Scam',
    slug: 'fake-military-emergency-leave-payment-scam',
    description:
      'A caller claims a family member serving in the military needs emergency funds sent immediately to secure emergency leave or transport home for a family crisis, exploiting the same urgency and distance that make military-deployment romance scams effective, but targeting an existing family relationship rather than a new one. The Department of Defense does not require service members or their families to pay for emergency leave approval or transport.',
    categorySlug: 'family-emergency-scams',
    alertLevel: 'high',
    sources: ['DoD Cyber Crime Center'],
  },
  {
    name: 'Fake Kidnapping Ransom Call',
    slug: 'fake-kidnapping-ransom-call',
    description:
      'A caller claims to have kidnapped a family member and demands an immediate ransom payment, often keeping the victim on the phone continuously to prevent them from hanging up and verifying the family member\'s actual whereabouts — in reality, no kidnapping has occurred, and the supposed victim is simply unreachable at that moment for an unrelated reason. If safely possible, contacting the named family member or law enforcement through a second phone while staying on the line is the recommended response.',
    categorySlug: 'family-emergency-scams',
    alertLevel: 'critical',
    sources: ['FBI IC3'],
  },
  {
    name: 'Fake Child\'s School Emergency Pickup Scam',
    slug: 'fake-school-emergency-pickup-scam',
    description:
      'A caller impersonating school staff claims a parent\'s child has been injured or is in trouble and needs immediate payment, sometimes for a supposed medical bill or fine, before the parent can pick them up — a scenario designed to bypass the parent\'s instinct to first call the school directly. Schools resolve real emergencies by contacting a parent directly for pickup, not by demanding payment over the phone as a precondition.',
    categorySlug: 'family-emergency-scams',
    alertLevel: 'high',
    sources: ['FTC Consumer Advice'],
  },
  {
    name: 'Fake Boil-Water Notice Sales Scam',
    slug: 'fake-water-utility-boil-water-notice-scam',
    description:
      'A call or text falsely claims a boil-water advisory is in effect and offers to sell a water filtration or testing service "required" during the advisory, or asks for payment to confirm the address is unaffected. Real boil-water advisories are issued and communicated by the local water utility and public health department directly, without any sales pitch attached.',
    categorySlug: 'utility-scams',
    alertLevel: 'low',
    sources: ['FTC Consumer Advice'],
  },
  {
    name: 'Fake Smart Meter Installation Fee Scam',
    slug: 'fake-smart-meter-installation-fee-scam',
    description:
      'A caller or door-to-door visitor claims a mandatory smart meter upgrade requires an installation fee paid directly to them, when utilities that roll out smart meters typically do so at no direct cost to the customer, billing any equipment cost through the regular account rather than collecting cash or card payment on the spot. Scheduling and cost of any real meter upgrade can be confirmed by calling the utility\'s official customer service line.',
    categorySlug: 'utility-scams',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice'],
  },
  {
    name: 'Fake Utility Rebate Program Phishing Email',
    slug: 'fake-utility-rebate-program-phishing-email',
    description:
      'An email claims the recipient qualifies for a utility company rebate on energy-efficient appliances or a bill credit, linking to a fake form that harvests bank account details to "deposit" the rebate. Real utility rebate programs are applied through the utility\'s own verified website or as a statement credit, never requiring bank login information submitted through an emailed link.',
    categorySlug: 'utility-scams',
    alertLevel: 'low',
    sources: ['FTC Consumer Advice'],
  },
  {
    name: 'Fake Tax Preparer Inflated-Refund Promise Scam',
    slug: 'fake-tax-preparer-inflated-refund-scam',
    description:
      'A preparer promises an unusually large refund by fabricating deductions, dependents, or business losses the client never had, signing the return in the client\'s name — the client later faces an IRS audit, penalties, and repayment of the inflated refund, while the preparer who profited from inflated fees is often difficult to locate again. Reviewing your own return line by line before signing, and never signing a blank or incomplete return, is the practical defense.',
    categorySlug: 'tax-scams',
    alertLevel: 'high',
    sources: ['Internal Revenue Service'],
  },
  {
    name: 'Fake "Do Not Call" Registry Renewal Scam',
    slug: 'fake-do-not-call-registry-renewal-scam',
    description:
      'A call or email claims your number\'s National Do Not Call Registry listing is expiring and requires a fee to renew, though real Do Not Call Registry listings never expire and registering or checking your status is always free directly through donotcall.gov. Any renewal fee request for a government registry that\'s actually free and permanent is an immediate red flag.',
    categorySlug: 'government-impersonation',
    alertLevel: 'low',
    sources: ['Federal Trade Commission'],
  },
  {
    name: 'Fake Vendor Onboarding Form Credential Harvest',
    slug: 'fake-vendor-onboarding-form-credential-harvest',
    description:
      'A scammer posing as a new or existing vendor sends an accounts payable department a "vendor onboarding" or "banking update" form to complete, which either harvests employee login credentials through a fake portal or directly changes the real vendor\'s payment banking details to an account the scammer controls. Verifying any new or changed vendor banking information by phone, using a number independently looked up rather than one provided in the email, prevents this.',
    categorySlug: 'business-email-compromise',
    alertLevel: 'high',
    sources: ['FBI IC3'],
  },
  {
    name: 'Fake Televised Dream Home Giveaway Entry Fee Scam',
    slug: 'fake-dream-home-giveaway-entry-fee-scam',
    description:
      'An email or ad claims the recipient has been selected as a finalist in a televised home or car giveaway sweepstakes, requiring a small entry or processing fee to remain eligible. Legitimate sweepstakes of this kind do not require any payment at any stage, from entry through prize claim; checking the sweepstakes\' official rules directly on the network or brand\'s real website is the fastest way to confirm it is fake.',
    categorySlug: 'lottery-sweepstakes-scams',
    alertLevel: 'low',
    sources: ['FTC Consumer Advice'],
  },
  {
    name: 'Fake Timeshare Loan Forgiveness Scam',
    slug: 'fake-timeshare-loan-forgiveness-scam',
    description:
      'A company contacts timeshare owners claiming to have arranged a special program to forgive the remaining loan balance on their timeshare purchase, requiring an upfront fee to "process" the forgiveness — no such lender-side forgiveness program exists, and the timeshare loan remains fully due regardless of any fee paid. Timeshare loan questions should go directly to the loan servicer named on the original financing documents.',
    categorySlug: 'debt-relief-scams',
    alertLevel: 'medium',
    sources: ['Consumer Financial Protection Bureau'],
  },
  {
    name: 'Sextortion via a Compromised Employer Email Account',
    slug: 'sextortion-via-compromised-employer-email',
    description:
      'A scammer who has gained access to a victim\'s work email account discovers or fabricates compromising material and threatens to send it to the victim\'s entire company directory or supervisor unless paid, using workplace-wide distribution as added leverage beyond a typical personal-contacts threat. Reporting immediately to the employer\'s IT or security team, not just paying quietly, is the recommended response — a compromised work account is also a security incident the employer needs to know about regardless of the extortion content.',
    categorySlug: 'sextortion',
    alertLevel: 'critical',
    sources: ['FBI IC3'],
  },
  {
    name: 'Fake School Meal Program Application Fee Scam',
    slug: 'fake-school-meal-program-fee-scam',
    description:
      'A letter or call claims a family must pay a processing fee to enroll their child in the National School Lunch Program\'s free or reduced-price meal benefit, though applying for this federal program is always free and handled directly through the child\'s school district. Any fee request tied to a free federal benefits program is an immediate sign of a scam.',
    categorySlug: 'public-benefits-fraud',
    alertLevel: 'low',
    sources: ['USDA Food and Nutrition Service'],
  },
  {
    name: 'Fake Federal Pell Grant Processing Fee Scam',
    slug: 'fake-pell-grant-processing-fee-scam',
    description:
      'A caller or website claims a student must pay an upfront fee to process or "unlock" a Federal Pell Grant award, though applying for federal student aid through the FAFSA is always free and grants are disbursed directly by the student\'s school, never requiring a separate payment to a third party first. The word "free" is literally in the application\'s name — the Free Application for Federal Student Aid — for exactly this reason.',
    categorySlug: 'public-benefits-fraud',
    alertLevel: 'medium',
    sources: ['U.S. Department of Education'],
  },
  {
    name: 'Fake Overseas Consulate Emergency Fee Scam',
    slug: 'fake-consulate-emergency-passport-fee-scam',
    description:
      'A message claims a traveling family member has lost their passport or been detained abroad and needs an emergency fee wired immediately to the "consulate" to resolve it, using a fabricated or spoofed contact posing as consular staff. Real U.S. embassies and consulates do not request wired payments from family members back home; verifying through the State Department\'s official emergency contact line is the safe path.',
    categorySlug: 'family-emergency-scams',
    alertLevel: 'high',
    sources: ['U.S. Department of State'],
  },
  {
    name: 'Fake Family Member Car Accident Impound Fee Scam',
    slug: 'fake-family-car-accident-impound-fee-scam',
    description:
      'A caller claims a family member was in a car accident and their vehicle has been impounded, requiring an immediate release fee paid by phone before the family member can retrieve it or avoid additional charges, relying on the same urgency and secrecy pressure as other family-emergency scams. Impound fees, where real, are paid directly at the impound lot or through the local police department, never over the phone to an unverified caller.',
    categorySlug: 'family-emergency-scams',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice'],
  },
  {
    name: 'Fake Utility "Text-to-Pay" Phishing Link',
    slug: 'fake-utility-text-to-pay-phishing-link',
    description:
      'A text formatted like a routine bill-due reminder from a utility includes a payment link that leads to a fake payment page harvesting card details, exploiting how normalized text-based bill reminders and text-to-pay features have become with real utilities. Paying only through the utility\'s official app or website, typed in directly, avoids the fake link entirely.',
    categorySlug: 'utility-scams',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice'],
  },
  {
    name: 'Fake Community Solar Bill-Credit Scam',
    slug: 'fake-community-solar-credit-scam',
    description:
      'A solicitor offers enrollment in a "community solar" program claiming to provide guaranteed utility bill credits in exchange for a subscription fee or personal utility account access, but the program is not actually affiliated with any real community solar project or the utility, and the promised bill credits never materialize. Verifying a community solar offer directly with the local utility or state public utility commission before enrolling or sharing account access is the necessary check.',
    categorySlug: 'utility-scams',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice'],
  },
  {
    name: 'Fake Viatical/Life Settlement Investment Scam',
    slug: 'fake-life-settlement-viatical-investment-scam',
    description:
      'Investors are offered fractional shares in life insurance policies purchased from terminally ill or elderly policyholders — a real, legal financial product called a viatical or life settlement — promised a payout when the insured person dies, but the scheme is often fraudulent, with fabricated policies, falsified life expectancy estimates, or the same policy sold to multiple investors. These investments are illiquid and hard to value even when legitimate; verifying the specific policy and life expectancy estimate independently, not just through the seller, is essential.',
    categorySlug: 'investment-fraud',
    alertLevel: 'high',
    sources: ['SEC Office of Investor Education and Advocacy'],
  },
  {
    name: 'Fake First Responder Memorial Fund Scam',
    slug: 'fake-first-responder-memorial-fund-scam',
    description:
      'After a police officer or firefighter is killed in the line of duty, a scammer sets up a fake memorial fund soliciting donations for the family, using real news coverage of the tragedy to appear legitimate, while the actual family may never see the money. Donating only through funds explicitly confirmed by the fallen officer\'s own department or an established organization like a state police benevolent association avoids this.',
    categorySlug: 'charity-scams',
    alertLevel: 'medium',
    sources: ['Federal Trade Commission'],
  },
  {
    name: 'Fake Long-Term Care Insurance Rate Increase Scam',
    slug: 'fake-long-term-care-insurance-rate-scam',
    description:
      'A caller claims to represent a policyholder\'s long-term care insurer, stating a mandatory rate increase requires immediate payment or account verification to keep the policy active, when real rate changes are communicated through formal written notice from the actual insurer, not an unsolicited call demanding immediate payment. Confirming any claimed rate change directly with the insurer, using contact information from a real policy statement, is the safe check.',
    categorySlug: 'healthcare-fraud',
    alertLevel: 'medium',
    sources: ['National Association of Insurance Commissioners'],
  },
  {
    name: 'Fake Ancestry DNA Test Data-Broker Scam',
    slug: 'fake-ancestry-dna-data-broker-scam',
    description:
      'A "free" DNA ancestry test kit offer collects a saliva sample along with extensive personal and family health information, but the company is not a legitimate genetic testing lab — it resells the collected DNA and personal data to data brokers or insurers rather than providing any real genealogy results. Using only well-established, name-brand DNA testing services with a clear, published privacy policy is the practical defense.',
    categorySlug: 'identity-theft',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice'],
  },
  {
    name: 'Fake Return Label Refund Scam',
    slug: 'fake-return-label-refund-scam',
    description:
      'A text or email claims a recent online return wasn\'t received and offers a "confirmation refund" link to resolve it, but the link harvests payment card details rather than issuing any real refund. Retailers process return refunds automatically once a shipment is scanned, without needing a customer to click a confirmation link; checking a return\'s status directly through the retailer\'s own order history is the safe way to confirm.',
    categorySlug: 'package-delivery-scams',
    alertLevel: 'low',
    sources: ['FTC Consumer Advice'],
  },
  {
    name: 'Fake Cruise Ship Crew Job Fee Scam',
    slug: 'fake-cruise-ship-crew-job-fee-scam',
    description:
      'An ad offers high-paying cruise ship crew positions requiring an upfront fee for "training certification," a uniform, or a placement guarantee before the applicant can start — real cruise lines and staffing agencies do not charge job seekers a fee to be considered or hired for a position. Applying only through a cruise line\'s own verified careers page avoids this.',
    categorySlug: 'employment-scams',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice'],
  },
  {
    name: 'Fake Extended Auto Warranty Robocall',
    slug: 'fake-extended-auto-warranty-robocall',
    description:
      'A robocall claims your vehicle\'s warranty is about to expire and offers an extended vehicle service contract, often based on nothing more than the fact that most cars eventually age out of a factory warranty — the caller has no actual knowledge of your specific vehicle or its warranty status. This is one of the most complained-about robocall categories tracked by the FTC; hanging up and, if genuinely interested in coverage, contacting your dealer or a well-reviewed provider directly avoids the high-pressure pitch.',
    categorySlug: 'insurance-fraud',
    alertLevel: 'medium',
    sources: ['Federal Trade Commission'],
  },
  {
    name: 'Fake Professional Athlete Impersonation Romance Scam',
    slug: 'fake-athlete-impersonation-romance-scam',
    description:
      'A scammer creates a profile using a real professional athlete\'s stolen photos and a fabricated "secret" or "backup" social media account, building a relationship with a fan who believes they\'ve connected with the real athlete privately, before requesting money for a supposed emergency or travel to meet in person. Real athletes\' verified accounts and public representatives can confirm whether a second "private" account claiming to be them is genuine — it almost never is.',
    categorySlug: 'romance-scams',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice'],
  },
  {
    name: 'Fake Wholesale Liquidation Pallet Scam',
    slug: 'fake-wholesale-liquidation-pallet-scam',
    description:
      'A seller advertises "mystery" liquidation pallets from major retailers claimed to contain hundreds of dollars of returned merchandise for a fraction of the price, but buyers who pay receive nothing, a box of near-worthless items, or a pallet manifest that doesn\'t match what\'s shipped. Buying liquidation inventory only through the retailer\'s own verified liquidation marketplace or an established, reviewed wholesaler avoids this.',
    categorySlug: 'online-shopping-scams',
    alertLevel: 'low',
    sources: ['FTC Consumer Advice'],
  },
  {
    name: 'Fake "Free" VPN App Data-Harvesting Scam',
    slug: 'fake-vpn-app-data-harvesting-scam',
    description:
      'A free VPN app marketed as protecting privacy while browsing is actually designed to log and resell the user\'s browsing activity, or to install additional unwanted software, exploiting the trust placed in a tool specifically chosen for privacy. Checking independent security reviews and a provider\'s actual privacy policy, not just app store ratings, before installing any free VPN is the practical defense.',
    categorySlug: 'tech-support-scams',
    alertLevel: 'low',
    sources: ['FTC Consumer Advice'],
  },
  {
    name: 'Fake Background Check "Personal Report" Scam',
    slug: 'fake-background-check-personal-report-scam',
    description:
      'A site offers to run a "free" background check or reveal who has been searching for you, but requires a credit card for "verification" that instead enrolls the user in a recurring paid membership, and often compiles and displays whatever personal information it can scrape regardless of accuracy. Reading full terms before entering payment information for any "free" personal report, and checking bank statements for recurring charges, catches this early.',
    categorySlug: 'identity-theft',
    alertLevel: 'low',
    sources: ['FTC Consumer Advice'],
  },
  {
    name: 'Fake Church Building Fund Scam',
    slug: 'fake-church-building-fund-scam',
    description:
      'A caller or mailer claims to represent a local church or faith-based organization raising funds for a new building or disaster repair, using a name similar to a real, respected congregation, but the organization has no actual affiliation with any real church, and the funds go directly to the scammer. Verifying directly with the actual named church or its diocese or denomination before donating catches this.',
    categorySlug: 'charity-scams',
    alertLevel: 'low',
    sources: ['FTC Consumer Advice'],
  },
  {
    name: 'Fake Hearing Aid "Free Trial" Scam',
    slug: 'fake-hearing-aid-free-trial-scam',
    description:
      'An ad offers a free trial of advanced hearing aids for seniors, but "activating" the trial requires a shipping and handling fee that turns out to enroll the buyer in an expensive recurring purchase plan for low-quality, non-medical-grade sound amplifiers rather than real hearing aids. A real audiologist evaluation and a known, established hearing aid provider are the safe path for anyone with genuine hearing loss concerns.',
    categorySlug: 'healthcare-fraud',
    alertLevel: 'low',
    sources: ['FTC Consumer Advice'],
  },
  {
    name: 'Fake Art Fractional-Ownership Investment Scam',
    slug: 'fake-art-fractional-ownership-scam',
    description:
      'A platform offers fractional ownership shares in a claimed valuable painting or sculpture, promising returns as the artwork appreciates, but the artwork\'s authenticity, valuation, or even existence is never independently verified, and investor funds are simply pocketed rather than used to acquire any real art. Independently verifying the specific artwork\'s provenance and appraisal through a recognized, unaffiliated expert is necessary before investing in any fractional art scheme.',
    categorySlug: 'investment-fraud',
    alertLevel: 'high',
    sources: ['SEC Office of Investor Education and Advocacy'],
  },
  {
    name: 'Fake Influencer Brand Ambassador Fee Scam',
    slug: 'fake-influencer-brand-ambassador-fee-scam',
    description:
      'A message offers a paid "brand ambassador" opportunity promoting well-known products on social media, requiring the applicant to first purchase a starter kit of products at their own expense to "qualify," with promised reimbursement or commission that never materializes. Real brand ambassador programs are run directly through the company\'s own verified marketing or partnerships page and do not require upfront personal purchases.',
    categorySlug: 'employment-scams',
    alertLevel: 'medium',
    sources: ['FTC Consumer Advice'],
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
  },
  {
    name: 'German Schufa Credit Score Phishing Email',
    slug: 'germany-schufa-credit-score-phishing-email',
    description:
      'An email impersonating Schufa, Germany\'s dominant credit bureau, claims a negative entry has been added to the recipient\'s credit file and links to a fake login page requesting personal ID and banking details to "dispute" it. Schufa communicates real changes to a credit file by post or through a consumer\'s own verified online account, not an emailed dispute link.',
    categorySlug: 'identity-theft',
    country: 'DE',
    alertLevel: 'medium',
    sources: ['German Federal Office for Information Security (BSI)'],
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
  },
  {
    name: 'Indian Fake Instant Loan App Scam',
    slug: 'india-fake-loan-app-scam',
    description:
      'A mobile app offers instant, no-collateral personal loans with minimal verification, but after disbursing a small amount, demands repayment at extreme interest within days and threatens to contact the borrower\'s phone contacts with doctored, humiliating messages unless paid immediately — having harvested the phone\'s full contact list and photos as a condition of installing the app. India\'s Reserve Bank and cybercrime authorities have specifically warned against loan apps not listed with a registered NBFC; checking an app\'s RBI registration before installing is the necessary safeguard.',
    categorySlug: 'debt-relief-scams',
    country: 'IN',
    alertLevel: 'critical',
    sources: ['Reserve Bank of India', 'Indian Cyber Crime Coordination Centre (I4C)'],
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
  },
  {
    name: 'Japanese One-Click Fraud (Wan-Kurikku Sagi)',
    slug: 'japan-one-click-fraud-scam',
    description:
      'After clicking a link on an adult content, streaming, or gaming site, a pop-up immediately declares that the victim has "registered" for a paid service and now owes a large fee, often displaying what looks like their IP address or device details to falsely suggest they\'ve been identified and tracked. There was never an actual registration or contract formed, and Japan\'s National Police Agency advises that closing the browser without clicking anything further, and never calling the phone number on the demand, ends the scam completely.',
    categorySlug: 'phishing',
    country: 'JP',
    alertLevel: 'medium',
    sources: ['Japan National Police Agency'],
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
