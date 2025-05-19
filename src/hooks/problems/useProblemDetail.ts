
import { useState, useEffect } from 'react';
import { getProblemByIdFromData } from '@/data/problemsData';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ProblemStats {
  discussionCount: number;
  solutionCount: number;
}

export const useProblemDetail = (problemId: string | undefined) => {
  const [problem, setProblem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();
  const [problemStats, setProblemStats] = useState<ProblemStats>({
    discussionCount: 0,
    solutionCount: 0
  });

  useEffect(() => {
    const fetchProblemData = async () => {
      if (!problemId) return;
      
      setLoading(true);
      setError(null);
      try {
        const id = parseInt(problemId, 10);
        
        // Get problem from our local data
        const foundProblem = getProblemByIdFromData(id);
        
        if (foundProblem) {
          setProblem(foundProblem);
          
          // Get real statistics from Supabase
          try {
            // Get count of forum posts related to this problem
            const { data, error } = await supabase
              .from('forum_posts')
              .select('id, tags')
              .contains('tags', [`Problem ${id}`]);
            
            if (error) throw error;
            
            // Count discussions and solutions
            let discussionCount = 0;
            let solutionCount = 0;
            
            if (data && data.length > 0) {
              discussionCount = data.length;
              
              // Count posts that have both the problem tag and solution tag
              solutionCount = data.filter(post => 
                post.tags && post.tags.includes('solution')
              ).length;
            }
            
            setProblemStats({
              discussionCount,
              solutionCount
            });
          } catch (statsError) {
            console.error("Error fetching problem statistics:", statsError);
            // Don't show an error toast for stats errors
          }
        } else {
          const notFoundError = new Error("Problem not found");
          setError(notFoundError);
          toast({
            title: "Problem not found",
            description: "The problem you're looking for doesn't exist",
            variant: "destructive"
          });
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error loading problem';
        const problemError = err instanceof Error ? err : new Error(errorMessage);
        setError(problemError);
        console.error("Error loading problem:", err);
        toast({
          title: "Error",
          description: "Failed to load problem details",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchProblemData();
  }, [problemId, toast]);

  return { problem, loading, error, problemStats };
};
