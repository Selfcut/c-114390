
-- Create a function to enable the necessary extensions for cron functionality
CREATE OR REPLACE FUNCTION public.create_cron_extensions()
RETURNS JSON LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  -- Try to create the pg_cron extension
  BEGIN
    CREATE EXTENSION IF NOT EXISTS pg_cron;
    EXCEPTION WHEN OTHERS THEN
      RETURN json_build_object(
        'success', false,
        'message', 'Failed to create pg_cron extension: ' || SQLERRM,
        'hint', 'This may require superuser privileges'
      );
  END;
  
  -- Try to create the pg_net extension
  BEGIN
    CREATE EXTENSION IF NOT EXISTS pg_net;
    EXCEPTION WHEN OTHERS THEN
      RETURN json_build_object(
        'success', false,
        'message', 'Failed to create pg_net extension: ' || SQLERRM,
        'hint', 'This may require superuser privileges'
      );
  END;
  
  -- Return success message
  RETURN json_build_object(
    'success', true,
    'message', 'Extensions pg_cron and pg_net successfully created'
  );
END;
$$;

-- Grant permission to execute the function
GRANT EXECUTE ON FUNCTION public.create_cron_extensions() TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_cron_extensions() TO anon;
