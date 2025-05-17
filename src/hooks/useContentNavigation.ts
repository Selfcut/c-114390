
import { useNavigate } from 'react-router-dom';
import { ContentItemType } from '@/components/library/content-items/ContentItemTypes';

export const useContentNavigation = () => {
  const navigate = useNavigate();
  
  const handleContentClick = (id: string, itemType: ContentItemType) => {
    switch (itemType) {
      case 'knowledge':
        navigate(`/knowledge/${id}`);
        break;
      case 'media':
        navigate(`/media/${id}`);
        break;
      case 'quote':
        navigate(`/quotes/${id}`);
        break;
      case 'ai':
        navigate(`/ai-content/${id}`);
        break;
      default:
        console.warn(`No navigation path defined for content type: ${itemType}`);
    }
  };
  
  // Add handleWikiClick function for wiki articles
  const handleWikiClick = (id: string) => {
    navigate(`/wiki/${id}`);
  };
  
  return { 
    handleContentClick,
    handleWikiClick
  };
};
