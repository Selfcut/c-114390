
import { User, Session } from "@supabase/supabase-js";
import { UserProfile } from "@/types/user";
import { supabase } from "@/integrations/supabase/client";

// This function will fetch the user profile from Supabase
// Or create a mock profile for demo purposes if Supabase fetch fails
export const fetchUserProfile = async (userId: string, session: Session | null): Promise<UserProfile> => {
  try {
    // Try to fetch user profile from Supabase profiles table
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error || !data) {
      console.warn("Could not fetch user profile, generating one from auth data");
      throw new Error("Profile not found");
    }
    
    // Return the profile data from Supabase
    return {
      id: data.id,
      email: session?.user?.email || 'user@example.com',
      name: data.name || session?.user?.user_metadata?.full_name || 'User',
      avatar: data.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name || 'User')}`,
      role: data.role || 'user',
      status: data.status || 'online',
      bio: data.bio || '',
      skills: data.skills || [],
      interests: data.interests || [],
      isGhostMode: data.is_ghost_mode || false,
      notificationSettings: data.notification_settings || {
        emailNotifications: true,
        pushNotifications: true,
        soundNotifications: true,
        desktopNotifications: true
      },
      createdAt: data.created_at || new Date().toISOString()
    };
  } catch (error) {
    // Fallback to session data if profile doesn't exist yet
    const userEmail = session?.user?.email || 'user@example.com';
    const userName = session?.user?.user_metadata?.full_name || userEmail.split('@')[0];
    
    // Return a minimal profile with data from auth
    return {
      id: userId,
      email: userEmail,
      name: userName,
      avatar: localStorage.getItem('userAvatar') || `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}`,
      role: localStorage.getItem('userRole') || 'user',
      status: 'online',
      bio: '',
      skills: [],
      interests: [],
      isGhostMode: false,
      notificationSettings: {
        emailNotifications: true,
        pushNotifications: true,
        soundNotifications: true,
        desktopNotifications: true
      },
      createdAt: new Date().toISOString()
    };
  }
};

export const clearUserData = () => {
  localStorage.removeItem('userName');
  localStorage.removeItem('userAvatar');
  localStorage.removeItem('userRole');
};
