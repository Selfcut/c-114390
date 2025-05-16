
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
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, metadata?: any) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  updateUserStatus: (status: UserStatus) => Promise<void>;
  toggleGhostMode: () => Promise<void>;
  toggleDoNotDisturb: () => Promise<void>;
}

// Re-export types from the main user.ts
export { UserProfile, UserStatus, UserRole };
