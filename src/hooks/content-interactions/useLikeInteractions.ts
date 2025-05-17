
import { useState } from 'react';
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
  
  // Handle like interaction
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
    
    try {
      if (isLiked) {
        // Unlike
        await supabase
          .from('content_likes')
          .delete()
          .eq('user_id', userId)
          .eq('content_id', id);
          
        setUserLikes(prev => ({...prev, [id]: false}));
        
        // Update counter in the appropriate table
        const tableName = getContentTable(contentTypeStr);
            
        // Update the likes count using RPC function
        await supabase.rpc('decrement_counter_fn', {
          row_id: id,
          column_name: 'likes',
          table_name: tableName
        });
      } else {
        // Like
        await supabase
          .from('content_likes')
          .insert({
            user_id: userId,
            content_id: id,
            content_type: contentTypeStr
          });
          
        setUserLikes(prev => ({...prev, [id]: true}));
        
        // Update counter in the appropriate table
        const tableName = getContentTable(contentTypeStr);
            
        // Update the likes count using RPC function
        await supabase.rpc('increment_counter_fn', {
          row_id: id,
          column_name: 'likes',
          table_name: tableName
        });
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
