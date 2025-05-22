
// This file handles the Supabase client configuration
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Constants for Supabase configuration
const SUPABASE_URL = "https://zmevoxevezwnkigertpn.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InptZXZveGV2ZXp3bmtpZ2VydHBuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyNzYxMDcsImV4cCI6MjA2Mjg1MjEwN30.pWgLkPyobQPhf2fgvI9suqWjDl_VvYEu7Y4coc5RzsM";

// Create and configure the Supabase client as a singleton
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storage: localStorage,
  }
});

// Add debug helpers to monitor auth state changes in development
if (import.meta.env.MODE === 'development') {
  // Monitor auth state
  supabase.auth.onAuthStateChange((event, session) => {
    console.log(`[Supabase Auth] Event: ${event}`, session ? `User: ${session.user?.email}` : 'No session');
  });
}
