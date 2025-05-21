
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';

interface UseUserContentInteractionsProps {
  contentId: string;
  contentType: 'forum' | 'media' | 'wiki' | 'knowledge' | 'quote';
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
  
  // Check if the user has already liked or bookmarked the content
  useEffect(() => {
    const checkUserInteractions = async () => {
      if (!user || !contentId) return;
      
      try {
        // Check if user already liked this content
        const { data: existingLike, error: likeError } = await supabase
          .from('content_likes')
          .select('*')
          .eq('content_id', contentId)
          .eq('user_id', user.id)
          .eq('content_type', contentType)
          .maybeSingle();
          
        if (!likeError) {
          setIsLiked(!!existingLike);
        } else {
          console.error('Error checking like status:', likeError);
        }
        
        // Check if user already bookmarked this content
        const { data: existingBookmark, error: bookmarkError } = await supabase
          .from('content_bookmarks')
          .select('*')
          .eq('content_id', contentId)
          .eq('user_id', user.id)
          .eq('content_type', contentType)
          .maybeSingle();
          
        if (!bookmarkError) {
          setIsBookmarked(!!existingBookmark);
        } else {
          console.error('Error checking bookmark status:', bookmarkError);
        }
      } catch (error) {
        console.error('Error checking user interactions:', error);
      }
    };
    
    checkUserInteractions();
  }, [contentId, contentType, user]);
  
  // Toggle like function
  const toggleLike = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to like content",
        variant: "destructive"
      });
      return;
    }
    
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    try {
      if (isLiked) {
        // User already liked, so remove the like
        const { error } = await supabase
          .from('content_likes')
          .delete()
          .eq('content_id', contentId)
          .eq('user_id', user.id)
          .eq('content_type', contentType);
          
        if (error) throw error;
        
        // Update like count in appropriate table
        await supabase.rpc('decrement_counter_fn', {
          row_id: contentId,
          column_name: 'upvotes',
          table_name: `${contentType}_posts`
        });
        
        setLikeCount(prev => Math.max(prev - 1, 0));
        setIsLiked(false);
        
        toast({
          description: "Like removed",
        });
      } else {
        // Add new like
        const { error } = await supabase
          .from('content_likes')
          .insert({
            content_id: contentId,
            user_id: user.id,
            content_type: contentType
          });
          
        if (error) throw error;
        
        // Update like count in appropriate table
        await supabase.rpc('increment_counter_fn', {
          row_id: contentId,
          column_name: 'upvotes',
          table_name: `${contentType}_posts`
        });
        
        setLikeCount(prev => prev + 1);
        setIsLiked(true);
        
        toast({
          description: "Content liked",
        });
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      toast({
        title: "Error",
        description: "Failed to update like status",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Toggle bookmark function
  const toggleBookmark = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to bookmark content",
        variant: "destructive"
      });
      return;
    }
    
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    try {
      if (isBookmarked) {
        // User already bookmarked, so remove the bookmark
        const { error } = await supabase
          .from('content_bookmarks')
          .delete()
          .eq('content_id', contentId)
          .eq('user_id', user.id)
          .eq('content_type', contentType);
          
        if (error) throw error;
        
        setBookmarkCount(prev => Math.max(prev - 1, 0));
        setIsBookmarked(false);
        
        toast({
          description: "Bookmark removed",
        });
      } else {
        // Add new bookmark
        const { error } = await supabase
          .from('content_bookmarks')
          .insert({
            content_id: contentId,
            user_id: user.id,
            content_type: contentType
          });
          
        if (error) throw error;
        
        setBookmarkCount(prev => prev + 1);
        setIsBookmarked(true);
        
        toast({
          description: "Content bookmarked",
        });
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      toast({
        title: "Error",
        description: "Failed to update bookmark status",
        variant: "destructive"
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
