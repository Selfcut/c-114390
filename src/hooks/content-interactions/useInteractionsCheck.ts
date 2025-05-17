
import { supabase } from '@/integrations/supabase/client';

export const useInteractionsCheck = (
  userId?: string | null,
  setUserLikes: React.Dispatch<React.SetStateAction<Record<string, boolean>>> = () => {},
  setUserBookmarks: React.Dispatch<React.SetStateAction<Record<string, boolean>>> = () => {}
) => {
  // Check if user has liked or bookmarked items
  const checkUserInteractions = async (itemIds: string[]) => {
    if (!userId || itemIds.length === 0) return;
    
    try {
      // Check likes
      const { data: likesData } = await supabase
        .from('content_likes')
        .select('content_id')
        .eq('user_id', userId)
        .in('content_id', itemIds);
        
      if (likesData) {
        const likes: Record<string, boolean> = {};
        likesData.forEach(item => {
          likes[item.content_id] = true;
        });
        setUserLikes(prev => ({...prev, ...likes}));
      }
      
      // Check bookmarks
      const { data: bookmarksData } = await supabase
        .from('content_bookmarks')
        .select('content_id')
        .eq('user_id', userId)
        .in('content_id', itemIds);
        
      if (bookmarksData) {
        const bookmarks: Record<string, boolean> = {};
        bookmarksData.forEach(item => {
          bookmarks[item.content_id] = true;
        });
        setUserBookmarks(prev => ({...prev, ...bookmarks}));
      }
    } catch (err) {
      console.error('Error checking user interactions:', err);
    }
  };

  return { checkUserInteractions };
};
