
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.23.0';

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Generate embeddings using the Hugging Face API
async function generateQueryEmbeddings(text: string): Promise<number[]> {
  const response = await fetch(
    "https://api-inference.huggingface.co/pipeline/feature-extraction/sentence-transformers/all-MiniLM-L6-v2",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ inputs: text, options: { wait_for_model: true } }),
    }
  );
  
  if (!response.ok) {
    throw new Error(`Failed to generate embeddings: ${response.status} ${response.statusText}`);
  }
  
  const result = await response.json();
  return result;
}

// Perform semantic search using vector similarity
async function performSemanticSearch(embedding: number[], contentType: string, limit: number = 10, threshold: number = 0.7) {
  const { data, error } = await supabase.rpc('match_embeddings', {
    query_embedding: embedding,
    content_type: contentType,
    match_threshold: threshold,
    match_limit: limit
  });
  
  if (error) {
    throw new Error(`Failed to perform semantic search: ${error.message}`);
  }
  
  return data;
}

// Fetch content details based on search results
async function fetchContentDetails(results: any[], contentType: string) {
  if (!results || results.length === 0) {
    return [];
  }
  
  const contentIds = results.map(item => item.content_id);
  
  let data;
  let error;
  
  if (contentType === 'research') {
    ({ data, error } = await supabase
      .from('research_papers')
      .select('*')
      .in('id', contentIds));
  } else if (contentType === 'wiki') {
    ({ data, error } = await supabase
      .from('wiki_articles')
      .select('*')
      .in('id', contentIds));
  } else {
    throw new Error(`Unsupported content type: ${contentType}`);
  }
  
  if (error) {
    throw new Error(`Failed to fetch content details: ${error.message}`);
  }
  
  // Add similarity score to each content item
  return data?.map(item => {
    const matchingResult = results.find(r => r.content_id === item.id);
    return {
      ...item,
      similarity_score: matchingResult ? matchingResult.similarity : 0
    };
  }).sort((a, b) => b.similarity_score - a.similarity_score) || [];
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const { query, contentType, limit = 10, threshold = 0.7 } = await req.json();
    
    if (!query || !contentType) {
      return new Response(JSON.stringify({ error: "Query and contentType are required" }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    // Generate embeddings for the query
    const embedding = await generateQueryEmbeddings(query);
    
    // Perform semantic search
    const searchResults = await performSemanticSearch(embedding, contentType, limit, threshold);
    
    // Fetch content details
    const contentDetails = await fetchContentDetails(searchResults, contentType);
    
    return new Response(JSON.stringify({ results: contentDetails }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error in semantic-search function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
