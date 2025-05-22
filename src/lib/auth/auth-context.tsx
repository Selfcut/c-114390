
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { fetchUserProfile, updateUserProfile, signIn, signOut, signUp } from './auth-utils';
import { UserProfile, UserStatus, UserRole, AuthContextType } from '@/types/user';
import { useToast } from '@/hooks/use-toast';

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const { toast } = useToast();

  // Dedicated function to load user profile
  const loadUserProfile = useCallback(async (userId: string, currentSession: Session | null) => {
    if (!userId) return null;
    
    try {
      console.log(`Loading profile for user: ${userId}`);
      const profile = await fetchUserProfile(userId, currentSession);
      return profile;
    } catch (error) {
      console.error('Error loading user profile:', error);
      return null;
    }
  }, []);

  // Handle auth state changes independently
  const handleAuthStateChange = useCallback((session: Session | null) => {
    setSession(session);
    
    if (!session) {
      // No active session, reset user state
      setUser(null);
      setIsAuthenticated(false);
      return;
    }
    
    // Session exists, load the profile outside of the auth state change callback
    // to avoid auth state deadlocks
    if (session?.user) {
      const userId = session.user.id;
      loadUserProfile(userId, session).then(profile => {
        if (profile) {
          setUser(profile);
          setIsAuthenticated(true);
        } else {
          console.error(`Failed to load profile for authenticated user: ${userId}`);
          setUser(null);
          setIsAuthenticated(false);
        }
      });
    }
  }, [loadUserProfile]);

  useEffect(() => {
    setIsLoading(true);
    console.log("Setting up auth state listener");
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, currentSession) => {
      console.log('Auth state changed:', event, currentSession?.user?.id);
      
      // Update session state
      handleAuthStateChange(currentSession);
    });
    
    // Check for existing session
    const initializeAuth = async () => {
      try {
        console.log("Checking for existing session");
        const { data: { session: existingSession } } = await supabase.auth.getSession();
        
        if (existingSession) {
          console.log("Found existing session:", existingSession.user.id);
          handleAuthStateChange(existingSession);
        } else {
          console.log("No existing session found");
          handleAuthStateChange(null);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        handleAuthStateChange(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    return () => {
      console.log("Cleaning up auth state listener");
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

  // Update user status
  const updateUserStatus = async (status: UserStatus): Promise<void> => {
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    const result = await handleUpdateProfile({ status });
    if (result.error) {
      throw result.error;
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
