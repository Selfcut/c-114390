
export type UserStatus = "online" | "offline" | "away" | "do-not-disturb" | "invisible";

export interface UserProfile {
  id: string;
  name: string;
  username: string;
  email?: string;
  avatar: string;
  coverImage?: string;
  status: UserStatus;
  bio?: string;
  level?: number;
  xp?: number;
  iq?: number;
  badges?: Badge[];
  joinedAt?: Date;
  isGhostMode: boolean;
  isAdmin?: boolean;
  notificationSettings: {
    desktopNotifications: boolean;
    soundNotifications: boolean;
    emailNotifications: boolean;
  };
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  earnedAt: Date;
}
