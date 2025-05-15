
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
  const adminKey = Deno.env.get('ADMIN_SECRET_KEY') || '';

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    const { key, email, password, name } = await req.json();

    // Verify the admin key
    if (key !== adminKey) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Invalid admin key' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create the admin user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { 
        name,
        role: 'admin'
      }
    });

    if (authError) {
      throw authError;
    }

    // Add role to user_roles table
    if (authData.user) {
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({ 
          user_id: authData.user.id, 
          role: 'admin' 
        });

      if (roleError) {
        throw roleError;
      }
    }

    return new Response(
      JSON.stringify({ message: 'Admin user created successfully', user: authData.user }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
