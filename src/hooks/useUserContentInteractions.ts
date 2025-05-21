
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/auth';

interface UseUserContentInteractionsProps {
  contentId: string;
  contentType: 'forum' | 'quote' | 'media' | 'knowledge' | 'wiki';
  initialLikeCount?: number;
  initialBookmarkCount?: number;
}

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
  const getTableName = (type: string): string => {
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
      default:
        return 'forum_posts';
    }
  };

  // Check if user has already liked or bookmarked
  useEffect(() => {
    const checkUserInteractions = async () => {
      if (!user) return;
      
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
        }
      } catch (err) {
        console.error('Error checking user interactions:', err);
      }
    };
    
    checkUserInteractions();
  }, [contentId, contentType, user]);

  // Handle like/unlike
  const toggleLike = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to like content",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      if (isLiked) {
        // Unlike content
        const { data, error } = await supabase
          .from('content_likes')
          .delete()
          .eq('content_id', contentId)
          .eq('user_id', user.id)
          .eq('content_type', contentType);
          
        if (error) throw error;
        
        // Decrement like count
        await supabase.rpc('decrement_counter_fn', {
          row_id: contentId,
          column_name: 'likes',
          table_name: getTableName(contentType)
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
        
        // Increment like count
        await supabase.rpc('increment_counter_fn', {
          row_id: contentId,
          column_name: 'likes',
          table_name: getTableName(contentType)
        });
        
        setLikeCount(prev => prev + 1);
        setIsLiked(true);
        toast({ description: 'Content liked!' });
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      toast({
        title: "Error",
        description: "Failed to update like status",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle bookmark/unbookmark
  const toggleBookmark = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to bookmark content",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      if (isBookmarked) {
        // Remove bookmark
        const { data, error } = await supabase
          .from('content_bookmarks')
          .delete()
          .eq('content_id', contentId)
          .eq('user_id', user.id)
          .eq('content_type', contentType);
          
        if (error) throw error;
        
        // Decrement bookmark count if applicable
        if (contentType === 'quote') {
          await supabase.rpc('decrement_counter_fn', {
            row_id: contentId,
            column_name: 'bookmarks',
            table_name: 'quotes'
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
        
        // Increment bookmark count if applicable
        if (contentType === 'quote') {
          await supabase.rpc('increment_counter_fn', {
            row_id: contentId,
            column_name: 'bookmarks',
            table_name: 'quotes'
          });
        }
        
        setBookmarkCount(prev => prev + 1);
        setIsBookmarked(true);
        toast({ description: 'Content bookmarked!' });
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      toast({
        title: "Error",
        description: "Failed to update bookmark status",
        variant: "destructive",
      });
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
