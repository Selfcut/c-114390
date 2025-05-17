
import { useNavigate } from 'react-router-dom';
import { ContentItemType } from '@/components/library/content-items/ContentItemTypes';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useContentNavigation = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleContentClick = (contentId: string, contentType: ContentItemType) => {
    let path = '';
    
    switch(contentType) {
      case 'knowledge':
        path = `/knowledge/${contentId}`;
        break;
      case 'media':
        path = `/media/${contentId}`;
        break;
      case 'quote':
        path = `/quotes/${contentId}`;
        break;
      case 'ai':
        path = `/ai-content/${contentId}`;
        break;
      default:
        console.warn(`No path defined for content type: ${contentType}`);
        return;
    }
    
    // Track view if possible
    if (contentType === 'media') {
      try {
        supabase.rpc('increment_media_views', { media_id: contentId })
          .then(({ error }) => {
            if (error) console.error('Error tracking view:', error);
          });
      } catch (err) {
        console.error('Error tracking view:', err);
      }
    }
    
    navigate(path);
  };
  
  return { handleContentClick };
};
