# 🚀 Personal Portfolio Website

A stunning full-stack personal portfolio built with **Node.js/Express** backend, a file-persisted **JSON database**, and a premium **dark glassmorphism** frontend.

![Preview](frontend/images/profile.png)

---

## ✨ Features

- 🎨 **Dark glassmorphism design** with animated particle background
- ⌨️ **Typewriter effect** with smooth cursor animation
- 📊 **Animated skill bars** and stat counters
- 🌐 **Dynamic projects** loaded from a REST API + JSON database
- 📱 **Fully responsive** — mobile, tablet, desktop
- 🔽 **Scroll-reveal animations** powered by IntersectionObserver
- 📬 **Contact form** that saves messages to the database
- 🧭 **Orbiting tech icons** around hero profile image

---

## 🗂 Project Structure

```
portfolio website/
├── frontend/               # Static HTML/CSS/JS
│   ├── index.html
│   ├── css/style.css
│   ├── js/main.js
│   └── images/
│
├── backend/                # Node.js + Express API
│   ├── server.js
│   ├── package.json
│   ├── .env.example
│   ├── db/
│   │   ├── connection.js   # JSON database helper
│   │   ├── data.json       # Persisted database store
│   │   └── seed.js         # Sample project data
│   └── routes/
│       ├── projects.js     # GET /api/projects
│       └── contact.js      # POST /api/contact
│
├── .gitignore
└── README.md
```

---

## 🚀 Quick Start

### 1. Install dependencies

```bash
cd backend
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
# Edit .env as needed (default PORT=5000)
```

### 3. Start the server

```bash
# Development (auto-reload)
npm run dev

# Production
npm start
```

The server will:
- Auto-create/load the JSON database at `backend/db/data.json`
- Seed it with 6 sample projects on first run
- Serve the frontend at **http://localhost:5000**
- Expose the API at **http://localhost:5000/api**

---

## 📡 API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Server health check |
| `GET` | `/api/projects` | List all projects |
| `GET` | `/api/projects?category=web` | Filter by category |
| `GET` | `/api/projects?featured=true` | Featured projects only |
| `GET` | `/api/projects/:id` | Single project |
| `POST` | `/api/contact` | Submit contact message |

### POST /api/contact body
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "subject": "Project inquiry",
  "message": "I'd love to discuss a project..."
}
```

---

## 🌍 Deployment

### Option 1: Render (Backend + Frontend together)
1. Push to GitHub
2. Create a new **Web Service** on [render.com](https://render.com)
3. Set **Root Directory** → `backend`
4. Set **Build Command** → `npm install`
5. Set **Start Command** → `npm start`
6. The backend serves the frontend from `../frontend/`

### Option 2: Split Deployment
- **Frontend** → [Vercel](https://vercel.com) or [Netlify](https://netlify.com) (drag & drop the `frontend/` folder)
- **Backend** → [Railway](https://railway.app) or [Render](https://render.com)
- Update `API_BASE` in `frontend/js/main.js` to your backend URL

---

## 🛠 Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | HTML5, Vanilla CSS3, Vanilla JS |
| Backend | Node.js, Express.js |
| Database | File-Persisted JSON database |
| Deployment | Render / Vercel / Netlify |

---

## 📝 Customization

1. **Your info** — Edit `frontend/index.html` to replace "Alex Johnson" with your name, bio, and social links
2. **Projects** — Edit `backend/db/seed.js` to add your real projects (delete `portfolio.db` to re-seed)
3. **Colors** — Edit CSS variables in `frontend/css/style.css` (`:root` block at the top)
4. **Profile image** — Replace `frontend/images/profile.png`

---

## 📄 License

MIT © Alex Johnson
