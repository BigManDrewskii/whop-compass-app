# Compass - Technical Specification

**Project**: Compass (Whop Onboarding Cards)  
**Stack**: React 19 + tRPC 11 + Express 4 + PostgreSQL (Supabase) + Tailwind 4  
**Version**: 1.0  
**Date**: October 28, 2025

---

## Executive Summary

Compass is a card-based onboarding system for Whop communities. Admins create swipeable onboarding cards (text, images, videos) and members experience a mobile-optimized carousel guiding them through community setup.

**Key Features**:
- Dynamic card management (vs. static guides)
- Mobile-first swipeable UX
- Multi-media support with Supabase Storage
- Zero maintenance overhead

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (React 19)                   │
├──────────────────────┬──────────────────────────────────┤
│  Admin Dashboard     │  User Onboarding Carousel        │
│  - Card Builder      │  - Card Viewer                   │
│  - Drag & Drop       │  - Progress Tracker              │
│  - Media Upload      │  - Navigation Controls           │
└──────────────────────┴──────────────────────────────────┘
                           │
                           │ tRPC (Type-safe API)
                           ↓
┌─────────────────────────────────────────────────────────┐
│               Backend (Express + tRPC)                   │
├──────────────────────┬──────────────────────────────────┤
│  Cards Router        │  Media Router                    │
│  - CRUD operations   │  - Supabase upload               │
│  - Reordering        │  - URL validation                │
│  - Access control    │  - Storage integration           │
└──────────────────────┴──────────────────────────────────┘
                           │
                           ↓
┌─────────────────────────────────────────────────────────┐
│            Database (PostgreSQL via Supabase)            │
│  - onboarding_cards (content & metadata)                 │
│  - users (auth, role, companyId)                         │
└─────────────────────────────────────────────────────────┘
                           │
                           ↓
┌─────────────────────────────────────────────────────────┐
│                   External Services                      │
│  - Supabase Storage (image/video hosting)                │
│  - YouTube/Vimeo (embedded video players)                │
└─────────────────────────────────────────────────────────┘
```

---

## Database Schema (PostgreSQL)

### `users` Table (Extended)

Add these fields to existing users table:

```typescript
export const users = pgTable("users", {
  // ... existing fields from template ...
  role: text("role", { enum: ["user", "admin"] }).default("user").notNull(),
  companyId: text("companyId"), // Whop company/community ID
});
```

### `onboarding_cards` Table

```typescript
export const onboardingCards = pgTable("onboarding_cards", {
  id: serial("id").primaryKey(),
  companyId: text("companyId").notNull(),
  order: integer("order").notNull().default(0),
  type: text("type", { enum: ["text", "image", "video"] }).notNull(),
  title: text("title"),
  content: text("content"),
  mediaUrl: text("mediaUrl"),
  mediaMimeType: text("mediaMimeType"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  createdBy: integer("createdBy").references(() => users.id),
}, (table) => ({
  companyOrderIdx: index("idx_company_order").on(table.companyId, table.order),
  // Note: NO unique constraint to avoid reordering conflicts
}));
```

**Important**: Do NOT add a unique constraint on (companyId, order). This causes conflicts during drag-and-drop reordering.

---

## Card Types & Field Usage

### Text Card
```typescript
{
  type: 'text',
  title: 'Welcome to Our Community!',
  content: 'Here's how to get started...',
  mediaUrl: null,
  mediaMimeType: null
}
```

### Image Card (Uploaded to Supabase)
```typescript
{
  type: 'image',
  title: 'Community Guidelines',
  content: null, // or optional caption
  mediaUrl: 'https://[PROJECT].supabase.co/storage/v1/object/public/compass-media/image.png',
  mediaMimeType: 'image/png'
}
```

### Video Card (Uploaded to Supabase)
```typescript
{
  type: 'video',
  title: 'Community Tour',
  content: null,
  mediaUrl: 'https://[PROJECT].supabase.co/storage/v1/object/public/compass-media/video.mp4',
  mediaMimeType: 'video/mp4'
}
```

### Video Card (YouTube/Vimeo Embed)
```typescript
{
  type: 'video',
  title: 'Welcome Video',
  content: 'https://www.youtube.com/embed/VIDEO_ID', // Embed URL
  mediaUrl: null,
  mediaMimeType: null
}
```

**Rendering Logic**:
```typescript
function renderVideoCard(card: Card) {
  if (card.mediaUrl) {
    // Uploaded video from Supabase
    return <video src={card.mediaUrl} controls />;
  } else if (card.content) {
    // YouTube/Vimeo embed
    return <iframe src={card.content} />;
  }
  return null;
}
```

---

## Media Upload (Supabase Storage)

### Setup

1. Create bucket: `compass-media` (public)
2. Configure storage policies (see COMPASS_SETUP.md)

### Implementation

```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

// In tRPC router
media: router({
  upload: adminProcedure
    .input(z.object({
      file: z.instanceof(Buffer),
      filename: z.string(),
      mimeType: z.string(),
    }))
    .mutation(async ({ input }) => {
      // Validate file type
      const validTypes = [
        'image/jpeg', 'image/png', 'image/gif',
        'video/mp4', 'video/quicktime'
      ];
      
      if (!validTypes.includes(input.mimeType)) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Invalid file type',
        });
      }
      
      // Validate size (100MB)
      if (input.file.length > 100 * 1024 * 1024) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'File too large (max 100MB)',
        });
      }
      
      // Upload to Supabase
      const filename = `${Date.now()}-${input.filename}`;
      const { data, error } = await supabase.storage
        .from('compass-media')
        .upload(filename, input.file, {
          contentType: input.mimeType,
          upsert: false,
        });
      
      if (error) throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Upload failed',
      });
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('compass-media')
        .getPublicUrl(data.path);
      
      return {
        url: publicUrl,
        mimeType: input.mimeType,
      };
    }),
}),
```

---

## Video Embed Validation

### Supported URLs

**YouTube**:
- `https://www.youtube.com/watch?v=VIDEO_ID` → `https://www.youtube.com/embed/VIDEO_ID`
- `https://youtu.be/VIDEO_ID` → `https://www.youtube.com/embed/VIDEO_ID`

**Vimeo**:
- `https://vimeo.com/VIDEO_ID` → `https://player.vimeo.com/video/VIDEO_ID`

### Implementation

```typescript
media: router({
  validateEmbedUrl: adminProcedure
    .input(z.object({ url: z.string().url() }))
    .query(({ input }) => {
      const { url } = input;
      
      // YouTube patterns
      const youtubeWatch = /youtube\.com\/watch\?v=([^&]+)/;
      const youtubeShort = /youtu\.be\/([^?]+)/;
      const youtubeEmbed = /youtube\.com\/embed\/([^?]+)/;
      
      let match = url.match(youtubeWatch) || url.match(youtubeShort);
      if (match) {
        return {
          valid: true,
          embedUrl: `https://www.youtube.com/embed/${match[1]}`,
          provider: 'youtube',
        };
      }
      
      match = url.match(youtubeEmbed);
      if (match) {
        return { valid: true, embedUrl: url, provider: 'youtube' };
      }
      
      // Vimeo patterns
      const vimeoWatch = /vimeo\.com\/(\d+)/;
      const vimeoEmbed = /player\.vimeo\.com\/video\/(\d+)/;
      
      match = url.match(vimeoWatch);
      if (match) {
        return {
          valid: true,
          embedUrl: `https://player.vimeo.com/video/${match[1]}`,
          provider: 'vimeo',
        };
      }
      
      match = url.match(vimeoEmbed);
      if (match) {
        return { valid: true, embedUrl: url, provider: 'vimeo' };
      }
      
      return { valid: false, embedUrl: null, provider: null };
    }),
}),
```

---

## Card Reordering

### Problem
Direct order updates can cause conflicts.

### Solution: Two-Step Update

```typescript
export async function reorderCards(companyId: string, cardIds: number[]) {
  const db = await getDb();
  
  // Update in order (no transaction needed without unique constraint)
  for (let i = 0; i < cardIds.length; i++) {
    await db.update(onboardingCards)
      .set({ order: i, updatedAt: new Date() })
      .where(and(
        eq(onboardingCards.id, cardIds[i]),
        eq(onboardingCards.companyId, companyId)
      ));
  }
}
```

---

## Company ID Context

### Development
```sql
-- Manually set for testing
UPDATE users SET "companyId" = 'comp_test123' WHERE id = 1;
```

### Production
```typescript
// From Whop OAuth callback
app.post('/auth/callback', async (req, res) => {
  const { userId, companyId } = await validateWhopToken(req.body.token);
  
  await db.update(users)
    .set({ companyId })
    .where(eq(users.id, userId));
});
```

### Using in Queries
```typescript
export async function getCards(companyId: string) {
  const db = await getDb();
  return db.select()
    .from(onboardingCards)
    .where(eq(onboardingCards.companyId, companyId))
    .orderBy(asc(onboardingCards.order));
}
```

---

## tRPC API Structure

### Cards Router

```typescript
cards: router({
  // List all cards for user's company
  list: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.user?.companyId) throw new TRPCError({ code: 'UNAUTHORIZED' });
    return getCards(ctx.user.companyId);
  }),
  
  // Create card (admin only)
  create: adminProcedure
    .input(z.object({
      type: z.enum(['text', 'image', 'video']),
      title: z.string().optional(),
      content: z.string().optional(),
      mediaUrl: z.string().optional(),
      mediaMimeType: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const result = await createCard({
        ...input,
        companyId: ctx.user.companyId,
        createdBy: ctx.user.id,
      });
      return { id: result.id };
    }),
  
  // Update card (admin only)
  update: adminProcedure
    .input(z.object({
      id: z.number(),
      title: z.string().optional(),
      content: z.string().optional(),
      mediaUrl: z.string().optional(),
      mediaMimeType: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      await updateCard(id, ctx.user.companyId, data);
      return { success: true };
    }),
  
  // Delete card (admin only)
  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await deleteCard(input.id, ctx.user.companyId);
      return { success: true };
    }),
  
  // Reorder cards (admin only)
  reorder: adminProcedure
    .input(z.object({ cardIds: z.array(z.number()) }))
    .mutation(async ({ ctx, input }) => {
      await reorderCards(ctx.user.companyId, input.cardIds);
      return { success: true };
    }),
}),
```

---

## Security

### Access Control
- All admin procedures check `ctx.user.role === 'admin'`
- All queries filter by `ctx.user.companyId`
- Verify card ownership before updates/deletes

### Input Validation
```typescript
// Always validate on server
.input(z.object({
  title: z.string().max(255).optional(),
  content: z.string().max(10000).optional(),
  mediaUrl: z.string().url().max(512).optional(),
}))
```

### Supabase RLS
```sql
-- Enable Row Level Security
ALTER TABLE onboarding_cards ENABLE ROW LEVEL SECURITY;

-- Users can read their company's cards
CREATE POLICY "view_own_company_cards"
ON onboarding_cards FOR SELECT
USING (
  "companyId" = (
    SELECT "companyId" FROM users WHERE id = auth.uid()
  )
);

-- Admins can manage cards
CREATE POLICY "admins_manage_cards"
ON onboarding_cards FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid() AND role = 'admin'
  )
);
```

---

## Testing Checklist

- [ ] Create text card
- [ ] Create image card with upload
- [ ] Create video card with upload
- [ ] Create video card with YouTube embed
- [ ] Create video card with Vimeo embed
- [ ] Edit all card types
- [ ] Delete cards
- [ ] Reorder via drag-and-drop
- [ ] Test on mobile (swipe gestures)
- [ ] Test keyboard navigation
- [ ] Verify admin access control
- [ ] Verify companyId filtering

---

## Deployment

### Environment Variables (Production)
```env
DATABASE_URL="postgresql://..."
SUPABASE_URL="https://[PROJECT].supabase.co"
SUPABASE_ANON_KEY="..."
SUPABASE_SERVICE_KEY="..."
JWT_SECRET="..."
VITE_APP_ID="..."
```

### Pre-Deploy Checklist
- [ ] Run `pnpm build` successfully
- [ ] Test production build locally (`pnpm preview`)
- [ ] Set all environment variables
- [ ] Enable RLS policies in Supabase
- [ ] Configure storage bucket policies
- [ ] Set up at least one admin user
- [ ] Test OAuth flow in production

---

## PostgreSQL-Specific Notes

### Differences from MySQL

1. **Serial vs Auto Increment**
   ```typescript
   // PostgreSQL
   id: serial("id").primaryKey()
   
   // MySQL (old)
   id: int("id").autoincrement().primaryKey()
   ```

2. **Text vs VARCHAR**
   ```typescript
   // PostgreSQL - text() is preferred
   companyId: text("companyId")
   
   // MySQL (old)
   companyId: varchar("companyId", { length: 64 })
   ```

3. **Column Names**
   - PostgreSQL is case-sensitive in SQL
   - Use quotes: `SELECT "companyId" FROM users`
   - Drizzle handles this automatically

4. **Enum Syntax**
   ```typescript
   // PostgreSQL
   role: text("role", { enum: ["user", "admin"] })
   
   // MySQL (old)
   role: mysqlEnum("role", ["user", "admin"])
   ```

---

## Performance Tips

- Use `.select()` to limit columns
- Add indexes on frequently queried columns
- Enable connection pooling (Supabase Transaction mode)
- Lazy load images: `<img loading="lazy" />`
- Use Swiper's virtual slides for 50+ cards

---

**Ready to build!** Follow `COMPASS_TODO.md` step by step.
