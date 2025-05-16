
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { UserProfile, UserStatus } from "@/types/user";

// Fetch user profile from database
export const fetchUserProfile = async (userId: string, userSession: Session | null): Promise<UserProfile | null> => {
  try {
    // Fetch the user profile from the profiles table
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error && error.code !== 'PGRST116') {
      console.error("Error fetching user profile:", error);
      // Create a minimal user object with just the auth info
      return {
        id: userId,
        email: userSession?.user?.email || "",
        name: userSession?.user?.user_metadata?.name || userSession?.user?.email?.split('@')[0] || "User",
        username: userSession?.user?.user_metadata?.username || userSession?.user?.email?.split('@')[0] || "user",
        avatar: userSession?.user?.user_metadata?.avatar_url || `https://api.dicebear.com/6.x/initials/svg?seed=${userSession?.user?.email}`,
        role: "user",
        isAdmin: false,
        status: "online",
        bio: "",
        website: ""
      };
    } else if (profile) {
      // Create a merged profile with both auth and profile data
      const fullProfile: UserProfile = {
        id: userId,
        email: userSession?.user?.email || "",
        name: profile.name || userSession?.user?.user_metadata?.name || "User",
        username: profile.username || userSession?.user?.user_metadata?.username || "user",
        avatar: profile.avatar_url || userSession?.user?.user_metadata?.avatar_url || `https://api.dicebear.com/6.x/initials/svg?seed=${userSession?.user?.email}`,
        bio: profile.bio || "",
        website: profile.website || "",
        role: profile.role || "user",
        isAdmin: profile.role === "admin",
        status: (profile.status as UserStatus) || "online",
        isGhostMode: profile.is_ghost_mode || false,
      };

      // Special case for the admin user
      if (userId === "dc7bedf3-14c3-4376-adfb-de5ac8207adc") {
        // If this is the user we want to make admin, update their role
        await supabase
          .from('profiles')
          .update({ role: 'admin' })
          .eq('id', userId);
        
        fullProfile.role = "admin";
        fullProfile.isAdmin = true;
      }

      return fullProfile;
    }
    
    return null;
  } catch (error) {
    console.error("Error in fetchUserProfile:", error);
    return null;
  }
};

// Update user profile
export const updateUserProfile = async (userId: string, updates: Partial<UserProfile>) => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({
        name: updates.name,
        username: updates.username,
        avatar_url: updates.avatar,
        bio: updates.bio,
        website: updates.website,
        status: updates.status,
        is_ghost_mode: updates.isGhostMode
      })
      .eq('id', userId);

    return { error };
  } catch (error) {
    console.error("Update profile error:", error);
    return { error };
  }
};
