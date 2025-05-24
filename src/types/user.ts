
export type UserStatus = 'online' | 'offline' | 'away' | 'busy' | 'do-not-disturb' | 'invisible';
export type UserRole = 'user' | 'admin' | 'moderator';

export interface NotificationSettings {
  desktopNotifications: boolean;
  soundNotifications: boolean;
  emailNotifications: boolean;
}

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  name?: string;
  avatar?: string;
  avatar_url?: string;
  status: UserStatus;
  isGhostMode: boolean;
  role: UserRole;
  isAdmin: boolean;
  bio?: string;
  website?: string;
  created_at?: string;
  updated_at?: string;
  notificationSettings?: NotificationSettings;
}

export interface UserInteractionState {
  likes: Record<string, boolean>;
  bookmarks: Record<string, boolean>;
  loading: Record<string, boolean>;
}
