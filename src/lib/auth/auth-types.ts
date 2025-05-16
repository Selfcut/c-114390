
import { User } from "@supabase/supabase-js";

export type UserStatus = "online" | "offline" | "away" | "busy";

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
