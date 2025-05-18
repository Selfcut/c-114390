
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

const Research = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Use our custom hook for real-time research data
  const { researchPapers, isLoading, lastUpdateTime } = useResearchData(searchQuery, selectedCategory);
  
  return (
    <div className="flex min-h-screen bg-background">
      <CollapsibleSidebar />
      <div className="flex-1 flex flex-col w-[calc(100vw-var(--sidebar-width))]">
        <Header />
        <main className="flex-1 overflow-auto p-6">
          <div className="container mx-auto max-w-7xl">
            <div className="flex justify-between items-center mb-8">
              <ResearchHeader onCreateResearch={() => {
                // This would open a dialog to create new research
                toast({
                  title: "Create Research",
                  description: "This feature will be implemented soon.",
                  duration: 3000,
                });
              }} />
              
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
        </main>
      </div>
    </div>
  );
};

export default Research;
