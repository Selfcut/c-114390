
import { supabase } from "@/integrations/supabase/client";
import { UserProfile, UserStatus, UserRole } from "@/types/user";
import { Session } from "@supabase/supabase-js";

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
    
    if (!userId) {
      console.error('Invalid user ID provided to fetchUserProfile');
      return null;
    }
    
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
      // Attempt to create a profile automatically
      return await createUserProfile(userId, session);
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

// Create a user profile if missing
export async function createUserProfile(userId: string, session?: Session | null): Promise<UserProfile | null> {
  try {
    console.log('Creating missing profile for user ID:', userId);
    
    if (!userId) {
      console.error('Invalid user ID provided to createUserProfile');
      return null;
    }
    
    const email = session?.user?.email || '';
    const name = session?.user?.user_metadata?.name || `User ${userId.substring(0, 4)}`;
    const username = session?.user?.user_metadata?.username || `user_${userId.substring(0, 8)}`;
    
    // Check if profile already exists (just to be safe)
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (existingProfile) {
      console.log('Profile already exists, returning existing profile');
      return await fetchUserProfile(userId, session);
    }
    
    const newProfile = {
      id: userId,
      username,
      name,
      avatar_url: `https://api.dicebear.com/6.x/initials/svg?seed=${username}`,
      status: 'online' as UserStatus,
      role: 'user' as UserRole,
      is_ghost_mode: false,
      bio: '',
      website: ''
    };
    
    console.log('Inserting new profile:', newProfile);
    
    const { error } = await supabase
      .from('profiles')
      .insert(newProfile);
      
    if (error) {
      console.error('Error creating user profile:', error);
      return null;
    }
    
    return {
      id: userId,
      username,
      name,
      email,
      avatar: newProfile.avatar_url,
      avatar_url: newProfile.avatar_url,
      bio: '',
      website: '',
      status: 'online',
      isGhostMode: false,
      role: 'user',
      isAdmin: false,
      notificationSettings: {
        desktopNotifications: true,
        soundNotifications: true,
        emailNotifications: true
      }
    };
  } catch (err) {
    console.error('Error creating profile:', err);
    return null;
  }
}

// Ensure a user profile exists, creating it if necessary (alias for consistency)
export async function ensureUserProfile(
  userId: string, 
  defaultProfile: Partial<UserProfile> = {},
  session?: Session | null
): Promise<UserProfile | null> {
  try {
    // First check if profile exists
    const existingProfile = await fetchUserProfile(userId, session);
    
    // If profile exists, return it
    if (existingProfile) {
      return existingProfile;
    }
    
    // If no profile, create one with default values merged
    const email = session?.user?.email || '';
    const sessionName = session?.user?.user_metadata?.name;
    const sessionUsername = session?.user?.user_metadata?.username;
    
    // Priority order: defaultProfile > session > generated defaults
    const newProfileData = {
      id: userId,
      username: defaultProfile.username || sessionUsername || `user_${userId.substring(0, 8)}`,
      name: defaultProfile.name || sessionName || `User ${userId.substring(0, 4)}`,
      avatar_url: defaultProfile.avatar_url || 
        `https://api.dicebear.com/6.x/initials/svg?seed=${defaultProfile.username || sessionUsername || userId.substring(0, 8)}`,
      status: 'online' as UserStatus,
      role: 'user' as UserRole,
      is_ghost_mode: false,
      bio: defaultProfile.bio || '',
      website: defaultProfile.website || '',
    };
    
    console.log('Creating new profile with merged data:', newProfileData);
    
    const { data: profile, error } = await supabase
      .from('profiles')
      .insert(newProfileData)
      .select()
      .single();
      
    if (error) {
      console.error('Error creating user profile in ensureUserProfile:', error);
      return null;
    }
    
    // Return the newly created profile
    return {
      id: profile.id,
      username: profile.username,
      name: profile.name,
      email,
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

// Update a user's profile
export async function updateUserProfile(
  userId: string,
  updates: Partial<UserProfile>
): Promise<{ error: Error | null }> {
  try {
    if (!userId) {
      return { error: new Error('Invalid user ID provided to updateUserProfile') };
    }
    
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
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return { error: new Error(message) };
  }
}

// Authentication methods
export const signIn = async (email: string, password: string) => {
  try {
    console.log('Signing in with:', email);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) return { error: error as Error };
    return { data, error: null };
  } catch (error) {
    console.error('Sign in exception:', error);
    return { error: error as Error };
  }
};

export const signUp = async (email: string, password: string, username: string, name?: string) => {
  try {
    console.log('Signing up with:', email);
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

    if (error) return { error: error as Error };
    return { data, error: null };
  } catch (error) {
    console.error('Sign up exception:', error);
    return { error: error as Error };
  }
};

export const signOut = async () => {
  try {
    console.log('Signing out');
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};
