
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageLayout } from '@/components/layouts/PageLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, AlertCircle, RefreshCw } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { problemsData, getProblemById } from '@/data/problemsData';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Import our components
import { ProblemDetailCard } from '@/components/problems/ProblemDetailCard';
import { CommentForm } from '@/components/problems/CommentForm';
import { CommentsList } from '@/components/problems/CommentsList';
import { ProblemNotFound } from '@/components/problems/ProblemNotFound';
import { ResourceLinks } from '@/components/problems/ResourceLinks';
import { useComments } from '@/hooks/problems/useComments';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface ProblemStats {
  discussionCount: number;
  solutionCount: number;
}

const ProblemDetail = () => {
  const { problemId } = useParams<{ problemId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [problem, setProblem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [problemStats, setProblemStats] = useState<ProblemStats>({
    discussionCount: 0,
    solutionCount: 0
  });
  
  // Use our custom hook for comments with the fixed query
  const { 
    comments, 
    isLoading: commentsLoading, 
    isRefreshing: commentsRefreshing,
    error: commentsError, 
    addComment,
    refreshComments 
  } = useComments({
    problemId: problemId ? parseInt(problemId, 10) : 0,
    enabled: !!problemId && !!problem
  });

  // Fetch problem info
  useEffect(() => {
    // Find the problem by ID
    const fetchProblemData = async () => {
      if (!problemId) return;
      
      setLoading(true);
      setError(null);
      try {
        const id = parseInt(problemId, 10);
        
        // Get problem from our local data
        const foundProblem = getProblemById(id);
        
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
          // Give user time to see the error message before redirecting
          setTimeout(() => navigate('/problems'), 3000);
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
  }, [problemId, toast, navigate]);
  
  const handleBack = () => {
    navigate('/problems');
  };
  
  const handleRefreshComments = () => {
    refreshComments();
    toast({
      title: "Refreshing comments",
      description: "Comments are being refreshed"
    });
  };

  if (commentsError) {
    console.error('Error loading comments:', commentsError);
  }
  
  if (loading) {
    return (
      <PageLayout>
        <div className="container mx-auto py-8 px-4">
          <Button variant="ghost" className="mb-6" onClick={handleBack}>
            <ArrowLeft size={16} className="mr-2" />
            Back to Problems Directory
          </Button>
          
          {/* Skeleton UI */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-3/4">
                    <Skeleton className="h-8 w-1/2 mb-2" />
                    <Skeleton className="h-5 w-full" />
                  </div>
                  <Skeleton className="h-10 w-24" />
                </div>
                <div className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
                <div className="flex gap-2 mt-4">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-16" />
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-between items-center mb-4">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-10 w-24" />
            </div>
            
            {Array(2).fill(0).map((_, index) => (
              <Card key={`comment-skeleton-${index}`}>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1">
                      <div className="flex justify-between mb-2">
                        <Skeleton className="h-5 w-24" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                      <Skeleton className="h-4 w-full mb-1" />
                      <Skeleton className="h-4 w-full mb-1" />
                      <Skeleton className="h-4 w-2/3 mb-3" />
                      <div className="flex gap-2">
                        <Skeleton className="h-8 w-16" />
                        <Skeleton className="h-8 w-16" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </PageLayout>
    );
  }

  if (error && !problem) {
    return (
      <PageLayout>
        <div className="container mx-auto py-8 px-4">
          <Button variant="ghost" className="mb-6" onClick={handleBack}>
            <ArrowLeft size={16} className="mr-2" />
            Back to Problems Directory
          </Button>
          <ProblemNotFound onBackClick={handleBack} />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="container mx-auto py-8 px-4">
        <Button variant="ghost" className="mb-6" onClick={handleBack}>
          <ArrowLeft size={16} className="mr-2" />
          Back to Problems Directory
        </Button>
        
        {!problem ? (
          <ProblemNotFound onBackClick={handleBack} />
        ) : (
          <>
            <ProblemDetailCard 
              problem={{
                ...problem,
                discussions: problemStats.discussionCount,
                solutions: problemStats.solutionCount
              }}
              commentsCount={comments.length} 
            />
            
            {/* Resource Links */}
            {problem.resourceLinks && (
              <ResourceLinks resources={problem.resourceLinks} />
            )}
            
            {/* Discussion Section */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Discussion</h2>
              
              {/* Add refresh button for comments */}
              {comments.length > 0 && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleRefreshComments}
                  disabled={commentsRefreshing}
                >
                  <RefreshCw size={14} className={`mr-1 ${commentsRefreshing ? 'animate-spin' : ''}`} /> 
                  {commentsRefreshing ? 'Refreshing...' : 'Refresh'}
                </Button>
              )}
            </div>
            
            {/* Add comment form */}
            {user ? (
              <CommentForm
                problemId={problem.id}
                problemTitle={problem.title}
                problemCategories={problem.categories}
                onCommentAdded={addComment}
              />
            ) : (
              <Card className="mb-8">
                <CardContent className="p-6 flex flex-col items-center justify-center">
                  <AlertCircle className="text-amber-500 mb-2" size={24} />
                  <h3 className="font-medium mb-1">Authentication Required</h3>
                  <p className="text-muted-foreground text-center mb-4">
                    Please sign in to contribute to the discussion
                  </p>
                  <Button onClick={() => navigate('/auth')}>
                    Sign In
                  </Button>
                </CardContent>
              </Card>
            )}
            
            {/* Comments list with refreshing capability */}
            <CommentsList 
              comments={comments}
              isLoading={commentsLoading}
              isRefreshing={commentsRefreshing}
              userAuthenticated={!!user}
              onRefresh={handleRefreshComments}
              error={commentsError}
            />
          </>
        )}
      </div>
    </PageLayout>
  );
};

export default ProblemDetail;
