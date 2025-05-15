
-- This file contains SQL functions for tracking and updating user activities

-- Create trigger function to update timestamp on updates
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for user_activities table
DROP TRIGGER IF EXISTS set_updated_at_on_user_activities ON public.user_activities;
CREATE TRIGGER set_updated_at_on_user_activities
BEFORE UPDATE ON public.user_activities
FOR EACH ROW
EXECUTE PROCEDURE public.set_updated_at();
