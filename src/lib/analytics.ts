import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';

export type AnalyticsEvent = 
  | 'page_view'
  | 'feature_use'
  | 'search'
  | 'content_interaction'
  | 'user_journey'
  | 'ai_interaction'
  | 'button_click'
  | 'profile_update'
  | 'document_view'
  | 'document_download'
  | 'share_content'
  | 'session_duration'
  | 'error_encountered';

export interface EventMetadata {
  [key: string]: any;
}

export const trackEvent = async (
  event: AnalyticsEvent,
  metadata: EventMetadata = {}
) => {
  try {
    // Get current authenticated user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.log('No authenticated user, not tracking event');
      return;
    }
    
    // Track the event through our edge function
    await supabase.functions.invoke('track-user-activity', {
      body: {
        event,
        userId: user.id,
        metadata: {
          ...metadata,
          url: window.location.pathname,
          timestamp: new Date().toISOString(),
          referrer: document.referrer || 'direct',
          userAgent: navigator.userAgent,
          screenSize: `${window.innerWidth}x${window.innerHeight}`,
          language: navigator.language
        }
      }
    });
    
    return true;
  } catch (error) {
    console.error('Failed to track event:', error);
    return false;
  }
};

// Hook for tracking page views
export const usePageTracking = () => {
  const { user } = useAuth();
  
  const trackPageView = async (pageName: string) => {
    if (user) {
      await trackEvent('page_view', {
        page: pageName,
      });
    }
  };
  
  return { trackPageView };
};

// Enhanced analytics hooks for various tracking needs
export const useFeatureTracking = () => {
  const { user } = useAuth();
  
  const trackFeatureUse = async (featureName: string, metadata: EventMetadata = {}) => {
    if (user) {
      await trackEvent('feature_use', {
        feature: featureName,
        ...metadata
      });
    }
  };
  
  return { trackFeatureUse };
};

export const useSearchTracking = () => {
  const { user } = useAuth();
  
  const trackSearch = async (query: string, resultsCount: number, filters: any = {}) => {
    if (user) {
      await trackEvent('search', {
        query,
        resultsCount,
        filters
      });
    }
  };
  
  return { trackSearch };
};

export const useAIInteractionTracking = () => {
  const { user } = useAuth();
  
  const trackAIInteraction = async (aiFeature: string, prompt: string, responseLength: number, metadata: EventMetadata = {}) => {
    if (user) {
      await trackEvent('ai_interaction', {
        aiFeature,
        prompt,
        responseLength,
        ...metadata
      });
    }
  };
  
  return { trackAIInteraction };
};

export const useErrorTracking = () => {
  const { user } = useAuth();
  
  const trackError = async (errorType: string, errorMessage: string, stackTrace?: string) => {
    if (user) {
      await trackEvent('error_encountered', {
        errorType,
        errorMessage,
        stackTrace
      });
    }
  };
  
  return { trackError };
};

// Generate analytics report
export const generateAnalyticsReport = async (
  startDate: Date, 
  endDate: Date, 
  eventTypes?: AnalyticsEvent[]
) => {
  try {
    const { data, error } = await supabase.functions.invoke('generate-analytics-report', {
      body: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        eventTypes
      }
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Failed to generate analytics report:', error);
    throw error;
  }
};
