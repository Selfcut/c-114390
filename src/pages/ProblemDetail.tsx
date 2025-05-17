
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageLayout } from '@/components/layouts/PageLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { problemsData } from '@/data/problemsData';
import { supabase } from '@/integrations/supabase/client';

// Import our new components
import { ProblemDetailCard } from '@/components/problems/ProblemDetailCard';
import { CommentForm } from '@/components/problems/CommentForm';
import { CommentsList } from '@/components/problems/CommentsList';
import { ProblemNotFound } from '@/components/problems/ProblemNotFound';

interface Comment {
  id: string;
  author: string;
  authorAvatar?: string | null;
  authorId: string;
  content: string;
  createdAt: Date;
  upvotes: number;
}

const ProblemDetail = () => {
  const { problemId } = useParams<{ problemId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [problem, setProblem] = useState<any>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Find the problem by ID
    if (problemId) {
      const id = parseInt(problemId, 10);
      const foundProblem = problemsData.find(p => p.id === id);
      
      if (foundProblem) {
        setProblem(foundProblem);
        
        // Fetch real discussion comments from the forum_posts table that are related to this problem
        const fetchComments = async () => {
          try {
            setIsLoading(true);
            
            // Get forum posts that are specifically about this problem
            // Fixed query to properly fetch posts with profile information
            const { data, error } = await supabase
              .from('forum_posts')
              .select(`
                id,
                title,
                content,
                tags,
                upvotes,
                created_at,
                user_id
              `)
              .like('tags', `%Problem ${id}%`)
              .order('created_at', { ascending: false });
              
            if (error) {
              console.error('Error fetching comments:', error);
              return;
            }
            
            if (data) {
              // Fetch profiles separately for better type safety
              const userIds = data.map(post => post.user_id);
              
              // Get profiles for these users
              const { data: profilesData, error: profilesError } = await supabase
                .from('profiles')
                .select('id, name, username, avatar_url')
                .in('id', userIds);
                
              if (profilesError) {
                console.error('Error fetching profiles:', profilesError);
              }
              
              // Create a map of user_id to profile data for easy lookup
              const profilesMap = (profilesData || []).reduce((acc: Record<string, any>, profile) => {
                acc[profile.id] = profile;
                return acc;
              }, {});
              
              // Format the comments with profile data from the map
              const formattedComments: Comment[] = data.map(post => {
                const profile = profilesMap[post.user_id] || {};
                
                return {
                  id: post.id,
                  content: post.content,
                  author: profile.name || profile.username || 'Unknown User',
                  authorAvatar: profile.avatar_url,
                  authorId: post.user_id,
                  createdAt: new Date(post.created_at),
                  upvotes: post.upvotes || 0
                };
              });
              
              setComments(formattedComments);
            }
          } catch (err) {
            console.error('Error fetching comments:', err);
          } finally {
            setIsLoading(false);
          }
        };
        
        fetchComments();
      }
    }
  }, [problemId]);
  
  const handleBack = () => {
    navigate('/problems');
  };

  const handleCommentAdded = (newComment: Comment) => {
    setComments(prev => [newComment, ...prev]);
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
              onCommentAdded={handleCommentAdded}
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
