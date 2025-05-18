
-- Create the function for matching embeddings
CREATE OR REPLACE FUNCTION match_embeddings(
  query_embedding vector(384),
  content_type text,
  match_threshold float DEFAULT 0.7,
  match_limit int DEFAULT 10
)
RETURNS TABLE (
  content_id uuid,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    e.content_id,
    1 - (e.embedding <=> query_embedding) AS similarity
  FROM 
    content_embeddings e
  WHERE 
    e.content_type = match_embeddings.content_type
    AND 1 - (e.embedding <=> query_embedding) > match_threshold
  ORDER BY 
    e.embedding <=> query_embedding
  LIMIT match_limit;
END;
$$;

-- Create a cron job to fetch new research papers every hour
SELECT cron.schedule(
  'fetch-research-hourly',
  '0 * * * *', -- Run every hour
  $$
  SELECT
    net.http_post(
      url:='https://zmevoxevezwnkigertpn.supabase.co/functions/v1/fetch-research',
      headers:='{"Content-Type": "application/json", "Authorization": "Bearer ' || (SELECT value FROM secrets.secrets WHERE name = 'SUPABASE_SERVICE_ROLE_KEY') || '"}'::jsonb,
      body:='{}'::jsonb
    ) as request_id;
  $$
);
