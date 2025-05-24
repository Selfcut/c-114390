
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { useAuth } from '@/lib/auth';
import { ContentType } from '@/types/unified-content-types';
import { toggleUserInteraction, checkUserContentInteractions } from '@/lib/utils/content-interactions';
import { toast } from 'sonner';

interface UserInteractionContextType {
  likedItems: Record<string, boolean>;
  bookmarkedItems: Record<string, boolean>;
  isLoading: boolean;
  likeContent: (contentId: string, contentType: string | ContentType) => Promise<boolean>;
  bookmarkContent: (contentId: string, contentType: string | ContentType) => Promise<boolean>;
  checkInteractions: (contentId: string, contentType: string | ContentType) => Promise<void>;
  setLikedItems: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  setBookmarkedItems: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}

const UserInteractionContext = createContext<UserInteractionContextType | undefined>(undefined);

export const UserInteractionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [likedItems, setLikedItems] = useState<Record<string, boolean>>({});
  const [bookmarkedItems, setBookmarkedItems] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);

  const getContentKey = useCallback((contentId: string, contentType: string | ContentType) => {
    const typeStr = typeof contentType === 'string' ? contentType : String(contentType);
    return `${typeStr}:${contentId}`;
  }, []);

  const likeContent = useCallback(async (contentId: string, contentType: string | ContentType): Promise<boolean> => {
    if (!user?.id) {
      toast.error('Please sign in to like content');
      return false;
    }

    setIsLoading(true);
    try {
      const normalizedType = typeof contentType === 'string' ? contentType : String(contentType);
      const newState = await toggleUserInteraction('like', user.id, contentId, normalizedType as ContentType);
      
      const key = getContentKey(contentId, contentType);
      setLikedItems(prev => ({ ...prev, [key]: newState }));
      
      return newState;
    } catch (error) {
      console.error('Error liking content:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, getContentKey]);

  const bookmarkContent = useCallback(async (contentId: string, contentType: string | ContentType): Promise<boolean> => {
    if (!user?.id) {
      toast.error('Please sign in to bookmark content');
      return false;
    }

    setIsLoading(true);
    try {
      const normalizedType = typeof contentType === 'string' ? contentType : String(contentType);
      const newState = await toggleUserInteraction('bookmark', user.id, contentId, normalizedType as ContentType);
      
      const key = getContentKey(contentId, contentType);
      setBookmarkedItems(prev => ({ ...prev, [key]: newState }));
      
      return newState;
    } catch (error) {
      console.error('Error bookmarking content:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, getContentKey]);

  const checkInteractions = useCallback(async (contentId: string, contentType: string | ContentType) => {
    if (!user?.id) return;

    try {
      const normalizedType = typeof contentType === 'string' ? contentType : String(contentType);
      const { isLiked, isBookmarked } = await checkUserContentInteractions(user.id, contentId, normalizedType as ContentType);
      
      const key = getContentKey(contentId, contentType);
      setLikedItems(prev => ({ ...prev, [key]: isLiked }));
      setBookmarkedItems(prev => ({ ...prev, [key]: isBookmarked }));
    } catch (error) {
      console.error('Error checking interactions:', error);
    }
  }, [user?.id, getContentKey]);

  const value: UserInteractionContextType = {
    likedItems,
    bookmarkedItems,
    isLoading,
    likeContent,
    bookmarkContent,
    checkInteractions,
    setLikedItems,
    setBookmarkedItems
  };

  return (
    <UserInteractionContext.Provider value={value}>
      {children}
    </UserInteractionContext.Provider>
  );
};

export const useUserInteraction = (): UserInteractionContextType => {
  const context = useContext(UserInteractionContext);
  if (!context) {
    throw new Error('useUserInteraction must be used within a UserInteractionProvider');
  }
  return context;
};
