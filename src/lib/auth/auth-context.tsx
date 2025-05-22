import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { fetchUserProfile, updateUserProfile, signIn, signOut, signUp, ensureUserProfile } from './auth-utils';
import { UserProfile, UserStatus, UserRole, AuthContextType } from '@/types/user';
import { useToast } from '@/hooks/use-toast';

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authInitialized, setAuthInitialized] = useState<boolean>(false);
  const { toast } = useToast();

  // Dedicated function to load user profile with robust error handling
  const loadUserProfile = useCallback(async (userId: string, currentSession: Session | null) => {
    if (!userId) return null;
    
    try {
      console.log(`[Auth] Loading profile for user: ${userId}`);
      const MAX_RETRIES = 2;
      let retryCount = 0;
      let profile = null;
      
      while (retryCount <= MAX_RETRIES && !profile) {
        profile = await fetchUserProfile(userId, currentSession);
        
        // If no profile was found, try to create one
        if (!profile) {
          console.log('[Auth] Profile not found, attempting to create one');
          profile = await ensureUserProfile(userId, {
            email: currentSession?.user?.email,
            name: currentSession?.user?.user_metadata?.name,
            username: currentSession?.user?.user_metadata?.username
          });
          
          if (!profile) {
            console.error(`[Auth] Failed to create profile for user: ${userId}, attempt ${retryCount + 1}`);
            
            retryCount++;
            if (retryCount <= MAX_RETRIES) {
              console.log(`[Auth] Retrying profile loading, attempt ${retryCount + 1}...`);
              // Wait briefly before retrying
              await new Promise(resolve => setTimeout(resolve, 500 * retryCount));
            }
          }
        }
      }
      
      if (profile) {
        console.log(`[Auth] Successfully loaded profile for user: ${userId}`);
        return profile;
      } else {
        console.error(`[Auth] Failed to load profile after ${MAX_RETRIES + 1} attempts`);
        return null;
      }
    } catch (error) {
      console.error('[Auth] Error loading user profile:', error);
      return null;
    }
  }, []);

  // Handle auth state changes with improved flow and error recovery
  const handleAuthStateChange = useCallback((session: Session | null) => {
    setSession(session);
    
    if (!session) {
      // No active session, reset user state
      console.log('[Auth] No active session, resetting user state');
      setUser(null);
      setIsAuthenticated(false);
      return;
    }
    
    // Session exists, load the profile outside of the auth state change callback
    // to avoid auth state deadlocks
    if (session?.user) {
      const userId = session.user.id;
      console.log(`[Auth] Session exists, loading profile for: ${userId}`);
      
      loadUserProfile(userId, session).then(profile => {
        if (profile) {
          console.log(`[Auth] Profile loaded: ${profile.username}`);
          setUser(profile);
          setIsAuthenticated(true);
        } else {
          console.error(`[Auth] Failed to load profile for authenticated user: ${userId}`);
          
          // Recovery attempt: create a minimal profile from session data
          const minimalProfile: UserProfile = {
            id: userId,
            username: session.user.user_metadata?.username || `user_${userId.substring(0, 8)}`,
            name: session.user.user_metadata?.name || `User ${userId.substring(0, 4)}`,
            email: session.user.email || '',
            avatar: null,
            avatar_url: null,
            bio: '',
            website: '',
            status: 'online',
            isGhostMode: false,
            role: 'user',
            isAdmin: false,
            notificationSettings: {
              desktopNotifications: true,
              soundNotifications: true,
              emailNotifications: true
            }
          };
          
          console.log('[Auth] Using recovery minimal profile');
          setUser(minimalProfile);
          setIsAuthenticated(true);
        }
      });
    }
  }, [loadUserProfile]);

  useEffect(() => {
    setIsLoading(true);
    console.log("[Auth] Setting up auth state listener");
    
    // Set up auth state listener FIRST (correct initialization order)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, currentSession) => {
      console.log('[Auth] Auth state changed:', event, currentSession?.user?.id);
      
      // Update session state
      handleAuthStateChange(currentSession);
    });
    
    // THEN check for existing session
    const initializeAuth = async () => {
      try {
        console.log("[Auth] Checking for existing session");
        const { data: { session: existingSession } } = await supabase.auth.getSession();
        
        if (existingSession) {
          console.log("[Auth] Found existing session:", existingSession.user.id);
          handleAuthStateChange(existingSession);
        } else {
          console.log("[Auth] No existing session found");
          handleAuthStateChange(null);
        }
      } catch (error) {
        console.error('[Auth] Error initializing auth:', error);
        // In case of error, assume no active session
        handleAuthStateChange(null);
      } finally {
        setIsLoading(false);
        setAuthInitialized(true);
      }
    };

    initializeAuth();

    return () => {
      console.log("[Auth] Cleaning up auth state listener");
      subscription.unsubscribe();
    };
  }, [handleAuthStateChange]);

  // Sign in with email and password
  const handleSignIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      console.log("Signing in with email:", email);
      const { data, error } = await signIn(email, password);
      
      if (error) {
        console.error("Sign in error:", error);
        toast({
          title: "Sign in failed",
          description: error.message,
          variant: "destructive"
        });
        return { error };
      }
      
      return { data, error: null };
    } catch (error) {
      console.error("Error signing in:", error);
      const errorObj = error instanceof Error ? error : new Error("An unexpected error occurred");
      toast({
        title: "Sign in failed",
        description: errorObj.message,
        variant: "destructive"
      });
      return { error: errorObj };
    } finally {
      setIsLoading(false);
    }
  };

  // Sign up with email and password
  const handleSignUp = async (email: string, password: string, username: string, name?: string) => {
    setIsLoading(true);
    try {
      console.log("Signing up with email:", email);
      const { data, error } = await signUp(email, password, username, name);
      
      if (error) {
        console.error("Sign up error:", error);
        toast({
          title: "Sign up failed",
          description: error.message,
          variant: "destructive"
        });
        return { error };
      }
      
      toast({
        title: "Sign up successful",
        description: "Please check your email to verify your account."
      });
      
      return { data, error: null };
    } catch (error) {
      console.error("Error signing up:", error);
      const errorObj = error instanceof Error ? error : new Error("An unexpected error occurred");
      toast({
        title: "Sign up failed",
        description: errorObj.message,
        variant: "destructive"
      });
      return { error: errorObj };
    } finally {
      setIsLoading(false);
    }
  };

  // Sign out
  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOut();
      setUser(null);
      setSession(null);
      setIsAuthenticated(false);
      
      toast({
        title: "Signed out successfully"
      });
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Error signing out",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Update user profile
  const handleUpdateProfile = async (updates: Partial<UserProfile>): Promise<{ error: Error | null }> => {
    if (!user) {
      return { error: new Error("User not authenticated") };
    }
    
    setIsLoading(true);
    try {
      const result = await updateUserProfile(user.id, updates);
      
      if (!result.error) {
        setUser(prev => prev ? { ...prev, ...updates } : null);
        toast({
          title: "Profile updated",
          description: "Your profile has been successfully updated."
        });
      } else {
        toast({
          title: "Update failed",
          description: result.error.message,
          variant: "destructive"
        });
      }
      
      return result;
    } catch (error) {
      console.error('Error updating user profile:', error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      toast({
        title: "Update failed",
        description: message,
        variant: "destructive"
      });
      return { error: error instanceof Error ? error : new Error('Unknown error') };
    } finally {
      setIsLoading(false);
    }
  };

  // Update user status with improved error handling
  const updateUserStatus = async (status: UserStatus): Promise<void> => {
    if (!user) {
      console.error('[Auth] Cannot update status: User not authenticated');
      throw new Error('User not authenticated');
    }
    
    try {
      const result = await handleUpdateProfile({ status });
      if (result.error) {
        console.error('[Auth] Error updating status:', result.error);
        throw result.error;
      }
      console.log(`[Auth] Status updated to: ${status}`);
    } catch (error) {
      console.error('[Auth] Failed to update user status:', error);
      toast({
        title: "Status Update Failed",
        description: error instanceof Error ? error.message : "Could not update status",
        variant: "destructive"
      });
      throw error;
    }
  };
  
  // Toggle ghost mode
  const toggleGhostMode = async (): Promise<void> => {
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    const result = await handleUpdateProfile({ isGhostMode: !user.isGhostMode });
    if (result.error) {
      throw result.error;
    }
  };
  
  // Toggle do not disturb
  const toggleDoNotDisturb = async (): Promise<void> => {
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    const newStatus: UserStatus = user.status === 'do-not-disturb' ? 'online' : 'do-not-disturb';
    const result = await handleUpdateProfile({ status: newStatus });
    if (result.error) {
      throw result.error;
    }
  };
  
  // Delete account
  const deleteAccount = async (): Promise<{ error: Error | null }> => {
    if (!user) {
      return { error: new Error('User not authenticated') };
    }
    
    setIsLoading(true);
    try {
      // Delete the user account
      const { error } = await supabase.auth.admin.deleteUser(user.id);
      
      if (error) {
        return { error: new Error(error.message) };
      }
      
      // Sign out after deletion
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setIsAuthenticated(false);
      
      return { error: null };
    } catch (error) {
      console.error('Error deleting account:', error);
      return { error: error instanceof Error ? error : new Error('Unknown error') };
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    session,
    isLoading,
    isAuthenticated,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut,
    updateUserProfile: handleUpdateProfile,
    updateProfile: handleUpdateProfile, // Alias for backward compatibility
    updateUserStatus,
    toggleGhostMode,
    toggleDoNotDisturb,
    deleteAccount
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
