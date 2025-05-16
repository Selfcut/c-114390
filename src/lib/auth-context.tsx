
import { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { UserStatus } from "./auth/auth-types";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextValue {
  user: UserProfile | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, metadata?: any) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: any }>;
}

// Define the UserProfile interface locally to match the database schema
interface UserProfile {
  id: string;
  email: string;
  name: string;
  username: string;
  avatar: string;
  bio?: string;
  website?: string;
  role: string;
  isAdmin: boolean;
  status: "online" | "away" | "do-not-disturb" | "invisible" | "offline";
  isGhostMode?: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

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
          fetchUserProfile(newSession.user.id, newSession);
        }, 0);
      } else {
        setUser(null);
      }
    });
    
    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      setSession(initialSession);
      
      if (initialSession?.user) {
        fetchUserProfile(initialSession.user.id, initialSession);
      } else {
        setIsLoading(false);
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Fetch user profile from database
  const fetchUserProfile = async (userId: string, userSession: Session | null) => {
    try {
      // Fetch the user profile from the profiles table
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error("Error fetching user profile:", error);
        // Create a minimal user object with just the auth info
        const minimalUser: UserProfile = {
          id: userId,
          email: userSession?.user?.email || "",
          name: userSession?.user?.user_metadata.name || userSession?.user?.email?.split('@')[0] || "User",
          username: userSession?.user?.user_metadata.username || userSession?.user?.email?.split('@')[0] || "user",
          avatar: userSession?.user?.user_metadata.avatar_url || `https://api.dicebear.com/6.x/initials/svg?seed=${userSession?.user?.email}`,
          role: "user",
          isAdmin: false,
          status: "online",
          bio: "",
          website: ""
        };
        setUser(minimalUser);
      } else if (profile) {
        // Create a merged profile with both auth and profile data
        const fullProfile: UserProfile = {
          id: userId,
          email: userSession?.user?.email || "",
          name: profile.name || userSession?.user?.user_metadata.name || "User",
          username: profile.username || userSession?.user?.user_metadata.username || "user",
          avatar: profile.avatar_url || userSession?.user?.user_metadata.avatar_url || `https://api.dicebear.com/6.x/initials/svg?seed=${userSession?.user?.email}`,
          bio: profile.bio || "",
          website: profile.website || "",
          role: profile.role || "user",
          isAdmin: profile.role === "admin",
          status: profile.status || "online",
          isGhostMode: profile.is_ghost_mode || false,
        };
        setUser(fullProfile);

        // Special case for the admin user
        if (userId === "dc7bedf3-14c3-4376-adfb-de5ac8207adc") {
          // If this is the user we want to make admin, update their role
          await supabase
            .from('profiles')
            .update({ role: 'admin' })
            .eq('id', userId);
          
          fullProfile.role = "admin";
          fullProfile.isAdmin = true;
          setUser({...fullProfile});
        }
      }
    } catch (error) {
      console.error("Error in fetchUserProfile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        return { error };
      }
      
      return { error: null };
    } catch (error) {
      console.error("Sign in error:", error);
      return { error };
    }
  };

  // Sign up with email and password
  const signUp = async (email: string, password: string, metadata = {}) => {
    try {
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password, 
        options: { 
          data: metadata 
        } 
      });
      
      if (error) {
        return { error };
      }
      
      return { error: null };
    } catch (error) {
      console.error("Sign up error:", error);
      return { error };
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  // Update user profile
  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      if (!user) {
        return { error: new Error("User not authenticated") };
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          name: updates.name,
          username: updates.username,
          avatar_url: updates.avatar,
          bio: updates.bio,
          website: updates.website,
          status: updates.status,
          is_ghost_mode: updates.isGhostMode
        })
        .eq('id', user.id);

      if (error) {
        return { error };
      }

      // Update local user state
      setUser(prev => prev ? { ...prev, ...updates } : null);

      return { error: null };
    } catch (error) {
      console.error("Update profile error:", error);
      return { error };
    }
  };

  const value = {
    user,
    session,
    isLoading,
    isAuthenticated: !!user,
    signIn,
    signUp,
    signOut,
    updateProfile
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
