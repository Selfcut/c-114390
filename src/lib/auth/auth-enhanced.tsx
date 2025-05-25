
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { UserProfile, UserStatus, AuthContextType } from '@/types/user';
import { toast } from 'sonner';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
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
        console.log('Auth state changed:', event, session?.user?.id);
        setSession(session);
        
        if (session?.user) {
          await fetchUserProfile(session.user);
        } else {
          setUser(null);
        }
        setIsLoading(false);
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchUserProfile(session.user);
      } else {
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (authUser: User) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      if (profile) {
        const userProfile: UserProfile = {
          id: profile.id,
          username: profile.username,
          name: profile.name,
          email: authUser.email || '',
          avatar_url: profile.avatar_url,
          bio: profile.bio,
          website: profile.website,
          status: profile.status as UserStatus,
          isGhostMode: profile.is_ghost_mode,
          role: profile.role,
          isAdmin: profile.role === 'admin',
          notificationSettings: {
            emailNotifications: true, // Default values since these don't exist in DB yet
            pushNotifications: true,
            soundEnabled: true
          }
        };
        setUser(userProfile);
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      return { data };
    } catch (error: any) {
      console.error('Sign in error:', error);
      return { error };
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, username: string, name?: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            name: name || username,
          }
        }
      });
      
      if (error) throw error;
      
      return { data };
    } catch (error: any) {
      console.error('Sign up error:', error);
      return { error };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      setSession(null);
    } catch (error: any) {
      console.error('Sign out error:', error);
      toast.error('Error signing out');
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return { error: 'No user logged in' };
    
    try {
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
      return {};
    } catch (error: any) {
      console.error('Update profile error:', error);
      return { error };
    }
  };

  const updateUserProfile = updateProfile; // Alias for consistency

  const deleteAccount = async () => {
    // Implementation would depend on your requirements
    return { error: 'Not implemented' };
  };

  const updateUserStatus = async (status: UserStatus) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ status })
        .eq('id', user.id);
      
      if (error) throw error;
      
      setUser(prev => prev ? { ...prev, status } : null);
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const toggleGhostMode = async () => {
    if (!user) return;
    
    try {
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
    if (!user) return;
    
    const newStatus = user.status === 'do-not-disturb' ? 'online' : 'do-not-disturb';
    await updateUserStatus(newStatus);
  };

  const value: AuthContextType = {
    user,
    session,
    isLoading,
    isAuthenticated: !!session && !!user,
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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
