import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';

import scamsRoutes from './routes/scams';
import categoriesRoutes from './routes/categories';
import usersRoutes from './routes/users';
import alertsRoutes from './routes/alerts';
import subscriptionsRoutes from './routes/subscriptions';
import articlesRoutes from './routes/articles';
import { publicApiLimiter } from './middleware/rateLimit';

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL ?? '*' }));
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

app.use('/v1', v1);

const port = process.env.PORT ? Number(process.env.PORT) : 3000;
app.listen(port, () => {
  console.log(`ScamShield National API listening on :${port}`);
});
