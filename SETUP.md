# FlowForge Setup Guide

## 📚 Overview

This guide will walk you through setting up FlowForge for local development.

## ✅ Prerequisites

Before you begin, ensure you have:

- **Node.js 18+** and npm/pnpm installed
- **Git** installed
- **Supabase account** ([sign up free](https://supabase.com))
- Code editor (VS Code recommended)

## 🚀 Quick Start (5 minutes)

### 1. Clone the Repository

```bash
git clone https://github.com/pipipew/flowforge.git
cd flowforge
```

### 2. Install Dependencies

```bash
npm install
# or
pnpm install
# or
yarn install
```

### 3. Set Up Supabase

#### Option A: Using Supabase Cloud (Recommended)

1. Go to [https://supabase.com](https://supabase.com) and create a new project
2. Wait for the project to finish setting up (~2 minutes)
3. Go to **Project Settings** → **API**
4. Copy your **Project URL** and **anon/public key**

#### Option B: Using Supabase CLI (Local Development)

```bash
# Install Supabase CLI
npm install -g supabase

# Initialize Supabase
supabase init

# Start local Supabase
supabase start
```

### 4. Configure Environment Variables

```bash
# Copy the example file
cp .env.example .env
```

Edit `.env` with your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_APP_ENV=development
VITE_ENABLE_AI_INSIGHTS=false
VITE_ENABLE_FOCUS_ROOMS=false
```

### 5. Run Database Migrations

#### If using Supabase Cloud:

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Run each migration file in order:
   - `supabase/migrations/20260120000001_initial_schema.sql`
   - `supabase/migrations/20260120000002_rls_policies.sql`
   - `supabase/migrations/20260120000003_functions.sql`

#### If using Supabase CLI:

```bash
supabase db reset
```

### 6. Configure Authentication Providers

1. In Supabase Dashboard, go to **Authentication** → **Providers**
2. Enable **Google** OAuth:
   - Follow [this guide](https://supabase.com/docs/guides/auth/social-login/auth-google)
   - Add redirect URL: `http://localhost:3000/auth/callback`
3. Enable **GitHub** OAuth:
   - Follow [this guide](https://supabase.com/docs/guides/auth/social-login/auth-github)
   - Add redirect URL: `http://localhost:3000/auth/callback`

### 7. Start Development Server

```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000)

## 📝 Project Structure

```
flowforge/
├── public/               # Static assets
├── src/
│   ├── components/      # React components
│   │   ├── auth/        # Auth components
│   │   ├── timer/       # Timer components
│   │   ├── habits/      # Habit tracker components
│   │   ├── dashboard/   # Dashboard components
│   │   └── ui/          # Shared UI components
│   ├── contexts/        # React contexts
│   ├── hooks/           # Custom hooks
│   ├── lib/             # Utilities
│   │   ├── supabase.ts  # Supabase client
│   │   └── utils/       # Helper functions
│   ├── pages/           # Page components
│   ├── stores/          # Zustand stores
│   ├── types/           # TypeScript types
│   └── styles/          # CSS files
├── supabase/
│   └── migrations/      # Database migrations
└── tests/              # Test files
```

## 🛠️ Available Scripts

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
npm run format       # Format with Prettier
npm run type-check   # TypeScript type checking

# Testing
npm run test         # Run unit tests
npm run test:ui      # Run tests with UI
npm run test:coverage # Generate coverage report
```

## ⚙️ Configuration

### TypeScript

The project uses TypeScript strict mode. Configuration is in `tsconfig.json`.

### Tailwind CSS

Tailwind configuration is in `tailwind.config.js`. We use:
- Custom color scheme (indigo primary)
- CSS variables for theming
- shadcn/ui design tokens

### PWA

PWA configuration is in `vite.config.ts` using `vite-plugin-pwa`:
- Offline-first service worker
- Automatic updates
- Cached assets

## 🐛 Troubleshooting

### Issue: "Missing Supabase environment variables"

**Solution:** Ensure your `.env` file exists and contains valid `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.

### Issue: Database connection errors

**Solution:** 
1. Check that migrations ran successfully
2. Verify your Supabase project is active
3. Ensure RLS policies are enabled

### Issue: OAuth not working

**Solution:**
1. Check redirect URLs in OAuth provider settings
2. Verify providers are enabled in Supabase
3. Ensure you're using the correct client IDs/secrets

### Issue: Build fails

**Solution:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

## 📚 Next Steps

Once setup is complete:

1. **Phase 1 Tasks** (see ROADMAP.md):
   - [ ] Implement Auth components and context
   - [ ] Create basic Timer component
   - [ ] Build Habit tracker UI
   - [ ] Develop Dashboard layout
   - [ ] Set up Zustand stores

2. **Read the documentation**:
   - Review the [Master Prompt](FlowForge_Master_Prompt.txt) for full spec
   - Check [ROADMAP.md](ROADMAP.md) for development plan

3. **Join development**:
   - Check open issues
   - Review contribution guidelines (coming soon)

## 👥 Getting Help

If you encounter issues:

1. Check this guide and ROADMAP.md
2. Search existing GitHub issues
3. Create a new issue with details
4. Join our Discord (coming soon)

## 📦 Production Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Other platforms

The app is a standard Vite React app and can be deployed to:
- Netlify
- Cloudflare Pages
- AWS Amplify
- Any static hosting service

---

**Happy coding! 🚀**
