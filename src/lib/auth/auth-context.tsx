
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/types/user';

interface AuthContextType {
  user: UserProfile | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: any }>;
  signUp: (email: string, password: string, userData?: any) => Promise<{ error?: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error?: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.info('[Auth] Setting up auth state listener');
    
    // Get initial session
    const getInitialSession = async () => {
      console.info('[Auth] Checking for existing session');
      try {
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('[Auth] Error getting initial session:', error);
          setSession(null);
          setUser(null);
        } else if (initialSession) {
          console.info('[Auth] Found existing session');
          setSession(initialSession);
          await fetchUserProfile(initialSession.user);
        } else {
          console.info('[Auth] No existing session found');
          setSession(null);
          setUser(null);
        }
      } catch (error) {
        console.error('[Auth] Exception getting initial session:', error);
        setSession(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.info('[Auth] Auth state changed:', event, { 
          hasSession: !!newSession,
          userId: newSession?.user?.id 
        });

        setSession(newSession);
        
        if (newSession?.user) {
          await fetchUserProfile(newSession.user);
        } else {
          console.info('[Auth] No active session, resetting user state');
          setUser(null);
        }
        
        setIsLoading(false);
      }
    );

    getInitialSession();

    return () => {
      console.info('[Auth] Cleaning up auth state listener');
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (authUser: User) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .maybeSingle();

      if (error) {
        console.error('[Auth] Error fetching profile:', error);
        // Create a basic user profile from auth data
        setUser({
          id: authUser.id,
          email: authUser.email || '',
          username: authUser.user_metadata?.username || `user_${authUser.id.slice(0, 8)}`,
          name: authUser.user_metadata?.name || '',
          avatar_url: authUser.user_metadata?.avatar_url || '',
          status: 'online',
          isGhostMode: false,
          role: 'user',
          isAdmin: false
        });
      } else if (profile) {
        setUser({
          id: profile.id,
          email: authUser.email || '',
          username: profile.username,
          name: profile.name || '',
          avatar_url: profile.avatar_url || '',
          status: profile.status || 'online',
          isGhostMode: profile.is_ghost_mode || false,
          role: profile.role || 'user',
          isAdmin: profile.role === 'admin'
        });
      }
    } catch (error) {
      console.error('[Auth] Exception fetching profile:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error };
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, userData?: any) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      });
      return { error };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    return { error };
  };

  const value: AuthContextType = {
    user,
    session,
    isLoading,
    isAuthenticated: !!user,
    signIn,
    signUp,
    signOut,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
