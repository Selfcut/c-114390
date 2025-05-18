
import { User } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  full_name?: string;
  bio?: string;
  website?: string;
  avatar?: string;
  avatar_url?: string;
  name?: string; // Add name field to match the UserProfile in user.ts
  role?: 'user' | 'moderator' | 'admin' | string; // Allow string for compatibility
  created_at?: string;
  updated_at?: string;
  status?: string;
  isGhostMode?: boolean;
  isAdmin?: boolean;
}

export interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface AuthContextValue extends AuthState {
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, userData?: Partial<UserProfile>) => Promise<{ error: Error | null; data: any | null }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: Error | null }>;
  deleteAccount: () => Promise<{ error: Error | null }>;
}

// Add AuthContextType for auth-context.tsx
export interface AuthContextType {
  user: UserProfile | null;
  session: any;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any } | null>;
  signUp: (email: string, password: string, metadata?: any) => Promise<{ error: any } | null>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: any } | null>;
  updateUserStatus?: (status: string) => Promise<void>;
  toggleGhostMode?: () => Promise<void>;
  toggleDoNotDisturb?: () => Promise<void>;
  loading?: boolean;
  error?: Error | null;
}
