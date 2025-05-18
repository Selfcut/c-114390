
import { supabase } from "@/integrations/supabase/client";
import { UserProfile, UserStatus } from "@/types/user";
import { Session } from "@supabase/supabase-js";

// Fetch user profile from Supabase
export const fetchUserProfile = async (userId: string, userSession: Session | null): Promise<UserProfile> => {
  try {
    // Fetch the user profile from the profiles table
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error("Error fetching user profile:", error);
      throw error;
    }

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
      status: profile.status || "online",
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
  } catch (error) {
    console.error("Error in fetchUserProfile:", error);
    
    // Return a minimal profile in case of error
    return {
      id: userId,
      email: userSession?.user?.email || "",
      name: userSession?.user?.user_metadata?.name || "User",
      username: userSession?.user?.user_metadata?.username || "user",
      avatar: userSession?.user?.user_metadata?.avatar_url || `https://api.dicebear.com/6.x/initials/svg?seed=${userSession?.user?.email}`,
      bio: "",
      website: "",
      role: userId === "dc7bedf3-14c3-4376-adfb-de5ac8207adc" ? "admin" : "user",
      isAdmin: userId === "dc7bedf3-14c3-4376-adfb-de5ac8207adc",
      status: "online",
      isGhostMode: false,
    };
  }
};

// Update user profile in Supabase
export const updateUserProfile = async (userId: string, updates: Partial<UserProfile>): Promise<{error: any}> => {
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
        is_ghost_mode: updates.isGhostMode,
        role: updates.role
      })
      .eq('id', userId);

    if (error) {
      console.error("Error updating user profile:", error);
      return { error };
    }
    
    return { error: null };
  } catch (error) {
    console.error("Error in updateUserProfile:", error);
    return { error };
  }
};

// Update user status in Supabase
export const updateUserStatus = async (userId: string, status: UserStatus): Promise<void> => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ status })
      .eq('id', userId);

    if (error) {
      console.error("Error updating user status:", error);
      throw error;
    }
  } catch (error) {
    console.error("Error in updateUserStatus:", error);
    throw error;
  }
};

// Clear user data from local storage
export const clearUserData = (): void => {
  // Clear any additional user data from localStorage if needed
};
