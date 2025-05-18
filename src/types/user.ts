

export type UserStatus = "online" | "offline" | "away" | "busy" | "do-not-disturb" | "invisible";
export type UserRole = "user" | "moderator" | "admin";

export interface UserProfile {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar: string;
  bio?: string;
  website?: string;
  status: UserStatus;
  isGhostMode: boolean;
  role: UserRole | string;
  isAdmin: boolean;
  notificationSettings?: {
    desktopNotifications: boolean;
    soundNotifications: boolean;
    emailNotifications: boolean;
  };
}

