
// Re-export everything from the auth context
export { AuthProvider, useAuth } from './auth-context';
export type { UserProfile, AuthContextType } from './types';
export { fetchUserProfile, updateUserProfile } from './utils';
export { signIn, signOut, signUp } from './auth-methods';
