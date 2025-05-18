import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface UserProfile {
  id: string;
  email?: string;
  name?: string;
  avatar_url?: string;
  username?: string;
  isAdmin?: boolean;
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  error: Error | null;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username: string, name?: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUserProfile: (updates: Partial<UserProfile>): Promise<{ error: any } | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check active session on load
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }

        if (data?.session?.user) {
          const { id, email } = data.session.user;
          
          // Get profile details
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', id)
            .single();
          
          // Create user object with profile data
          const userWithProfile = {
            id,
            email: email || undefined,
            name: profileData?.name,
            avatar_url: profileData?.avatar_url,
            username: profileData?.username,
            isAdmin: profileData?.role === 'admin'
          };
          
          setUser(userWithProfile);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error checking session:', error);
        setError(error instanceof Error ? error : new Error(String(error)));
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Subscribe to auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const { id, email } = session.user;
        
        // Get profile details
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', id)
          .single();
        
        // Create user object with profile data
        const userWithProfile = {
          id,
          email: email || undefined,
          name: profileData?.name,
          avatar_url: profileData?.avatar_url,
          username: profileData?.username,
          isAdmin: profileData?.role === 'admin'
        };
        
        setUser(userWithProfile);
        setIsAuthenticated(true);
        
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setIsAuthenticated(false);
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      
      toast.success("Signed in successfully");
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to sign in';
      toast.error(message);
      setError(error instanceof Error ? error : new Error(String(error)));
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, username: string, name?: string) => {
    try {
      setLoading(true);
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            name: name || username
          }
        }
      });

      if (error) throw error;
      
      toast.success("Account created! Check your email to confirm your account.");
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to sign up';
      toast.error(message);
      setError(error instanceof Error ? error : new Error(String(error)));
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast.success("Signed out successfully");
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to sign out';
      toast.error(message);
      setError(error instanceof Error ? error : new Error(String(error)));
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfile = async (updates: Partial<UserProfile>): Promise<{ error: any } | null> => {
    try {
      setLoading(true);
      
      if (!user) throw new Error('User not authenticated');
      
      // Update the profile in the database
      const { error } = await supabase
        .from('profiles')
        .update({
          name: updates.name,
          avatar_url: updates.avatar_url,
          username: updates.username
        })
        .eq('id', user.id);
        
      if (error) throw error;
      
      // Update local user state
      setUser(prev => prev ? { ...prev, ...updates } : null);
      
      toast.success("Profile updated successfully");
      return { error: null };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update profile';
      toast.error(message);
      setError(error instanceof Error ? error : new Error(String(error)));
      return { error };
    } finally {
      setLoading(false);
    }
  };
  
  const value = {
    user,
    loading,
    error,
    isAuthenticated,
    signIn,
    signUp,
    signOut,
    updateUserProfile
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
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

export default AuthProvider;
