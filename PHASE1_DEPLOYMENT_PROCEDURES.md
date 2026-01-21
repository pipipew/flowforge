# Phase 1: Deployment Procedures
## Step-by-Step Guide for Production Deployment to blink.new

**Last Updated**: January 21, 2026
**Status**: READY FOR EXECUTION

---

## Pre-Deployment Checklist

### Prerequisites
- [ ] Node.js 18+ installed locally
- [ ] npm or yarn package manager
- [ ] Git configured with SSH access
- [ ] Blink.new account created and logged in
- [ ] Supabase project created and credentials obtained
- [ ] GitHub repository access verified
- [ ] PR #6 merged to main branch ✅ (COMPLETED)

### Local Machine Setup
```bash
# Verify Node.js version
node --version  # Should be 18.x or higher

# Verify npm version  
npm --version   # Should be 9.x or higher

# Clone repository if not already done
git clone https://github.com/pipipew/flowforge.git
cd flowforge

# Verify main branch is up to date
git checkout main
git pull origin main
```

---

## Phase 1: Build Verification (Local Machine)

### Step 1: Install Dependencies
```bash
npm install
```
**Expected**: No errors, all packages installed successfully

### Step 2: Run Build
```bash
npm run build
```
**Expected**:
- Build completes without errors
- dist/ folder created with compiled assets
- No console warnings
- Bundle size < 500KB (main bundle)

### Step 3: Verify Build Output
```bash
# Check build output
ls -la dist/

# Check bundle size
du -sh dist/

# Optional: Preview build locally
npm run preview
```
**Expected**: Application runs locally without errors at http://localhost:4173

---

## Phase 2: Environment Configuration

### Step 1: Create `.env.production` File
Create file in project root:

```bash
# Copy from example
cp .env.example .env.production

# Edit with production values
nano .env.production
```

### Step 2: Configure Environment Variables
```env
# Supabase Configuration
VITE_SUPABASE_URL=https://[your-project].supabase.co
VITE_SUPABASE_ANON_KEY=[your-anon-key-here]

# API Configuration
VITE_PUBLIC_API_URL=https://flowforge.blink.new

# Node Environment
NODE_ENV=production

# Optional: Analytics/Monitoring
VITE_SENTRY_DSN=[if-using-sentry]
```

### Step 3: Verify Environment Variables
- [ ] All required variables present
- [ ] No sensitive keys committed to git
- [ ] .env files added to .gitignore

---

## Phase 3: Database Setup

### Step 1: Verify Supabase Project
1. Login to [supabase.com](https://supabase.com)
2. Navigate to your project
3. Go to SQL Editor
4. Verify tables exist:
```sql
SELECT tablename FROM pg_tables WHERE schemaname='public';
```

### Step 2: Run Migrations
Execute migration files in order:

**Migration 1: Initial Schema**
```sql
-- File: supabase/migrations/20260121_week4_advanced_features.sql
-- Run in Supabase SQL Editor
```

### Step 3: Verify RLS Policies
```sql
-- Check RLS is enabled
SELECT tablename, rowsecurity FROM pg_tables 
WHERE schemaname='public' AND tablename IN ('goals', 'achievements', 'leaderboard_entries');

-- Check policies exist
SELECT * FROM pg_policies 
WHERE tablename IN ('goals', 'achievements', 'leaderboard_entries');
```

**Expected**: All tables have RLS enabled with appropriate policies

---

## Phase 4: Deploy to Blink.new

### Step 1: Connect GitHub Repository
1. Login to [blink.new](https://blink.new)
2. Click "New Project" or "Add Project"
3. Select "GitHub" as source
4. Authorize GitHub access
5. Select `pipipew/flowforge` repository

### Step 2: Configure Deployment Settings
1. **Branch**: Select `main`
2. **Build Command**: `npm run build`
3. **Start Command**: `npm start` or `npm run preview`
4. **Output Directory**: `dist`
5. **Root Directory**: `/` (default)

### Step 3: Set Environment Variables in Blink.new
In deployment settings, add:
```
VITE_SUPABASE_URL = https://[your-project].supabase.co
VITE_SUPABASE_ANON_KEY = [your-anon-key]
VITE_PUBLIC_API_URL = https://flowforge.blink.new
NODE_ENV = production
```

### Step 4: Deploy
1. Click "Deploy" button
2. Monitor deployment logs
3. Wait for deployment to complete (typically 2-5 minutes)

**Expected Output**:
```
✅ Build successful
✅ Functions deployed
✅ Deployment live at: https://flowforge.blink.new
```

---

## Phase 5: Post-Deployment Verification

### Step 1: Check Application Accessibility
```bash
# Test from terminal
curl https://flowforge.blink.new
curl -I https://flowforge.blink.new

# Expected: 200 OK
```

### Step 2: Verify SSL Certificate
- [ ] HTTPS working (padlock in browser)
- [ ] No certificate warnings
- [ ] Certificate valid and trusted

### Step 3: Test Core Routes
- [ ] / (Home) loads
- [ ] /api/goals returns data (if authenticated)
- [ ] Static assets load (JS, CSS)
- [ ] No 404 errors in console

### Step 4: Verify Database Connection
```bash
# Test API endpoint with authentication
curl -X GET https://flowforge.blink.new/api/goals \
  -H "Authorization: Bearer [your-token]" \
  -H "Content-Type: application/json"

# Expected: 200 OK with goals data or 401 if no token
```

### Step 5: Monitor Deployment
- [ ] Check blink.new dashboard for errors
- [ ] Monitor application logs
- [ ] Check no 5xx errors occurring
- [ ] Verify database connections healthy

---

## Phase 6: Execute QA Testing

Refer to `PHASE1_QA_TESTING_REPORT.md` for comprehensive testing procedures:

### Quick Smoke Tests (Critical)
- [ ] Authentication works (login/logout)
- [ ] Goals API CRUD operations work
- [ ] UI components render correctly
- [ ] No JavaScript errors in console
- [ ] Responsive design functions on mobile

### Full Testing Checklist
See `PHASE1_QA_TESTING_REPORT.md` for:
- API endpoint testing (complete)
- UI component testing (complete)
- Responsive design testing (complete)
- Security verification (complete)
- Performance testing (complete)

---

## Rollback Procedures (If Needed)

### Immediate Rollback
```bash
# If deployment fails or critical issues found:

# 1. Check deployment logs in blink.new
# 2. Identify issue
# 3. Fix locally
# 4. Commit and push to main
# 5. Trigger redeployment in blink.new

# Alternative: Rollback to previous version
git revert HEAD
git push origin main
```

### Database Rollback (If Migration Failed)
```bash
# In Supabase SQL Editor:
-- DROP recently added tables
DROP TABLE IF EXISTS goals CASCADE;
DROP TABLE IF EXISTS achievements CASCADE;
DROP TABLE IF EXISTS leaderboard_entries CASCADE;

-- Restore from backup (if available)
```

---

## Troubleshooting Guide

### Issue: Build Fails Locally
**Solution**:
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Issue: Environment Variables Not Loading
**Solution**:
- Verify .env.production file exists
- Verify all variables have correct format
- Verify no quotes around values (unless needed)
- Restart build process

### Issue: Database Connection Fails
**Solution**:
- Verify Supabase credentials correct
- Verify project is active (not paused)
- Check database connection in Supabase console
- Verify RLS policies allow your connection

### Issue: Deployment Fails in Blink.new
**Solution**:
- Check deployment logs for specific error
- Verify all environment variables set
- Try redeploying (sometimes transient)
- Check GitHub repository access

### Issue: 404 Errors After Deployment
**Solution**:
- Verify all files uploaded to blink.new
- Check build output directory (dist/)
- Verify routing configuration correct
- Clear browser cache

---

## Success Criteria

✅ **Deployment Complete When**:
1. Application accessible at https://flowforge.blink.new
2. HTTPS working with valid certificate
3. All routes responding (no 404s)
4. Database connected and queries working
5. No 5xx errors in logs
6. UI renders correctly on all breakpoints
7. Authentication working
8. All critical tests passing (see PHASE1_QA_TESTING_REPORT.md)

---

## Next Steps After Deployment

1. **Monitor** - Watch for errors in first 24 hours
2. **Test** - Execute complete QA test suite
3. **Document** - Record deployment results and any issues
4. **Feedback** - Collect stakeholder feedback
5. **Plan** - Begin Phase 2 feature planning

---

## Support & Contacts

- **Deployment Issues**: Check blink.new documentation
- **Database Issues**: Supabase dashboard or support
- **Code Issues**: Review GitHub Actions logs
- **Emergency Rollback**: See rollback procedures above

---

**Document Version**: 1.0
**Created**: January 21, 2026
**Status**: READY FOR EXECUTION
