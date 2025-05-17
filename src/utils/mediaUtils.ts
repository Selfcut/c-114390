
// Media post types
export type MediaPostType = 'image' | 'video' | 'document' | 'youtube' | 'text';

// Media post interface
export interface MediaPost {
  id: string;
  title: string;
  content?: string;
  url?: string;
  type: MediaPostType;
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

// Function to validate media post type
export const validateMediaType = (type: string): MediaPostType => {
  const validTypes: MediaPostType[] = ['image', 'video', 'document', 'youtube', 'text'];
  return validTypes.includes(type as MediaPostType) ? (type as MediaPostType) : 'text';
};
