# FlowForge Blink.new Full-Stack Deployment Guide

🚀 Complete guide for deploying FlowForge to blink.new as a full-stack application.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Project Overview](#project-overview)
3. [Setup & Configuration](#setup--configuration)
4. [Building for Blink.new](#building-for-blinknew)
5. [Deployment Steps](#deployment-steps)
6. [Environment Variables](#environment-variables)
7. [Verification Checklist](#verification-checklist)
8. [Troubleshooting](#troubleshooting)
9. [Performance Optimization](#performance-optimization)
10. [Security Considerations](#security-considerations)

## Prerequisites

### System Requirements
- Node.js 18.17.0 or higher
- npm 9.0.0 or higher
- Git
- Blink.new account with active project
- Supabase account with configured database

### API Keys & Credentials
- Supabase Project URL (`VITE_SUPABASE_URL`)
- Supabase Anon Key (`VITE_SUPABASE_ANON_KEY`)
- OAuth credentials (Google & GitHub):
  - Google: Client ID and Client Secret
  - GitHub: OAuth App ID and Client Secret
- OpenAI API key (optional, for Phase 3 AI insights)

## Project Overview

### Architecture
FlowForge is a full-stack PWA built with:
- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Supabase (PostgreSQL + Auth)
- **Hosting**: Blink.new serverless platform
- **Runtime**: Node.js 18

### Tech Stack
```
Frontend Framework      React 18.3.1
Package Manager        npm/pnpm
Build Tool             Vite 5.0.8
Styling                TailwindCSS 3.3.6
UI Components          Radix UI
State Management       Zustand 4.5.0
Database              Supabase (PostgreSQL)
Authentication        OAuth 2.0 (Google/GitHub)
Deployment Platform   Blink.new
```

## Setup & Configuration

### 1. Clone Repository
```bash
git clone https://github.com/pipipew/flowforge.git
cd flowforge
git checkout feat/blink-migration
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration

Create `.env.local` from `.env.example`:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:
```env
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# OAuth (Configure in respective provider dashboards)
VITE_GOOGLE_CLIENT_ID=your-google-client-id
VITE_GITHUB_CLIENT_ID=your-github-client-id

# Blink.new Deployment
VITE_BLINK_DEPLOYMENT=false  # Set to true in production
VITE_NODE_ENV=development

# Features
VITE_ENABLE_PWA=true
VITE_ENABLE_SERVICE_WORKER=true
VITE_ENABLE_OFFLINE_MODE=true
```

### 4. Supabase Setup

#### Apply Database Migrations
1. Go to Supabase Dashboard > SQL Editor
2. Run migrations in order:
   - `supabase/migrations/20260120000001_initial_schema.sql`
   - `supabase/migrations/20260120000002_rls_policies.sql`
   - `supabase/migrations/20260120000003_functions.sql`

#### Configure OAuth Providers

**Google OAuth:**
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create OAuth 2.0 credentials (Web application)
3. Authorized redirect URIs:
   - `http://localhost:5173/auth/callback` (dev)
   - `https://your-blink-app.blink.new/auth/callback` (prod)
4. Copy Client ID and Client Secret

**GitHub OAuth:**
1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Create New OAuth App
3. Authorization callback URL:
   - `http://localhost:5173/auth/callback` (dev)
   - `https://your-blink-app.blink.new/auth/callback` (prod)
4. Copy Client ID and Client Secret

## Building for Blink.new

### Development Build
```bash
npm run dev
```
Visit `http://localhost:5173`

### Production Build
```bash
npm run build:blink
```

This generates optimized production files in `dist/`:
- Minified JavaScript bundles
- Optimized CSS
- Compressed assets
- Service worker file

### Build Output Structure
```
dist/
├── index.html              # Entry point
├── assets/
│   ├── react-vendor-*.js   # React bundle
│   ├── ui-vendor-*.js      # UI components bundle
│   ├── supabase-*.js       # Supabase bundle
│   ├── utils-*.js          # Utilities bundle
│   ├── main-*.js           # Application code
│   └── style-*.css         # Compiled CSS
├── sw.js                   # Service worker
└── manifest.json           # PWA manifest
```

## Deployment Steps

### Step 1: Install Blink.new CLI
```bash
npm install -g @blink/cli
# or
yarn global add @blink/cli
```

### Step 2: Authenticate with Blink.new
```bash
blink auth
```
Follow the prompts to log in to your Blink.new account.

### Step 3: Create Blink.new Project (if not exists)
```bash
blink projects:create flowforge
```

### Step 4: Configure Blink.new Settings

Update `blink.json` in project root:
```json
{
  "name": "flowforge",
  "version": "1.0.0",
  "runtime": "node18",
  "build": {
    "command": "npm run build",
    "output": "dist"
  },
  "env": {
    "VITE_SUPABASE_URL": "$SUPABASE_URL",
    "VITE_SUPABASE_ANON_KEY": "$SUPABASE_KEY",
    "VITE_BLINK_DEPLOYMENT": "true",
    "VITE_NODE_ENV": "production"
  }
}
```

### Step 5: Set Environment Variables on Blink.new
```bash
blink env:set SUPABASE_URL "https://your-project.supabase.co"
blink env:set SUPABASE_KEY "your-anon-key"
blink env:set GOOGLE_CLIENT_ID "your-google-id"
blink env:set GITHUB_CLIENT_ID "your-github-id"
```

### Step 6: Deploy to Blink.new
```bash
blink deploy
```

The CLI will:
1. Validate configuration
2. Build the project
3. Upload assets to blink.new
4. Deploy serverless functions
5. Configure routing
6. Enable SSL/TLS

### Step 7: Verify Deployment
```bash
blink status
blink logs
```

## Environment Variables

### Development Variables
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-dev-anon-key
VITE_BLINK_DEPLOYMENT=false
VITE_NODE_ENV=development
VITE_API_URL=http://localhost:5173/api
VITE_SESSION_TIMEOUT=3600
VITE_SECURE_COOKIES=false
VITE_ENABLE_PWA=true
VITE_ENABLE_SERVICE_WORKER=true
VITE_ENABLE_OFFLINE_MODE=true
VITE_ENABLE_AI_INSIGHTS=false
VITE_ENABLE_FOCUS_ROOMS=false
```

### Production Variables (Blink.new)
```env
VITE_SUPABASE_URL=https://your-prod-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-prod-anon-key
VITE_BLINK_DEPLOYMENT=true
VITE_NODE_ENV=production
VITE_API_URL=https://your-blink-app.blink.new/api
VITE_SESSION_TIMEOUT=7200
VITE_SECURE_COOKIES=true
VITE_ENABLE_PWA=true
VITE_ENABLE_SERVICE_WORKER=true
VITE_ENABLE_OFFLINE_MODE=true
```

## Verification Checklist

- [ ] Application loads without errors
- [ ] OAuth authentication works (Google & GitHub)
- [ ] Database connection established
- [ ] User profiles created on first login
- [ ] Timer functionality working
- [ ] Habits creation and tracking working
- [ ] Service worker installed
- [ ] PWA can be installed
- [ ] Offline mode functioning
- [ ] Performance metrics acceptable
- [ ] Security headers present
- [ ] CORS configured correctly

## Troubleshooting

### OAuth Callback Errors
**Problem**: Redirect URI mismatch error
```
Error: Redirect URI does not match
```

**Solution**:
1. Get your blink.new app URL: `blink status`
2. Update OAuth callback URLs:
   - Google Cloud Console
   - GitHub OAuth App settings
3. Redeploy: `blink deploy`

### Database Connection Issues
**Problem**: "Unable to connect to database"

**Solution**:
1. Verify Supabase credentials in blink.new:
   ```bash
   blink env:list
   ```
2. Test connection:
   ```bash
   curl -H "Authorization: Bearer $SUPABASE_KEY" \
     https://your-project.supabase.co/rest/v1/
   ```
3. Check Supabase dashboard for active connections

### Build Failures
**Problem**: `npm run build:blink` fails

**Solution**:
```bash
# Clear cache
rm -rf node_modules dist
npm install

# Rebuild with verbose output
VITE_LOG=debug npm run build
```

### Service Worker Not Installing
**Problem**: PWA not installing on browser

**Solution**:
1. Check HTTPS enabled on blink.new (required for PWA)
2. Verify manifest.json is valid:
   ```bash
   curl https://your-blink-app.blink.new/manifest.json
   ```
3. Clear browser cache and reload

### Cold Start Performance
**Problem**: First request takes >10 seconds

**Solution**:
1. Enable blink.new cold start optimization
2. Keep Lambda warm: Configure scheduled pings
3. Optimize bundle size (see Performance Optimization)

## Performance Optimization

### Bundle Analysis
```bash
npm run build -- --mode production
npm install -g vite-plugin-visualizer
```

### Optimization Checklist
- [ ] Code splitting enabled (vendor chunks)
- [ ] Tree shaking active
- [ ] CSS minified
- [ ] JavaScript minified with console drops
- [ ] Images optimized and compressed
- [ ] Lazy loading for non-critical features
- [ ] Service worker caching strategy active

### Recommended Settings for Blink.new
```javascript
// vite.config.ts already optimized for:
- ESNext target
- Terser minification
- Manual chunk splitting
- Source map disabled (production)
```

## Security Considerations

### 1. Environment Secrets
- Never commit `.env.local` or secrets
- Use blink.new secrets manager for production
- Rotate API keys regularly

### 2. Database Security
- Row Level Security (RLS) policies enabled
- Service role key never exposed to client
- Only anon key in frontend environment

### 3. Authentication
- OAuth only (no password storage)
- Sessions auto-refresh
- Secure HTTP-only cookies on blink.new

### 4. API Security
- CORS configured for blink.new domain
- Rate limiting on API endpoints
- Input validation on all routes

### 5. HTTPS/TLS
- Automatic SSL/TLS by blink.new
- Force HTTPS redirect
- Security headers configured

## Monitoring & Logs

### View Deployment Logs
```bash
blink logs --follow
```

### Monitor Performance
```bash
blink metrics
```

### Check Application Status
```bash
blink status --detailed
```

## Rollback Procedure

If deployment causes issues:

```bash
# View deployment history
blink deployments

# Rollback to previous version
blink deployments:rollback <deployment-id>
```

## Support & Resources

- [Blink.new Documentation](https://blink.new/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [FlowForge Repository](https://github.com/pipipew/flowforge)

## Next Steps

After successful deployment:
1. Set up monitoring and alerting
2. Configure CDN caching rules
3. Set up continuous deployment
4. Plan Phase 2 enhancements
5. Set up error tracking (Sentry, etc.)

---

**Last Updated**: January 20, 2026  
**Maintained By**: FlowForge Development Team
