
import { Session } from "@supabase/supabase-js";

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

// Auth context type definition
export interface AuthContextType {
  user: UserProfile | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<{ data?: any; error?: any }>;
  signUp: (email: string, password: string, username: string, name?: string) => Promise<{ data?: any; error?: any }>;
  signOut: () => Promise<void>;
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<{ error: Error | null }>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: Error | null }>;
  updateUserStatus: (status: UserStatus) => Promise<void>;
  toggleGhostMode: () => Promise<void>;
  toggleDoNotDisturb: () => Promise<void>;
  deleteAccount: () => Promise<{ error: Error | null }>;
}
