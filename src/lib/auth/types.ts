
import { UserProfile, UserStatus, UserRole } from '@/types/user';

// Use 'export type' to properly re-export types when isolatedModules is enabled
export type { UserProfile, UserStatus, UserRole };

export interface AuthState {
  user: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface AuthContextValue extends AuthState {
  signIn: (email: string, password: string) => Promise<{ error: Error | null; data?: any }>;
  signUp: (email: string, password: string, username: string, name?: string) => Promise<{ error: Error | null; data?: any }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: Error | null }>;
  deleteAccount: () => Promise<{ error: Error | null }>;
  session?: any;
  updateUserProfile?: (updates: Partial<UserProfile>) => Promise<{ error: any } | null>;
  updateUserStatus?: (status: UserStatus) => Promise<void>;
  toggleGhostMode?: () => Promise<void>;
  toggleDoNotDisturb?: () => Promise<void>;
}

// This keeps compatibility with the auth-context.tsx file
export type AuthContextType = AuthContextValue;
