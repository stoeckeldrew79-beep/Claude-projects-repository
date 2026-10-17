import { AuthedRequest } from '../middleware/auth';
import { pool } from '../db/connection';
import { asyncHandler } from '../utils/asyncHandler';
import { broadcastAlert } from '../services/alerts';
import * as alertCandidatesModel from '../models/alertCandidates';
import * as UsersModel from '../models/users';

// Admin-only review queue for early-warning patterns detected in public
// report intake — see generateAlertCandidates.ts. Nothing here ever
// reaches a real subscriber's phone or inbox without a human clicking
// "approve" first.
export const listPending = asyncHandler<AuthedRequest>(async (_req, res) => {
  const candidates = await alertCandidatesModel.listPending();
  // Each candidate carries who it would reach if approved now, computed
  // with the same targeting the send uses. The pending queue is small
  // (one row per detected pattern awaiting review), so a count per row is
  // cheap.
  const withAudience = await Promise.all(
    candidates.map(async (candidate) => ({
      ...candidate,
      audience: await UsersModel.countAlertAudience({
        state: candidate.state ?? undefined,
        zip: candidate.zip_code ?? undefined,
        nationwide: candidate.is_nationwide,
      }),
    }))
  );
  res.json({ data: withAudience });
});

// Where subscribers are: how many have a home state, per state, plus how
// many a nationwide alert would reach — the context for judging whether a
// state-only alert is worth sending.
export const audienceSummary = asyncHandler<AuthedRequest>(async (_req, res) => {
  const [byState, nationwide] = await Promise.all([
    UsersModel.homeStateCounts(),
    UsersModel.countAlertAudience({ nationwide: true }),
  ]);
  res.json({ data: { by_state: byState, nationwide } });
});

export const approve = asyncHandler<AuthedRequest>(async (req, res) => {
  const candidate = await alertCandidatesModel.getById(req.params.id);
  if (!candidate) return res.status(404).json({ error: 'Alert candidate not found' });
  if (candidate.status !== 'pending') {
    return res.status(409).json({ error: `Already ${candidate.status}` });
  }

  const { rows } = await pool.query(
    `INSERT INTO alerts (title, body, alert_level, state, zip_code, is_nationwide)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [candidate.title, candidate.body, candidate.alert_level, candidate.state, candidate.zip_code, candidate.is_nationwide]
  );
  const alert = rows[0];

  const broadcast = await broadcastAlert(alert).catch((err) => ({
    smsSent: 0,
    emailsSent: 0,
    errors: [(err as Error).message],
  }));

  await alertCandidatesModel.markResolved(candidate.id, 'approved');

  res.status(201).json({ data: alert, broadcast });
});

export const dismiss = asyncHandler<AuthedRequest>(async (req, res) => {
  const candidate = await alertCandidatesModel.getById(req.params.id);
  if (!candidate) return res.status(404).json({ error: 'Alert candidate not found' });
  if (candidate.status !== 'pending') {
    return res.status(409).json({ error: `Already ${candidate.status}` });
  }
  await alertCandidatesModel.markResolved(candidate.id, 'dismissed');
  res.status(204).send();
});
