
export type UserStatus = 'online' | 'away' | 'busy' | 'offline' | 'do-not-disturb';
export type UserRole = 'user' | 'moderator' | 'admin';

export interface UserProfile {
  id: string;
  username: string;
  name?: string;
  email: string;
  avatar?: string;
  avatar_url?: string;
  bio?: string;
  website?: string;
  status: UserStatus;
  isGhostMode: boolean;
  role: UserRole;
  isAdmin: boolean;
}

export interface AuthContextType {
  user: UserProfile | null;
  session: any;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<{ data?: any; error?: any }>;
  signUp: (email: string, password: string, username: string, name?: string) => Promise<{ data?: any; error?: any }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error?: any }>;
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<{ error?: any }>;
  deleteAccount: () => Promise<{ error?: any }>;
  updateUserStatus: (status: UserStatus) => Promise<void>;
  toggleGhostMode: () => Promise<void>;
  toggleDoNotDisturb: () => Promise<void>;
}
