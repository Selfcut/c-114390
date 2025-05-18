
import { User } from "@supabase/supabase-js";
import { UserProfile, UserStatus, UserRole } from "@/types/user";

export interface AuthError {
  message: string;
  status?: number;
}

export interface AuthContextType {
  user: UserProfile | null;
  session: any;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any } | null>;
  signUp: (email: string, password: string, metadata?: any) => Promise<{ error: any } | null>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: any } | null>;
  updateUserStatus: (status: UserStatus) => Promise<void>;
  toggleGhostMode: () => Promise<void>;
  toggleDoNotDisturb: () => Promise<void>;
}

// Re-export types from the main user.ts using export type
export type { UserProfile, UserStatus, UserRole };
