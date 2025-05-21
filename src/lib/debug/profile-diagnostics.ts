
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
    
    // Check trigger function
    const { data: triggerData, error: triggerError } = await supabase
      .rpc('check_trigger_exists', { trigger_name: 'on_auth_user_created' });
      
    if (triggerError) {
      console.error("Error checking trigger:", triggerError);
    } else {
      console.log("Trigger exists:", triggerData);
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

// Add RPC function to check if trigger exists
// NOTE: This needs to be added to the database
/*
CREATE OR REPLACE FUNCTION check_trigger_exists(trigger_name TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
  trigger_exists BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1
    FROM pg_trigger
    WHERE tgname = trigger_name
  ) INTO trigger_exists;
  
  RETURN trigger_exists;
END;
$$;
*/
