
-- Execute the previously defined quote functions
DO $$
BEGIN
  -- Try to create the functions if they don't exist
  IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'increment_quote_likes') THEN
    EXECUTE 
      'CREATE OR REPLACE FUNCTION increment_quote_likes(quote_id UUID)
       RETURNS void
       LANGUAGE plpgsql
       SECURITY DEFINER
       AS $func$
       BEGIN
         UPDATE public.quotes
         SET likes = likes + 1
         WHERE id = quote_id;
       END;
       $func$;';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'decrement_quote_likes') THEN
    EXECUTE 
      'CREATE OR REPLACE FUNCTION decrement_quote_likes(quote_id UUID)
       RETURNS void
       LANGUAGE plpgsql
       SECURITY DEFINER
       AS $func$
       BEGIN
         UPDATE public.quotes
         SET likes = GREATEST(0, likes - 1)
         WHERE id = quote_id;
       END;
       $func$;';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'increment_quote_bookmarks') THEN
    EXECUTE 
      'CREATE OR REPLACE FUNCTION increment_quote_bookmarks(quote_id UUID)
       RETURNS void
       LANGUAGE plpgsql
       SECURITY DEFINER
       AS $func$
       BEGIN
         UPDATE public.quotes
         SET bookmarks = bookmarks + 1
         WHERE id = quote_id;
       END;
       $func$;';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'decrement_quote_bookmarks') THEN
    EXECUTE 
      'CREATE OR REPLACE FUNCTION decrement_quote_bookmarks(quote_id UUID)
       RETURNS void
       LANGUAGE plpgsql
       SECURITY DEFINER
       AS $func$
       BEGIN
         UPDATE public.quotes
         SET bookmarks = GREATEST(0, bookmarks - 1)
         WHERE id = quote_id;
       END;
       $func$;';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'increment_quote_comments') THEN
    EXECUTE 
      'CREATE OR REPLACE FUNCTION increment_quote_comments(quote_id UUID)
       RETURNS void
       LANGUAGE plpgsql
       SECURITY DEFINER
       AS $func$
       BEGIN
         UPDATE public.quotes
         SET comments = comments + 1
         WHERE id = quote_id;
       END;
       $func$;';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'decrement_quote_comments') THEN
    EXECUTE 
      'CREATE OR REPLACE FUNCTION decrement_quote_comments(quote_id UUID)
       RETURNS void
       LANGUAGE plpgsql
       SECURITY DEFINER
       AS $func$
       BEGIN
         UPDATE public.quotes
         SET comments = GREATEST(0, comments - 1)
         WHERE id = quote_id;
       END;
       $func$;';
  END IF;
END $$;
