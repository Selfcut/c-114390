
import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";
import { AuthContextType } from "./auth/auth-types";
import { UserProfile, UserStatus } from "./auth/auth-types";
import { fetchUserProfile, updateUserProfile } from "./auth/utils";
import { signIn, signOut, signUp } from "./auth/utils";

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();

  // Initialize auth state from session
  useEffect(() => {
    console.log("Setting up auth state listener");
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      console.log("Auth state changed:", event, newSession?.user?.id);
      setSession(newSession);
      
      // If there's a session, fetch or update the user profile
      if (newSession?.user) {
        // Don't fetch profile directly in the callback to avoid Supabase deadlocks
        // Instead use setTimeout to run it on the next event loop tick
        setTimeout(() => { 
          fetchUserProfile(newSession.user.id, newSession)
            .then(profile => {
              if (profile) {
                console.log("User profile fetched:", profile);
                setUser(profile);
                setIsAuthenticated(true);
              }
              else {
                console.log("No profile found for user");
                setUser(null);
                setIsAuthenticated(false);
              }
              setIsLoading(false);
            })
            .catch(err => {
              console.error("Error fetching user profile:", err);
              setUser(null);
              setIsAuthenticated(false);
              setIsLoading(false);
            });
        }, 0);
      } else {
        console.log("No user in session, setting user to null");
        setUser(null);
        setIsAuthenticated(false);
        setIsLoading(false);
      }
    });
    
    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      console.log("Initial session check:", initialSession?.user?.id);
      setSession(initialSession);
      
      if (initialSession?.user) {
        fetchUserProfile(initialSession.user.id, initialSession)
          .then(profile => {
            if (profile) {
              console.log("Initial profile fetch:", profile);
              setUser(profile);
              setIsAuthenticated(true);
            }
            else {
              console.log("No initial profile found");
              setUser(null);
              setIsAuthenticated(false);
            }
          })
          .catch(err => {
            console.error("Error fetching initial profile:", err);
            setUser(null);
            setIsAuthenticated(false);
          })
          .finally(() => {
            setIsLoading(false);
          });
      } else {
        console.log("No initial session");
        setIsLoading(false);
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSignIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      console.log("Signing in with email:", email);
      const { error } = await signIn(email, password);
      
      if (error) {
        console.error("Sign in error:", error);
        return { error };
      }
      
      toast({
        title: "Signed in successfully",
        description: "Welcome back!"
      });
      
      return { error: null };
    } catch (error) {
      console.error("Sign in exception:", error);
      const message = error instanceof Error ? error.message : 'An unexpected error occurred';
      return { error: { message } };
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (email: string, password: string, username: string, name?: string) => {
    try {
      setIsLoading(true);
      console.log("Signing up with email:", email);
      const { error } = await signUp(email, password, username, name);
      
      if (error) {
        console.error("Sign up error:", error);
        return { error };
      }
      
      toast({
        title: "Sign up successful",
        description: "Please check your email to verify your account."
      });
      
      return { error: null };
    } catch (error) {
      console.error("Sign up exception:", error);
      const message = error instanceof Error ? error.message : 'An unexpected error occurred';
      return { error: { message } };
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      console.log("Signing out");
      await signOut();
      
      // Explicitly clear state on signout
      setUser(null);
      setSession(null);
      setIsAuthenticated(false);
      
      toast({
        title: "Signed out successfully"
      });
    } catch (error: any) {
      console.error("Sign out exception:", error);
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) {
      return { error: new Error("User not authenticated") };
    }
    
    try {
      setIsLoading(true);
      
      const result = await updateUserProfile(user.id, updates);
      
      if (!result.error) {
        // Update local state
        setUser(prev => prev ? { ...prev, ...updates } : null);
        toast({
          title: "Profile updated",
          description: "Your profile has been successfully updated."
        });
      } else {
        toast({
          title: "Update failed",
          description: result.error.message || "Failed to update profile",
          variant: "destructive"
        });
      }
      
      return { error: result.error };
    } catch (error) {
      console.error("Error updating profile:", error);
      const message = error instanceof Error ? error.message : 'An unexpected error occurred';
      toast({
        title: "Update failed",
        description: message,
        variant: "destructive"
      });
      return { error: new Error(message) };
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserStatus = async (status: UserStatus): Promise<void> => {
    try {
      if (!user) throw new Error('User not authenticated');
      
      await handleUpdateProfile({ status });
    } catch (error) {
      console.error("Error updating user status:", error);
      toast({
        title: "Failed to update status",
        variant: "destructive"
      });
      throw error;
    }
  };
  
  const toggleGhostMode = async (): Promise<void> => {
    try {
      if (!user) throw new Error('User not authenticated');
      
      const currentGhostMode = user.isGhostMode || false;
      await handleUpdateProfile({ isGhostMode: !currentGhostMode });
      
      toast({
        title: `Ghost mode ${!currentGhostMode ? 'enabled' : 'disabled'}`
      });
    } catch (error) {
      console.error("Error toggling ghost mode:", error);
      toast({
        title: "Failed to toggle ghost mode",
        variant: "destructive"
      });
      throw error;
    }
  };
  
  const toggleDoNotDisturb = async (): Promise<void> => {
    try {
      if (!user) throw new Error('User not authenticated');
      
      const newStatus: UserStatus = user.status === 'do-not-disturb' ? 'online' : 'do-not-disturb';
      await handleUpdateProfile({ status: newStatus });
      
      toast({
        title: `Do not disturb ${newStatus === 'do-not-disturb' ? 'enabled' : 'disabled'}`
      });
    } catch (error) {
      console.error("Error toggling do not disturb:", error);
      toast({
        title: "Failed to toggle do not disturb mode",
        variant: "destructive"
      });
      throw error;
    }
  };
  
  const deleteAccount = async (): Promise<{ error: Error | null }> => {
    try {
      setIsLoading(true);
      
      if (!user) {
        return { error: new Error('User not authenticated') };
      }
      
      // Delete the user account
      const { error } = await supabase.auth.admin.deleteUser(user.id);
      
      if (error) {
        return { error: new Error(error.message || 'Failed to delete account') };
      }
      
      // Sign out after deletion
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setIsAuthenticated(false);
      
      toast({
        title: "Account deleted successfully"
      });
      return { error: null };
    } catch (error) {
      console.error("Error deleting account:", error);
      const message = error instanceof Error ? error.message : 'An unexpected error occurred';
      toast({
        title: "Failed to delete account",
        description: message,
        variant: "destructive"
      });
      return { error: new Error(message) };
    } finally {
      setIsLoading(false);
    }
  };

  const authValue: AuthContextType = {
    user,
    session,
    isLoading,
    isAuthenticated,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut,
    updateUserProfile: handleUpdateProfile,
    updateProfile: handleUpdateProfile, // Keeping this alias for backward compatibility
    updateUserStatus,
    toggleGhostMode,
    toggleDoNotDisturb,
    deleteAccount
  };

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  return context;
};

export { AuthContext };
export default AuthProvider;
