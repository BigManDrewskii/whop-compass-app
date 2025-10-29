# Vercel Blob Setup Guide

## Why You Need This

The Compass app uses **Vercel Blob** for image uploads in the card editor. Without proper configuration, you'll see:
- ❌ "Upload failed. Please try again." error when dragging images
- ❌ File upload feature won't work

## Quick Setup (2 minutes)

### Step 1: Get Your Blob Token

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project (or create one)
3. Navigate to **Storage** → **Blob**
4. Click **"Create Database"** (if you haven't already)
5. Click **"Connect"** or **"Get Token"**
6. Copy the `BLOB_READ_WRITE_TOKEN`

### Step 2: Add to Local Environment

Add this line to your `.env` file:

```bash
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxxxxxxxxxxxxxxxxxxx
```

**⚠️ Important:**
- The `.env` file is already in `.gitignore` (won't be committed)
- Never commit your token to GitHub
- Each developer needs their own token for local development

### Step 3: Restart Dev Server

```bash
npm run dev
```

That's it! File uploads will now work.

---

## Testing Image Upload

1. Go to Admin Dashboard (`/experiences/[experienceId]/admin`)
2. Click **"Add Card"**
3. In the Banner section, **drag an image file** from your desktop
4. You should see:
   - Upload progress bar (0-100%)
   - Image preview after upload
   - CDN URL automatically filled in

---

## Production Deployment

When you deploy to Vercel:

1. **Vercel automatically provides the token** - no manual setup needed!
2. The token is injected as an environment variable
3. File uploads will work immediately in production

---

## Alternative: Use URL Paste (No Token Needed)

If you don't want to set up Vercel Blob for local development:

1. Upload images to any image host (Imgur, Cloudinary, etc.)
2. Copy the image URL
3. Paste it in the "or paste URL" field below the dropzone
4. Images will work fine (no upload, just URL embedding)

---

## Supported Video Platforms (No Token Needed)

Videos don't use Vercel Blob - they're embedded from external platforms:

- ✅ **YouTube**: `https://youtube.com/watch?v=...` or `youtu.be/...`
- ✅ **Vimeo**: `https://vimeo.com/123456`
- ✅ **Loom**: `https://loom.com/share/...`
- ✅ **Direct videos**: `.mp4`, `.webm`, `.ogg`, `.mov` files

Just paste the URL - no upload needed!

---

## Troubleshooting

### Upload still failing after adding token?

1. **Check your token format:**
   ```
   BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxxxxxxxxxxxxxxxxxxx
   ```
   Should start with `vercel_blob_rw_`

2. **Restart dev server:**
   ```bash
   # Kill the current server (Ctrl+C)
   npm run dev
   ```

3. **Check .env file location:**
   - Must be in project root: `/Users/drewskii/Downloads/compass/.env`
   - NOT in `src/` folder

4. **Verify token is valid:**
   - Go back to Vercel dashboard
   - Regenerate token if needed
   - Copy fresh token to `.env`

### File too large error?

Max file size is **10MB**. To upload larger images:
- Compress the image first
- Or paste a URL instead of uploading

---

## Summary

**For local development:**
- Add `BLOB_READ_WRITE_TOKEN` to `.env` file
- Restart dev server
- File uploads will work

**For production (Vercel):**
- Token is automatically provided
- No setup needed!

**Alternative:**
- Skip file upload, use URL paste
- Works without any token
