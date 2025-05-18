
import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";
import { AuthContextType, UserProfile } from "./auth/types";
import { fetchUserProfile, updateUserProfile } from "./auth/utils";
import { signIn, signOut, signUp } from "./auth/auth-methods";

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
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
              }
              else {
                console.log("No profile found for user");
                setUser(null);
              }
            })
            .catch(err => {
              console.error("Error fetching user profile:", err);
              setUser(null);
            });
        }, 0);
      } else {
        console.log("No user in session, setting user to null");
        setUser(null);
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
            }
            else {
              console.log("No initial profile found");
              setUser(null);
            }
          })
          .catch(err => {
            console.error("Error fetching initial profile:", err);
            setUser(null);
          })
          .finally(() => setIsLoading(false));
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
      return { error };
    }
  };

  const handleSignUp = async (email: string, password: string, metadata = {}) => {
    try {
      console.log("Signing up with email:", email);
      const { error } = await signUp(email, password, metadata);
      
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
      return { error };
    }
  };

  const handleSignOut = async () => {
    try {
      console.log("Signing out");
      await signOut();
      
      // Explicitly clear state on signout
      setUser(null);
      setSession(null);
      
      toast({
        title: "Signed out successfully"
      });
    } catch (error) {
      console.error("Sign out exception:", error);
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleUpdateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) {
      return { error: new Error("User not authenticated") };
    }
    
    const result = await updateUserProfile(user.id, updates);
    
    if (!result.error) {
      // Update local user state
      setUser(prev => prev ? { ...prev, ...updates } : null);
    }
    
    return result;
  };

  const authValue: AuthContextType = {
    user,
    session,
    isLoading,
    isAuthenticated: !!user && !!session,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut,
    updateProfile: handleUpdateProfile
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
