
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
  
  // Get the like table name (quote_likes or content_likes)
  const getLikeTable = (type: ContentType): string => {
    return type === 'quote' ? 'quote_likes' : 'content_likes';
  };
  
  // Get the bookmark table name (quote_bookmarks or content_bookmarks)
  const getBookmarkTable = (type: ContentType): string => {
    return type === 'quote' ? 'quote_bookmarks' : 'content_bookmarks';
  };
  
  // Get the ID field name (quote_id or content_id)
  const getIdField = (type: ContentType): string => {
    return type === 'quote' ? 'quote_id' : 'content_id';
  };

  // Check if user has already liked or bookmarked
  useEffect(() => {
    const checkUserInteractions = async () => {
      if (!user || !contentId) return;
      
      try {
        const likeTable = getLikeTable(contentType);
        const bookmarkTable = getBookmarkTable(contentType);
        const idField = getIdField(contentType);
        const contentTypeField = contentType !== 'quote' ? { content_type: contentType } : {};
        
        // Check likes
        const { data: likeData, error: likeError } = await supabase
          .from(likeTable)
          .select('id')
          .eq(idField, contentId)
          .eq('user_id', user.id)
          .eq(...(contentType !== 'quote' ? ['content_type', contentType] : [] as any))
          .maybeSingle();
          
        if (!likeError) {
          setIsLiked(!!likeData);
        } else {
          console.error(`Error checking like status in ${likeTable}:`, likeError);
        }
        
        // Check bookmarks
        const { data: bookmarkData, error: bookmarkError } = await supabase
          .from(bookmarkTable)
          .select('id')
          .eq(idField, contentId)
          .eq('user_id', user.id)
          .eq(...(contentType !== 'quote' ? ['content_type', contentType] : [] as any))
          .maybeSingle();
          
        if (!bookmarkError) {
          setIsBookmarked(!!bookmarkData);
        } else {
          console.error(`Error checking bookmark status in ${bookmarkTable}:`, bookmarkError);
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
      const likeTable = getLikeTable(contentType);
      const idField = getIdField(contentType);
      
      if (isLiked) {
        // Unlike content
        const { error } = await supabase
          .from(likeTable)
          .delete()
          .eq(idField, contentId)
          .eq('user_id', user.id)
          .eq(...(contentType !== 'quote' ? ['content_type', contentType] : [] as any));
          
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
        const insertData = contentType === 'quote' 
          ? { quote_id: contentId, user_id: user.id } 
          : { content_id: contentId, user_id: user.id, content_type: contentType };
          
        const { error } = await supabase
          .from(likeTable)
          .insert(insertData);
          
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
      const bookmarkTable = getBookmarkTable(contentType);
      const idField = getIdField(contentType);
      
      if (isBookmarked) {
        // Remove bookmark
        const { error } = await supabase
          .from(bookmarkTable)
          .delete()
          .eq(idField, contentId)
          .eq('user_id', user.id)
          .eq(...(contentType !== 'quote' ? ['content_type', contentType] : [] as any));
          
        if (error) throw error;
        
        // Only quotes track bookmark counts
        if (contentType === 'quote') {
          await supabase.rpc('decrement_counter_fn', {
            row_id: contentId,
            column_name: 'bookmarks',
            table_name: tableName
          });
          
          setBookmarkCount(prev => Math.max(prev - 1, 0));
        }
        
        setIsBookmarked(false);
        toast({ description: 'Bookmark removed' });
      } else {
        // Add bookmark
        const insertData = contentType === 'quote' 
          ? { quote_id: contentId, user_id: user.id } 
          : { content_id: contentId, user_id: user.id, content_type: contentType };
          
        const { error } = await supabase
          .from(bookmarkTable)
          .insert(insertData);
          
        if (error) throw error;
        
        // Only quotes track bookmark counts
        if (contentType === 'quote') {
          await supabase.rpc('increment_counter_fn', {
            row_id: contentId,
            column_name: 'bookmarks',
            table_name: tableName
          });
          
          setBookmarkCount(prev => prev + 1);
        }
        
        setIsBookmarked(true);
        toast({ description: 'Content bookmarked!' });
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
