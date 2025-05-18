
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';

interface ContentInteractionOptions {
  contentType: string;
  interactionType: 'like' | 'bookmark' | 'view';
}

export const useContentInteraction = ({ contentType, interactionType }: ContentInteractionOptions) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [interactionCount, setInteractionCount] = useState(0);

  // Check if user has interacted with content
  const checkInteraction = async (contentId: string): Promise<boolean> => {
    if (!user) return false;
    setIsLoading(true);
    
    try {
      // Use safe table names
      let tableName: 'content_likes' | 'content_bookmarks' = 'content_likes';
      
      if (interactionType === 'like') {
        tableName = 'content_likes';
      } else if (interactionType === 'bookmark') {
        tableName = 'content_bookmarks';
      } else {
        // Views are handled differently, we'll use content_likes as fallback
        tableName = 'content_likes';
      }
      
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .eq('content_id', contentId)
        .eq('user_id', user.id)
        .eq('content_type', contentType)
        .maybeSingle();
        
      if (!error) {
        const result = !!data;
        setHasInteracted(result);
        return result;
      }
    } catch (err) {
      console.error(`Error checking ${interactionType} status:`, err);
    } finally {
      setIsLoading(false);
    }
    return false;
  };

  // Toggle interaction status
  const toggleInteraction = async (contentId: string): Promise<void> => {
    if (!user) return;
    setIsLoading(true);
    
    try {
      // Use safe table names
      let tableName: 'content_likes' | 'content_bookmarks' = 'content_likes';
      
      if (interactionType === 'like') {
        tableName = 'content_likes';
      } else if (interactionType === 'bookmark') {
        tableName = 'content_bookmarks';
      } else {
        // We won't toggle views, so use content_likes as fallback
        tableName = 'content_likes';
      }
      
      if (hasInteracted) {
        // Remove interaction
        const { error } = await supabase
          .from(tableName)
          .delete()
          .eq('content_id', contentId)
          .eq('user_id', user.id)
          .eq('content_type', contentType);
          
        if (error) throw error;
        
        // Update local state
        setHasInteracted(false);
        setInteractionCount(prev => Math.max(0, prev - 1));
      } else {
        // Add interaction
        const { error } = await supabase
          .from(tableName)
          .insert({
            content_id: contentId,
            user_id: user.id,
            content_type: contentType
          });
          
        if (error) throw error;
        
        // Update local state
        setHasInteracted(true);
        setInteractionCount(prev => prev + 1);
      }
    } catch (err) {
      console.error(`Error toggling ${interactionType}:`, err);
    } finally {
      setIsLoading(false);
    }
  };

  // Get interaction count
  const fetchInteractionCount = async (contentId: string): Promise<void> => {
    setIsLoading(true);
    try {
      // Use safe table names
      let tableName: 'content_likes' | 'content_bookmarks' = 'content_likes';
      
      if (interactionType === 'like') {
        tableName = 'content_likes';
      } else if (interactionType === 'bookmark') {
        tableName = 'content_bookmarks';
      } else {
        // For view counts, use content_likes as fallback
        tableName = 'content_likes';
      }
      
      const { count, error } = await supabase
        .from(tableName)
        .select('*', { count: 'exact' })
        .eq('content_id', contentId)
        .eq('content_type', contentType);
        
      if (!error && count !== null) {
        setInteractionCount(count);
      }
    } catch (err) {
      console.error(`Error fetching ${interactionType} count:`, err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    hasInteracted,
    interactionCount,
    toggleInteraction,
    checkInteraction,
    fetchInteractionCount,
    isLoading
  };
};
