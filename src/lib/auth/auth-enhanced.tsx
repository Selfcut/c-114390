import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User, AuthError } from '@supabase/supabase-js';
import { UserProfile, AuthContextType, UserStatus, UserRole } from '@/types/user';
import { toast } from 'sonner';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      return {
        id: data.id,
        username: data.username,
        name: data.name,
        email: session?.user?.email || '',
        avatar: data.avatar_url,
        avatar_url: data.avatar_url,
        bio: data.bio,
        website: data.website,
        status: data.status as UserStatus,
        isGhostMode: data.is_ghost_mode,
        role: data.role as UserRole,
        isAdmin: data.role === 'admin',
        notificationSettings: {
          emailNotifications: data.email_notifications || true,
          pushNotifications: data.push_notifications || true,
          soundEnabled: data.sound_enabled || true,
        }
      };
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      return null;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
        return { error };
      }

      toast.success('Signed in successfully!');
      return { data, error: null };
    } catch (error) {
      const errorMessage = 'An unexpected error occurred during sign in';
      toast.error(errorMessage);
      return { error: error as AuthError };
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
            name,
          },
        },
      });

      if (error) {
        toast.error(error.message);
        return { error };
      }

      toast.success('Account created successfully! Please check your email to verify your account.');
      return { data, error: null };
    } catch (error) {
      const errorMessage = 'An unexpected error occurred during sign up';
      toast.error(errorMessage);
      return { error: error as AuthError };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error('Error signing out');
        console.error('Sign out error:', error);
      } else {
        setUser(null);
        setSession(null);
        toast.success('Signed out successfully');
      }
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Error signing out');
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) {
      return { error: new Error('No user logged in') };
    }

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

      if (error) {
        toast.error(`Failed to update profile: ${error.message}`);
        return { error };
      }

      // Update local user state
      setUser(prev => prev ? { ...prev, ...updates } : null);
      toast.success('Profile updated successfully!');
      return { error: null };
    } catch (error) {
      toast.error('An unexpected error occurred while updating profile');
      return { error: error as Error };
    }
  };

  const updateUserProfile = async (updates: Partial<UserProfile>) => {
    return updateProfile(updates);
  };

  const deleteAccount = async () => {
    // Note: Supabase doesn't allow direct user deletion from client
    // This would need to be implemented via an edge function or admin API
    toast.error('Account deletion is not implemented in the client. Please contact support.');
    return { error: new Error('Account deletion not implemented') };
  };

  const updateUserStatus = async (status: UserStatus) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ status })
        .eq('id', user.id);

      if (error) {
        console.error('Error updating user status:', error);
        toast.error(`Failed to update status: ${error.message}`);
        return;
      }

      setUser(prev => prev ? { ...prev, status } : null);
      toast.success(`Status updated to ${status}`);
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error('An unexpected error occurred while updating status');
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

      if (error) {
        console.error('Error toggling ghost mode:', error);
        toast.error(`Failed to toggle ghost mode: ${error.message}`);
        return;
      }

      setUser(prev => prev ? { ...prev, isGhostMode: newGhostMode } : null);
      toast.success(`Ghost mode ${newGhostMode ? 'enabled' : 'disabled'}`);
    } catch (error) {
      console.error('Error toggling ghost mode:', error);
      toast.error('An unexpected error occurred while toggling ghost mode');
    }
  };

  const toggleDoNotDisturb = async () => {
    if (!user) return;

    const newStatus = user.status === 'do-not-disturb' ? 'online' : 'do-not-disturb';
    await updateUserStatus(newStatus);
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchUserProfile(session.user.id).then(profile => {
          setUser(profile);
          setIsLoading(false);
        });
      } else {
        setIsLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      
      if (session?.user) {
        const profile = await fetchUserProfile(session.user.id);
        setUser(profile);
      } else {
        setUser(null);
      }
      
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const value: AuthContextType = {
    user,
    session,
    isLoading,
    isAuthenticated: !!user,
    signIn,
    signUp,
    signOut,
    updateProfile: async () => ({ error: null }),
    updateUserProfile: async () => ({ error: null }),
    deleteAccount: async () => ({ error: new Error('Not implemented') }),
    updateUserStatus: async () => {},
    toggleGhostMode: async () => {},
    toggleDoNotDisturb: async () => {},
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
