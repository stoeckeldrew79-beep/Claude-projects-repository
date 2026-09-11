import { SeedGlobalSource } from './types';

// The major national fraud-reporting bodies that publish something the
// public can actually read. Deliberately no seeded `global_stats` rows —
// no unverified number gets shown to a user. An admin adds a stat only
// after checking it against the agency's own report (see the admin panel's
// Global Sources section); until then, the page shows an honest "no
// verified figures yet" state per source, same principle as Trend Watch's
// low-data handling.
export const SEED_GLOBAL_SOURCES: SeedGlobalSource[] = [
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
    agency_name: 'Consumer Financial Protection Bureau — Consumer Complaint Database',
    country: 'US',
    country_name: 'United States',
    url: 'https://www.consumerfinance.gov/data-research/consumer-complaints/',
    description:
      'The CFPB publishes individual-level complaint data about consumer financial products and services — credit cards, debt collection, loans, and more — updated daily, downloadable in bulk, and available through a public API with full field documentation.',
    data_type: 'open_dataset',
  },
  {
    agency_name: 'U.S. Postal Inspection Service — Annual Report',
    country: 'US',
    country_name: 'United States',
    url: 'https://www.uspis.gov/annual-report',
    description:
      'USPIS publishes a yearly Annual Report of Investigations covering mail fraud, mail theft, and check-washing case statistics, alongside prevention guidance on the specific mail-based scam patterns it sees most.',
    data_type: 'annual_report',
  },
  {
    agency_name: 'AARP Fraud Watch Network',
    country: 'US',
    country_name: 'United States',
    url: 'https://www.aarp.org/pri/topics/work-finances-retirement/fraud-consumer-protection/',
    description:
      'Not a government agency — a nonprofit member organization included here because its Public Policy Institute publishes original national fraud-victimization surveys and topic-specific research (e.g. crypto fraud, fraud targeting specific communities) on a regular basis, with a particular focus on scams affecting older adults.',
    data_type: 'public_stats',
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
  {
    agency_name: 'CONDUSEF — Portal de Fraudes Financieros',
    country: 'MX',
    country_name: 'Mexico',
    url: 'https://www.gob.mx/condusef/acciones-y-programas/portal-de-fraudes-financieros',
    description:
      "Mexico's National Commission for the Protection and Defense of Financial Services Users runs this public portal, where anyone can look up phone numbers, websites, and emails already reported as fraudulent and submit new reports themselves. It doesn't publish aggregate loss statistics; non-financial consumer fraud (fake stores, deceptive ads) is handled separately by PROFECO.",
    data_type: 'public_stats',
  },
  {
    agency_name: 'Consumidor.gov.br (Secretaria Nacional do Consumidor)',
    country: 'BR',
    country_name: 'Brazil',
    url: 'https://www.consumidor.gov.br/pages/conteudo/publico/62',
    description:
      "Brazil's Ministry of Justice consumer secretariat (SENACON) runs this dispute-resolution platform, where consumers file complaints directly against participating companies. Its statistical panel and open-data exports — downloadable in bulk, with records dating back to 2014 — feed most public reporting on national consumer-fraud trends.",
    data_type: 'open_dataset',
  },
  {
    agency_name: 'National Police Agency — Cybercrime Fraud Statistics',
    country: 'KR',
    country_name: 'South Korea',
    url: 'https://www.data.go.kr/data/15064572/fileData.do',
    description:
      "South Korea's National Police Agency publishes yearly cybercrime-fraud figures — broken down by category such as direct-transaction fraud, shopping-mall scams, and (as of 2024) cyber investment fraud and celebrity-impersonation fraud — as a downloadable CSV dataset on the national Public Data Portal, with an Open API also available to registered users.",
    data_type: 'open_dataset',
  },
  {
    agency_name: 'INCIBE (Instituto Nacional de Ciberseguridad)',
    country: 'ES',
    country_name: 'Spain',
    url: 'https://www.incibe.es/incibe/sala-de-prensa/incibe-detecto-mas-de-122000-incidentes-de-ciberseguridad-en-2025',
    description:
      'Spain\'s National Cybersecurity Institute, under the Ministry for Digital Transformation, publishes an annual "Balance de Ciberseguridad" tallying the incidents it has handled — online fraud, led by phishing, is consistently its single largest category. INCIBE-CERT separately runs a public fraud-reporting channel, but does not publish a raw incident-level dataset.',
    data_type: 'annual_report',
  },
  {
    agency_name: 'Polizia Postale e delle Comunicazioni',
    country: 'IT',
    country_name: 'Italy',
    url: 'https://www.poliziadistato.it/articolo/i-dati-delle-attivita-della-postale-nel-2024',
    description:
      "Italy's national cybercrime police unit (part of the Polizia di Stato) publishes a yearly activity report with online-fraud case counts and euro losses, alongside sextortion, non-consensual-imagery, and critical-infrastructure-attack figures handled by its CNAIPIC center. The public can also file fraud reports directly through the unit's own online portal.",
    data_type: 'annual_report',
  },
  {
    agency_name: 'Bundesamt für Cybersicherheit (BACS) — formerly NCSC',
    country: 'CH',
    country_name: 'Switzerland',
    url: 'https://www.bacs.admin.ch/de/lageberichte',
    description:
      "Switzerland's federal cybersecurity office publishes a semi-annual situation report tallying voluntary and mandatory incident reports; fraud — including phishing and CEO fraud — has made up roughly half of all reports in recent editions. Reports are published in German, French, and English.",
    data_type: 'annual_report',
  },
  {
    agency_name: 'CERT Polska (NASK)',
    country: 'PL',
    country_name: 'Poland',
    url: 'https://cert.pl/en/posts/2026/04/annual-report-2025/',
    description:
      "Poland's national computer emergency response team, run by the NASK research institute, publishes a detailed annual report covering large-scale fraud campaigns, phishing, SMS fraud, and malware activity observed on Polish networks — the closest Polish equivalent to a national cybercrime-and-fraud yearbook.",
    data_type: 'annual_report',
  },
  {
    agency_name: 'Watchlist Internet (ÖIAT)',
    country: 'AT',
    country_name: 'Austria',
    url: 'https://www.watchlist-internet.at/',
    description:
      "Not a government agency — an independent, non-profit platform run by the Austrian Institute for Applied Telecommunications (ÖIAT), included here because it functions as Austria's de facto national fraud-warning service: documenting current online scam cases daily and taking public fraud reports through its own submission form.",
    data_type: 'public_stats',
  },
  {
    agency_name: 'RASI — Relatório Anual de Segurança Interna (SSI)',
    country: 'PT',
    country_name: 'Portugal',
    url: 'https://www.ssi.gov.pt/en/publicacoes/rasi',
    description:
      "Portugal's Internal Security System has published this annual security report every year since 1989, compiling recorded-crime statistics — including burla (fraud/swindling) offences — drawn from roughly 25 security forces and services into one national figure.",
    data_type: 'annual_report',
  },
  {
    agency_name: 'Statistics Finland — Offences and Coercive Measures',
    country: 'FI',
    country_name: 'Finland',
    url: 'https://stat.fi/en/statistics/rpk',
    description:
      'Finland has no single dedicated scam-reporting portal — victims report to the police — but Statistics Finland publishes fraud and payment-card-fraud victim counts, broken down by age group, as part of its quarterly-and-annual "Offences and coercive measures" statistics sourced from police records.',
    data_type: 'annual_report',
  },
];
