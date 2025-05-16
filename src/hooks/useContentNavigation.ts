
import { useRouter } from 'react-router-dom';
import { ContentItemType } from '@/components/library/content-items/ContentItemTypes';

export const useContentNavigation = () => {
  const router = useRouter();
  
  // Handle content item click
  const handleContentClick = (id: string, itemType: ContentItemType) => {
    // Different behavior based on content type
    if (itemType === 'knowledge') {
      router.push(`/library/entry/${id}`);
    } else if (itemType === 'media') {
      router.push(`/library/media/${id}`);
    } else if (itemType === 'quote') {
      router.push(`/library/quote/${id}`);
    }
  };
  
  // New method to handle wiki article navigation
  const handleWikiClick = (id: string) => {
    router.push(`/wiki/${id}`);
  };

  return {
    handleContentClick,
    handleWikiClick
  };
};
