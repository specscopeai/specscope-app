-- ==============================================================================
-- SPECSCOPE AI: Complete Production Supabase Database Schema & RLS Setup
-- Copy and paste this script into your Supabase Project SQL Editor (oeroflnhlhrstbzgsbez)
-- ==============================================================================

-- 1. Create Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    company_name TEXT,
    trade_type TEXT,
    subscription_tier TEXT DEFAULT 'free',
    scans_remaining INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Team Seats Table
CREATE TABLE IF NOT EXISTS public.team_seats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    member_email TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_owner_member UNIQUE (owner_id, member_email)
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_seats ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies for Profiles
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

DROP POLICY IF EXISTS "Service role bypass profiles" ON public.profiles;
CREATE POLICY "Service role bypass profiles" 
ON public.profiles FOR ALL 
USING (true);

-- 5. RLS Policies for Team Seats
DROP POLICY IF EXISTS "Owners can view own team seats" ON public.team_seats;
CREATE POLICY "Owners can view own team seats" 
ON public.team_seats FOR SELECT 
USING (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Owners can insert team seats" ON public.team_seats;
CREATE POLICY "Owners can insert team seats" 
ON public.team_seats FOR INSERT 
WITH CHECK (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Owners can delete team seats" ON public.team_seats;
CREATE POLICY "Owners can delete team seats" 
ON public.team_seats FOR DELETE 
USING (auth.uid() = owner_id);

-- 6. Trigger Function to Automatically Create Profile on User Signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, subscription_tier, scans_remaining)
  VALUES (new.id, new.email, 'free', 1)
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Bind Trigger to Auth.Users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ==============================================================================
-- Schema Setup Completed!
-- ==============================================================================
