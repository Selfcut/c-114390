
import { supabase } from '@/integrations/supabase/client';
import { ContentItemProps } from '@/components/library/content-items/ContentItemTypes';
import { ViewMode } from '@/components/library/ViewSwitcher';

export const useFetchKnowledgeEntries = () => {
  const fetchKnowledgeEntries = async (page: number, viewMode: ViewMode): Promise<ContentItemProps[]> => {
    // Helper function to format date strings
    const formatDate = (dateStr: string) => new Date(dateStr);
    
    try {
      const { data: knowledgeData, error: knowledgeError } = await supabase
        .from('knowledge_entries')
        .select('*, profiles(*)')
        .order('created_at', { ascending: false })
        .range(page * 10, (page + 1) * 10 - 1);
        
      if (knowledgeError) throw knowledgeError;
      
      if (knowledgeData) {
        const knowledgeItems: ContentItemProps[] = knowledgeData.map((item: any) => ({
          id: item.id,
          type: 'knowledge',
          title: item.title,
          summary: item.summary,
          author: {
            name: item.profiles?.name || 'Unknown Author',
            avatar: item.profiles?.avatar_url,
            username: item.profiles?.username,
          },
          createdAt: formatDate(item.created_at),
          metrics: {
            views: item.views || 0,
            likes: item.likes || 0,
            comments: item.comments || 0,
          },
          tags: item.categories || [],
          coverImage: item.cover_image,
          viewMode,
        }));
        
        return knowledgeItems;
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching knowledge entries:', error);
      return [];
    }
  };

  return { fetchKnowledgeEntries };
};
