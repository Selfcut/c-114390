
-- Create a table for knowledge entries
CREATE TABLE IF NOT EXISTS public.knowledge_entries (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    title text NOT NULL,
    summary text NOT NULL,
    content text,
    categories text[] DEFAULT '{}',
    cover_image text,
    likes integer DEFAULT 0,
    views integer DEFAULT 0,
    comments integer DEFAULT 0,
    is_ai_generated boolean DEFAULT false,
    user_id uuid NOT NULL REFERENCES auth.users(id),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Create a unified content interactions table for likes
CREATE TABLE IF NOT EXISTS public.content_likes (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    content_id uuid NOT NULL,
    user_id uuid NOT NULL REFERENCES auth.users(id),
    content_type text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    UNIQUE(content_id, user_id, content_type)
);

-- Create a unified content interactions table for bookmarks
CREATE TABLE IF NOT EXISTS public.content_bookmarks (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    content_id uuid NOT NULL,
    user_id uuid NOT NULL REFERENCES auth.users(id),
    content_type text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    UNIQUE(content_id, user_id, content_type)
);

-- Create a unified content interactions table for comments
CREATE TABLE IF NOT EXISTS public.content_comments (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    content_id uuid NOT NULL,
    user_id uuid NOT NULL REFERENCES auth.users(id),
    content_type text NOT NULL,
    comment text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Create a function to increment content metrics
CREATE OR REPLACE FUNCTION increment_content_metric()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.content_type = 'knowledge' THEN
        UPDATE knowledge_entries
        SET likes = likes + 1
        WHERE id = NEW.content_id;
    ELSIF NEW.content_type = 'media' THEN
        UPDATE media_posts
        SET likes = likes + 1
        WHERE id = NEW.content_id;
    ELSIF NEW.content_type = 'quote' THEN
        UPDATE quotes
        SET likes = likes + 1
        WHERE id = NEW.content_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to update like counts
CREATE TRIGGER update_content_likes_count
AFTER INSERT ON content_likes
FOR EACH ROW
EXECUTE FUNCTION increment_content_metric();

-- Create a function to decrement content metrics
CREATE OR REPLACE FUNCTION decrement_content_metric()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.content_type = 'knowledge' THEN
        UPDATE knowledge_entries
        SET likes = likes - 1
        WHERE id = OLD.content_id;
    ELSIF OLD.content_type = 'media' THEN
        UPDATE media_posts
        SET likes = likes - 1
        WHERE id = OLD.content_id;
    ELSIF OLD.content_type = 'quote' THEN
        UPDATE quotes
        SET likes = likes - 1
        WHERE id = OLD.content_id;
    END IF;
    
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to update like counts on delete
CREATE TRIGGER update_content_likes_count_on_delete
AFTER DELETE ON content_likes
FOR EACH ROW
EXECUTE FUNCTION decrement_content_metric();

-- Enable Row Level Security
ALTER TABLE knowledge_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_comments ENABLE ROW LEVEL SECURITY;

-- Create policies for knowledge entries
CREATE POLICY "Public read access for knowledge entries"
    ON public.knowledge_entries FOR SELECT
    USING (true);
    
CREATE POLICY "Users can create their own knowledge entries"
    ON public.knowledge_entries FOR INSERT
    WITH CHECK (auth.uid() = user_id);
    
CREATE POLICY "Users can update their own knowledge entries"
    ON public.knowledge_entries FOR UPDATE
    USING (auth.uid() = user_id);
    
CREATE POLICY "Users can delete their own knowledge entries"
    ON public.knowledge_entries FOR DELETE
    USING (auth.uid() = user_id);

-- Create policies for content interactions
CREATE POLICY "Public read access for content likes"
    ON public.content_likes FOR SELECT
    USING (true);
    
CREATE POLICY "Users can create their own content likes"
    ON public.content_likes FOR INSERT
    WITH CHECK (auth.uid() = user_id);
    
CREATE POLICY "Users can delete their own content likes"
    ON public.content_likes FOR DELETE
    USING (auth.uid() = user_id);

-- Create policies for content bookmarks
CREATE POLICY "Public read access for content bookmarks"
    ON public.content_bookmarks FOR SELECT
    USING (true);
    
CREATE POLICY "Users can create their own content bookmarks"
    ON public.content_bookmarks FOR INSERT
    WITH CHECK (auth.uid() = user_id);
    
CREATE POLICY "Users can delete their own content bookmarks"
    ON public.content_bookmarks FOR DELETE
    USING (auth.uid() = user_id);
    
-- Create policies for content comments
CREATE POLICY "Public read access for content comments"
    ON public.content_comments FOR SELECT
    USING (true);
    
CREATE POLICY "Users can create their own content comments"
    ON public.content_comments FOR INSERT
    WITH CHECK (auth.uid() = user_id);
    
CREATE POLICY "Users can update their own content comments"
    ON public.content_comments FOR UPDATE
    USING (auth.uid() = user_id);
    
CREATE POLICY "Users can delete their own content comments"
    ON public.content_comments FOR DELETE
    USING (auth.uid() = user_id);
