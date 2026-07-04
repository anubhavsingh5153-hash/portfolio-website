require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const path    = require('path');

const projectsRouter = require('./routes/projects');
const contactRouter  = require('./routes/contact');
const { initializeDatabase } = require('./db/connection');

const app  = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../frontend')));

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use('/api/projects', projectsRouter);
app.use('/api/contact',  contactRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Catch-all: serve frontend SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// ─── Error Handler ────────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// ─── Start ────────────────────────────────────────────────────────────────────
try {
  initializeDatabase();
  app.listen(PORT, () => {
    console.log(`\n🚀 Portfolio server running at http://localhost:${PORT}`);
    console.log(`📡 API available at  http://localhost:${PORT}/api`);
    console.log(`🌐 Frontend at       http://localhost:${PORT}\n`);
  });
} catch (err) {
  console.error('Failed to start server:', err);
  process.exit(1);
}
