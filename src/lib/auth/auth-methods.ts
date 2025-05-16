
import { supabase } from "@/integrations/supabase/client";

// Authentication methods
export const signIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      return { error };
    }
    
    return { error: null };
  } catch (error) {
    console.error("Sign in error:", error);
    return { error };
  }
};

export const signUp = async (email: string, password: string, metadata = {}) => {
  try {
    const { data, error } = await supabase.auth.signUp({ 
      email, 
      password, 
      options: { 
        data: metadata 
      } 
    });
    
    if (error) {
      return { error };
    }
    
    return { error: null };
  } catch (error) {
    console.error("Sign up error:", error);
    return { error };
  }
};

export const signOut = async () => {
  try {
    await supabase.auth.signOut();
  } catch (error) {
    console.error("Sign out error:", error);
  }
};
