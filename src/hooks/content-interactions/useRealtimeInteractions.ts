import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getContentKey } from './contentTypeUtils';
import { RealtimeChannel } from '@supabase/supabase-js';

/**
 * Hook for realtime updates to interactions (likes and bookmarks)
 */
export const useRealtimeInteractions = (
  userId?: string | null,
  setUserLikes: React.Dispatch<React.SetStateAction<Record<string, boolean>>> = () => {},
  setUserBookmarks: React.Dispatch<React.SetStateAction<Record<string, boolean>>> = () => {},
) => {
  // Keep track of the subscription status to avoid duplicates
  const channelRef = useRef<RealtimeChannel | null>(null);
  
  // Subscribe to realtime updates
  useEffect(() => {
    if (!userId) return;
    
    // Helper to setup channel with retry logic
    const setupChannel = (retries = 3, delay = 1000) => {
      try {
        // Clean up existing channel if it exists
        if (channelRef.current) {
          supabase.removeChannel(channelRef.current);
          channelRef.current = null;
        }
        
        // Create a new channel
        const channel = supabase.channel('content-interactions');
        
        // Listen for quote likes changes
        channel.on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'quote_likes',
            filter: `user_id=eq.${userId}`
          },
          (payload) => {
            // Handle quote likes updates
            if (payload.eventType === 'INSERT') {
              const { quote_id } = payload.new;
              setUserLikes(prev => ({
                ...prev,
                [quote_id]: true,
                [`quote:${quote_id}`]: true
              }));
            } else if (payload.eventType === 'DELETE') {
              const { quote_id } = payload.old;
              setUserLikes(prev => ({
                ...prev,
                [quote_id]: false,
                [`quote:${quote_id}`]: false
              }));
            }
          }
        );
        
        // Listen for quote bookmarks changes
        channel.on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'quote_bookmarks',
            filter: `user_id=eq.${userId}`
          },
          (payload) => {
            // Handle quote bookmarks updates
            if (payload.eventType === 'INSERT') {
              const { quote_id } = payload.new;
              setUserBookmarks(prev => ({
                ...prev,
                [quote_id]: true,
                [`quote:${quote_id}`]: true
              }));
            } else if (payload.eventType === 'DELETE') {
              const { quote_id } = payload.old;
              setUserBookmarks(prev => ({
                ...prev,
                [quote_id]: false,
                [`quote:${quote_id}`]: false
              }));
            }
          }
        );
        
        // Listen for content likes changes
        channel.on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'content_likes',
            filter: `user_id=eq.${userId}`
          },
          (payload) => {
            // Handle content likes updates
            if (payload.eventType === 'INSERT') {
              const { content_id, content_type } = payload.new;
              const key = getContentKey(content_id, content_type);
              
              setUserLikes(prev => ({
                ...prev,
                [content_id]: true,
                [key]: true
              }));
            } else if (payload.eventType === 'DELETE') {
              const { content_id, content_type } = payload.old;
              const key = getContentKey(content_id, content_type);
              
              setUserLikes(prev => ({
                ...prev,
                [content_id]: false,
                [key]: false
              }));
            }
          }
        );
        
        // Listen for content bookmarks changes
        channel.on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'content_bookmarks',
            filter: `user_id=eq.${userId}`
          },
          (payload) => {
            // Handle content bookmarks updates
            if (payload.eventType === 'INSERT') {
              const { content_id, content_type } = payload.new;
              const key = getContentKey(content_id, content_type);
              
              setUserBookmarks(prev => ({
                ...prev,
                [content_id]: true,
                [key]: true
              }));
            } else if (payload.eventType === 'DELETE') {
              const { content_id, content_type } = payload.old;
              const key = getContentKey(content_id, content_type);
              
              setUserBookmarks(prev => ({
                ...prev,
                [content_id]: false,
                [key]: false
              }));
            }
          }
        );
        
        // Subscribe to the channel and store the reference
        channel.subscribe(status => {
          if (status === 'SUBSCRIBED') {
            console.log('Successfully subscribed to content interactions channel');
            channelRef.current = channel;
          } else if (status === 'CHANNEL_ERROR' && retries > 0) {
            console.warn(`Channel error, retrying... (${retries} attempts remaining)`);
            // Retry with exponential backoff
            setTimeout(() => {
              setupChannel(retries - 1, delay * 2);
            }, delay);
          } else if (status === 'TIMED_OUT' && retries > 0) {
            console.warn(`Channel timed out, retrying... (${retries} attempts remaining)`);
            // Retry with exponential backoff
            setTimeout(() => {
              setupChannel(retries - 1, delay * 2);
            }, delay);
          }
        });
      } catch (error) {
        console.error('Failed to set up realtime channel:', error);
        // Retry on error if we have retries left
        if (retries > 0) {
          console.warn(`Error setting up channel, retrying... (${retries} attempts remaining)`);
          setTimeout(() => {
            setupChannel(retries - 1, delay * 2);
          }, delay);
        }
      }
    };
    
    // Initial setup
    setupChannel();
    
    // Clean up subscription on unmount
    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [userId, setUserLikes, setUserBookmarks]);
};
