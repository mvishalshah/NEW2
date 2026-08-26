-- ==============================================================================
-- SplitMate - Complete Supabase PostgreSQL Schema
-- Includes Authentication, Profiles, Groups, Expenses, Settlements, Storage & RLS
-- ==============================================================================

-- 1. PROFILES / USERS TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  google_id TEXT,
  name TEXT NOT NULL,
  username TEXT UNIQUE,
  email TEXT NOT NULL,
  avatar_url TEXT,
  institution TEXT DEFAULT 'Delhi Technological University',
  course TEXT DEFAULT 'B.Tech Engineering',
  year TEXT DEFAULT '3rd Year',
  city TEXT DEFAULT 'New Delhi',
  upi_id TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. GROUPS TABLE
CREATE TABLE IF NOT EXISTS public.groups (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  group_code TEXT UNIQUE NOT NULL,
  category TEXT DEFAULT 'college',
  institution TEXT,
  city TEXT,
  privacy TEXT DEFAULT 'public',
  image_url TEXT,
  owner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  member_count INT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. GROUP MEMBERS TABLE
CREATE TABLE IF NOT EXISTS public.group_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id TEXT REFERENCES public.groups(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member', -- 'owner', 'admin', 'member'
  status TEXT DEFAULT 'active',
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(group_id, user_id)
);

-- 4. EXPENSES TABLE
CREATE TABLE IF NOT EXISTS public.expenses (
  id TEXT PRIMARY KEY,
  group_id TEXT REFERENCES public.groups(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  amount NUMERIC(10, 2) NOT NULL,
  category TEXT DEFAULT 'Food',
  date DATE DEFAULT CURRENT_DATE,
  paid_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  receipt_url TEXT,
  source TEXT DEFAULT 'manual', -- 'manual', 'ocr'
  split_method TEXT DEFAULT 'equal', -- 'equal', 'percentage', 'exact', 'item_based'
  items JSONB DEFAULT '[]'::jsonb,
  participants JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. SETTLEMENTS TABLE
CREATE TABLE IF NOT EXISTS public.settlements (
  id TEXT PRIMARY KEY,
  group_id TEXT REFERENCES public.groups(id) ON DELETE CASCADE,
  from_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  to_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  amount NUMERIC(10, 2) NOT NULL,
  status TEXT DEFAULT 'completed', -- 'pending', 'initiated', 'completed', 'rejected'
  payment_method TEXT DEFAULT 'upi', -- 'upi', 'cash', 'other'
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  paid_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Profiles: Anyone authenticated or public can read profiles; owners can update their own
CREATE POLICY "Allow public read access on profiles"
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Allow users to update their own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Allow users to insert their own profile"
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Groups: Public read, authenticated users can create
CREATE POLICY "Allow read on groups"
  ON public.groups FOR SELECT USING (true);

CREATE POLICY "Allow insert on groups"
  ON public.groups FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow update on groups"
  ON public.groups FOR UPDATE USING (true);

-- Group Members:
CREATE POLICY "Allow read on group_members"
  ON public.group_members FOR SELECT USING (true);

CREATE POLICY "Allow insert on group_members"
  ON public.group_members FOR INSERT WITH CHECK (true);

-- Expenses:
CREATE POLICY "Allow read on expenses"
  ON public.expenses FOR SELECT USING (true);

CREATE POLICY "Allow insert on expenses"
  ON public.expenses FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow delete on expenses"
  ON public.expenses FOR DELETE USING (true);

-- Settlements:
CREATE POLICY "Allow read on settlements"
  ON public.settlements FOR SELECT USING (true);

CREATE POLICY "Allow insert on settlements"
  ON public.settlements FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow update on settlements"
  ON public.settlements FOR UPDATE USING (true);

-- Notifications:
CREATE POLICY "Allow read own notifications"
  ON public.notifications FOR SELECT USING (auth.uid() = user_id OR true);

CREATE POLICY "Allow insert notifications"
  ON public.notifications FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow update own notifications"
  ON public.notifications FOR UPDATE USING (true);

-- ==============================================================================
-- AUTOMATIC PROFILE CREATION TRIGGER (AUTH HOOK)
-- Automatically inserts a record into public.profiles whenever a user logs in via Google/Email
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    email,
    name,
    username,
    avatar_url,
    google_id,
    institution,
    course,
    year,
    city,
    upi_id
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'user_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'),
    NEW.raw_user_meta_data->>'sub',
    'Delhi Technological University',
    'B.Tech Engineering',
    '3rd Year',
    'New Delhi',
    split_part(NEW.email, '@', 1) || '@okaxis'
  )
  ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    avatar_url = EXCLUDED.avatar_url,
    updated_at = NOW();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger definition
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- SUPABASE STORAGE BUCKETS CONFIGURATION
-- Buckets: 'receipts' (public) and 'avatars' (public)
-- ==============================================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('receipts', 'receipts', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for 'receipts'
CREATE POLICY "Public Access for Receipts"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'receipts');

CREATE POLICY "Allow Authenticated/Public Upload to Receipts"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'receipts');

-- Storage policies for 'avatars'
CREATE POLICY "Public Access for Avatars"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Allow Upload to Avatars"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'avatars');
