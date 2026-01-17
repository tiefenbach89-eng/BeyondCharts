-- =====================================================
-- DEBUG ADMIN ACCESS
-- =====================================================
-- Run this to check why admin access is not working

-- 1. Check if your user exists in auth.users
SELECT
  id,
  email,
  created_at,
  last_sign_in_at
FROM auth.users
WHERE email = 'tiefenbach89@gmail.com';

-- 2. Check if your user exists in profiles
SELECT
  id,
  email,
  role,
  created_at
FROM profiles
WHERE email = 'tiefenbach89@gmail.com';

-- 3. Check all RLS policies on profiles table
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'profiles';

-- 4. Test if RLS is blocking access (run as service_role)
-- This disables RLS temporarily to see if data exists
SET ROLE service_role;
SELECT * FROM profiles;
RESET ROLE;

-- 5. Check if user can read their own profile
-- Replace the UUID with your user ID from step 1
-- SELECT * FROM profiles WHERE id = 'YOUR-USER-ID-HERE';
