
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

export type RealtimeEventType = 'INSERT' | 'UPDATE' | 'DELETE';

export interface RealtimeSubscriptionConfig {
  table: string;
  event?: RealtimeEventType;
  filter?: string;
  onInsert?: (payload: any) => void;
  onUpdate?: (payload: any) => void;
  onDelete?: (payload: any) => void;
  onChange?: (payload: any) => void;
}

class RealtimeManager {
  private channels: Map<string, RealtimeChannel> = new Map();

  subscribe(config: RealtimeSubscriptionConfig): string {
    const channelId = `${config.table}_${Date.now()}_${Math.random()}`;
    
    const channel = supabase.channel(`table-db-changes-${channelId}`);
    
    // Use the correct event type for Supabase realtime
    channel.on(
      'postgres_changes' as any,
      {
        event: config.event || '*',
        schema: 'public',
        table: config.table,
        filter: config.filter
      },
      (payload) => {
        const { eventType } = payload;
        
        // Call specific event handlers
        switch (eventType) {
          case 'INSERT':
            config.onInsert?.(payload);
            break;
          case 'UPDATE':
            config.onUpdate?.(payload);
            break;
          case 'DELETE':
            config.onDelete?.(payload);
            break;
        }
        
        // Call general change handler
        config.onChange?.(payload);
      }
    );

    channel.subscribe();
    this.channels.set(channelId, channel);
    return channelId;
  }

  unsubscribe(channelId: string): void {
    const channel = this.channels.get(channelId);
    if (channel) {
      supabase.removeChannel(channel);
      this.channels.delete(channelId);
    }
  }

  unsubscribeAll(): void {
    for (const [id, channel] of this.channels) {
      supabase.removeChannel(channel);
    }
    this.channels.clear();
  }

  // Presence functionality for user status
  subscribeToPresence(roomId: string, userStatus: any) {
    const channel = supabase.channel(roomId);
    
    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        console.log('Presence sync:', state);
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('User joined:', key, newPresences);
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('User left:', key, leftPresences);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track(userStatus);
        }
      });

    const channelId = `presence_${roomId}`;
    this.channels.set(channelId, channel);
    return channelId;
  }
}

export const realtimeManager = new RealtimeManager();

// React hook for realtime subscriptions
export const useRealtimeSubscription = (config: RealtimeSubscriptionConfig) => {
  const { useEffect } = require('react');
  
  useEffect(() => {
    const channelId = realtimeManager.subscribe(config);
    
    return () => {
      realtimeManager.unsubscribe(channelId);
    };
  }, [config.table, config.event, config.filter]);
};
