
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { subscribeToQuoteUpdates, subscribeToQuoteInteractions } from '@/lib/quotes';
import { QuoteWithUser } from '@/lib/quotes/types';

interface UseRealtimeQuotesOptions {
  quoteId?: string | null;
  onQuoteUpdate?: (updatedQuote: QuoteWithUser) => void;
  onInteractionUpdate?: (type: 'like' | 'bookmark', quoteId: string, isActive: boolean) => void;
}

export const useRealtimeQuotes = ({
  quoteId = null,
  onQuoteUpdate,
  onInteractionUpdate
}: UseRealtimeQuotesOptions = {}) => {
  const { user, isAuthenticated } = useAuth();
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    let cleanupFunctions: Array<() => void> = [];

    // Subscribe to quote updates
    const quoteUnsubscribe = subscribeToQuoteUpdates(quoteId, (payload) => {
      if (payload.eventType === 'UPDATE' && onQuoteUpdate) {
        onQuoteUpdate(payload.new as QuoteWithUser);
      }
    });
    
    cleanupFunctions.push(quoteUnsubscribe);

    // Subscribe to interactions if user is authenticated
    if (isAuthenticated && user?.id) {
      const interactionsUnsubscribe = subscribeToQuoteInteractions(
        user.id,
        // Handle like updates
        (payload) => {
          if (onInteractionUpdate) {
            if (payload.eventType === 'INSERT') {
              onInteractionUpdate('like', payload.new.quote_id, true);
            } else if (payload.eventType === 'DELETE') {
              onInteractionUpdate('like', payload.old.quote_id, false);
            }
          }
        },
        // Handle bookmark updates
        (payload) => {
          if (onInteractionUpdate) {
            if (payload.eventType === 'INSERT') {
              onInteractionUpdate('bookmark', payload.new.quote_id, true);
            } else if (payload.eventType === 'DELETE') {
              onInteractionUpdate('bookmark', payload.old.quote_id, false);
            }
          }
        }
      );
      
      cleanupFunctions.push(interactionsUnsubscribe);
    }

    setIsSubscribed(true);

    // Clean up subscriptions on unmount
    return () => {
      cleanupFunctions.forEach(cleanup => cleanup());
    };
  }, [quoteId, user?.id, isAuthenticated, onQuoteUpdate, onInteractionUpdate]);

  return { isSubscribed };
};
