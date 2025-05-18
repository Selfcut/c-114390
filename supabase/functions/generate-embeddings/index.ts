
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
async function generateEmbeddings(text: string): Promise<number[]> {
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

// Store embeddings in the database
async function storeEmbeddings(contentId: string, contentType: string, contentText: string, embedding: number[]) {
  const { data, error } = await supabase
    .from('content_embeddings')
    .upsert({
      content_id: contentId,
      content_type: contentType,
      content_text: contentText,
      embedding
    }, { onConflict: 'content_id,content_type' });

  if (error) {
    throw new Error(`Failed to store embeddings: ${error.message}`);
  }

  // Update the embedded status in the original content table
  if (contentType === 'research') {
    await supabase
      .from('research_papers')
      .update({ is_embedded: true })
      .eq('id', contentId);
  } else if (contentType === 'wiki') {
    await supabase
      .from('wiki_articles')
      .update({ is_embedded: true })
      .eq('id', contentId);
  }
  
  return data;
}

// Process a batch of content
async function processContentBatch(contentType: string) {
  let query;
  
  if (contentType === 'research') {
    query = supabase
      .from('research_papers')
      .select('id, title, summary, content')
      .eq('is_embedded', false)
      .limit(10);
  } else if (contentType === 'wiki') {
    query = supabase
      .from('wiki_articles')
      .select('id, title, description, content')
      .limit(10);
  } else {
    throw new Error(`Unsupported content type: ${contentType}`);
  }
  
  const { data: contentItems, error } = await query;
  
  if (error) {
    throw new Error(`Failed to fetch content: ${error.message}`);
  }
  
  const results = [];
  
  for (const item of contentItems) {
    try {
      // Combine relevant text fields for embedding
      let textToEmbed = '';
      
      if (contentType === 'research') {
        textToEmbed = `${item.title} ${item.summary} ${item.content || ''}`.trim();
      } else if (contentType === 'wiki') {
        textToEmbed = `${item.title} ${item.description} ${item.content || ''}`.trim();
      }
      
      // Generate embeddings
      const embedding = await generateEmbeddings(textToEmbed.substring(0, 8000)); // Limit text length
      
      // Store embeddings
      await storeEmbeddings(item.id, contentType, textToEmbed, embedding);
      
      results.push({ id: item.id, success: true });
    } catch (error) {
      console.error(`Error processing item ${item.id}:`, error);
      results.push({ id: item.id, success: false, error: error.message });
    }
  }
  
  return results;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Parse request body
    const { contentType, contentId } = await req.json();
    
    // Process batch of content if no specific ID provided
    if (!contentId) {
      const results = await processContentBatch(contentType);
      return new Response(JSON.stringify({ results }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    // Get content to embed based on type and ID
    let content;
    let textToEmbed = '';
    
    if (contentType === 'research') {
      const { data, error } = await supabase
        .from('research_papers')
        .select('id, title, summary, content')
        .eq('id', contentId)
        .single();
      
      if (error || !data) {
        throw new Error(`Content not found: ${error?.message}`);
      }
      
      content = data;
      textToEmbed = `${content.title} ${content.summary} ${content.content || ''}`.trim();
    } else if (contentType === 'wiki') {
      const { data, error } = await supabase
        .from('wiki_articles')
        .select('id, title, description, content')
        .eq('id', contentId)
        .single();
      
      if (error || !data) {
        throw new Error(`Content not found: ${error?.message}`);
      }
      
      content = data;
      textToEmbed = `${content.title} ${content.description} ${content.content || ''}`.trim();
    } else {
      throw new Error(`Unsupported content type: ${contentType}`);
    }
    
    // Generate embeddings
    const embedding = await generateEmbeddings(textToEmbed.substring(0, 8000)); // Limit text length
    
    // Store embeddings
    await storeEmbeddings(contentId, contentType, textToEmbed, embedding);
    
    return new Response(JSON.stringify({ success: true, contentId, contentType }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error in generate-embeddings function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
