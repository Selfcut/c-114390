
import { useState } from 'react';
import { ContentItemType } from '@/components/library/content-items/ContentItemTypes';
import { UseContentInteractionsProps, UserInteractions } from './content-interactions/types';
import { useLikeInteractions } from './content-interactions/useLikeInteractions';
import { useBookmarkInteractions } from './content-interactions/useBookmarkInteractions';
import { useInteractionsCheck } from './content-interactions/useInteractionsCheck';
import { useRealtimeInteractions } from './content-interactions/useRealtimeInteractions';

export type { UseContentInteractionsProps } from './content-interactions/types';

export const useContentInteractions = ({ userId }: UseContentInteractionsProps): UserInteractions => {
  const [userLikes, setUserLikes] = useState<Record<string, boolean>>({});
  const [userBookmarks, setUserBookmarks] = useState<Record<string, boolean>>({});
  
  // Use the sub-hooks
  const { handleLike } = useLikeInteractions(userId, userLikes, setUserLikes);
  const { handleBookmark } = useBookmarkInteractions(userId, userBookmarks, setUserBookmarks);
  const { checkUserInteractions } = useInteractionsCheck(userId, setUserLikes, setUserBookmarks);
  
  // Set up realtime subscriptions
  useRealtimeInteractions(userId, setUserLikes, setUserBookmarks);

  return {
    userLikes,
    userBookmarks,
    handleLike,
    handleBookmark,
    checkUserInteractions
  };
};
