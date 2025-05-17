
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
  }, [userId, setUserLikes, setUserBookmarks]);
};
