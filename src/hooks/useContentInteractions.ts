
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ContentItemType } from '@/components/library/content-items/ContentItemTypes';

export interface UseContentInteractionsProps {
  userId?: string | null;
}

export const useContentInteractions = ({ userId }: UseContentInteractionsProps) => {
  const { toast } = useToast();
  const [userLikes, setUserLikes] = useState<Record<string, boolean>>({});
  const [userBookmarks, setUserBookmarks] = useState<Record<string, boolean>>({});
  
  // Subscribe to realtime updates for content interactions
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel('content-interactions')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'content_likes', filter: `user_id=eq.${userId}` },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const { content_id } = payload.new;
            setUserLikes(prev => ({ ...prev, [content_id]: true }));
          } else if (payload.eventType === 'DELETE') {
            const { content_id } = payload.old;
            setUserLikes(prev => ({ ...prev, [content_id]: false }));
          }
        }
      )
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'content_bookmarks', filter: `user_id=eq.${userId}` },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const { content_id } = payload.new;
            setUserBookmarks(prev => ({ ...prev, [content_id]: true }));
          } else if (payload.eventType === 'DELETE') {
            const { content_id } = payload.old;
            setUserBookmarks(prev => ({ ...prev, [content_id]: false }));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);
  
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
    if (!userId || itemIds.length === 0) return;
    
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
      return null;
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
        
        // Update counter in the appropriate table
        const tableName = contentTypeStr === 'knowledge' 
          ? 'knowledge_entries' 
          : contentTypeStr === 'media' 
            ? 'media_posts' 
            : 'quotes';
            
        // Update the likes count directly
        await supabase
          .from(tableName)
          .update({ likes: supabase.sql`likes - 1` })
          .eq('id', id);
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
        
        // Update counter in the appropriate table
        const tableName = contentTypeStr === 'knowledge' 
          ? 'knowledge_entries' 
          : contentTypeStr === 'media' 
            ? 'media_posts' 
            : 'quotes';
            
        // Update the likes count directly
        await supabase
          .from(tableName)
          .update({ likes: supabase.sql`likes + 1` })
          .eq('id', id);
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
      return null;
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
        
        // Update counter if it's a quote
        if (contentTypeStr === 'quote') {
          await supabase
            .from('quotes')
            .update({ bookmarks: supabase.sql`bookmarks - 1` })
            .eq('id', id);
        }
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
        
        // Update counter if it's a quote
        if (contentTypeStr === 'quote') {
          await supabase
            .from('quotes')
            .update({ bookmarks: supabase.sql`bookmarks + 1` })
            .eq('id', id);
        }
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
