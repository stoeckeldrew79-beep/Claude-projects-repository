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
  {
    agency_name: 'Government Computer Emergency Response Team (CERT.AM)',
    country: 'AM',
    country_name: 'Armenia',
    url: 'https://cert.gov.am/en/',
    description:
      "Armenia's official government CERT accepts public reports of phishing messages, ransomware, DDoS attacks, and other cyber incidents through a web form, email, and phone, and coordinates with law enforcement on investigations. It has no public statistics page of its own; a separate, non-governmental CERT.AM run by the Internet Society of Armenia also operates alongside it.",
    data_type: 'public_stats',
  },
  {
    agency_name: 'Coordination Center for Cybersecurity (CERT-KG)',
    country: 'KG',
    country_name: 'Kyrgyzstan',
    url: 'https://cert.gov.kg/',
    description:
      "Kyrgyzstan's national CERT, run by the Coordination Center for Cybersecurity under the State Committee for National Security, maintains a public cyberthreat database and accepts citizen reports of data breaches and cyberattacks through its own web form, alongside phishing-awareness and cyberhygiene guidance. It does not publish aggregate incident or fraud statistics.",
    data_type: 'public_stats',
  },
  {
    agency_name: 'National Computer Emergency Response Team (CERT.BY)',
    country: 'BY',
    country_name: 'Belarus',
    url: 'https://cert.by/?lang=en',
    description:
      "Belarus's national computer emergency response team monitors the country's internet segment for malware and network attacks and accepts public reports of phishing emails, malicious code, and suspicious activity by web form, email, and phone. It publishes incident write-ups and threat analyses but no aggregate statistics of its own; periodic national fraud-loss figures are instead released separately by the Ministry of Internal Affairs through press briefings.",
    data_type: 'public_stats',
  },
  {
    agency_name: 'Landespolizei Liechtenstein — Jahresbericht',
    country: 'LI',
    country_name: 'Liechtenstein',
    url: 'https://www.landespolizei.li/ueber-uns/jahresberichte',
    description:
      "The Principality of Liechtenstein's national police publishes a detailed annual report (Jahresbericht) with a full crime-statistics breakdown, including a dedicated Betrug/Untreue (fraud/breach of trust) offense category — 184 recorded cases in the 2021 edition — alongside year-on-year comparisons and clearance rates, archived on this page back to 2009.",
    data_type: 'annual_report',
  },
  {
    agency_name: 'Economic and Financial Crimes Commission (EFCC)',
    country: 'NG',
    country_name: 'Nigeria',
    url: 'https://www.efcc.gov.ng/',
    description:
      "Nigeria's principal anti-graft law enforcement agency investigates and prosecutes advance-fee fraud (\"419\") schemes, cybercrime, and money laundering, publishing case news, conviction announcements, and public scam-pattern advisories (its \"Red Alert\" series) on its website rather than a single consolidated annual report or dataset.",
    data_type: 'public_stats',
  },
  {
    agency_name: 'National Cyber Crime Investigation Agency (NCCIA)',
    country: 'PK',
    country_name: 'Pakistan',
    url: 'https://www.nccia.gov.pk/',
    description:
      "Pakistan's federal cybercrime authority — successor to the FIA's Cyber Crime Wing (NR3C) — investigates online fraud, phishing, and digital harassment reported through its portal and helpline; complaint volumes, case breakdowns, and conviction figures are compiled into an annual report presented to parliament.",
    data_type: 'annual_report',
  },
  {
    agency_name: 'PNP Anti-Cybercrime Group (ACG)',
    country: 'PH',
    country_name: 'Philippines',
    url: 'https://acg.pnp.gov.ph/',
    description:
      "The Philippine National Police's dedicated cybercrime unit investigates online scams, identity theft, and other ICT-enabled offenses reported through its eComplaint portal and hotline, and releases case-volume figures through press statements rather than a standalone public report or dataset.",
    data_type: 'public_stats',
  },
  {
    agency_name: 'National Consumer Commission (NCC)',
    country: 'ZA',
    country_name: 'South Africa',
    url: 'https://thencc.org.za/',
    description:
      "Established under the Consumer Protection Act, South Africa's national consumer regulator investigates complaints against suppliers — including fraudulent and deceptive marketing practices — filed through its online e-Services portal, and reports on enforcement outcomes through its own communications rather than a routine open dataset.",
    data_type: 'public_stats',
  },
  {
    agency_name: 'National KE-CIRT/CC (Communications Authority of Kenya)',
    country: 'KE',
    country_name: 'Kenya',
    url: 'https://www.ke-cirt.go.ke/',
    description:
      "Kenya's national Computer Incident Response Team, run by the Communications Authority, accepts public reports of phishing, mobile-money fraud, and other cyber incidents, and publishes detailed quarterly cybersecurity reports with incident-volume statistics.",
    data_type: 'public_stats',
  },
  {
    agency_name: 'Cyber Police Department of Ukraine',
    country: 'UA',
    country_name: 'Ukraine',
    url: 'https://cyberpolice.gov.ua/',
    description:
      "Ukraine's national police cybercrime unit accepts public reports of phishing, malware, and online fraud through its website, and publishes case write-ups and threat advisories in its news section rather than a consolidated report or downloadable dataset.",
    data_type: 'public_stats',
  },
  {
    agency_name: 'eCrime (UAE Ministry of Interior / Abu Dhabi Police)',
    country: 'AE',
    country_name: 'United Arab Emirates',
    url: 'https://www.ecrime.ae/',
    description:
      "The UAE's federal online platform for reporting cybercrime — including digital fraud, extortion, and identity theft — lets residents and visitors file complaints, including anonymously, directly with police; it functions as a reporting channel rather than a source of published statistics or an open dataset.",
    data_type: 'public_stats',
  },
  {
    agency_name: 'Consumer Protection Agency (CPA)',
    country: 'EG',
    country_name: 'Egypt',
    url: 'https://cpa.gov.eg/en-us/',
    description:
      "Egypt's Ministry of Trade and Industry-affiliated consumer protection body investigates complaints about fraudulent and deceptive commercial practices filed through its hotline and online complaint form, publishing consumer advisories rather than a formal annual report or open dataset.",
    data_type: 'public_stats',
  },
  {
    agency_name: 'Directorate of National Consumer Rights Protection (DNCRP)',
    country: 'BD',
    country_name: 'Bangladesh',
    url: 'https://dncrp.gov.bd/',
    description:
      "Bangladesh's quasi-judicial consumer-rights body, established under the Consumer Rights Protection Act 2009, investigates complaints of fraudulent and deceptive business practices filed through its National Consumer Complaint Center hotline (16121) and online portal, publishing case-disposal figures rather than a formal annual report or open dataset.",
    data_type: 'public_stats',
  },
  {
    agency_name: 'Instituto Nacional de Defensa de la Competencia y de la Protección de la Propiedad Intelectual (INDECOPI)',
    country: 'PE',
    country_name: 'Peru',
    url: 'https://www.gob.pe/indecopi',
    description:
      "Peru's national consumer-protection and competition authority accepts consumer complaints — including fraud and deceptive commercial practices — through its Citizen Service portal and consumidor.gob.pe, and publishes periodic bulletins and reports on complaint volumes and enforcement actions.",
    data_type: 'public_stats',
  },
  {
    agency_name: 'Cyber Bureau, Nepal Police',
    country: 'NP',
    country_name: 'Nepal',
    url: 'https://cyberbureau.nepalpolice.gov.np/',
    description:
      "Nepal Police's dedicated cybercrime investigation unit accepts public reports of online fraud, financial scams, and other cyber offenses through its website and hotline, with case statistics released through its parent agency's press releases rather than a standalone report or dataset.",
    data_type: 'public_stats',
  },
  {
    agency_name: 'Centre for Cybersecurity Belgium (CCB) — Safeonweb',
    country: 'BE',
    country_name: 'Belgium',
    url: 'https://ccb.belgium.be/',
    description:
      "Belgium's national cybersecurity authority runs Safeonweb, the public reporting platform where citizens forward suspected phishing and scam messages to suspicious@safeonweb.be; the CCB periodically publishes figures on messages received and threats blocked, including nearly 10 million suspicious alerts logged in 2025.",
    data_type: 'public_stats',
  },
  {
    agency_name: 'Cybercrime Unit, Public Security Directorate (PSD)',
    country: 'JO',
    country_name: 'Jordan',
    url: 'https://www.psd.gov.jo/',
    description:
      "Jordan's national police cybercrime unit, within the Public Security Directorate's Criminal Investigation Department, investigates online fraud and scam reports filed via the emergency line (911) or in person, and issues public warnings and case updates through its own and national media channels rather than a consolidated report or dataset.",
    data_type: 'public_stats',
  },
  {
    agency_name: 'Consumer Protection Department — Ministry of Commerce',
    country: 'SA',
    country_name: 'Saudi Arabia',
    url: 'https://mc.gov.sa/en/About/Departments/cp/pages/default.aspx',
    description:
      "Saudi Arabia's Ministry of Commerce investigates commercial-fraud and deceptive-practice complaints filed through its Balagh Tejari app and 1900 hotline, publishing enforcement actions and violator names rather than a formal annual report or open dataset.",
    data_type: 'public_stats',
  },
  {
    agency_name: 'Autoridad de Protección al Consumidor y Defensa de la Competencia (ACODECO)',
    country: 'PA',
    country_name: 'Panama',
    url: 'https://www.acodeco.gob.pa/',
    description:
      "Panama's consumer protection and antitrust authority runs a public complaints dashboard ('Tablero de Quejas') that publishes monthly counts of formal denuncias and in-person quejas, resolution rates, and the businesses drawing the most complaints.",
    data_type: 'public_stats',
  },
  {
    agency_name: 'Instituto Nacional de Protección de los Derechos del Consumidor (Pro Consumidor)',
    country: 'DO',
    country_name: 'Dominican Republic',
    url: 'https://proconsumidor.gob.do/',
    description:
      "The Dominican Republic's national consumer-rights institute investigates fraud and deceptive-practice complaints and publishes an annual institutional report ('Memoria Institucional') covering complaint volumes, inspections, and sanctions.",
    data_type: 'annual_report',
  },
  {
    agency_name: 'Consumer Protection and Anti-Commercial Fraud Department — Ministry of Commerce and Industry',
    country: 'QA',
    country_name: 'Qatar',
    url: 'https://www.moci.gov.qa/en/about-the-ministry/departments/departments-under-the-assistant-deputy-of-consumer-affairs/the-consumer-protection-and-combating-commercial-fraud/',
    description:
      "Qatar's Ministry of Commerce and Industry department for consumer protection and combating commercial fraud investigates complaints, samples suspicious goods, and publishes enforcement actions and consumer-awareness findings rather than a consolidated dataset.",
    data_type: 'public_stats',
  },
  {
    agency_name: "Consumer's Ombudsman (Synigoros tou Katanaloti)",
    country: 'GR',
    country_name: 'Greece',
    url: 'https://www.synigoroskatanaloti.gr/en',
    description:
      "Greece's independent consumer-mediation authority resolves disputes between consumers and businesses, including fraud and deceptive-practice complaints, and publishes an annual report on case volumes and mediation outcomes.",
    data_type: 'annual_report',
  },
  {
    agency_name: 'Consumer Agency (Neytendastofa)',
    country: 'IS',
    country_name: 'Iceland',
    url: 'https://www.neytendastofa.is/english/the-consumer-agency/',
    description:
      "Iceland's independent consumer-protection and market-surveillance agency handles complaints about unfair and fraudulent commercial practices, publishing a yearly report on its enforcement activity and market oversight.",
    data_type: 'annual_report',
  },
  {
    agency_name: 'Consumer Protection Directorate — Ministry of Industry and Trade',
    country: 'MA',
    country_name: 'Morocco',
    url: 'https://www.mcinet.gov.ma/en/content/consumer-protection',
    description:
      "Morocco's national consumer-protection directorate runs the khidmat-almostahlik.ma complaint portal and coordinates provincial market-surveillance commissions, publishing yearly figures on complaints handled, points of sale inspected, and infractions recorded — nearly 2,600 complaints and 300,000 inspections reported for 2024.",
    data_type: 'public_stats',
  },
  {
    agency_name: 'Malta Competition and Consumer Affairs Authority (MCCAA)',
    country: 'MT',
    country_name: 'Malta',
    url: 'https://mccaa.org.mt/',
    description:
      "Malta's national competition and consumer-affairs regulator handles consumer complaints through its Complaints and Conciliation Directorate and publishes an annual report covering complaint volumes, mediation outcomes, and market-surveillance activity.",
    data_type: 'annual_report',
  },
  {
    agency_name: 'Consumer Protection and Technical Regulatory Authority (TTJA)',
    country: 'EE',
    country_name: 'Estonia',
    url: 'https://www.ttja.ee/en',
    description:
      "Estonia's consumer-protection authority operates the Consumer Disputes Committee, which resolves several thousand consumer-versus-trader disputes a year and publishes case-outcome statistics on its site rather than a single consolidated report.",
    data_type: 'public_stats',
  },
  {
    agency_name: 'State Consumer Rights Protection Authority (VVTAT)',
    country: 'LT',
    country_name: 'Lithuania',
    url: 'https://vvtat.lrv.lt/en/',
    description:
      "Lithuania's national consumer-rights enforcement and market-surveillance body, and the country's main alternative dispute resolution authority, publishes complaint-volume and case-nature statistics on a six-month and annual basis.",
    data_type: 'public_stats',
  },
  {
    agency_name: 'Market Inspectorate of the Republic of Slovenia',
    country: 'SI',
    country_name: 'Slovenia',
    url: 'https://www.gov.si/en/state-authorities/bodies-within-ministries/market-inspectorate/',
    description:
      "Slovenia's market-surveillance and consumer-protection inspectorate investigates unfair commercial practices and consumer complaints, and is legally required to publish an annual report of its inspection and enforcement activity each year.",
    data_type: 'annual_report',
  },
  {
    agency_name: 'National Consumer Commission (Comisión Nacional del Consumidor) — Ministry of Economy, Industry and Commerce',
    country: 'CR',
    country_name: 'Costa Rica',
    url: 'https://www.consumo.go.cr/',
    description:
      "Costa Rica's consumer-protection commission and its Consumer Support Directorate, both under MEIC, adjudicate consumer complaints — chiefly warranty and contract-breach disputes — and the ministry publishes complaint-volume figures that have climbed from roughly 2,500 a year in 2010 to nearly 6,000 in recent years.",
    data_type: 'public_stats',
  },
  {
    agency_name: 'Consumer Defense Unit (Unidad Defensa del Consumidor) — Ministry of Economy and Finance',
    country: 'UY',
    country_name: 'Uruguay',
    url: 'https://www.gub.uy/ministerio-economia-finanzas/unidad-defensa-consumidor',
    description:
      "Uruguay's national consumer-defense unit handles consumer complaints, sanctions non-compliant businesses, and publishes a yearly statistical report on inquiries and complaints handled — Informe estadístico — going back to 2020.",
    data_type: 'annual_report',
  },
  {
    agency_name: 'Commission for Consumer Protection (KZP)',
    country: 'BG',
    country_name: 'Bulgaria',
    url: 'https://www.kzp.bg/en',
    description:
      "Bulgaria's national market-surveillance and consumer-protection body handles consumer complaints and signals and publishes a legally required annual report (Годишен доклад) on its enforcement activity, sanctions, and complaint volumes.",
    data_type: 'annual_report',
  },
  {
    agency_name: 'Slovak Trade Inspection (SOI)',
    country: 'SK',
    country_name: 'Slovakia',
    url: 'https://www.soi.sk/en/SOI.soi',
    description:
      "Slovakia's state market-surveillance authority for consumer protection investigates trader complaints and product-safety violations, and publishes a yearly Výročná správa (annual report) detailing inspection counts, submissions received, and sanctions imposed.",
    data_type: 'annual_report',
  },
  {
    agency_name: 'Consumer Rights Protection Centre (PTAC)',
    country: 'LV',
    country_name: 'Latvia',
    url: 'https://www.ptac.gov.lv/en',
    description:
      "Latvia's national consumer-rights authority, operating under the Ministry of Economics, handles consumer complaints and publishes ongoing statistics on complaint and consultation volumes by sector, including financial services and travel.",
    data_type: 'public_stats',
  },
  {
    agency_name: 'Consumer Protection Service — Ministry of Energy, Commerce and Industry',
    country: 'CY',
    country_name: 'Cyprus',
    url: 'https://consumer.gov.cy/en/',
    description:
      "Cyprus's government consumer-protection department investigates unfair commercial practices and product-safety complaints, and publishes a statistics section covering complaint activity alongside RAPEX hazardous-product recall notices.",
    data_type: 'public_stats',
  },
  {
    agency_name: 'Public Authority for Consumer Protection (PACP)',
    country: 'OM',
    country_name: 'Oman',
    url: 'https://gov.om/en/consumer-protection-authority',
    description:
      "Oman's national consumer-protection authority investigates fraud, price violations, and counterfeiting complaints, and publishes periodic statistics on complaints, reports, violations, and seized goods.",
    data_type: 'public_stats',
  },
  {
    agency_name: 'Competition and Consumer Authority (CCA)',
    country: 'BW',
    country_name: 'Botswana',
    url: 'https://www.cca.co.bw/',
    description:
      "Botswana's competition and consumer-protection regulator investigates unfair business practices and consumer complaints, and publishes a legally required annual report covering its enforcement and complaint-handling activity.",
    data_type: 'annual_report',
  },
  {
    agency_name: 'Competition and Consumer Protection Commission (CCPC)',
    country: 'ZM',
    country_name: 'Zambia',
    url: 'https://www.ccpc.org.zm/',
    description:
      "Zambia's dual-mandate competition and consumer-protection commission investigates consumer complaints and unfair trading practices, and publishes an annual report on its enforcement, complaint-resolution, and consumer-education activity.",
    data_type: 'annual_report',
  },
  {
    agency_name: 'Commission de Surveillance du Secteur Financier (CSSF) — Warnings',
    country: 'LU',
    country_name: 'Luxembourg',
    url: 'https://www.cssf.lu/en/warnings/',
    description:
      "Luxembourg's financial-sector regulator maintains a continuously updated, publicly searchable list of warnings against unauthorised entities and suspected investment or financial fraud, alongside a register of legitimately licensed firms that the public can check a suspicious company or website against.",
    data_type: 'public_stats',
  },
  {
    agency_name: 'Trinidad and Tobago Cyber Security Incident Response Team (TT-CSIRT)',
    country: 'TT',
    country_name: 'Trinidad and Tobago',
    url: 'https://ttcsirt.gov.tt/statistics/',
    description:
      "Trinidad and Tobago's national CSIRT, under the Ministry of National Security, takes public reports of cyber incidents including phishing and online fraud, and publishes a statistics page breaking down officially reported incidents by category and year (91 incidents reported in 2025, nearly 70% phishing and business email compromise).",
    data_type: 'public_stats',
  },
  {
    agency_name: 'Financial Investigations Division (FID)',
    country: 'JM',
    country_name: 'Jamaica',
    url: 'https://www.fid.gov.jm/publications/reports/',
    description:
      "Jamaica's Financial Investigations Division, under the Ministry of Finance and the Public Service, investigates money laundering, tax, and other financial crimes, and publishes a series of yearly annual reports plus typology reports describing emerging fraud patterns such as refund and chargeback fraud.",
    data_type: 'annual_report',
  },
  {
    agency_name: 'Dirección de Atención y Asistencia al Consumidor (DIACO)',
    country: 'GT',
    country_name: 'Guatemala',
    url: 'https://diaco.gob.gt/',
    description:
      "Guatemala's national consumer-protection agency, part of the Ministry of Economy, takes consumer complaints online, by phone, and in person, and publishes a statistical report ('Reporte Estadístico') on complaint volume alongside consumer alerts about scams and fraudulent practices.",
    data_type: 'public_stats',
  },
  {
    agency_name: 'Defensoría del Consumidor',
    country: 'SV',
    country_name: 'El Salvador',
    url: 'https://www.defensoria.gob.sv/',
    description:
      "El Salvador's national consumer-protection ombudsman investigates consumer complaints and fraud against consumers, and regularly publishes case-volume and recovery figures — over 24,000 annual complaints and millions of dollars recovered for consumers in recent reporting periods.",
    data_type: 'public_stats',
  },
  {
    agency_name: 'Namibia Financial Institutions Supervisory Authority (NAMFISA)',
    country: 'NA',
    country_name: 'Namibia',
    url: 'https://www.namfisa.com.na/',
    description:
      "Namibia's non-banking financial-sector regulator publishes yearly annual reports and quarterly statistical bulletins that include consumer-complaint figures by sector (insurance, pension funds, micro-lending), and issues public notices warning consumers about specific scams targeting financial-services customers.",
    data_type: 'annual_report',
  },
  {
    agency_name: 'State Inspectorate of the Republic of Croatia — Market Inspection Sector',
    country: 'HR',
    country_name: 'Croatia',
    url: 'https://dirh.gov.hr/o-drzavnom-inspektoratu/trzisna-inspekcija/85',
    description:
      "Croatia's State Inspectorate investigates consumer complaints against traders and unfair commercial practices through its Market Inspection Sector, and regularly publishes figures on inspection activity — over 2,000 supervisory actions in a single reporting period in 2025 alone.",
    data_type: 'public_stats',
  },
  {
    agency_name: 'Ministry of Trade, Tourism and Telecommunications — Consumer Protection Sector',
    country: 'RS',
    country_name: 'Serbia',
    url: 'https://mtt.gov.rs/sektori/sektor-za-zastitu-potrosaca/?0=lat',
    description:
      "Serbia's national consumer-protection authority sets consumer-protection policy, oversees registered consumer associations, and publishes an annual National Consumer Complaints Registry report summarizing complaint volumes handled nationwide.",
    data_type: 'annual_report',
  },
  {
    agency_name: 'Ombudsman Institution for Consumer Protection in Bosnia and Herzegovina',
    country: 'BA',
    country_name: 'Bosnia and Herzegovina',
    url: 'https://ozp.gov.ba',
    description:
      "Bosnia and Herzegovina's independent consumer-protection ombudsman investigates consumer complaints and unfair trading practices nationwide, and publishes annual work reports and periodic special reports on its enforcement activity.",
    data_type: 'annual_report',
  },
  {
    agency_name: 'State Inspectorate for Non-Food Products Supervision and Consumer Protection (ISSPNPC)',
    country: 'MD',
    country_name: 'Moldova',
    url: 'https://consumator.gov.md/ro',
    description:
      "Moldova's state consumer-protection and market-surveillance inspectorate handles consumer complaints and publishes periodic activity reports with complaint-volume figures — 1,275 petitions and complaints logged in the first half of 2026 alone, a 77.8% year-on-year increase.",
    data_type: 'public_stats',
  },
  {
    agency_name: 'Secretaría de Defensa del Consumidor y el Usuario (SEDECO)',
    country: 'PY',
    country_name: 'Paraguay',
    url: 'https://sedeco.gov.py/',
    description:
      "Paraguay's national consumer-protection secretariat handles consumer complaints, maintains a public registry of sanctioned infractors, and publishes periodic transparency reports on complaint and inquiry volumes and amounts recovered for consumers.",
    data_type: 'public_stats',
  },
  {
    agency_name: 'Independent Consumer and Competition Commission (ICCC)',
    country: 'PG',
    country_name: 'Papua New Guinea',
    url: 'https://iccc.gov.pg/',
    description:
      "Papua New Guinea's independent consumer and competition regulator enforces consumer-protection law, investigates complaints, and publishes an annual report plus quarterly newsletters covering its enforcement actions and market oversight.",
    data_type: 'annual_report',
  },
  {
    agency_name: 'National Bank of Georgia — Consumer Rights Protection Division',
    country: 'GE',
    country_name: 'Georgia',
    url: 'https://nbg.gov.ge/en/page/consumer-protection',
    description:
      "Georgia's central bank operates a dedicated Consumer Rights Protection Division that accepts and reviews complaints against financial-service providers under national consumer-finance legislation and publishes complaint statistics through its online portal.",
    data_type: 'public_stats',
  },
  {
    agency_name: 'Dirección General de Protección al Consumidor (DGPC)',
    country: 'HN',
    country_name: 'Honduras',
    url: 'https://sde.gob.hn/proteccion-al-consumidor/',
    description:
      "Honduras's national consumer-protection directorate, under the Secretariat of Economic Development, takes consumer complaints via a free hotline, WhatsApp, and an online platform, and publishes regular price-monitoring reports on basic goods alongside its enforcement activity.",
    data_type: 'public_stats',
  },
  {
    agency_name: 'Rwanda Investigation Bureau (RIB)',
    country: 'RW',
    country_name: 'Rwanda',
    url: 'https://www.rib.gov.rw/',
    description:
      "Rwanda's national crime-investigation authority operates public toll-free lines for reporting fraud and other offenses, and its crime figures — including fraud and forgery case counts — are released periodically through parliamentary briefings and national statistics publications rather than a standalone dataset.",
    data_type: 'public_stats',
  },
  {
    agency_name: 'Electronic and Cyber Crime Combating Department — Ministry of Interior',
    country: 'KW',
    country_name: 'Kuwait',
    url: 'https://www.moi.gov.kw/main/sections/cyber-crime?culture=en',
    description:
      "Kuwait's Ministry of Interior unit investigates reports of online fraud, phishing, and financial scams submitted through its hotline and WhatsApp line, with case counts and funds-recovered figures disclosed through official statements and state media rather than a published report or dataset.",
    data_type: 'public_stats',
  },
  {
    agency_name: 'Central Bank of Bahrain — Consumer Protection',
    country: 'BH',
    country_name: 'Bahrain',
    url: 'https://www.cbb.gov.bh/consumer-information/',
    description:
      "Bahrain's central bank reviews consumer complaints against licensed banks and financial institutions, requires licensees to file quarterly complaint summaries, and reports on consumer-protection activity within its annual report.",
    data_type: 'annual_report',
  },
  {
    agency_name: 'Consumer Protection Competition and Fraud Repression Directorate-General (CCF)',
    country: 'KH',
    country_name: 'Cambodia',
    url: 'https://www.ccfdg.gov.kh/en/',
    description:
      "Cambodia's national authority for consumer protection, competition, and fraud repression accepts consumer complaints through its website and investigates deceptive commercial practices, publishing enforcement actions and market-surveillance updates rather than a consolidated dataset.",
    data_type: 'public_stats',
  },
  {
    agency_name: 'Portal do Consumidor — Instituto Nacional das Comunicações de Moçambique (INCM)',
    country: 'MZ',
    country_name: 'Mozambique',
    url: 'https://consumidor.incm.gov.mz/',
    description:
      "Mozambique's communications regulator runs a public portal for filing complaints about telecommunications and postal fraud and service issues, and publishes an annual Consumer Defense report alongside a statistical archive of sector data.",
    data_type: 'annual_report',
  },
  {
    agency_name: 'Dirección General de Protección de los Derechos de las Personas Consumidoras y Usuarias (DIPRODEC)',
    country: 'NI',
    country_name: 'Nicaragua',
    url: 'https://www.mific.gob.ni/Inicio/Fomento/DIPRODEC/Atenci%C3%B3n-Ciudadana',
    description:
      "Nicaragua's national consumer-protection directorate, under the Ministry of Development, Industry and Trade, investigates consumer complaints and denuncias against businesses and reports its enforcement and asset-recovery figures publicly rather than through a formal dataset.",
    data_type: 'public_stats',
  },
  {
    agency_name: 'Uganda Communications Commission — Cybersecurity Reports',
    country: 'UG',
    country_name: 'Uganda',
    url: 'https://www.ucc.co.ug/cybersecurity-reports/',
    description:
      "Uganda's telecom and broadcasting regulator publishes periodic Cyber Security Posture reports covering threats, incidents, and vulnerabilities affecting the national communications sector, alongside its CERT.UG/CC incident-response function.",
    data_type: 'annual_report',
  },
  {
    agency_name: 'Tanzania Communications Regulatory Authority (TCRA)',
    country: 'TZ',
    country_name: 'Tanzania',
    url: 'https://www.tcra.go.tz/',
    description:
      "Tanzania's communications regulator operates a dedicated consumer-complaints line for telecom and postal service issues, including fraud, and publishes quarterly Communication Statistics reports covering sector performance and complaint handling.",
    data_type: 'public_stats',
  },
  {
    agency_name: 'National Bank of Kazakhstan — Anti-Fraud Center',
    country: 'KZ',
    country_name: 'Kazakhstan',
    url: 'https://nationalbank.kz/en/news/informacionnye-soobshcheniya',
    description:
      "Kazakhstan's central bank operates a real-time Anti-Fraud Center linking banks, mobile operators, and law enforcement to detect and block fraudulent payment transactions, and periodically discloses incident counts and blocked-funds figures through public statements on its news page rather than a standing dataset.",
    data_type: 'public_stats',
  },
  {
    agency_name: 'Competition and Consumer Affairs Commission (CCAC)',
    country: 'GY',
    country_name: 'Guyana',
    url: 'https://ccac.gov.gy/',
    description:
      "Guyana's national consumer-protection and competition authority investigates consumer complaints, including fraud and unfair trade practices, and publishes complaint-volume and category statistics through its website and public reporting.",
    data_type: 'public_stats',
  },
  {
    agency_name: 'BruCERT (Brunei Computer Emergency Response Team)',
    country: 'BN',
    country_name: 'Brunei',
    url: 'https://www.brucert.org.bn/',
    description:
      "Brunei's national CERT, under Cyber Security Brunei, accepts public incident reports for online fraud and other cyber incidents and publishes National Cyber Incident Statistics alongside security alerts and advisories.",
    data_type: 'public_stats',
  },
  {
    agency_name: 'Maldives Monetary Authority (MMA)',
    country: 'MV',
    country_name: 'Maldives',
    url: 'https://www.mma.gov.mv/',
    description:
      "Maldives' central bank regulates financial institutions and handles escalated consumer complaints against banks and other licensees, publishing its consumer-protection and financial-sector activity within its annual report.",
    data_type: 'annual_report',
  },
  {
    agency_name: 'Utilities Regulation and Competition Authority (URCA)',
    country: 'BS',
    country_name: 'Bahamas',
    url: 'https://urcabahamas.bs/urcapublications/',
    description:
      "The Bahamas' telecommunications and electricity regulator enforces Consumer Protection Regulations covering complaint handling by licensed operators and publishes its annual report and sector publications, including consumer-complaint compliance data, on its website.",
    data_type: 'annual_report',
  },
  {
    agency_name: 'Financial Intelligence Unit Belize (FIU-Belize)',
    country: 'BZ',
    country_name: 'Belize',
    url: 'https://fiubelize.org/',
    description:
      "Belize's central financial-crime authority accepts anonymous public reports of fraud and other financial crime through a secure voluntary-disclosure web form, issues scam-alert bulletins, and publishes annual reports on its enforcement and analysis activity.",
    data_type: 'annual_report',
  },
  {
    agency_name: 'Financial Services Commission (FSC)',
    country: 'BB',
    country_name: 'Barbados',
    url: 'https://www.fsc.gov.bb/',
    description:
      "Barbados' non-bank financial-sector regulator accepts consumer complaints, tips, and referrals about regulated entities through its Tips, Complaints & Referrals portal and publishes an annual report covering its supervisory and complaint-handling activity. (Note: the country's other consumer authority, the Fair Trading Commission at ftc.gov.bb, is currently offline.)",
    data_type: 'annual_report',
  },
  {
    agency_name: 'Central Bank of Samoa',
    country: 'WS',
    country_name: 'Samoa',
    url: 'https://cbs.gov.ws/news/central-bank-of-samoa-warns-public-of-rising-scams',
    description:
      "Samoa's central bank runs a public scams page and issues press releases disclosing aggregate figures from financial institutions' suspicious-activity reports — e.g. that 70% of all such reports in FY2024/25, and 60% so far in FY2025/26, were scam-related.",
    data_type: 'public_stats',
  },
  {
    agency_name: 'National Agency for Information and Communication Technologies (ANTIC)',
    country: 'CM',
    country_name: 'Cameroon',
    url: 'https://www.antic.cm/index.php/fr/cybersecurite/cybercriminalite/283-la-cybercriminalite.html',
    description:
      "Cameroon's national cybersecurity agency monitors online fraud, phishing, and impersonation targeting citizens and institutions, and discloses yearly figures through its cybercrime bilan and security-alert bulletins — including over 32,500 judicial requisitions and thousands of fraudulent-account takedowns reported for 2025.",
    data_type: 'public_stats',
  },
  {
    agency_name: 'Centrale Bank van Suriname (Central Bank of Suriname)',
    country: 'SR',
    country_name: 'Suriname',
    url: 'https://www.cbvs.sr/',
    description:
      "Suriname's central bank periodically issues public press releases (persberichten) warning citizens about unlicensed investment offers, Ponzi and pyramid schemes, and fraudulent use of the Bank's own name and logo.",
    data_type: 'public_stats',
  },
  {
    agency_name: 'Central Bank of Solomon Islands (CBSI)',
    country: 'SB',
    country_name: 'Solomon Islands',
    url: 'https://www.cbsi.com.sb/article/press-release-no1225-public-warning-money-mule-scam-targeting-local-bank-account-holders',
    description:
      "Solomon Islands' central bank periodically issues public press-release warnings on active fraud patterns — most recently a money-mule scheme recruiting local account holders — alongside earlier alerts on email prize scams and a fake Facebook account impersonating its Governor.",
    data_type: 'public_stats',
  },
  {
    agency_name: 'National Reserve Bank of Tonga',
    country: 'TO',
    country_name: 'Tonga',
    url: 'https://www.reservebank.to/index.php/news/public-warning-protect-yourself-from-ponzi-and-pyramid-and-investment-schemes',
    description:
      "Tonga's central bank publishes public warning notices about Ponzi, pyramid, and social-media investment schemes targeting Tongan communities, including a joint 2026 alert issued with New Zealand's Financial Markets Authority over a cross-border crypto investment scam.",
    data_type: 'public_stats',
  },
  {
    agency_name: 'Bank of Mauritius — Scam Alerts',
    country: 'MU',
    country_name: 'Mauritius',
    url: 'https://www.bom.mu/media/scam-alerts',
    description:
      "Mauritius' central bank maintains a running public Scam Alerts page warning of active fraud schemes, and separately operates an online Fraud/Scam Reporting form — anonymous submissions accepted — covering phishing, identity fraud, and investment scams.",
    data_type: 'public_stats',
  },
  {
    agency_name: 'Financial Intelligence Authority (FIA) Saint Lucia',
    country: 'LC',
    country_name: 'Saint Lucia',
    url: 'https://www.slufia.com/news',
    description:
      "Saint Lucia's financial intelligence unit publishes public warning notices about fraudulent investment schemes and unauthorized financial solicitations — including a 2026 alert on the 'CARICOM Invest' scheme — often jointly with the island's Financial Services Regulatory Authority and Consumer Affairs Department.",
    data_type: 'public_stats',
  },
  {
    agency_name: "UIFAND (Unitat d'Intel·ligència Financera d'Andorra)",
    country: 'AD',
    country_name: 'Andorra',
    url: 'https://www.uifand.ad/ca',
    description:
      "Andorra's financial intelligence unit publishes an annual activity report (Memòria d'Activitats) with statistics on suspicious-transaction reports and anti-money-laundering enforcement going back 15 years, and posts current-year figures on its site.",
    data_type: 'annual_report',
  },
  {
    agency_name: 'Autorità Garante per la Protezione dei Dati Personali (San Marino Data Protection Authority)',
    country: 'SM',
    country_name: 'San Marino',
    url: 'https://www.garanteprivacy.sm/pub1/garante/en',
    description:
      "San Marino's independent data protection authority handles public complaints about misuse of personal data — including fraudulent impersonation and unlawful processing — and publishes its formal proceedings and decisions organized by year.",
    data_type: 'public_stats',
  },
  {
    agency_name: 'Consumer Affairs Office (Ministry of Legal Affairs, Labour and Consumer Affairs)',
    country: 'GD',
    country_name: 'Grenada',
    url: 'https://llca.gov.gd/consumer/',
    description:
      "Grenada's Consumer Affairs Office investigates and mediates consumer complaints under the Consumer Protection Act 2018, and has publicly reported its complaint volumes alongside advisories warning residents about active internet and investment scams.",
    data_type: 'public_stats',
  },
  {
    agency_name: 'Domestic Trade and Consumer Affairs Division',
    country: 'VC',
    country_name: 'Saint Vincent and the Grenadines',
    url: 'https://foreign.gov.vc/foreign/index.php/commerce-a-consumer-affairs',
    description:
      "Saint Vincent and the Grenadines' Domestic Trade and Consumer Affairs Division is the government's central agency for enforcing the Consumer Protection Act and publishes consumer-rights guidance on the Ministry of Foreign Affairs, Commerce, and Consumer Affairs site.",
    data_type: 'public_stats',
  },
  {
    agency_name: 'Consumer Affairs Department (Ministry of International Trade, Industry, Commerce and Consumer Affairs)',
    country: 'KN',
    country_name: 'Saint Kitts and Nevis',
    url: 'https://miticca.gov.kn/consumer-affairs/',
    description:
      "Saint Kitts and Nevis' Consumer Affairs Department processes, investigates, and mediates written consumer complaints under the Consumer Protection Act 2003, publishing its complaint-handling procedures and contact channels on the ministry's official site.",
    data_type: 'public_stats',
  },
  {
    agency_name: 'Prices and Consumer Affairs Division',
    country: 'AG',
    country_name: 'Antigua and Barbuda',
    url: 'https://consumeraffairs.gov.ag/',
    description:
      "Antigua and Barbuda's Prices and Consumer Affairs Division investigates consumer complaints and queries, and publishes consumer-rights, pricing, and fair-trading guidance on its official government site.",
    data_type: 'public_stats',
  },
  {
    agency_name: 'Consumer Protection Commission',
    country: 'ZW',
    country_name: 'Zimbabwe',
    url: 'https://cpc.org.zw/',
    description:
      "Zimbabwe's statutory Consumer Protection Commission, established under the Consumer Protection Act (Chapter 14:44), investigates and mediates complaints about deceptive, misleading, unfair, or fraudulent trade conduct and publishes its governing acts and departmental activity.",
    data_type: 'public_stats',
  },
  {
    agency_name: 'Fair Trading Commission',
    country: 'SC',
    country_name: 'Seychelles',
    url: 'https://ftc.gov.sc/',
    description:
      "Seychelles' Fair Trading Commission investigates consumer complaints and competition violations under the Fair Trading Act 2022, and has publicly reported year-over-year complaint-volume statistics, including a reported 42% drop in complaints in 2019.",
    data_type: 'public_stats',
  },
  {
    agency_name: 'Competition and Fair Trading Commission (CFTC)',
    country: 'MW',
    country_name: 'Malawi',
    url: 'https://www.cftc.mw/',
    description:
      "Malawi's Competition and Fair Trading Commission accepts free-of-charge complaints about unfair trading practices and consumer-rights violations, publishing its complaint procedures and enforcement mandate on its official site.",
    data_type: 'public_stats',
  },
  {
    agency_name: 'Eswatini Competition Commission',
    country: 'SZ',
    country_name: 'Eswatini',
    url: 'https://www.compco.co.sz/',
    description:
      "Eswatini's Competition Commission, established under the Competition Act 2007, protects consumer welfare against unfair trading practices and anti-competitive conduct and publishes its enforcement mandate and activities.",
    data_type: 'public_stats',
  },
  {
    agency_name: 'Office National de Lutte contre la Fraude et la Corruption (OFNAC)',
    country: 'SN',
    country_name: 'Senegal',
    url: 'https://ofnac.sn/',
    description:
      "Senegal's independent anti-fraud and anti-corruption authority accepts confidential public complaints reporting suspected fraud and corruption, and publishes a detailed annual activity report (Rapport d'activités) with case-handling statistics.",
    data_type: 'annual_report',
  },
  {
    agency_name: 'National Authority for Trade and Consumer Protection (Nemzeti Kereskedelmi és Fogyasztóvédelmi Hatóság)',
    country: 'HU',
    country_name: 'Hungary',
    url: 'https://nkfh.gov.hu/en',
    description:
      "Hungary's national market-surveillance and consumer protection authority conducts inspection sweeps of traders — covering food safety, product safety, and pricing — and publishes the resulting enforcement statistics, such as violation rates found and fines issued, in regular public reports.",
    data_type: 'public_stats',
  },
  {
    agency_name: 'Central Information System for Consumer Protection (potrosac.me)',
    country: 'ME',
    country_name: 'Montenegro',
    url: 'https://www.potrosac.me/',
    description:
      "Montenegro's EU-funded national consumer protection portal, run with the Ministry of Economy's Directorate for Consumer Protection, lets citizens submit consumer complaints online and publishes consumer-rights, product-safety, and pricing-transparency information.",
    data_type: 'public_stats',
  },
  {
    agency_name: 'Gambia Competition and Consumer Protection Commission (GCCPC)',
    country: 'GM',
    country_name: 'Gambia',
    url: 'https://gcc.gm/',
    description:
      "The Gambia Competition and Consumer Protection Commission enforces the Consumer Protection Act 2014, handles consumer complaints referred to its Tribunal, and publishes market-surveillance and annual reports through its Media Center.",
    data_type: 'annual_report',
  },
  {
    agency_name: 'Direction de la Protection des Consommateurs (DPC), Ministère du Commerce',
    country: 'MG',
    country_name: 'Madagascar',
    url: 'https://www.pic.commerce.mg/fr/direction-de-la-protection-des-consommateurs-dpc',
    description:
      "Madagascar's Ministry of Commerce consumer protection directorate is responsible for consumer protection and fraud/counterfeiting prevention nationwide, and publishes its mandate and complaint contact channels on the government's official trade information portal.",
    data_type: 'public_stats',
  },
];
