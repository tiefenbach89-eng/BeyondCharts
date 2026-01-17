-- =====================================================
-- SET ADMIN ROLE
-- =====================================================
-- IMPORTANT: Run supabase-setup.sql FIRST if profiles table doesn't exist!
-- Then use this script to set your account as admin

-- Replace 'your-email@example.com' with your actual email address
UPDATE profiles
SET role = 'admin'
WHERE email = 'your-email@example.com';

-- Verify the change
SELECT id, email, role, created_at
FROM profiles
WHERE role = 'admin';
