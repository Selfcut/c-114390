
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
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string, username: string, name?: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: AuthError | null }>;
  updateUserStatus?: (status: UserStatus) => Promise<void>;
  toggleGhostMode?: () => Promise<void>;
  toggleDoNotDisturb?: () => Promise<void>;
  deleteAccount: () => Promise<{ error: AuthError | null }>;
}

// Re-export the UserProfile type from the central location for backward compatibility
export type { UserProfile, UserStatus, UserRole };
