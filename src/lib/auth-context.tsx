
import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";
import { UserStatus, UserProfile } from "@/types/user";

interface AuthContextType {
  user: UserProfile | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, userData: object) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  updateUserStatus: (status: UserStatus) => Promise<void>;
  toggleGhostMode: () => Promise<void>;
  toggleDoNotDisturb: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        
        if (session?.user) {
          // Fetch user profile from our profiles table
          fetchUserProfile(session.user.id);
        } else {
          setUser(null);
          localStorage.removeItem('userName');
          localStorage.removeItem('userAvatar');
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      // In a real app with Supabase, we would fetch profile data
      // For now using localStorage and session data as a placeholder
      
      // Create basic profile from auth data
      const basicUserData: UserProfile = {
        id: userId,
        name: session?.user?.user_metadata.full_name || 'User',
        username: session?.user?.user_metadata.username || session?.user?.email?.split('@')[0] || 'user',
        email: session?.user?.email || '',
        avatar: session?.user?.user_metadata.avatar_url || `https://api.dicebear.com/7.x/personas/svg?seed=${userId}`,
        coverImage: session?.user?.user_metadata.cover_image,
        status: 'online',
        level: 1,
        xp: 0,
        iq: 100,
        isGhostMode: false,
        isAdmin: session?.user?.email === 'admin@example.com', // Simple admin check
        notificationSettings: {
          desktopNotifications: true,
          soundNotifications: true,
          emailNotifications: true,
        },
        badges: []
      };
      
      setUser(basicUserData);
      localStorage.setItem('userName', basicUserData.name);
      if (basicUserData.avatar) {
        localStorage.setItem('userAvatar', basicUserData.avatar);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      // Fallback to basic profile
      if (session?.user) {
        const basicUserData: UserProfile = {
          id: userId,
          name: session.user.user_metadata.full_name || 'User',
          username: session.user.user_metadata.username || session.user.email?.split('@')[0] || 'user',
          email: session.user.email || '',
          avatar: session.user.user_metadata.avatar_url || `https://api.dicebear.com/7.x/personas/svg?seed=${userId}`,
          status: 'online',
          isGhostMode: false,
          notificationSettings: {
            desktopNotifications: true,
            soundNotifications: true,
            emailNotifications: true,
          }
        };
        setUser(basicUserData);
        localStorage.setItem('userName', basicUserData.name);
        if (basicUserData.avatar) {
          localStorage.setItem('userAvatar', basicUserData.avatar);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return { error: null };
    } catch (error) {
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      });
      return { error };
    }
  };

  const signUp = async (email: string, password: string, userData: object = {}) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        }
      });
      if (error) throw error;
      toast({
        title: "Registration Successful",
        description: "Please check your email to verify your account.",
      });
      return { error: null };
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive",
      });
      return { error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast({
        title: "Signed out successfully",
      });
    } catch (error) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      if (!user) throw new Error("User not authenticated");
      
      // In a real app with Supabase tables, this would update the profiles table
      // For now, just update the local state
      
      // Update local state
      setUser(prevUser => prevUser ? { ...prevUser, ...updates } : null);
      
      if (updates.name) localStorage.setItem('userName', updates.name);
      if (updates.avatar) localStorage.setItem('userAvatar', updates.avatar);
      
      toast({
        title: "Profile updated successfully",
      });
    } catch (error) {
      toast({
        title: "Failed to update profile",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const updateUserStatus = async (status: UserStatus) => {
    try {
      if (!user) throw new Error("User not authenticated");
      
      // In a real app with Supabase tables, this would update the status in the profiles table
      // For now, just update the local state
      
      // Update local state
      setUser(prevUser => prevUser ? { ...prevUser, status } : null);
      
      toast({
        title: `Status updated to ${status}`,
      });
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const toggleGhostMode = async () => {
    try {
      if (!user) throw new Error("User not authenticated");
      
      const newGhostMode = !user.isGhostMode;
      
      // In a real app with Supabase tables, this would update is_ghost_mode in the profiles table
      // For now, just update the local state
      
      // Update local state
      setUser(prevUser => prevUser ? { ...prevUser, isGhostMode: newGhostMode } : null);
      
      toast({
        title: `Ghost mode ${newGhostMode ? 'enabled' : 'disabled'}`,
        description: newGhostMode ? 
          "You're now browsing invisibly" : 
          "You're now visible to other users",
      });
    } catch (error) {
      console.error('Error toggling ghost mode:', error);
    }
  };

  const toggleDoNotDisturb = async () => {
    try {
      if (!user) throw new Error("User not authenticated");
      
      const isDoNotDisturb = user.status === "do-not-disturb";
      const newStatus: UserStatus = isDoNotDisturb ? "online" : "do-not-disturb";
      
      // Update local state
      setUser(prevUser => prevUser ? { ...prevUser, status: newStatus } : null);
      
      // Update notification settings
      if (newStatus === "do-not-disturb") {
        setUser(prevUser => prevUser ? {
          ...prevUser,
          notificationSettings: {
            ...prevUser.notificationSettings,
            soundNotifications: false,
            desktopNotifications: false
          }
        } : null);
      }
      
      toast({
        title: `Do Not Disturb ${newStatus === "do-not-disturb" ? 'enabled' : 'disabled'}`,
        description: newStatus === "do-not-disturb" ? 
          "All notifications are now muted" : 
          "Notifications have been restored",
      });
    } catch (error) {
      console.error('Error toggling do not disturb:', error);
    }
  };

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
