
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';

export type ContentType = 'forum' | 'quote' | 'media' | 'knowledge' | 'wiki' | 'ai';

interface UseUserContentInteractionsProps {
  contentId: string;
  contentType: ContentType;
  initialLikeCount?: number;
  initialBookmarkCount?: number;
}

export const useUserContentInteractions = ({
  contentId,
  contentType,
  initialLikeCount = 0,
  initialBookmarkCount = 0,
}: UseUserContentInteractionsProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [bookmarkCount, setBookmarkCount] = useState(initialBookmarkCount);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  
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
        // Handle quote type specially
        if (contentType === 'quote') {
          // Check quote likes
          const { data: likeData, error: likeError } = await supabase
            .from('quote_likes')
            .select('id')
            .eq('quote_id', contentId)
            .eq('user_id', user.id)
            .maybeSingle();
            
          if (!likeError) {
            setIsLiked(!!likeData);
          } else {
            console.error(`Error checking like status in quote_likes:`, likeError);
          }
          
          // Check quote bookmarks
          const { data: bookmarkData, error: bookmarkError } = await supabase
            .from('quote_bookmarks')
            .select('id')
            .eq('quote_id', contentId)
            .eq('user_id', user.id)
            .maybeSingle();
            
          if (!bookmarkError) {
            setIsBookmarked(!!bookmarkData);
          } else {
            console.error(`Error checking bookmark status in quote_bookmarks:`, bookmarkError);
          }
        } else {
          // Check content likes
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
            console.error(`Error checking like status in content_likes:`, likeError);
          }
          
          // Check content bookmarks
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
            console.error(`Error checking bookmark status in content_bookmarks:`, bookmarkError);
          }
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
    
    if (!contentId) return false;
    
    setIsSubmitting(true);
    try {
      const likeColumnName = getLikeColumnName(contentType);
      const tableName = getTableName(contentType);
      
      if (contentType === 'quote') {
        // Handle quote likes
        if (isLiked) {
          // Unlike quote
          const { error } = await supabase
            .from('quote_likes')
            .delete()
            .eq('quote_id', contentId)
            .eq('user_id', user.id);
            
          if (error) throw error;
          
          // Decrement like count
          await supabase.rpc('decrement_counter_fn', {
            row_id: contentId,
            column_name: likeColumnName,
            table_name: tableName
          });
          
          setLikeCount(prev => Math.max(prev - 1, 0));
          setIsLiked(false);
          toast({ description: 'Like removed' });
        } else {
          // Like quote
          const { error } = await supabase
            .from('quote_likes')
            .insert({ 
              quote_id: contentId, 
              user_id: user.id 
            });
            
          if (error) throw error;
          
          // Increment like count
          await supabase.rpc('increment_counter_fn', {
            row_id: contentId,
            column_name: likeColumnName,
            table_name: tableName
          });
          
          setLikeCount(prev => prev + 1);
          setIsLiked(true);
          toast({ description: 'Content liked!' });
        }
      } else {
        // Handle other content types
        if (isLiked) {
          // Unlike content
          const { error } = await supabase
            .from('content_likes')
            .delete()
            .eq('content_id', contentId)
            .eq('user_id', user.id)
            .eq('content_type', contentType);
            
          if (error) throw error;
          
          // Decrement like count
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
          const { error } = await supabase
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
            column_name: likeColumnName,
            table_name: tableName
          });
          
          setLikeCount(prev => prev + 1);
          setIsLiked(true);
          toast({ description: 'Content liked!' });
        }
      }
      
      return !isLiked; // Return the new state
    } catch (error: any) {
      console.error('Error toggling like:', error);
      toast({
        title: "Error",
        description: "Failed to update like status",
        variant: "destructive",
      });
      return isLiked; // Return the current state on error
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
    
    if (!contentId) return false;
    
    setIsSubmitting(true);
    try {
      const tableName = getTableName(contentType);
      
      if (contentType === 'quote') {
        // Handle quote bookmarks
        if (isBookmarked) {
          // Remove bookmark
          const { error } = await supabase
            .from('quote_bookmarks')
            .delete()
            .eq('quote_id', contentId)
            .eq('user_id', user.id);
            
          if (error) throw error;
          
          // Only quotes track bookmark counts
          await supabase.rpc('decrement_counter_fn', {
            row_id: contentId,
            column_name: 'bookmarks',
            table_name: tableName
          });
          
          setBookmarkCount(prev => Math.max(prev - 1, 0));
          setIsBookmarked(false);
          toast({ description: 'Bookmark removed' });
        } else {
          // Add bookmark
          const { error } = await supabase
            .from('quote_bookmarks')
            .insert({ 
              quote_id: contentId, 
              user_id: user.id 
            });
            
          if (error) throw error;
          
          // Only quotes track bookmark counts
          await supabase.rpc('increment_counter_fn', {
            row_id: contentId,
            column_name: 'bookmarks',
            table_name: tableName
          });
          
          setBookmarkCount(prev => prev + 1);
          setIsBookmarked(true);
          toast({ description: 'Content bookmarked!' });
        }
      } else {
        // Handle other content types
        if (isBookmarked) {
          // Remove bookmark
          const { error } = await supabase
            .from('content_bookmarks')
            .delete()
            .eq('content_id', contentId)
            .eq('user_id', user.id)
            .eq('content_type', contentType);
            
          if (error) throw error;
          
          setIsBookmarked(false);
          toast({ description: 'Bookmark removed' });
        } else {
          // Add bookmark
          const { error } = await supabase
            .from('content_bookmarks')
            .insert({ 
              content_id: contentId, 
              user_id: user.id, 
              content_type: contentType 
            });
            
          if (error) throw error;
          
          setIsBookmarked(true);
          toast({ description: 'Content bookmarked!' });
        }
      }
      
      return !isBookmarked; // Return the new state
    } catch (error: any) {
      console.error('Error toggling bookmark:', error);
      toast({
        title: "Error",
        description: "Failed to update bookmark status",
        variant: "destructive",
      });
      return isBookmarked; // Return the current state on error
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
