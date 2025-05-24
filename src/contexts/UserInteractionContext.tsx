
import React, { createContext, useContext, useState, useCallback } from 'react';
import { useAuth } from '@/lib/auth';
import { toggleUserInteraction } from '@/lib/utils/interactions/toggle-interactions';
import { ContentType } from '@/types/unified-content-types';
import { useToast } from '@/hooks/use-toast';

interface UserInteractionContextType {
  likedItems: Record<string, boolean>;
  bookmarkedItems: Record<string, boolean>;
  isLoading: boolean;
  likeContent: (contentId: string, contentType: ContentType | string) => Promise<void>;
  bookmarkContent: (contentId: string, contentType: ContentType | string) => Promise<void>;
}

const UserInteractionContext = createContext<UserInteractionContextType>({
  likedItems: {},
  bookmarkedItems: {},
  isLoading: false,
  likeContent: async () => {},
  bookmarkContent: async () => {},
});

export const useUserInteraction = () => {
  const context = useContext(UserInteractionContext);
  if (!context) {
    throw new Error('useUserInteraction must be used within a UserInteractionProvider');
  }
  return context;
};

export const UserInteractionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [likedItems, setLikedItems] = useState<Record<string, boolean>>({});
  const [bookmarkedItems, setBookmarkedItems] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);

  const likeContent = useCallback(async (contentId: string, contentType: ContentType | string) => {
    if (!user?.id) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to like content",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const contentTypeEnum = typeof contentType === 'string' ? contentType as ContentType : contentType;
      const newLikeState = await toggleUserInteraction('like', user.id, contentId, contentTypeEnum);
      
      const key = `${contentId}_${contentType}`;
      setLikedItems(prev => ({ ...prev, [key]: newLikeState }));
      
      toast({
        description: newLikeState ? "Content liked" : "Like removed",
      });
    } catch (error) {
      console.error('Error toggling like:', error);
      toast({
        title: "Error",
        description: "Failed to update like status",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, toast]);

  const bookmarkContent = useCallback(async (contentId: string, contentType: ContentType | string) => {
    if (!user?.id) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to bookmark content",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const contentTypeEnum = typeof contentType === 'string' ? contentType as ContentType : contentType;
      const newBookmarkState = await toggleUserInteraction('bookmark', user.id, contentId, contentTypeEnum);
      
      const key = `${contentId}_${contentType}`;
      setBookmarkedItems(prev => ({ ...prev, [key]: newBookmarkState }));
      
      toast({
        description: newBookmarkState ? "Content bookmarked" : "Bookmark removed",
      });
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      toast({
        title: "Error",
        description: "Failed to update bookmark status",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, toast]);

  return (
    <UserInteractionContext.Provider
      value={{
        likedItems,
        bookmarkedItems,
        isLoading,
        likeContent,
        bookmarkContent,
      }}
    >
      {children}
    </UserInteractionContext.Provider>
  );
};
