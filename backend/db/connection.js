/**
 * JsonDB — A lightweight, file-persisted JSON database for Node.js.
 *
 * No native binaries. No external services. Pure Node.js fs module.
 * Supports: find, findById, insert, update, delete, count.
 *
 * Data is stored at db/data.json and auto-saved after every write.
 */

'use strict';

const fs   = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'data.json');

// ─── Helpers ──────────────────────────────────────────────────────────────────

function readStore() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw);
  } catch {
    return { projects: [], contacts: [], _meta: { nextId: { projects: 1, contacts: 1 } } };
  }
}

function writeStore(store) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2), 'utf8');
}

function nextId(store, collection) {
  if (!store._meta)                         store._meta = { nextId: {} };
  if (!store._meta.nextId)                  store._meta.nextId = {};
  if (!store._meta.nextId[collection])      store._meta.nextId[collection] = 1;
  const id = store._meta.nextId[collection]++;
  writeStore(store);
  return id;
}

// ─── Collection class ─────────────────────────────────────────────────────────

class Collection {
  constructor(name) {
    this.name = name;
  }

  /** Return all documents matching optional predicate */
  find(predicate = null) {
    const store = readStore();
    const items = store[this.name] || [];
    return predicate ? items.filter(predicate) : [...items];
  }

  /** Return first document matching predicate */
  findOne(predicate) {
    return this.find(predicate)[0] || null;
  }

  /** Return document by numeric id */
  findById(id) {
    return this.findOne(doc => doc.id === parseInt(id, 10));
  }

  /** Count documents */
  count(predicate = null) {
    return this.find(predicate).length;
  }

  /** Insert a document. Returns the new document with auto id & timestamps. */
  insert(doc) {
    const store = readStore();
    if (!store[this.name]) store[this.name] = [];
    const id       = nextId(store, this.name);
    const now      = new Date().toISOString();
    const newDoc   = { id, ...doc, created_at: now };
    store[this.name].push(newDoc);
    writeStore(store);
    return newDoc;
  }

  /** Update documents matching predicate with patch object. Returns count changed. */
  update(predicate, patch) {
    const store = readStore();
    const items = store[this.name] || [];
    let changed = 0;
    store[this.name] = items.map(doc => {
      if (predicate(doc)) { changed++; return { ...doc, ...patch, updated_at: new Date().toISOString() }; }
      return doc;
    });
    writeStore(store);
    return changed;
  }

  /** Delete documents matching predicate. Returns count deleted. */
  delete(predicate) {
    const store   = readStore();
    const before  = (store[this.name] || []).length;
    store[this.name] = (store[this.name] || []).filter(doc => !predicate(doc));
    const deleted = before - store[this.name].length;
    writeStore(store);
    return deleted;
  }
}

// ─── DB singleton ─────────────────────────────────────────────────────────────

const db = {
  projects: new Collection('projects'),
  contacts: new Collection('contacts'),
};

// ─── Initialize ───────────────────────────────────────────────────────────────

function initializeDatabase() {
  // Ensure data file directory exists
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  // Seed if empty
  if (db.projects.count() === 0) {
    seedProjects();
    console.log('✅ Database seeded with sample projects');
  }

  console.log(`✅ JSON database ready at ${DATA_FILE}`);
}

function seedProjects() {
  const projects = [
    {
      title: 'BloodCare Management System',
      description: 'A comprehensive web application for managing blood donations, tracking blood inventory in real-time, and coordinating between blood banks, donors, and hospitals.',
      tech_stack: ['PHP', 'MySQL', 'HTML5', 'CSS3', 'JavaScript'],
      github_url: 'https://github.com/anubhavsingh5153',
      live_url: null,
      image_url: null,
      category: 'web',
      featured: true
    },
    {
      title: 'AURA E-commerce Website',
      description: 'A modern, fully responsive e-commerce web platform featuring product catalog display, user cart management, secure checkout flow, and custom animations.',
      tech_stack: ['HTML5', 'CSS3', 'JavaScript', 'Node.js', 'Express', 'MongoDB'],
      github_url: 'https://github.com/anubhavsingh5153',
      live_url: null,
      image_url: null,
      category: 'web',
      featured: true
    },
    {
      title: 'Personal Portfolio Website',
      description: 'A premium, interactive developer portfolio website featuring dark glassmorphism design, custom particle animations, a real-time contact form API, and dynamic database loading.',
      tech_stack: ['HTML5', 'CSS3', 'JavaScript', 'Node.js', 'Express', 'JSON DB'],
      github_url: 'https://github.com/anubhavsingh5153',
      live_url: 'http://localhost:5000',
      image_url: null,
      category: 'web',
      featured: true
    }
  ];

  projects.forEach(p => db.projects.insert(p));
}

module.exports = { db, initializeDatabase };
