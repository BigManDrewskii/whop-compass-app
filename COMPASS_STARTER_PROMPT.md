# Claude Code Starter Prompt for Compass

Copy and paste this into Claude Code to begin:

---

# Build Compass - Whop Onboarding Cards App

I want to build **Compass**, a card-based onboarding flow builder for Whop communities. I have complete technical documentation ready and **Supabase already set up**.

## Project Overview

Compass lets Whop community admins create swipeable onboarding cards (like mobile app first-launch experiences) with text, images, and videos. Members experience a beautiful carousel that guides them through community setup.

**Tech Stack**: 
- React 19, tRPC 11, Express 4
- **PostgreSQL (Supabase)**, Drizzle ORM
- Tailwind 4, shadcn/ui
- Supabase Storage for media

## Documentation Available

I have these documents prepared (please read them as needed):
- `/mnt/user-data/uploads/COMPASS_SETUP.md` - Complete setup guide with Supabase
- `/mnt/user-data/uploads/COMPASS_SPEC.md` - Full architecture (PostgreSQL/Supabase)
- `/mnt/user-data/uploads/COMPASS_TODO.md` - Detailed task checklist

## Whop Integration Resources

Official Whop documentation:
- Core Setup: https://dev.whop.com/sdk/iframe-setup
- Authentication: https://dev.whop.com/authentication
- SDK Reference: https://dev.whop.com/sdk/reference
- Apps Introduction: https://dev.whop.com/apps/introduction
- Building Apps: https://dev.whop.com/apps/building-apps
- In-App Purchases: https://dev.whop.com/apps/inapppurchases
- API Reference: https://dev.whop.com/api-reference
- Developer Dashboard: https://dev.whop.com/dashboard

## Current Setup Status

✅ Supabase project created  
✅ Environment variables configured  
✅ Template cloned and dependencies installed  
⏳ Ready to start Phase 1: Database Schema

## What I Need You To Do

**Start with Phase 1: Database Schema (PostgreSQL)**

1. Read `/mnt/user-data/uploads/COMPASS_SPEC.md` to understand the database requirements
2. Update `drizzle.config.ts` to use `postgresql` dialect (not `mysql`)
3. Create the database schema in `drizzle/schema.ts`:
   - Extend the `users` table with `role` and `companyId` fields
   - Create the `onboarding_cards` table with all required fields (use `pgTable`, not `mysqlTable`)
   - Add appropriate indexes
   - **Important**: Do NOT add unique constraint on (companyId, order)
4. Show me the complete schema before running `pnpm db:push`

## Critical PostgreSQL-Specific Notes

**Schema Syntax Differences:**
- Use `pgTable` instead of `mysqlTable`
- Use `serial("id")` instead of `int("id").autoincrement()`
- Use `text("field")` instead of `varchar("field", { length: 255 })`
- Use `text("field", { enum: ["a", "b"] })` instead of `mysqlEnum()`
- Use `timestamp("field")` for dates

**Example:**
```typescript
import { pgTable, serial, text, integer, timestamp } from 'drizzle-orm/pg-core';

export const onboardingCards = pgTable("onboarding_cards", {
  id: serial("id").primaryKey(),
  companyId: text("companyId").notNull(),
  // ... rest of fields
});
```

## Important Project Rules

- We're using **Supabase Storage** for media uploads (NOT S3 directly)
- For video cards: uploaded videos use `mediaUrl`, YouTube/Vimeo embeds use `content`
- Do NOT add `UNIQUE(companyId, order)` constraint (causes reordering issues)
- Users table needs `role` enum and `companyId` fields added
- PostgreSQL column names are case-sensitive - use quotes in raw SQL: `"companyId"`

## Project Context

- **Purpose**: Whop community creators build custom onboarding experiences
- **Admin side**: Drag-and-drop card builder
- **User side**: Mobile-optimized swipeable carousel  
- **Three card types**: text, image, video (uploaded or embed)
- **Database**: PostgreSQL via Supabase (already set up)
- **Storage**: Supabase Storage for images/videos

## Next Steps After Schema

After you create the schema and I verify it:
1. We'll run `pnpm db:push` to apply it
2. Move to Phase 2: Database helpers (CRUD functions)
3. Phase 3: tRPC API endpoints
4. Phase 4: Admin dashboard UI
5. Phase 5: Media upload (Supabase Storage)
6. Phase 6: User carousel (Swiper.js)

Let's start! Please read `COMPASS_SPEC.md` and show me the PostgreSQL schema for `drizzle/schema.ts`.
