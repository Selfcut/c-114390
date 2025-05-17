
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageLayout } from '@/components/layouts/PageLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { problemsData } from '@/data/problemsData';

// Import our components
import { ProblemDetailCard } from '@/components/problems/ProblemDetailCard';
import { CommentForm } from '@/components/problems/CommentForm';
import { CommentsList } from '@/components/problems/CommentsList';
import { ProblemNotFound } from '@/components/problems/ProblemNotFound';
import { useComments } from '@/hooks/problems/useComments';

const ProblemDetail = () => {
  const { problemId } = useParams<{ problemId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [problem, setProblem] = useState<any>(null);
  
  // Use our custom hook for comments
  const { comments, isLoading, addComment } = useComments({
    problemId: problemId ? parseInt(problemId, 10) : 0,
    enabled: !!problemId
  });
  
  useEffect(() => {
    // Find the problem by ID
    if (problemId) {
      const id = parseInt(problemId, 10);
      const foundProblem = problemsData.find(p => p.id === id);
      
      if (foundProblem) {
        setProblem(foundProblem);
      }
    }
  }, [problemId]);
  
  const handleBack = () => {
    navigate('/problems');
  };

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
            <CommentForm
              problemId={problem.id}
              problemTitle={problem.title}
              problemCategories={problem.categories}
              onCommentAdded={addComment}
            />
            
            {/* Comments list */}
            <CommentsList 
              comments={comments}
              isLoading={isLoading}
              userAuthenticated={!!user}
            />
          </>
        )}
      </div>
    </PageLayout>
  );
};

export default ProblemDetail;
