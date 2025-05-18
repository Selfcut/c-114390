
import { User } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  full_name?: string;
  bio?: string;
  website?: string;
  avatar?: string;
  avatar_url?: string; // Add this property to fix TypeScript errors
  role?: 'user' | 'moderator' | 'admin';
  created_at?: string;
  updated_at?: string;
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
