const express = require('express');
const router  = express.Router();
const { db }  = require('../db/connection');

// ─── GET /api/projects ────────────────────────────────────────────────────────
router.get('/', (req, res) => {
  try {
    const { category, featured } = req.query;

    let projects = db.projects.find();

    if (category && category !== 'all') {
      projects = projects.filter(p => p.category === category);
    }
    if (featured === 'true') {
      projects = projects.filter(p => p.featured === true);
    }

    // Sort: featured first, then by created_at desc
    projects.sort((a, b) => {
      if (b.featured !== a.featured) return b.featured ? 1 : -1;
      return new Date(b.created_at) - new Date(a.created_at);
    });

    res.json({ success: true, count: projects.length, data: projects });
  } catch (err) {
    console.error('GET /api/projects error:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch projects' });
  }
});

// ─── GET /api/projects/:id ────────────────────────────────────────────────────
router.get('/:id', (req, res) => {
  try {
    const project = db.projects.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }
    res.json({ success: true, data: project });
  } catch (err) {
    console.error('GET /api/projects/:id error:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch project' });
  }
});

module.exports = router;
