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

// Fetch a user's profile from the database with enhanced logging
export async function fetchUserProfile(userId: string, session?: Session | null): Promise<UserProfile | null> {
  try {
    if (!userId) {
      console.error('Invalid user ID provided to fetchUserProfile');
      return null;
    }
    
    console.log(`[Auth] Fetching profile for user: ${userId}`);
    
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
      
    if (error) {
      console.error('[Auth] Error fetching user profile:', error);
      return null;
    }
    
    if (!profile) {
      console.warn('[Auth] No profile found for user ID:', userId);
      // Attempt to create a profile automatically
      return await createUserProfile(userId, session);
    }
    
    // Get email from session if available
    const email = session?.user?.email || '';
    
    console.log(`[Auth] Profile found for user: ${userId}, username: ${profile.username}`);
    
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
    console.error('[Auth] Exception in fetchUserProfile:', err);
    return null;
  }
}

// Create a user profile if missing, with retry mechanism
export async function createUserProfile(userId: string, session?: Session | null): Promise<UserProfile | null> {
  const MAX_RETRIES = 2;
  let retryCount = 0;
  
  while (retryCount <= MAX_RETRIES) {
    try {
      if (!userId) {
        console.error('[Auth] Invalid user ID provided to createUserProfile');
        return null;
      }
      
      console.log(`[Auth] Creating profile for user: ${userId}, attempt: ${retryCount + 1}`);
      
      const email = session?.user?.email || '';
      const name = session?.user?.user_metadata?.name || `User ${userId.substring(0, 4)}`;
      const username = session?.user?.user_metadata?.username || `user_${userId.substring(0, 8)}`;
      
      // Check if profile already exists (just to be safe)
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
        
      if (existingProfile) {
        console.log('[Auth] Profile already exists, returning existing profile');
        return await fetchUserProfile(userId, session);
      }
      
      const avatarUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(username)}`;
      console.log(`[Auth] Generated avatar URL: ${avatarUrl}`);
      
      const newProfile = {
        id: userId,
        username,
        name,
        avatar_url: avatarUrl,
        status: 'online' as UserStatus,
        role: 'user' as UserRole,
        is_ghost_mode: false,
        bio: '',
        website: ''
      };
      
      const { error } = await supabase
        .from('profiles')
        .insert(newProfile);
        
      if (error) {
        console.error('[Auth] Error creating user profile:', error);
        retryCount++;
        
        if (retryCount <= MAX_RETRIES) {
          console.log(`[Auth] Retrying profile creation, attempt ${retryCount + 1}...`);
          // Wait briefly before retrying
          await new Promise(resolve => setTimeout(resolve, 500 * retryCount));
          continue;
        }
        
        return null;
      }
      
      console.log(`[Auth] Profile created successfully for user: ${userId}`);
      
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
      console.error(`[Auth] Error creating profile (attempt ${retryCount + 1}):`, err);
      retryCount++;
      
      if (retryCount <= MAX_RETRIES) {
        // Wait briefly before retrying
        await new Promise(resolve => setTimeout(resolve, 500 * retryCount));
        continue;
      }
      
      return null;
    }
  }
  
  return null;
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

// Improved ensureUserProfile function with better error handling
export async function ensureUserProfile(userId: string, userData?: { 
  email?: string; 
  name?: string; 
  username?: string; 
}): Promise<UserProfile | null> {
  try {
    if (!userId) {
      console.error('[Auth] Invalid user ID provided to ensureUserProfile');
      return null;
    }
    
    // First check if profile exists
    const { data: existingProfile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    
    if (error) {
      console.error('[Auth] Error checking for user profile:', error);
      return null;
    }
    
    if (existingProfile) {
      // Profile exists, return it
      console.log('[Auth] Profile exists, returning it');
      return await fetchUserProfile(userId);
    }
    
    // No profile exists, create one
    console.log('[Auth] No profile exists, creating one');
    const dummySession = userData ? {
      user: {
        id: userId,
        email: userData.email || '',
        user_metadata: {
          name: userData.name || '',
          username: userData.username || ''
        }
      }
    } : null;
    
    return await createUserProfile(userId, dummySession as any);
  } catch (err) {
    console.error('[Auth] Error ensuring user profile exists:', err);
    return null;
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
