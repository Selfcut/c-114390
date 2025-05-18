
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.23.0';
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts";

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Categories to fetch - adjust as needed
const categories = [
  'cs.AI', // Artificial Intelligence
  'cs.CL', // Computational Linguistics
  'cs.LG', // Machine Learning
  'stat.ML', // Statistics - Machine Learning
];

// Function to fetch recent papers from arXiv
async function fetchArxivPapers(category: string, maxResults: number = 10) {
  const url = `http://export.arxiv.org/api/query?search_query=cat:${category}&sortBy=submittedDate&sortOrder=descending&max_results=${maxResults}`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch arXiv papers: ${response.status} ${response.statusText}`);
  }
  
  const xmlText = await response.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlText, "text/xml");
  
  if (!doc) {
    throw new Error("Failed to parse XML response");
  }
  
  const entries = Array.from(doc.querySelectorAll("entry"));
  
  return entries.map(entry => {
    const title = entry.querySelector("title")?.textContent?.trim() || "Untitled Paper";
    const summary = entry.querySelector("summary")?.textContent?.trim() || "";
    const published = entry.querySelector("published")?.textContent || "";
    const id = entry.querySelector("id")?.textContent || "";
    const arxivId = id.split('/').pop()?.split('v')[0] || "";
    
    // Get all authors
    const authorNodes = Array.from(entry.querySelectorAll("author name"));
    const authors = authorNodes.map(node => node.textContent || "").join(", ");
    
    return {
      title,
      summary,
      author: authors,
      published_date: published,
      source: "arXiv",
      source_url: `https://arxiv.org/abs/${arxivId}`,
      category: category,
      is_auto_fetched: true
    };
  });
}

// Function to store papers in the database
async function storePapers(papers: any[]) {
  const { data, error } = await supabase
    .from('research_papers')
    .upsert(
      papers.map(paper => ({
        title: paper.title,
        summary: paper.summary,
        author: paper.author,
        published_date: paper.published_date,
        source: paper.source,
        source_url: paper.source_url,
        category: paper.category,
        is_auto_fetched: paper.is_auto_fetched
      })),
      { onConflict: 'source_url' }
    );
  
  if (error) {
    throw new Error(`Failed to store papers: ${error.message}`);
  }
  
  return data;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const papers = [];
    
    // Fetch papers for each category
    for (const category of categories) {
      const categoryPapers = await fetchArxivPapers(category, 5);
      papers.push(...categoryPapers);
    }
    
    // Store papers in the database
    await storePapers(papers);
    
    // Trigger embedding generation for new papers
    for (const paper of papers) {
      try {
        await fetch(`${supabaseUrl}/functions/v1/generate-embeddings`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${supabaseServiceKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contentType: 'research',
            // Note: We don't have the contentId here yet since we just inserted them
          }),
        });
      } catch (error) {
        console.error('Error generating embeddings:', error);
      }
    }
    
    return new Response(JSON.stringify({ success: true, count: papers.length }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error in fetch-research function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
