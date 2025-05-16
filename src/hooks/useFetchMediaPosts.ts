
import { supabase } from '@/integrations/supabase/client';
import { ContentItemProps } from '@/components/library/UnifiedContentItem';
import { ViewMode } from '@/components/library/ViewSwitcher';

export const useFetchMediaPosts = () => {
  const fetchMediaPosts = async (page: number, viewMode: ViewMode): Promise<ContentItemProps[]> => {
    // Helper function to format date strings
    const formatDate = (dateStr: string) => new Date(dateStr);
    
    const { data: mediaData, error: mediaError } = await supabase
      .from('media_posts')
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
      
    if (mediaError) throw mediaError;
    
    if (mediaData) {
      const mediaItems: ContentItemProps[] = mediaData.map((item: any) => ({
        id: item.id,
        type: 'media',
        title: item.title,
        content: item.content,
        author: {
          name: item.profiles?.name || 'Unknown Author',
          avatar: item.profiles?.avatar_url,
          username: item.profiles?.username,
        },
        createdAt: formatDate(item.created_at),
        metrics: {
          likes: item.likes || 0,
          comments: item.comments || 0,
        },
        mediaUrl: item.url,
        mediaType: item.type as 'image' | 'video' | 'document' | 'youtube' | 'text',
        viewMode,
      }));
      
      return mediaItems;
    }
    
    return [];
  };

  return { fetchMediaPosts };
};
