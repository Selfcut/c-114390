
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
  
  // Create supabase client with admin privileges
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    // Find the user with username "polymath"
    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', 'polymath')
      .single();
    
    if (userError) {
      if (userError.code === 'PGRST116') {
        // User not found, return appropriate message
        return new Response(
          JSON.stringify({ 
            success: false, 
            message: "User with username 'polymath' not found" 
          }),
          { 
            headers: { 
              ...corsHeaders, 
              'Content-Type': 'application/json' 
            },
            status: 404
          }
        );
      }
      throw userError;
    }
    
    const userId = userData.id;
    
    // Update user role in profiles table
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ role: 'admin', isAdmin: true })
      .eq('id', userId);
    
    if (profileError) throw profileError;
    
    // Check if user_roles table exists and if it does, update it
    try {
      const { error: tableCheckError } = await supabase
        .from('user_roles')
        .select('*')
        .limit(1);
        
      if (!tableCheckError) {
        // Table exists, check if user already has admin role
        const { data: existingRole, error: checkError } = await supabase
          .from('user_roles')
          .select('*')
          .eq('user_id', userId)
          .eq('role', 'admin');
          
        if (checkError) throw checkError;
        
        // If not exists, insert new role
        if (!existingRole || existingRole.length === 0) {
          const { error: roleError } = await supabase
            .from('user_roles')
            .insert({ user_id: userId, role: 'admin' });
            
          if (roleError) throw roleError;
        }
      }
    } catch (err) {
      // If table doesn't exist or other error, just continue
      console.log('Note: user_roles table may not exist, continuing with profile update only');
    }

    // Force refresh the auth claims by updating the user's custom claims
    try {
      await supabase.auth.admin.updateUserById(userId, {
        app_metadata: { role: 'admin' }
      });
    } catch (err) {
      console.log('Warning: Unable to update auth claims, user may need to re-login for changes to take effect');
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Admin role assigned successfully to user 'polymath'" 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  } catch (error: any) {
    console.error('Error assigning admin role:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        status: 400, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});
