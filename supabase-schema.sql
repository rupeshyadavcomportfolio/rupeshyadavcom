-- ============================================================
-- RUPESH YADAV PORTFOLIO — SUPABASE PRODUCTION DATABASE SCHEMA
-- ============================================================
-- How to apply this schema:
-- 1. Open your Supabase Dashboard: https://supabase.com/dashboard/project/ppxntpqfominmpzmpvup
-- 2. Click on "SQL Editor" in the left sidebar
-- 3. Click "+ New query"
-- 4. Paste this entire code and click "Run" (or Ctrl + Enter)
-- ============================================================

-- 1. PROJECTS TABLE
CREATE TABLE IF NOT EXISTS public.projects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL DEFAULT 'graphic',
  category TEXT DEFAULT 'General',
  subcategory TEXT DEFAULT '',
  client TEXT DEFAULT '',
  year TEXT DEFAULT '2026',
  short_description TEXT DEFAULT '',
  description TEXT DEFAULT '',
  tools JSONB DEFAULT '[]'::jsonb,
  services JSONB DEFAULT '[]'::jsonb,
  tags JSONB DEFAULT '[]'::jsonb,
  featured BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'draft',
  "order" INTEGER DEFAULT 0,
  featured_image TEXT DEFAULT '',
  aspect_ratio TEXT DEFAULT '16:9',
  format_name TEXT DEFAULT '',
  orientation TEXT DEFAULT 'landscape',
  custom_width INTEGER,
  custom_height INTEGER,
  alt_text TEXT DEFAULT '',
  caption TEXT DEFAULT '',
  video_url TEXT DEFAULT '',
  video_type TEXT DEFAULT '',
  duration TEXT DEFAULT '',
  website_url TEXT DEFAULT '',
  design_role TEXT DEFAULT '',
  development_role TEXT DEFAULT '',
  desktop_screenshot TEXT DEFAULT '',
  tablet_screenshot TEXT DEFAULT '',
  mobile_screenshot TEXT DEFAULT '',
  gallery JSONB DEFAULT '[]'::jsonb,
  case_study JSONB DEFAULT '{}'::jsonb,
  seo JSONB DEFAULT '{}'::jsonb,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CLIENTS TABLE
CREATE TABLE IF NOT EXISTS public.clients (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  company TEXT NOT NULL,
  industry TEXT DEFAULT '',
  logo TEXT DEFAULT '',
  website_url TEXT DEFAULT '',
  description TEXT DEFAULT '',
  "order" INTEGER DEFAULT 0,
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.reviews (
  id TEXT PRIMARY KEY,
  client_name TEXT NOT NULL,
  company TEXT DEFAULT '',
  profile_image TEXT DEFAULT '',
  company_logo TEXT DEFAULT '',
  review TEXT NOT NULL,
  rating NUMERIC DEFAULT 5,
  project_name TEXT DEFAULT '',
  featured BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT true,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CONTACT MESSAGES / INQUIRIES TABLE
CREATE TABLE IF NOT EXISTS public.messages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT DEFAULT '',
  company TEXT DEFAULT '',
  service TEXT DEFAULT '',
  message TEXT NOT NULL,
  status TEXT DEFAULT 'unread',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. MEDIA LIBRARY TABLE
CREATE TABLE IF NOT EXISTS public.media (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  type TEXT DEFAULT 'image',
  size TEXT DEFAULT 'Web',
  dimensions TEXT DEFAULT 'Responsive',
  aspect_ratio TEXT DEFAULT '16:9',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. SITE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Allow anon & authenticated users to SELECT, INSERT, UPDATE, DELETE
DROP POLICY IF EXISTS "Public Access Projects" ON public.projects;
CREATE POLICY "Public Access Projects" ON public.projects FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Access Clients" ON public.clients;
CREATE POLICY "Public Access Clients" ON public.clients FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Access Reviews" ON public.reviews;
CREATE POLICY "Public Access Reviews" ON public.reviews FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Access Messages" ON public.messages;
CREATE POLICY "Public Access Messages" ON public.messages FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Access Media" ON public.media;
CREATE POLICY "Public Access Media" ON public.media FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Access Settings" ON public.settings;
CREATE POLICY "Public Access Settings" ON public.settings FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Enable Realtime (optional, for instant UI reflection)
ALTER PUBLICATION supabase_realtime ADD TABLE public.projects, public.clients, public.reviews, public.messages, public.media, public.settings;

-- ============================================================
-- 7. SUPABASE STORAGE BUCKET (Media Assets: Images & Videos)
-- ============================================================
-- Automatically create the 'portfolio-media' storage bucket for persistent file uploads
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'portfolio-media',
  'portfolio-media',
  true,
  52428800, -- 50MB file size limit for photos & high-res videos
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml', 'video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo', 'video/ogg']
)
ON CONFLICT (id) DO UPDATE SET 
  public = true, 
  file_size_limit = 52428800;

-- Storage Policies for 'portfolio-media'
DROP POLICY IF EXISTS "Public Read Media" ON storage.objects;
CREATE POLICY "Public Read Media" ON storage.objects FOR SELECT USING (bucket_id = 'portfolio-media');

DROP POLICY IF EXISTS "Public Upload Media" ON storage.objects;
CREATE POLICY "Public Upload Media" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'portfolio-media');

DROP POLICY IF EXISTS "Public Update Media" ON storage.objects;
CREATE POLICY "Public Update Media" ON storage.objects FOR UPDATE USING (bucket_id = 'portfolio-media');

DROP POLICY IF EXISTS "Public Delete Media" ON storage.objects;
CREATE POLICY "Public Delete Media" ON storage.objects FOR DELETE USING (bucket_id = 'portfolio-media');
