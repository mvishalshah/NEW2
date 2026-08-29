const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const target1 = `  app.patch('/api/notifications/read-all', (req, res) => {
    const user = db.getCurrentUser();
    const success = db.markAllNotificationsAsRead(user.id);
    res.json({ success });
  });`;

const replacement1 = `  app.patch('/api/notifications/read-all', (req, res) => {
    const user = db.getCurrentUser();
    const success = db.markAllNotificationsAsRead(user.id);
    res.json({ success });
  });

  // Catch-all for API routes to ensure they return JSON instead of HTML
  app.all('/api/*', (req, res) => {
    res.status(404).json({ error: \`API route not found: \${req.method} \${req.originalUrl}\` });
  });

  // Global error handler to ensure JSON responses for payload errors
  app.use((err: any, req: any, res: any, next: any) => {
    if (err.type === 'entity.too.large') {
      return res.status(413).json({ error: 'Image is too large. Please crop or compress it further.' });
    }
    if (err instanceof SyntaxError && 'body' in err) {
      return res.status(400).json({ error: 'Invalid JSON payload' });
    }
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  });`;

if (code.includes(target1)) {
  fs.writeFileSync('server.ts', code.replace(target1, replacement1));
  console.log("Success");
} else {
  console.log("Failed to find target");
}
