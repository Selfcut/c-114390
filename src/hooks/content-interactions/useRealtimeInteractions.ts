
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useRealtimeInteractions = (
  userId?: string | null,
  setUserLikes: React.Dispatch<React.SetStateAction<Record<string, boolean>>> = () => {},
  setUserBookmarks: React.Dispatch<React.SetStateAction<Record<string, boolean>>> = () => {}
) => {
  // Subscribe to realtime updates for content interactions
  useEffect(() => {
    if (!userId) return;

    // Channel for general content interactions
    const contentChannel = supabase
      .channel('content-interactions')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'content_likes', filter: `user_id=eq.${userId}` },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const { content_id } = payload.new as { content_id: string };
            if (content_id) {
              setUserLikes(prev => ({ ...prev, [content_id]: true }));
            }
          } else if (payload.eventType === 'DELETE') {
            const { content_id } = payload.old as { content_id: string };
            if (content_id) {
              setUserLikes(prev => ({ ...prev, [content_id]: false }));
            }
          }
        }
      )
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'content_bookmarks', filter: `user_id=eq.${userId}` },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const { content_id } = payload.new as { content_id: string };
            if (content_id) {
              setUserBookmarks(prev => ({ ...prev, [content_id]: true }));
            }
          } else if (payload.eventType === 'DELETE') {
            const { content_id } = payload.old as { content_id: string };
            if (content_id) {
              setUserBookmarks(prev => ({ ...prev, [content_id]: false }));
            }
          }
        }
      )
      .subscribe();
      
    // Channel for quote-specific interactions
    const quoteChannel = supabase
      .channel('quote-interactions')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'quote_likes', filter: `user_id=eq.${userId}` },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const { quote_id } = payload.new as { quote_id: string };
            if (quote_id) {
              setUserLikes(prev => ({ ...prev, [quote_id]: true }));
            }
          } else if (payload.eventType === 'DELETE') {
            const { quote_id } = payload.old as { quote_id: string };
            if (quote_id) {
              setUserLikes(prev => ({ ...prev, [quote_id]: false }));
            }
          }
        }
      )
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'quote_bookmarks', filter: `user_id=eq.${userId}` },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const { quote_id } = payload.new as { quote_id: string };
            if (quote_id) {
              setUserBookmarks(prev => ({ ...prev, [quote_id]: true }));
            }
          } else if (payload.eventType === 'DELETE') {
            const { quote_id } = payload.old as { quote_id: string };
            if (quote_id) {
              setUserBookmarks(prev => ({ ...prev, [quote_id]: false }));
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(contentChannel);
      supabase.removeChannel(quoteChannel);
    };
  }, [userId, setUserLikes, setUserBookmarks]);
};
