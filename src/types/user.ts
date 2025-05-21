
// Define the user status type
export type UserStatus = 'online' | 'away' | 'busy' | 'do-not-disturb' | 'invisible' | 'offline';

// Define the user role type
export type UserRole = 'admin' | 'moderator' | 'user';

// Define notification settings type
export interface UserNotificationSettings {
  desktopNotifications: boolean;
  soundNotifications: boolean;
  emailNotifications: boolean;
}

export interface UserProfile {
  id: string;
  username: string;
  name?: string;
  email: string;
  avatar?: string;
  avatar_url?: string;
  bio?: string;
  website?: string;
  status: UserStatus;
  isGhostMode: boolean;
  role: UserRole;
  isAdmin: boolean;
  notificationSettings?: UserNotificationSettings;
}

export interface UserSettings {
  id: string;
  notifications_enabled: boolean;
  theme: 'light' | 'dark' | 'system';
  email_notifications: boolean;
  language: string;
  user_id: string;
}

export interface UserActivity {
  id: string;
  event_type: string;
  created_at: string;
  metadata?: Record<string, any>;
  user_id: string;
}
