import 'dotenv/config';
import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import helmet from 'helmet';

import scamsRoutes from './routes/scams';
import categoriesRoutes from './routes/categories';
import usersRoutes from './routes/users';
import alertsRoutes from './routes/alerts';
import subscriptionsRoutes from './routes/subscriptions';
import articlesRoutes from './routes/articles';
import scamReportsRoutes from './routes/scamReports';
import globalSourcesRoutes from './routes/globalSources';
import statsRoutes from './routes/stats';
import { publicApiLimiter } from './middleware/rateLimit';

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection (should be unreachable — asyncHandler catches request-scoped errors):', reason);
});

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL ?? '*' }));

// Stripe webhook signatures are computed over the raw body, so this route
// must see it unparsed. Registered before express.json() — body-parser
// skips re-parsing a body a prior middleware already consumed.
app.use('/v1/subscriptions/webhook', express.raw({ type: 'application/json' }));
app.use(express.json());
app.use(publicApiLimiter);

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

const v1 = express.Router();
v1.use('/scams', scamsRoutes);
v1.use('/categories', categoriesRoutes);
v1.use('/', usersRoutes); // mounts /auth/* and /users/me under /v1
v1.use('/alerts', alertsRoutes);
v1.use('/subscriptions', subscriptionsRoutes);
v1.use('/articles', articlesRoutes);
v1.use('/reports', scamReportsRoutes);
v1.use('/global-sources', globalSourcesRoutes);
v1.use('/stats', statsRoutes);

app.use('/v1', v1);

// Backstop: every async controller/middleware is wrapped in asyncHandler
// (see src/utils/asyncHandler.ts), which forwards errors here instead of
// letting them become unhandled rejections. Without this, a single bad
// request can crash the entire process — confirmed locally: an invalid
// UUID in a JWT sub took the whole dev server down before this existed.
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

const port = process.env.PORT ? Number(process.env.PORT) : 3000;
// Binding to 0.0.0.0 explicitly (rather than leaving the host default)
// avoids an IPv6-only bind on Windows, where Node's default listen()
// otherwise refuses IPv4 connections to http://localhost from the browser.
app.listen(port, '0.0.0.0', () => {
  console.log(`ScamShield National API listening on :${port}`);
});
