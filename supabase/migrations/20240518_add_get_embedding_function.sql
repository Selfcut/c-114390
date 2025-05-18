
-- Create or replace the get_embedding function to generate embeddings from the edge function
CREATE OR REPLACE FUNCTION get_embedding(text_query TEXT)
RETURNS vector
LANGUAGE plpgsql
VOLATILE
AS $$
DECLARE
  embedding vector(384);
  api_result json;
BEGIN
  -- Make an HTTP request to our edge function to get the embedding
  SELECT
    CASE WHEN payload IS NULL THEN NULL
         ELSE payload::json END
    INTO api_result
  FROM
    http((
      'POST',
      CONCAT('https://zmevoxevezwnkigertpn.supabase.co/functions/v1/generate-embeddings'),
      ARRAY[
        http_header('Content-Type', 'application/json'),
        http_header('Authorization', CONCAT('Bearer ', (SELECT value FROM secrets.secrets WHERE name = 'SUPABASE_SERVICE_ROLE_KEY')))
      ],
      'application/json',
      json_build_object('query', text_query)::text
    ));

  -- Extract the embedding from the API result
  embedding := api_result->'embedding';
  
  RETURN embedding;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'Error getting embedding: %', SQLERRM;
  RETURN NULL;
END;
$$;
