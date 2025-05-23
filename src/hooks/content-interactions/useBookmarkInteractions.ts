
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ContentBookmarkResult } from './types';
import { getContentTypeString, getContentTable } from './contentTypeUtils';
import { ContentItemType } from '@/components/library/content-items/ContentItemTypes';

export const useBookmarkInteractions = (
  userId?: string | null,
  userBookmarks: Record<string, boolean> = {},
  setUserBookmarks: React.Dispatch<React.SetStateAction<Record<string, boolean>>> = () => {}
) => {
  const { toast } = useToast();
  
  // Handle bookmark interaction with consistent RPC function name
  const handleBookmark = async (id: string, itemType: ContentItemType): Promise<ContentBookmarkResult | null> => {
    if (!userId) {
      toast({
        title: "Authentication required",
        description: "Please log in to bookmark content",
        variant: "destructive"
      });
      return null;
    }
    
    const isBookmarked = userBookmarks[id];
    const contentTypeStr = getContentTypeString(itemType);
    const isQuoteType = contentTypeStr === 'quote';
    
    try {
      if (isBookmarked) {
        // Remove bookmark
        if (isQuoteType) {
          await supabase
            .from('quote_bookmarks')
            .delete()
            .eq('user_id', userId)
            .eq('quote_id', id);
            
          // Update counter if it's a quote
          await supabase.rpc('decrement_counter_fn', {
            row_id: id,
            column_name: 'bookmarks',
            table_name: 'quotes'
          });
        } else {
          await supabase
            .from('content_bookmarks')
            .delete()
            .eq('user_id', userId)
            .eq('content_id', id);
        }
          
        setUserBookmarks(prev => ({...prev, [id]: false}));
      } else {
        // Add bookmark
        if (isQuoteType) {
          await supabase
            .from('quote_bookmarks')
            .insert({
              user_id: userId,
              quote_id: id
            });
            
          // Update counter if it's a quote
          await supabase.rpc('increment_counter_fn', {
            row_id: id,
            column_name: 'bookmarks', 
            table_name: 'quotes'
          });
        } else {
          await supabase
            .from('content_bookmarks')
            .insert({
              user_id: userId,
              content_id: id,
              content_type: contentTypeStr
            });
        }
          
        setUserBookmarks(prev => ({...prev, [id]: true}));
      }
      
      return {
        isBookmarked: !isBookmarked,
        id
      };
      
    } catch (err) {
      console.error('Error updating bookmark:', err);
      toast({
        title: "Action failed",
        description: "Failed to update bookmark status",
        variant: "destructive"
      });
      return null;
    }
  };

  return { handleBookmark };
};
