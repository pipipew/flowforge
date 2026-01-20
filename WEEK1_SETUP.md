# Week 1: Authentication System - Setup & Testing Guide

## ✅ What Was Completed

We've successfully implemented the complete authentication system for FlowForge:

### Files Created

1. **Authentication Core**
   - `src/contexts/AuthContext.tsx` - Auth state management with Supabase
   - `src/components/auth/AuthPage.tsx` - OAuth login page (Google + GitHub)
   - `src/components/auth/ProtectedRoute.tsx` - Route protection wrapper
   - `src/components/auth/AuthCallback.tsx` - OAuth callback handler

2. **UI Components**
   - `src/components/ui/Button.tsx` - Reusable button component
   - `src/components/ui/Card.tsx` - Card components (with Header, Content, Footer)

3. **Layout**
   - `src/components/layout/Layout.tsx` - Main app layout with navigation

4. **Pages**
   - `src/pages/Dashboard.tsx` - Dashboard page (placeholder with stats)

5. **Utilities**
   - `src/lib/utils.ts` - Helper functions (cn, date formatting, etc.)
   - `src/vite-env.d.ts` - TypeScript environment definitions

6. **Routing**
   - Updated `src/App.tsx` - Complete routing with protected routes

---

## 🚀 Setup Instructions

### 1. Install Dependencies

```bash
cd flowforge
npm install
```

### 2. Configure Environment Variables

You need to set up Supabase first if you haven't already:

#### Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project" or "New Project"
3. Fill in:
   - Project name: `flowforge`
   - Database password: (generate a strong password)
   - Region: (choose closest to you)
4. Click "Create new project" (takes 1-2 minutes)

#### Configure OAuth Providers

**Google OAuth:**

1. In Supabase Dashboard → Authentication → Providers
2. Enable Google provider
3. Add these Authorized redirect URIs:
   - `http://localhost:5173/auth/callback` (for development)
   - Your production URL + `/auth/callback` (when deployed)
4. Get Client ID and Secret from [Google Cloud Console](https://console.cloud.google.com/)
   - Create OAuth 2.0 credentials
   - Add redirect URI: `https://[YOUR-PROJECT-REF].supabase.co/auth/v1/callback`
5. Save the credentials in Supabase

**GitHub OAuth:**

1. In Supabase Dashboard → Authentication → Providers
2. Enable GitHub provider
3. Go to GitHub → Settings → Developer settings → OAuth Apps
4. Click "New OAuth App"
5. Fill in:
   - Application name: `FlowForge Dev`
   - Homepage URL: `http://localhost:5173`
   - Authorization callback URL: `https://[YOUR-PROJECT-REF].supabase.co/auth/v1/callback`
6. Copy Client ID and generate Client Secret
7. Add them to Supabase

#### Create .env File

```bash
cp .env.example .env
```

Edit `.env` and add your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

Find these in Supabase Dashboard → Settings → API:
- Project URL → `VITE_SUPABASE_URL`
- Project API keys → anon/public → `VITE_SUPABASE_ANON_KEY`

### 3. Run Database Migrations

The database schema is already created in `supabase/migrations/`. To apply it:

**Option A: Using Supabase Dashboard (Easiest)**

1. Go to Supabase Dashboard → SQL Editor
2. Open each migration file and run them in order:
   - `20260120000001_initial_schema.sql`
   - `20260120000002_rls_policies.sql`
   - `20260120000003_functions.sql`

**Option B: Using Supabase CLI**

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Push migrations
supabase db push
```

### 4. Start Development Server

```bash
npm run dev
```

The app will open at `http://localhost:5173`

---

## 🧪 Testing the Authentication Flow

### Test Checklist

- [ ] **Landing Page**
  - Open `http://localhost:5173`
  - Should redirect to `/auth` (login page)
  - Verify FlowForge logo and branding displays
  - See Google and GitHub OAuth buttons

- [ ] **Google Sign In**
  - Click "Continue with Google"
  - Redirects to Google OAuth
  - Select your Google account
  - Grants permissions
  - Redirects back to app
  - Should see `/auth/callback` briefly, then `/dashboard`

- [ ] **GitHub Sign In**
  - Sign out first
  - Click "Continue with GitHub"
  - Authorize the app
  - Redirects back to dashboard

- [ ] **Dashboard View**
  - After login, verify you see:
    - "Welcome back, [Your Name]!" header
    - Three stat cards (Today's Focus, Active Habits, Current Streak)
    - Quick Start card with timer icon
    - Navigation bar with Dashboard, Focus, Timer, Analytics
    - Your avatar and "Sign Out" button in header

- [ ] **Navigation**
  - Click on each nav item:
    - Dashboard → Shows dashboard
    - Focus → Shows "Coming soon" placeholder
    - Habits → Shows "Coming soon" placeholder  
    - Analytics → Shows "Coming soon" placeholder
  - Verify active link is highlighted in indigo

- [ ] **Session Persistence**
  - Refresh the page
  - Should stay logged in (not redirect to `/auth`)
  - Close browser and reopen
  - Should still be logged in

- [ ] **Sign Out**
  - Click "Sign Out" button
  - Should redirect to `/auth`
  - Verify you can't access `/dashboard` without logging in

- [ ] **Protected Routes**
  - While signed out, try to access:
    - `http://localhost:5173/dashboard`
    - `http://localhost:5173/timer`
    - Should redirect to `/auth` for all

- [ ] **Profile Creation**
  - Check Supabase Dashboard → Table Editor → `profiles`
  - Verify your profile was created with:
    - id (matches auth.users)
    - email
    - full_name (from OAuth provider)
    - avatar_url (from OAuth provider)
    - timezone (auto-detected)
    - pro_tier (false by default)
    - created_at timestamp

---

## 🐛 Common Issues & Fixes

### Issue: "Missing Supabase environment variables" error

**Fix:** 
- Verify `.env` file exists in project root
- Check that variable names are exactly: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Restart the dev server after adding/changing `.env`

### Issue: OAuth redirect loops or doesn't work

**Fix:**
- Verify OAuth redirect URIs are correctly configured in both:
  - Supabase Dashboard (Authentication → URL Configuration)
  - OAuth provider settings (Google/GitHub)
- Make sure the redirect URI ends with `/auth/callback`
- Check browser console for errors

### Issue: "Failed to fetch" or CORS errors

**Fix:**
- Verify `VITE_SUPABASE_URL` is correct
- Check Supabase project is not paused (free tier pauses after 7 days inactivity)
- Verify you're using the correct anon key (not the service_role key)

### Issue: Profile not created after login

**Fix:**
- Check Supabase Dashboard → Authentication → Users
- Verify user exists in `auth.users`
- Manually create profile:
```sql
INSERT INTO profiles (id, email, full_name, timezone)
VALUES (
  'user-id-from-auth-users',
  'user@example.com',
  'User Name',
  'UTC'
);
```

### Issue: "relation 'profiles' does not exist"

**Fix:**
- Database migrations weren't run
- Go to Supabase SQL Editor and run all migration files

### Issue: TypeScript errors about missing types

**Fix:**
```bash
npm install --save-dev @types/node
npm run type-check
```

---

## 📸 Expected Screenshots

### 1. Auth Page
- Clean white/dark card with FlowForge logo
- Two OAuth buttons with provider icons
- Footer text about Terms & Privacy

### 2. Dashboard (After Login)
- Header with logo and navigation
- Welcome message with user's first name
- 3 stat cards showing "0" values
- Quick Start card with timer icon
- User avatar in top-right

### 3. Mobile View
- Responsive navigation at bottom
- Icon-based tabs
- Touch-friendly buttons

---

## ✅ Success Criteria

You've successfully completed Week 1 if:

1. ✅ Users can sign in with Google OR GitHub
2. ✅ Profile is automatically created in database
3. ✅ Dashboard shows after successful login
4. ✅ Navigation works between pages
5. ✅ Session persists after page refresh
6. ✅ Sign out works and redirects to auth page
7. ✅ Protected routes redirect unauthenticated users
8. ✅ No console errors in browser
9. ✅ TypeScript compiles without errors: `npm run type-check`
10. ✅ Mobile responsive (test at 375px width)

---
## 🎯 Next Steps: Week 2 - Timer System

Once authentication is working, we'll build:
- Timer component with circular progress
- Session category selector
- Web Worker for accurate timing
- Session storage to database
- Notification on completion
- Quick mood check-in

See `ROADMAP.md` for full Week 2 plan.

---

## 📚 Additional Resources

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [React Router v6 Docs](https://reactrouter.com/)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [Radix UI Docs](https://www.radix-ui.com/)

---

**Questions or issues?** Create an issue in the repository or check the troubleshooting section above.
