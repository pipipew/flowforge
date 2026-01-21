# Week 4: Advanced Features - Goals, Achievements & Social Sharing

## Overview

Week 4 introduces a comprehensive goal-setting and achievement tracking system with social sharing capabilities, powered by AI-driven insights. Users can now set goals across different categories, track their progress, unlock achievements, and share their accomplishments with the community.

## New Features Implemented

### 1. **Goal Management System**

#### Components

- **GoalForm.tsx** - Form for creating and editing goals
  - Title, description, category selection
  - Target date picker
  - Validation and error handling
  - Support for both creation and edit modes

- **GoalProgressCard.tsx** - Visual progress display card
  - Progress bar visualization
  - Days remaining/overdue indicator
  - Edit and share buttons
  - Quick action buttons (+10%, Complete)
  - Status indicators (active, completed, paused)

- **GoalsList.tsx** - List view with filtering and sorting
  - Search functionality
  - Filter by status (active, completed, paused)
  - Filter by category (personal, professional, health, etc.)
  - Sort options (date, progress, deadline)
  - Summary statistics (Active, Completed, Paused, Avg Progress)

#### Goal Categories

- Personal
- Professional
- Health
- Financial
- Learning
- Other

#### API Endpoints

**Base URL:** `/api/goals`

- **GET /api/goals** - Fetch all goals for current user
  - Returns: `{ goals: Goal[] }`
  - Status: 200 on success, 401 if unauthorized, 500 on error

- **POST /api/goals** - Create a new goal
  - Request body:
    ```json
    {
      "title": "string",
      "description": "string",
      "category": "string",
      "targetDate": "ISO date string",
      "userId": "string"
    }
    ```
  - Returns: `{ goal: Goal }`
  - Status: 201 on success, 400 if missing fields, 401 if unauthorized, 500 on error

- **PATCH /api/goals** - Update goal progress or status
  - Request body:
    ```json
    {
      "goalId": "string",
      "progress": 0-100,
      "status": "active|completed|paused",
      "title": "string (optional)",
      "description": "string (optional)"
    }
    ```
  - Returns: `{ goal: Goal }`
  - Status: 200 on success, 400 if missing goalId, 401 if unauthorized, 500 on error

- **DELETE /api/goals?id={goalId}** - Delete a goal
  - Query parameters: `id` (goal ID)
  - Returns: `{ message: "Goal deleted successfully" }`
  - Status: 200 on success, 400 if missing id, 401 if unauthorized, 500 on error

### 2. **Achievement & Badges System**

#### Components

- **AchievementCard.tsx** - Individual achievement display
  - Rarity levels (common, rare, epic, legendary)
  - Unlock date tracking
  - Visual rarity indicators
  - New achievement highlight
  - Icon and color coding by type

- **AchievementsGrid.tsx** - Grid display of all achievements
  - Achievement rarity distribution
  - Empty state messaging
  - Achievement count by rarity

#### Achievement Types

- Milestone achievements
- Streak achievements
- Milestone completion badges
- Social sharing rewards
- Other special achievements

#### Achievement Rarities

- Common (gray)
- Rare (blue)
- Epic (purple)
- Legendary (gold)

### 3. **Social Leaderboard System**

#### Components

- **LeaderboardCard.tsx** - Individual leaderboard display
  - Rank-based user display
  - Score visualization
  - User statistics (goals completed, achievements)
  - Current user highlighting
  - Loading state skeleton

- **LeaderboardsGrid.tsx** - Multi-period leaderboards
  - Weekly leaders
  - Monthly leaders
  - All-time leaders

#### Leaderboard Rankings

- 🥇 1st place - Gold badge
- 🥈 2nd place - Silver badge  
- 🥉 3rd place - Bronze badge
- 4+ place - Numeric ranking

#### Scoring System

- Points awarded for:
  - Goal completion
  - Achievement unlocks
  - Social sharing
  - Streak maintenance

## Database Schema

### Goals Table

```sql
CREATE TABLE goals (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(50) NOT NULL,
  target_date DATE NOT NULL,
  progress INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Achievements Table

```sql
CREATE TABLE achievements (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(50) NOT NULL,
  rarity VARCHAR(20) NOT NULL,
  unlocked_at TIMESTAMP DEFAULT NOW(),
  icon_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Leaderboard Entries Table

```sql
CREATE TABLE leaderboard_entries (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  score INTEGER NOT NULL,
  goals_completed INTEGER DEFAULT 0,
  achievements_count INTEGER DEFAULT 0,
  period VARCHAR(20) NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## File Structure

```
src/
├── components/
│   └── goals/
│       ├── GoalForm.tsx
│       ├── GoalProgressCard.tsx
│       ├── GoalsList.tsx
│       ├── AchievementCard.tsx
│       ├── LeaderboardCard.tsx
│       └── index.ts
│
app/
└── api/
    └── goals/
        └── route.ts

supabase/
└── migrations/
    └── 20260121_week4_advanced_features.sql
```

## Usage Examples

### Creating a Goal

```typescript
import { GoalForm } from '@/components/goals';

function GoalsPage() {
  const handleSuccess = () => {
    // Refresh goals list
  };

  return (
    <GoalForm onSuccess={handleSuccess} />
  );
}
```

### Displaying Goals List

```typescript
import { GoalsList } from '@/components/goals';

function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);

  return (
    <GoalsList 
      goals={goals}
      onAddGoal={() => setShowForm(true)}
      onEditGoal={handleEdit}
      onShareGoal={handleShare}
      onUpdateProgress={updateProgress}
    />
  );
}
```

### Displaying Achievements

```typescript
import { AchievementsGrid } from '@/components/goals';

function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  return (
    <AchievementsGrid 
      achievements={achievements}
      title="Your Achievements"
      emptyMessage="Start completing goals to earn achievements!"
    />
  );
}
```

### Displaying Leaderboards

```typescript
import { LeaderboardsGrid } from '@/components/goals';

function LeaderboardsPage() {
  return (
    <LeaderboardsGrid 
      allTimeLeaderboard={allTimeEntries}
      monthlyLeaderboard={monthlyEntries}
      weeklyLeaderboard={weeklyEntries}
    />
  );
}
```

## Deployment on Blink.new

### Prerequisites

- Node.js 18+ installed
- Blink.new account
- Environment variables configured

### Deployment Steps

1. **Push to GitHub**
   ```bash
   git push origin feat/week4-advanced-features
   ```

2. **Connect to Blink.new**
   - Go to blink.new dashboard
   - Connect GitHub repository
   - Select `feat/week4-advanced-features` branch

3. **Configure Environment**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_KEY=your_service_key
   ```

4. **Deploy**
   - Blink.new will automatically build and deploy
   - Monitor deployment in dashboard

### Verifying Deployment

- Test goal creation: POST /api/goals
- Test goal retrieval: GET /api/goals
- Test UI components in browser
- Verify database migrations applied

## Performance Considerations

- Goals list uses React memoization for optimization
- Pagination recommended for users with 100+ goals
- Leaderboard queries use indexed fields
- Achievement unlock checks run async

## Future Enhancements

- [ ] Goal-sharing with friends
- [ ] Achievement notifications
- [ ] Weekly goal reports
- [ ] Advanced analytics dashboard
- [ ] Goal recommendations via AI
- [ ] Integration with calendar apps
- [ ] Mobile app support
- [ ] Goal templates library

## Contributors

- Week 4 Feature Implementation
- Goals & Achievements System
- Social Leaderboard

## License

MIT License - See LICENSE file for details
