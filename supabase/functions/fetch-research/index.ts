
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

// Sample research papers to use as fallback
const SAMPLE_RESEARCH_PAPERS = [
  {
    title: "Advances in Neural Network Research for Artificial Intelligence",
    summary: "This paper presents recent advancements in neural network architectures and their applications in artificial intelligence systems. We introduce a novel approach that improves performance in image recognition tasks by 15%.",
    author: "Dr. Alexandra Chen",
    category: "Artificial Intelligence",
    content: "Full content of the research paper about neural network advances...",
    image_url: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1965&auto=format&fit=crop",
    source: "Journal of AI Research",
    source_url: "https://example.com/journal-ai-research",
    published_date: new Date().toISOString(),
    is_auto_fetched: true
  },
  {
    title: "Quantum Computing: Breaking the Computational Barrier",
    summary: "Our research demonstrates how quantum computers can solve previously intractable problems in polynomial time. We provide experimental evidence using a 64-qubit quantum processor.",
    author: "Prof. James Wilson",
    category: "Quantum Computing",
    content: "Full content of the quantum computing research paper...",
    image_url: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2070&auto=format&fit=crop",
    source: "Quantum Information Processing",
    source_url: "https://example.com/quantum-info",
    published_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    is_auto_fetched: true
  },
  {
    title: "Natural Language Processing for Medical Applications",
    summary: "This study explores how NLP techniques can improve medical diagnosis accuracy. Our model achieved 92% accuracy in identifying early signs of disease from clinical notes.",
    author: "Dr. Maria Rodriguez",
    category: "Computational Linguistics",
    content: "Full content of the medical NLP research paper...",
    image_url: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070&auto=format&fit=crop",
    source: "Journal of Medical AI",
    source_url: "https://example.com/medical-ai",
    published_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    is_auto_fetched: true
  },
  {
    title: "Reinforcement Learning for Autonomous Robotics",
    summary: "We present a novel reinforcement learning algorithm that enables robots to learn complex tasks with minimal human intervention. Our approach shows a 40% reduction in training time.",
    author: "Dr. Thomas Lee",
    category: "Machine Learning",
    content: "Full content of the reinforcement learning research paper...",
    image_url: "https://images.unsplash.com/photo-1555255707-c07966088b7b?q=80&w=2036&auto=format&fit=crop",
    source: "Robotics and AI Conference",
    source_url: "https://example.com/robotics-conf",
    published_date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    is_auto_fetched: true
  },
  {
    title: "Cybersecurity Threat Detection Using Graph Neural Networks",
    summary: "This paper introduces a graph-based approach to detect network intrusions. Our method outperforms traditional techniques by identifying 95% of sophisticated attacks with minimal false positives.",
    author: "Dr. Sarah Johnson",
    category: "Cybersecurity",
    content: "Full content of the cybersecurity research paper...",
    image_url: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=2070&auto=format&fit=crop",
    source: "International Cybersecurity Conference",
    source_url: "https://example.com/cybersec-conf",
    published_date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    is_auto_fetched: true
  }
];

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Parse request body if any
    let requestData = {};
    try {
      requestData = await req.json();
    } catch (e) {
      requestData = {};
    }
    
    const forceSample = requestData.force_sample === true;
    const source = requestData.source || 'manual';
    
    console.log(`Fetching research papers. Source: ${source}, Force Sample: ${forceSample}`);
    
    // Create a Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );
    
    let insertedPapers = 0;
    let errors = [];
    
    // Use sample data for quick testing
    if (forceSample) {
      console.log("Using sample data as requested");
      
      // Check if we already have any papers first to avoid duplicates
      const { count, error: countError } = await supabaseClient
        .from('research_papers')
        .select('*', { count: 'exact', head: true });
      
      if (countError) {
        console.error("Error checking existing papers:", countError);
        errors.push(`Count error: ${countError.message}`);
      }
      
      // Only insert sample data if we have fewer than 5 papers
      if (!countError && (count === null || count < 5)) {
        // Insert sample research papers
        const { data, error } = await supabaseClient
          .from('research_papers')
          .insert(SAMPLE_RESEARCH_PAPERS);
        
        if (error) {
          console.error("Error inserting sample papers:", error);
          errors.push(`Insert error: ${error.message}`);
        } else {
          console.log("Successfully inserted sample papers");
          insertedPapers = SAMPLE_RESEARCH_PAPERS.length;
        }
      } else {
        console.log("Skipping sample data insert as there are already papers in the database");
      }
      
      return new Response(
        JSON.stringify({ 
          success: true,
          message: "Sample research papers fetched successfully",
          count: insertedPapers,
          errors: errors.length > 0 ? errors : undefined
        }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200 
        }
      );
    }
    
    // For real implementation, this would connect to research APIs like arXiv
    // For now, we'll just use sample data regardless
    console.log("No real API implementation yet, using sample data");
    
    // Check if we already have any papers to avoid duplicates
    const { count, error: countError } = await supabaseClient
      .from('research_papers')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.error("Error checking existing papers:", countError);
      errors.push(`Count error: ${countError.message}`);
    }
    
    // Only insert sample data if we have fewer than 5 papers
    if (!countError && (count === null || count < 5)) {
      // Insert sample research papers
      const { data, error } = await supabaseClient
        .from('research_papers')
        .insert(SAMPLE_RESEARCH_PAPERS);
      
      if (error) {
        console.error("Error inserting sample papers:", error);
        errors.push(`Insert error: ${error.message}`);
      } else {
        console.log("Successfully inserted sample papers");
        insertedPapers = SAMPLE_RESEARCH_PAPERS.length;
      }
    } else {
      console.log("Skipping sample data insert as there are already papers in the database");
    }
    
    return new Response(
      JSON.stringify({ 
        success: errors.length === 0,
        message: insertedPapers > 0 
          ? `Successfully fetched ${insertedPapers} research papers`
          : "No new papers added",
        count: insertedPapers,
        errors: errors.length > 0 ? errors : undefined
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200 
      }
    );
  } catch (error) {
    console.error("Error fetching research papers:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false,
        message: "Error fetching research papers",
        error: error.message
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500 
      }
    );
  }
});
