
import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
  level?: number;
  xp?: number;
  iq?: number;
  status: 'online' | 'offline' | 'away' | 'do-not-disturb' | 'invisible';
  isGhostMode: boolean;
  notificationSettings: {
    desktopNotifications: boolean;
    soundNotifications: boolean;
    emailNotifications: boolean;
  };
}

interface AuthContextType {
  user: UserProfile | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, userData: object) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  updateUserStatus: (status: UserProfile['status']) => Promise<void>;
  toggleGhostMode: () => Promise<void>;
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
          fetchUserProfile(session.user.id, session);
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
        fetchUserProfile(session.user.id, session);
      } else {
        setIsLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string, authSession: Session | null) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      if (data) {
        const userData: UserProfile = {
          id: userId,
          name: data.name || authSession?.user?.user_metadata.full_name || 'User',
          email: authSession?.user?.email || '',
          avatar: data.avatar_url || authSession?.user?.user_metadata.avatar_url,
          role: data.role || 'user',
          level: data.level || 1,
          xp: data.xp || 0,
          iq: data.iq || 100,
          status: data.status || 'online',
          isGhostMode: data.is_ghost_mode || false,
          notificationSettings: {
            desktopNotifications: data.desktop_notifications !== false,
            soundNotifications: data.sound_notifications !== false,
            emailNotifications: data.email_notifications !== false,
          }
        };
        
        setUser(userData);
        localStorage.setItem('userName', userData.name);
        if (userData.avatar) {
          localStorage.setItem('userAvatar', userData.avatar);
        }
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      // Create basic profile from auth data as fallback
      if (authSession?.user) {
        const basicUserData: UserProfile = {
          id: userId,
          name: authSession.user.user_metadata.full_name || 'User',
          email: authSession.user.email || '',
          avatar: authSession.user.user_metadata.avatar_url,
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
      
      // Update profile in Supabase
      const { error } = await supabase
        .from('profiles')
        .update({
          name: updates.name,
          avatar_url: updates.avatar,
          level: updates.level,
          xp: updates.xp,
          iq: updates.iq,
          status: updates.status,
          is_ghost_mode: updates.isGhostMode,
          desktop_notifications: updates.notificationSettings?.desktopNotifications,
          sound_notifications: updates.notificationSettings?.soundNotifications,
          email_notifications: updates.notificationSettings?.emailNotifications,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
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

  const updateUserStatus = async (status: UserProfile['status']) => {
    try {
      if (!user) throw new Error("User not authenticated");
      
      // Update status in Supabase
      const { error } = await supabase
        .from('profiles')
        .update({ 
          status,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
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
      
      // Update ghost mode in Supabase
      const { error } = await supabase
        .from('profiles')
        .update({ 
          is_ghost_mode: newGhostMode,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
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
