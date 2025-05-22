
import { User, Session } from '@supabase/supabase-js';
import { UserProfile, UserStatus, UserRole } from '@/types/user';

// Use proper type exports
export type { UserProfile, UserStatus, UserRole };

export interface AuthState {
  user: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  session: Session | null;
}

export interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<{ error: Error | null; data?: any }>;
  signUp: (email: string, password: string, username: string, name?: string) => Promise<{ error: Error | null; data?: any }>;
  signOut: () => Promise<void>;
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<{ error: Error | null }>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: Error | null }>;
  updateUserStatus: (status: UserStatus) => Promise<void>;
  toggleGhostMode: () => Promise<void>;
  toggleDoNotDisturb: () => Promise<void>;
  deleteAccount: () => Promise<{ error: Error | null }>;
}
