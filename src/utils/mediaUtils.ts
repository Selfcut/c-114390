import { supabase } from "@/integrations/supabase/client";

/**
 * Interface for media post data
 */
export interface MediaPost {
  id: string;
  title: string;
  content?: string;
  url?: string;
  type: 'image' | 'video' | 'document' | 'youtube' | 'text';
  created_at: string;
  updated_at?: string;
  user_id: string;
  likes: number;
  comments: number;
  author?: {
    name?: string;
    username?: string;
    avatar_url?: string;
  };
}

/**
 * Fetch media posts with filter options
 */
export async function fetchMediaPosts({
  type = undefined,
  page = 0,
  pageSize = 10,
  sortBy = 'created_at',
  sortOrder = 'desc',
  searchQuery = ''
}: {
  type?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  searchQuery?: string;
}) {
  try {
    // Start building the query
    let query = supabase
      .from('media_posts')
      .select(`
        *,
        profiles(name, avatar_url, username)
      `)
      .range(page * pageSize, (page + 1) * pageSize - 1);
      
    // Apply media type filter
    if (type && type !== 'all') {
      query = query.eq('type', type);
    }
    
    // Apply search filter if provided
    if (searchQuery) {
      query = query.or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`);
    }
    
    // Apply sorting
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });
    
    const { data, error } = await query;

    if (error) {
      console.error('Error fetching media posts:', error);
      throw error;
    }
    
    // Transform to match the expected format
    const posts: MediaPost[] = data?.map(post => ({
      ...post,
      // Ensure type is one of the allowed values
      type: (post.type as 'image' | 'video' | 'document' | 'youtube' | 'text') || 'text', 
      author: post.profiles ? {
        name: post.profiles.name,
        username: post.profiles.username,
        avatar_url: post.profiles.avatar_url
      } : undefined
    })) || [];

    return {
      posts,
      hasMore: posts.length === pageSize,
      error: null
    };
  } catch (error) {
    console.error('Error in fetchMediaPosts:', error);
    return {
      posts: [],
      hasMore: false,
      error
    };
  }
}

/**
 * Get a specific media post by ID
 */
export async function getMediaPost(id: string) {
  try {
    const { data, error } = await supabase
      .from('media_posts')
      .select(`
        *,
        profiles(name, avatar_url, username)
      `)
      .eq('id', id)
      .single();
      
    if (error) throw error;
    
    // Transform to match the expected format
    const post: MediaPost = {
      ...data,
      // Ensure type is one of the allowed values
      type: (data.type as 'image' | 'video' | 'document' | 'youtube' | 'text') || 'text',
      author: data.profiles ? {
        name: data.profiles.name,
        username: data.profiles.username,
        avatar_url: data.profiles.avatar_url
      } : undefined
    };
    
    return { post, error: null };
  } catch (error) {
    console.error('Error fetching media post:', error);
    return { post: null, error };
  }
}

/**
 * Create a new media post
 */
export async function createMediaPost({
  title,
  content = '',
  url = '',
  type,
  userId
}: {
  title: string;
  content?: string;
  url?: string;
  type: 'image' | 'video' | 'document' | 'youtube' | 'text';
  userId: string;
}) {
  try {
    const { data, error } = await supabase
      .from('media_posts')
      .insert({
        title,
        content,
        url,
        type,
        user_id: userId,
        likes: 0,
        comments: 0
      })
      .select();
      
    if (error) throw error;
    
    return { post: data?.[0], error: null };
  } catch (error) {
    console.error('Error creating media post:', error);
    return { post: null, error };
  }
}

/**
 * Like or unlike a media post
 */
export async function toggleMediaLike(postId: string, userId: string) {
  try {
    // Check if user already liked the post
    const { data: existingLike, error: checkError } = await supabase
      .from('media_likes')
      .select('*')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .maybeSingle();
      
    if (checkError) throw checkError;
    
    if (existingLike) {
      // Unlike: Remove like and decrement counter
      const { error: unlikeError } = await supabase
        .from('media_likes')
        .delete()
        .eq('id', existingLike.id);
        
      if (unlikeError) throw unlikeError;
      
      // Decrement likes counter
      const { error: updateError } = await supabase.rpc('decrement_counter_fn', {
        row_id: postId,
        column_name: 'likes',
        table_name: 'media_posts'
      });
      
      if (updateError) throw updateError;
      
      return { liked: false, error: null };
    } else {
      // Like: Add like and increment counter
      const { error: likeError } = await supabase
        .from('media_likes')
        .insert({
          post_id: postId,
          user_id: userId
        });
        
      if (likeError) throw likeError;
      
      // Increment likes counter
      const { error: updateError } = await supabase.rpc('increment_counter_fn', {
        row_id: postId,
        column_name: 'likes',
        table_name: 'media_posts'
      });
      
      if (updateError) throw updateError;
      
      return { liked: true, error: null };
    }
  } catch (error) {
    console.error('Error toggling media like:', error);
    return { liked: false, error };
  }
}

/**
 * Check if user has liked a specific media post
 */
export async function checkMediaLike(postId: string, userId: string) {
  try {
    const { data, error } = await supabase
      .from('media_likes')
      .select('*')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .maybeSingle();
      
    if (error) throw error;
    
    return { hasLiked: !!data, error: null };
  } catch (error) {
    console.error('Error checking media like:', error);
    return { hasLiked: false, error };
  }
}
