
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { fetchUserProfile, updateUserProfile as updateProfile } from './auth-utils';
import { UserProfile, UserStatus, UserRole, AuthContextType } from './auth-types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // Set up auth listener first to avoid deadlocks
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log('Auth state changed:', event);
        setSession(currentSession);

        if (currentSession?.user) {
          // Use setTimeout to avoid potential deadlocks with Supabase
          setTimeout(async () => {
            try {
              // Fetch the user profile
              const profile = await fetchUserProfile(currentSession.user.id, currentSession);
              
              if (profile) {
                setUser(profile);
                setIsAuthenticated(true);
              } else {
                console.warn('No profile found for user after auth state change');
                setUser(null);
                setIsAuthenticated(false);
              }
            } catch (error) {
              console.error('Error fetching user profile:', error);
            } finally {
              setIsLoading(false);
            }
          }, 0);
        } else {
          setUser(null);
          setIsAuthenticated(false);
          setIsLoading(false);
        }
      }
    );

    // Check for existing session
    const initializeAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        setSession(data.session);

        if (data.session?.user) {
          // Fetch the user profile
          const profile = await fetchUserProfile(data.session.user.id, data.session);
          
          if (profile) {
            setUser(profile);
            setIsAuthenticated(true);
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Sign in with email and password
  const handleSignIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        return { error };
      }
      
      return { data };
    } catch (error) {
      console.error('Error signing in:', error);
      return { error };
    } finally {
      setIsLoading(false);
    }
  };

  // Sign up with email and password
  const handleSignUp = async (email: string, password: string, username: string, name?: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            name: name || username
          }
        }
      });
      
      if (error) {
        return { error };
      }
      
      return { data };
    } catch (error) {
      console.error('Error signing up:', error);
      return { error };
    } finally {
      setIsLoading(false);
    }
  };

  // Sign out
  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error signing out:', error);
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
      const result = await updateProfile(user.id, updates);
      
      if (!result.error) {
        setUser(prev => prev ? { ...prev, ...updates } : null);
      }
      
      return result;
    } catch (error) {
      console.error('Error updating user profile:', error);
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
