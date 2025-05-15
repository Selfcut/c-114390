
-- Function to increment quote likes count
CREATE OR REPLACE FUNCTION increment_quote_likes(quote_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.quotes
  SET likes = likes + 1
  WHERE id = quote_id;
END;
$$;

-- Function to decrement quote likes count
CREATE OR REPLACE FUNCTION decrement_quote_likes(quote_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.quotes
  SET likes = GREATEST(0, likes - 1)
  WHERE id = quote_id;
END;
$$;

-- Function to increment quote bookmarks count
CREATE OR REPLACE FUNCTION increment_quote_bookmarks(quote_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.quotes
  SET bookmarks = bookmarks + 1
  WHERE id = quote_id;
END;
$$;

-- Function to decrement quote bookmarks count
CREATE OR REPLACE FUNCTION decrement_quote_bookmarks(quote_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.quotes
  SET bookmarks = GREATEST(0, bookmarks - 1)
  WHERE id = quote_id;
END;
$$;

-- Function to increment quote comments count
CREATE OR REPLACE FUNCTION increment_quote_comments(quote_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.quotes
  SET comments = comments + 1
  WHERE id = quote_id;
END;
$$;

-- Function to decrement quote comments count
CREATE OR REPLACE FUNCTION decrement_quote_comments(quote_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.quotes
  SET comments = GREATEST(0, comments - 1)
  WHERE id = quote_id;
END;
$$;
