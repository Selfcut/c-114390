
// Import types from the single source of truth
import { UserProfile, UserStatus, UserRole } from '@/types/user';

// Use 'export type' to properly re-export types when isolatedModules is enabled
export type { UserProfile, UserStatus, UserRole };

export interface AuthState {
  user: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  session: any | null;
}

export interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<{ error: Error | null; data?: any }>;
  signUp: (email: string, password: string, username: string, name?: string) => Promise<{ error: Error | null; data?: any }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: Error | null }>;
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<{ error: Error | null }>;
  deleteAccount: () => Promise<{ error: Error | null }>;
  updateUserStatus: (status: UserStatus) => Promise<void>;
  toggleGhostMode: () => Promise<void>;
  toggleDoNotDisturb: () => Promise<void>;
}

// For backward compatibility
export type { AuthContextType as AuthContextValue };
