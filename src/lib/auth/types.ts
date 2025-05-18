
import { Session } from "@supabase/supabase-js";
import { UserStatus } from "@/types/user";

export interface UserProfile {
  id: string;
  email?: string;
  name: string;
  avatar_url?: string;
  username?: string;
  role?: string;
  isAdmin?: boolean;
  avatar?: string;
  bio?: string;
  website?: string;
  status?: UserStatus;
  isGhostMode?: boolean;
  notificationSettings?: {
    desktopNotifications: boolean;
    soundNotifications: boolean;
    emailNotifications: boolean;
  };
}

export interface AuthContextType {
  user: UserProfile | null;
  session: Session | null;
  isLoading: boolean;
  loading: boolean;
  error: Error | null;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any } | null>;
  signUp: (email: string, password: string, username: string, name?: string) => Promise<{ error: any } | null>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: any } | null>;
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<{ error: any } | null>;
}
