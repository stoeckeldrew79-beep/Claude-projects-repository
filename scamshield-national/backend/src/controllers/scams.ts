import { Response } from 'express';
import { AuthedRequest } from '../middleware/auth';
import * as ScamsModel from '../models/scams';

export async function list(req: AuthedRequest, res: Response) {
  const { category, state, zip, search, sort, page } = req.query;
  const scams = await ScamsModel.listScams({
    category: category as string | undefined,
    state: state as string | undefined,
    zip: zip as string | undefined,
    search: search as string | undefined,
    sort: sort as ScamsModel.ScamListFilters['sort'],
    page: page ? Number(page) : undefined,
  });
  res.json({ data: scams });
}

export async function getBySlug(req: AuthedRequest, res: Response) {
  const scam = await ScamsModel.getScamBySlug(req.params.slug);
  if (!scam) return res.status(404).json({ error: 'Scam not found' });
  res.json({ data: scam });
}

export async function search(req: AuthedRequest, res: Response) {
  const q = req.query.q as string | undefined;
  if (!q) return res.status(400).json({ error: 'Missing query parameter "q"' });
  const results = await ScamsModel.searchScams(q);
  res.json({ data: results });
}

export async function nearby(req: AuthedRequest, res: Response) {
  const zip = req.query.zip as string | undefined;
  if (!zip) return res.status(400).json({ error: 'Missing query parameter "zip"' });
  const results = await ScamsModel.scamsNearZip(zip);
  res.json({ data: results });
}

export async function create(req: AuthedRequest, res: Response) {
  const scam = await ScamsModel.createScam(req.body);
  res.status(201).json({ data: scam });
}

export async function update(req: AuthedRequest, res: Response) {
  const scam = await ScamsModel.updateScam(req.params.id, req.body);
  if (!scam) return res.status(404).json({ error: 'Scam not found' });
  res.json({ data: scam });
}

export async function remove(req: AuthedRequest, res: Response) {
  const deleted = await ScamsModel.softDeleteScam(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Scam not found' });
  res.status(204).send();
}
