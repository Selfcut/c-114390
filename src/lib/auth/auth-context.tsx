
import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { UserProfile } from "@/types/user";
import { AuthContextType } from "./auth-types";
import { fetchUserProfile, clearUserData } from "./auth-utils";
import { useAuthenticationMethods } from "./auth-authentication";
import { useProfileManagement } from "./auth-profile";
import { usePresenceManagement } from "./auth-presence";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Initialize auth methods
  const { signIn, signUp, signOut } = useAuthenticationMethods();
  const { updateProfile, updateUserStatus } = useProfileManagement(user, setUser);
  const { toggleGhostMode, toggleDoNotDisturb } = usePresenceManagement(user, setUser);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        
        if (session?.user) {
          // Fetch user profile from our profiles table
          setTimeout(() => {
            fetchUserProfile(session.user.id, session)
              .then(profile => setUser(profile))
              .catch(console.error)
              .finally(() => setIsLoading(false));
          }, 0);
        } else {
          setUser(null);
          clearUserData();
          setIsLoading(false);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      
      if (session?.user) {
        fetchUserProfile(session.user.id, session)
          .then(profile => setUser(profile))
          .catch(console.error)
          .finally(() => setIsLoading(false));
      } else {
        setIsLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        isAuthenticated: !!user,
        signIn,
        signUp,
        signOut,
        updateProfile,
        updateUserStatus,
        toggleGhostMode,
        toggleDoNotDisturb,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
