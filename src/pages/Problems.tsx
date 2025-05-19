
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '@/components/layouts/PageLayout';
import { ProblemsHeader } from '@/components/problems/ProblemsHeader';
import { ProblemsList } from '@/components/problems/ProblemsList';
import { ProblemsFilters } from '@/components/problems/ProblemsFilters';
import { DomainSelector } from '@/components/problems/DomainSelector';
import { 
  problemsData, 
  getProblemsByDomain, 
  getAvailableDomains,
  Problem 
} from '@/data/problemsData';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Problems = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [sortBy, setSortBy] = useState<'severity' | 'solvability' | 'urgency'>('severity');
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState<string | null>(null);
  const [domain, setDomain] = useState<Problem['domain']>('world');
  const [problemStats, setProblemStats] = useState<Record<number, { discussions: number, solutions: number }>>({});
  const [isLoading, setIsLoading] = useState(true);
  
  const availableDomains = getAvailableDomains();
  
  // Fetch discussion and solution counts for each problem
  useEffect(() => {
    const fetchProblemStats = async () => {
      try {
        setIsLoading(true);
        // Initialize stats with zeros
        const stats: Record<number, { discussions: number, solutions: number }> = {};
        problemsData.forEach(p => {
          stats[p.id] = { discussions: 0, solutions: 0 };
        });
        
        try {
          // Get actual data from Supabase - fetch all forum posts
          const { data, error } = await supabase
            .from('forum_posts')
            .select('id, tags');
            
          if (error) throw error;
            
          if (data && data.length > 0) {
            // Process the data to count discussions and solutions by problem ID
            data.forEach(post => {
              if (!post.tags) return;
              
              // Check each tag for problem references
              post.tags.forEach(tag => {
                const problemMatch = tag.match(/Problem (\d+)/);
                if (problemMatch) {
                  const problemId = parseInt(problemMatch[1], 10);
                  if (stats[problemId]) {
                    stats[problemId].discussions++;
                    
                    // Check if this post is also a solution
                    if (post.tags.includes('solution')) {
                      stats[problemId].solutions++;
                    }
                  }
                }
              });
            });
            
            // Set stats with the real data
            setProblemStats(stats);
            setIsLoading(false);
            return;
          }
        } catch (error) {
          console.error("Failed to fetch forum posts:", error);
          toast({
            title: "Error",
            description: "Failed to load discussion statistics",
            variant: "destructive"
          });
        }
        
        // If we reach here, we couldn't get real data
        setProblemStats(stats);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching problem statistics:", error);
        toast({
          title: "Error",
          description: "Failed to load discussion counts",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProblemStats();
  }, [toast]);
  
  // Filter and sort problems based on user preferences and selected domain
  const domainProblems = getProblemsByDomain(domain);
  
  const filteredProblems = domainProblems
    .filter(problem => 
      (searchTerm ? problem.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                   problem.description.toLowerCase().includes(searchTerm.toLowerCase()) : true) &&
      (category ? problem.categories.includes(category) : true)
    )
    .sort((a, b) => {
      // First sort by rank if available
      if (a.rank && b.rank) {
        return a.rank - b.rank;
      }
      // Then fall back to other sorting criteria
      if (sortBy === 'severity') return b.severity - a.severity;
      if (sortBy === 'solvability') return a.solvability - b.solvability; // Lower is harder to solve
      return b.urgency - a.urgency;
    })
    .map(problem => ({
      ...problem,
      discussions: problemStats[problem.id]?.discussions || 0,
      solutions: problemStats[problem.id]?.solutions || 0
    }));
    
  // Extract unique categories for filtering from the current domain's problems
  const categories = Array.from(
    new Set(domainProblems.flatMap(problem => problem.categories))
  );
  
  const handleProblemClick = (problemId: number) => {
    navigate(`/problems/${problemId}`);
  };

  const handleDomainChange = (newDomain: Problem['domain']) => {
    setDomain(newDomain);
    // Reset category filter when changing domains as categories might be different
    setCategory(null);
  };

  return (
    <PageLayout>
      <div className="container mx-auto py-8 px-4">
        <ProblemsHeader />
        
        <DomainSelector 
          currentDomain={domain}
          domains={availableDomains}
          onDomainChange={handleDomainChange}
        />
        
        <ProblemsFilters 
          sortBy={sortBy}
          setSortBy={setSortBy}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          category={category}
          setCategory={setCategory}
          categories={categories}
        />
        
        <ProblemsList 
          problems={filteredProblems} 
          onProblemClick={handleProblemClick}
          isLoading={isLoading}
        />
      </div>
    </PageLayout>
  );
};

export default Problems;
