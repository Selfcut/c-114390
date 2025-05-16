
import { Session } from "@supabase/supabase-js";

// User status type
export type UserStatus = 'online' | 'away' | 'do-not-disturb' | 'offline' | 'invisible';

// User roles
export type UserRole = 'admin' | 'moderator' | 'user' | string;

// User profile interface
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  username: string;
  avatar: string;
  bio: string;
  website: string;
  role: UserRole;
  isAdmin: boolean;
  status: UserStatus;
  isGhostMode?: boolean;
}

// Auth context type
export interface AuthContextType {
  user: UserProfile | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, metadata?: any) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: any }>;
}
