const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

// Remove the async function startServer() wrapper
code = code.replace(/async function startServer\(\) \{/g, '');
code = code.replace(/const app = express\(\);/g, 'const app = express();\nexport default app;');
code = code.replace(/const PORT = process.env.RENDER \? \(process\.env\.PORT \|\| 3000\) : 3000;/g, 'const PORT = process.env.PORT || 3000;');

// Replace the end part with the Vercel-aware boot logic
const endTarget = `  // Vite middleware for development vs static build in production
  if (process.env.NODE_ENV !== 'production') {
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
    console.log(\`SmartSplitMate Server running on http://0.0.0.0:\${PORT}\`);
  });
}

startServer();`;

const newEnd = `  // Vite middleware for development vs static build in production
  // Skip this block if running on Vercel, Vercel handles static files automatically.
  if (!process.env.VERCEL) {
    (async () => {
      if (process.env.NODE_ENV !== 'production') {
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
        console.log(\`SmartSplitMate Server running on http://0.0.0.0:\${PORT}\`);
      });
    })();
  }`;

if (code.includes(endTarget)) {
  code = code.replace(endTarget, newEnd);
  fs.writeFileSync('server.ts', code);
  console.log('Successfully patched server.ts');
} else {
  console.log('Failed to find endTarget in server.ts');
}

// Create api/index.ts
if (!fs.existsSync('api')) fs.mkdirSync('api');
fs.writeFileSync('api/index.ts', "import app from '../server.js';\nexport default app;\n");
console.log('Created api/index.ts');

// Create vercel.json
const vercelConfig = {
  "version": 2,
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api/index.ts"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
};
fs.writeFileSync('vercel.json', JSON.stringify(vercelConfig, null, 2));
console.log('Created vercel.json');

