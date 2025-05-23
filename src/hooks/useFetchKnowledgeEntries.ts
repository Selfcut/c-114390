import { supabase } from '@/integrations/supabase/client';
import { ContentItemProps, ContentItemType } from '@/components/library/content-items/ContentItemTypes';
import { ContentViewMode } from '@/types/unified-content-types';

export const useFetchKnowledgeEntries = () => {
  const fetchKnowledgeEntries = async (page: number, viewMode: ContentViewMode): Promise<ContentItemProps[]> => {
    // Helper function to format date strings
    const formatDate = (dateStr: string) => new Date(dateStr);
    
    try {
      // Fix: Use proper join syntax for Supabase
      const { data: knowledgeData, error: knowledgeError } = await supabase
        .from('knowledge_entries')
        .select(`
          *,
          profiles:user_id(name, avatar_url, username)
        `)
        .order('created_at', { ascending: false })
        .range(page * 10, (page + 1) * 10 - 1);
        
      if (knowledgeError) {
        console.error('Error fetching knowledge entries:', knowledgeError);
        throw knowledgeError;
      }
      
      if (knowledgeData) {
        const knowledgeItems: ContentItemProps[] = knowledgeData.map((item: any) => ({
          id: item.id,
          type: ContentItemType.Knowledge,
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
