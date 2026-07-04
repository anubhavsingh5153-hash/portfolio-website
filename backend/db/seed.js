/**
 * Seed the database with sample portfolio projects.
 * Works with both SQLite and MySQL adapters.
 */
async function seedProjects(db) {
  const projects = [
    {
      title: 'AI Chat Application',
      description: 'A real-time AI-powered chat application with natural language processing capabilities. Features multi-room support, message history, and intelligent auto-responses powered by a custom NLP model.',
      tech_stack: JSON.stringify(['React', 'Node.js', 'Socket.io', 'Python', 'TensorFlow', 'MongoDB']),
      github_url: 'https://github.com/alexjohnson/ai-chat-app',
      live_url: 'https://ai-chat.demo.com',
      image_url: '/images/project-ai-chat.png',
      category: 'ai',
      featured: 1
    },
    {
      title: 'E-Commerce Platform',
      description: 'A full-featured e-commerce platform with product management, shopping cart, secure payments via Stripe, order tracking, and an admin dashboard with real-time analytics.',
      tech_stack: JSON.stringify(['Next.js', 'TypeScript', 'PostgreSQL', 'Stripe', 'Tailwind', 'Prisma']),
      github_url: 'https://github.com/alexjohnson/ecommerce-platform',
      live_url: 'https://shop.demo.com',
      image_url: '/images/project-ecommerce.png',
      category: 'web',
      featured: 1
    },
    {
      title: 'Task Management Dashboard',
      description: 'A Kanban-style project management tool with drag-and-drop boards, team collaboration, deadline reminders, and progress analytics. Supports unlimited workspaces and custom workflows.',
      tech_stack: JSON.stringify(['Vue.js', 'Express', 'MySQL', 'Redis', 'Docker', 'WebSockets']),
      github_url: 'https://github.com/alexjohnson/task-dashboard',
      live_url: 'https://tasks.demo.com',
      image_url: '/images/project-task.png',
      category: 'web',
      featured: 1
    },
    {
      title: 'Fitness Tracker App',
      description: 'A cross-platform mobile app for tracking workouts, nutrition, and fitness goals. Features GPS route tracking for outdoor activities, custom workout plans, and visual progress charts.',
      tech_stack: JSON.stringify(['React Native', 'Expo', 'Firebase', 'Node.js', 'Chart.js']),
      github_url: 'https://github.com/alexjohnson/fitness-tracker',
      live_url: null,
      image_url: '/images/project-fitness.png',
      category: 'mobile',
      featured: 0
    },
    {
      title: 'Crypto Portfolio Tracker',
      description: 'Real-time cryptocurrency portfolio tracker with live price feeds from multiple exchanges, P&L analysis, tax reporting tools, and customizable price alerts via email/SMS.',
      tech_stack: JSON.stringify(['React', 'D3.js', 'Node.js', 'WebSockets', 'CoinGecko API', 'PostgreSQL']),
      github_url: 'https://github.com/alexjohnson/crypto-tracker',
      live_url: 'https://crypto.demo.com',
      image_url: '/images/project-crypto.png',
      category: 'web',
      featured: 0
    },
    {
      title: 'Weather Forecast CLI',
      description: 'A developer-friendly command-line weather application with colorized output, 7-day forecasts, hourly breakdowns, and configurable alerts. Supports multiple cities and unit systems.',
      tech_stack: JSON.stringify(['Python', 'Click', 'OpenWeather API', 'Rich', 'Poetry']),
      github_url: 'https://github.com/alexjohnson/weather-cli',
      live_url: null,
      image_url: '/images/project-weather.png',
      category: 'cli',
      featured: 0
    }
  ];

  for (const p of projects) {
    await db.run(
      `INSERT INTO projects (title, description, tech_stack, github_url, live_url, image_url, category, featured)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [p.title, p.description, p.tech_stack, p.github_url, p.live_url, p.image_url, p.category, p.featured]
    );
  }
}

module.exports = { seedProjects };
