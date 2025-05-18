
import React, { useState, useEffect } from 'react';
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { PageLayout } from "@/components/layouts/PageLayout";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { Search, Loader2 } from "lucide-react";

// Components
import { ResearchHeader } from "@/components/research/ResearchHeader";
import { ResearchGrid } from "@/components/research/ResearchGrid";
import { ResearchLoadingIndicator } from "@/components/research/ResearchLoadingIndicator";
import { CreateResearchDialog } from "@/components/research/CreateResearchDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
  
  // Search state
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<ResearchPaper[]>([]);
  
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
  
  // Handle search
  const performSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      // If search is cleared, show all papers
      setSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    setSearchError(null);
    
    try {
      // Try semantic search if available
      try {
        const { data: semanticData, error: semanticError } = await supabase.functions.invoke('semantic-search', {
          body: { 
            query: searchQuery,
            contentType: 'research',
            limit: 20,
            threshold: 0.65
          }
        });
        
        if (!semanticError && semanticData?.results && semanticData.results.length > 0) {
          setSearchResults(semanticData.results);
          setIsSearching(false);
          return;
        }
      } catch (semanticError) {
        console.log('Semantic search not available, falling back to basic search');
      }
      
      // Fallback to basic search
      const { data, error } = await supabase
        .from('research_papers')
        .select('*')
        .or(`title.ilike.%${searchQuery}%,summary.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`);
      
      if (error) throw error;
      
      setSearchResults(data || []);
    } catch (error: any) {
      console.error('Search error:', error);
      setSearchError(`Search failed: ${error.message}`);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };
  
  // Clear search
  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
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
  const displayPapers = searchResults.length > 0
    ? searchResults.map(mapResearchPaperToItem)
    : filteredPapers;
    
  // Handle category selection
  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
    // Clear search if active
    if (searchResults.length > 0) {
      clearSearch();
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
        
        {/* Unified Search Bar */}
        <div className="mb-6">
          <form onSubmit={performSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="search"
                placeholder="Search for research papers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                disabled={isSearching}
              />
            </div>
            <Button 
              type="submit" 
              disabled={!searchQuery.trim() || isSearching}
            >
              {isSearching ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Search className="h-4 w-4 mr-2" />
              )}
              Search
            </Button>
            {searchResults.length > 0 && (
              <Button 
                variant="outline" 
                onClick={clearSearch}
                disabled={isSearching}
              >
                Clear
              </Button>
            )}
          </form>
          {searchError && (
            <p className="text-sm text-destructive mt-1">{searchError}</p>
          )}
          {searchResults.length > 0 && (
            <p className="text-sm text-muted-foreground mt-1">
              Found {searchResults.length} research papers
            </p>
          )}
        </div>
        
        {/* Category filter dropdown */}
        <div className="mb-6">
          <select
            className="border border-input bg-background px-3 py-2 rounded-md text-sm"
            value={selectedCategory || ''}
            onChange={(e) => handleCategoryChange(e.target.value || null)}
            disabled={searchResults.length > 0}
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
        
        {isLoading || isSearching ? (
          <ResearchLoadingIndicator />
        ) : displayPapers.length > 0 ? (
          <ResearchGrid 
            searchQuery={searchQuery}
            selectedCategory={selectedCategory}
            researchPapers={displayPapers}
          />
        ) : (
          <div className="text-center py-10 border rounded-lg bg-muted/20">
            <p className="text-muted-foreground mb-2">No research papers found</p>
            <Button onClick={handleCreateResearch}>Create Your First Research Paper</Button>
          </div>
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
