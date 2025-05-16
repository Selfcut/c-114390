
import { Session } from "@supabase/supabase-js";
import { UserProfile, UserStatus, UserRole } from "@/types/user";

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

// Re-export types from the main user.ts using export type
export type { UserProfile, UserStatus, UserRole };
