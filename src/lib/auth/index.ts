
// src/lib/auth/index.ts
export { AuthProvider, useAuth } from './auth-context';
export { UserProfile, AuthContextType } from './types';
export { fetchUserProfile, updateUserProfile } from './utils';
export { signIn, signOut, signUp } from './auth-methods';
