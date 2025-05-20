
-- Function to enable pg_cron extension
CREATE OR REPLACE FUNCTION public.enable_pg_cron()
RETURNS BOOLEAN LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  -- Try to enable pg_cron extension
  BEGIN
    CREATE EXTENSION IF NOT EXISTS pg_cron;
    RETURN TRUE;
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE 'Failed to create pg_cron extension: %', SQLERRM;
      RETURN FALSE;
  END;
END;
$$;

-- Function to enable pg_net extension
CREATE OR REPLACE FUNCTION public.enable_pg_net()
RETURNS BOOLEAN LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  -- Try to enable pg_net extension
  BEGIN
    CREATE EXTENSION IF NOT EXISTS pg_net;
    RETURN TRUE;
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE 'Failed to create pg_net extension: %', SQLERRM;
      RETURN FALSE;
  END;
END;
$$;

-- Update the create_cron_extensions function with better error handling
CREATE OR REPLACE FUNCTION public.create_cron_extensions()
RETURNS JSON LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  cron_success BOOLEAN := FALSE;
  net_success BOOLEAN := FALSE;
BEGIN
  -- Try to create the pg_cron extension
  BEGIN
    CREATE EXTENSION IF NOT EXISTS pg_cron;
    cron_success := TRUE;
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE 'Failed to create pg_cron extension: %', SQLERRM;
  END;
  
  -- Try to create the pg_net extension
  BEGIN
    CREATE EXTENSION IF NOT EXISTS pg_net;
    net_success := TRUE;
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE 'Failed to create pg_net extension: %', SQLERRM;
  END;
  
  -- Return status message
  RETURN json_build_object(
    'pg_cron_success', cron_success,
    'pg_net_success', net_success,
    'message', (CASE WHEN cron_success AND net_success THEN 
                  'Both extensions successfully created'
                WHEN cron_success THEN 
                  'Only pg_cron extension created successfully'
                WHEN net_success THEN
                  'Only pg_net extension created successfully'
                ELSE
                  'Failed to create both extensions'
                END)
  );
END;
$$;

-- Grant execute permissions to all the functions
GRANT EXECUTE ON FUNCTION public.enable_pg_cron() TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.enable_pg_net() TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.create_cron_extensions() TO anon, authenticated, service_role;

-- Update the setup_research_cron_job function
CREATE OR REPLACE FUNCTION setup_research_cron_job()
RETURNS JSON LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  project_ref TEXT := 'zmevoxevezwnkigertpn';
  anon_key TEXT := 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InptZXZveGV2ZXp3bmtpZ2VydHBuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyNzYxMDcsImV4cCI6MjA2Mjg1MjEwN30.pWgLkPyobQPhf2fgvI9suqWjDl_VvYEu7Y4coc5RzsM';
  cron_name TEXT := 'hourly_research_papers_fetch';
  cron_success BOOLEAN := FALSE;
  job_exists BOOLEAN;
  result TEXT;
BEGIN
  -- Try to create the extensions first
  PERFORM create_cron_extensions();

  -- First check if cron.job exists and the cron extension works
  BEGIN 
    SELECT EXISTS(SELECT 1 FROM pg_tables WHERE schemaname = 'cron' AND tablename = 'job') INTO job_exists;
    
    IF NOT job_exists THEN
      RETURN json_build_object(
        'success', FALSE,
        'message', 'cron.job table not found. pg_cron extension may not be installed correctly.',
        'suggestion', 'Contact your database administrator to install the pg_cron extension'
      );
    END IF;
    
    -- Check if the cron job already exists and remove it if it does
    BEGIN
      SELECT EXISTS(
        SELECT 1 FROM cron.job WHERE jobname = cron_name
      ) INTO job_exists;
      
      IF job_exists THEN
        PERFORM cron.unschedule(cron_name);
      END IF;
    EXCEPTION WHEN OTHERS THEN
      RETURN json_build_object(
        'success', FALSE,
        'message', 'Error checking for existing cron job: ' || SQLERRM,
        'suggestion', 'The cron extension might not be working properly'
      );
    END;

    -- Schedule the job with proper error handling
    BEGIN
      SELECT cron.schedule(
        cron_name,
        '0 * * * *',  -- Run hourly
        $$
        SELECT net.http_post(
          url := 'https://zmevoxevezwnkigertpn.supabase.co/functions/v1/fetch-research',
          headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InptZXZveGV2ZXp3bmtpZ2VydHBuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyNzYxMDcsImV4cCI6MjA2Mjg1MjEwN30.pWgLkPyobQPhf2fgvI9suqWjDl_VvYEu7Y4coc5RzsM"}'::jsonb,
          body := '{"source": "cron"}'::jsonb
        );
        $$
      ) INTO result;
      
      cron_success := TRUE;
    EXCEPTION WHEN OTHERS THEN
      RETURN json_build_object(
        'success', FALSE,
        'message', 'Failed to schedule cron job: ' || SQLERRM,
        'suggestion', 'This may be due to permissions or extensions issues'
      );
    END;
  EXCEPTION WHEN OTHERS THEN
    RETURN json_build_object(
      'success', FALSE,
      'message', 'Error with cron setup: ' || SQLERRM,
      'suggestion', 'The pg_cron extension might not be installed properly'
    );
  END;

  -- If we got here, everything worked
  RETURN json_build_object(
    'success', TRUE,
    'message', 'Research papers fetch job scheduled successfully',
    'schedule', 'Every hour at minute 0',
    'job_id', result
  );
END;
$$;

-- Grant permissions to execute the functions
GRANT EXECUTE ON FUNCTION setup_research_cron_job() TO authenticated;
GRANT EXECUTE ON FUNCTION setup_research_cron_job() TO anon;
GRANT EXECUTE ON FUNCTION setup_research_cron_job() TO service_role;
