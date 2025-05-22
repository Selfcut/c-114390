
import { supabase } from '@/integrations/supabase/client';
import { UserProfile, UserStatus, UserRole } from '@/types/user';
import { fetchUserProfile as utilsFetchUserProfile, updateUserProfile as utilsUpdateUserProfile } from './auth-utils';

// Re-export fetchUserProfile from auth-utils for backward compatibility
export const fetchUserProfile = utilsFetchUserProfile;

// Re-export updateUserProfile from auth-utils for backward compatibility
export const updateUserProfile = utilsUpdateUserProfile;

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
      avatar_url: defaultProfile.avatar_url || `https://api.dicebear.com/6.x/initials/svg?seed=${defaultProfile.username || userId.substring(0, 8)}`,
      status: 'online' as UserStatus,
      role: 'user' as UserRole,
      is_ghost_mode: false,
      bio: defaultProfile.bio || '',
      website: defaultProfile.website || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
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
