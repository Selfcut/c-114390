
export interface UserProfile {
  id: string;
  email: string;
  username: string;
  name?: string;
  avatar?: string;
  avatar_url?: string;
  status: 'online' | 'offline' | 'away' | 'busy';
  isGhostMode: boolean;
  role: 'user' | 'admin' | 'moderator';
  isAdmin: boolean;
  bio?: string;
  website?: string;
  created_at?: string;
  updated_at?: string;
}

export interface UserInteractionState {
  likes: Record<string, boolean>;
  bookmarks: Record<string, boolean>;
  loading: Record<string, boolean>;
}
