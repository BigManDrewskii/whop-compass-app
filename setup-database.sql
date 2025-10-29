-- Compass Onboarding - Database Setup Script
-- Run this in your Supabase SQL Editor to initialize the database

-- ============================================
-- STEP 1: Create onboarding_cards table
-- ============================================

CREATE TABLE IF NOT EXISTS onboarding_cards (
  id SERIAL PRIMARY KEY,
  "companyId" TEXT NOT NULL,
  "order" INTEGER NOT NULL DEFAULT 0,
  type TEXT NOT NULL CHECK (type IN ('text', 'image', 'video')),
  title TEXT,
  content TEXT,
  "mediaUrl" TEXT,
  "mediaMimeType" TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  created_by INTEGER
);

-- ============================================
-- STEP 2: Create index for fast queries
-- ============================================

CREATE INDEX IF NOT EXISTS idx_company_order
ON onboarding_cards ("companyId", "order");

-- ============================================
-- STEP 3: Create sample cards (optional)
-- ============================================

-- Replace 'biz_5I0ycVO1857oWD' with your actual company ID from .env
-- You can skip this if you want to create cards through the UI

INSERT INTO onboarding_cards ("companyId", "order", type, title, content, created_at, updated_at)
VALUES
  ('biz_5I0ycVO1857oWD', 0, 'text', 'Welcome to Our Community! 🎉', 'We''re excited to have you here. This is a quick tour to help you get started and make the most of your membership.', NOW(), NOW()),
  ('biz_5I0ycVO1857oWD', 1, 'text', 'What You''ll Get', E'✓ Exclusive content and resources\n✓ Direct access to our team\n✓ A supportive community\n✓ Regular updates and new features', NOW(), NOW()),
  ('biz_5I0ycVO1857oWD', 2, 'text', 'Ready to Dive In?', 'Head to the dashboard to explore everything we have to offer. If you need help, just reach out!', NOW(), NOW())
ON CONFLICT DO NOTHING;

-- ============================================
-- STEP 4: Verify installation
-- ============================================

-- Check that the table was created
SELECT
  table_name,
  column_name,
  data_type
FROM information_schema.columns
WHERE table_name = 'onboarding_cards'
ORDER BY ordinal_position;

-- Check sample cards (if you inserted them)
SELECT
  id,
  "companyId",
  "order",
  type,
  title,
  created_at
FROM onboarding_cards
ORDER BY "order";

-- ============================================
-- SUCCESS!
-- ============================================

-- Your database is now ready for Compass!
-- Next steps:
-- 1. Start your dev server: npm run dev
-- 2. Open http://localhost:3000/experiences/YOUR_EXPERIENCE_ID/admin
-- 3. Create and manage your onboarding cards
-- 4. Preview the user experience at /onboarding
