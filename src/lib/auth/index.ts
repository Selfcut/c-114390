
// Export auth context and types
export * from './auth-context';
export * from './auth-types';

// Export utility functions without causing naming conflicts
export { signIn, signOut, signUp } from './auth-utils';

// Export profile service for direct access
export * from './profiles-service';

// Import the debugging utility
export { runProfileDiagnostics } from '../debug/profile-diagnostics';
