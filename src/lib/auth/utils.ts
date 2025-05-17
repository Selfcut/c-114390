
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "./types";
import { Session } from "@supabase/supabase-js";

// Function to fetch user profile from Supabase
export const fetchUserProfile = async (userId: string, session?: Session): Promise<UserProfile | null> => {
  try {
    // Fetch profile data
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }

    if (!profile) {
      console.warn("No profile found for user:", userId);
      return null;
    }

    // Build user profile object
    const userProfile: UserProfile = {
      id: userId,
      email: session?.user?.email,
      name: profile.name || 'Anonymous User',
      avatar_url: profile.avatar_url,
      username: profile.username,
      role: profile.role,
      isAdmin: profile.role === 'admin',
    };

    return userProfile;
  } catch (err) {
    console.error("Exception in fetchUserProfile:", err);
    return null;
  }
};

// Function to update user profile
export const updateUserProfile = async (userId: string, updates: Partial<UserProfile>) => {
  try {
    // Map UserProfile fields to profile table fields
    const profileUpdates: any = {};
    if (updates.name) profileUpdates.name = updates.name;
    if (updates.avatar_url) profileUpdates.avatar_url = updates.avatar_url;
    if (updates.username) profileUpdates.username = updates.username;
    
    const { error } = await supabase
      .from('profiles')
      .update(profileUpdates)
      .eq('id', userId);
    
    if (error) return { error };
    return { error: null };
  } catch (err) {
    return { error: err };
  }
};
