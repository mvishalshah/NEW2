const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf-8');

// Extract the app setup and routes
let routes = content.substring(0, content.indexOf('// Vite middleware'));

// The rest goes into server.ts
let remaining = content.substring(content.indexOf('// Vite middleware'));

fs.writeFileSync('server/app.ts', routes);

let serverContent = `import app from './server/app.js';
import path from 'path';
import express from 'express';

const PORT = process.env.PORT || 3000;

${remaining}
`;
fs.writeFileSync('server.ts', serverContent);
