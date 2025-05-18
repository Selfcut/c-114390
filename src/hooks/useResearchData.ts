
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ResearchItem {
  id: string;
  title: string;
  summary: string;
  author: string;
  date: Date;
  views: number;
  likes: number;
  category: string;
  imageUrl?: string;
}

// Function to fetch real research papers from Supabase
const fetchResearchPapers = async (): Promise<ResearchItem[]> => {
  try {
    const { data, error } = await supabase
      .from('research_papers')
      .select('*');
    
    if (error) {
      console.error('Error fetching research papers:', error);
      throw error;
    }
    
    // If no data is found, fall back to generated data for demo purposes
    if (!data || data.length === 0) {
      return generateDemoResearchPapers();
    }
    
    // Transform Supabase data to match ResearchItem interface
    return data.map(item => ({
      id: item.id,
      title: item.title,
      summary: item.summary || 'No summary available',
      author: item.author || 'Unknown Author',
      date: new Date(item.created_at),
      views: item.views || 0,
      likes: item.likes || 0,
      category: item.category || 'general',
      imageUrl: item.image_url
    }));
  } catch (error) {
    console.error('Error in fetchResearchPapers:', error);
    // Fall back to generated data if there's an error
    return generateDemoResearchPapers();
  }
};

// Generate demo research papers for illustration (only used if real data cannot be fetched)
const generateDemoResearchPapers = (): ResearchItem[] => {
  const topics = [
    "Quantum Computing", "Neural Networks", "Dark Matter", 
    "Consciousness", "Gene Editing", "Climate Modeling", 
    "Renewable Energy", "Artificial Intelligence"
  ];
  
  const authors = [
    "Dr. Emma Roberts", "Prof. James Liu", "Dr. Sarah Johnson", 
    "Dr. Michael Chen", "Prof. Anita Patel", "Dr. David Kim"
  ];
  
  const categories = ["physics", "mathematics", "biology", "chemistry", "psychology", "philosophy"];
  const papers: ResearchItem[] = [];
  
  // Add some consistent papers
  papers.push({
    id: '1',
    title: 'Quantum Computing Advances in Neural Networks',
    summary: 'Recent advances in quantum computing applied to neural networks show promising results for AI acceleration.',
    author: 'Dr. Emma Roberts',
    date: new Date('2025-03-15'),
    views: 342,
    likes: 78,
    category: 'physics',
    imageUrl: '/placeholder.svg',
  });
  
  papers.push({
    id: '2',
    title: 'Mathematical Models of Consciousness',
    summary: 'New mathematical frameworks to model aspects of consciousness and cognitive processes.',
    author: 'Prof. James Liu',
    date: new Date('2025-04-20'),
    views: 245,
    likes: 53,
    category: 'mathematics',
  });
  
  // Generate some random papers
  for (let i = 3; i < 10; i++) {
    const randomTopic = topics[Math.floor(Math.random() * topics.length)];
    const randomAuthor = authors[Math.floor(Math.random() * authors.length)];
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    
    papers.push({
      id: `${i}`,
      title: `Advances in ${randomTopic}: A New Perspective`,
      summary: `Recent research in ${randomTopic} shows promising results that could revolutionize our understanding of the field.`,
      author: randomAuthor,
      date: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000), // Random date within last 30 days
      views: Math.floor(Math.random() * 200) + 50,
      likes: Math.floor(Math.random() * 50) + 10,
      category: randomCategory,
    });
  }
  
  return papers;
};

export const useResearchData = (searchQuery: string, selectedCategory: string | null) => {
  const [lastUpdateTime, setLastUpdateTime] = useState<Date>(new Date());
  
  const { data: researchPapers = [], isLoading, error, refetch } = useQuery({
    queryKey: ['research-papers'],
    queryFn: fetchResearchPapers,
    refetchInterval: 60 * 60 * 1000, // Auto-refresh every hour
    refetchOnWindowFocus: false
  });
  
  // Update lastUpdateTime whenever data is successfully fetched
  useEffect(() => {
    if (researchPapers.length > 0) {
      setLastUpdateTime(new Date());
    }
  }, [researchPapers]);
  
  // Filter research items based on search query and selected category
  const filteredPapers = researchPapers.filter(item => {
    const matchesSearch = searchQuery 
      ? item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.summary.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    
    const matchesCategory = selectedCategory 
      ? item.category === selectedCategory
      : true;
    
    return matchesSearch && matchesCategory;
  });
  
  return {
    researchPapers: filteredPapers,
    isLoading,
    error,
    refetch,
    lastUpdateTime
  };
};
