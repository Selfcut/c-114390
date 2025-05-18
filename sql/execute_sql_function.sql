
-- This is just a reference that we'll need to add to Supabase
-- Create a function to execute dynamic SQL (only used by authenticated users with proper permissions)
CREATE OR REPLACE FUNCTION execute_sql(sql_query TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSONB;
BEGIN
  EXECUTE 'WITH query_result AS (' || sql_query || ') SELECT jsonb_agg(query_result) FROM query_result' INTO result;
  RETURN COALESCE(result, '[]'::jsonb);
END;
$$;
