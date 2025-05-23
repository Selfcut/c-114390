
import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';
import { getContentKey } from './contentTypeUtils';

interface RealtimeLikePayload {
  content_id?: string;
  quote_id?: string;
  content_type?: string;
}

export const useRealtimeInteractions = (
  userId?: string | null,
  setUserLikes: React.Dispatch<React.SetStateAction<Record<string, boolean>>> = () => {},
  setUserBookmarks: React.Dispatch<React.SetStateAction<Record<string, boolean>>> = () => {}
) => {
  // Use ref to store channels to prevent unnecessary effect reruns
  const channelsRef = useRef<RealtimeChannel[]>([]);

  // Subscribe to realtime updates for content interactions
  useEffect(() => {
    if (!userId) return;

    // Generate unique channel names using user ID to prevent conflicts
    const userHashId = userId.substring(0, 8);
    const errorHandlers: Record<string, RetryHandler> = {};
    
    // Clear any existing channels
    if (channelsRef.current.length > 0) {
      channelsRef.current.forEach(channel => {
        try {
          supabase.removeChannel(channel);
        } catch (e) {
          console.error('Error removing channel:', e);
        }
      });
      channelsRef.current = [];
    }

    // Channel for content likes
    const contentLikesChannel = supabase
      .channel(`content-likes-${userHashId}`)
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'content_likes', filter: `user_id=eq.${userId}` },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const { content_id, content_type } = payload.new as RealtimeLikePayload;
            if (content_id && content_type) {
              const key = getContentKey(content_id, content_type);
              setUserLikes(prev => ({ 
                ...prev, 
                [key]: true,
                [content_id]: true // For backward compatibility
              }));
            }
          } else if (payload.eventType === 'DELETE') {
            const { content_id, content_type } = payload.old as RealtimeLikePayload;
            if (content_id && content_type) {
              const key = getContentKey(content_id, content_type);
              setUserLikes(prev => ({ 
                ...prev, 
                [key]: false,
                [content_id]: false // For backward compatibility
              }));
            }
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          // Reset error handler on successful subscription
          if (errorHandlers['content-likes']) {
            errorHandlers['content-likes'].reset();
          }
        } else if (status === 'CHANNEL_ERROR') {
          // Handle error with exponential backoff
          if (!errorHandlers['content-likes']) {
            errorHandlers['content-likes'] = new RetryHandler(() => {
              // Recreate the channel on error
              try {
                supabase.removeChannel(contentLikesChannel);
                channelsRef.current = channelsRef.current.filter(c => c !== contentLikesChannel);
                
                // This would recreate the channel, but we'll skip it for now to avoid infinite loops
                console.error('Failed to subscribe to content_likes channel');
              } catch (e) {
                console.error('Error handling channel retry:', e);
              }
            });
          }
          
          errorHandlers['content-likes'].retry();
        }
      });
      
    channelsRef.current.push(contentLikesChannel);
    
    // Channel for content bookmarks
    const contentBookmarksChannel = supabase
      .channel(`content-bookmarks-${userHashId}`)
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'content_bookmarks', filter: `user_id=eq.${userId}` },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const { content_id, content_type } = payload.new as RealtimeLikePayload;
            if (content_id && content_type) {
              const key = getContentKey(content_id, content_type);
              setUserBookmarks(prev => ({ 
                ...prev, 
                [key]: true,
                [content_id]: true // For backward compatibility
              }));
            }
          } else if (payload.eventType === 'DELETE') {
            const { content_id, content_type } = payload.old as RealtimeLikePayload;
            if (content_id && content_type) {
              const key = getContentKey(content_id, content_type);
              setUserBookmarks(prev => ({ 
                ...prev, 
                [key]: false,
                [content_id]: false // For backward compatibility
              }));
            }
          }
        }
      )
      .subscribe((status) => {
        if (status !== 'SUBSCRIBED' && status === 'CHANNEL_ERROR') {
          console.error('Failed to subscribe to content_bookmarks channel:', status);
        }
      });
      
    channelsRef.current.push(contentBookmarksChannel);
    
    // Channel for quote likes
    const quoteLikesChannel = supabase
      .channel(`quote-likes-${userHashId}`)
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'quote_likes', filter: `user_id=eq.${userId}` },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const { quote_id } = payload.new as RealtimeLikePayload;
            if (quote_id) {
              const key = getContentKey(quote_id, 'quote');
              setUserLikes(prev => ({ 
                ...prev, 
                [key]: true,
                [quote_id]: true // For backward compatibility
              }));
            }
          } else if (payload.eventType === 'DELETE') {
            const { quote_id } = payload.old as RealtimeLikePayload;
            if (quote_id) {
              const key = getContentKey(quote_id, 'quote');
              setUserLikes(prev => ({ 
                ...prev, 
                [key]: false,
                [quote_id]: false // For backward compatibility
              }));
            }
          }
        }
      )
      .subscribe((status) => {
        if (status !== 'SUBSCRIBED' && status === 'CHANNEL_ERROR') {
          console.error('Failed to subscribe to quote_likes channel:', status);
        }
      });
      
    channelsRef.current.push(quoteLikesChannel);
    
    // Channel for quote bookmarks
    const quoteBookmarksChannel = supabase
      .channel(`quote-bookmarks-${userHashId}`)
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'quote_bookmarks', filter: `user_id=eq.${userId}` },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const { quote_id } = payload.new as RealtimeLikePayload;
            if (quote_id) {
              const key = getContentKey(quote_id, 'quote');
              setUserBookmarks(prev => ({ 
                ...prev, 
                [key]: true,
                [quote_id]: true // For backward compatibility
              }));
            }
          } else if (payload.eventType === 'DELETE') {
            const { quote_id } = payload.old as RealtimeLikePayload;
            if (quote_id) {
              const key = getContentKey(quote_id, 'quote');
              setUserBookmarks(prev => ({ 
                ...prev, 
                [key]: false,
                [quote_id]: false // For backward compatibility
              }));
            }
          }
        }
      )
      .subscribe((status) => {
        if (status !== 'SUBSCRIBED' && status === 'CHANNEL_ERROR') {
          console.error('Failed to subscribe to quote_bookmarks channel:', status);
        }
      });
      
    channelsRef.current.push(quoteBookmarksChannel);

    // Clean up all channels on unmount
    return () => {
      channelsRef.current.forEach(channel => {
        try {
          supabase.removeChannel(channel);
        } catch (e) {
          console.error('Error removing channel on cleanup:', e);
        }
      });
      channelsRef.current = [];
    };
  }, [userId, setUserLikes, setUserBookmarks]);
};

// Helper class for handling retries with exponential backoff
class RetryHandler {
  private retryCount: number = 0;
  private maxRetries: number = 5;
  private baseDelay: number = 1000; // 1 second
  private timeoutId: number | null = null;
  private callback: () => void;

  constructor(callback: () => void) {
    this.callback = callback;
  }

  retry(): void {
    if (this.retryCount >= this.maxRetries) {
      console.error('Maximum retry attempts reached');
      return;
    }

    const delay = this.baseDelay * Math.pow(2, this.retryCount);
    this.retryCount++;

    if (this.timeoutId !== null) {
      clearTimeout(this.timeoutId);
    }

    this.timeoutId = setTimeout(() => {
      this.callback();
    }, delay) as unknown as number;
  }

  reset(): void {
    this.retryCount = 0;
    if (this.timeoutId !== null) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }
}
