
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

const fetchRecentResearchPapers = async (supabase: any) => {
  console.log("Fetching research papers from external APIs...");
  
  // This is where we would make actual API calls to research paper sources
  // For now, let's add some example papers to demonstrate functionality
  
  const examplePapers = [
    {
      title: "Advances in Neural Network Architectures for Image Recognition",
      author: "Research Team A",
      summary: "This paper presents novel neural network architectures that improve image recognition accuracy by 15%.",
      published_date: new Date().toISOString(),
      category: "AI",
      source: "Journal of Machine Learning Research",
      source_url: "https://example.com/research1",
      is_auto_fetched: true
    },
    {
      title: "Climate Change Impact on Coastal Biodiversity",
      author: "Environmental Studies Group",
      summary: "Analysis of five years of data shows accelerating impact of rising sea levels on coastal ecosystem diversity.",
      published_date: new Date().toISOString(),
      category: "Environment",
      source: "Environmental Science Journal",
      source_url: "https://example.com/research2",
      is_auto_fetched: true
    },
    {
      title: "Emerging Antibiotic Resistance Patterns",
      author: "Medical Research Institute",
      summary: "This study catalogs new patterns of antibiotic resistance across different bacterial strains and geographic regions.",
      published_date: new Date().toISOString(),
      category: "Health",
      source: "Journal of Medical Research",
      source_url: "https://example.com/research3",
      is_auto_fetched: true
    }
  ];
  
  // Insert the papers into the database
  for (const paper of examplePapers) {
    try {
      // Check if a paper with this title already exists
      const { data: existingPapers } = await supabase
        .from('research_papers')
        .select('id')
        .eq('title', paper.title);
        
      if (existingPapers && existingPapers.length > 0) {
        console.log(`Paper already exists: ${paper.title}`);
        continue;
      }
      
      // Insert new paper
      const { data, error } = await supabase
        .from('research_papers')
        .insert([paper]);
        
      if (error) {
        console.error(`Error inserting paper: ${error.message}`);
      } else {
        console.log(`Successfully inserted paper: ${paper.title}`);
      }
    } catch (error) {
      console.error(`Error processing paper: ${error.message}`);
    }
  }
  
  return { success: true, message: "Research papers fetched and processed" };
};

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );
    
    const result = await fetchRecentResearchPapers(supabaseClient);
    
    return new Response(
      JSON.stringify(result),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200 
      }
    );
  } catch (error) {
    console.error("Error in fetch-research-papers function:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500 
      }
    );
  }
});
