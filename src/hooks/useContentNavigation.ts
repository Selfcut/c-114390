
import { useNavigate } from 'react-router-dom';

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

  return {
    handleKnowledgeClick,
    handleWikiClick,
    handleQuoteClick,
    handleMediaClick,
  };
};
