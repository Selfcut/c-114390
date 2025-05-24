
import { supabase } from '@/integrations/supabase/client';
import { UserProfile, UserRole } from '@/types/user';

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
export const upsertUserProfile = async (profile: Partial<UserProfile> & { id: string }): Promise<UserProfile | null> => {
  try {
    const profileData = {
      id: profile.id,
      username: profile.username || '',
      name: profile.name,
      avatar_url: profile.avatar_url,
      bio: profile.bio,
      website: profile.website,
      status: profile.status,
      is_ghost_mode: profile.isGhostMode,
      role: profile.role
    };

    const { data, error } = await supabase
      .from('profiles')
      .upsert(profileData)
      .select()
      .single();

    if (error) throw error;
    
    return {
      id: data.id,
      username: data.username,
      name: data.name,
      email: profile.email || '',
      avatar: data.avatar_url,
      avatar_url: data.avatar_url,
      bio: data.bio,
      website: data.website,
      status: data.status,
      isGhostMode: data.is_ghost_mode,
      role: data.role as UserRole,
      isAdmin: data.role === 'admin'
    };
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
    
    return {
      id: data.id,
      username: data.username,
      name: data.name,
      email: '', // Email not stored in profiles table
      avatar: data.avatar_url,
      avatar_url: data.avatar_url,
      bio: data.bio,
      website: data.website,
      status: data.status,
      isGhostMode: data.is_ghost_mode,
      role: data.role as UserRole,
      isAdmin: data.role === 'admin'
    };
  } catch {
    return null;
  }
};

/**
 * Ensure user profile exists
 */
export const ensureUserProfile = async (userId: string, userData?: any): Promise<UserProfile | null> => {
  try {
    // Check if profile exists
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (existingProfile) {
      return {
        id: existingProfile.id,
        username: existingProfile.username,
        name: existingProfile.name,
        email: userData?.email || '',
        avatar: existingProfile.avatar_url,
        avatar_url: existingProfile.avatar_url,
        bio: existingProfile.bio,
        website: existingProfile.website,
        status: existingProfile.status,
        isGhostMode: existingProfile.is_ghost_mode,
        role: existingProfile.role as UserRole,
        isAdmin: existingProfile.role === 'admin'
      };
    }

    // Create new profile if it doesn't exist
    const newProfile = {
      id: userId,
      username: userData?.username || `user_${userId.substring(0, 8)}`,
      name: userData?.name || `User ${userId.substring(0, 4)}`,
      avatar_url: userData?.avatar_url || `https://api.dicebear.com/6.x/initials/svg?seed=${userId}`,
      bio: '',
      website: '',
      status: 'online' as const,
      is_ghost_mode: false,
      role: 'user' as const
    };

    const { data, error } = await supabase
      .from('profiles')
      .insert(newProfile)
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      username: data.username,
      name: data.name,
      email: userData?.email || '',
      avatar: data.avatar_url,
      avatar_url: data.avatar_url,
      bio: data.bio,
      website: data.website,
      status: data.status,
      isGhostMode: data.is_ghost_mode,
      role: data.role as UserRole,
      isAdmin: data.role === 'admin'
    };
  } catch (error) {
    console.error('Error ensuring user profile:', error);
    return null;
  }
};

/**
 * Fetch user profile by ID
 */
export const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    
    return {
      id: data.id,
      username: data.username,
      name: data.name,
      email: '', // Email not stored in profiles table
      avatar: data.avatar_url,
      avatar_url: data.avatar_url,
      bio: data.bio,
      website: data.website,
      status: data.status,
      isGhostMode: data.is_ghost_mode,
      role: data.role as UserRole,
      isAdmin: data.role === 'admin'
    };
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};
