
-- This updated migration fixes syntax issues with the cron job setup

-- Create or replace the function to create extensions
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

-- Update the setup_research_cron_job function with corrected syntax
CREATE OR REPLACE FUNCTION setup_research_cron_job()
RETURNS JSON LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  project_ref TEXT := 'zmevoxevezwnkigertpn';
  anon_key TEXT := 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InptZXZveGV2ZXp3bmtpZ2VydHBuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyNzYxMDcsImV4cCI6MjA2Mjg1MjEwN30.pWgLkPyobQPhf2fgvI9suqWjDl_VvYEu7Y4coc5RzsM';
  cron_name TEXT := 'hourly_research_papers_fetch';
  job_exists BOOLEAN;
BEGIN
  -- Check if cron extensions are available
  PERFORM create_cron_extensions();

  -- Check if the cron job already exists
  BEGIN
    SELECT EXISTS(
      SELECT 1 FROM cron.job WHERE jobname = cron_name
    ) INTO job_exists;
    
    -- If exists, unschedule it
    IF job_exists THEN
      PERFORM cron.unschedule(cron_name);
    END IF;
  EXCEPTION WHEN OTHERS THEN
    RETURN json_build_object(
      'success', false,
      'message', 'Error checking for existing cron job: ' || SQLERRM,
      'hint', 'The cron extension might not be properly installed'
    );
  END;

  -- Try to schedule the job with fixed syntax
  BEGIN
    PERFORM cron.schedule(
      cron_name,
      '0 * * * *',  -- Run hourly
      format(
        $$
        SELECT net.http_post(
          'https://%s.supabase.co/functions/v1/fetch-research',
          '{"Content-Type": "application/json", "Authorization": "Bearer %s"}'::jsonb,
          '{"source": "cron"}'::jsonb
        );
        $$,
        project_ref,
        anon_key
      )
    );
    
    RETURN json_build_object(
      'success', true,
      'message', 'Research papers fetch job scheduled successfully',
      'schedule', 'Every hour at minute 0'
    );
  EXCEPTION WHEN OTHERS THEN
    RETURN json_build_object(
      'success', false,
      'message', 'Failed to schedule cron job: ' || SQLERRM,
      'hint', 'This may be due to permissions or syntax issues'
    );
  END;
END;
$$;

-- Grant permission to execute the functions
GRANT EXECUTE ON FUNCTION setup_research_cron_job() TO authenticated;
GRANT EXECUTE ON FUNCTION setup_research_cron_job() TO anon;
GRANT EXECUTE ON FUNCTION create_cron_extensions() TO authenticated;
GRANT EXECUTE ON FUNCTION create_cron_extensions() TO anon;
