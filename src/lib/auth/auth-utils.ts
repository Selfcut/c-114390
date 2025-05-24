
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/types/user';

/**
 * Check if the current user is an admin
 */
export const isAdmin = async (userId?: string): Promise<boolean> => {
  if (!userId) return false;

  try {
    const { data } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .eq('role', 'admin')
      .single();

    return !!data;
  } catch {
    return false;
  }
};

/**
 * Check if the current user has a specific role
 */
export const hasRole = async (userId: string, role: 'admin' | 'moderator' | 'user'): Promise<boolean> => {
  try {
    const { data } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .eq('role', role)
      .single();

    return !!data;
  } catch {
    return false;
  }
};

/**
 * Get user roles
 */
export const getUserRoles = async (userId: string): Promise<string[]> => {
  try {
    const { data } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId);

    return data?.map(r => r.role) || [];
  } catch {
    return [];
  }
};

/**
 * Create or update user profile
 */
export const upsertUserProfile = async (profile: Partial<UserProfile>): Promise<UserProfile | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .upsert(profile)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error upserting user profile:', error);
    return null;
  }
};

/**
 * Get user by username
 */
export const getUserByUsername = async (username: string): Promise<UserProfile | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', username)
      .single();

    if (error) throw error;
    return data;
  } catch {
    return null;
  }
};
