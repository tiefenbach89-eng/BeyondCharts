-- =====================================================
-- BEYONDCHARTS SUPABASE SETUP
-- =====================================================
-- Run this script in Supabase SQL Editor to set up the database

-- =====================================================
-- 1. CREATE PROFILES TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies for profiles table
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =====================================================
-- 2. CREATE TRIGGER TO AUTO-CREATE PROFILE ON SIGNUP
-- =====================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (
    NEW.id,
    NEW.email,
    'user' -- Default role is 'user'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- 3. MIGRATE EXISTING USERS TO PROFILES TABLE
-- =====================================================

-- Insert existing users into profiles table (if they don't exist)
INSERT INTO profiles (id, email, role)
SELECT
  id,
  email,
  'user' as role
FROM auth.users
WHERE id NOT IN (SELECT id FROM profiles)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 4. SET YOUR ACCOUNT AS ADMIN
-- =====================================================

-- Replace 'your-email@example.com' with your actual email
-- Uncomment the line below and run it after replacing the email

-- UPDATE profiles SET role = 'admin' WHERE email = 'your-email@example.com';

-- =====================================================
-- 5. VERIFY SETUP
-- =====================================================

-- Check all profiles
SELECT id, email, role, created_at FROM profiles ORDER BY created_at DESC;

-- Check if there are any admins
SELECT email, role FROM profiles WHERE role = 'admin';
