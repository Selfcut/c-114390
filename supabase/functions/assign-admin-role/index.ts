
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
    const ADMIN_USER_ID = 'dc7bedf3-14c3-4376-adfb-de5ac8207adc';
    
    // Update user role in profiles table
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ role: 'admin' })
      .eq('id', ADMIN_USER_ID);
    
    if (profileError) throw profileError;
    
    // Check if user exists in user_roles table
    const { data: existingRole, error: checkError } = await supabase
      .from('user_roles')
      .select('*')
      .eq('user_id', ADMIN_USER_ID)
      .eq('role', 'admin');
      
    if (checkError) throw checkError;
    
    // If not exists, insert new role
    if (!existingRole || existingRole.length === 0) {
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({ user_id: ADMIN_USER_ID, role: 'admin' });
        
      if (roleError) throw roleError;
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Admin role assigned successfully" 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  } catch (error) {
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
