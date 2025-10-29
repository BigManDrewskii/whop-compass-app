# Compass - Quick Start Guide 🧭

A card-based onboarding system for Whop communities.

## 📋 Prerequisites

- Supabase account with project created
- Whop app configured
- Node.js 18+ installed

## 🚀 Setup (2 minutes)

### 1. Database Setup

Go to your Supabase project → SQL Editor and run the contents of `setup-database.sql`:

```sql
-- Copy and paste the entire setup-database.sql file
```

This will create:
- `onboarding_cards` table
- Required indexes
- Sample cards (optional)

### 2. Start Development Server

```bash
npm run dev
```

The server will start with:
- **Whop Proxy**: `http://localhost:3000` (for iframe testing)
- **Direct Access**: `http://localhost:51446` (bypass proxy)

### 3. Access the Admin Dashboard

Open in your browser:
```
http://localhost:3000/experiences/YOUR_EXPERIENCE_ID/admin
```

**Important**: When accessing through Whop's iframe, you'll be automatically authenticated. The app uses Whop's context to:
- Detect if you're an admin (shows admin dashboard)
- Identify your company (loads correct cards)
- Track user identity (for analytics later)

### 4. Create Your First Card

1. Click "Add Card"
2. Select card type (Text, Image, or Video)
3. Click "Edit" to customize content
4. Drag to reorder cards

### 5. Preview Onboarding Experience

```
http://localhost:3000/experiences/YOUR_EXPERIENCE_ID/onboarding
```

## 📱 Accessing Through Whop

### Method 1: Developer Dashboard (Recommended)

1. Go to https://whop.com/apps
2. Find your app (`app_2jRgdQJDFSJPxj`)
3. Click "Preview" or "Test Installation"
4. Navigate to `/admin` for admin view
5. Navigate to `/onboarding` for user view

### Method 2: Direct Company Installation

1. Install your app on your company
2. Visit your company hub
3. Click on your Compass app
4. You'll see either:
   - **Admin view** (`/admin`) - if you're a company admin
   - **Onboarding view** (`/onboarding`) - if you're a member

## 🎨 Card Types

### Text Cards
- Title + content text
- Great for welcome messages, instructions
- Supports multi-line content

### Image Cards
- Title + image URL
- Live preview in editor
- Supports JPG, PNG, GIF, WebP

### Video Cards
- Title + video URL
- Supports:
  - YouTube (`https://youtube.com/watch?v=...`)
  - Vimeo (`https://vimeo.com/...`)
  - Direct video URLs (`.mp4`, `.webm`)
- Auto-converts to embeds

## 🔧 How It Works

### Authentication
- Uses Whop's iframe SDK (`useWhop()` context)
- No manual auth required
- Access level automatically detected

### Data Flow
```
1. User opens app → WhopProvider loads user/company data
2. Admin dashboard checks: access.accessLevel === 'admin'
3. API routes use: env.NEXT_PUBLIC_WHOP_COMPANY_ID
4. Cards filtered by company automatically
```

### File Structure
```
src/
├── app/
│   ├── experiences/[experienceId]/
│   │   ├── admin/page.tsx          # Admin dashboard
│   │   ├── onboarding/page.tsx     # User carousel
│   │   └── layout.tsx              # Whop context wrapper
│   └── (whop-api)/api/cards/       # API routes
├── components/
│   └── compass/
│       ├── CardEditor.tsx          # Edit modal
│       └── OnboardingCarousel.tsx  # Swipeable carousel
└── db/
    ├── schema.ts                   # Database schema
    └── index.ts                    # CRUD operations
```

## 🐛 Troubleshooting

### "Company not configured" error
- Check `.env` has `NEXT_PUBLIC_WHOP_COMPANY_ID=biz_...`
- Restart dev server after changing `.env`

### Database connection errors
- Verify `DATABASE_URL` in `.env`
- Check Supabase project is active
- Run `setup-database.sql` again

### Cards not showing
- Check database has cards: `SELECT * FROM onboarding_cards;`
- Verify `companyId` matches your `.env`
- Open browser console for API errors

### Access denied on admin page
- Make sure you're accessing through Whop iframe
- Check that you're a company admin
- Try: https://whop.com/apps → Preview

## 📚 Next Steps

### Add More Features
- [ ] Image upload (replace URL input with file upload)
- [ ] Analytics (track card views, completion rate)
- [ ] Card templates (pre-made card designs)
- [ ] Multi-language support
- [ ] Custom branding per company

### Deploy to Production
1. Push to GitHub
2. Connect to Vercel/Railway
3. Add production env vars
4. Submit app for Whop review
5. Publish to Whop App Store

## 🔗 Resources

- **Whop Docs**: https://docs.whop.com/
- **Whop API**: https://docs.whop.com/api-reference/
- **Supabase**: https://supabase.com/docs
- **Next.js**: https://nextjs.org/docs

## 💡 Tips

1. **Test in iframe**: Always test through Whop's iframe (`http://localhost:3000`)
2. **Use dark theme**: Compass uses dark theme to match Whop's design
3. **Keep cards concise**: Users swipe through quickly
4. **Add variety**: Mix text, images, and videos
5. **Order matters**: Put most important info first

---

**Need help?** Check `COMPASS_COMPLETE.md` for full documentation.

**Ready to go live?** See deployment checklist in `COMPASS_COMPLETE.md`.
