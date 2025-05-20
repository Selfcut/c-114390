
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { incrementCounter, decrementCounter } from '@/lib/utils/supabase-utils';

export const likeQuote = async (quoteId: string, userId: string) => {
  try {
    // Check if user already liked this quote
    const { data: existingLike, error: checkError } = await supabase
      .from('quote_likes')
      .select('*')
      .eq('quote_id', quoteId)
      .eq('user_id', userId)
      .maybeSingle();
    
    if (checkError) {
      throw checkError;
    }
    
    // If already liked, remove the like
    if (existingLike) {
      const { error: deleteError } = await supabase
        .from('quote_likes')
        .delete()
        .eq('id', existingLike.id);
      
      if (deleteError) throw deleteError;
      
      // Decrement the likes counter
      await decrementCounter(quoteId, 'likes', 'quotes');
      
      return { liked: false };
    }
    
    // If not liked, add a like
    const { error: insertError } = await supabase
      .from('quote_likes')
      .insert({
        quote_id: quoteId,
        user_id: userId
      });
    
    if (insertError) throw insertError;
    
    // Increment the likes counter
    await incrementCounter(quoteId, 'likes', 'quotes');
    
    return { liked: true };
  } catch (error) {
    console.error('Error liking quote:', error);
    toast.error('Failed to like quote');
    return { error };
  }
};

export const bookmarkQuote = async (quoteId: string, userId: string) => {
  try {
    // Check if user already bookmarked this quote
    const { data: existingBookmark, error: checkError } = await supabase
      .from('quote_bookmarks')
      .select('*')
      .eq('quote_id', quoteId)
      .eq('user_id', userId)
      .maybeSingle();
    
    if (checkError) {
      throw checkError;
    }
    
    // If already bookmarked, remove the bookmark
    if (existingBookmark) {
      const { error: deleteError } = await supabase
        .from('quote_bookmarks')
        .delete()
        .eq('id', existingBookmark.id);
      
      if (deleteError) throw deleteError;
      
      // Decrement the bookmarks counter
      await decrementCounter(quoteId, 'bookmarks', 'quotes');
      
      return { bookmarked: false };
    }
    
    // If not bookmarked, add a bookmark
    const { error: insertError } = await supabase
      .from('quote_bookmarks')
      .insert({
        quote_id: quoteId,
        user_id: userId
      });
    
    if (insertError) throw insertError;
    
    // Increment the bookmarks counter
    await incrementCounter(quoteId, 'bookmarks', 'quotes');
    
    return { bookmarked: true };
  } catch (error) {
    console.error('Error bookmarking quote:', error);
    toast.error('Failed to bookmark quote');
    return { error };
  }
};
