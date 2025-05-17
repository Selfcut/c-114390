
export type MediaType = 'image' | 'youtube' | 'document' | 'text' | 'audio' | 'video';

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
  author?: {
    name?: string;
    avatar_url?: string;
    username?: string;
  };
}

export function validateMediaType(type: string): MediaType {
  const validTypes: MediaType[] = ['image', 'youtube', 'document', 'text', 'audio', 'video'];
  if (validTypes.includes(type as MediaType)) {
    return type as MediaType;
  }
  return 'text'; // Default to text if invalid type
}
