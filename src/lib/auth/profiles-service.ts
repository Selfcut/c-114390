
import { supabase } from '@/integrations/supabase/client';
import { UserProfile, UserStatus, UserRole } from '@/types/user';

/**
 * Fetch a user's profile by ID
 * @param userId The user's ID
 */
export async function fetchUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    if (!userId) {
      console.warn('Cannot fetch profile without user ID');
      return null;
    }
    
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
    
    if (!profile) {
      console.warn('No profile found for user ID:', userId);
      return null;
    }
    
    // Use appropriate type handling for UserRole
    const role: UserRole = (profile.role || 'user') as UserRole;
    
    return {
      id: profile.id,
      username: profile.username || 'anonymous',
      name: profile.name || 'Anonymous User',
      email: '',  // Email needs to be fetched from auth session
      avatar: profile.avatar_url,
      avatar_url: profile.avatar_url,
      bio: profile.bio || '',
      website: profile.website || '',
      status: (profile.status as UserStatus) || 'offline',
      isGhostMode: profile.is_ghost_mode || false,
      role: role,
      isAdmin: role === 'admin',
      notificationSettings: {
        desktopNotifications: true,
        soundNotifications: true,
        emailNotifications: true
      }
    };
  } catch (err) {
    console.error('Exception in fetchUserProfile:', err);
    return null;
  }
}

/**
 * Update a user's profile
 * @param userId The user's ID
 * @param updates The profile updates to apply
 */
export async function updateUserProfile(
  userId: string,
  updates: Partial<UserProfile>
): Promise<{ error: Error | null }> {
  try {
    // Convert from our app UserProfile type to database fields
    const dbUpdates: any = {};
    
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.username !== undefined) dbUpdates.username = updates.username;
    if (updates.bio !== undefined) dbUpdates.bio = updates.bio;
    if (updates.website !== undefined) dbUpdates.website = updates.website;
    if (updates.avatar_url !== undefined) dbUpdates.avatar_url = updates.avatar_url;
    if (updates.avatar !== undefined) dbUpdates.avatar_url = updates.avatar;
    if (updates.status !== undefined) dbUpdates.status = updates.status;
    if (updates.isGhostMode !== undefined) dbUpdates.is_ghost_mode = updates.isGhostMode;
    
    // Only update if there are changes
    if (Object.keys(dbUpdates).length === 0) {
      return { error: null };
    }
    
    const { error } = await supabase
      .from('profiles')
      .update(dbUpdates)
      .eq('id', userId);
      
    if (error) {
      return { error: new Error(error.message) };
    }
    
    return { error: null };
  } catch (err) {
    console.error('Exception in updateProfile:', err);
    const message = err instanceof Error ? err.message : 'Unknown error';
    return { error: new Error(message) };
  }
}

/**
 * Ensure a user profile exists, creating it if necessary
 * @param userId The user's ID
 * @param defaultProfile Default profile values to use if creating
 */
export async function ensureUserProfile(
  userId: string, 
  defaultProfile: Partial<UserProfile> = {}
): Promise<UserProfile | null> {
  try {
    // First check if profile exists
    const existingProfile = await fetchUserProfile(userId);
    
    // If profile exists, return it
    if (existingProfile) {
      return existingProfile;
    }
    
    // If no profile, create one
    console.log('Creating new profile for user:', userId);
    
    const newProfileData = {
      id: userId,
      username: defaultProfile.username || `user_${userId.substring(0, 8)}`,
      name: defaultProfile.name || `User ${userId.substring(0, 4)}`,
      avatar_url: defaultProfile.avatar_url || null,
      status: 'online' as UserStatus,
      role: 'user' as UserRole,
      is_ghost_mode: false,
      bio: '',
      website: ''
    };
    
    const { data: profile, error } = await supabase
      .from('profiles')
      .insert(newProfileData)
      .select()
      .single();
      
    if (error) {
      console.error('Error creating user profile:', error);
      return null;
    }
    
    // Return the newly created profile
    return {
      id: profile.id,
      username: profile.username,
      name: profile.name,
      email: '',  // Email needs to be fetched from auth
      avatar: profile.avatar_url,
      avatar_url: profile.avatar_url,
      bio: profile.bio || '',
      website: profile.website || '',
      status: profile.status as UserStatus,
      isGhostMode: profile.is_ghost_mode || false,
      role: profile.role as UserRole,
      isAdmin: profile.role === 'admin',
      notificationSettings: {
        desktopNotifications: true,
        soundNotifications: true,
        emailNotifications: true
      }
    };
    
  } catch (err) {
    console.error('Exception in ensureUserProfile:', err);
    return null;
  }
}
