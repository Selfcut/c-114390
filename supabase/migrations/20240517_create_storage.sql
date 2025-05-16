
-- Create storage bucket for content uploads if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
SELECT 'content', 'content', TRUE
WHERE NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'content');

-- Set up security policies for the content bucket
CREATE POLICY "Anyone can view content"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'content');

CREATE POLICY "Authenticated users can upload content"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'content' AND
    auth.role() = 'authenticated'
  );

CREATE POLICY "Users can update their own content"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'content' AND
    auth.uid() = owner
  );

CREATE POLICY "Users can delete their own content"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'content' AND
    auth.uid() = owner
  );
