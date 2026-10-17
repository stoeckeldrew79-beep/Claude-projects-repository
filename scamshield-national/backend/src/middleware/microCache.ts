import { NextFunction, Request, Response } from 'express';

// A short in-memory cache for public, read-only GET endpoints whose data
// changes on a cron schedule (hours), not per request. Every visitor in the
// same minute shares one database query instead of each running their own,
// which keeps pages fast on a small database even under a burst of traffic.
// Keyed by the full URL, so each filter/page combination caches separately;
// only 200 responses are stored. Also lets browsers/CDNs reuse it briefly.
export function microCache(ttlMs: number, maxEntries = 500) {
  const store = new Map<string, { at: number; status: number; body: unknown }>();

  return (req: Request, res: Response, next: NextFunction) => {
    if (req.method !== 'GET') return next();
    const key = req.originalUrl;
    const hit = store.get(key);
    res.set('Cache-Control', `public, max-age=${Math.floor(ttlMs / 1000)}`);
    if (hit && Date.now() - hit.at < ttlMs) {
      res.status(hit.status).json(hit.body);
      return;
    }
    const json = res.json.bind(res);
    res.json = (body: unknown) => {
      if (res.statusCode === 200) {
        if (store.size >= maxEntries) store.delete(store.keys().next().value as string);
        store.set(key, { at: Date.now(), status: 200, body });
      }
      return json(body);
    };
    next();
  };
}
