-- Removes shareholder class-action solicitations ("BAC Stock Alert: BFA Law
-- Announces Securities Fraud ... Investigation", "INVESTOR ALERT: ... Filing
-- Deadline in Securities Fraud Class Action - Contact Kessler Topaz") that the
-- general news scan stored before jobs/newsQuality.ts existed. They are
-- lawsuits about a listed company's share price, bought onto the press-release
-- wires by plaintiff firms - not scams aimed at consumers.
--
-- The three patterns are jobs/newsQuality.ts's rules in Postgres syntax
-- (INVESTOR_SPAM_PG, PRESS_WIRE_PG, WIRE_LITIGATION_PG: \b rewritten to \y).
-- tests/newsQuality.test.ts fails if they stop matching that module, so the
-- one-off purge here and the live rules cannot quietly disagree. The same
-- predicate is applied at query time by controllers/dailyNews.ts and at
-- ingest by scanDailyScamNews.ts; this migration only clears what was
-- already stored.
--
-- Conservative by construction: general-news rows only (official AG and
-- federal releases are never touched), and no rule keys on a single common
-- word - "investor", "securities" or "class action" alone never match, so
-- Ponzi, crypto-investment and SEC/FINRA investor-alert stories survive.
DELETE FROM daily_scam_news
WHERE source_kind = 'news'
  AND (
    headline ~* '\y(?:rosen law|pomerantz|levi (?:&|and) korsinsky|bragar eagel|kessler topaz|hagens berman|bronstein,? gewirtz|faruqi|glancy prongay|robbins geller|kahn swick|lewis kahn|bfa law|bernstein liebhard|schall law|the gross law firm|portnoy law|johnson fistel|block (?:&|and) leviton|holzer (?:&|and) holzer|howard g\.? smith|frank r\.? cruz|brodsky (?:&|and) smith|halper sadeh|monteverde (?:&|and) associates|ademi (?:llp|firm)|robbins llp|kehoe law|rgrd law|purcell (?:&|and) lefkowitz|klaymantoskes|kirby mcinerney|bleichmar fonti|labaton|scott\+scott|berger montague|saxena white|edelson lechtzin|gainey mckenna|wolf haldenstein|rigrodsky|claimsfiler|djs law|bernstein litowitz|grabar law|kaskela law)\y|\y(?:securities (?:fraud )?class action|class action (?:lawsuit |suit )?(?:filed )?(?:against|on behalf of) (?:\w+ ){0,4}(?:investors|shareholders|stockholders)|(?:shareholder|stockholder)s? (?:alert|notice|reminder|update)|shareholder (?:class action|lawsuit|investigation|rights)|(?:lead plaintiff|class action) deadline|encourage[ds]? (?:\w+ ){0,3}(?:investors|shareholders) (?:to )?contact|(?:investors|shareholders) (?:may|should|are encouraged to) contact|breach of fiduciary duty investigation|opportunit(?:y|ies) to lead|seek to lead|fairly values|fairness of (?:the )?proposed|stock alert)\y|\((?:nasdaq|nyse|nyse american|amex|otc\w*|tsx|cboe)\s*:\s*[a-z.]{1,6}\).*\y(?:class action|lawsuit|investigation|investors|shareholders|securities)\y|\y(?:class action|lawsuit|investigation|investors|shareholders|securities)\y.*\((?:nasdaq|nyse|nyse american|amex|otc\w*|tsx|cboe)\s*:\s*[a-z.]{1,6}\)'
    OR (
      source_name ~* '\y(?:business ?wire|globe ?newswire|pr ?newswire|access ?(?:news)?wire|financialcontent|newsfile|ein presswire|accesswire)\y'
      AND headline ~* '\y(?:class action|securities|shareholders?|stockholders?|investors?|law firm|investigation)\y'
    )
  );
