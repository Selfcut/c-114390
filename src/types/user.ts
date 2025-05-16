
export type UserStatus = 'online' | 'away' | 'offline' | 'dnd' | 'invisible';

export interface UserProfile {
  id: string;
  username: string;
  name: string;
  email: string;
  avatar: string;
  bio?: string;
  website?: string;
  role?: string;
  isAdmin?: boolean;
  status: UserStatus;
  isGhostMode?: boolean;
  notificationSettings?: {
    desktopNotifications: boolean;
    soundNotifications: boolean;
    emailNotifications: boolean;
  };
}

export type UserRole = 'admin' | 'moderator' | 'user' | string;
