
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from './types';
import { UserStatus } from '@/types/user';

/**
 * Fetches user profile data from Supabase
 */
export async function fetchUserProfile(userId: string) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}

/**
 * Maps Supabase user and profile data to UserProfile type
 */
export function mapUserProfile(user: any, profile: any): UserProfile {
  return {
    id: user.id,
    email: user.email,
    name: profile?.name || user.user_metadata?.name || 'Unnamed User',
    avatar_url: profile?.avatar_url || user.user_metadata?.avatar_url,
    username: profile?.username || user.user_metadata?.username,
    role: profile?.role || 'user',
    isAdmin: profile?.role === 'admin',
    avatar: profile?.avatar_url || user.user_metadata?.avatar_url,
    status: (profile?.status as UserStatus) || 'online',
    isGhostMode: profile?.is_ghost_mode || false
  };
}

/**
 * Updates user profile in Supabase
 */
export async function updateUserProfile(userId: string, updates: Partial<UserProfile>) {
  try {
    // Remove any fields that shouldn't be sent to the profiles table
    const { id, email, isAdmin, ...profileUpdates } = updates;
    
    // Map avatar to avatar_url if it exists
    if (profileUpdates.avatar && !profileUpdates.avatar_url) {
      profileUpdates.avatar_url = profileUpdates.avatar;
      delete profileUpdates.avatar;
    }
    
    // Ensure status is a valid user_status enum value
    let updatedStatus: UserStatus | undefined;
    if (profileUpdates.status) {
      // Cast the status to the enum or use a safe default
      const status = profileUpdates.status as string;
      updatedStatus = ['online', 'away', 'offline', 'invisible', 'do-not-disturb'].includes(status)
        ? status as UserStatus
        : 'online';
    }
    
    // Map isGhostMode to is_ghost_mode
    if ('isGhostMode' in profileUpdates) {
      const { isGhostMode, ...rest } = profileUpdates;
      const updatedData = {
        ...rest,
        is_ghost_mode: isGhostMode,
        status: updatedStatus
      };
      
      const { error } = await supabase
        .from('profiles')
        .update(updatedData)
        .eq('id', userId);
      
      if (error) throw error;
    } else {
      // Regular update without ghost mode change
      const updatedData = {
        ...profileUpdates,
        status: updatedStatus
      };
      
      const { error } = await supabase
        .from('profiles')
        .update(updatedData)
        .eq('id', userId);
      
      if (error) throw error;
    }
    
    return { error: null };
  } catch (error) {
    console.error('Error updating user profile:', error);
    return { error };
  }
}
