-- Set your account as admin
-- Replace 'your-email@example.com' with your actual email address

UPDATE profiles
SET role = 'admin'
WHERE email = (
  SELECT email
  FROM auth.users
  WHERE email = 'your-email@example.com'
  LIMIT 1
);

-- Verify the change
SELECT id, email, role, created_at
FROM profiles
WHERE role = 'admin';
