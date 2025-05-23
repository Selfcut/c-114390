
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ContentInteractionResult } from './types';
import { getContentTypeString, getContentTable } from './contentTypeUtils';
import { ContentItemType } from '@/components/library/content-items/ContentItemTypes';

export const useLikeInteractions = (
  userId?: string | null, 
  userLikes: Record<string, boolean> = {},
  setUserLikes: React.Dispatch<React.SetStateAction<Record<string, boolean>>> = () => {}
) => {
  const { toast } = useToast();
  
  // Handle like interaction with consistent RPC function name
  const handleLike = async (id: string, itemType: ContentItemType): Promise<ContentInteractionResult | null> => {
    if (!userId) {
      toast({
        title: "Authentication required",
        description: "Please log in to like content",
        variant: "destructive"
      });
      return null;
    }
    
    const isLiked = userLikes[id];
    const contentTypeStr = getContentTypeString(itemType);
    const isQuoteType = contentTypeStr === 'quote';
    
    try {
      if (isLiked) {
        // Unlike
        if (isQuoteType) {
          await supabase
            .from('quote_likes')
            .delete()
            .eq('user_id', userId)
            .eq('quote_id', id);
            
          // Update counter in quotes table
          await supabase.rpc('decrement_counter_fn', {
            row_id: id,
            column_name: 'likes',
            table_name: 'quotes'
          });
        } else {
          await supabase
            .from('content_likes')
            .delete()
            .eq('user_id', userId)
            .eq('content_id', id);
            
          // Update counter in the appropriate table
          const tableName = getContentTable(contentTypeStr);
          const columnName = contentTypeStr === 'forum' ? 'upvotes' : 'likes';
            
          await supabase.rpc('decrement_counter_fn', {
            row_id: id,
            column_name: columnName,
            table_name: tableName
          });
        }
          
        setUserLikes(prev => ({...prev, [id]: false}));
      } else {
        // Like
        if (isQuoteType) {
          await supabase
            .from('quote_likes')
            .insert({
              user_id: userId,
              quote_id: id
            });
            
          // Update counter in quotes table
          await supabase.rpc('increment_counter_fn', {
            row_id: id,
            column_name: 'likes',
            table_name: 'quotes'
          });
        } else {
          await supabase
            .from('content_likes')
            .insert({
              user_id: userId,
              content_id: id,
              content_type: contentTypeStr
            });
            
          // Update counter in the appropriate table
          const tableName = getContentTable(contentTypeStr);
          const columnName = contentTypeStr === 'forum' ? 'upvotes' : 'likes';
            
          await supabase.rpc('increment_counter_fn', {
            row_id: id,
            column_name: columnName,
            table_name: tableName
          });
        }
          
        setUserLikes(prev => ({...prev, [id]: true}));
      }
      
      return {
        isLiked: !isLiked,
        id
      };
      
    } catch (err) {
      console.error('Error updating like:', err);
      toast({
        title: "Action failed",
        description: "Failed to update like status",
        variant: "destructive"
      });
      return null;
    }
  };

  return { handleLike };
};
