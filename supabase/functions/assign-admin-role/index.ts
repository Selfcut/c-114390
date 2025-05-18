
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

  try {
    // Get environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const adminSecretKey = Deno.env.get('ADMIN_SECRET_KEY') || '';

    // Create Supabase admin client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get authorization header from the request
    const authHeader = req.headers.get('Authorization');

    // Validate the request has an auth header
    if (!authHeader) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Missing authorization header' 
        }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse the JWT to get the user
    const token = authHeader.replace('Bearer ', '');
    const { data: { user: callingUser }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !callingUser) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Invalid authentication token' 
        }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Try to parse the request body for specific user ID (optional)
    let targetUserId = callingUser.id; // Default to the calling user
    
    try {
      const requestData = await req.json();
      if (requestData && requestData.userId) {
        targetUserId = requestData.userId;
      }
    } catch (e) {
      // If parsing fails, just use the calling user's ID
      console.log("No request body or unable to parse, using authenticated user ID");
    }

    // Check if user email contains "polymath" or if they're specifically allowed to be an admin
    const userEmail = callingUser.email?.toLowerCase() || '';
    const isPolymathEmail = userEmail.includes('polymath');
    
    // If the user is not a polymath email, check if they're trying to assign admin to someone else
    if (!isPolymathEmail && targetUserId !== callingUser.id) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'You do not have permission to assign admin role' 
        }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // First, update the profiles table to set role = 'admin'
    const { error: profileUpdateError } = await supabase
      .from('profiles')
      .update({ role: 'admin' })
      .eq('id', targetUserId);

    if (profileUpdateError) {
      console.error('Error updating profile:', profileUpdateError);
      
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Failed to update profile role' 
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if user already has an admin role in user_roles
    const { data: existingRole, error: roleCheckError } = await supabase
      .from('user_roles')
      .select('*')
      .eq('user_id', targetUserId)
      .eq('role', 'admin')
      .maybeSingle();

    if (roleCheckError) {
      console.error('Error checking existing roles:', roleCheckError);
    }

    // If user doesn't have an admin role already, add it
    if (!existingRole) {
      const { error: roleInsertError } = await supabase
        .from('user_roles')
        .insert({
          user_id: targetUserId,
          role: 'admin'
        });

      if (roleInsertError) {
        console.error('Error inserting role:', roleInsertError);
        
        return new Response(
          JSON.stringify({ 
            success: false, 
            message: 'Failed to insert admin role' 
          }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Update the user's auth claims to include admin role
    // This requires service role key and is crucial for immediate auth changes
    const { error: updateClaimsError } = await supabase.auth.admin.updateUserById(
      targetUserId,
      { app_metadata: { role: 'admin' } }
    );

    if (updateClaimsError) {
      console.error('Error updating user claims:', updateClaimsError);
      
      return new Response(
        JSON.stringify({ 
          success: true,
          warning: true,
          message: 'Admin role assigned in database, but auth claims not updated. Please log out and log back in.' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Success response
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Admin role assigned successfully' 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Unexpected error in assign-admin-role:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: error.message || 'An unexpected error occurred' 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
