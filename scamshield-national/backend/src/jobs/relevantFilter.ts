// Shared scam/fraud relevance filter for official-source news scans
// (scanStateAgNews.ts, scanFederalScamNews.ts). Matched against the TITLE
// ONLY, deliberately — matching the description too was tried first and
// gave 31% false positives out of 108 real items: a press release whose
// body merely mentions fraud in passing got pulled in, and an "elder
// abuse" term dragged in a nursing-home assault case that has nothing to
// do with scams.
//
// The alert vocabulary below (warns/consumer alert/beware) is kept
// alongside the scam vocabulary because real alerts often name the lure
// instead of the category — "Warns Delawareans of Bogus Tax E-mails"
// contains no scam word at all. Tuned against 108 actual AG headlines:
// keeps the genuine alerts, drops settlements, hearings and unrelated
// prosecutions.
//
// Lives in its own file rather than being exported from scanStateAgNews.ts
// (where it originated): that file, like every job script, runs its own
// main() unconditionally at module load — importing it just to reuse this
// constant was triggering a full extra scan run as a side effect, sharing
// (and racing against) the importing job's own DB pool.
export const RELEVANT =
  /\b(scam|fraud|fraudulent|phishing|spoof|imposter|impostor|identity theft|robocall|price goug|deceptive|ponzi|swindl|predatory|counterfeit|deceiv|consumer alert|consumer warning|consumer advisory|warns?\b|warning|beware|urges consumers|alerts consumers)/i;
