
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/types/user";
import { Session } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";

export const fetchUserProfile = async (userId: string, session: Session | null): Promise<UserProfile> => {
  try {
    // Check if user has admin role
    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .eq('role', 'admin')
      .maybeSingle();
    
    const isAdmin = !!roleData;
    
    // Create basic profile from auth data
    const basicUserData: UserProfile = {
      id: userId,
      name: session?.user?.user_metadata.name || 'User',
      username: session?.user?.user_metadata.username || session?.user?.email?.split('@')[0] || 'user',
      email: session?.user?.email || '',
      avatar: session?.user?.user_metadata.avatar_url || `https://api.dicebear.com/7.x/personas/svg?seed=${userId}`,
      coverImage: session?.user?.user_metadata.cover_image,
      status: 'online',
      level: 1,
      xp: 0,
      iq: 100,
      isGhostMode: false,
      isAdmin: isAdmin,
      role: isAdmin ? 'admin' : 'user',
      notificationSettings: {
        desktopNotifications: true,
        soundNotifications: true,
        emailNotifications: true,
      },
      badges: []
    };
    
    // Store user info in localStorage for quick access
    localStorage.setItem('userName', basicUserData.name);
    if (basicUserData.avatar) {
      localStorage.setItem('userAvatar', basicUserData.avatar);
    }
    
    return basicUserData;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    
    // Fallback to basic profile
    if (session?.user) {
      const basicUserData: UserProfile = {
        id: userId,
        name: session.user.user_metadata.name || 'User',
        username: session.user.user_metadata.username || session.user.email?.split('@')[0] || 'user',
        email: session.user.email || '',
        avatar: session.user.user_metadata.avatar_url || `https://api.dicebear.com/7.x/personas/svg?seed=${userId}`,
        status: 'online',
        isGhostMode: false,
        notificationSettings: {
          desktopNotifications: true,
          soundNotifications: true,
          emailNotifications: true,
        }
      };
      
      localStorage.setItem('userName', basicUserData.name);
      if (basicUserData.avatar) {
        localStorage.setItem('userAvatar', basicUserData.avatar);
      }
      
      return basicUserData;
    }
    
    throw error;
  }
};

export const clearUserData = () => {
  localStorage.removeItem('userName');
  localStorage.removeItem('userAvatar');
};
