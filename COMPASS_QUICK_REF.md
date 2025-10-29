# Compass Quick Reference

**Cheat sheet for building Compass with Supabase/PostgreSQL**

---

## 📦 Common Commands

```bash
# Development
pnpm dev                 # Start dev server
pnpm build               # Build for production
pnpm preview             # Preview production build

# Database (Supabase)
pnpm db:push             # Push schema to Supabase
pnpm db:studio           # Open Drizzle Studio
pnpm db:generate         # Generate migrations

# Code Quality
pnpm lint                # Run ESLint
pnpm type-check          # TypeScript check
```

---

## 🗄️ PostgreSQL Schema Patterns

### Basic Table
```typescript
import { pgTable, serial, text, integer, timestamp, index } from 'drizzle-orm/pg-core';

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
}));
```

### Query Examples
```typescript
// Get all cards
const cards = await db.select()
  .from(onboardingCards)
  .where(eq(onboardingCards.companyId, companyId))
  .orderBy(asc(onboardingCards.order));

// Get single card
const card = await db.select()
  .from(onboardingCards)
  .where(eq(onboardingCards.id, cardId))
  .limit(1);

// Insert card
const result = await db.insert(onboardingCards)
  .values({
    companyId: 'comp_123',
    type: 'text',
    title: 'Welcome',
    order: 0,
    createdBy: userId,
  })
  .returning(); // PostgreSQL supports RETURNING

// Update card
await db.update(onboardingCards)
  .set({ title: 'New Title', updatedAt: new Date() })
  .where(eq(onboardingCards.id, cardId));

// Delete card
await db.delete(onboardingCards)
  .where(eq(onboardingCards.id, cardId));
```

---

## 🌐 tRPC Patterns

### Define Procedures
```typescript
cards: router({
  list: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.user?.companyId) throw new TRPCError({ code: 'UNAUTHORIZED' });
    return getCards(ctx.user.companyId);
  }),
  
  create: adminProcedure
    .input(z.object({
      type: z.enum(['text', 'image', 'video']),
      title: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      return createCard({ ...input, companyId: ctx.user.companyId });
    }),
}),
```

### Use in Client
```typescript
// Query
const { data: cards, isLoading } = trpc.cards.list.useQuery();

// Mutation
const createMutation = trpc.cards.create.useMutation({
  onSuccess: () => {
    toast.success('Card created!');
    trpc.useUtils().cards.list.invalidate();
  },
});

await createMutation.mutateAsync({ type: 'text', title: 'Hello' });
```

---

## ☁️ Supabase Storage

### Setup Client
```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY! // Use service key on server
);
```

### Upload File
```typescript
const filename = `${Date.now()}-${file.name}`;
const { data, error } = await supabase.storage
  .from('compass-media')
  .upload(filename, buffer, {
    contentType: mimeType,
    upsert: false,
  });

if (error) throw error;

// Get public URL
const { data: { publicUrl } } = supabase.storage
  .from('compass-media')
  .getPublicUrl(data.path);
```

### Delete File
```typescript
const { error } = await supabase.storage
  .from('compass-media')
  .remove(['path/to/file.jpg']);
```

---

## ⚛️ React Patterns

### Component with tRPC
```typescript
export default function CardList() {
  const { data: cards, isLoading } = trpc.cards.list.useQuery();
  const deleteMutation = trpc.cards.delete.useMutation();
  
  if (isLoading) return <Skeleton />;
  if (!cards?.length) return <EmptyState />;
  
  return (
    <div>
      {cards.map(card => (
        <CardItem
          key={card.id}
          card={card}
          onDelete={() => deleteMutation.mutate({ id: card.id })}
        />
      ))}
    </div>
  );
}
```

---

## 🎯 Drag & Drop (@hello-pangea/dnd)

```typescript
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

export default function CardList({ cards }) {
  const reorderMutation = trpc.cards.reorder.useMutation();
  
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    
    const items = Array.from(cards);
    const [reordered] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reordered);
    
    const cardIds = items.map(item => item.id);
    reorderMutation.mutate({ cardIds });
  };
  
  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="cards">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {cards.map((card, index) => (
              <Draggable key={card.id} draggableId={String(card.id)} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    {card.title}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
```

---

## 🎠 Swiper Carousel

```typescript
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Keyboard } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function Carousel({ cards }) {
  return (
    <Swiper
      modules={[Navigation, Pagination, Keyboard]}
      navigation
      pagination={{ clickable: true }}
      keyboard={{ enabled: true }}
      spaceBetween={50}
      slidesPerView={1}
    >
      {cards.map((card) => (
        <SwiperSlide key={card.id}>
          <div className="p-8">
            <h2>{card.title}</h2>
            {card.type === 'text' && <p>{card.content}</p>}
            {card.type === 'image' && <img src={card.mediaUrl} alt={card.title} />}
            {card.type === 'video' && renderVideo(card)}
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

function renderVideo(card) {
  if (card.mediaUrl) {
    return <video src={card.mediaUrl} controls />;
  } else if (card.content) {
    return <iframe src={card.content} className="w-full aspect-video" />;
  }
  return null;
}
```

---

## 📁 File Upload (react-dropzone)

```typescript
import { useDropzone } from 'react-dropzone';

export default function FileUploader({ onUpload }) {
  const uploadMutation = trpc.media.upload.useMutation();
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.gif'],
      'video/*': ['.mp4', '.mov'],
    },
    maxSize: 100 * 1024 * 1024, // 100MB
    onDrop: async (files) => {
      const file = files[0];
      const buffer = await file.arrayBuffer();
      
      const result = await uploadMutation.mutateAsync({
        file: Buffer.from(buffer),
        filename: file.name,
        mimeType: file.type,
      });
      
      onUpload(result.url);
    },
  });
  
  return (
    <div {...getRootProps()} className={`border-2 border-dashed rounded-lg p-8 ${isDragActive ? 'border-primary' : 'border-gray-300'}`}>
      <input {...getInputProps()} />
      <p>Drag & drop a file, or click to select</p>
    </div>
  );
}
```

---

## 🎥 Video Embed Validation

```typescript
function validateYouTubeUrl(url: string) {
  const patterns = [
    /youtube\.com\/watch\?v=([^&]+)/,
    /youtu\.be\/([^?]+)/,
    /youtube\.com\/embed\/([^?]+)/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }
  }
  
  return null;
}

function validateVimeoUrl(url: string) {
  const patterns = [
    /vimeo\.com\/(\d+)/,
    /player\.vimeo\.com\/video\/(\d+)/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return `https://player.vimeo.com/video/${match[1]}`;
    }
  }
  
  return null;
}
```

---

## 🔒 PostgreSQL + Supabase RLS

```sql
-- Enable RLS
ALTER TABLE onboarding_cards ENABLE ROW LEVEL SECURITY;

-- Users can view their company's cards
CREATE POLICY "view_company_cards"
ON onboarding_cards FOR SELECT
USING ("companyId" = (SELECT "companyId" FROM users WHERE id = auth.uid()));

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

## 🐛 Common Errors & Solutions

### "column does not exist"
```sql
-- PostgreSQL is case-sensitive
-- Wrong:
SELECT companyId FROM users;

-- Correct:
SELECT "companyId" FROM users;
```

### "dialect is not a function"
```typescript
// Wrong:
import { defineConfig } from 'drizzle-kit';
export default defineConfig({ dialect: 'mysql' });

// Correct:
import { defineConfig } from 'drizzle-kit';
export default defineConfig({ dialect: 'postgresql' });
```

### "Cannot find module @supabase/supabase-js"
```bash
pnpm add @supabase/supabase-js
```

### Upload fails silently
```typescript
// Check Supabase Storage policies
// Check bucket is public
// Verify SUPABASE_SERVICE_KEY is set
```

---

## 💡 Pro Tips

1. **Use `returning()`**: PostgreSQL supports RETURNING clause
   ```typescript
   const [card] = await db.insert(onboardingCards)
     .values({ ... })
     .returning();
   ```

2. **Case-sensitive columns**: Always use quotes in raw SQL
   ```sql
   UPDATE users SET "companyId" = 'comp_123';
   ```

3. **Supabase pooler**: Use Transaction mode for Drizzle
   ```
   postgresql://postgres:pw@xxx.pooler.supabase.com:6543/postgres?pgbouncer=true
   ```

4. **Storage policies**: Set up before uploading
   ```sql
   CREATE POLICY "public_read" ON storage.objects FOR SELECT TO public USING (bucket_id = 'compass-media');
   ```

5. **Test locally**: Use `pnpm db:studio` to verify data

---

**Keep this open while coding!** 🚀
