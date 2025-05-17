
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { KnowledgeEntry, MediaPost, Quote, ContentFeedItem } from '@/lib/content-types';

export const useContentFeed = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [feedItems, setFeedItems] = useState<ContentFeedItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchContentData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch knowledge entries
        const { data: knowledgeData, error: knowledgeError } = await supabase
          .from('knowledge_entries')
          .select(`
            id, title, summary, content, categories, cover_image, 
            likes, views, comments, is_ai_generated, user_id,
            created_at, updated_at, 
            profiles:user_id (id, username, name, avatar_url)
          `)
          .order('created_at', { ascending: false })
          .limit(5);

        // Fetch media posts
        const { data: mediaData, error: mediaError } = await supabase
          .from('media_posts')
          .select(`
            id, title, content, type, url, likes, views, comments,
            user_id, created_at, updated_at,
            profiles:user_id (id, username, name, avatar_url)
          `)
          .order('created_at', { ascending: false })
          .limit(5);

        // Fetch quotes
        const { data: quoteData, error: quoteError } = await supabase
          .from('quotes')
          .select(`
            id, text, author, source, category, tags, 
            likes, comments, bookmarks, user_id, 
            created_at, updated_at,
            profiles:user_id (id, username, name, avatar_url)
          `)
          .order('created_at', { ascending: false })
          .limit(5);

        // Transform knowledge entries to feed items
        const knowledgeItems: ContentFeedItem[] = knowledgeData 
          ? knowledgeData.map((item: KnowledgeEntry) => ({
              id: item.id,
              title: item.title,
              description: item.summary,
              type: 'knowledge',
              image: item.cover_image || '',
              author: item.profiles ? (item.profiles.name || item.profiles.username || 'Unknown') : 'Unknown',
              date: item.created_at,
              likes: item.likes,
              views: item.views,
              comments: item.comments,
              tags: item.categories
            }))
          : [];

        // Transform media posts to feed items
        const mediaItems: ContentFeedItem[] = mediaData 
          ? mediaData.map((item: MediaPost) => ({
              id: item.id,
              title: item.title,
              description: item.content || '',
              type: 'media',
              image: item.url || '',
              author: item.profiles ? (item.profiles.name || item.profiles.username || 'Unknown') : 'Unknown',
              date: item.created_at,
              likes: item.likes,
              views: item.views || 0,
              comments: item.comments
            }))
          : [];

        // Transform quotes to feed items
        const quoteItems: ContentFeedItem[] = quoteData 
          ? quoteData.map((item: Quote) => ({
              id: item.id,
              title: item.author,
              description: item.text,
              type: 'quotes',
              author: item.profiles ? (item.profiles.name || item.profiles.username || 'Unknown') : 'Unknown',
              date: item.created_at,
              likes: item.likes,
              bookmarks: item.bookmarks,
              comments: item.comments,
              category: item.category,
              tags: item.tags
            }))
          : [];

        // Get AI generated content separately
        const aiContent: ContentFeedItem[] = knowledgeData 
          ? knowledgeData
              .filter((item: KnowledgeEntry) => item.is_ai_generated)
              .map((item: KnowledgeEntry) => ({
                id: item.id,
                title: item.title,
                description: item.summary,
                type: 'ai',
                image: item.cover_image || '',
                author: item.profiles ? (item.profiles.name || item.profiles.username || 'AI Assistant') : 'AI Assistant',
                date: item.created_at,
                likes: item.likes,
                views: item.views,
                comments: item.comments,
                tags: item.categories
              }))
          : [];

        // Combine all items into a single array
        const allItems = [...knowledgeItems, ...mediaItems, ...quoteItems, ...aiContent];
        
        // Sort by date (newest first)
        const sortedItems = allItems.sort((a, b) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });

        setFeedItems(sortedItems);

        if (knowledgeError || mediaError || quoteError) {
          console.error('Error fetching content:', { knowledgeError, mediaError, quoteError });
          setError('Failed to load some content');
        }
      } catch (err) {
        console.error('Error in content feed:', err);
        setError('Failed to load content feed');
      } finally {
        setIsLoading(false);
      }
    };

    fetchContentData();
  }, []);

  return { feedItems, isLoading, error };
};
