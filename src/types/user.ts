
export interface UserProfile {
  id: string;
  username: string;
  name?: string;
  email: string;
  avatar?: string;
  avatar_url?: string;
  status: string;
  isGhostMode: boolean;
  role: string;
  isAdmin: boolean;
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
