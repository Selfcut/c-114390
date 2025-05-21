
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
    
    // Check if the trigger function exists by checking for a record in a safer way
    // Instead of querying pg_proc directly (which isn't exposed), we'll use a simple test
    // to see if profile creation works as expected
    console.log("Checking handle_new_user trigger functionality...");
    
    // Check if there are any profiles for the current user
    // This indirectly tells us if the trigger might be working
    if (sessionData.session) {
      const { count, error: countError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('id', sessionData.session.user.id);
        
      if (countError) {
        console.error("Error checking current user profile:", countError);
      } else {
        console.log("Current user has profile:", count === 1);
        
        if (count === 0) {
          console.warn("No profile found for current user - trigger may not be working");
        }
      }
    }
    
    // Get total count of profiles vs auth users (if admin access available)
    try {
      const { count: profileCount, error: profileCountError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
        
      if (!profileCountError) {
        console.log(`Total profiles count: ${profileCount}`);
      }
    } catch (err) {
      console.log("Could not get total profiles count (may require admin access)");
    }
    
    console.log("=== End of Diagnostics ===");
  } catch (err) {
    console.error("Diagnostic error:", err);
  }
}
