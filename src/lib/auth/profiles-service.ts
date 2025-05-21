
import { supabase } from '@/integrations/supabase/client';
import { UserProfile, UserStatus } from '@/types/user';

// Default user object for when profile data is unavailable
export const DEFAULT_USER: UserProfile = {
  id: '',
  username: 'unknown',
  name: 'Unknown User',
  email: '',
  avatar_url: null,
  status: 'offline',
  isGhostMode: false,
  role: 'user',
  isAdmin: false,
  bio: '',
  website: ''
};

// Fetch a user's profile from the database
export async function fetchUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    console.log('Fetching profile for user ID:', userId);
    
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
      
    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
    
    if (!profile) {
      console.warn('No profile found for user ID:', userId);
      return null;
    }
    
    // Map database profile to UserProfile type
    const userProfile: UserProfile = {
      id: profile.id,
      username: profile.username || 'unknown',
      name: profile.name || 'Unknown User',
      email: '', // Email is not stored in profiles table for security
      avatar: profile.avatar_url,
      avatar_url: profile.avatar_url,
      bio: profile.bio || '',
      website: profile.website || '',
      status: profile.status || 'offline',
      isGhostMode: profile.is_ghost_mode || false,
      role: profile.role || 'user',
      isAdmin: profile.role === 'admin',
      notificationSettings: {
        desktopNotifications: true,
        soundNotifications: true,
        emailNotifications: true
      }
    };
    
    console.log('Fetched user profile:', userProfile);
    return userProfile;
  } catch (err) {
    console.error('Exception fetching user profile:', err);
    return null;
  }
}

// Update a user's profile in the database
export async function updateUserProfile(
  userId: string, 
  updates: Partial<UserProfile>
): Promise<{ error: Error | null }> {
  try {
    // Convert from our app's UserProfile type to database fields
    const dbUpdates: any = {};
    
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.username !== undefined) dbUpdates.username = updates.username;
    if (updates.bio !== undefined) dbUpdates.bio = updates.bio;
    if (updates.website !== undefined) dbUpdates.website = updates.website;
    if (updates.avatar_url !== undefined) dbUpdates.avatar_url = updates.avatar_url;
    if (updates.avatar !== undefined) dbUpdates.avatar_url = updates.avatar; // Map avatar to avatar_url
    if (updates.status !== undefined) dbUpdates.status = updates.status;
    if (updates.isGhostMode !== undefined) dbUpdates.is_ghost_mode = updates.isGhostMode;
    
    // Only update if there are changes
    if (Object.keys(dbUpdates).length === 0) {
      return { error: null };
    }
    
    // Add the updated_at timestamp
    dbUpdates.updated_at = new Date().toISOString();
    
    const { error } = await supabase
      .from('profiles')
      .update(dbUpdates)
      .eq('id', userId);
      
    if (error) {
      console.error('Error updating profile:', error);
      return { error: new Error(error.message) };
    }
    
    return { error: null };
  } catch (err) {
    console.error('Exception updating user profile:', err);
    const message = err instanceof Error ? err.message : 'Unknown error';
    return { error: new Error(message) };
  }
}

// Check if a profile exists and create one if it doesn't
export async function ensureUserProfile(userId: string, userData?: {
  email?: string;
  username?: string;
  name?: string;
}): Promise<UserProfile | null> {
  try {
    // Check if profile exists
    let { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
      
    if (!profile) {
      // Profile doesn't exist, create one
      console.log('Creating profile for user ID:', userId);
      
      const newProfile = {
        id: userId,
        username: userData?.username || `user_${userId.substring(0, 8)}`,
        name: userData?.name || `User ${userId.substring(0, 4)}`,
        avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${userData?.name || userId}`,
        status: 'online' as UserStatus,
        role: 'user',
        is_ghost_mode: false,
        bio: '',
        website: ''
      };
      
      const { error } = await supabase
        .from('profiles')
        .insert([newProfile]);
        
      if (error) {
        console.error('Failed to create profile:', error);
        return null;
      }
      
      profile = newProfile;
    }
    
    // Convert to UserProfile format
    return await fetchUserProfile(userId);
  } catch (err) {
    console.error('Error ensuring user profile exists:', err);
    return null;
  }
}
