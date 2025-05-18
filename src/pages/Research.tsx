
import React, { useState } from 'react';
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { PageLayout } from "@/components/layouts/PageLayout";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";

// Components
import { ResearchHeader } from "@/components/research/ResearchHeader";
import { ResearchFilters } from "@/components/research/ResearchFilters";
import { ResearchGrid } from "@/components/research/ResearchGrid";
import { ResearchSemanticSearch } from "@/components/research/ResearchSemanticSearch";
import { ResearchDiscoveryNotice } from "@/components/research/ResearchDiscoveryNotice";
import { ResearchLoadingIndicator } from "@/components/research/ResearchLoadingIndicator";
import { CreateResearchDialog } from "@/components/research/CreateResearchDialog";

// Hooks
import { useResearchData } from "@/hooks/useResearchData";
import { useSemanticSearch } from "@/hooks/useSemanticSearch";

// Types
import { ResearchPaper } from "@/lib/supabase-types";
import { ResearchItem, mapResearchPaperToItem } from "@/components/research/types";

const Research = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [semanticQuery, setSemanticQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isSemanticSearchActive, setIsSemanticSearchActive] = useState(false);
  
  // Use our custom hook for real-time research data
  const { researchPapers, isLoading, lastUpdateTime, refetch } = useResearchData(searchQuery, selectedCategory);
  
  // Use semantic search for advanced queries
  const { 
    results: semanticResults, 
    isLoading: isSemanticSearchLoading,
    error: semanticSearchError,
    performSearch: doSemanticSearch
  } = useSemanticSearch<ResearchPaper>({ contentType: 'research' });
  
  // Handle creating new research
  const handleCreateResearch = () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to create research entries.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    setIsCreateDialogOpen(true);
  };
  
  const handleResearchCreated = async (id: string) => {
    refetch();
    toast({
      title: "Research Published",
      description: "Your research paper has been published successfully.",
      duration: 3000,
    });
    
    // Generate embeddings for the new research paper
    try {
      await supabase.functions.invoke('generate-embeddings', {
        body: { contentType: 'research', contentId: id }
      });
    } catch (err) {
      console.error('Failed to generate embeddings:', err);
    }
  };
  
  const handleSemanticSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (semanticQuery.trim()) {
      setIsSemanticSearchActive(true);
      await doSemanticSearch(semanticQuery);
    }
  };
  
  const handleClearSemanticSearch = () => {
    setIsSemanticSearchActive(false);
    setSemanticQuery("");
  };
  
  // Determine which papers to display and map to ResearchItem type
  const displayPapers: ResearchItem[] = isSemanticSearchActive 
    ? semanticResults.map(mapResearchPaperToItem)
    : researchPapers;
    
  const isDisplayLoading = isSemanticSearchActive ? isSemanticSearchLoading : isLoading;
  
  return (
    <PageLayout>
      <div className="container mx-auto max-w-7xl">
        <div className="flex justify-between items-center mb-8">
          <ResearchHeader onCreateResearch={handleCreateResearch} />
          
          <div className="text-sm text-muted-foreground">
            Last updated: {format(lastUpdateTime, 'h:mm a')}
          </div>
        </div>
        
        {/* Traditional filters */}
        <ResearchFilters 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          disabled={isSemanticSearchActive}
        />
        
        {/* Semantic search bar */}
        <ResearchSemanticSearch
          semanticQuery={semanticQuery}
          onSemanticQueryChange={setSemanticQuery}
          isSemanticSearchLoading={isSemanticSearchLoading}
          isSemanticSearchActive={isSemanticSearchActive}
          semanticSearchError={semanticSearchError}
          semanticResultsCount={semanticResults.length}
          onSemanticSearch={handleSemanticSearch}
          onClearSemanticSearch={handleClearSemanticSearch}
        />
        
        <ResearchDiscoveryNotice />
        
        {isDisplayLoading ? (
          <ResearchLoadingIndicator />
        ) : (
          <ResearchGrid 
            searchQuery={isSemanticSearchActive ? semanticQuery : searchQuery}
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
