import './config/env'; // load env first
import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());

app.use('/api', routes);

app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`🚀 Clash Dashboard API running on http://localhost:${env.port}`);
  console.log(`   Clan Tag: ${env.clanTag}`);
});

export default app;
