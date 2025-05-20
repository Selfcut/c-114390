
import { useCallback } from 'react';
import { useAuth } from '@/lib/auth';
import { trackEvent } from '@/lib/analytics';

export function useQuoteAnalytics() {
  const { user } = useAuth();

  const trackQuoteView = useCallback((quoteId: string) => {
    trackEvent('document_view', {
      contentType: 'quote',
      contentId: quoteId,
    });
  }, []);

  const trackQuoteInteraction = useCallback((quoteId: string, interactionType: 'like' | 'bookmark' | 'comment' | 'share' | 'collection_add' | 'collection_remove', metadata: Record<string, any> = {}) => {
    trackEvent('content_interaction', {
      contentType: 'quote',
      contentId: quoteId,
      interactionType,
      ...metadata
    });
  }, []);

  const trackCollectionView = useCallback((collectionId: string | null) => {
    if (collectionId) {
      trackEvent('document_view', {
        contentType: 'quote_collection',
        contentId: collectionId,
      });
    } else {
      trackEvent('document_view', {
        contentType: 'all_saved_quotes',
      });
    }
  }, []);

  const trackSearch = useCallback((query: string, resultsCount: number) => {
    trackEvent('search', {
      contentType: 'quotes',
      query,
      resultsCount,
    });
  }, []);

  return {
    trackQuoteView,
    trackQuoteInteraction,
    trackCollectionView,
    trackSearch
  };
}
