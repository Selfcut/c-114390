import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, AlertCircle, RefreshCw } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';

// Import components
import { ProblemDetailCard } from '@/components/problems/ProblemDetailCard';
import { CommentForm } from '@/components/problems/CommentForm';
import { CommentsList } from '@/components/problems/CommentsList';
import { ProblemNotFound } from '@/components/problems/ProblemNotFound';
import { ResourceLinks } from '@/components/problems/ResourceLinks';
import { ProblemDetailSkeleton } from '@/components/problems/ProblemDetailSkeleton';
import { Card, CardContent } from '@/components/ui/card';

// Import hooks
import { useProblemDetail } from '@/hooks/problems/useProblemDetail';
import { useComments } from '@/hooks/problems/useComments';

const ProblemDetail = () => {
  const { problemId } = useParams<{ problemId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Use our custom hook for problem details
  const { 
    problem, 
    loading, 
    error, 
    problemStats 
  } = useProblemDetail(problemId);
  
  // Use our custom hook for comments
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
  
  return (
    <div className="container mx-auto py-8 px-4">
      <Button variant="ghost" className="mb-6" onClick={handleBack}>
        <ArrowLeft size={16} className="mr-2" />
        Back to Problems Directory
      </Button>
      
      {loading ? (
        <ProblemDetailSkeleton />
      ) : error || !problem ? (
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
  );
};

export default ProblemDetail;
