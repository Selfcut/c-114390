
import React, { useState, useEffect } from 'react';
import { CollapsibleSidebar } from "@/components/CollapsibleSidebar";
import Header from "@/components/Header";
import { ResearchHeader } from "@/components/research/ResearchHeader";
import { ResearchFilters } from "@/components/research/ResearchFilters";
import { ResearchGrid } from "@/components/research/ResearchGrid";
import { Microscope, Search, Loader2, Database } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useResearchData } from "@/hooks/useResearchData";
import { format } from "date-fns";
import { PageLayout } from "@/components/layouts/PageLayout";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { CreateResearchDialog } from "@/components/research/CreateResearchDialog";
import { useSemanticSearch } from "@/hooks/useSemanticSearch";
import { ResearchPaper } from "@/lib/supabase-types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
  
  // Determine which papers to display
  const displayPapers = isSemanticSearchActive ? semanticResults : researchPapers;
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
        <div className="mb-6">
          <form onSubmit={handleSemanticSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="search"
                placeholder="Ask a question or describe what you're looking for..."
                value={semanticQuery}
                onChange={(e) => setSemanticQuery(e.target.value)}
                className="pl-10"
                disabled={isSemanticSearchLoading}
              />
            </div>
            <Button 
              type="submit" 
              disabled={!semanticQuery.trim() || isSemanticSearchLoading}
            >
              {isSemanticSearchLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Database className="h-4 w-4 mr-2" />
              )}
              Semantic Search
            </Button>
            {isSemanticSearchActive && (
              <Button 
                variant="outline" 
                onClick={handleClearSemanticSearch}
                disabled={isSemanticSearchLoading}
              >
                Clear
              </Button>
            )}
          </form>
          {semanticSearchError && (
            <p className="text-sm text-destructive mt-1">{semanticSearchError}</p>
          )}
          {isSemanticSearchActive && semanticResults.length > 0 && (
            <p className="text-sm text-muted-foreground mt-1">
              Found {semanticResults.length} papers using semantic search
            </p>
          )}
        </div>
        
        <div className="mb-4 p-3 bg-primary/10 rounded-md border border-primary/20 text-sm flex items-start gap-3">
          <Microscope className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Research Auto-Discovery Active</p>
            <p className="text-muted-foreground">The system is automatically searching for new research papers every hour from arXiv.</p>
          </div>
        </div>
        
        {/* Show a tip about semantic search */}
        <Alert className="mb-4">
          <Database className="h-4 w-4" />
          <AlertTitle>Semantic Search Available</AlertTitle>
          <AlertDescription>
            Try asking questions like "papers about large language models" or "research on explainable AI" to find semantically related content.
          </AlertDescription>
        </Alert>
        
        {isDisplayLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
              <p className="mt-4 text-muted-foreground">Fetching research papers...</p>
            </div>
          </div>
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
