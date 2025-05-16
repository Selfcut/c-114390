
import { supabase } from '@/integrations/supabase/client';
import { ContentItemProps } from '@/components/library/UnifiedContentItem';
import { ViewMode } from '@/components/library/ViewSwitcher';

export const useFetchQuotes = () => {
  const fetchQuotes = async (page: number, viewMode: ViewMode): Promise<ContentItemProps[]> => {
    // Helper function to format date strings
    const formatDate = (dateStr: string) => new Date(dateStr);
    
    const { data: quotesData, error: quotesError } = await supabase
      .from('quotes')
      .select(`
        *,
        profiles:user_id (
          name,
          avatar_url,
          username
        )
      `)
      .order('created_at', { ascending: false })
      .range(page * 10, (page + 1) * 10 - 1);
      
    if (quotesError) throw quotesError;
    
    if (quotesData) {
      const quoteItems: ContentItemProps[] = quotesData.map((item: any) => ({
        id: item.id,
        type: 'quote',
        title: item.author,
        content: item.text,
        summary: item.source,
        author: {
          name: item.profiles?.name || 'Unknown Author',
          avatar: item.profiles?.avatar_url,
          username: item.profiles?.username,
        },
        createdAt: formatDate(item.created_at),
        metrics: {
          likes: item.likes || 0,
          comments: item.comments || 0,
          bookmarks: item.bookmarks || 0,
        },
        tags: item.tags || [],
        viewMode,
      }));
      
      return quoteItems;
    }
    
    return [];
  };

  return { fetchQuotes };
};
