
-- Create the research_papers table
CREATE TABLE IF NOT EXISTS public.research_papers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  summary TEXT,
  author TEXT NOT NULL,
  content TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  category TEXT NOT NULL,
  image_url TEXT,
  user_id UUID REFERENCES auth.users(id)
);

-- Add Row Level Security (RLS)
ALTER TABLE public.research_papers ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read access to research_papers" 
  ON public.research_papers 
  FOR SELECT 
  USING (true);

CREATE POLICY "Allow authenticated users to create research papers" 
  ON public.research_papers 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow users to update their own research papers" 
  ON public.research_papers 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Allow users to delete their own research papers" 
  ON public.research_papers 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create function to increment views
CREATE OR REPLACE FUNCTION public.increment_research_views(paper_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.research_papers
  SET views = COALESCE(views, 0) + 1
  WHERE id = paper_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to toggle likes
CREATE OR REPLACE FUNCTION public.toggle_research_like(paper_id UUID, user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  liked BOOLEAN;
BEGIN
  -- Check if user already liked the paper
  SELECT EXISTS(
    SELECT 1 FROM public.content_likes
    WHERE content_id = paper_id AND user_id = toggle_research_like.user_id AND content_type = 'research'
  ) INTO liked;
  
  IF liked THEN
    -- Unlike: Delete the like and decrement the likes count
    DELETE FROM public.content_likes 
    WHERE content_id = paper_id AND user_id = toggle_research_like.user_id AND content_type = 'research';
    
    UPDATE public.research_papers
    SET likes = GREATEST(likes - 1, 0)
    WHERE id = paper_id;
    
    RETURN FALSE;
  ELSE
    -- Like: Add a new like and increment the likes count
    INSERT INTO public.content_likes (content_id, user_id, content_type)
    VALUES (paper_id, toggle_research_like.user_id, 'research');
    
    UPDATE public.research_papers
    SET likes = COALESCE(likes, 0) + 1
    WHERE id = paper_id;
    
    RETURN TRUE;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
