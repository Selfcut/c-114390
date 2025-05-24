
import { supabase } from '@/integrations/supabase/client';
import { ContentItemProps, ContentItemType } from '@/components/library/content-items/ContentItemTypes';
import { ContentViewMode } from '@/types/unified-content-types';

export const useFetchQuotes = () => {
  const fetchQuotes = async (page: number, viewMode: ContentViewMode): Promise<ContentItemProps[]> => {
    // Helper function to format date strings
    const formatDate = (dateStr: string) => new Date(dateStr);
    
    try {
      // Use proper join syntax for Supabase with profiles table
      const { data: quotesData, error: quotesError } = await supabase
        .from('quotes')
        .select(`
          *,
          profiles (name, avatar_url, username)
        `)
        .order('created_at', { ascending: false })
        .range(page * 10, (page + 1) * 10 - 1);
        
      if (quotesError) {
        console.error('Error fetching quotes:', quotesError);
        throw quotesError;
      }
      
      if (quotesData) {
        const quoteItems: ContentItemProps[] = quotesData.map((item: any) => {
          const profile = Array.isArray(item.profiles) ? item.profiles[0] : item.profiles;
          
          return {
            id: item.id,
            type: ContentItemType.Quote,
            title: item.author,
            content: item.text,
            summary: item.source,
            author: {
              name: profile?.name || 'Unknown Author',
              avatar: profile?.avatar_url,
              username: profile?.username,
            },
            createdAt: formatDate(item.created_at),
            metrics: {
              likes: item.likes || 0,
              comments: item.comments || 0,
              bookmarks: item.bookmarks || 0,
            },
            tags: item.tags || [],
            viewMode,
          };
        });
        
        return quoteItems;
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching quotes:', error);
      return [];
    }
  };

  return { fetchQuotes };
};
