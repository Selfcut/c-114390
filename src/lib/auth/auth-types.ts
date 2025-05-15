
import { Session, User } from "@supabase/supabase-js";
import { UserStatus, UserProfile } from "@/types/user";

export interface AuthContextType {
  user: UserProfile | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, userData: object) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  updateUserStatus: (status: UserStatus) => Promise<void>;
  toggleGhostMode: () => Promise<void>;
  toggleDoNotDisturb: () => Promise<void>;
}
