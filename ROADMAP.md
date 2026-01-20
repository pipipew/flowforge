# FlowForge Development Roadmap

## 🏁 Current Status: Foundation Complete

✅ Repository initialized  
✅ Database schema created  
✅ Project structure established  
✅ Core configuration files ready  

---

## 📅 Phase 1: MVP Core Features (Weeks 1-4)

**Goal:** Launch a functional MVP with core timer and habit features.

### Week 1: Authentication & Foundation

**Priority: HIGH**

- [ ] **Auth System** (3-4 days)
  - [ ] Create AuthContext with Supabase auth
  - [ ] Build AuthPage component (OAuth buttons)
  - [ ] Implement ProtectedRoute component
  - [ ] Create profile creation flow
  - [ ] Add session persistence
  - [ ] Test OAuth with Google + GitHub

- [ ] **Basic UI Components** (2-3 days)
  - [ ] Set up shadcn/ui components:
    - Button, Card, Dialog, Input
    - Avatar, Checkbox, Progress
    - Toast notifications
  - [ ] Create Layout component with navigation
  - [ ] Build responsive header/sidebar

**Deliverable:** Users can sign up, sign in, and see authenticated dashboard

---

### Week 2: Timer System

**Priority: HIGH**

- [ ] **Timer Core** (3-4 days)
  - [ ] Create TimerStore (Zustand)
  - [ ] Build Timer component with circular progress
  - [ ] Implement Web Worker for accuracy
  - [ ] Add start/pause/stop functionality
  - [ ] Create session category selector
  - [ ] Save sessions to Supabase

- [ ] **Timer Page** (2 days)
  - [ ] Full-screen timer UI
  - [ ] Notification at completion
  - [ ] Quick mood check-in modal
  - [ ] Session history view

- [ ] **Settings Integration** (1 day)
  - [ ] Fetch user settings from DB
  - [ ] Apply custom timer durations
  - [ ] Save last-used category

**Deliverable:** Users can start, complete, and track focus sessions

---

### Week 3: Habit Tracking

**Priority: HIGH**

- [ ] **Habit System** (3 days)
  - [ ] Create HabitsStore (Zustand)
  - [ ] Build habit creation modal
  - [ ] Implement daily checkbox UI
  - [ ] Add habit editing/archiving
  - [ ] Calculate streaks (use Supabase RPC)

- [ ] **Habits Page** (2 days)
  - [ ] List all active habits
  - [ ] Calendar view for history
  - [ ] Drag-and-drop reordering
  - [ ] Habit detail modal

- [ ] **Free Tier Limits** (1 day)
  - [ ] Enforce max 3 habits for free users
  - [ ] Show upgrade prompt
  - [ ] Test with multiple users

**Deliverable:** Users can create, check off, and track habit streaks

---

### Week 4: Dashboard & Polish

**Priority: HIGH**

- [ ] **Dashboard** (3 days)
  - [ ] Today's focus time widget
  - [ ] Active habits with checkboxes
  - [ ] Current streak display
  - [ ] Quick start timer FAB
  - [ ] Recent sessions list
  - [ ] Weekly progress chart (Recharts)

- [ ] **Onboarding Flow** (2 days)
  - [ ] Welcome screen with animation
  - [ ] Focus goal selection
  - [ ] First habit creation
  - [ ] Quick tutorial overlay
  - [ ] Mark user as onboarded

- [ ] **MVP Testing** (1 day)
  - [ ] End-to-end user flow testing
  - [ ] Fix critical bugs
  - [ ] Performance optimization
  - [ ] Lighthouse audit

**Deliverable:** Complete MVP ready for beta testing

---

## 🚀 Phase 2: Enhancement (Weeks 5-8)

**Goal:** Add advanced features and improve UX.

### Week 5: Advanced Timer Features

- [ ] Multiple timer modes (Pomodoro, Deep Work, Custom)
- [ ] Ambient sound player (Howler.js)
  - White noise, Lo-fi, Nature sounds
  - Volume control
  - Sound persistence
- [ ] Break timer with auto-start option
- [ ] Timer templates/presets

### Week 6: Analytics & Insights

- [ ] Analytics page with time range selector
- [ ] Charts:
  - Focus time over time (line chart)
  - Category breakdown (pie chart)
  - Completion rate (bar chart)
  - Habit heatmap
- [ ] Export data (CSV/JSON)
- [ ] Weekly email summary (optional)

### Week 7: Customization & Settings

- [ ] Theme switcher (Light/Dark/Auto)
- [ ] Color scheme options (4 themes)
- [ ] Notification preferences
- [ ] Habit reminder system (Web Push)
- [ ] Account management page
- [ ] Data export/deletion (GDPR)

### Week 8: Offline-First PWA

- [ ] Service worker with Workbox
- [ ] IndexedDB for local storage
- [ ] Sync queue for offline actions
- [ ] Conflict resolution logic
- [ ] Offline indicator UI
- [ ] Background sync
- [ ] PWA install prompt

---

## 🤖 Phase 3: AI & Social (Weeks 9-12)

**Goal:** Add AI insights and social features.

### Week 9: AI Integration

- [ ] OpenAI API setup
- [ ] Mood/energy tracking after sessions
- [ ] Data collection for AI
- [ ] Weekly insights generation (Edge Function)
- [ ] AI Insights page
- [ ] Pattern detection
- [ ] Burnout warning system

### Week 10: Focus Rooms

- [ ] Room creation/joining
- [ ] Real-time presence (Supabase Realtime)
- [ ] Participant list
- [ ] Room chat (optional)
- [ ] Shared timer countdown

### Week 11: Achievements & Gamification

- [ ] Achievement unlocking logic
- [ ] Toast notifications for achievements
- [ ] Achievement page/gallery
- [ ] Progress tracking
- [ ] Leaderboard (optional)

### Week 12: Integrations

- [ ] Notion integration
  - OAuth setup
  - Fetch tasks
  - Link to sessions
- [ ] Todoist integration
  - OAuth setup
  - Fetch tasks
  - Mark complete
- [ ] Calendar sync (Google Calendar)
- [ ] Slack status integration

---

## 💳 Monetization Setup

**Timing:** After Phase 2 MVP validation

- [ ] Stripe integration
- [ ] Pro tier gating
- [ ] Subscription management
- [ ] Billing portal
- [ ] Lifetime deal page
- [ ] Team plan support

---

## 📦 Phase 4: Scale & Mobile (Month 4+)

### Native Mobile Apps

- [ ] Capacitor setup
- [ ] iOS build
- [ ] Android build
- [ ] App Store submission
- [ ] Push notifications (native)

### Team Features

- [ ] Team creation
- [ ] Team dashboard
- [ ] Admin controls
- [ ] Team analytics
- [ ] SSO (enterprise)

### API & Integrations

- [ ] Public API documentation
- [ ] API key management
- [ ] Webhooks
- [ ] Zapier integration

---

## 📊 Success Metrics

### Phase 1 (MVP)
- 70%+ users complete first session within 5 min
- 50%+ Day 2 retention
- <3s initial load time
- 0 critical bugs

### Phase 2 (Enhancement)
- 40%+ weekly active users
- 3+ sessions per active user per week
- <2.5s LCP (Lighthouse)
- 95+ Accessibility score

### Phase 3 (AI & Social)
- 50%+ AI insights engagement
- 20%+ users join focus rooms
- 10%+ conversion to Pro

---

## 📝 Development Principles

1. **Mobile-First**: Design for mobile, enhance for desktop
2. **Accessibility**: WCAG 2.1 AA compliance
3. **Performance**: <3s TTI, <1s interactions
4. **Offline-First**: Core features work without internet
5. **Test Coverage**: 80%+ for utils, E2E for critical flows
6. **Documentation**: Inline comments, README updates

---

## ✅ Current Sprint (Week 1)

**Focus:** Authentication & Foundation

**Tasks This Week:**
1. Set up AuthContext
2. Create AuthPage with OAuth
3. Build ProtectedRoute
4. Install shadcn/ui components
5. Create Layout with navigation

**Blockers:** None

**Next Sprint:** Timer System implementation

---

**Last Updated:** January 20, 2026  
**Version:** 1.0
