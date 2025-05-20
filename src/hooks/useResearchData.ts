
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ResearchItem, mapResearchPaperToItem } from "@/components/research/types";
import { ResearchPaper } from "@/lib/supabase-types";

// Function to fetch real research papers from Supabase
const fetchResearchPapers = async (): Promise<ResearchItem[]> => {
  try {
    const { data, error } = await supabase
      .from('research_papers')
      .select('*')
      .order('published_date', { ascending: false });
    
    if (error) {
      console.error('Error fetching research papers:', error);
      throw error;
    }
    
    // If no data is found, return empty array
    if (!data || data.length === 0) {
      console.log('No research papers found. The hourly cron job should fetch them.');
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
    queryKey: ['research-papers'],
    queryFn: fetchResearchPapers,
    refetchInterval: 5 * 60 * 1000, // Auto-refresh every 5 minutes (more frequent for user experience)
    staleTime: 60 * 60 * 1000, // Data becomes stale after 1 hour
    refetchOnWindowFocus: true
  });
  
  // Update lastUpdateTime whenever data is successfully fetched
  useEffect(() => {
    if (researchPapers.length > 0) {
      setLastUpdateTime(new Date());
    }
  }, [researchPapers]);
  
  // Filter research items based on search query and selected category
  const filteredPapers = useMemo(() => {
    return researchPapers.filter(item => {
      const matchesSearch = searchQuery 
        ? item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
          item.summary.toLowerCase().includes(searchQuery.toLowerCase())
        : true;
      
      const matchesCategory = selectedCategory 
        ? item.category === selectedCategory
        : true;
      
      return matchesSearch && matchesCategory;
    });
  }, [researchPapers, searchQuery, selectedCategory]);
  
  return {
    researchPapers: filteredPapers,
    isLoading,
    error,
    refetch,
    lastUpdateTime
  };
};
