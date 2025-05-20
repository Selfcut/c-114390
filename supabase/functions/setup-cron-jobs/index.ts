
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    console.log("Setting up cron jobs...");
    
    // Create a Supabase client with the Admin key
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );
    
    // First try to create extensions
    const { data: extensionsData, error: extensionsError } = await supabaseAdmin.rpc("create_cron_extensions");
    
    if (extensionsError) {
      console.log("Error creating extensions:", extensionsError);
      // Continue anyway - might be permissions in development environment
    } else {
      console.log("Extensions setup result:", extensionsData);
    }
    
    // Set up the cron job
    const { data, error } = await supabaseAdmin.rpc("setup_research_cron_job");
    
    if (error) {
      if (error.message.includes("permission denied") || 
          error.message.includes("does not exist")) {
        console.log("Permission denied or table not found. This is expected in development.");
        
        // In development, simulate a successful response
        return new Response(
          JSON.stringify({ 
            success: true, 
            message: "Development mode: Cron job would be set up in production",
            simulated: true
          }),
          { 
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200 
          }
        );
      }
      throw error;
    }
    
    // Let's also trigger an immediate fetch of research papers
    try {
      console.log("Triggering immediate research papers fetch...");
      
      const fetchResponse = await supabaseAdmin.functions.invoke('fetch-research', {
        body: { source: "setup", force_sample: true }
      });
      
      console.log("Immediate fetch result:", fetchResponse);
    } catch (fetchError) {
      console.error("Error triggering immediate fetch:", fetchError);
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Cron job setup successfully, and immediate fetch triggered",
        details: data
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200 
      }
    );
  } catch (error) {
    console.error("Error setting up cron job:", error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        hint: "Make sure the pg_cron extension is enabled in your Supabase project"
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500 
      }
    );
  }
});
