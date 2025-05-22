
// Export auth context and provider
export { AuthProvider, useAuth } from './auth-context';

// Export types from the single source of truth
export type { UserProfile, UserStatus, UserRole } from './types';
export type { AuthContextType, AuthState } from './types';

// Export utility functions
export { signIn, signOut, signUp, fetchUserProfile, updateUserProfile, createUserProfile } from './auth-utils';

// Export profile service for direct access
export * from './profiles-service';
