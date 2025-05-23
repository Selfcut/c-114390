
import { useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ContentType } from '@/types/contentTypes';
import { ContentItemType } from '@/components/library/content-items/ContentItemTypes';
import { normalizeContentType } from '@/lib/utils/content-type-utils';

interface UseRealtimeInteractionsProps {
  contentId: string;
  contentType: string | ContentType | ContentItemType;
  onLikeUpdate?: (count: number) => void;
  onBookmarkUpdate?: (count: number) => void;
}

/**
 * Hook for receiving real-time updates on content interactions
 */
export const useRealtimeInteractions = ({
  contentId,
  contentType,
  onLikeUpdate,
  onBookmarkUpdate
}: UseRealtimeInteractionsProps) => {
  const normalizedType = normalizeContentType(contentType);
  
  // Get the content table name based on the type
  const getTableName = useCallback(() => {
    switch (normalizedType) {
      case 'quote':
        return 'quotes';
      case 'forum':
        return 'forum_posts';
      case 'media':
        return 'media_posts';
      case 'wiki':
        return 'wiki_articles';
      case 'knowledge':
        return 'knowledge_entries';
      case 'research':
        return 'research_papers';
      case 'ai':
        return 'ai_content';
      default:
        return 'quotes';
    }
  }, [normalizedType]);
  
  // Subscribe to real-time updates
  useEffect(() => {
    if (!contentId) return;
    
    const tableName = getTableName();
    
    // Subscribe to updates on the content table
    const channel = supabase
      .channel('content-interactions')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: tableName,
          filter: `id=eq.${contentId}`
        },
        (payload) => {
          const newData = payload.new;
          
          // Check if likes were updated
          if (onLikeUpdate && 'likes' in newData) {
            onLikeUpdate(Number(newData.likes || 0));
          } else if (onLikeUpdate && 'upvotes' in newData && normalizedType === 'forum') {
            // Handle forum posts which use 'upvotes' instead of 'likes'
            onLikeUpdate(Number(newData.upvotes || 0));
          }
          
          // Check if bookmarks were updated
          if (onBookmarkUpdate && 'bookmarks' in newData) {
            onBookmarkUpdate(Number(newData.bookmarks || 0));
          }
        }
      )
      .subscribe();
      
    // Clean up subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [contentId, getTableName, onLikeUpdate, onBookmarkUpdate, normalizedType]);
};
