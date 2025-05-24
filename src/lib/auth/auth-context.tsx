
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { UserProfile, AuthContextType, UserStatus } from '@/types/user';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        
        if (session?.user) {
          // Fetch user profile
          setTimeout(async () => {
            try {
              const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();

              if (profile) {
                setUser({
                  id: profile.id,
                  username: profile.username,
                  name: profile.name,
                  email: session.user.email || '',
                  avatar: profile.avatar_url,
                  avatar_url: profile.avatar_url,
                  bio: profile.bio,
                  website: profile.website,
                  status: profile.status as UserStatus,
                  isGhostMode: profile.is_ghost_mode,
                  role: profile.role as 'admin' | 'moderator' | 'user',
                  isAdmin: profile.role === 'admin'
                });
              }
            } catch (error) {
              console.error('Error fetching user profile:', error);
            }
          }, 0);
        } else {
          setUser(null);
        }
        setIsLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) {
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error, data };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signUp = async (email: string, password: string, username: string, name?: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            name: name || username,
          },
        },
      });
      return { error, data };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      if (!user?.id) throw new Error('No user logged in');

      const { error } = await supabase
        .from('profiles')
        .update({
          name: updates.name,
          bio: updates.bio,
          website: updates.website,
          avatar_url: updates.avatar_url,
        })
        .eq('id', user.id);

      if (error) throw error;

      setUser(prev => prev ? { ...prev, ...updates } : null);
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const updateUserProfile = updateProfile;

  const deleteAccount = async () => {
    try {
      // This would typically be handled by a server function
      return { error: new Error('Delete account functionality not implemented') };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const updateUserStatus = async (status: UserStatus) => {
    try {
      if (!user?.id) throw new Error('No user logged in');

      const { error } = await supabase
        .from('profiles')
        .update({ status })
        .eq('id', user.id);

      if (error) throw error;

      setUser(prev => prev ? { ...prev, status } : null);
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  const toggleGhostMode = async () => {
    try {
      if (!user?.id) throw new Error('No user logged in');

      const newGhostMode = !user.isGhostMode;
      const { error } = await supabase
        .from('profiles')
        .update({ is_ghost_mode: newGhostMode })
        .eq('id', user.id);

      if (error) throw error;

      setUser(prev => prev ? { ...prev, isGhostMode: newGhostMode } : null);
    } catch (error) {
      console.error('Error toggling ghost mode:', error);
    }
  };

  const toggleDoNotDisturb = async () => {
    const newStatus = user?.status === 'do-not-disturb' ? 'online' : 'do-not-disturb';
    await updateUserStatus(newStatus);
  };

  const value: AuthContextType = {
    user,
    session,
    isLoading,
    isAuthenticated: !!session,
    signIn,
    signUp,
    signOut,
    updateProfile,
    updateUserProfile,
    deleteAccount,
    updateUserStatus,
    toggleGhostMode,
    toggleDoNotDisturb,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
