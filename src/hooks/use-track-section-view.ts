
import { useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { trackActivity } from '@/lib/activity-tracker';

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
  
  useEffect(() => {
    const trackView = async () => {
      if (!user) return;
      
      await trackActivity(user.id, 'view', {
        section,
        timestamp: new Date().toISOString(),
        ...metadata
      });
    };
    
    trackView();
  }, [user, section]);
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
    
    await trackActivity(user.id, 'view', {
      action,
      targetType,
      targetId,
      timestamp: new Date().toISOString(),
      ...metadata
    });
  };
  
  return { trackInteraction };
};
