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
      title: 'AI Chat Application',
      description: 'A real-time AI-powered chat application with natural language processing capabilities. Features multi-room support, message history, and intelligent auto-responses powered by a custom NLP model.',
      tech_stack: ['React', 'Node.js', 'Socket.io', 'Python', 'TensorFlow', 'MongoDB'],
      github_url: 'https://github.com/alexjohnson/ai-chat-app',
      live_url: 'https://ai-chat.demo.com',
      image_url: null,
      category: 'ai',
      featured: true
    },
    {
      title: 'E-Commerce Platform',
      description: 'A full-featured e-commerce platform with product management, shopping cart, secure payments via Stripe, order tracking, and an admin dashboard with real-time analytics.',
      tech_stack: ['Next.js', 'TypeScript', 'PostgreSQL', 'Stripe', 'Tailwind', 'Prisma'],
      github_url: 'https://github.com/alexjohnson/ecommerce-platform',
      live_url: 'https://shop.demo.com',
      image_url: null,
      category: 'web',
      featured: true
    },
    {
      title: 'Task Management Dashboard',
      description: 'A Kanban-style project management tool with drag-and-drop boards, team collaboration, deadline reminders, and progress analytics. Supports unlimited workspaces and custom workflows.',
      tech_stack: ['Vue.js', 'Express', 'MySQL', 'Redis', 'Docker', 'WebSockets'],
      github_url: 'https://github.com/alexjohnson/task-dashboard',
      live_url: 'https://tasks.demo.com',
      image_url: null,
      category: 'web',
      featured: true
    },
    {
      title: 'Fitness Tracker App',
      description: 'A cross-platform mobile app for tracking workouts, nutrition, and fitness goals. Features GPS route tracking for outdoor activities, custom workout plans, and visual progress charts.',
      tech_stack: ['React Native', 'Expo', 'Firebase', 'Node.js', 'Chart.js'],
      github_url: 'https://github.com/alexjohnson/fitness-tracker',
      live_url: null,
      image_url: null,
      category: 'mobile',
      featured: false
    },
    {
      title: 'Crypto Portfolio Tracker',
      description: 'Real-time cryptocurrency portfolio tracker with live price feeds, P&L analysis, tax reporting tools, and customizable price alerts via email/SMS.',
      tech_stack: ['React', 'D3.js', 'Node.js', 'WebSockets', 'CoinGecko API', 'PostgreSQL'],
      github_url: 'https://github.com/alexjohnson/crypto-tracker',
      live_url: 'https://crypto.demo.com',
      image_url: null,
      category: 'web',
      featured: false
    },
    {
      title: 'Weather Forecast CLI',
      description: 'A developer-friendly command-line weather application with colorized output, 7-day forecasts, hourly breakdowns, and configurable alerts. Supports multiple cities and unit systems.',
      tech_stack: ['Python', 'Click', 'OpenWeather API', 'Rich', 'Poetry'],
      github_url: 'https://github.com/alexjohnson/weather-cli',
      live_url: null,
      image_url: null,
      category: 'cli',
      featured: false
    }
  ];

  projects.forEach(p => db.projects.insert(p));
}

module.exports = { db, initializeDatabase };
