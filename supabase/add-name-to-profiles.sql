-- =====================================================
-- ADD NAME FIELD TO PROFILES TABLE
-- =====================================================
-- Run this in Supabase SQL Editor to add name field

-- Add name column to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS name TEXT;

-- Update the handle_new_user function to support name
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role, name)
  VALUES (
    NEW.id,
    NEW.email,
    'user', -- Default role is 'user'
    COALESCE(NEW.raw_user_meta_data->>'name', NULL) -- Get name from metadata if exists
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Verify the change
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'profiles' AND column_name = 'name';
