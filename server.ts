import app from './server/app.js';
import path from 'path';
import express from 'express';

const PORT = process.env.PORT || 3000;

// Vite middleware for development vs static build in production
  // Skip this block if running on Vercel, Vercel handles static files automatically.
  if (!process.env.VERCEL) {
    (async () => {
      if (process.env.NODE_ENV !== 'production') {
        const { createServer: createViteServer } = await import('vite');
        const vite = await createViteServer({
          server: { middlewareMode: true },
          appType: 'spa'
        });
        app.use(vite.middlewares);
      } else {
        const distPath = path.join(process.cwd(), 'dist');
        app.use(express.static(distPath));
        app.get('*', (req, res) => {
          res.sendFile(path.join(distPath, 'index.html'));
        });
      }

      app.listen(PORT, '0.0.0.0', () => {
        console.log(`SmartSplitMate Server running on http://0.0.0.0:${PORT}`);
      });
    })();
  }

