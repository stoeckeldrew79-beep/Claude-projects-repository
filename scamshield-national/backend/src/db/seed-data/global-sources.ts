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
  {
    agency_name: 'Anti-Deception Coordination Centre (ADCC)',
    country: 'HK',
    country_name: 'Hong Kong',
    url: 'https://www.adcc.gov.hk/en-hk/statistic.html',
    description:
      "The Hong Kong Police Force's dedicated anti-scam unit, under the Commercial Crime Bureau, operating since 2017 alongside the 24-hour Anti-Scam Helpline 18222. Publishes periodic statistics — case counts, monetary losses, and year-over-year changes — broken down by scam type (e-shopping, online investment, employment scams, phishing, telephone deception, and more).",
    data_type: 'public_stats',
  },
  {
    agency_name: 'National Police Agency — 165 Anti-Fraud Hotline',
    country: 'TW',
    country_name: 'Taiwan',
    url: 'https://www.npa.gov.tw/ch/app/data/view?module=wg055&id=2213&serno=7fea48ff-5e04-4488-bf86-cab18412d282',
    description:
      "Taiwan's National Police Agency, Ministry of the Interior, runs the nationwide 165 Anti-Fraud Hotline and website for reporting scams. The NPA's statistics division separately publishes detailed crime-statistics tables, including fraud case counts, updated regularly and downloadable as PDF and spreadsheet files.",
    data_type: 'public_stats',
  },
  {
    agency_name: 'Anti-Online Scam Operation Center (AOC 1441)',
    country: 'TH',
    country_name: 'Thailand',
    url: 'https://mdes.go.th/mission/detail/9122-Anti-Online-Scam-Operation-Center--AOC1441-',
    description:
      "A one-stop government center under Thailand's Ministry of Digital Economy and Society, run jointly with the Royal Thai Police, the Anti-Money Laundering Office, the Bank of Thailand, and telecom regulator NBTC. Operating the 1441 hotline since November 2023, it publishes operational figures — reports received, suspicious accounts suspended, and losses prevented — plus regular rundowns of the most common scam types.",
    data_type: 'public_stats',
  },
  {
    agency_name: 'CAI Virtual — Observatorio del Cibercrimen (DIJIN, Policía Nacional)',
    country: 'CO',
    country_name: 'Colombia',
    url: 'https://caivirtual.policia.gov.co/observatorio',
    description:
      "Run by DIJIN, the Colombian National Police's criminal investigation directorate, CAI Virtual is the country's official portal for reporting cybercrime, including online fraud. Its Cybercrime Observatory publishes weekly threat bulletins and an annual cybercrime balance report ('Balance anual del cibercrimen') with case trends and figures.",
    data_type: 'annual_report',
  },
  {
    agency_name: 'Servicio Nacional del Consumidor (SERNAC)',
    country: 'CL',
    country_name: 'Chile',
    url: 'https://www.sernac.cl/portal/619/w3-propertyvalue-20973.html',
    description:
      "Chile's National Consumer Service publishes research and complaint data on financial-market fraud, including a technical report analyzing payment-fraud typologies and periodic complaint-volume figures. Fraud-related complaints to SERNAC rose sharply after a 2024 law (Ley 21.673) shifted more liability for unauthorized transactions onto financial institutions.",
    data_type: 'public_stats',
  },
  {
    agency_name: 'Indonesia Anti-Scam Centre (IASC) — OJK',
    country: 'ID',
    country_name: 'Indonesia',
    url: 'https://iasc.ojk.go.id/',
    description:
      "A public reporting portal run by Indonesia's Financial Services Authority (OJK) through its Satgas PASTI illegal-finance task force, launched in November 2024 to fast-track victims' fraud reports to banks and payment providers for rapid account freezing. OJK periodically releases aggregate figures on reports received, accounts blocked, and funds recovered through its press releases.",
    data_type: 'public_stats',
  },
  {
    agency_name: 'Adli Sicil ve İstatistik Genel Müdürlüğü — Adalet İstatistikleri',
    country: 'TR',
    country_name: 'Turkey',
    url: 'https://adlisicil.adalet.gov.tr/Home/SayfaDetay/adalet-istatistikleri-yayin-arsivi',
    description:
      "Turkey's Ministry of Justice Directorate General of Judicial Records and Statistics publishes an annual \"Adalet İstatistikleri\" (Justice Statistics) report, in Turkish and English, covering prosecutorial case counts by offense — including dolandırıcılık (fraud), which recorded the sharpest year-on-year rise of any offense category in the 2024 edition.",
    data_type: 'annual_report',
  },
  {
    agency_name: 'National Scam Response Centre (NSRC) — NFCC',
    country: 'MY',
    country_name: 'Malaysia',
    url: 'https://nfcc.jpm.gov.my/index.php/ms/nsrc',
    description:
      "Malaysia's National Anti-Financial Crime Centre (NFCC) coordinates the NSRC, a rapid-response hotline (997) run jointly with the Royal Malaysia Police, Bank Negara Malaysia, and communications regulator MCMC, to freeze funds from online financial scams. NFCC has no standing statistics page of its own; aggregate figures on calls handled and funds frozen are instead released periodically through the Ministry of Finance and national media (Bernama).",
    data_type: 'public_stats',
  },
  {
    agency_name: 'Økokrim (National Authority for Investigation and Prosecution of Economic and Environmental Crime)',
    country: 'NO',
    country_name: 'Norway',
    url: 'https://www.okokrim.no/rapport-om-bedragerier.6399019-411472.html',
    description:
      "Norway's national economic-crime authority, part of the police and prosecution service, publishes a periodically updated fraud-threat report analyzing scam types — investment fraud, romance scams, director/invoice fraud — and issues press statements with year-on-year police-reported fraud figures; fraud has consistently made up over 80% of all recorded economic-crime reports in recent years.",
    data_type: 'public_stats',
  },
  {
    agency_name: 'Unidad Fiscal Especializada en Ciberdelincuencia (UFECI)',
    country: 'AR',
    country_name: 'Argentina',
    url: 'https://www.fiscales.gob.ar/ciberdelincuencia/la-unidad-fiscal-especializada-en-ciberdelincuencia-informa-que-en-2024-se-registro-un-aumento-interanual-del-211-en-la-cantidad-de-reportes-de-delitos-informaticos/',
    description:
      "Argentina's specialized cybercrime unit within the Ministerio Público Fiscal (national Public Prosecutor's Office). Its annual management report tallies computer-crime reports submitted by the public — 34,468 in 2024, a 21.1% year-on-year rise — broken down by category; online fraud ('fraude en línea') is consistently the largest, accounting for 63% of all reports.",
    data_type: 'annual_report',
  },
  {
    agency_name: 'Israel National Cyber Directorate (INCD) — 119 CERT',
    country: 'IL',
    country_name: 'Israel',
    url: 'https://www.gov.il/en/pages/2025report',
    description:
      "Israel's national cybersecurity agency, reporting to the Prime Minister's Office, runs the 24/7 119 hotline as the country's Computer Emergency Response Centre. Its annual summary report tallies the incident and scam reports the hotline handles — 26,500 in the 2025 edition, up 55% year-on-year, with phishing the single largest category at 52% — alongside alerts issued and organizations proactively notified of active attacks.",
    data_type: 'annual_report',
  },
  {
    agency_name: 'Authority of Information Security (NCSC) — Ministry of Information and Communications',
    country: 'VN',
    country_name: 'Vietnam',
    url: 'https://beta-en.mic.gov.vn/over-220000-reports-of-online-fraud-received-in-vietnams-banking-sector-197241030085335181.htm',
    description:
      "Vietnam's Authority of Information Security, under the Ministry of Information and Communications, runs the National Cyber Security Center (NCSC), which operates a public online-fraud warning and reporting channel and maintains a national database of fraudulent websites. The Ministry periodically publishes national tallies drawn from these reports — over 220,000 online fraud reports were logged in the first ten months of 2024 alone, most tied to banking and financial scams.",
    data_type: 'public_stats',
  },
  {
    agency_name: 'Sri Lanka Computer Emergency Readiness Team (Sri Lanka CERT)',
    country: 'LK',
    country_name: 'Sri Lanka',
    url: 'https://cert.gov.lk/',
    description:
      "Sri Lanka's national cybersecurity incident-response agency, established in 2006. It accepts public reports of cybersecurity incidents through its own incident-reporting portal — routing financial-fraud and scam-specific reports there rather than through its general email — and its homepage tracks a running tally of reported incidents by category, including phishing, ransomware, and DDoS.",
    data_type: 'public_stats',
  },
  {
    agency_name: 'Cyber Security Authority (CSA) — CERT-GH',
    country: 'GH',
    country_name: 'Ghana',
    url: 'https://www.csa.gov.gh/',
    description:
      "Ghana's cybersecurity regulator, established under the Cybersecurity Act, 2020. It runs CERT-GH and a 24-hour incident-reporting point of contact (call or text 292) for cybercrime, including online fraud. The CSA has no standing statistics page of its own; instead it periodically discloses national fraud-incident figures through press briefings and its National Cyber Security Awareness Month campaign — reporting, for example, that online fraud accounted for 47% of the 3,876 incidents it logged nationally in the first seven months of 2026.",
    data_type: 'public_stats',
  },
  {
    agency_name: 'Directoratul Național de Securitate Cibernetică (DNSC)',
    country: 'RO',
    country_name: 'Romania',
    url: 'https://www.dnsc.ro/',
    description:
      "Romania's national cybersecurity directorate runs PNRISC, the National Platform for Reporting Cybersecurity Incidents, where individuals and organizations report phishing and other online fraud (also reachable via the 1911 hotline), and maintains a public Blacklist of domains identified as fraudulent. DNSC's annual activity report tallies incidents handled, with phishing consistently the leading category.",
    data_type: 'annual_report',
  },
  {
    agency_name: 'Internal Security Forces — Cybercrime and Intellectual Property Bureau',
    country: 'LB',
    country_name: 'Lebanon',
    url: 'https://isf.gov.lb/internet-security-awareness/',
    description:
      "Lebanon's national police cybercrime unit investigates online fraud, blackmail, and other cyber-enabled crime, reachable via a dedicated phone line (01/293293) or the ISF's own anonymous online complaints form. It publishes case-specific news alerts about active fraud rings and impersonation scams rather than aggregate statistics.",
    data_type: 'public_stats',
  },
  {
    agency_name: 'Agence Nationale de la Cybersécurité (ANCS) — tunCERT',
    country: 'TN',
    country_name: 'Tunisia',
    url: 'https://www.ancs.tn/fr/tuncert',
    description:
      "Tunisia's National Cybersecurity Agency runs tunCERT, a free incident-response service for citizens and businesses that accepts incident reports by email and phone and provides direct on-site help to individuals reporting compromised computers or online fraud; it does not publish a public statistics page of its own.",
    data_type: 'public_stats',
  },
  {
    agency_name: 'Consumer Council of Fiji',
    country: 'FJ',
    country_name: 'Fiji',
    url: 'https://consumersfiji.org/',
    description:
      "Fiji's independent statutory consumer watchdog, established under the Consumer Council of Fiji Act 1976, takes scam complaints through its Alternative Dispute Resolution & Consumer Advisory Division and its mobile app. It periodically publishes press releases with scam-complaint counts and financial-loss figures — 113 complaints and over $82,000 in reported losses between September 2024 and September 2025 in its most recent release.",
    data_type: 'public_stats',
  },
  {
    agency_name: 'Rigspolitiet — It-relateret økonomisk kriminalitet (NC3)',
    country: 'DK',
    country_name: 'Denmark',
    url: 'https://politi.dk/aktuelt/statistik/it-relateret-oekonomisk-kriminalitet',
    description:
      "Denmark's National Police publishes an annual report on IT-related economic crime, compiled by the National Cyber Crime Center (NC3) from fraud reports filed by citizens and businesses — 35,258 reports in the 2023 edition, a 30% year-on-year rise — alongside standalone reports on dating (romance) fraud and sextortion.",
    data_type: 'annual_report',
  },
  {
    agency_name: 'MKD-CIRT (National Center for Computer Incident Response)',
    country: 'MK',
    country_name: 'North Macedonia',
    url: 'https://mkd-cirt.mk/',
    description:
      "North Macedonia's national CERT, operating under the Agency for Electronic Communications, is the country's official point of contact for cyber incidents including phishing and online-fraud campaigns. It accepts public reports through a web form, email, and phone, and issues threat alerts and awareness guidance rather than a periodic statistics report.",
    data_type: 'public_stats',
  },
  {
    agency_name: 'UZCERT',
    country: 'UZ',
    country_name: 'Uzbekistan',
    url: 'https://uzcert.uz/en/',
    description:
      "Uzbekistan's national cybersecurity incident-response service publishes running yearly tallies on its site — including phishing sites blocked and cyberattacks eliminated (82 and over 67 million respectively in its 2025 figures) — and accepts incident and fraud reports from the public by email, phone, or web form.",
    data_type: 'public_stats',
  },
  {
    agency_name: 'CERT.GOV.AZ (Computer Emergency Response Center)',
    country: 'AZ',
    country_name: 'Azerbaijan',
    url: 'https://cert.gov.az/en',
    description:
      "Azerbaijan's Computer Emergency Response Center, run by the State Service for Special Communication and Information Security, issues public warnings about fraudulent domains impersonating services like the myGov portal and ASAN Pay, runs a blacklist lookup tool for suspicious websites, and takes citizen incident reports through the site's own Report Incident form.",
    data_type: 'public_stats',
  },
  {
    agency_name: 'Autoridad de Supervisión del Sistema Financiero (ASFI)',
    country: 'BO',
    country_name: 'Bolivia',
    url: 'https://www.asfi.gob.bo/pagina-de-comunicados',
    description:
      "Bolivia's financial system regulator, operating since 1928, publishes a regularly updated public alerts page naming specific fraudulent platforms and schemes it has detected impersonating banks or offering irregular investments (recent examples include fake trading platforms and unauthorized Telegram investment offers). It also takes written complaints about suspected unlicensed financial activity through its regional offices and a toll-free hotline, but does not publish aggregate fraud-loss statistics.",
    data_type: 'public_stats',
  },
  {
    agency_name: 'National Police Agency — Crime Statistics',
    country: 'MN',
    country_name: 'Mongolia',
    url: 'https://police.gov.mn/as/article/3',
    description:
      "Mongolia's National Police Agency publishes monthly and year-to-date crime and violation statistics, including a standing fraud ('залилах') case count on its homepage — 11,829 registered fraud cases in the first eight months of 2026 alone, the single largest crime category the agency tracks. A companion open dataset of registered criminal cases is also published via Mongolia's national open-data portal (opendata.gov.mn).",
    data_type: 'public_stats',
  },
  {
    agency_name: 'National Cyber Security Authority (AKSK)',
    country: 'AL',
    country_name: 'Albania',
    url: 'https://aksk.gov.al/en/home-2/',
    description:
      "Albania's national cybersecurity authority (Autoriteti Kombëtar për Sigurinë Kibernetike), the country's designated CSIRT, runs public phishing- and incident-reporting channels and displays a running homepage tally of its activity — 1,247 incidents reported and 1,189 resolved in its 2025 figures — alongside audit and certification counts. It also publishes periodic annual reports, though the most recent full public edition on file dates to 2022.",
    data_type: 'public_stats',
  },
];
