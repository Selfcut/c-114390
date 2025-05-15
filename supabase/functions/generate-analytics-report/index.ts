
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
    const { startDate, endDate, eventTypes } = await req.json();
    
    // Validate inputs
    if (!startDate || !endDate) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: startDate and endDate' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Build query
    let query = supabase
      .from('user_activities')
      .select('*')
      .gte('created_at', startDate)
      .lte('created_at', endDate);
    
    // Add event type filter if provided
    if (eventTypes && eventTypes.length > 0) {
      query = query.in('event_type', eventTypes);
    }
    
    // Execute query
    const { data, error: queryError } = await query;
    
    if (queryError) throw queryError;
    
    // Generate report
    const report = {
      summary: {
        totalEvents: data.length,
        uniqueUsers: new Set(data.map(event => event.user_id)).size,
        eventTypeCounts: data.reduce((counts, event) => {
          counts[event.event_type] = (counts[event.event_type] || 0) + 1;
          return counts;
        }, {})
      },
      events: data,
      timeframe: {
        start: startDate,
        end: endDate
      }
    };

    return new Response(
      JSON.stringify(report),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error generating analytics report:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
