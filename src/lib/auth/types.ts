
import { Session } from "@supabase/supabase-js";

export interface UserProfile {
  id: string;
  email?: string;
  name: string;
  avatar?: string;
  username?: string;
  role?: string;
  isAdmin?: boolean;
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
