# FlowForge

> All-in-one Progressive Web App for deep work focus sessions, habit tracking, and AI-powered productivity insights

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Week 1](https://img.shields.io/badge/Week%201-Complete-brightgreen)](https://github.com/pipipew/flowforge/issues/1)
[![Phase](https://img.shields.io/badge/Phase-MVP%20Development-blue)])

## 🎯 Current Status: Week 1 Complete! 🎉

✅ **Authentication System Implemented**
- OAuth login (Google + GitHub)
- Session management
- Protected routes
- User profiles
- Responsive layout with navigation

👉 **[Start Testing!](WEEK1_SETUP.md)** | **[Open Issues](https://github.com/pipipew/flowforge/issues)**

---

## 🎯 Vision

Replace 6 productivity apps with one intelligent, offline-first PWA. FlowForge combines:

- **Smart Focus Timer** - Pomodoro + Deep Work modes with ambient sounds
- **Habit Tracking System** - Daily check-ins, streak counting, ritual stacking
- **AI Productivity Coach** - Pattern analysis, personalized insights, burnout detection
- **Social Accountability** - Focus rooms, team dashboards, friendly competition
- **Deep Integrations** - Notion, Todoist, Calendar, Slack sync

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/pnpm/yarn
- Supabase account ([create free account](https://supabase.com))
- (Optional) OpenAI API key for AI insights

### Installation

```bash
# Clone the repository
git clone https://github.com/pipipew/flowforge.git
cd flowforge

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Edit .env with your Supabase credentials

# Run database migrations (see WEEK1_SETUP.md)
# In Supabase Dashboard > SQL Editor, run migration files

# Run development server
npm run dev
```

**📖 Detailed setup instructions:** See [WEEK1_SETUP.md](WEEK1_SETUP.md)

### Environment Setup

Create a `.env` file with:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_OPENAI_API_KEY=your_openai_key # Optional for Phase 3
```

## 📋 Development Roadmap

### Phase 1: MVP (Weeks 1-4) - 🟢 IN PROGRESS

- [x] **Week 1: Authentication & Foundation** ✅
  - [x] Repository setup
  - [x] Supabase database schema (3 migrations)
  - [x] OAuth authentication (Google + GitHub)
  - [x] AuthContext & session management
  - [x] Protected routes
  - [x] Basic dashboard layout
  - [x] Responsive navigation
  - [x] UI components (Button, Card)

- [ ] **Week 2: Timer System** 🔵 NEXT
  - [ ] Pomodoro timer (25/5 default)
  - [ ] Web Worker for accurate timing
  - [ ] Session category selector
  - [ ] Save sessions to database
  - [ ] Completion notifications
  - [ ] Quick mood check-in

- [ ] **Week 3: Habit Tracking**
  - [ ] Habit creation & editing
  - [ ] Daily check-in checkboxes
  - [ ] Streak calculation
  - [ ] Habit history calendar
  - [ ] Free tier limit (max 3 habits)

- [ ] **Week 4: Dashboard & Polish**
  - [ ] Real-time stats widgets
  - [ ] Weekly progress charts
  - [ ] Onboarding flow (4 screens)
  - [ ] Performance optimization
  - [ ] MVP testing & bug fixes

### Phase 2: Enhancement (Weeks 5-8)

- [ ] Multiple timer modes (Deep Work, Custom)
- [ ] Ambient sounds player
- [ ] Analytics page with charts (7/30 days)
- [ ] Theme customization (4 color schemes)
- [ ] Notification system (Web Push)
- [ ] User settings page
- [ ] Offline-first PWA with sync

### Phase 3: AI + Social (Weeks 9-12)

- [ ] AI weekly insights (OpenAI)
- [ ] Mood/energy tracking
- [ ] Focus rooms (real-time)
- [ ] Achievement system
- [ ] Integrations (Notion, Todoist)
- [ ] Pro tier (Stripe)

## 🛠️ Tech Stack

**Frontend**
- React 18 + TypeScript
- Vite (build tool)
- TailwindCSS + Radix UI components
- Zustand (state management)
- React Router v6 (navigation)

**Backend**
- Supabase (PostgreSQL + Auth + Realtime + Storage)
- Row Level Security (RLS) policies
- PostgreSQL functions for analytics

**Future**
- OpenAI API (GPT-4 for insights)
- Workbox (service workers)
- IndexedDB (offline storage)

**Deployment**
- Vercel (hosting)
- GitHub Actions (CI/CD)

## 📁 Project Structure

```
flowforge/
├── src/
│   ├── components/
│   │   ├── auth/              # ✅ Auth components
│   │   │   ├── AuthPage.tsx
│   │   │   ├── AuthCallback.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   ├── layout/            # ✅ Layout
│   │   │   └── Layout.tsx
│   │   └── ui/                # ✅ UI components
│   │       ├── Button.tsx
│   │       └── Card.tsx
│   ├── contexts/
│   │   └── AuthContext.tsx    # ✅ Auth state
│   ├── lib/
│   │   ├── supabase.ts        # ✅ DB client + helpers
│   │   └── utils.ts           # ✅ Utilities
│   ├── pages/
│   │   └── Dashboard.tsx      # ✅ Dashboard page
│   ├── types/
│   │   └── index.ts           # ✅ TypeScript types
│   └── App.tsx                # ✅ Routing
├── supabase/
│   └── migrations/            # ✅ DB schema
│       ├── 20260120000001_initial_schema.sql
│       ├── 20260120000002_rls_policies.sql
│       └── 20260120000003_functions.sql
├── WEEK1_SETUP.md            # ✅ Setup guide
├── ROADMAP.md                # Detailed plan
└── README.md                 # This file
```

## 🧪 Testing

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Unit tests (coming in Week 2)
npm run test

# E2E tests (coming in Week 4)
npm run test:e2e
```

**📝 Week 1 Testing:** See [Issue #1](https://github.com/pipipew/flowforge/issues/1) for testing checklist

## 📚 Documentation

- **[WEEK1_SETUP.md](WEEK1_SETUP.md)** - Complete setup & testing guide
- **[ROADMAP.md](ROADMAP.md)** - Detailed development plan with milestones
- **[SETUP.md](SETUP.md)** - General project setup
- **Master Prompt** - See attached `FlowForge_Master_Prompt.txt` for full spec

## 💬 Community & Support

- 🐛 [Report a Bug](https://github.com/pipipew/flowforge/issues/new?labels=bug)
- 💡 [Request a Feature](https://github.com/pipipew/flowforge/issues/new?labels=enhancement)
- 💬 [Ask a Question](https://github.com/pipipew/flowforge/discussions)

## 📊 Project Metrics

- **Lines of Code:** ~2,000 (Week 1)
- **Test Coverage:** TBD (Week 2+)
- **Lighthouse Score:** TBD (Week 4)
- **Contributors:** 1 (growing!)

## 🚀 Deployment

```bash
# Production build
npm run build

# Preview production build
npm run preview
```

**Deployment:** Vercel (auto-deploy from `main` branch)

## 🤝 Contributing

Contributions welcome! Here's how:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines (coming soon).

## 📜 License

MIT License - see [LICENSE](LICENSE) for details.

## 🔗 Links

- [Live Demo](https://flowforge.vercel.app) (coming soon)
- [Documentation](https://docs.flowforge.app) (coming soon)
- [Roadmap](ROADMAP.md)
- [Issues](https://github.com/pipipew/flowforge/issues)
- [Discussions](https://github.com/pipipew/flowforge/discussions)

---

**Built with ❤️ for deep work and habit formation**

*Last updated: January 20, 2026 - Week 1 Complete*
