
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
    
    // Setup the cron job using pg_cron to call our edge function every hour
    const { data, error } = await supabaseAdmin.rpc("setup_research_cron_job");
    
    if (error) {
      console.error("Error setting up cron job:", error);
      throw error;
    }
    
    console.log("Cron job setup successfully:", data);
    
    // Let's also trigger an immediate fetch of research papers
    try {
      console.log("Triggering immediate research papers fetch...");
      
      const fetchResponse = await fetch(
        "https://zmevoxevezwnkigertpn.supabase.co/functions/v1/fetch-research",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InptZXZveGV2ZXp3bmtpZ2VydHBuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyNzYxMDcsImV4cCI6MjA2Mjg1MjEwN30.pWgLkPyobQPhf2fgvI9suqWjDl_VvYEu7Y4coc5RzsM`
          },
          body: JSON.stringify({ source: "setup" })
        }
      );
      
      const fetchResult = await fetchResponse.json();
      console.log("Immediate fetch result:", fetchResult);
    } catch (fetchError) {
      console.error("Error triggering immediate fetch:", fetchError);
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Cron job setup successfully, and immediate fetch triggered",
        cronData: data 
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
