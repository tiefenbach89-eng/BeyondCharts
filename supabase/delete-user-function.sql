-- =====================================================
-- DELETE USER FUNCTION
-- =====================================================
-- This function allows users to delete their own account
-- Run this in your Supabase SQL editor to enable account deletion

-- Create function to delete user
CREATE OR REPLACE FUNCTION delete_user()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_id UUID;
BEGIN
  -- Get the current user's ID
  user_id := auth.uid();

  -- Check if user is authenticated
  IF user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Delete user profile (cascades will handle related data)
  DELETE FROM profiles WHERE id = user_id;

  -- Delete user from auth.users
  DELETE FROM auth.users WHERE id = user_id;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION delete_user() TO authenticated;

-- Verify function was created
SELECT proname, proargtypes::regtype[], prosrc
FROM pg_proc
WHERE proname = 'delete_user';
