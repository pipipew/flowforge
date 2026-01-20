# FlowForge

> All-in-one Progressive Web App for deep work focus sessions, habit tracking, and AI-powered productivity insights

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

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

# Run development server
npm run dev
```

### Environment Setup

Create a `.env` file with:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_OPENAI_API_KEY=your_openai_key # Optional for Phase 3
```

## 📋 Development Roadmap

### Phase 1: MVP (Current - Weeks 1-4)

- [x] Repository setup
- [ ] Supabase database schema
- [ ] OAuth authentication (Google + GitHub)
- [ ] Basic Pomodoro timer (25/5 default)
- [ ] Habit creation & check-in (max 3 for free tier)
- [ ] Today's dashboard
- [ ] Offline-first architecture
- [ ] PWA installable

### Phase 2: Enhancement (Weeks 5-8)

- [ ] Multiple timer modes (Deep Work, Custom)
- [ ] Ambient sounds
- [ ] Analytics charts (7/30 days)
- [ ] Theme customization
- [ ] Notification system
- [ ] User settings

### Phase 3: AI + Social (Weeks 9-12)

- [ ] AI weekly insights
- [ ] Mood/energy tracking
- [ ] Focus rooms (real-time)
- [ ] Achievement system
- [ ] Integrations (Notion, Todoist)
- [ ] Pro tier (Stripe)

## 🏗️ Tech Stack

**Frontend**
- React 18 + TypeScript
- Vite (build tool)
- TailwindCSS + shadcn/ui (Radix UI components)
- Zustand (state management)
- React Router (navigation)

**Backend**
- Supabase (PostgreSQL + Auth + Realtime + Storage)
- OpenAI API (GPT-4 for insights)

**PWA**
- Workbox (service workers)
- IndexedDB (offline storage)

**Deployment**
- Vercel (hosting)
- GitHub Actions (CI/CD)

## 📁 Project Structure

```
flowforge/
├── public/
│   ├── manifest.json
│   └── icons/
├── src/
│   ├── components/
│   │   ├── timer/
│   │   ├── habits/
│   │   ├── dashboard/
│   │   └── ui/ (shadcn components)
│   ├── hooks/
│   ├── lib/
│   │   ├── supabase.ts
│   │   └── utils/
│   ├── pages/
│   ├── stores/
│   ├── types/
│   └── App.tsx
├── supabase/
│   └── migrations/
└── tests/
```

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage
npm run test:coverage
```

## 📦 Building

```bash
# Production build
npm run build

# Preview production build
npm run preview
```

## 🤝 Contributing

Contributions welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) first.

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🔗 Links

- [Documentation](https://docs.flowforge.app) (coming soon)
- [Roadmap](https://github.com/pipipew/flowforge/projects)
- [Issues](https://github.com/pipipew/flowforge/issues)

---

**Built with ❤️ for deep work and habit formation**
