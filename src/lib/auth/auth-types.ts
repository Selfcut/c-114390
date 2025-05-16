
import { User } from "@supabase/supabase-js";

export type UserStatus = "online" | "offline" | "away" | "dnd" | "invisible";

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  username: string;
  avatar: string;
  bio?: string;
  website?: string;
  role: string;
  isAdmin: boolean;
  status: UserStatus;
  isGhostMode?: boolean;
  notificationSettings?: {
    desktopNotifications: boolean;
    soundNotifications: boolean;
    emailNotifications: boolean;
  };
}

export type AppRole = "admin" | "moderator" | "user";

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
