# Week 2: Timer System Implementation Guide

## Overview
This week we implement the Pomodoro timer system with session tracking, category selection, and mood check-ins.

## ✅ Completed
- ✅ `useTimer.ts` hook - Timer state management and session tracking
- ✅ Database schema (focus_sessions, session_moods already created in Week 1)

## 🔵 Todo Items

### 1. Create Timer Components

#### TimerDisplay.tsx
**Purpose**: Display remaining time in MM:SS format with circular progress indicator
**Features**:
- Show remaining and total time
- Circular progress animation
- Color change based on timer state (running, paused, completed)

```typescript
interface Props {
  remainingSeconds: number;
  totalSeconds: number;
  isRunning: boolean;
  isPaused: boolean;
}
```

#### TimerControls.tsx
**Purpose**: Start, pause, resume, stop, and reset buttons
**Features**:
- Smart button states based on timer state
- Keyboard shortcuts (Space to play/pause, R to reset, S to stop)
- Accessibility labels

#### CategorySelector.tsx
**Purpose**: Select session category before starting timer
**Categories**: 'work', 'study', 'code', 'creative', 'reading'
**Features**:
- Icon for each category
- Show selected category
- Disable during active session

#### MoodCheckIn.tsx
**Purpose**: Pre/post session mood check-in
**Features**:
- 5-point scale mood selector (1-5)
- Show before and after
- Display difference in mood
- Optional energy level selector

### 2. Create TimerPage.tsx
**Location**: `src/pages/TimerPage.tsx`
**Components**:
```
<TimerPage>
  ├── <CategorySelector />
  ├── <MoodCheckIn /> (pre-session)
  ├── <TimerDisplay />
  ├── <TimerControls />
  ├── <SessionStats /> (duration, completion)
  └── <MoodCheckIn /> (post-session)
```

### 3. Update App.tsx Router
Replace the placeholder `/timer` route with actual TimerPage import:
```typescript
import { TimerPage } from '@/pages/TimerPage';

// In routes:
<Route
  path="/timer"
  element={
    <ProtectedRoute>
      <Layout>
        <TimerPage />
      </Layout>
    </ProtectedRoute>
  }
/>
```

### 4. Add Supabase Helper Functions
**Location**: `src/lib/supabase.ts`

Add the following functions:
```typescript
// Create focus session
export async function createFocusSession(data: any): Promise<FocusSession> {
  // INSERT into focus_sessions
}

// Update focus session
export async function updateFocusSession(id: string, data: any): Promise<void> {
  // UPDATE focus_sessions
}

// Create session mood
export async function createSessionMood(data: any): Promise<void> {
  // INSERT into session_moods
}

// Get user sessions (for history)
export async function getUserSessions(userId: string, limit = 10): Promise<FocusSession[]> {
  // SELECT from focus_sessions ORDER BY started_at DESC
}

// Get session stats
export async function getSessionStats(userId: string): Promise<SessionStats> {
  // Calculate total_sessions, total_minutes, completion_rate
}
```

### 5. Update Types
**Location**: `src/types/index.ts`

Add interfaces:
```typescript
interface FocusSession {
  id: string;
  user_id: string;
  category: 'work' | 'study' | 'code' | 'creative' | 'reading';
  duration_minutes: number;
  actual_duration?: number;
  mode: 'pomodoro' | 'deep_work' | 'custom';
  started_at: string;
  ended_at?: string;
  completed: boolean;
  interrupted: boolean;
  linked_task_id?: string;
  notes?: string;
}

interface SessionMood {
  id: string;
  session_id: string;
  user_id: string;
  mood_before: 1 | 2 | 3 | 4 | 5;
  mood_after: 1 | 2 | 3 | 4 | 5;
  energy_before: 1 | 2 | 3 | 4 | 5;
  energy_after: 1 | 2 | 3 | 4 | 5;
  tags?: string[];
}

interface SessionStats {
  total_sessions: number;
  total_minutes: number;
  completion_rate: number;
  average_duration: number;
  current_streak: number;
}
```

### 6. Styling
Use Tailwind CSS classes and Radix UI for components:
- `rounded-full` for circular timer display
- `animate-spin` or custom keyframes for progress animation
- `transition-all` for smooth state changes
- Dark mode support with `dark:` prefix

### 7. Testing
Create unit tests for:
- useTimer hook
- Timer countdown logic
- Session creation/update
- Mood check-in submission

## File Structure
```
src/
├── components/
│   ├── timer/
│   │   ├── useTimer.ts ✅
│   │   ├── TimerDisplay.tsx
│   │   ├── TimerControls.tsx
│   │   ├── CategorySelector.tsx
│   │   ├── MoodCheckIn.tsx
│   │   └── SessionStats.tsx
├── pages/
│   └── TimerPage.tsx
├── lib/
│   └── supabase.ts (update)
└── types/
    └── index.ts (update)
```

## Development Steps
1. Create all timer components
2. Update App.tsx router
3. Add/update supabase helper functions
4. Test locally: `npm run dev`
5. Navigate to `/timer` route
6. Test timer functionality
7. Commit all changes

## Integration Checklist
- [ ] TimerDisplay component created and displays correctly
- [ ] TimerControls component with all buttons functional
- [ ] CategorySelector shows all 5 categories
- [ ] useTimer hook integrates with components
- [ ] Sessions created in database
- [ ] Mood check-ins saved
- [ ] Session history accessible
- [ ] All TypeScript types defined
- [ ] Tests passing
- [ ] Ready for deployment

## Notes
- Use Web Worker for accurate timing in browser background (optional enhancement)
- Add notifications when session completes
- Show completion badge/animation
- Track interrupted sessions separately
- Display daily session count on dashboard

## Next Steps (Week 3)
- Deploy to blink.new
- Test on production
- Add ambient sounds
- Implement focus rooms (multiplayer)
- Analytics dashboard
