
import { User } from '@supabase/supabase-js';
import { UserStatus, UserRole } from '@/types/user';

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  full_name?: string;
  bio?: string;
  website?: string;
  avatar?: string;
  avatar_url?: string;
  name?: string;
  role?: UserRole | string;
  created_at?: string;
  updated_at?: string;
  status?: UserStatus;
  isGhostMode?: boolean;
  isAdmin?: boolean;
  notificationSettings?: {
    desktopNotifications: boolean;
    soundNotifications: boolean;
    emailNotifications: boolean;
  };
}

export interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface AuthContextValue extends AuthState {
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, username: string, name?: string) => Promise<{ error: Error | null; data: any | null }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: Error | null }>;
  deleteAccount: () => Promise<{ error: Error | null }>;
}

// Auth context type for auth-context.tsx
export interface AuthContextType {
  user: UserProfile | null;
  session: any;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any } | null>;
  signUp: (email: string, password: string, username: string, name?: string) => Promise<{ error: any } | null>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: any } | null>;
  updateUserProfile?: (updates: Partial<UserProfile>) => Promise<{ error: any } | null>;
  updateUserStatus?: (status: UserStatus) => Promise<void>;
  toggleGhostMode?: () => Promise<void>;
  toggleDoNotDisturb?: () => Promise<void>;
  loading?: boolean;
  error?: Error | null;
}
