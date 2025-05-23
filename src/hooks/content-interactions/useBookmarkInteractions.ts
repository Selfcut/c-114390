
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ContentBookmarkResult, ContentLoadingState } from './types';
import { getContentTypeString, getContentTypeInfo, getContentKey } from './contentTypeUtils';
import { ContentItemType } from '@/components/library/content-items/ContentItemTypes';
import { PostgrestError } from '@supabase/supabase-js';

export const useBookmarkInteractions = (
  userId?: string | null,
  userBookmarks: Record<string, boolean> = {},
  setUserBookmarks: React.Dispatch<React.SetStateAction<Record<string, boolean>>> = () => {},
  loadingStates: Record<string, ContentLoadingState> = {},
  setLoadingStates: React.Dispatch<React.SetStateAction<Record<string, ContentLoadingState>>> = () => {}
) => {
  const { toast } = useToast();
  
  const setBookmarkLoadingState = useCallback((id: string, contentType: string | ContentItemType, isLoading: boolean) => {
    const contentTypeStr = typeof contentType === 'string' ? contentType : getContentTypeString(contentType);
    const key = getContentKey(id, contentTypeStr);
    
    setLoadingStates(prev => {
      const current = prev[key] || { isLikeLoading: false, isBookmarkLoading: false };
      return {
        ...prev,
        [key]: {
          ...current,
          isBookmarkLoading: isLoading
        }
      };
    });
  }, [setLoadingStates]);
  
  // Handle bookmark interaction with consistent RPC function name
  const handleBookmark = useCallback(async (id: string, itemType: ContentItemType | string): Promise<ContentBookmarkResult | null> => {
    if (!userId) {
      toast({
        title: "Authentication required",
        description: "Please sign in to bookmark content",
        variant: "destructive"
      });
      return null;
    }
    
    const contentTypeStr = typeof itemType === 'string' ? itemType : getContentTypeString(itemType);
    const key = getContentKey(id, contentTypeStr);
    const isBookmarked = userBookmarks[key] || userBookmarks[id] || false; // Check both formats for backward compatibility
    const typeInfo = getContentTypeInfo(contentTypeStr);
    
    // Set loading state
    setBookmarkLoadingState(id, contentTypeStr, true);
    
    try {
      if (isBookmarked) {
        // Remove bookmark
        if (contentTypeStr === 'quote') {
          const { error } = await supabase
            .from('quote_bookmarks')
            .delete()
            .eq('user_id', userId)
            .eq('quote_id', id);
            
          if (error) throw error;
            
          // Only update bookmarks counter for quotes - other content types don't track this
          if (typeInfo.bookmarksColumnName) {
            await supabase.rpc('decrement_counter_fn', {
              row_id: id,
              column_name: typeInfo.bookmarksColumnName,
              table_name: typeInfo.contentTable
            });
          }
          
          toast({
            description: "Bookmark removed"
          });
        } else {
          const { error } = await supabase
            .from('content_bookmarks')
            .delete()
            .eq('user_id', userId)
            .eq('content_id', id)
            .eq('content_type', contentTypeStr);
            
          if (error) throw error;
          
          toast({
            description: "Bookmark removed"
          });
        }
          
        // Update state with both key formats
        setUserBookmarks(prev => {
          const newState = {...prev};
          newState[key] = false;
          newState[id] = false; // For backward compatibility
          return newState;
        });
      } else {
        // Add bookmark
        if (contentTypeStr === 'quote') {
          const { error } = await supabase
            .from('quote_bookmarks')
            .insert({
              user_id: userId,
              quote_id: id
            });
            
          if (error) throw error;
            
          // Only update bookmarks counter for quotes - other content types don't track this
          if (typeInfo.bookmarksColumnName) {
            await supabase.rpc('increment_counter_fn', {
              row_id: id,
              column_name: typeInfo.bookmarksColumnName,
              table_name: typeInfo.contentTable
            });
          }
          
          toast({
            description: "Content bookmarked"
          });
        } else {
          const { error } = await supabase
            .from('content_bookmarks')
            .insert({
              user_id: userId,
              content_id: id,
              content_type: contentTypeStr
            });
            
          if (error) throw error;
          
          toast({
            description: "Content bookmarked"
          });
        }
          
        // Update state with both key formats
        setUserBookmarks(prev => {
          const newState = {...prev};
          newState[key] = true;
          newState[id] = true; // For backward compatibility
          return newState;
        });
      }
      
      return {
        isBookmarked: !isBookmarked,
        id,
        contentType: contentTypeStr
      };
      
    } catch (err) {
      const pgError = err as PostgrestError;
      console.error('Error updating bookmark:', pgError);
      toast({
        title: "Action failed",
        description: "Failed to update bookmark status",
        variant: "destructive"
      });
      return null;
    } finally {
      // Clear loading state
      setBookmarkLoadingState(id, contentTypeStr, false);
    }
  }, [userId, userBookmarks, toast, setUserBookmarks, setBookmarkLoadingState]);

  return { handleBookmark };
};
