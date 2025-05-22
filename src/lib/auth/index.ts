
// Export auth context and provider
export { AuthProvider, useAuth } from './auth-context';

// Export types carefully to avoid ambiguity
export type { UserProfile, UserStatus, UserRole } from './auth-types';
export type { AuthContextType } from './auth-types';
export type { AuthState } from './auth-types';

// Export utility functions
export { signIn, signOut, signUp, fetchUserProfile, updateUserProfile, createUserProfile } from './auth-utils';

// Export profile service for direct access
export * from './profiles-service';
