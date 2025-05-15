
import { User, Session } from "@supabase/supabase-js";
import { UserProfile } from "@/types/user";
import { supabase } from "@/integrations/supabase/client";

// This function will fetch the user profile from Supabase
// Or create a mock profile for demo purposes if Supabase fetch fails
export const fetchUserProfile = async (userId: string, session: Session | null): Promise<UserProfile> => {
  try {
    // First try to fetch user role from user_roles table
    const { data: roleData, error: roleError } = await supabase
      .from('user_roles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    
    if (roleError) {
      console.warn("Could not fetch user role:", roleError);
    }
    
    // Since there's no profiles table, we'll create a profile from session data
    // and user_roles if available
    
    const userEmail = session?.user?.email || 'user@example.com';
    const userName = session?.user?.user_metadata?.full_name || userEmail.split('@')[0];
    const userRole = roleData?.role || 'user';
    
    // Return a profile with data from auth and role
    return {
      id: userId,
      name: userName,
      username: userName.toLowerCase().replace(/\s+/g, '-'),
      email: userEmail,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}`,
      status: 'online',
      isGhostMode: false,
      role: userRole as 'admin' | 'moderator' | 'user',
      notificationSettings: {
        desktopNotifications: true,
        soundNotifications: true,
        emailNotifications: true
      }
    };
  } catch (error) {
    // Fallback to basic profile with data from auth
    const userEmail = session?.user?.email || 'user@example.com';
    const userName = session?.user?.user_metadata?.full_name || userEmail.split('@')[0];
    
    // Return a minimal profile with data from auth
    return {
      id: userId,
      name: userName,
      username: userName.toLowerCase().replace(/\s+/g, '-'),
      email: userEmail,
      avatar: localStorage.getItem('userAvatar') || `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}`,
      role: (localStorage.getItem('userRole') || 'user') as 'admin' | 'moderator' | 'user',
      status: 'online',
      isGhostMode: false,
      notificationSettings: {
        desktopNotifications: true,
        soundNotifications: true,
        emailNotifications: true
      }
    };
  }
};

export const clearUserData = () => {
  localStorage.removeItem('userName');
  localStorage.removeItem('userAvatar');
  localStorage.removeItem('userRole');
};
