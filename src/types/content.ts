
export interface Author {
  id?: string;
  name: string;
  username?: string;
  avatar_url?: string;
}

export interface ContentInteraction {
  id: string;
  user_id: string;
  content_id: string;
  content_type: string;
  created_at: string;
}

export interface ContentComment {
  id: string;
  user_id: string;
  content_id: string;
  content_type: string;
  comment: string;
  created_at: string;
  updated_at?: string;
  author?: Author;
}

export interface ContentBase {
  id: string;
  title: string;
  likes: number;
  views?: number;
  comments: number;
  user_id: string;
  created_at: string;
  updated_at?: string;
  author?: Author;
}
