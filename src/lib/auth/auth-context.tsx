
import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";
import { AuthContextType, UserProfile } from "./types";
import { fetchUserProfile, updateUserProfile } from "./utils";
import { signIn, signOut, signUp } from "./auth-methods";

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
      console.log("Auth state changed:", event);
      setSession(newSession);
      
      // If there's a session, fetch or update the user profile
      if (newSession?.user) {
        // Don't fetch profile directly in the callback to avoid Supabase deadlocks
        // Instead use setTimeout to run it on the next event loop tick
        setTimeout(() => { 
          fetchUserProfile(newSession.user.id, newSession)
            .then(profile => {
              if (profile) setUser(profile as UserProfile);
              else setUser(null);
            });
        }, 0);
      } else {
        setUser(null);
      }
    });
    
    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      setSession(initialSession);
      
      if (initialSession?.user) {
        fetchUserProfile(initialSession.user.id, initialSession)
          .then(profile => {
            if (profile) setUser(profile as UserProfile);
            else setUser(null);
          })
          .finally(() => setIsLoading(false));
      } else {
        setIsLoading(false);
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSignIn = async (email: string, password: string) => {
    try {
      const { error } = await signIn(email, password);
      
      if (error) return { error };
      
      toast({
        title: "Signed in successfully",
        description: "Welcome back!"
      });
      
      return { error: null };
    } catch (error) {
      console.error("Sign in error:", error);
      return { error };
    }
  };

  const handleSignUp = async (email: string, password: string, metadata = {}) => {
    try {
      const { error } = await signUp(email, password, metadata);
      
      if (error) return { error };
      
      toast({
        title: "Sign up successful",
        description: "Please check your email to verify your account."
      });
      
      return { error: null };
    } catch (error) {
      console.error("Sign up error:", error);
      return { error };
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      
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

  const authValue: AuthContextType = {
    user,
    session,
    isLoading,
    isAuthenticated: !!user,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut,
    updateProfile: async (updates: Partial<UserProfile>) => {
      if (!user) {
        return { error: new Error("User not authenticated") };
      }
      
      const result = await updateUserProfile(user.id, updates);
      
      if (!result.error) {
        // Update local user state
        setUser(prev => prev ? { ...prev, ...updates } : null);
      }
      
      return result;
    }
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
