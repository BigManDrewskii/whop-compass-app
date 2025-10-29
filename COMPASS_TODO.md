# Compass - Implementation Checklist

**Build your onboarding card system step by step**

---

## 🚀 Phase 0: Initial Setup (30 min)

- [ ] **0.1** Clone web-db-user template to `compass` directory
- [ ] **0.2** Run `pnpm install`
- [ ] **0.3** Create `.env` file with Supabase credentials (see COMPASS_SETUP.md)
- [ ] **0.4** Update `drizzle.config.ts` - change dialect to `postgresql`
- [ ] **0.5** Run `pnpm dev` and verify http://localhost:5173 loads
- [ ] **0.6** Log in via OAuth and note your user ID
- [ ] **0.7** Set your user as admin in Supabase dashboard
- [ ] **0.8** Set test companyId: `UPDATE users SET "companyId" = 'comp_test123'`
- [ ] **0.9** Create `compass-media` bucket in Supabase Storage (public)
- [ ] **0.10** Configure storage policies (see COMPASS_SPEC.md)

**✅ Verification**: Dev server runs, you can log in, Supabase connects

---

## 📊 Phase 1: Database Schema (45 min)

### 1.1 Update Users Table
- [ ] **1.1.1** Open `drizzle/schema.ts`
- [ ] **1.1.2** Change imports from `mysql` to `pg` (if needed)
- [ ] **1.1.3** Add `role` field: `text("role", { enum: ["user", "admin"] }).default("user")`
- [ ] **1.1.4** Add `companyId` field: `text("companyId")`

### 1.2 Create Onboarding Cards Table
- [ ] **1.2.1** Add `onboardingCards` table with `pgTable`
- [ ] **1.2.2** Add fields: id (serial), companyId, order, type, title, content, mediaUrl, mediaMimeType
- [ ] **1.2.3** Add timestamps: createdAt, updatedAt
- [ ] **1.2.4** Add createdBy reference to users
- [ ] **1.2.5** Add index on (companyId, order)
- [ ] **1.2.6** **Important**: Do NOT add unique constraint

### 1.3 Apply Schema
- [ ] **1.3.1** Run `pnpm db:push`
- [ ] **1.3.2** Run `pnpm db:studio` to verify tables exist
- [ ] **1.3.3** Check `users` has role and companyId columns
- [ ] **1.3.4** Check `onboarding_cards` table exists with all fields

**✅ Verification**: Tables visible in Drizzle Studio with correct columns

---

## 🔧 Phase 2: Database Helpers (1 hour)

### 2.1 Setup
- [ ] **2.1.1** Open `server/db.ts`
- [ ] **2.1.2** Import `onboardingCards` from schema
- [ ] **2.1.3** Import: `eq`, `and`, `asc`, `desc` from drizzle-orm

### 2.2 Query Functions
- [ ] **2.2.1** Create `getCards(companyId: string)`
  - Select all cards where companyId matches
  - Order by `order` ASC
- [ ] **2.2.2** Create `getCardById(id: number, companyId: string)`
  - Verify companyId matches (security)

### 2.3 Mutation Functions
- [ ] **2.3.1** Create `createCard(data)` 
  - Find max order for companyId
  - Insert with order = max + 1
- [ ] **2.3.2** Create `updateCard(id, companyId, data)`
  - Verify companyId matches
  - Update only provided fields
- [ ] **2.3.3** Create `deleteCard(id, companyId)`
  - Verify companyId matches
- [ ] **2.3.4** Create `reorderCards(companyId, cardIds[])`
  - Loop through and set order = index

### 2.4 Types
- [ ] **2.4.1** Export `InsertCard` type
- [ ] **2.4.2** Export `SelectCard` type

**✅ Verification**: Functions compile without errors

---

## 🌐 Phase 3: tRPC API (1.5 hours)

### 3.1 Admin Middleware
- [ ] **3.1.1** Open `server/routers.ts`
- [ ] **3.1.2** Create `adminProcedure` that checks role === 'admin'

### 3.2 Cards Router
- [ ] **3.2.1** Create `cards` router
- [ ] **3.2.2** Add `cards.list` query (public, filters by companyId)
- [ ] **3.2.3** Add `cards.create` mutation (admin only)
  - Input: type, title?, content?, mediaUrl?, mediaMimeType?
  - Validate type enum
- [ ] **3.2.4** Add `cards.update` mutation (admin only)
  - Input: id, title?, content?, mediaUrl?, mediaMimeType?
  - Verify ownership
- [ ] **3.2.5** Add `cards.delete` mutation (admin only)
  - Input: id
  - Verify ownership
- [ ] **3.2.6** Add `cards.reorder` mutation (admin only)
  - Input: cardIds[]
  - Verify all cards belong to user's company

### 3.3 Test API
- [ ] **3.3.1** Open http://localhost:5173/__trpc
- [ ] **3.3.2** Test `cards.list` - should return empty array
- [ ] **3.3.3** Test `cards.create` - create a test card
- [ ] **3.3.4** Test `cards.list` again - should return 1 card
- [ ] **3.3.5** Test `cards.update`
- [ ] **3.3.6** Test `cards.delete`

**✅ Verification**: All tRPC procedures work in panel

---

## 🎨 Phase 4: Admin Dashboard (3-4 hours)

### 4.1 Dependencies
- [ ] **4.1.1** Run `pnpm add @hello-pangea/dnd`
- [ ] **4.1.2** Run `pnpm add lucide-react`

### 4.2 Base Page
- [ ] **4.2.1** Create `client/src/pages/AdminDashboard.tsx`
- [ ] **4.2.2** Fetch cards: `trpc.cards.list.useQuery()`
- [ ] **4.2.3** Add loading skeleton
- [ ] **4.2.4** Add empty state
- [ ] **4.2.5** Add header with "Add Card" button

### 4.3 Card List with Drag-Drop
- [ ] **4.3.1** Create `client/src/components/CardList.tsx`
- [ ] **4.3.2** Wrap in `<DragDropContext onDragEnd={...}>`
- [ ] **4.3.3** Add `<Droppable droppableId="cards">`
- [ ] **4.3.4** Map cards to `<Draggable>`
- [ ] **4.3.5** Implement reorder handler
  - Update local state optimistically
  - Call `reorderMutation`

### 4.4 Card Item
- [ ] **4.4.1** Create `client/src/components/CardItem.tsx`
- [ ] **4.4.2** Display card type badge
- [ ] **4.4.3** Display title (or "Untitled")
- [ ] **4.4.4** Add drag handle icon
- [ ] **4.4.5** Add Edit button
- [ ] **4.4.6** Add Delete button

### 4.5 Card Editor Modal
- [ ] **4.5.1** Create `client/src/components/CardEditor.tsx`
- [ ] **4.5.2** Use shadcn Dialog
- [ ] **4.5.3** Add type selector (text/image/video)
- [ ] **4.5.4** Add title input
- [ ] **4.5.5** Add content textarea (for text cards)
- [ ] **4.5.6** Add media upload section
- [ ] **4.5.7** Add embed URL input (for videos)
- [ ] **4.5.8** Add validation
- [ ] **4.5.9** Wire to create/update mutations

### 4.6 Delete Confirmation
- [ ] **4.6.1** Add AlertDialog for delete
- [ ] **4.6.2** Show card title in confirmation
- [ ] **4.6.3** Call `deleteMutation` on confirm

### 4.7 Add Route
- [ ] **4.7.1** Open `client/src/App.tsx`
- [ ] **4.7.2** Add route: `/admin/onboarding` → AdminDashboard
- [ ] **4.7.3** Protect route (admin only)

**✅ Verification**: Can create, edit, delete, reorder cards

---

## 📁 Phase 5: Media Upload (1.5 hours)

### 5.1 Supabase Client Setup
- [ ] **5.1.1** Run `pnpm add @supabase/supabase-js`
- [ ] **5.1.2** Create `server/supabase.ts`
- [ ] **5.1.3** Initialize Supabase client with service key

### 5.2 Media Router
- [ ] **5.2.1** Create `media` router in `server/routers.ts`
- [ ] **5.2.2** Add `media.upload` mutation (admin only)
  - Input: file (Buffer), filename, mimeType
  - Validate file type (image/video)
  - Validate size (100MB max)
  - Upload to Supabase Storage
  - Return public URL
- [ ] **5.2.3** Add `media.validateEmbedUrl` query
  - Input: url
  - Check if YouTube or Vimeo
  - Convert to embed format
  - Return embedUrl

### 5.3 Media Uploader Component
- [ ] **5.3.1** Run `pnpm add react-dropzone`
- [ ] **5.3.2** Create `client/src/components/MediaUploader.tsx`
- [ ] **5.3.3** Add drag-drop zone
- [ ] **5.3.4** Add file validation (type, size)
- [ ] **5.3.5** Convert File to Buffer
- [ ] **5.3.6** Call `media.upload` mutation
- [ ] **5.3.7** Show upload progress
- [ ] **5.3.8** Show preview after upload

### 5.4 Integration
- [ ] **5.4.1** Add MediaUploader to CardEditor
- [ ] **5.4.2** Add embed URL validation to CardEditor
- [ ] **5.4.3** Test image upload
- [ ] **5.4.4** Test video upload
- [ ] **5.4.5** Test YouTube URL validation
- [ ] **5.4.6** Test Vimeo URL validation

**✅ Verification**: Can upload images/videos and validate embed URLs

---

## 🎪 Phase 6: User Carousel (3-4 hours)

### 6.1 Dependencies
- [ ] **6.1.1** Run `pnpm add swiper`

### 6.2 Base Page
- [ ] **6.2.1** Create `client/src/pages/Onboarding.tsx`
- [ ] **6.2.2** Fetch cards: `trpc.cards.list.useQuery()`
- [ ] **6.2.3** Add loading state
- [ ] **6.2.4** Add empty state

### 6.3 Carousel Component
- [ ] **6.3.1** Create `client/src/components/OnboardingCarousel.tsx`
- [ ] **6.3.2** Import Swiper + CSS
- [ ] **6.3.3** Configure Swiper:
  - Navigation module
  - Pagination module
  - Keyboard module
- [ ] **6.3.4** Add progress indicator (X of Y)
- [ ] **6.3.5** Add Skip button
- [ ] **6.3.6** Add "Get Started" on last slide

### 6.4 Card Renderers
- [ ] **6.4.1** Create `renderTextCard()` function
  - Show title and content
- [ ] **6.4.2** Create `renderImageCard()` function
  - Show title and image from mediaUrl
  - Add lazy loading
- [ ] **6.4.3** Create `renderVideoCard()` function
  - If mediaUrl: show <video>
  - If content: show <iframe> for embed
  - Add controls

### 6.5 Navigation
- [ ] **6.5.1** Test swipe gestures (mobile)
- [ ] **6.5.2** Test arrow key navigation
- [ ] **6.5.3** Test prev/next buttons
- [ ] **6.5.4** Wire Skip button to home page
- [ ] **6.5.5** Wire "Get Started" to home page

### 6.6 Styling
- [ ] **6.6.1** Make responsive (mobile, tablet, desktop)
- [ ] **6.6.2** Add smooth transitions
- [ ] **6.6.3** Style progress indicator
- [ ] **6.6.4** Add card animations

### 6.7 Add Route
- [ ] **6.7.1** Add route: `/onboarding` → Onboarding
- [ ] **6.7.2** Make accessible to all users

**✅ Verification**: Carousel works on mobile and desktop

---

## 🎨 Phase 7: Polish (2-3 hours)

### 7.1 Loading States
- [ ] **7.1.1** Add skeletons for card list
- [ ] **7.1.2** Add spinners for mutations
- [ ] **7.1.3** Add upload progress indicators

### 7.2 Empty States
- [ ] **7.2.1** Design "No cards" state for admin
- [ ] **7.2.2** Design "No onboarding" state for users
- [ ] **7.2.3** Add helpful messaging and CTAs

### 7.3 Error Handling
- [ ] **7.3.1** Add error boundaries
- [ ] **7.3.2** Show user-friendly error messages
- [ ] **7.3.3** Add retry buttons

### 7.4 Toast Notifications
- [ ] **7.4.1** Success: card created
- [ ] **7.4.2** Success: card updated
- [ ] **7.4.3** Success: card deleted
- [ ] **7.4.4** Error: operation failed
- [ ] **7.4.5** Error: upload failed

### 7.5 Animations
- [ ] **7.5.1** Smooth drag-drop transitions
- [ ] **7.5.2** Button hover effects
- [ ] **7.5.3** Card slide animations
- [ ] **7.5.4** Modal fade-in

### 7.6 Accessibility
- [ ] **7.6.1** Add ARIA labels
- [ ] **7.6.2** Test keyboard navigation
- [ ] **7.6.3** Ensure focus management
- [ ] **7.6.4** Check color contrast

**✅ Verification**: App feels polished and professional

---

## 🧪 Phase 8: Testing (2-3 hours)

### 8.1 Admin Flow
- [ ] **8.1.1** Create text card
- [ ] **8.1.2** Create image card (upload)
- [ ] **8.1.3** Create video card (upload)
- [ ] **8.1.4** Create video card (YouTube)
- [ ] **8.1.5** Create video card (Vimeo)
- [ ] **8.1.6** Edit each card type
- [ ] **8.1.7** Reorder via drag-drop
- [ ] **8.1.8** Delete cards

### 8.2 User Flow
- [ ] **8.2.1** View carousel as user
- [ ] **8.2.2** Swipe through cards (mobile)
- [ ] **8.2.3** Use arrow keys (desktop)
- [ ] **8.2.4** Click prev/next buttons
- [ ] **8.2.5** Click Skip button
- [ ] **8.2.6** Verify all card types render

### 8.3 Edge Cases
- [ ] **8.3.1** Empty card list
- [ ] **8.3.2** File too large (>100MB)
- [ ] **8.3.3** Invalid file type
- [ ] **8.3.4** Invalid YouTube URL
- [ ] **8.3.5** Non-admin tries admin action
- [ ] **8.3.6** Network error handling

### 8.4 Cross-Browser
- [ ] **8.4.1** Chrome (desktop)
- [ ] **8.4.2** Firefox (desktop)
- [ ] **8.4.3** Safari (desktop)
- [ ] **8.4.4** Safari (iOS)
- [ ] **8.4.5** Chrome (Android)

**✅ Verification**: All tests pass, no critical bugs

---

## 🚢 Phase 9: Deployment (1 hour)

### 9.1 Production Config
- [ ] **9.1.1** Set all env vars in hosting platform
- [ ] **9.1.2** Verify Supabase production credentials
- [ ] **9.1.3** Enable RLS policies in Supabase
- [ ] **9.1.4** Configure storage policies

### 9.2 Build & Deploy
- [ ] **9.2.1** Run `pnpm build` locally (verify it works)
- [ ] **9.2.2** Deploy to hosting (Vercel/Railway/etc)
- [ ] **9.2.3** Run migrations: `pnpm db:push`
- [ ] **9.2.4** Create first admin user in production

### 9.3 Verification
- [ ] **9.3.1** Test production URL loads
- [ ] **9.3.2** Test login works
- [ ] **9.3.3** Test creating cards
- [ ] **9.3.4** Test media upload
- [ ] **9.3.5** Test user carousel
- [ ] **9.3.6** Monitor for errors

**✅ Verification**: App works in production

---

## 🎉 Phase 10: Launch

- [ ] **10.1** 🎊 Celebrate! You built Compass!

---

## 📝 Notes

- **Total Time**: 20-25 hours
- **Supabase Free Tier**: 500MB storage, 2GB bandwidth/month
- **PostgreSQL Benefits**: JSON support, better text search, PostGIS
- **Next Steps**: Add analytics, rich text editor, card templates

---

**Current Phase**: Phase 0  
**Next**: Clone template and set up Supabase
