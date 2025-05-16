
import { useNavigate } from 'react-router-dom';
import { ContentItemType } from '@/components/library/content-items/ContentItemTypes';

export const useContentNavigation = () => {
  const navigate = useNavigate();

  // Navigate to knowledge entry detail page
  const handleKnowledgeClick = (id: string) => {
    navigate(`/knowledge/${id}`);
  };

  // Navigate to wiki article detail page
  const handleWikiClick = (id: string) => {
    navigate(`/wiki/${id}`);
  };

  // Navigate to quote detail page
  const handleQuoteClick = (id: string) => {
    navigate(`/quotes/${id}`);
  };

  // Navigate to media detail page
  const handleMediaClick = (id: string) => {
    navigate(`/media/${id}`);
  };

  // Generic handler that routes based on content type
  const handleContentClick = (id: string, itemType: ContentItemType) => {
    switch(itemType) {
      case 'knowledge':
        handleKnowledgeClick(id);
        break;
      case 'media':
        handleMediaClick(id);
        break;
      case 'quote':
        handleQuoteClick(id);
        break;
      case 'ai':
        handleKnowledgeClick(id); // AI content typically routes to knowledge
        break;
      default:
        console.warn(`Unknown content type: ${itemType}`);
        // For any wiki related navigation from unified components
        if (typeof itemType === 'string' && itemType === 'wiki') {
          handleWikiClick(id);
        }
    }
  };

  return {
    handleKnowledgeClick,
    handleWikiClick,
    handleQuoteClick,
    handleMediaClick,
    handleContentClick
  };
};
