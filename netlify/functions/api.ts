import express from 'express';
import serverless from 'serverless-http';
import { apiRouter } from '../../server/routes.ts';

const app = express();

// Body parsing with 10MB limit for image uploads
app.use(express.json({ limit: '10mb' }));

// Dedicated health check for Netlify function routing
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    app: 'Connectly',
    version: '1.0.0',
    connected: true,
    platform: 'Netlify Functions',
    timestamp: new Date().toISOString(),
    database: 'data_connectly_db.json',
    environment: process.env.NODE_ENV || 'production'
  });
});

// Mount the primary application REST router
app.use('/api', apiRouter);

export const handler = serverless(app);
