
import React, { useState, useEffect } from 'react';
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { PageLayout } from "@/components/layouts/PageLayout";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";

// Components
import { ResearchHeader } from "@/components/research/ResearchHeader";
import { ResearchSemanticSearch } from "@/components/research/ResearchSemanticSearch";
import { ResearchGrid } from "@/components/research/ResearchGrid";
import { ResearchLoadingIndicator } from "@/components/research/ResearchLoadingIndicator";
import { CreateResearchDialog } from "@/components/research/CreateResearchDialog";

// Types
import { ResearchPaper } from "@/lib/supabase-types";
import { ResearchItem, mapResearchPaperToItem } from "@/components/research/types";

const Research = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdateTime, setLastUpdateTime] = useState<Date>(new Date());
  const [researchPapers, setResearchPapers] = useState<ResearchItem[]>([]);
  
  // Semantic search state
  const [isSemanticSearchActive, setIsSemanticSearchActive] = useState(false);
  const [isSemanticSearchLoading, setIsSemanticSearchLoading] = useState(false);
  const [semanticSearchError, setSemanticSearchError] = useState<string | null>(null);
  const [semanticResults, setSemanticResults] = useState<ResearchPaper[]>([]);
  
  // Fetch research papers on component mount
  useEffect(() => {
    fetchResearchPapers();
  }, []);

  // Fetch all research papers
  const fetchResearchPapers = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('research_papers')
        .select('*');
        
      if (error) {
        throw error;
      }
      
      if (data) {
        const mappedPapers = data.map(mapResearchPaperToItem);
        setResearchPapers(mappedPapers);
        setLastUpdateTime(new Date());
      }
    } catch (error: any) {
      console.error('Error fetching research papers:', error);
      toast.error(`Failed to load research papers: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle semantic search
  const performSemanticSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsSemanticSearchLoading(true);
    setIsSemanticSearchActive(true);
    setSemanticSearchError(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('semantic-search', {
        body: { 
          query: searchQuery,
          contentType: 'research',
          limit: 20,
          threshold: 0.65
        }
      });
      
      if (error) throw error;
      
      if (data && data.results) {
        setSemanticResults(data.results);
      } else {
        setSemanticResults([]);
      }
    } catch (error: any) {
      console.error('Semantic search error:', error);
      setSemanticSearchError(`Search failed: ${error.message}`);
      setSemanticResults([]);
    } finally {
      setIsSemanticSearchLoading(false);
    }
  };
  
  // Clear semantic search
  const clearSemanticSearch = () => {
    setIsSemanticSearchActive(false);
    setSearchQuery("");
    setSemanticResults([]);
  };
  
  // Handle creating new research
  const handleCreateResearch = () => {
    if (!user) {
      toast.error("Please sign in to create research entries");
      return;
    }
    
    setIsCreateDialogOpen(true);
  };
  
  const handleResearchCreated = async (id: string) => {
    fetchResearchPapers();
    toast.success("Research paper published successfully");
    
    // Generate embeddings for the new research paper
    try {
      await supabase.functions.invoke('generate-embeddings', {
        body: { contentType: 'research', contentId: id }
      });
    } catch (err) {
      console.error('Failed to generate embeddings:', err);
    }
  };
  
  // Filter papers based on category if selected
  const filteredPapers = researchPapers.filter(paper => {
    if (selectedCategory) {
      return paper.category === selectedCategory;
    }
    return true;
  });
  
  // Determine which papers to display
  const displayPapers = isSemanticSearchActive 
    ? semanticResults.map(mapResearchPaperToItem)
    : filteredPapers;
    
  // Handle category selection
  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
    // Clear semantic search if active
    if (isSemanticSearchActive) {
      clearSemanticSearch();
    }
  };
  
  return (
    <PageLayout>
      <div className="container mx-auto max-w-7xl">
        <div className="flex justify-between items-center mb-8">
          <ResearchHeader onCreateResearch={handleCreateResearch} />
          
          <div className="text-sm text-muted-foreground">
            Last updated: {format(lastUpdateTime, 'h:mm a')}
          </div>
        </div>
        
        {/* Single Search Bar for Research Papers */}
        <ResearchSemanticSearch
          semanticQuery={searchQuery}
          onSemanticQueryChange={setSearchQuery}
          isSemanticSearchLoading={isSemanticSearchLoading}
          isSemanticSearchActive={isSemanticSearchActive}
          semanticSearchError={semanticSearchError}
          semanticResultsCount={semanticResults.length}
          onSemanticSearch={performSemanticSearch}
          onClearSemanticSearch={clearSemanticSearch}
        />
        
        {/* Category filter dropdown */}
        <div className="mb-6">
          <select
            className="border border-input bg-background px-3 py-2 rounded-md text-sm"
            value={selectedCategory || ''}
            onChange={(e) => handleCategoryChange(e.target.value || null)}
            disabled={isSemanticSearchActive}
          >
            <option value="">All Categories</option>
            <option value="Machine Learning">Machine Learning</option>
            <option value="Artificial Intelligence">Artificial Intelligence</option>
            <option value="Natural Language Processing">Natural Language Processing</option>
            <option value="Computer Vision">Computer Vision</option>
            <option value="Neuroscience">Neuroscience</option>
            <option value="Ethics">Ethics</option>
          </select>
        </div>
        
        {isLoading || isSemanticSearchLoading ? (
          <ResearchLoadingIndicator />
        ) : (
          <ResearchGrid 
            searchQuery={searchQuery}
            selectedCategory={selectedCategory}
            researchPapers={displayPapers}
          />
        )}
      </div>
      
      <CreateResearchDialog 
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSuccess={handleResearchCreated}
      />
    </PageLayout>
  );
};

export default Research;
