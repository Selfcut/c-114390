
import { supabase } from "@/integrations/supabase/client";

export interface MediaPost {
  id: string;
  title: string;
  content?: string;
  url?: string;
  type: 'image' | 'video' | 'document' | 'youtube' | 'text';
  user_id: string;
  created_at: string;
  updated_at: string;
  likes: number;
  comments: number;
  author?: {
    name: string;
    avatar_url?: string;
  };
}

interface FetchMediaPostsParams {
  type?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  searchQuery?: string;
}

export const fetchMediaPosts = async ({
  type = 'all',
  page = 0,
  limit = 10,
  sortBy = 'created_at',
  sortOrder = 'desc',
  searchQuery = ''
}: FetchMediaPostsParams) => {
  try {
    console.log("Fetching media posts with params:", { type, page, sortBy, sortOrder, searchQuery });
    
    // Start building the query
    let query = supabase.from('media_posts').select('*');
    
    // Add filters
    if (type && type !== 'all') {
      query = query.eq('type', type);
    }
    
    // Add search
    if (searchQuery) {
      query = query.or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`);
    }
    
    // Add sorting
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });
    
    // Add pagination
    const offset = page * limit;
    query = query.range(offset, offset + limit - 1);
    
    // Execute the query
    const { data: posts, error } = await query;
    
    if (error) {
      console.error("Error in fetchMediaPosts:", error);
      throw error;
    }
    
    // Get user profiles separately instead of using a join
    if (posts && posts.length > 0) {
      const userIds = [...new Set(posts.map(post => post.user_id))];
      
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, name, avatar_url')
        .in('id', userIds);
      
      if (!profilesError && profiles) {
        // Map profiles to posts
        const profileMap = profiles.reduce((map: Record<string, any>, profile: any) => {
          map[profile.id] = profile;
          return map;
        }, {});
        
        // Attach author info to each post
        // Cast the database posts to MediaPost with a type assertion to ensure compatibility
        posts.forEach((post: any) => {
          if (profileMap[post.user_id]) {
            (post as MediaPost).author = {
              name: profileMap[post.user_id].name || 'Unknown',
              avatar_url: profileMap[post.user_id].avatar_url
            };
          } else {
            (post as MediaPost).author = {
              name: 'Unknown User',
              avatar_url: undefined
            };
          }
        });
      }
    }
    
    // Check if there's more content
    const { data: countData } = await supabase
      .from('media_posts')
      .select('id', { count: 'exact', head: true });
      
    const count = countData?.length !== undefined ? countData.length : 0;
    const hasMore = offset + (posts?.length || 0) < count;
    
    return {
      posts: posts as MediaPost[],
      hasMore,
      error: null
    };
  } catch (error) {
    console.error('Error fetching media posts:', error);
    return {
      posts: [],
      hasMore: false,
      error
    };
  }
};

export const createMediaPost = async (newPost: {
  title: string;
  content?: string;
  url?: string;
  type: 'image' | 'video' | 'document' | 'youtube' | 'text';
  userId: string;
}) => {
  try {
    const { data, error } = await supabase
      .from('media_posts')
      .insert([
        {
          title: newPost.title,
          content: newPost.content,
          url: newPost.url,
          type: newPost.type,
          user_id: newPost.userId,
        }
      ])
      .select();
    
    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Error creating media post:', error);
    throw error;
  }
};
