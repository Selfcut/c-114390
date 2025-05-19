import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UserProfile, UserStatus } from "@/types/user";
import { AuthContextType, AuthError } from "./auth-types";
import { fetchUserProfile, updateUserProfile as updateUserProfileUtil } from "./auth-utils";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState(null);

  useEffect(() => {
    // Check active session on load
    const checkSession = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }

        if (data?.session?.user) {
          const { id } = data.session.user;
          
          // Get user profile using our utility function
          const userProfile = await fetchUserProfile(id, data.session);
          
          // Set the session
          setSession(data.session);
          
          // Convert to UserProfile type before setting state
          setUser(userProfile as UserProfile);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error checking session:', error);
        setError(error instanceof Error ? error : new Error(String(error)));
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
        setIsLoading(false);
      }
    };

    checkSession();

    // Subscribe to auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const { id } = session.user;
        
        // Get user profile using our utility function
        const userProfile = await fetchUserProfile(id, session);
        
        // Set the session
        setSession(session);
        
        // Convert to UserProfile type before setting state
        setUser(userProfile as UserProfile);
        setIsAuthenticated(true);
        
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setIsAuthenticated(false);
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string): Promise<{ error: AuthError | null }> => {
    try {
      setLoading(true);
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      // Handle Supabase error objects properly
      if (error) {
        return { error: { message: error.message || 'Failed to sign in', status: error.status } };
      }
      
      toast.success("Signed in successfully");
      return { error: null };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to sign in';
      toast.error(message);
      setError(error instanceof Error ? error : new Error(String(error)));
      return { error: { message } };
    } finally {
      setLoading(false);
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, username: string, name?: string): Promise<{ error: AuthError | null }> => {
    try {
      setLoading(true);
      setIsLoading(true);
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            name: name || username
          }
        }
      });

      // Handle Supabase error objects properly
      if (error) {
        return { error: { message: error.message || 'Failed to sign up', status: error.status } };
      }
      
      toast.success("Account created! Check your email to confirm your account.");
      return { error: null };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to sign up';
      toast.error(message);
      setError(error instanceof Error ? error : new Error(String(error)));
      return { error: { message } };
    } finally {
      setLoading(false);
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast.success("Signed out successfully");
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to sign out';
      toast.error(message);
      setError(error instanceof Error ? error : new Error(String(error)));
    } finally {
      setLoading(false);
      setIsLoading(false);
    }
  };

  const handleUpdateUserProfile = async (updates: Partial<UserProfile>): Promise<{ error: AuthError | null }> => {
    try {
      setLoading(true);
      setIsLoading(true);
      
      if (!user) throw new Error('User not authenticated');
      
      // Update the profile using our utility function
      const { error } = await updateUserProfileUtil(user.id, updates);
        
      if (error) {
        return { error: { message: error.message || 'Failed to update profile' } };
      }
      
      // Update local user state by creating new object with updated fields
      setUser(prev => prev ? { ...prev, ...updates } : null);
      
      toast.success("Profile updated successfully");
      return { error: null };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update profile';
      toast.error(message);
      setError(error instanceof Error ? error : new Error(String(error)));
      return { error: { message } };
    } finally {
      setLoading(false);
      setIsLoading(false);
    }
  };
  
  // Implement the deleteAccount function required by AuthContextType
  const deleteAccount = async (): Promise<{ error: AuthError | null }> => {
    try {
      setLoading(true);
      setIsLoading(true);
      
      if (!user) {
        return { error: { message: 'User not authenticated' } };
      }
      
      // Delete the user account
      const { error } = await supabase.auth.admin.deleteUser(user.id);
      
      if (error) {
        return { error: { message: error.message || 'Failed to delete account' } };
      }
      
      // Sign out after deletion
      await supabase.auth.signOut();
      setUser(null);
      setIsAuthenticated(false);
      
      toast.success("Account deleted successfully");
      return { error: null };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete account';
      toast.error(message);
      setError(error instanceof Error ? error : new Error(String(error)));
      return { error: { message } };
    } finally {
      setLoading(false);
      setIsLoading(false);
    }
  };
  
  // Update user status utility function
  const updateUserStatus = async (status: UserStatus): Promise<void> => {
    try {
      if (!user) throw new Error('User not authenticated');
      
      await handleUpdateUserProfile({ status });
    } catch (error) {
      console.error("Error updating user status:", error);
      toast.error("Failed to update status");
      throw error;
    }
  };
  
  // Toggle ghost mode utility function
  const toggleGhostMode = async (): Promise<void> => {
    try {
      if (!user) throw new Error('User not authenticated');
      
      const currentGhostMode = user.isGhostMode || false;
      await handleUpdateUserProfile({ isGhostMode: !currentGhostMode });
      
      toast.success(`Ghost mode ${!currentGhostMode ? 'enabled' : 'disabled'}`);
    } catch (error) {
      console.error("Error toggling ghost mode:", error);
      toast.error("Failed to toggle ghost mode");
      throw error;
    }
  };
  
  // Toggle do not disturb utility function
  const toggleDoNotDisturb = async (): Promise<void> => {
    try {
      if (!user) throw new Error('User not authenticated');
      
      const newStatus: UserStatus = user.status === 'do-not-disturb' ? 'online' : 'do-not-disturb';
      await handleUpdateUserProfile({ status: newStatus });
      
      toast.success(`Do not disturb ${newStatus === 'do-not-disturb' ? 'enabled' : 'disabled'}`);
    } catch (error) {
      console.error("Error toggling do not disturb:", error);
      toast.error("Failed to toggle do not disturb mode");
      throw error;
    }
  };
  
  const value: AuthContextType = {
    user,
    session,
    isLoading,
    isAuthenticated,
    signIn,
    signUp,
    signOut,
    updateProfile: handleUpdateUserProfile,
    updateUserStatus,
    toggleGhostMode,
    toggleDoNotDisturb,
    deleteAccount
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

export default AuthProvider;
