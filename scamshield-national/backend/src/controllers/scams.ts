import { AuthedRequest } from '../middleware/auth';
import * as ScamsModel from '../models/scams';
import { asyncHandler } from '../utils/asyncHandler';

export const list = asyncHandler<AuthedRequest>(async (req, res) => {
  const { category, state, zip, country, search, sort, page } = req.query;
  const scams = await ScamsModel.listScams({
    category: category as string | undefined,
    state: state as string | undefined,
    zip: zip as string | undefined,
    country: country as string | undefined,
    search: search as string | undefined,
    sort: sort as ScamsModel.ScamListFilters['sort'],
    page: page ? Number(page) : undefined,
  });
  res.json({ data: scams });
});

export const countries = asyncHandler<AuthedRequest>(async (_req, res) => {
  const countries = await ScamsModel.listActiveCountries();
  res.json({ data: countries });
});

export const getBySlug = asyncHandler<AuthedRequest>(async (req, res) => {
  const scam = await ScamsModel.getScamBySlug(req.params.slug);
  if (!scam) return res.status(404).json({ error: 'Scam not found' });
  res.json({ data: scam });
});

export const search = asyncHandler<AuthedRequest>(async (req, res) => {
  const q = req.query.q as string | undefined;
  if (!q) return res.status(400).json({ error: 'Missing query parameter "q"' });
  const results = await ScamsModel.searchScams(q);
  res.json({ data: results });
});

export const nearby = asyncHandler<AuthedRequest>(async (req, res) => {
  const zip = req.query.zip as string | undefined;
  if (!zip) return res.status(400).json({ error: 'Missing query parameter "zip"' });
  const results = await ScamsModel.scamsNearZip(zip);
  res.json({ data: results });
});

export const create = asyncHandler<AuthedRequest>(async (req, res) => {
  const scam = await ScamsModel.createScam(req.body);
  res.status(201).json({ data: scam });
});

export const update = asyncHandler<AuthedRequest>(async (req, res) => {
  const scam = await ScamsModel.updateScam(req.params.id, req.body);
  if (!scam) return res.status(404).json({ error: 'Scam not found' });
  res.json({ data: scam });
});

export const remove = asyncHandler<AuthedRequest>(async (req, res) => {
  const deleted = await ScamsModel.softDeleteScam(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Scam not found' });
  res.status(204).send();
});
