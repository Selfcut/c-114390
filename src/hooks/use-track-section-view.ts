import { useEffect, useRef } from 'react';
import { useAuth } from '@/lib/auth-context';
import { trackActivity, ActivityType } from '@/lib/activity-tracker';

/**
 * Hook to track when a user views a section of the app
 * @param section The section name
 * @param metadata Additional metadata to track
 */
export const useTrackSectionView = (
  section: string, 
  metadata: Record<string, any> = {}
) => {
  const { user } = useAuth();
  const hasTracked = useRef(false);
  
  useEffect(() => {
    const trackView = async () => {
      if (!user || hasTracked.current) return;
      
      hasTracked.current = true;
      
      await trackActivity(user.id, 'view', {
        section,
        timestamp: new Date().toISOString(),
        ...metadata
      });
    };
    
    trackView();
    
    // Reset tracking flag when section changes
    return () => {
      hasTracked.current = false;
    };
  }, [user, section, JSON.stringify(metadata)]);
};

/**
 * Helper function to track user interactions
 */
export const useUserInteractions = () => {
  const { user } = useAuth();
  
  const trackInteraction = async (
    action: string,
    targetType: string,
    targetId: string,
    metadata: Record<string, any> = {}
  ) => {
    if (!user) return;
    
    await trackActivity(user.id, 'interaction' as ActivityType, {
      action,
      targetType,
      targetId,
      timestamp: new Date().toISOString(),
      ...metadata
    });
  };
  
  return { trackInteraction };
};

/**
 * Hook to track learning activities
 */
export const useTrackLearning = () => {
  const { user } = useAuth();
  
  const trackLearned = async (
    topic: string,
    resourceType: string,
    resourceId: string,
    metadata: Record<string, any> = {}
  ) => {
    if (!user) return;
    
    await trackActivity(user.id, 'learned', {
      topic,
      resourceType,
      resourceId,
      timestamp: new Date().toISOString(),
      ...metadata
    });
  };
  
  const trackCompleted = async (
    topic: string,
    resourceType: string,
    resourceId: string,
    metadata: Record<string, any> = {}
  ) => {
    if (!user) return;
    
    await trackActivity(user.id, 'completed', {
      topic,
      resourceType,
      resourceId,
      timestamp: new Date().toISOString(),
      ...metadata
    });
  };
  
  return { trackLearned, trackCompleted };
};

/**
 * Hook for tracking all types of activities with optimizations
 */
export const useComprehensiveActivityTracker = () => {
  const { user } = useAuth();
  const pendingActivities = useRef<any[]>([]);
  const isProcessing = useRef(false);
  
  // Process pending activities in batches
  const processPendingActivities = async () => {
    if (isProcessing.current || pendingActivities.current.length === 0) return;
    
    isProcessing.current = true;
    
    const activities = [...pendingActivities.current];
    pendingActivities.current = [];
    
    try {
      for (const activity of activities) {
        await trackActivity(
          user!.id,
          activity.type,
          activity.metadata
        );
      }
    } catch (error) {
      console.error("Error processing activities:", error);
    } finally {
      isProcessing.current = false;
      
      // Check if more activities were added while processing
      if (pendingActivities.current.length > 0) {
        processPendingActivities();
      }
    }
  };
  
  const trackAnyActivity = (type: ActivityType, metadata: Record<string, any> = {}) => {
    if (!user) return;
    
    pendingActivities.current.push({
      type,
      metadata: {
        ...metadata,
        timestamp: new Date().toISOString()
      }
    });
    
    processPendingActivities();
  };
  
  return { trackAnyActivity };
};
