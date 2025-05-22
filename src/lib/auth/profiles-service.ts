
// Export all functions from auth-utils for backward compatibility
export * from './auth-utils';

// Explicitly re-export the ensureUserProfile function to ensure TypeScript sees it
export { ensureUserProfile } from './auth-utils';
