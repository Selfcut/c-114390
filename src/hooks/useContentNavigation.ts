
import { useNavigate } from 'react-router-dom';
import { ContentItemType } from '@/components/library/content-items/ContentItemTypes';
import { useToast } from '@/hooks/use-toast';

export const useContentNavigation = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleContentClick = (id: string, itemType: ContentItemType) => {
    if (!id) {
      console.error('Invalid content ID');
      return;
    }
    
    try {
      let path = '';
      
      switch (itemType) {
        case 'knowledge':
          path = `/knowledge/${id}`;
          break;
        case 'media':
          path = `/media/${id}`;
          break;
        case 'quote':
          path = `/quotes/${id}`;
          break;
        case 'ai':
          path = `/ai-content/${id}`;
          break;
        default:
          console.warn(`No navigation path defined for content type: ${itemType}`);
          return;
      }
      
      // Navigate to the content detail page
      navigate(path);
      
      // Track the navigation event
      trackContentView(id, itemType);
    } catch (error) {
      console.error('Navigation error:', error);
      toast({
        title: 'Navigation Error',
        description: 'There was a problem navigating to the content',
        variant: 'destructive'
      });
    }
  };
  
  // Track content view for analytics or Supabase views counter
  const trackContentView = async (id: string, itemType: ContentItemType) => {
    try {
      // This could be implemented to increment view counters in the database
      console.log(`Content view tracked: ${itemType} - ${id}`);
    } catch (error) {
      console.error('Error tracking content view:', error);
    }
  };
  
  // Add handleWikiClick function for wiki articles
  const handleWikiClick = (id: string) => {
    if (!id) {
      console.error('Invalid wiki ID');
      return;
    }
    
    try {
      navigate(`/wiki/${id}`);
      
      // Track the wiki view
      trackWikiView(id);
    } catch (error) {
      console.error('Wiki navigation error:', error);
      toast({
        title: 'Navigation Error',
        description: 'There was a problem navigating to the wiki article',
        variant: 'destructive'
      });
    }
  };
  
  // Track wiki view
  const trackWikiView = async (id: string) => {
    try {
      // This could be implemented to increment wiki view counters
      console.log(`Wiki view tracked: ${id}`);
    } catch (error) {
      console.error('Error tracking wiki view:', error);
    }
  };
  
  return { 
    handleContentClick,
    handleWikiClick
  };
};
