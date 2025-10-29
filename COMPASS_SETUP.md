# Compass - Project Setup Guide

**Get from zero to coding in 15 minutes with Supabase**

---

## Prerequisites

Before starting, ensure you have:

- ✅ Node.js 18+ installed
- ✅ pnpm installed (`npm install -g pnpm`)
- ✅ Supabase account with project created
- ✅ Git installed
- ✅ A code editor (VS Code recommended)

---

## Quick Start (5 Minutes)

### 1. Clone the Template

```bash
# Clone the Whop web-db-user template
git clone <template-repo-url> compass
cd compass

# Install dependencies
pnpm install
```

### 2. Configure Supabase

Get your Supabase credentials:
1. Go to https://supabase.com/dashboard
2. Select your project
3. Go to Settings → Database
4. Copy the connection string (Transaction pooler mode)

Create a `.env` file in the root directory:

```env
# Supabase Database (use Transaction pooler for Drizzle)
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@[PROJECT-REF].pooler.supabase.com:6543/postgres?pgbouncer=true"

# Direct connection for migrations (use Direct connection)
DIRECT_DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"

# Authentication (Provided by Manus)
JWT_SECRET="your-jwt-secret-here"
VITE_APP_ID="your-manus-app-id"
OAUTH_SERVER_URL="https://oauth.manus.ai"
VITE_OAUTH_PORTAL_URL="https://portal.manus.ai"
OWNER_OPEN_ID="your-owner-open-id"

# Manus API (for storage)
BUILT_IN_FORGE_API_URL="https://api.manus.ai"
BUILT_IN_FORGE_API_KEY="your-api-key"

# Supabase Storage (for media uploads)
SUPABASE_URL="https://[PROJECT-REF].supabase.co"
SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_KEY="your-service-role-key"
```

### 3. Update Drizzle Config for PostgreSQL

Edit `drizzle.config.ts`:

```typescript
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './drizzle/schema.ts',
  out: './drizzle/migrations',
  dialect: 'postgresql', // Changed from 'mysql'
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

### 4. Initialize Database

```bash
# Push the initial schema
pnpm db:push

# Verify it worked
pnpm db:studio
```

### 5. Start Dev Server

```bash
pnpm dev
```

Open http://localhost:5173 - you should see the template's home page.

---

## Setting Up Your First Admin User

After authentication is working, set one user as admin:

### Via Supabase Dashboard

1. Go to https://supabase.com/dashboard
2. Select your project
3. Go to Table Editor → `users`
4. Find your user (after logging in once)
5. Edit the row:
   - Set `role` = `admin`
   - Set `companyId` = `comp_test123` (for development)
6. Save

### Via SQL Editor

1. Go to SQL Editor in Supabase
2. Run this query:

```sql
-- Find your user ID first
SELECT id, name, email FROM users;

-- Set as admin (adjust ID as needed)
UPDATE users SET role = 'admin' WHERE id = 1;

-- Add a companyId (Whop community ID)
UPDATE users SET "companyId" = 'comp_test123' WHERE id = 1;

-- Verify
SELECT id, name, role, "companyId" FROM users WHERE id = 1;
```

**Note**: PostgreSQL is case-sensitive with column names. Use quotes around `"companyId"`.

---

## Supabase Storage Setup

### Create Media Bucket

1. Go to Storage in Supabase Dashboard
2. Click "New bucket"
3. Name: `compass-media`
4. Set as **Public**
5. Click Create

### Configure Bucket Policies

```sql
-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'compass-media');

-- Allow public read access
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'compass-media');

-- Allow users to delete their own uploads
CREATE POLICY "Users can delete own files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'compass-media');
```

---

## Project Structure

```
compass/
├── client/src/              # Frontend React app
│   ├── pages/              # Page components
│   │   ├── AdminDashboard.tsx   # CREATE: Card management
│   │   └── Onboarding.tsx       # CREATE: User carousel
│   ├── components/         # Reusable components
│   │   ├── CardList.tsx         # CREATE: Drag-drop list
│   │   ├── CardEditor.tsx       # CREATE: Edit modal
│   │   ├── MediaUploader.tsx    # CREATE: File upload
│   │   └── OnboardingCarousel.tsx # CREATE: Swipeable carousel
│   ├── lib/                # Utilities
│   └── App.tsx             # Routes
├── server/                  # Backend Express + tRPC
│   ├── routers.ts          # tRPC procedures (add cards router)
│   ├── db.ts               # Database helpers (add card queries)
│   └── storage.ts          # Supabase upload helpers
├── drizzle/                 # Database schema
│   └── schema.ts           # PostgreSQL table definitions
└── shared/                  # Shared types
```

---

## Common Setup Issues

### Issue: "Cannot connect to database"
**Solution**: 
- Verify `DATABASE_URL` uses **Transaction pooler** connection
- Check Supabase project is active (not paused)
- Format: `postgresql://postgres:[PASSWORD]@[REF].pooler.supabase.com:6543/postgres?pgbouncer=true`

### Issue: "Drizzle config error"
**Solution**:
- Change dialect from `mysql` to `postgresql` in `drizzle.config.ts`
- Restart dev server after config changes

### Issue: "Column 'role' does not exist"
**Solution**:
- You'll add these columns in Phase 1
- They don't exist in the base template

### Issue: "Authentication failed"
**Solution**:
- Verify Manus OAuth credentials
- Clear browser cookies and try again
- Check console for detailed error messages

---

## Helpful Commands

```bash
# Development
pnpm dev              # Start dev server
pnpm build            # Build for production
pnpm preview          # Preview production build

# Database
pnpm db:push          # Push schema to Supabase
pnpm db:studio        # Open Drizzle Studio GUI
pnpm db:generate      # Generate migration files

# Code Quality
pnpm lint             # Run ESLint
pnpm type-check       # TypeScript check
```

---

## Verification Checklist

Before building features:

- [ ] ✅ Dev server runs without errors
- [ ] ✅ Can access http://localhost:5173
- [ ] ✅ Supabase connection works (`pnpm db:studio`)
- [ ] ✅ Can log in via OAuth
- [ ] ✅ Set at least one admin user
- [ ] ✅ Created `compass-media` bucket in Supabase Storage
- [ ] ✅ Can access tRPC panel at /__trpc

**All done?** Read `COMPASS_SPEC.md` next, then start `COMPASS_TODO.md` Phase 0.

---

## Next Steps

1. Read `COMPASS_SPEC.md` - Understand the architecture (30 min)
2. Follow `COMPASS_TODO.md` - Build phase by phase
3. Keep `COMPASS_QUICK_REF.md` open while coding

---

**🎯 Ready to build Compass!**
