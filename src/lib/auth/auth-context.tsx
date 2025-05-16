
import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { UserProfile, UserStatus } from "@/types/user";
import { fetchUserProfile, updateUserProfile, updateUserStatus, clearUserData } from "./auth-utils";
import { useAuthenticationMethods } from "./auth-authentication";
import { usePresenceManagement } from "./auth-presence";
import { toast } from "@/components/ui/use-toast";

interface AuthContextType {
  user: UserProfile | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, metadata?: any) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  updateUserStatus: (status: UserProfile['status']) => Promise<void>;
  toggleGhostMode: () => Promise<void>;
  toggleDoNotDisturb: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Initialize auth methods
  const { signIn, signUp, signOut } = useAuthenticationMethods();
  const { toggleGhostMode, toggleDoNotDisturb } = usePresenceManagement(user, setUser);

  const handleUpdateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) throw new Error("User not authenticated");
    
    try {
      await updateUserProfile(user.id, updates);
      
      // Update local state
      setUser(prevUser => prevUser ? { ...prevUser, ...updates } : null);
      
      toast({
        title: "Profile updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Failed to update profile",
        description: error.message,
        variant: "destructive",
      });
    }
  };
  
  const handleUpdateUserStatus = async (status: UserProfile['status']) => {
    if (!user) throw new Error("User not authenticated");
    
    try {
      await updateUserStatus(user.id, status);
      
      // Update local state
      setUser(prevUser => prevUser ? { ...prevUser, status } : null);
      
      toast({
        title: `Status updated to ${status}`,
      });
    } catch (error: any) {
      console.error('Error updating status:', error);
    }
  };

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
        updateProfile: handleUpdateProfile,
        updateUserStatus: handleUpdateUserStatus,
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
