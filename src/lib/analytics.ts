
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth-context';

export type AnalyticsEvent = 
  | 'page_view'
  | 'feature_use'
  | 'search'
  | 'content_interaction'
  | 'user_journey'
  | 'ai_interaction';

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
