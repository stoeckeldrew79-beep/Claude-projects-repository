import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { analyzeMessage } from '../utils/scamSignals';
import * as ScamCheckModel from '../models/scamCheck';
import { searchScams } from '../models/scams';
import { aiCheckEnabled, aiOpinion } from '../services/scamCheckAi';

const MAX_LENGTH = 5000;

// POST /v1/check — the Scam Checker. Nothing submitted here is stored.
export const check = asyncHandler(async (req: Request, res: Response) => {
  const text = typeof req.body?.text === 'string' ? req.body.text.trim() : '';
  if (text.length < 3) return res.status(400).json({ error: 'Paste the message, link, phone number or email to check.' });
  if (text.length > MAX_LENGTH) return res.status(400).json({ error: `Please keep it under ${MAX_LENGTH} characters.` });

  const analysis = analyzeMessage(text);
  const hosts = analysis.links.map((l) => l.host);

  const [contacts, mentioned, similarFromText, opinion] = await Promise.all([
    ScamCheckModel.contactReports({ phones: analysis.phones, emails: analysis.emails, hosts }),
    ScamCheckModel.scamsMentioningHosts(hosts),
    searchScams(text.slice(0, 300)),
    // Short inputs (a bare link or number) are better served by the rules.
    text.length >= 40 ? aiOpinion(text, analysis.signals.map((s) => s.title)) : Promise.resolve(null),
  ]);
  // The visitor's own words find the closest documented pattern; when they
  // don't match anything (a pasted message is often all specifics), the
  // warning signs it contains still point to the right family of scams.
  const similar = similarFromText.length || !analysis.signals.length ? similarFromText : await searchScams(analysis.signals[0].searchTerms);

  // Community reports outrank the rules: a contact others have already
  // reported is the strongest evidence the checker can show.
  const reported = contacts.length > 0 || mentioned.length > 0;
  const verdict = reported ? 'high_risk' : analysis.verdict;

  res.json({
    data: {
      verdict,
      score: reported ? Math.max(analysis.score, 80) : analysis.score,
      signals: analysis.signals,
      links: analysis.links,
      phones: analysis.phones,
      emails: analysis.emails,
      reportedContacts: contacts,
      mentionedIn: mentioned,
      similarScams: similar.slice(0, 4),
      ai: opinion,
      aiAvailable: aiCheckEnabled(),
    },
  });
});
