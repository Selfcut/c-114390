
import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { AuthContextType, UserProfile } from "./types";
import { fetchUserProfile } from "./utils";
import { signIn, signOut, signUp } from "./auth-methods";
import { updateUserProfile } from "./utils";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from session
  useEffect(() => {
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
              if (profile) setUser(profile);
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
            if (profile) setUser(profile);
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

  const value = {
    user,
    session,
    isLoading,
    isAuthenticated: !!user,
    signIn,
    signUp,
    signOut,
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
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  return context;
};
