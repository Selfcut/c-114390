
import { ContentItemType } from '@/components/library/UnifiedContentItem';

export const useContentNavigation = () => {
  // Handle content item click
  const handleContentClick = (id: string, itemType: ContentItemType) => {
    // Different behavior based on content type
    if (itemType === 'knowledge') {
      window.location.href = `/library/entry/${id}`;
    } else if (itemType === 'media') {
      window.location.href = `/library/media/${id}`;
    } else if (itemType === 'quote') {
      // Open quote detail modal or page
      console.log('Open quote detail', id);
    }
  };

  return {
    handleContentClick
  };
};
