
-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create a proper trigger function with improved avatar handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    username,
    name,
    avatar_url,
    status,
    role,
    bio,
    website,
    is_ghost_mode
  ) VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', CONCAT('user_', SUBSTRING(NEW.id::TEXT, 1, 8))),
    COALESCE(NEW.raw_user_meta_data->>'name', CONCAT('User ', SUBSTRING(NEW.id::TEXT, 1, 4))),
    COALESCE(
      NEW.raw_user_meta_data->>'avatar_url',
      CONCAT('https://api.dicebear.com/7.x/initials/svg?seed=', 
             COALESCE(NEW.raw_user_meta_data->>'username', NEW.raw_user_meta_data->>'name', SUBSTRING(NEW.id::TEXT, 1, 8)))
    ),
    'online'::user_status,
    'user',
    '',
    '',
    false
  );
  RETURN NEW;
EXCEPTION
  WHEN others THEN
    -- Log the error but don't block user creation
    RAISE LOG 'Error creating profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

-- Add the trigger to create profiles when a user is created
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
