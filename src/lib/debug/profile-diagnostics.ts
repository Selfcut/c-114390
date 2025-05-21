
import { supabase } from "@/integrations/supabase/client";

/**
 * Runs a diagnostic check on the profiles table and related data
 * Use this function for debugging profile issues
 */
export async function runProfileDiagnostics() {
  console.log("=== Profile Diagnostics ===");
  
  try {
    // Check current auth session
    const { data: sessionData } = await supabase.auth.getSession();
    console.log("Current session:", sessionData.session ? "Active" : "None");
    if (sessionData.session) {
      console.log("User ID:", sessionData.session.user.id);
      console.log("User email:", sessionData.session.user.email);
    }
    
    // Check profiles table
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .limit(10);
      
    if (profilesError) {
      console.error("Error fetching profiles:", profilesError);
    } else {
      console.log("Profiles count:", profilesData?.length || 0);
      console.log("Sample profiles:", profilesData);
    }
    
    // Check if the trigger function exists using direct query
    const { data: functionsData, error: functionsError } = await supabase
      .from('pg_proc')
      .select('proname')
      .ilike('proname', 'handle_new_user')
      .limit(1)
      .maybeSingle();
      
    if (functionsError) {
      console.error("Error checking function:", functionsError);
    } else {
      console.log("Handle new user function exists:", !!functionsData);
    }
    
    // Check user count 
    if (sessionData.session) {
      const { count, error: countError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('id', sessionData.session.user.id);
        
      if (countError) {
        console.error("Error checking current user profile:", countError);
      } else {
        console.log("Current user has profile:", count === 1);
      }
    }
    
    console.log("=== End of Diagnostics ===");
  } catch (err) {
    console.error("Diagnostic error:", err);
  }
}
