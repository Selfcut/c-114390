
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
        .maybeSingle();

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      if (!data) {
        // Profile doesn't exist, create one
        const authUser = session?.user;
        if (authUser) {
          const newProfile = {
            id: userId,
            username: authUser.email?.split('@')[0] || `user_${userId.substring(0, 8)}`,
            name: authUser.user_metadata?.name || `User ${userId.substring(0, 4)}`,
            avatar_url: authUser.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${userId}`,
            bio: '',
            website: '',
            status: 'online' as UserStatus,
            is_ghost_mode: false,
            role: 'user'
          };

          const { data: createdProfile, error: createError } = await supabase
            .from('profiles')
            .insert(newProfile)
            .select()
            .single();

          if (createError) {
            console.error('Error creating profile:', createError);
            return null;
          }

          return {
            id: createdProfile.id,
            username: createdProfile.username,
            name: createdProfile.name,
            email: authUser.email || '',
            avatar: createdProfile.avatar_url,
            avatar_url: createdProfile.avatar_url,
            bio: createdProfile.bio,
            website: createdProfile.website,
            status: createdProfile.status as UserStatus,
            isGhostMode: createdProfile.is_ghost_mode,
            role: createdProfile.role as UserRole,
            isAdmin: createdProfile.role === 'admin'
          };
        }
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
        isAdmin: data.role === 'admin'
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

      return { data, error: null };
    } catch (error) {
      const err = error as AuthError;
      toast.error(err.message);
      return { error: err };
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
          },
        },
      });

      if (error) {
        toast.error(error.message);
        return { error };
      }

      if (data.user && !data.session) {
        toast.success('Please check your email to confirm your account');
      }

      return { data, error: null };
    } catch (error) {
      const err = error as AuthError;
      toast.error(err.message);
      return { error: err };
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
        toast.error('Failed to update profile');
        return { error };
      }

      // Update local user state
      setUser(prev => prev ? { ...prev, ...updates } : null);
      toast.success('Profile updated successfully');
      return { error: null };
    } catch (error) {
      toast.error('Failed to update profile');
      return { error: error as Error };
    }
  };

  const updateUserProfile = async (updates: Partial<UserProfile>) => {
    return updateProfile(updates);
  };

  const deleteAccount = async () => {
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
        return;
      }

      setUser(prev => prev ? { ...prev, status } : null);
    } catch (error) {
      console.error('Error updating user status:', error);
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
        return;
      }

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

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        setSession(session);
        
        if (session?.user) {
          // Defer profile fetching to avoid blocking the auth callback
          setTimeout(async () => {
            const profile = await fetchUserProfile(session.user.id);
            setUser(profile);
            setIsLoading(false);
          }, 0);
        } else {
          setUser(null);
          setIsLoading(false);
        }
      }
    );

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

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
