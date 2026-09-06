import { SeedCategory } from './types';

// The taxonomy the FTC's Consumer Sentinel and the FBI's IC3 use to group
// scam reports — not an exhaustive list, but the categories that cover the
// large majority of what gets reported.
export const SEED_CATEGORIES: SeedCategory[] = [
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

  // Added after measuring the corpus: each of these was a cluster of 8+
  // entries already in the database, scattered across whichever existing
  // category was closest. See the reassignment in scams.ts.
  { name: 'Ponzi & Pyramid Schemes', slug: 'ponzi-pyramid-schemes', description: 'Investment structures paying earlier participants with later participants\' money, or requiring recruitment to earn.' },
  { name: 'Cryptocurrency Scams', slug: 'cryptocurrency-scams', description: 'Fraud specific to digital assets — fake exchanges and tokens, wallet-draining approvals, and stolen seed phrases.' },
  { name: 'Medicare & Health Plans', slug: 'medicare-health-plans', description: 'Fraudulent enrolment, billing, and equipment schemes aimed at Medicare, Medicaid, and private health coverage.' },
  { name: 'Home Improvement & Solar', slug: 'home-improvement-solar', description: 'Door-to-door and storm-chasing contractors, and misrepresented solar financing, roofing, and repair work.' },
  { name: 'Rental & Housing', slug: 'rental-housing', description: 'Fake listings, phantom landlords, application-fee theft, and fraudulent housing assistance.' },
  { name: 'QR Code Scams', slug: 'qr-code-scams', description: 'Malicious QR codes placed on parking meters, invoices, and mailers that route to credential or payment theft.' },
  { name: 'Travel & Vacation Scams', slug: 'travel-vacation-scams', description: 'Fake bookings, cloned travel agencies, and prize-vacation offers carrying undisclosed fees.' },
  { name: 'Pet Sales Scams', slug: 'pet-sales-scams', description: 'Advertised puppies and other animals that do not exist, with escalating shipping, crate, and insurance fees.' },
  { name: 'Grandparent Scams', slug: 'grandparent-scams', description: 'Callers posing as a grandchild in urgent trouble, increasingly using cloned voices, to demand immediate payment.' },
  { name: 'Fake Check & Overpayment', slug: 'fake-check-overpayment', description: 'Counterfeit checks sent for more than an amount owed, with the victim asked to return the difference before the check bounces.' },
  { name: 'Subscription Traps', slug: 'subscription-traps', description: 'Free trials and negative-option offers engineered to be difficult to cancel and to keep billing.' },
  { name: 'Student Loan & Education', slug: 'student-loan-education', description: 'Bogus loan forgiveness and repayment services, fake scholarships, and diploma mills.' },
  { name: 'Legal & Debt Collection', slug: 'legal-debt-collection', description: 'Fabricated lawsuits, fake process servers, and collectors pursuing debts that are not owed or not theirs.' },
  { name: 'Job & Task Scams', slug: 'job-task-scams', description: 'Gamified \'task\' work, reshipping roles, and mystery-shopping offers that extract deposits or launder goods.' },
];
