
import { Session } from "@supabase/supabase-js";

export interface UserProfile {
  id: string;
  email?: string;
  name: string;
  avatar_url?: string;  // This is the property from Supabase profiles table
  username?: string;
  role?: string;
  isAdmin?: boolean;
  status?: string;
  avatar?: string;   // Adding this as an alias for avatar_url for backward compatibility
}

export interface AuthContextType {
  user: UserProfile | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, metadata?: object) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: any }>;
}
