
// This is a new consolidated file that simplifies our auth management
import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";

// Define our user profile type
export interface UserProfile {
  id: string;
  email?: string;
  name: string;
  avatar?: string;
  username?: string;
  role?: string;
  isAdmin?: boolean;
}

// Define the auth context type
export interface AuthContextType {
  user: UserProfile | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, metadata?: object) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: any }>;
}

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Function to fetch user profile from Supabase
export const fetchUserProfile = async (userId: string, session?: Session) => {
  try {
    // Fetch profile data
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }

    if (!profile) {
      console.warn("No profile found for user:", userId);
      return null;
    }

    // Build user profile object
    const userProfile: UserProfile = {
      id: userId,
      email: session?.user?.email,
      name: profile.name || 'Anonymous User',
      avatar: profile.avatar_url,
      username: profile.username,
      role: profile.role,
      isAdmin: profile.role === 'admin',
    };

    return userProfile;
  } catch (err) {
    console.error("Exception in fetchUserProfile:", err);
    return null;
  }
};

// Function to update user profile
export const updateUserProfile = async (userId: string, updates: Partial<UserProfile>) => {
  try {
    // Map UserProfile fields to profile table fields
    const profileUpdates: any = {};
    if (updates.name) profileUpdates.name = updates.name;
    if (updates.avatar) profileUpdates.avatar_url = updates.avatar;
    if (updates.username) profileUpdates.username = updates.username;
    
    const { error } = await supabase
      .from('profiles')
      .update(profileUpdates)
      .eq('id', userId);
    
    if (error) return { error };
    return { error: null };
  } catch (err) {
    return { error: err };
  }
};

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
              if (profile) setUser(profile);
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
            if (profile) setUser(profile);
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

  // Auth methods
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) return { error };
      
      // We don't need to manually set user or session here
      // The onAuthStateChange handler will do that
      
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

  const signUp = async (email: string, password: string, metadata = {}) => {
    try {
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password, 
        options: { 
          data: metadata,
          emailRedirectTo: `${window.location.origin}/auth/callback`
        } 
      });
      
      if (error) return { error };
      
      // Display a message about email confirmation
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

  const signOutUser = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Sign out error:", error);
        toast({
          title: "Error signing out",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Signed out successfully"
        });
      }
    } catch (error) {
      console.error("Sign out exception:", error);
    }
  };

  const authValue: AuthContextType = {
    user,
    session,
    isLoading,
    isAuthenticated: !!user,
    signIn,
    signUp,
    signOut: signOutUser,
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
