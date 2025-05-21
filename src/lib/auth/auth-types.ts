import { User } from '@supabase/supabase-js';
import { UserProfile, UserStatus, UserRole } from '@/types/user';

export interface AuthState {
  user: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface AuthContextValue extends AuthState {
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, username: string, name?: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<{ error: Error | null }>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: Error | null }>; // Keeping this as an alias for backward compatibility
  updateUserStatus: (status: UserStatus) => Promise<void>;
  toggleGhostMode: () => Promise<void>;
  toggleDoNotDisturb: () => Promise<void>;
  deleteAccount: () => Promise<{ error: Error | null }>;
  session?: any;
}

// This keeps compatibility with the auth-context.tsx file
export type AuthContextType = AuthContextValue;
