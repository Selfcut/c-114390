
// User status type
export type UserStatus = 'online' | 'away' | 'do-not-disturb' | 'offline' | 'invisible';

// User roles
export type UserRole = 'admin' | 'moderator' | 'user';

// User notification settings
export interface NotificationSettings {
  desktopNotifications: boolean;
  soundNotifications: boolean;
  emailNotifications: boolean;
}

// User profile
export interface UserProfile {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar: string;
  bio?: string;
  website?: string;
  status: UserStatus;
  isGhostMode: boolean;
  role: UserRole;
  isAdmin?: boolean; // Added this property
  notificationSettings?: NotificationSettings;
}
