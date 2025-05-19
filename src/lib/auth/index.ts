
// Export all auth functionality from a single entry point
export * from './auth-context';
// Export the types directly from user.ts to avoid duplicates
export type { UserProfile, UserStatus, UserRole } from '@/types/user';
export * from './auth-utils';
