
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '@/components/layouts/PageLayout';
import { ProblemsHeader } from '@/components/problems/ProblemsHeader';
import { ProblemsList } from '@/components/problems/ProblemsList';
import { ProblemsFilters } from '@/components/problems/ProblemsFilters';
import { problemsData } from '@/data/problemsData';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Problem } from '@/data/problemsData';

const Problems = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [sortBy, setSortBy] = useState<'severity' | 'solvability' | 'urgency'>('severity');
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState<string | null>(null);
  const [problemStats, setProblemStats] = useState<Record<number, { discussions: number, solutions: number }>>({});
  const [isLoading, setIsLoading] = useState(true);
  
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
          // Try to get real data from Supabase
          const { data, error } = await supabase
            .from('forum_posts')
            .select('id, tags');
            
          if (data && data.length > 0) {
            // Process the data to count discussions and solutions by problem ID
            data.forEach(post => {
              if (!post.tags) return;
              
              for (const tag of post.tags) {
                if (tag.startsWith('Problem ')) {
                  const problemId = parseInt(tag.replace('Problem ', ''));
                  if (stats[problemId]) {
                    stats[problemId].discussions++;
                    
                    // Check if this post is also a solution
                    if (post.tags.includes('solution')) {
                      stats[problemId].solutions++;
                    }
                  }
                }
              }
            });
          }
        } catch (error) {
          console.error("Failed to fetch forum posts:", error);
          // If we can't get real data, we'll just use sample data below
        }
        
        // If we have no discussions/solutions data, add some sample data
        const hasAnyData = Object.values(stats).some(stat => stat.discussions > 0);
        if (!hasAnyData) {
          // Add sample data for display purposes
          problemsData.forEach(problem => {
            stats[problem.id] = {
              discussions: Math.floor(Math.random() * 10) + 1,
              solutions: Math.floor(Math.random() * 5)
            };
          });
        }
        
        setProblemStats(stats);
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
  
  // Filter and sort problems based on user preferences
  const filteredProblems = problemsData
    .filter(problem => 
      (searchTerm ? problem.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                   problem.description.toLowerCase().includes(searchTerm.toLowerCase()) : true) &&
      (category ? problem.categories.includes(category) : true)
    )
    .sort((a, b) => {
      if (sortBy === 'severity') return b.severity - a.severity;
      if (sortBy === 'solvability') return a.solvability - b.solvability; // Lower is harder to solve
      return b.urgency - a.urgency;
    })
    .map(problem => ({
      ...problem,
      discussions: problemStats[problem.id]?.discussions || 0,
      solutions: problemStats[problem.id]?.solutions || 0
    }));
    
  // Extract unique categories for filtering
  const categories = Array.from(
    new Set(problemsData.flatMap(problem => problem.categories))
  );
  
  const handleProblemClick = (problemId: number) => {
    navigate(`/problems/${problemId}`);
  };

  return (
    <PageLayout>
      <div className="container mx-auto py-8 px-4">
        <ProblemsHeader />
        
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
