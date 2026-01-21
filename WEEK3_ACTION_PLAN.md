# Week 3: Deployment Action Plan

## 🚀 DEPLOYMENT ROADMAP FOR FLOWFORGE

**Target Date:** January 22-24, 2026 (This Week)  
**Deployment Platform:** Blink.new Full-Stack  
**Environment:** Production

---

## 📋 PHASE 1: LOCAL BUILD VERIFICATION (DO FIRST - ~30 minutes)

These steps are CRITICAL before attempting deployment to blink.new.

### Step 1.1: Clone & Setup
```bash
# Clone the repository
git clone https://github.com/pipipew/flowforge.git
cd flowforge

# Checkout the feat/blink-migration branch
git checkout feat/blink-migration

# Install dependencies
npm install
```

**Expected Output:** All dependencies installed without errors

### Step 1.2: Type Checking
```bash
npm run type-check
```

**Expected Output:** "No errors" message

**Troubleshooting:**
- If errors occur, check src/types/index.ts for missing interfaces
- Verify all component imports use correct paths (@/...)

### Step 1.3: Build Production Bundle
```bash
npm run build
```

**Expected Output:**
```
✓ XXX modules transformed
vite v5.0.8 building for production...
✓ built in XXXms
```

**Output Directory:** `dist/` folder created

**Troubleshooting:**
- If TypeScript errors: Check type definitions
- If Vite errors: Check vite.config.ts
- If module not found: Check path aliases in tsconfig.json

### Step 1.4: Preview Build Locally
```bash
npm run preview
```

**Expected Output:**
```
  ➜ Local:   http://localhost:4173/
```

**Testing Checklist:**
- [ ] Application loads without console errors
- [ ] Click through to /auth page
- [ ] Navigation works correctly
- [ ] Dark theme displays properly
- [ ] Responsive design works on different screen sizes

**Troubleshooting:**
- If blank page: Check browser console for errors
- If routes don't work: Verify react-router-dom imports
- If styles missing: Check tailwindcss import in main.tsx

---

## 📋 PHASE 2: ENVIRONMENT VARIABLES SETUP (~15 minutes)

### Step 2.1: Create Local .env File

Create `.env.local` in project root:

```bash
# Supabase Configuration (REQUIRED)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# OAuth Configuration (Optional but recommended)
VITE_GOOGLE_CLIENT_ID=your-google-client-id
VITE_GITHUB_CLIENT_ID=your-github-client-id

# Feature Flags
VITE_ENABLE_PWA=true
VITE_ENABLE_SERVICE_WORKER=true
VITE_ENABLE_OFFLINE_MODE=true
```

**Where to get these values:**

1. **Supabase URL & Key:**
   - Go to https://app.supabase.com
   - Select your project
   - Settings → API
   - Copy URL and anon key

2. **Google OAuth:**
   - Go to https://console.cloud.google.com
   - Create OAuth 2.0 Client ID (Web application)
   - Add redirect URIs:
     - `http://localhost:5173/auth/callback`
     - `http://localhost:4173/auth/callback`
     - `https://flowforge.blink.new/auth/callback`

3. **GitHub OAuth:**
   - Go to https://github.com/settings/developers
   - New OAuth App
   - Authorization callback URL: `https://flowforge.blink.new/auth/callback`

### Step 2.2: Verify Environment Variables

```bash
# These should NOT be empty
echo $VITE_SUPABASE_URL
echo $VITE_SUPABASE_ANON_KEY
```

**Security Note:** Never commit .env.local to git. It's already in .gitignore.

---

## 📋 PHASE 3: BLINK.NEW CLI SETUP (~20 minutes)

### Step 3.1: Install Blink CLI

```bash
# Install globally
npm install -g @blink/cli

# Verify installation
blink --version
```

### Step 3.2: Authenticate with Blink.new

```bash
# Login to your blink.new account
blink auth login

# Follow prompts to authenticate
# This creates ~/.blink/credentials
```

### Step 3.3: Create Blink.new Project

```bash
# Initialize project (optional, blink.json already exists)
blink init

# Or directly deploy (will create project automatically)
```

---

## 📋 PHASE 4: DEPLOYMENT TO BLINK.NEW (~10 minutes)

### Step 4.1: Configure Environment in Blink Dashboard

1. Go to https://dash.blink.new
2. Select your project (or create new)
3. Settings → Environment Variables
4. Add all variables from Step 2.1:
   - VITE_SUPABASE_URL
   - VITE_SUPABASE_ANON_KEY
   - VITE_GOOGLE_CLIENT_ID (optional)
   - VITE_GITHUB_CLIENT_ID (optional)

### Step 4.2: Deploy Application

```bash
# Deploy from project root
blink deploy
```

**Expected Output:**
```
✓ Building application...
✓ Deploying to production...
✓ Deployment successful!
Application URL: https://flowforge.blink.new
```

### Step 4.3: Monitor Deployment

```bash
# Check deployment status
blink status

# View logs
blink logs

# View deployments history
blink deployments
```

---

## 📋 PHASE 5: POST-DEPLOYMENT VERIFICATION (~20 minutes)

### Verification Checklist:

- [ ] **Application Loads**
  - Navigate to https://flowforge.blink.new
  - No 404 or 500 errors
  - Page loads in <3 seconds

- [ ] **Authentication Works**
  - Click "Login with Google"
  - Successfully authenticates
  - Redirects to dashboard
  - Can logout
  - Try GitHub login too

- [ ] **Database Connection**
  - Create a new timer session
  - Check browser DevTools Network tab
  - Supabase API calls succeed (200 status)
  - Data persists after refresh

- [ ] **Timer Functionality**
  - Navigate to /timer
  - Select category
  - Perform mood check-in
  - Start timer
  - Timer counts down correctly
  - Can pause/resume
  - Session saved to database

- [ ] **Analytics Display**
  - SessionStats component loads
  - Shows 4 metrics (total sessions, minutes, mood, completion)
  - Data updates after new session

- [ ] **PWA Installation**
  - Browser shows "Install app" prompt
  - Can install to home screen
  - Works offline (if enabled)

- [ ] **Service Worker**
  - Open DevTools → Application → Service Workers
  - Service worker shows "active and running"
  - No console errors

- [ ] **Performance**
  - Lighthouse score >80 (DevTools → Lighthouse)
  - First Contentful Paint <2s
  - Largest Contentful Paint <3s

### If Issues Found:

1. **Check Logs:**
   ```bash
   blink logs
   ```

2. **Check Frontend Errors:**
   - Open browser DevTools (F12)
   - Check Console tab for JavaScript errors
   - Check Network tab for failed requests

3. **Check Environment Variables:**
   ```bash
   blink env list
   ```

4. **Rollback if Needed:**
   ```bash
   blink deployments
   blink rollback [deployment-id]
   ```

---

## 📋 PHASE 6: POST-DEPLOYMENT OPTIMIZATIONS (Optional)

### Performance Optimization

1. **Enable Caching:**
   - Set cache headers for static assets
   - Configure service worker caching strategy

2. **Monitor Performance:**
   - Set up error tracking (Sentry/LogRocket)
   - Monitor user analytics

3. **Database Optimization:**
   - Add database indexes for frequently queried fields
   - Monitor query performance

### Features to Add in Phase 2

- [ ] Habits system implementation
- [ ] Analytics dashboard
- [ ] Ambient sounds & notifications
- [ ] Focus rooms (multiplayer)
- [ ] Mobile app version (React Native)
- [ ] Email notifications
- [ ] AI-powered insights

---

## ⚠️ CRITICAL NOTES

1. **DO NOT** commit .env.local or credentials
2. **DO NOT** skip Phase 1 (local verification)
3. **DO** test all OAuth flows before deployment
4. **DO** monitor logs after deployment
5. **DO** have rollback plan ready
6. **DO** test on multiple browsers (Chrome, Firefox, Safari, Edge)
7. **DO** test on mobile devices

---

## 🆘 TROUBLESHOOTING REFERENCE

### Build Fails
**Cause:** TypeScript errors  
**Solution:** Run `npm run type-check`, fix errors

### Deployment Fails
**Cause:** Missing environment variables  
**Solution:** Check blink.json, verify env vars in dashboard

### Blank Page After Deploy
**Cause:** Asset path issues  
**Solution:** Check browser console, verify vite.config.ts base path

### OAuth Not Working
**Cause:** Redirect URI mismatch  
**Solution:** Verify callback URL in OAuth provider settings

### Database Errors
**Cause:** Supabase connection failed  
**Solution:** Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY

### Performance Issues
**Cause:** Unoptimized bundle  
**Solution:** Run `npm run build`, check bundle size with `npm run analyze`

---

## 📞 SUPPORT RESOURCES

- **Blink.new Docs:** https://docs.blink.new
- **Supabase Docs:** https://supabase.com/docs
- **Vite Docs:** https://vitejs.dev
- **React Router Docs:** https://reactrouter.com
- **Tailwind Docs:** https://tailwindcss.com

---

## ✅ SIGN-OFF CHECKLIST

Once all phases are complete:

- [ ] All builds succeed locally
- [ ] All verification checks pass
- [ ] Application deployed to production
- [ ] All post-deployment tests pass
- [ ] No critical errors in logs
- [ ] Ready to announce public launch

**Estimated Total Time:** ~95 minutes (1.5 hours)  
**Date Completed:** _____________  
**Deployed By:** _____________  
**Approval:** _____________

---

**Last Updated:** January 21, 2026  
**Version:** 1.0  
**Status:** READY FOR DEPLOYMENT
