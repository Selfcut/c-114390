
export type MediaType = 'image' | 'video' | 'document' | 'youtube' | 'text';

export interface MediaPost {
  id: string;
  title: string;
  content?: string;
  url?: string;
  type: MediaType;
  user_id: string;
  created_at: string;
  updated_at: string;
  likes: number;
  comments: number;
  views: number;
  author?: {
    name: string;
    avatar_url?: string | null;
    username?: string | null;
  };
}

export const validateMediaType = (type: string): MediaType => {
  const validTypes: MediaType[] = ['image', 'video', 'document', 'youtube', 'text'];
  return validTypes.includes(type as MediaType) ? type as MediaType : 'text';
};

export const getMediaPostById = async (id: string): Promise<MediaPost | null> => {
  try {
    const { supabase } = await import('@/integrations/supabase/client');
    
    // Get the post
    const { data: post, error } = await supabase
      .from('media_posts')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error || !post) {
      console.error("Error fetching media post:", error);
      return null;
    }
    
    // Get the author profile
    let authorProfile = null;
    if (post.user_id) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('name, avatar_url, username')
        .eq('id', post.user_id)
        .maybeSingle();
        
      if (profile) {
        authorProfile = profile;
      }
    }
    
    return {
      id: post.id,
      title: post.title,
      content: post.content,
      url: post.url,
      type: validateMediaType(post.type),
      user_id: post.user_id,
      created_at: post.created_at,
      updated_at: post.updated_at,
      likes: post.likes || 0,
      comments: post.comments || 0,
      views: post.views || 0,
      author: authorProfile ? {
        name: authorProfile.name || 'Unknown',
        avatar_url: authorProfile.avatar_url,
        username: authorProfile.username
      } : {
        name: 'Unknown',
        avatar_url: null,
        username: null
      }
    };
  } catch (err) {
    console.error("Error in getMediaPostById:", err);
    return null;
  }
};
