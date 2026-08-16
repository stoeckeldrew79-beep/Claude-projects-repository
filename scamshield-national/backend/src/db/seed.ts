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
