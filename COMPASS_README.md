# Compass Documentation - Complete Package

**Everything you need to build Compass with Claude Code + Supabase**

---

## 📦 What You Have

### Core Documentation (5 files)

1. **[COMPASS_SETUP.md](./COMPASS_SETUP.md)** - Setup guide
   - Supabase configuration
   - Environment variables
   - Storage bucket setup
   - First admin user setup
   - 15 minute quick start

2. **[COMPASS_SPEC.md](./COMPASS_SPEC.md)** - Technical specification
   - PostgreSQL schema (not MySQL)
   - Architecture overview
   - Card types and field usage
   - Supabase Storage integration
   - Video embed validation
   - Security best practices
   - Complete code examples

3. **[COMPASS_TODO.md](./COMPASS_TODO.md)** - Implementation checklist
   - 10 phases with 150+ tasks
   - 20-25 hour timeline
   - Phase-by-phase verification steps
   - PostgreSQL-specific notes

4. **[COMPASS_QUICK_REF.md](./COMPASS_QUICK_REF.md)** - Quick reference
   - PostgreSQL query patterns
   - Supabase Storage code
   - tRPC examples
   - React components
   - Drag & drop patterns
   - Swiper carousel setup
   - Common errors & solutions

5. **[COMPASS_STARTER_PROMPT.md](./COMPASS_STARTER_PROMPT.md)** - Initial prompt
   - Ready to paste into Claude Code
   - Starts at Phase 1 (Database Schema)
   - PostgreSQL-specific instructions

### Helper Files (2 files)

6. **[COMPASS_VIBE_RULE.txt](./COMPASS_VIBE_RULE.txt)** - Claude Code vibe rule
   - Paste into vibe rule dialog
   - Keeps context throughout session
   - PostgreSQL reminders
   - Critical rules

7. **This file** - Navigation guide

---

## 🎯 Quick Start (Choose Your Path)

### Path A: Just Read Me the Steps
1. Open **COMPASS_STARTER_PROMPT.md**
2. Copy entire content
3. Paste into Claude Code
4. Claude will start building Phase 1 (database schema)

### Path B: I Want to Understand First
1. Read **COMPASS_SETUP.md** (15 min) - Get project running
2. Read **COMPASS_SPEC.md** (30 min) - Understand architecture
3. Open **COMPASS_TODO.md** - Track your progress
4. Start building with Claude Code

### Path C: I'm Already Set Up
1. Open **COMPASS_STARTER_PROMPT.md**
2. Paste into Claude Code
3. Keep **COMPASS_QUICK_REF.md** open for copy-paste patterns

---

## 📋 Setup Vibe Rule in Claude Code

### Step 1: Open Vibe Rule Dialog
- In Claude Code, look for "Create Vibe Rule" button
- Or use keyboard shortcut to open settings

### Step 2: Fill in Fields

**Name:**
```
compass-supabase
```

**Description:**
```
Whop onboarding builder with PostgreSQL/Supabase
```

**Content:**
- Open **COMPASS_VIBE_RULE.txt**
- Copy entire contents
- Paste into Content field

### Step 3: Save
- Click "Create Rule"
- This context stays active for your entire session

---

## 🎓 Understanding the Differences

### Original Docs vs Compass Docs

| Original | Compass |
|----------|---------|
| MySQL | PostgreSQL (Supabase) |
| `mysqlTable` | `pgTable` |
| `int().autoincrement()` | `serial()` |
| `varchar("field", { length: 64 })` | `text("field")` |
| `mysqlEnum("role", [...])` | `text("role", { enum: [...] })` |
| S3 storage (generic) | Supabase Storage (specific) |
| 30 hour estimate | 20-25 hour estimate |

### Why PostgreSQL/Supabase?

✅ You already have Supabase set up  
✅ Better JSON support  
✅ Built-in full-text search  
✅ Generous free tier  
✅ Integrated auth & storage  
✅ Real-time capabilities (future feature)  
✅ PostGIS for geo features (future feature)  

---

## 🏗️ Project Structure

```
compass/
├── 📄 Documentation (what you have now)
│   ├── COMPASS_SETUP.md
│   ├── COMPASS_SPEC.md
│   ├── COMPASS_TODO.md
│   ├── COMPASS_QUICK_REF.md
│   ├── COMPASS_STARTER_PROMPT.md
│   └── COMPASS_VIBE_RULE.txt
│
├── 🎨 Frontend (you'll build)
│   ├── pages/
│   │   ├── AdminDashboard.tsx
│   │   └── Onboarding.tsx
│   ├── components/
│   │   ├── CardList.tsx
│   │   ├── CardEditor.tsx
│   │   ├── MediaUploader.tsx
│   │   └── OnboardingCarousel.tsx
│   └── App.tsx
│
├── ⚙️ Backend (you'll build)
│   ├── routers.ts (add cards + media routers)
│   ├── db.ts (add card CRUD functions)
│   └── supabase.ts (new file)
│
└── 🗄️ Database (you'll create)
    └── schema.ts (PostgreSQL schema)
```

---

## 📖 Reading Guide

### If You're New to the Project (1 hour)
1. **COMPASS_SETUP.md** - Get running (15 min)
2. **COMPASS_SPEC.md** - Sections: Executive Summary, Architecture, Database Schema (20 min)
3. **COMPASS_TODO.md** - Skim to understand phases (10 min)
4. **COMPASS_QUICK_REF.md** - Bookmark for later (5 min)
5. **COMPASS_STARTER_PROMPT.md** - Start building! (10 min to set up)

### If You Want to Dive Right In (15 min)
1. **COMPASS_SETUP.md** - Quick Start section only (5 min)
2. **COMPASS_STARTER_PROMPT.md** - Copy to Claude Code (5 min)
3. Keep **COMPASS_QUICK_REF.md** open (5 min to bookmark)

### If You're Mid-Build and Stuck
1. Check **COMPASS_QUICK_REF.md** for code patterns
2. Check **COMPASS_SPEC.md** for architecture details
3. Check **COMPASS_TODO.md** to verify you didn't skip steps

---

## 🎯 Development Workflow

### Day 1: Setup & Schema (2-3 hours)
- [ ] Follow COMPASS_SETUP.md
- [ ] Set up Supabase connection
- [ ] Complete TODO Phase 0 (setup)
- [ ] Complete TODO Phase 1 (database schema)
- [ ] Verify with `pnpm db:studio`

### Day 2: Backend (3-4 hours)
- [ ] Complete TODO Phase 2 (database helpers)
- [ ] Complete TODO Phase 3 (tRPC API)
- [ ] Test endpoints in tRPC panel
- [ ] Verify CRUD operations work

### Day 3: Admin UI (4-5 hours)
- [ ] Complete TODO Phase 4 (admin dashboard)
- [ ] Implement drag-and-drop
- [ ] Test card creation/editing
- [ ] Verify reordering works

### Day 4: Media & Carousel (4-5 hours)
- [ ] Complete TODO Phase 5 (media upload)
- [ ] Test Supabase Storage
- [ ] Complete TODO Phase 6 (user carousel)
- [ ] Test on mobile

### Day 5: Polish & Testing (3-4 hours)
- [ ] Complete TODO Phase 7 (polish)
- [ ] Complete TODO Phase 8 (testing)
- [ ] Fix bugs
- [ ] Cross-browser testing

### Day 6: Deploy (1-2 hours)
- [ ] Complete TODO Phase 9 (deployment prep)
- [ ] Deploy to production
- [ ] Test production environment
- [ ] 🎉 Launch!

**Total: 20-25 hours** (about 1 week at 4-5 hours/day)

---

## 🔑 Key PostgreSQL Differences

### Schema Syntax
```typescript
// ❌ MySQL (old docs)
import { mysqlTable, int, varchar, mysqlEnum } from 'drizzle-orm/mysql-core';

export const cards = mysqlTable("cards", {
  id: int("id").autoincrement().primaryKey(),
  companyId: varchar("companyId", { length: 64 }),
  type: mysqlEnum("type", ["text", "image", "video"]),
});

// ✅ PostgreSQL (Compass)
import { pgTable, serial, text } from 'drizzle-orm/pg-core';

export const cards = pgTable("cards", {
  id: serial("id").primaryKey(),
  companyId: text("companyId"),
  type: text("type", { enum: ["text", "image", "video"] }),
});
```

### Connection String
```env
# ❌ MySQL
DATABASE_URL="mysql://user:pass@host:3306/db"

# ✅ PostgreSQL (Supabase)
DATABASE_URL="postgresql://postgres:pass@xxx.pooler.supabase.com:6543/postgres?pgbouncer=true"
```

### Query Syntax
```typescript
// PostgreSQL supports RETURNING (MySQL doesn't)
const [newCard] = await db.insert(cards)
  .values({ ... })
  .returning(); // ✅ Gets inserted row immediately
```

---

## 🆘 Common Issues

### "dialect is not a function"
**Fix:** Update `drizzle.config.ts`:
```typescript
export default defineConfig({
  dialect: 'postgresql', // not 'mysql'
});
```

### "column does not exist"
**Fix:** PostgreSQL is case-sensitive. Use quotes:
```sql
UPDATE users SET "companyId" = 'comp_123'; -- not companyId
```

### Upload fails silently
**Fix:** Check Supabase Storage:
1. Bucket exists and is public
2. Policies allow insert/select
3. `SUPABASE_SERVICE_KEY` is set

### "Cannot find module @supabase/supabase-js"
**Fix:** Install it:
```bash
pnpm add @supabase/supabase-js
```

---

## 📊 Feature Checklist

By the end, you'll have:

**Admin Features:**
- [ ] Create text cards with title and content
- [ ] Upload images (jpg, png, gif)
- [ ] Upload videos (mp4, mov)
- [ ] Embed YouTube videos
- [ ] Embed Vimeo videos
- [ ] Edit any card
- [ ] Delete cards with confirmation
- [ ] Reorder cards via drag-and-drop
- [ ] Preview cards before publishing

**User Features:**
- [ ] View onboarding carousel
- [ ] Swipe between cards (mobile)
- [ ] Navigate with arrow keys (desktop)
- [ ] Use prev/next buttons
- [ ] See progress indicator (X of Y)
- [ ] Skip onboarding
- [ ] Complete onboarding

**Technical:**
- [ ] PostgreSQL database via Supabase
- [ ] Supabase Storage for media
- [ ] Type-safe API with tRPC
- [ ] Row-level security (RLS)
- [ ] Admin access control
- [ ] Company/tenant isolation
- [ ] Responsive design
- [ ] Error handling
- [ ] Loading states

---

## 🎉 Success Criteria

You'll know you're done when:

✅ Admin can create all 3 card types  
✅ Admin can drag-and-drop to reorder  
✅ Images upload to Supabase Storage  
✅ Videos upload to Supabase Storage  
✅ YouTube embeds work  
✅ Vimeo embeds work  
✅ User sees swipeable carousel  
✅ Carousel works on mobile  
✅ Non-admins can't access admin routes  
✅ Cards are filtered by companyId  
✅ No console errors  
✅ App deployed to production  

---

## 🚀 Let's Build!

### Your Next 3 Steps:

1. **Open COMPASS_STARTER_PROMPT.md**
2. **Copy the entire prompt**
3. **Paste into Claude Code and hit enter**

Claude will start building the database schema for you!

### While Building:

- Keep **COMPASS_TODO.md** open to track progress
- Keep **COMPASS_QUICK_REF.md** open for copy-paste patterns
- Reference **COMPASS_SPEC.md** when you need architectural details

---

## 📞 Additional Resources

**Supabase:**
- Dashboard: https://supabase.com/dashboard
- Docs: https://supabase.com/docs
- Storage Guide: https://supabase.com/docs/guides/storage

**Whop:**
- Developer Portal: https://dev.whop.com
- Dashboard: https://whop.com/dashboard

**Drizzle ORM:**
- Docs: https://orm.drizzle.team
- PostgreSQL Guide: https://orm.drizzle.team/docs/get-started-postgresql

**Libraries:**
- Swiper: https://swiperjs.com/react
- @hello-pangea/dnd: https://github.com/hello-pangea/dnd
- shadcn/ui: https://ui.shadcn.com

---

## 💪 You've Got This!

You have:
- ✅ Complete documentation (5 core files)
- ✅ Ready-to-use starter prompt
- ✅ Detailed checklist (150+ tasks)
- ✅ Code patterns for copy-paste
- ✅ Supabase already set up
- ✅ PostgreSQL-specific guidance

**Time to build something awesome!** 🚀

---

*Last Updated: October 28, 2025*  
*Version: 1.0 (Compass with Supabase/PostgreSQL)*  
*Total Documentation: ~15,000 words*  
*Estimated Build Time: 20-25 hours*
