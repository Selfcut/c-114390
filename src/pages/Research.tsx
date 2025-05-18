
import React, { useState } from 'react';
import { CollapsibleSidebar } from "@/components/CollapsibleSidebar";
import Header from "@/components/Header";
import { ResearchHeader } from "@/components/research/ResearchHeader";
import { ResearchFilters } from "@/components/research/ResearchFilters";
import { ResearchGrid } from "@/components/research/ResearchGrid";

const Research = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  return (
    <div className="flex min-h-screen bg-background">
      <CollapsibleSidebar />
      <div className="flex-1 flex flex-col w-[calc(100vw-var(--sidebar-width))]">
        <Header />
        <main className="flex-1 overflow-auto p-6">
          <div className="container mx-auto max-w-7xl">
            <ResearchHeader onCreateResearch={() => {
              // Add your create research logic here
              alert('Create research feature coming soon');
            }} />
            <ResearchFilters 
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
            <ResearchGrid 
              searchQuery={searchQuery}
              selectedCategory={selectedCategory}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Research;
