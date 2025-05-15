
import { User, Session } from "@supabase/supabase-js";
import { UserProfile, UserStatus } from "@/types/user";
import { supabase } from "@/integrations/supabase/client";

// This function will fetch the user profile from Supabase profiles table
export const fetchUserProfile = async (userId: string, session: Session | null): Promise<UserProfile> => {
  try {
    // Fetch the user profile from the profiles table
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.warn("Could not fetch user profile:", error);
      throw error;
    }
    
    if (!profile) {
      throw new Error("Profile not found");
    }

    // Return the profile with all required fields
    return {
      id: profile.id,
      name: profile.name || '',
      username: profile.username || '',
      email: session?.user?.email || '',
      avatar: profile.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name || '')}`,
      status: profile.status as UserStatus || 'offline',
      isGhostMode: profile.is_ghost_mode || false,
      role: profile.role as 'admin' | 'moderator' | 'user',
      isAdmin: profile.role === 'admin',
      notificationSettings: {
        desktopNotifications: true,
        soundNotifications: true,
        emailNotifications: true
      }
    };
  } catch (error) {
    console.error("Error fetching profile:", error);
    
    // If we can't get the profile, create a minimal fallback
    const userEmail = session?.user?.email || 'user@example.com';
    const userName = session?.user?.user_metadata?.name || userEmail.split('@')[0];
    
    return {
      id: userId,
      name: userName,
      username: userName.toLowerCase().replace(/\s+/g, '-'),
      email: userEmail,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}`,
      role: 'user',
      status: 'online', // This now uses the literal value from UserStatus
      isGhostMode: false,
      notificationSettings: {
        desktopNotifications: true,
        soundNotifications: true,
        emailNotifications: true
      }
    };
  }
};

// Update user profile in Supabase
export const updateUserProfile = async (userId: string, updates: Partial<UserProfile>) => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({
        name: updates.name,
        username: updates.username,
        avatar_url: updates.avatar,
        status: updates.status,
        is_ghost_mode: updates.isGhostMode,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error in updateUserProfile:", error);
    return { success: false, error };
  }
};

export const updateUserStatus = async (userId: string, status: string) => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({
        status: status,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (error) {
      console.error("Error updating status:", error);
      throw error;
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error in updateUserStatus:", error);
    return { success: false, error };
  }
};

export const clearUserData = () => {
  localStorage.removeItem('userName');
  localStorage.removeItem('userAvatar');
  localStorage.removeItem('userRole');
};
