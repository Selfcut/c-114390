
import { useState, useEffect } from 'react';
import { useUserInteraction } from '@/contexts/UserInteractionContext';

interface UserInteractions {
  likes: Record<string, boolean>;
  bookmarks: Record<string, boolean>;
}

export const useUnifiedContentFeed = () => {
  const [userInteractions, setUserInteractions] = useState<UserInteractions>({
    likes: {},
    bookmarks: {}
  });

  const { likedItems, bookmarkedItems, checkInteractions } = useUserInteraction();

  useEffect(() => {
    setUserInteractions({
      likes: likedItems,
      bookmarks: bookmarkedItems
    });
  }, [likedItems, bookmarkedItems]);

  const checkContentInteractions = async (contentId: string, contentType: string) => {
    await checkInteractions(contentId, contentType);
  };

  return {
    userInteractions,
    checkContentInteractions
  };
};
