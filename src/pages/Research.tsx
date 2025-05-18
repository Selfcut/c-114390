
import React, { useState, useEffect } from 'react';
import { CollapsibleSidebar } from "@/components/CollapsibleSidebar";
import Header from "@/components/Header";
import { ResearchHeader } from "@/components/research/ResearchHeader";
import { ResearchFilters } from "@/components/research/ResearchFilters";
import { ResearchGrid } from "@/components/research/ResearchGrid";
import { Microscope, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useToast } from '@/hooks/use-toast';

// Create a utility to simulate automated research fetching
const fetchLatestResearch = async () => {
  // In a real app, this would be a call to an API that fetches the latest research
  // For now, we'll simulate it with a delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Generate a random research paper for demonstration
  const topics = [
    "Quantum Computing", "Neural Networks", "Dark Matter", 
    "Consciousness", "Gene Editing", "Climate Modeling", 
    "Renewable Energy", "Artificial Intelligence"
  ];
  
  const authors = [
    "Dr. Emma Roberts", "Prof. James Liu", "Dr. Sarah Johnson", 
    "Dr. Michael Chen", "Prof. Anita Patel", "Dr. David Kim"
  ];
  
  const randomTopic = topics[Math.floor(Math.random() * topics.length)];
  const randomAuthor = authors[Math.floor(Math.random() * authors.length)];
  
  const categories = ["physics", "mathematics", "biology", "chemistry", "psychology", "philosophy"];
  const randomCategory = categories[Math.floor(Math.random() * categories.length)];
  
  return {
    id: `research-${Date.now()}`,
    title: `Advances in ${randomTopic}: A New Perspective`,
    summary: `Recent research in ${randomTopic} shows promising results that could revolutionize our understanding of the field.`,
    author: randomAuthor,
    date: new Date(),
    views: Math.floor(Math.random() * 200) + 50,
    likes: Math.floor(Math.random() * 50) + 10,
    category: randomCategory,
  };
};

const Research = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastFetchTime, setLastFetchTime] = useState(new Date());
  const { toast } = useToast();
  
  // Simulated research data - in a real app, this would come from a database
  const [researchPapers, setResearchPapers] = useState([
    {
      id: '1',
      title: 'Quantum Computing Advances in Neural Networks',
      summary: 'Recent advances in quantum computing applied to neural networks show promising results for AI acceleration.',
      author: 'Dr. Emma Roberts',
      date: new Date('2025-03-15'),
      views: 342,
      likes: 78,
      category: 'physics',
      imageUrl: '/placeholder.svg',
    },
    {
      id: '2',
      title: 'Mathematical Models of Consciousness',
      summary: 'New mathematical frameworks to model aspects of consciousness and cognitive processes.',
      author: 'Prof. James Liu',
      date: new Date('2025-04-20'),
      views: 245,
      likes: 53,
      category: 'mathematics',
    },
    {
      id: '3',
      title: 'CRISPR Applications in Neurological Disorders',
      summary: 'Novel applications of CRISPR gene editing technology for treating complex neurological disorders.',
      author: 'Dr. Sarah Johnson',
      date: new Date('2025-05-01'),
      views: 189,
      likes: 41,
      category: 'biology',
    },
    {
      id: '4',
      title: 'Philosophical Implications of Artificial General Intelligence',
      summary: 'Exploring the philosophical questions raised by the development of artificial general intelligence.',
      author: 'Dr. Michael Chen',
      date: new Date('2025-04-10'),
      views: 278,
      likes: 62,
      category: 'philosophy',
    },
  ]);

  // Function to simulate fetching the latest research
  const fetchLatest = async () => {
    try {
      setIsLoading(true);
      const newResearch = await fetchLatestResearch();
      setResearchPapers(prev => [newResearch, ...prev]);
      setLastFetchTime(new Date());
      
      toast({
        title: "New Research Found!",
        description: `"${newResearch.title}" has been added to your feed.`,
        duration: 5000,
      });
    } catch (error) {
      toast({
        title: "Error Fetching Research",
        description: "Failed to fetch the latest research papers.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Simulate automatic hourly fetching
  useEffect(() => {
    // In a real app, this would be a proper scheduled task on the server
    // For this demo, we'll just simulate it with a shorter interval
    const fetchInterval = setInterval(() => {
      fetchLatest();
    }, 60000); // Set to 1 minute for demonstration purposes (would be hourly in prod)
    
    return () => clearInterval(fetchInterval);
  }, []);

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
              
              <div className="flex items-center gap-2">
                <div className="text-sm text-muted-foreground">
                  Last updated: {lastFetchTime.toLocaleTimeString()}
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={fetchLatest} 
                  disabled={isLoading}
                  className="flex items-center gap-1"
                >
                  <RotateCcw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
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
            
            <ResearchGrid 
              searchQuery={searchQuery}
              selectedCategory={selectedCategory}
              researchPapers={researchPapers}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Research;
