
import React, { useState, useEffect } from 'react';
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { PageLayout } from "@/components/layouts/PageLayout";
import { useAuth } from "@/lib/auth";
import { useAdminStatus } from "@/hooks/useAdminStatus";
import { supabase } from "@/integrations/supabase/client";
import { Search, Loader2, ArrowDownUp, Calendar, ExternalLink } from "lucide-react";

// Components
import { ResearchHeader } from "@/components/research/ResearchHeader";
import { ResearchGrid } from "@/components/research/ResearchGrid";
import { ResearchLoadingIndicator } from "@/components/research/ResearchLoadingIndicator";
import { CreateResearchDialog } from "@/components/research/CreateResearchDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ErrorMessage } from "@/components/ui/ErrorMessage";

// Hooks and Types
import { useResearchData } from "@/hooks/useResearchData";
import { ResearchItem } from "@/components/research/types";
import { useToast } from "@/hooks/use-toast";

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
  const { user } = useAuth();
  const { isAdmin, isModerator } = useAdminStatus();
  const { toast: showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState<Date>(new Date());
  const [sortByDate, setSortByDate] = useState(true);
  const [isSetupLoading, setIsSetupLoading] = useState(false);
  
  // Use our research data hook
  const { 
    researchPapers, 
    isLoading, 
    error, 
    refetch, 
    lastUpdateTime 
  } = useResearchData(searchQuery, selectedDomain);

  // Sort papers by date (newest first) or alphabetically
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
  
  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };
  
  // Clear search
  const clearSearch = () => {
    setSearchQuery("");
  };
  
  // Handle setting up cron job and fetch initial research data
  const handleSetupCronJob = async () => {
    try {
      setIsSetupLoading(true);
      
      showToast({
        title: "Setting up research automation",
        description: "Setting up scheduled fetching of research papers..."
      });
      
      // Call the setup-cron-jobs edge function
      const { data, error } = await supabase.functions.invoke('setup-cron-jobs');
      
      if (error) {
        throw error;
      }
      
      showToast({
        title: "Setup successful",
        description: "Research papers will now be automatically fetched regularly"
      });
      
      // Also fetch papers immediately
      await handleFetchLatestResearch();
      
    } catch (err: any) {
      showToast({
        title: "Setup failed",
        description: `Failed to set up automation: ${err.message}`,
        variant: "destructive"
      });
      console.error('Error setting up cron job:', err);
    } finally {
      setIsSetupLoading(false);
    }
  };
  
  // Manually fetch latest research papers
  const handleFetchLatestResearch = async () => {
    try {
      showToast({
        title: "Fetching papers",
        description: "Getting the latest research papers...",
      });
      
      const { data, error } = await supabase.functions.invoke('fetch-research');
      
      if (error) {
        throw error;
      }
      
      showToast({
        title: "Fetch successful",
        description: `Successfully fetched ${data?.count || 0} research papers`
      });
      
      // Trigger a refresh
      setRefreshTrigger(new Date());
      refetch();
      
    } catch (err: any) {
      showToast({
        title: "Fetch failed",
        description: `Failed to fetch papers: ${err.message}`,
        variant: "destructive"
      });
      console.error('Error fetching research:', err);
    }
  };
  
  // Handle creating new research
  const handleCreateResearch = () => {
    if (!user) {
      showToast({
        title: "Authentication required",
        description: "Please sign in to create research entries",
        variant: "destructive"
      });
      return;
    }
    
    setIsCreateDialogOpen(true);
  };
  
  const handleResearchCreated = async (id: string) => {
    refetch();
    showToast({
      title: "Paper published",
      description: "Research paper published successfully"
    });
  };

  return (
    <PageLayout>
      <div className="container mx-auto max-w-7xl py-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
          <ResearchHeader onCreateResearch={handleCreateResearch} />
          
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
                className="whitespace-nowrap"
              >
                Add Research Paper
              </Button>
            )}
            
            {(isAdmin) && (
              <Button 
                variant="secondary"
                size="sm"
                onClick={handleSetupCronJob} 
                disabled={isSetupLoading}
                className="whitespace-nowrap"
              >
                {isSetupLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <ExternalLink className="h-4 w-4 mr-2" />
                )}
                Setup Auto-Fetch
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
        
        {/* Domains Tabs - Improved scrollable tabs */}
        <div className="mb-6 border-b overflow-x-auto scrollbar-hide">
          <Tabs 
            value={selectedDomain || "All Categories"} 
            onValueChange={value => setSelectedDomain(value === "All Categories" ? null : value)}
          >
            <TabsList className="inline-flex w-max min-w-full bg-transparent">
              {RESEARCH_DOMAINS.map(domain => (
                <TabsTrigger key={domain} value={domain} className="py-2">
                  {domain}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
        
        {isLoading ? (
          <ResearchLoadingIndicator />
        ) : error ? (
          <Card className="text-center py-10">
            <CardContent>
              <ErrorMessage 
                title="Error loading research papers"
                message={error instanceof Error ? error.message : String(error)}
                retry={() => refetch()}
              />
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
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <Button onClick={handleFetchLatestResearch}>
                  Fetch Latest Research
                </Button>
                {isAdmin && (
                  <Button variant="outline" onClick={handleSetupCronJob} disabled={isSetupLoading}>
                    Setup Automated Fetching
                  </Button>
                )}
              </div>
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

export default Research;
