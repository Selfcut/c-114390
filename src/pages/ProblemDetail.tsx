
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageLayout } from '@/components/layouts/PageLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { problemsData } from '@/data/problemsData';
import { useToast } from '@/hooks/use-toast';

// Import our components
import { ProblemDetailCard } from '@/components/problems/ProblemDetailCard';
import { CommentForm } from '@/components/problems/CommentForm';
import { CommentsList } from '@/components/problems/CommentsList';
import { ProblemNotFound } from '@/components/problems/ProblemNotFound';
import { useComments } from '@/hooks/problems/useComments';
import { Card, CardContent } from '@/components/ui/card';

const ProblemDetail = () => {
  const { problemId } = useParams<{ problemId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [problem, setProblem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Use our custom hook for comments
  const { comments, isLoading: commentsLoading, error: commentsError, addComment } = useComments({
    problemId: problemId ? parseInt(problemId, 10) : 0,
    enabled: !!problemId && !!problem
  });
  
  useEffect(() => {
    // Find the problem by ID
    if (problemId) {
      setLoading(true);
      try {
        const id = parseInt(problemId, 10);
        const foundProblem = problemsData.find(p => p.id === id);
        
        if (foundProblem) {
          setProblem(foundProblem);
        } else {
          toast({
            title: "Problem not found",
            description: "The problem you're looking for doesn't exist",
            variant: "destructive"
          });
        }
      } catch (err) {
        console.error("Error loading problem:", err);
        toast({
          title: "Error",
          description: "Failed to load problem details",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    }
  }, [problemId, toast]);
  
  const handleBack = () => {
    navigate('/problems');
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
          <Card className="p-8">
            <CardContent className="flex flex-col items-center justify-center min-h-[300px]">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-muted-foreground">Loading problem details...</p>
            </CardContent>
          </Card>
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
              problem={problem} 
              commentsCount={comments.length} 
            />
            
            {/* Discussion Section */}
            <h2 className="text-2xl font-bold mb-4">Discussion</h2>
            
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
            
            {/* Comments list */}
            <CommentsList 
              comments={comments}
              isLoading={commentsLoading}
              userAuthenticated={!!user}
            />
          </>
        )}
      </div>
    </PageLayout>
  );
};

export default ProblemDetail;
