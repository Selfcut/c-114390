
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';
import { UserProfile, UserStatus, UserRole } from '@/types/user';

// Default user when profile is missing
const DEFAULT_USER: Partial<UserProfile> = {
  username: 'unknown',
  name: 'Unknown User',
  avatar_url: null,
  status: 'offline',
  role: 'user',
  isGhostMode: false,
};

// Fetch a user's profile from the database
export async function fetchUserProfile(userId: string, session?: Session | null): Promise<UserProfile | null> {
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
    
    // Get email from session if available
    const email = session?.user?.email || '';
    
    // Map database profile to UserProfile type
    return {
      id: profile.id,
      username: profile.username || DEFAULT_USER.username!,
      name: profile.name || DEFAULT_USER.name!,
      email,
      avatar: profile.avatar_url,
      avatar_url: profile.avatar_url,
      bio: profile.bio || '',
      website: profile.website || '',
      status: (profile.status as UserStatus) || DEFAULT_USER.status!,
      isGhostMode: profile.is_ghost_mode || false,
      role: (profile.role as UserRole) || DEFAULT_USER.role!,
      isAdmin: profile.role === 'admin',
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

// Update a user's profile
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
    if (updates.avatar !== undefined) dbUpdates.avatar_url = updates.avatar; // Map avatar to avatar_url
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

// Sign in with email and password
export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    return { data, error };
  } catch (error: any) {
    console.error('Exception in signIn:', error);
    return { data: null, error: new Error(error.message) };
  }
}

// Sign up with email and password
export async function signUp(
  email: string,
  password: string, 
  username: string,
  name?: string
) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          name: name || username
        }
      }
    });
    
    return { data, error };
  } catch (error: any) {
    console.error('Exception in signUp:', error);
    return { data: null, error: new Error(error.message) };
  }
}

// Sign out
export async function signOut() {
  return await supabase.auth.signOut();
}
