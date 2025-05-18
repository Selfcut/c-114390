
import React, { useState } from 'react';
import { CollapsibleSidebar } from "@/components/CollapsibleSidebar";
import Header from "@/components/Header";
import { ResearchHeader } from "@/components/research/ResearchHeader";
import { ResearchFilters } from "@/components/research/ResearchFilters";
import { ResearchGrid } from "@/components/research/ResearchGrid";
import { Microscope } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useResearchData } from "@/hooks/useResearchData";
import { format } from "date-fns";
import { PageLayout } from "@/components/layouts/PageLayout";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { CreateResearchDialog } from "@/components/research/CreateResearchDialog";

const Research = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
  // Use our custom hook for real-time research data
  const { researchPapers, isLoading, lastUpdateTime, refetch } = useResearchData(searchQuery, selectedCategory);
  
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
  
  const handleResearchCreated = (id: string) => {
    refetch();
    toast({
      title: "Research Published",
      description: "Your research paper has been published successfully.",
      duration: 3000,
    });
    
    // Optionally navigate to the new research paper
    // navigate(`/research/${id}`);
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
        
        <ResearchFilters 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
        
        <div className="mb-4 p-3 bg-primary/10 rounded-md border border-primary/20 text-sm flex items-start gap-3">
          <Microscope className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Research Auto-Discovery Active</p>
            <p className="text-muted-foreground">The system is automatically searching for new research papers every hour.</p>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
              <p className="mt-4 text-muted-foreground">Fetching research papers...</p>
            </div>
          </div>
        ) : (
          <ResearchGrid 
            searchQuery={searchQuery}
            selectedCategory={selectedCategory}
            researchPapers={researchPapers}
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
