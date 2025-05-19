
import React, { useState, useEffect } from 'react';
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { PageLayout } from "@/components/layouts/PageLayout";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { Search, Loader2, ArrowDownUp, Calendar, ExternalLink } from "lucide-react";

// Components
import { ResearchHeader } from "@/components/research/ResearchHeader";
import { ResearchGrid } from "@/components/research/ResearchGrid";
import { ResearchLoadingIndicator } from "@/components/research/ResearchLoadingIndicator";
import { CreateResearchDialog } from "@/components/research/CreateResearchDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

// Hooks and Types
import { useResearchData } from "@/hooks/useResearchData";
import { ResearchItem } from "@/components/research/types";

// Domain categories for research papers
const RESEARCH_DOMAINS = [
  "All Categories",
  "Artificial Intelligence",
  "Machine Learning",
  "Computational Linguistics",
  "Statistics - Machine Learning",
  "Neuroscience",
  "Computer Vision",
  "Robotics",
  "Cybersecurity",
  "Software Engineering",
  "Biomolecular Research",
  "Neural Computing",
  "Medical Physics",
  "Computing and Society",
  "Quantitative Finance",
  "Social Physics"
];

const Research = () => {
  const navigate = useNavigate();
  const { user, isAdmin, isModerator } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState<Date>(new Date());
  const [sortByDate, setSortByDate] = useState(true);
  
  // Use our research data hook
  const { 
    researchPapers, 
    isLoading, 
    error, 
    refetch, 
    lastUpdateTime 
  } = useResearchData(searchQuery, selectedDomain);

  // Sort papers by date (newest first)
  const sortedPapers = React.useMemo(() => {
    if (!researchPapers) return [];
    
    return [...researchPapers].sort((a, b) => {
      if (sortByDate) {
        return b.date.getTime() - a.date.getTime();
      } else {
        // Sort by title if not sorting by date
        return a.title.localeCompare(b.title);
      }
    });
  }, [researchPapers, sortByDate]);
  
  // Get unique domains from the fetched papers
  const availableDomains = React.useMemo(() => {
    if (!researchPapers) return [];
    
    const domains = new Set<string>();
    researchPapers.forEach(paper => {
      if (paper.category) {
        domains.add(paper.category);
      }
    });
    
    return Array.from(domains).sort();
  }, [researchPapers]);
  
  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };
  
  // Clear search
  const clearSearch = () => {
    setSearchQuery("");
  };
  
  // Manually fetch latest research papers
  const handleFetchLatestResearch = async () => {
    try {
      toast.loading("Fetching latest research papers...");
      
      const { data, error } = await supabase.functions.invoke('fetch-research');
      
      if (error) {
        throw error;
      }
      
      toast.dismiss();
      toast.success(`Successfully fetched ${data?.count || 0} research papers`);
      
      // Trigger a refresh
      setRefreshTrigger(new Date());
      refetch();
      
    } catch (err: any) {
      toast.dismiss();
      toast.error(`Failed to fetch research papers: ${err.message}`);
      console.error('Error fetching research:', err);
    }
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
    refetch();
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

  return (
    <PageLayout>
      <div className="container mx-auto max-w-7xl py-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
          <ResearchHeader onCreateResearch={null} /> {/* No button in the header */}
          
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <div className="text-sm text-muted-foreground whitespace-nowrap">
              Last updated: {format(lastUpdateTime, 'h:mm a')}
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleFetchLatestResearch}
              className="whitespace-nowrap"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Fetch Latest Research
            </Button>
            
            {(isAdmin || isModerator) && (
              <Button 
                size="sm"
                onClick={handleCreateResearch} 
                className="whitespace-nowrap ml-2"
              >
                Add Research Paper
              </Button>
            )}
          </div>
        </div>
        
        {/* Search and Sort Controls */}
        <div className="mb-6">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="search"
                placeholder="Search for research papers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                disabled={isLoading}
              />
            </div>
            
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => setSortByDate(!sortByDate)}
              title={sortByDate ? "Sort alphabetically" : "Sort by date"}
            >
              <ArrowDownUp className="h-4 w-4" />
            </Button>
            
            {searchQuery && (
              <Button 
                variant="outline" 
                onClick={clearSearch}
                disabled={isLoading}
              >
                Clear
              </Button>
            )}
          </form>
        </div>
        
        {/* Domains Tabs */}
        <Tabs 
          value={selectedDomain || "All Categories"} 
          onValueChange={value => setSelectedDomain(value === "All Categories" ? null : value)}
          className="mb-6"
        >
          <div className="border-b">
            <ScrollableTabsList>
              {RESEARCH_DOMAINS.map(domain => (
                <TabsTrigger key={domain} value={domain}>
                  {domain}
                </TabsTrigger>
              ))}
            </ScrollableTabsList>
          </div>
        </Tabs>
        
        {isLoading ? (
          <ResearchLoadingIndicator />
        ) : error ? (
          <Card className="text-center py-10">
            <CardContent>
              <p className="text-destructive mb-4">{error}</p>
              <Button onClick={() => refetch()}>Retry</Button>
            </CardContent>
          </Card>
        ) : sortedPapers.length > 0 ? (
          <ResearchGrid 
            searchQuery={searchQuery}
            selectedCategory={selectedDomain}
            researchPapers={sortedPapers}
          />
        ) : (
          <Card className="text-center py-12 border-dashed">
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-2">No research papers found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery 
                  ? "Try adjusting your search terms or filters" 
                  : "Research papers from top journals and publications will appear here"}
              </p>
              <Button onClick={handleFetchLatestResearch}>
                Fetch Latest Research
              </Button>
            </CardContent>
          </Card>
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

// Custom scrollable tabs list for horizontal scrolling on mobile
const ScrollableTabsList: React.FC<{children: React.ReactNode}> = ({ children }) => {
  return (
    <div className="overflow-auto scrollbar-hide">
      <TabsList className="inline-flex w-max min-w-full">
        {children}
      </TabsList>
    </div>
  );
};

export default Research;
