
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ContentItemType } from '@/components/library/UnifiedContentItem';

export interface UseContentInteractionsProps {
  userId?: string | null;
}

export const useContentInteractions = ({ userId }: UseContentInteractionsProps) => {
  const { toast } = useToast();
  const [userLikes, setUserLikes] = useState<Record<string, boolean>>({});
  const [userBookmarks, setUserBookmarks] = useState<Record<string, boolean>>({});
  
  // Determine content type for an item
  const getContentTypeString = (itemType: ContentItemType): string => {
    switch(itemType) {
      case 'knowledge':
        return 'knowledge';
      case 'media':
        return 'media';
      case 'quote':
        return 'quote';
      default:
        return 'knowledge';
    }
  };
  
  // Check if user has liked or bookmarked items
  const checkUserInteractions = async (itemIds: string[]) => {
    if (!userId) return;
    
    try {
      // Check likes
      const { data: likesData } = await supabase
        .from('content_likes')
        .select('content_id')
        .eq('user_id', userId)
        .in('content_id', itemIds);
        
      if (likesData) {
        const likes: Record<string, boolean> = {};
        likesData.forEach(item => {
          likes[item.content_id] = true;
        });
        setUserLikes(prev => ({...prev, ...likes}));
      }
      
      // Check bookmarks
      const { data: bookmarksData } = await supabase
        .from('content_bookmarks')
        .select('content_id')
        .eq('user_id', userId)
        .in('content_id', itemIds);
        
      if (bookmarksData) {
        const bookmarks: Record<string, boolean> = {};
        bookmarksData.forEach(item => {
          bookmarks[item.content_id] = true;
        });
        setUserBookmarks(prev => ({...prev, ...bookmarks}));
      }
    } catch (err) {
      console.error('Error checking user interactions:', err);
    }
  };
  
  // Handle like interaction
  const handleLike = async (id: string, itemType: ContentItemType) => {
    if (!userId) {
      toast({
        title: "Authentication required",
        description: "Please log in to like content",
        variant: "destructive"
      });
      return;
    }
    
    const isLiked = userLikes[id];
    const contentTypeStr = getContentTypeString(itemType);
    
    try {
      if (isLiked) {
        // Unlike
        await supabase
          .from('content_likes')
          .delete()
          .eq('user_id', userId)
          .eq('content_id', id);
          
        setUserLikes(prev => ({...prev, [id]: false}));
      } else {
        // Like
        await supabase
          .from('content_likes')
          .insert({
            user_id: userId,
            content_id: id,
            content_type: contentTypeStr
          });
          
        setUserLikes(prev => ({...prev, [id]: true}));
      }
      
      return {
        isLiked: !isLiked,
        id
      };
      
    } catch (err) {
      console.error('Error updating like:', err);
      toast({
        title: "Action failed",
        description: "Failed to update like status",
        variant: "destructive"
      });
      return null;
    }
  };
  
  // Handle bookmark interaction
  const handleBookmark = async (id: string, itemType: ContentItemType) => {
    if (!userId) {
      toast({
        title: "Authentication required",
        description: "Please log in to bookmark content",
        variant: "destructive"
      });
      return;
    }
    
    const isBookmarked = userBookmarks[id];
    const contentTypeStr = getContentTypeString(itemType);
    
    try {
      if (isBookmarked) {
        // Remove bookmark
        await supabase
          .from('content_bookmarks')
          .delete()
          .eq('user_id', userId)
          .eq('content_id', id);
          
        setUserBookmarks(prev => ({...prev, [id]: false}));
      } else {
        // Add bookmark
        await supabase
          .from('content_bookmarks')
          .insert({
            user_id: userId,
            content_id: id,
            content_type: contentTypeStr
          });
          
        setUserBookmarks(prev => ({...prev, [id]: true}));
      }
      
      return {
        isBookmarked: !isBookmarked,
        id
      };
      
    } catch (err) {
      console.error('Error updating bookmark:', err);
      toast({
        title: "Action failed",
        description: "Failed to update bookmark status",
        variant: "destructive"
      });
      return null;
    }
  };

  return {
    userLikes,
    userBookmarks,
    handleLike,
    handleBookmark,
    checkUserInteractions
  };
};
