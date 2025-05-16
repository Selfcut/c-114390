
import { useNavigate } from 'react-router-dom';
import { ContentItemType } from '@/components/library/content-items/ContentItemTypes';

export const useContentNavigation = () => {
  const navigate = useNavigate();
  
  // Handle content item click
  const handleContentClick = (id: string, itemType: ContentItemType) => {
    // Different behavior based on content type
    if (itemType === 'knowledge') {
      navigate(`/library/entry/${id}`);
    } else if (itemType === 'media') {
      navigate(`/library/media/${id}`);
    } else if (itemType === 'quote') {
      navigate(`/library/quote/${id}`);
    }
  };
  
  // New method to handle wiki article navigation
  const handleWikiClick = (id: string) => {
    navigate(`/wiki/${id}`);
  };

  return {
    handleContentClick,
    handleWikiClick
  };
};
