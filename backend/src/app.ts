import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { connectDB } from './config/database';
import { env } from './config/env';
import routes from './routes';
import { errorHandler } from './middleware/error.middleware';
import './models';

const app = express();
app.use(cors({ origin: env.CORS_ORIGIN }));
app.use(express.json());
app.use(rateLimit({ windowMs: 60_000, max: 100 }));
app.use('/api/v1', routes);
app.use(errorHandler);

const start = async (): Promise<void> => {
  await connectDB();
  app.listen(env.PORT, () => {
    console.log(`🚀 Backend running on http://localhost:${env.PORT}`);
  });
};

start().catch((error) => {
  console.error('Startup error:', error);
  process.exit(1);
});