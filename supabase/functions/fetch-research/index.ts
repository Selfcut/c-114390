
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

// Categories to fetch - expanded list of research domains
const categories = [
  'cs.AI', // Artificial Intelligence
  'cs.CL', // Computational Linguistics
  'cs.LG', // Machine Learning
  'stat.ML', // Statistics - Machine Learning
  'q-bio.NC', // Quantitative Biology - Neurons and Cognition
  'q-fin.ST', // Quantitative Finance
  'physics.soc-ph', // Physics - Society and Physics
  'cs.CV', // Computer Vision
  'cs.RO', // Robotics
  'cs.CR', // Cryptography and Security
  'cs.SE', // Software Engineering
  'q-bio.BM', // Quantitative Biology - Biomolecules
  'cs.NE', // Neural and Evolutionary Computing
  'physics.med-ph', // Medical Physics
  'cs.CY' // Computers and Society
];

// Map category codes to human-readable names
const categoryNames = {
  'cs.AI': 'Artificial Intelligence',
  'cs.CL': 'Computational Linguistics',
  'cs.LG': 'Machine Learning',
  'stat.ML': 'Statistics - Machine Learning',
  'q-bio.NC': 'Neuroscience',
  'q-fin.ST': 'Quantitative Finance',
  'physics.soc-ph': 'Social Physics',
  'cs.CV': 'Computer Vision',
  'cs.RO': 'Robotics',
  'cs.CR': 'Cybersecurity',
  'cs.SE': 'Software Engineering',
  'q-bio.BM': 'Biomolecular Research',
  'cs.NE': 'Neural Computing',
  'physics.med-ph': 'Medical Physics',
  'cs.CY': 'Computing and Society'
};

// Function to fetch recent papers from arXiv
async function fetchArxivPapers(category: string, maxResults: number = 20) {
  try {
    const url = `http://export.arxiv.org/api/query?search_query=cat:${category}&sortBy=submittedDate&sortOrder=descending&max_results=${maxResults}`;
    
    console.log(`Fetching papers from ${category}...`);
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
      
      // Convert category code to human-readable name
      const displayCategory = categoryNames[category as keyof typeof categoryNames] || category;
      
      return {
        title,
        summary: summary.substring(0, 500) + (summary.length > 500 ? "..." : ""),
        author: authors,
        published_date: published,
        source: "arXiv",
        source_url: `https://arxiv.org/abs/${arxivId}`,
        category: displayCategory,
        is_auto_fetched: true
      };
    });
  } catch (error) {
    console.error(`Error fetching ${category} papers:`, error);
    return [];
  }
}

// Function to store papers in the database
async function storePapers(papers: any[]) {
  if (papers.length === 0) {
    return [];
  }
  
  try {
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
  } catch (error) {
    console.error('Error storing papers:', error);
    throw error;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    console.log("Fetch research job started");
    const papers = [];
    const startTime = Date.now();
    
    // Fetch papers for each category
    for (const category of categories) {
      try {
        console.log(`Fetching papers for ${category}...`);
        const categoryPapers = await fetchArxivPapers(category, 20);
        console.log(`Fetched ${categoryPapers.length} papers from ${category}`);
        papers.push(...categoryPapers);
      } catch (categoryError) {
        console.error(`Error processing category ${category}:`, categoryError);
        // Continue with other categories even if one fails
      }
    }
    
    // Store papers in the database
    if (papers.length > 0) {
      await storePapers(papers);
      
      // Trigger embedding generation for new papers (simplified approach)
      try {
        await supabase.functions.invoke('generate-embeddings', {
          body: { contentType: 'research', batchSize: 50 }
        });
      } catch (embedError) {
        console.error('Error generating embeddings:', embedError);
      }
    }
    
    const duration = (Date.now() - startTime) / 1000;
    console.log(`Fetch research job completed in ${duration.toFixed(2)}s. Fetched ${papers.length} papers.`);
    
    return new Response(JSON.stringify({ 
      success: true, 
      count: papers.length,
      duration: `${duration.toFixed(2)}s`,
      categories: categories.length
    }), {
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
