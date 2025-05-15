
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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
    const { email, password, adminSecretKey } = await req.json();
    
    // Validate inputs
    if (!email || !password) {
      throw new Error('Email and password are required');
    }
    
    // Verify admin secret key for security
    const storedAdminSecretKey = Deno.env.get('ADMIN_SECRET_KEY');
    if (!storedAdminSecretKey || adminSecretKey !== storedAdminSecretKey) {
      throw new Error('Invalid admin secret key');
    }
    
    // Initialize Supabase client with service role key for admin operations
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );
    
    // Create the user
    const { data: userData, error: createUserError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm the email
    });
    
    if (createUserError) {
      throw createUserError;
    }
    
    if (!userData.user) {
      throw new Error('Failed to create user');
    }
    
    // Assign admin role
    const { error: roleError } = await supabaseAdmin
      .from('user_roles')
      .insert({
        user_id: userData.user.id,
        role: 'admin',
      });
    
    if (roleError) {
      throw roleError;
    }
    
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Admin user created successfully',
        user: userData.user,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error creating admin user:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: error.message,
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
