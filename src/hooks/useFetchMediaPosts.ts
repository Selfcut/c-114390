
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ContentItemProps } from '@/components/library/content-items/ContentItemTypes';
import { ViewMode } from '@/components/library/ViewSwitcher';
import { MediaPostType, validateMediaType } from '@/utils/mediaUtils';

export const useFetchMediaPosts = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Helper function to format date strings
  const formatDate = (dateStr: string) => new Date(dateStr);
  
  const fetchMediaPosts = async (page: number, viewMode: ViewMode): Promise<ContentItemProps[]> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Use proper join syntax for Supabase
      const { data: mediaData, error: mediaError } = await supabase
        .from('media_posts')
        .select(`
          *,
          profiles(name, avatar_url, username)
        `)
        .order('created_at', { ascending: false })
        .range(page * 10, (page + 1) * 10 - 1);
        
      if (mediaError) {
        console.error('Error fetching media posts:', mediaError);
        setError(mediaError);
        return [];
      }
      
      if (mediaData) {
        return mediaData.map((item: any) => {
          // Type assertion for profile data
          const profileData = item.profiles as { 
            name?: string; 
            avatar_url?: string; 
            username?: string;
          } | null;
          
          return {
            id: item.id,
            type: 'media',
            title: item.title,
            content: item.content,
            author: {
              name: profileData?.name || 'Unknown Author',
              avatar: profileData?.avatar_url,
              username: profileData?.username,
            },
            createdAt: formatDate(item.created_at),
            metrics: {
              likes: item.likes || 0,
              comments: item.comments || 0,
            },
            mediaUrl: item.url,
            mediaType: validateMediaType(item.type),
            viewMode,
          };
        });
      }
      
      return [];
    } catch (error) {
      const err = error as Error;
      console.error('Error fetching media posts:', err);
      setError(err);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  return { fetchMediaPosts, isLoading, error };
};
