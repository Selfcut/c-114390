
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "./types";
import { Session } from "@supabase/supabase-js";

// Function to fetch user profile from Supabase
export const fetchUserProfile = async (userId: string, session?: Session): Promise<UserProfile | null> => {
  try {
    console.log("Fetching profile for user:", userId);
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
      
      // Try to create a profile for the user if it doesn't exist
      try {
        // Get the user data from auth
        const { data: userData } = await supabase.auth.getUser();
        if (userData?.user) {
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert({
              id: userId,
              name: userData.user.email?.split('@')[0] || 'New User',
              username: userData.user.email?.split('@')[0] || `user_${userId.substring(0, 8)}`,
              avatar_url: null
            })
            .select()
            .single();
            
          if (createError) {
            console.error("Error creating user profile:", createError);
            return null;
          }
          
          console.log("Created new profile for user:", newProfile);
          return newProfile as UserProfile;
        }
      } catch (createErr) {
        console.error("Failed to create profile:", createErr);
      }
      
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
    console.log("Updating profile for user:", userId, updates);
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
