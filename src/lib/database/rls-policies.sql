
-- Critical RLS policies that are missing

-- Enable RLS on all tables that need it
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.research_papers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wiki_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_entries ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Forum posts policies
CREATE POLICY "Anyone can view forum posts" ON public.forum_posts FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create posts" ON public.forum_posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own posts" ON public.forum_posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own posts" ON public.forum_posts FOR DELETE USING (auth.uid() = user_id);

-- Content comments policies
CREATE POLICY "Anyone can view comments" ON public.content_comments FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create comments" ON public.content_comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own comments" ON public.content_comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own comments" ON public.content_comments FOR DELETE USING (auth.uid() = user_id);

-- Content likes policies
CREATE POLICY "Anyone can view likes" ON public.content_likes FOR SELECT USING (true);
CREATE POLICY "Authenticated users can like content" ON public.content_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can remove own likes" ON public.content_likes FOR DELETE USING (auth.uid() = user_id);

-- Content bookmarks policies
CREATE POLICY "Users can view own bookmarks" ON public.content_bookmarks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own bookmarks" ON public.content_bookmarks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can remove own bookmarks" ON public.content_bookmarks FOR DELETE USING (auth.uid() = user_id);

-- Research papers policies
CREATE POLICY "Anyone can view research papers" ON public.research_papers FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create papers" ON public.research_papers FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Users can update own papers" ON public.research_papers FOR UPDATE USING (auth.uid() = user_id OR user_id IS NULL);

-- Wiki articles policies
CREATE POLICY "Anyone can view wiki articles" ON public.wiki_articles FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create articles" ON public.wiki_articles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own articles" ON public.wiki_articles FOR UPDATE USING (auth.uid() = user_id);

-- Media posts policies
CREATE POLICY "Anyone can view media posts" ON public.media_posts FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create media" ON public.media_posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own media" ON public.media_posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own media" ON public.media_posts FOR DELETE USING (auth.uid() = user_id);

-- Quotes policies
CREATE POLICY "Anyone can view quotes" ON public.quotes FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create quotes" ON public.quotes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own quotes" ON public.quotes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own quotes" ON public.quotes FOR DELETE USING (auth.uid() = user_id);

-- Knowledge entries policies
CREATE POLICY "Anyone can view knowledge entries" ON public.knowledge_entries FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create entries" ON public.knowledge_entries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own entries" ON public.knowledge_entries FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own entries" ON public.knowledge_entries FOR DELETE USING (auth.uid() = user_id);
