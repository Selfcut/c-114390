
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

interface RealtimeLikePayload {
  content_id?: string;
  quote_id?: string;
}

export const useRealtimeInteractions = (
  userId?: string | null,
  setUserLikes: React.Dispatch<React.SetStateAction<Record<string, boolean>>> = () => {},
  setUserBookmarks: React.Dispatch<React.SetStateAction<Record<string, boolean>>> = () => {}
) => {
  // Subscribe to realtime updates for content interactions
  useEffect(() => {
    if (!userId) return;

    // Create channels for different interaction tables
    const channels: RealtimeChannel[] = [];
    
    // Generate unique channel names using user ID to prevent conflicts
    const userHashId = userId.substring(0, 8);

    // Channel for content likes
    const contentLikesChannel = supabase
      .channel(`content-likes-${userHashId}`)
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'content_likes', filter: `user_id=eq.${userId}` },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const { content_id } = payload.new as RealtimeLikePayload;
            if (content_id) {
              setUserLikes(prev => ({ ...prev, [content_id]: true }));
            }
          } else if (payload.eventType === 'DELETE') {
            const { content_id } = payload.old as RealtimeLikePayload;
            if (content_id) {
              setUserLikes(prev => ({ ...prev, [content_id]: false }));
            }
          }
        }
      )
      .subscribe((status) => {
        if (status !== 'SUBSCRIBED') {
          console.error('Failed to subscribe to content_likes channel:', status);
        }
      });
      
    channels.push(contentLikesChannel);
    
    // Channel for content bookmarks
    const contentBookmarksChannel = supabase
      .channel(`content-bookmarks-${userHashId}`)
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'content_bookmarks', filter: `user_id=eq.${userId}` },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const { content_id } = payload.new as RealtimeLikePayload;
            if (content_id) {
              setUserBookmarks(prev => ({ ...prev, [content_id]: true }));
            }
          } else if (payload.eventType === 'DELETE') {
            const { content_id } = payload.old as RealtimeLikePayload;
            if (content_id) {
              setUserBookmarks(prev => ({ ...prev, [content_id]: false }));
            }
          }
        }
      )
      .subscribe((status) => {
        if (status !== 'SUBSCRIBED') {
          console.error('Failed to subscribe to content_bookmarks channel:', status);
        }
      });
      
    channels.push(contentBookmarksChannel);
    
    // Channel for quote likes
    const quoteLikesChannel = supabase
      .channel(`quote-likes-${userHashId}`)
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'quote_likes', filter: `user_id=eq.${userId}` },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const { quote_id } = payload.new as RealtimeLikePayload;
            if (quote_id) {
              setUserLikes(prev => ({ ...prev, [quote_id]: true }));
            }
          } else if (payload.eventType === 'DELETE') {
            const { quote_id } = payload.old as RealtimeLikePayload;
            if (quote_id) {
              setUserLikes(prev => ({ ...prev, [quote_id]: false }));
            }
          }
        }
      )
      .subscribe((status) => {
        if (status !== 'SUBSCRIBED') {
          console.error('Failed to subscribe to quote_likes channel:', status);
        }
      });
      
    channels.push(quoteLikesChannel);
    
    // Channel for quote bookmarks
    const quoteBookmarksChannel = supabase
      .channel(`quote-bookmarks-${userHashId}`)
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'quote_bookmarks', filter: `user_id=eq.${userId}` },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const { quote_id } = payload.new as RealtimeLikePayload;
            if (quote_id) {
              setUserBookmarks(prev => ({ ...prev, [quote_id]: true }));
            }
          } else if (payload.eventType === 'DELETE') {
            const { quote_id } = payload.old as RealtimeLikePayload;
            if (quote_id) {
              setUserBookmarks(prev => ({ ...prev, [quote_id]: false }));
            }
          }
        }
      )
      .subscribe((status) => {
        if (status !== 'SUBSCRIBED') {
          console.error('Failed to subscribe to quote_bookmarks channel:', status);
        }
      });
      
    channels.push(quoteBookmarksChannel);

    // Clean up all channels on unmount
    return () => {
      channels.forEach(channel => {
        supabase.removeChannel(channel);
      });
    };
  }, [userId, setUserLikes, setUserBookmarks]);
};
