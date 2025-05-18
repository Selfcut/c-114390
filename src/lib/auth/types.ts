
import { UserStatus, UserRole } from '@/types/user';

export interface UserProfile {
  id: string;
  email?: string;
  name?: string;
  username?: string;
  avatar_url?: string; // Add this to match Supabase DB field
  avatar?: string;     // Keep this for backward compatibility
  bio?: string;
  website?: string;
  role?: UserRole | string;
  isAdmin?: boolean;
  status?: UserStatus;
  isGhostMode?: boolean;
  notificationSettings?: {
    desktopNotifications: boolean;
    soundNotifications: boolean;
    emailNotifications: boolean;
  };
}

export interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  error: Error | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any } | null>;
  signUp: (email: string, password: string, username: string, name?: string) => Promise<{ error: any } | null>;
  signOut: () => Promise<void>;
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<{ error: any } | null>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: any } | null>;
}
