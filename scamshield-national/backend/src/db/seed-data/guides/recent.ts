import { SeedArticle } from '../types';

// Added out-of-band from the regular a-f / g-m / n-s / t-z shards: the
// environment that produced this commit had its local disk full (Bash and
// local file writes both failed with ENOSPC), so the large existing shard
// files could not be safely rewritten in full. Functionally identical to
// a shard file - spread into GUIDE_ARTICLES the same way in index.ts. A
// maintainer can fold these into a-f.ts (Eastlink) and g-m.ts (Iberia)
// whenever convenient; there is no functional need to.
export const GuidesRecent: SeedArticle[] = [
  {
    title: "The Eastlink Data Breach: What Nearly 75,000 Cable, Internet, and Phone Customers Should Know",
    slug: "eastlink-2026-data-breach-guide",
    author: "ScamShield Editorial",
    tags: ["guide", "eastlink-2026-data-breach"],
    body: `Eastlink, the trade name of Bragg Communications Inc. and one of Canada's largest privately held telecom providers, told customers in late August 2026 that it had suffered a data breach affecting roughly 75,000 accounts. The company says suspicious activity was detected overnight between August 26 and 27, and it began emailing affected customers on the evening of Friday, August 28 — with letters and additional outreach following in the days after for customers it hadn't been able to reach by email, including people with older, historical accounts that are no longer active.

According to Eastlink, the exposed information spans internet, television, and home-phone accounts and includes customer names, contact details such as addresses, phone numbers, and email addresses, account numbers, and account PINs. The company says it does not believe full credit card numbers or online banking information were accessed. As a precaution, Eastlink temporarily shut down some customer-facing platforms on its website and mobile app while it investigated, and it has said it is continuing to work through notifying every affected customer.

It's worth understanding why a breach like this matters even without a stolen credit card number in the mix. A name, account number, and PIN are exactly the pieces of information a legitimate call center normally uses to verify that the person calling is really the account holder — which means a scammer who has all three can potentially talk their way past a telecom company's own customer-service verification, impersonating a customer to redirect service, request a SIM or equipment change, or extract even more account detail. That same combination of real name, real account number, and real contact information also makes a convincing prop for a follow-up phishing call, text, or email that references an actual Eastlink account to sound legitimate — a well-documented pattern that shows up after nearly every large telecom breach.

If you're an Eastlink customer, current or former, a few concrete steps are worth taking regardless of whether you've already received a notice. Change your Eastlink account PIN and online password, doing so by logging in directly through eastlink.ca or the official app rather than clicking any link in an email, even one that looks like it came from Eastlink. Treat any unsolicited call, text, or email that references your Eastlink account, address, or a recent bill and then asks you to "verify" your PIN, password, or a one-time passcode as a probable scam — a company that already has your account information does not need you to read sensitive details back to it. Keep an eye on your bank and card statements for small, unfamiliar charges in the weeks ahead, since exposed contact and account details are often combined with information from other sources to attempt fraud elsewhere, even when the original breach didn't include financial data directly. And be skeptical of any message offering to "help you claim compensation" or "check if you were affected" that isn't from Eastlink's own verified channels — breach news reliably draws a second wave of scammers impersonating the breached company itself.

If you want to confirm whether your account was affected or ask about the investigation, contact Eastlink directly through the customer service number printed on a past bill or through eastlink.ca, not a number found through an online search or a link in a text message. Canadian residents who spot a suspicious call, text, or email referencing this breach can report it to the Canadian Anti-Fraud Centre at 1-888-495-8501 or antifraudcentre-centreantifraude.ca; U.S. residents can report phishing and identity theft attempts to the FTC at ReportFraud.ftc.gov.`,
    sourceUrl: "https://www.cbc.ca/news/canada/nova-scotia/eastlink-data-breach-august-2026-9.7325413",
    coverImage: "https://commons.wikimedia.org/wiki/Special:FilePath/Cable_Modem.JPG?width=1200",
    coverImageCredit: "Photo: Sensibilitat Sensibilite, CC BY 3.0, via Wikimedia Commons",
    coverImagePosition: 50,
    // representative photo — generic cable modem/router, not Eastlink's own equipment; replace with an exact match if found
  },
  {
    title: "The Iberia Airlines Data Breach: How a Hacked Supplier Exposed Frequent-Flyer Customer Data",
    slug: "iberia-airlines-2025-data-breach-guide",
    author: "ScamShield Editorial",
    tags: ["guide", "iberia-airlines-2025-data-breach"],
    body: `Iberia, Spain's flag carrier and part of the International Airlines Group, notified customers in late November 2025 of a data security incident — but the airline's own network wasn't the point of entry. Iberia said the exposure traced back to unauthorized access at one of its suppliers, a third-party vendor whose systems held certain Iberia customer data. Days before the airline's own notice went out, someone had already posted on a hacking forum claiming to be selling roughly 77 gigabytes of data allegedly taken from Iberia, which is what first drew public attention to the incident.

According to Iberia, the exposed information includes customer names, email addresses, and Iberia Club (the airline's frequent-flyer loyalty program) membership numbers, with phone numbers exposed for some customers as well. Iberia says account passwords and financial or payment card information were not compromised in the incident.

The breach is a useful reminder that a company doesn't have to be hacked directly for its customers' data to end up exposed — a business can have solid security of its own and still be exposed through a supplier or partner it shares customer data with for billing, marketing, or loyalty-program administration. It's also a reminder that loyalty-program data isn't "harmless" just because it isn't a Social Security number or a credit card: a real name paired with a real frequent-flyer number is enough for a scammer to call or email pretending to be Iberia customer service and ask a customer to "verify" their account, and hijacked airline mileage accounts are a well-established fraud target in their own right, since a stranger who takes one over can redeem the miles for flights or merchandise before the real member ever notices.

Iberia has said it responded by requiring a verification code before any change to the email address tied to an account. Customers can add their own layer of protection: log into your Iberia Club or Iberia.com account directly (never through a link in an email) and change your password even though it wasn't reported as stolen, since a password reused on another site could still put the account at risk; check your Iberia Club mileage balance and recent activity for any redemption you didn't make; and turn on any additional login verification the airline offers. Treat any call, text, or email that cites your Iberia Club number or a recent booking and then asks you to "confirm" a password, one-time code, or full card number as a probable scam — a company that already has that information has no legitimate reason to ask a customer to read it back.

U.S.-based travelers who receive a suspicious message referencing Iberia or this breach can report it to the FTC at ReportFraud.ftc.gov. Customers in Spain or elsewhere in the European Union can also raise concerns with their national data protection authority — in Spain, the Agencia Espanola de Proteccion de Datos.`,
    sourceUrl: "https://www.bleepingcomputer.com/news/security/iberia-discloses-customer-data-leak-after-vendor-security-breach/",
    coverImage: "https://commons.wikimedia.org/wiki/Special:FilePath/EC-NAZ_IBERIA_Airlines_at_London_Heathrow_Airport_2026-04-04.jpg?width=1200",
    coverImageCredit: "Photo: Robert Cutter, CC BY-SA 4.0, via Wikimedia Commons — an Iberia Airbus at London Heathrow Airport",
    coverImagePosition: 50,
  },
];
