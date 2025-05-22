
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/auth';

export type ContentType = 'forum' | 'quote' | 'media' | 'knowledge' | 'wiki' | 'ai';

interface UseUserContentInteractionsProps {
  contentId: string;
  contentType: ContentType;
  initialLikeCount?: number;
  initialBookmarkCount?: number;
}

/**
 * Hook for handling user interactions with content (likes, bookmarks)
 */
export const useUserContentInteractions = ({
  contentId,
  contentType,
  initialLikeCount = 0,
  initialBookmarkCount = 0
}: UseUserContentInteractionsProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [bookmarkCount, setBookmarkCount] = useState(initialBookmarkCount);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get the table name for this content type
  const getTableName = (type: ContentType): string => {
    switch (type) {
      case 'forum':
        return 'forum_posts';
      case 'quote':
        return 'quotes';
      case 'media':
        return 'media_posts';
      case 'knowledge':
        return 'knowledge_entries';
      case 'wiki':
        return 'wiki_articles';
      case 'ai':
        return 'ai_content';
      default:
        return 'forum_posts';
    }
  };

  // Get the likes column name for this content type
  const getLikeColumnName = (type: ContentType): string => {
    return type === 'forum' ? 'upvotes' : 'likes';
  };

  // Check if user has already liked or bookmarked
  useEffect(() => {
    const checkUserInteractions = async () => {
      if (!user || !contentId) return;
      
      try {
        // Check likes
        const { data: likeData, error: likeError } = await supabase
          .from('content_likes')
          .select('id')
          .eq('content_id', contentId)
          .eq('user_id', user.id)
          .eq('content_type', contentType)
          .maybeSingle();
          
        if (!likeError) {
          setIsLiked(!!likeData);
        } else {
          console.error('Error checking like status:', likeError);
        }
        
        // Check bookmarks
        const { data: bookmarkData, error: bookmarkError } = await supabase
          .from('content_bookmarks')
          .select('id')
          .eq('content_id', contentId)
          .eq('user_id', user.id)
          .eq('content_type', contentType)
          .maybeSingle();
          
        if (!bookmarkError) {
          setIsBookmarked(!!bookmarkData);
        } else {
          console.error('Error checking bookmark status:', bookmarkError);
        }
      } catch (err) {
        console.error('Error checking user interactions:', err);
      }
    };
    
    checkUserInteractions();
  }, [contentId, contentType, user]);

  // Handle like/unlike with consistent RPC function names
  const toggleLike = async (): Promise<boolean> => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to like content",
        variant: "destructive",
      });
      return false;
    }
    
    setIsSubmitting(true);
    try {
      const likeColumnName = getLikeColumnName(contentType);
      const tableName = getTableName(contentType);
      
      if (isLiked) {
        // Unlike content
        const { data, error } = await supabase
          .from('content_likes')
          .delete()
          .eq('content_id', contentId)
          .eq('user_id', user.id)
          .eq('content_type', contentType);
          
        if (error) throw error;
        
        // Decrement like count with consistent function name
        await supabase.rpc('decrement_counter_fn', {
          row_id: contentId,
          column_name: likeColumnName,
          table_name: tableName
        });
        
        setLikeCount(prev => Math.max(prev - 1, 0));
        setIsLiked(false);
        toast({ description: 'Like removed' });
      } else {
        // Like content
        const { data, error } = await supabase
          .from('content_likes')
          .insert({
            content_id: contentId,
            user_id: user.id,
            content_type: contentType
          });
          
        if (error) throw error;
        
        // Increment like count with consistent function name
        await supabase.rpc('increment_counter_fn', {
          row_id: contentId,
          column_name: likeColumnName,
          table_name: tableName
        });
        
        setLikeCount(prev => prev + 1);
        setIsLiked(true);
        toast({ description: 'Content liked!' });
      }
      
      return true;
    } catch (error) {
      console.error('Error toggling like:', error);
      toast({
        title: "Error",
        description: "Failed to update like status",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle bookmark/unbookmark with consistent RPC function names
  const toggleBookmark = async (): Promise<boolean> => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to bookmark content",
        variant: "destructive",
      });
      return false;
    }
    
    setIsSubmitting(true);
    try {
      const tableName = getTableName(contentType);
      
      if (isBookmarked) {
        // Remove bookmark
        const { data, error } = await supabase
          .from('content_bookmarks')
          .delete()
          .eq('content_id', contentId)
          .eq('user_id', user.id)
          .eq('content_type', contentType);
          
        if (error) throw error;
        
        // Decrement bookmark count if applicable with consistent function name
        if (contentType === 'quote') {
          await supabase.rpc('decrement_counter_fn', {
            row_id: contentId,
            column_name: 'bookmarks',
            table_name: tableName
          });
        }
        
        setBookmarkCount(prev => Math.max(prev - 1, 0));
        setIsBookmarked(false);
        toast({ description: 'Bookmark removed' });
      } else {
        // Add bookmark
        const { data, error } = await supabase
          .from('content_bookmarks')
          .insert({
            content_id: contentId,
            user_id: user.id,
            content_type: contentType
          });
          
        if (error) throw error;
        
        // Increment bookmark count if applicable with consistent function name
        if (contentType === 'quote') {
          await supabase.rpc('increment_counter_fn', {
            row_id: contentId,
            column_name: 'bookmarks',
            table_name: tableName
          });
        }
        
        setBookmarkCount(prev => prev + 1);
        setIsBookmarked(true);
        toast({ description: 'Content bookmarked!' });
      }
      
      return true;
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      toast({
        title: "Error",
        description: "Failed to update bookmark status",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isLiked,
    isBookmarked,
    likeCount,
    bookmarkCount,
    isSubmitting,
    toggleLike,
    toggleBookmark
  };
};
