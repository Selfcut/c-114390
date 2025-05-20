
-- Enable necessary extensions for cron jobs if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Create function to set up the research papers cron job
CREATE OR REPLACE FUNCTION setup_research_cron_job()
RETURNS JSON LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  project_ref TEXT := 'zmevoxevezwnkigertpn';
  anon_key TEXT := 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InptZXZveGV2ZXp3bmtpZ2VydHBuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyNzYxMDcsImV4cCI6MjA2Mjg1MjEwN30.pWgLkPyobQPhf2fgvI9suqWjDl_VvYEu7Y4coc5RzsM';
  cron_name TEXT := 'hourly_research_papers_fetch';
  result RECORD;
BEGIN
  -- First, check if the cron job already exists and remove it if it does
  SELECT * INTO result FROM cron.job WHERE jobname = cron_name;
  
  IF FOUND THEN
    PERFORM cron.unschedule(cron_name);
  END IF;

  -- Schedule the new cron job to run every hour
  PERFORM cron.schedule(
    cron_name,
    '0 * * * *',  -- Run at minute 0 of every hour (hourly)
    $$
    SELECT net.http_post(
      url := 'https://' || current_setting('request.headers')::json->>'host' || '/functions/v1/fetch-research-papers',
      headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InptZXZveGV2ZXp3bmtpZ2VydHBuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyNzYxMDcsImV4cCI6MjA2Mjg1MjEwN30.pWgLkPyobQPhf2fgvI9suqWjDl_VvYEu7Y4coc5RzsM"}'::jsonb,
      body := '{"source": "cron"}'::jsonb
    ) AS request_id;
    $$
  );

  RETURN json_build_object(
    'success', true,
    'message', 'Research papers fetch job scheduled successfully',
    'schedule', 'Every hour at minute 0'
  );
END;
$$;

-- Grant permission to execute the function
GRANT EXECUTE ON FUNCTION setup_research_cron_job() TO authenticated;
GRANT EXECUTE ON FUNCTION setup_research_cron_job() TO anon;
