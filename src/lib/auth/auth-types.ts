
import { Session } from '@supabase/supabase-js';
import { UserProfile, UserStatus } from '@/types/user';

export type { UserProfile, UserStatus } from '@/types/user';
export type { UserRole } from '@/types/user';

export interface AuthError {
  message: string;
  status?: number;
}

export interface AuthContextType {
  user: UserProfile | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string, username: string, name?: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: AuthError | null }>;
  updateUserStatus: (status: UserStatus) => Promise<void>;
  toggleGhostMode: () => Promise<void>;
  toggleDoNotDisturb: () => Promise<void>;
  deleteAccount: () => Promise<{ error: AuthError | null }>;
}
