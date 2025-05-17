
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
  
  // Fetch discussion and solution counts for each problem
  useEffect(() => {
    const fetchProblemStats = async () => {
      try {
        // We'll get the stats for each problem from the forum_posts table
        const problems = problemsData.map(p => p.id);
        const stats: Record<number, { discussions: number, solutions: number }> = {};
        
        // Initialize with zeros
        problems.forEach(id => {
          stats[id] = { discussions: 0, solutions: 0 };
        });
        
        // Try to get real statistics from Supabase for each problem
        for (const problemId of problems) {
          // Get count of forum posts related to this problem
          const { count: discussionCount, error: countError } = await supabase
            .from('forum_posts')
            .select('*', { count: 'exact', head: true })
            .like('tags', `%Problem ${problemId}%`);
          
          if (!countError && discussionCount !== null) {
            stats[problemId].discussions = discussionCount;
          }
          
          // Get count of solutions (posts with "solution" tag)
          const { count: solutionCount, error: solutionError } = await supabase
            .from('forum_posts')
            .select('*', { count: 'exact', head: true })
            .like('tags', `%Problem ${problemId}%`)
            .like('tags', '%solution%');
          
          if (!solutionError && solutionCount !== null) {
            stats[problemId].solutions = solutionCount;
          }
        }
        
        setProblemStats(stats);
      } catch (error) {
        console.error("Error fetching problem statistics:", error);
        toast({
          title: "Error",
          description: "Failed to load discussion counts",
          variant: "destructive"
        });
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
        />
      </div>
    </PageLayout>
  );
};

export default Problems;
