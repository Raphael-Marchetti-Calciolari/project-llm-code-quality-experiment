import express from 'express';
import cors from 'cors';
import { publicRoutes } from './routes/public.js';
import { adminRoutes } from './routes/admin.js';

export function createApp(db) {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use('/api', publicRoutes(db));
  app.use('/api/admin', adminRoutes(db));

  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode;
    if (status >= 400 && status < 500) return res.status(status).json({ error: 'JSON inválido' });
    console.error(err);
    res.status(500).json({ error: 'Erro interno' });
  });
  return app;
}
