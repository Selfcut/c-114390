
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ResearchItem, mapResearchPaperToItem } from "@/components/research/types";
import { ResearchPaper } from "@/lib/supabase-types";

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
    
    // If no data is found, return empty array
    if (!data || data.length === 0) {
      return [];
    }
    
    // Transform Supabase data to match ResearchItem interface
    return data.map(mapResearchPaperToItem);
  } catch (error) {
    console.error('Error in fetchResearchPapers:', error);
    return [];
  }
};

export const useResearchData = (searchQuery: string, selectedCategory: string | null) => {
  const [lastUpdateTime, setLastUpdateTime] = useState<Date>(new Date());
  
  const { data: researchPapers = [], isLoading, error, refetch } = useQuery({
    queryKey: ['research-papers', searchQuery, selectedCategory],
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
