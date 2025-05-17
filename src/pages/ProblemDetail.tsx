
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageLayout } from '@/components/layouts/PageLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, MessageSquare, ThumbsUp, Share, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { problemsData } from '@/data/problemsData';
import { supabase } from '@/integrations/supabase/client';

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
  const { toast } = useToast();
  const [problem, setProblem] = useState<any>(null);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  
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
            // Modifying the query to correctly fetch the profile data
            const { data, error } = await supabase
              .from('forum_posts')
              .select(`
                id,
                title,
                content,
                tags,
                upvotes,
                created_at,
                user_id,
                user_id (
                  profiles (name, username, avatar_url)
                )
              `)
              .like('tags', `%Problem ${id}%`)
              .order('created_at', { ascending: false });
              
            if (error) {
              console.error('Error fetching comments:', error);
              toast({
                title: "Error",
                description: "Failed to load comments",
                variant: "destructive"
              });
              return;
            }
            
            if (data) {
              // Process the data to extract profile info correctly
              const formattedComments: Comment[] = data.map(post => {
                const profile = post.user_id?.profiles || {};
                
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
  }, [problemId, toast]);
  
  const handleBack = () => {
    navigate('/problems');
  };
  
  const handleCommentSubmit = async () => {
    if (!comment.trim()) {
      toast({
        description: "Please write something before posting.",
        variant: "destructive"
      });
      return;
    }
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to join the discussion.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmittingComment(true);
    
    try {
      // Create a new forum post connected to this problem
      const newPost = {
        title: `Contribution to Problem #${problem.id}: ${problem.title}`,
        content: comment.trim(),
        user_id: user.id,
        tags: [`Problem ${problem.id}`, ...problem.categories.slice(0, 2)],
        is_pinned: false,
      };
      
      // Insert into real database
      const { data, error } = await supabase
        .from('forum_posts')
        .insert(newPost)
        .select();
      
      if (error) {
        throw error;
      }
      
      // Fetch the user profile for the newly created post
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('name, username, avatar_url')
        .eq('id', user.id)
        .single();
        
      if (profileError) {
        console.error('Error fetching user profile:', profileError);
      }
      
      // Add to local comments state
      const newComment: Comment = {
        id: data?.[0]?.id || '',
        content: comment.trim(),
        author: profileData?.name || profileData?.username || user.name || user.email || 'Anonymous',
        authorAvatar: profileData?.avatar_url || user.avatar_url,
        authorId: user.id,
        createdAt: new Date(),
        upvotes: 0
      };
      
      setComments(prev => [newComment, ...prev]);
      setComment('');
      
      toast({
        description: "Your input has been added to the discussion.",
      });
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: "Error",
        description: "Failed to add your comment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmittingComment(false);
    }
  };
  
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  if (!problem) {
    return (
      <PageLayout>
        <div className="container mx-auto py-8 px-4">
          <Button variant="ghost" className="mb-6" onClick={handleBack}>
            <ArrowLeft size={16} className="mr-2" />
            Back to Problems Directory
          </Button>
          
          <Card className="p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-muted p-4">
                <AlertTriangle size={32} className="text-muted-foreground" />
              </div>
            </div>
            <h3 className="text-xl font-medium mb-2">Problem Not Found</h3>
            <p className="text-muted-foreground mb-4">The problem you're looking for doesn't exist or has been removed</p>
            <Button onClick={handleBack}>Return to Problems Directory</Button>
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
        
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <AlertTriangle size={20} className="text-amber-500" />
                  <Badge>{problem.categories[0]}</Badge>
                </div>
                <CardTitle className="text-3xl mb-2">{problem.title}</CardTitle>
                <CardDescription className="text-lg">
                  Severity: {problem.severity}/10 | Urgency: {problem.urgency}/10 | 
                  Solvability: {problem.solvability}/10 (lower is harder to solve)
                </CardDescription>
              </div>
              
              <Button variant="outline" size="sm">
                <Share size={16} className="mr-2" />
                Share
              </Button>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-lg mb-4">{problem.description}</p>
              
              {problem.longDescription && (
                <p>{problem.longDescription}</p>
              )}
              
              {problem.impact && (
                <>
                  <h3 className="text-xl font-semibold mt-6 mb-2">Impact</h3>
                  <p>{problem.impact}</p>
                </>
              )}
              
              {problem.challenges && (
                <>
                  <h3 className="text-xl font-semibold mt-6 mb-2">Challenges</h3>
                  <p>{problem.challenges}</p>
                </>
              )}
              
              {problem.potentialSolutions && (
                <>
                  <h3 className="text-xl font-semibold mt-6 mb-2">Potential Solutions</h3>
                  <p>{problem.potentialSolutions}</p>
                </>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2 mt-6">
              {problem.categories.map((category: string, index: number) => (
                <Badge key={index} variant="secondary">{category}</Badge>
              ))}
            </div>
          </CardContent>
          
          <CardFooter className="border-t pt-4">
            <div className="w-full">
              <div className="text-sm text-muted-foreground mb-4">
                Join the discussion to explore solutions to this global challenge.
              </div>
              
              <div className="flex items-center gap-2">
                <MessageSquare size={16} />
                <span>{comments.length} contributions</span>
                
                <span className="mx-2">•</span>
                
                <ThumbsUp size={16} />
                <span>0 endorsements</span>
              </div>
            </div>
          </CardFooter>
        </Card>
        
        {/* Discussion Section */}
        <h2 className="text-2xl font-bold mb-4">Discussion</h2>
        
        {/* Add comment form */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <h3 className="font-medium mb-2">Contribute your insights</h3>
            <Textarea
              placeholder="Share your thoughts or potential solutions..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-[120px] mb-4"
            />
            <div className="flex justify-end">
              <Button 
                onClick={handleCommentSubmit}
                disabled={!comment.trim() || isSubmittingComment}
              >
                {isSubmittingComment ? "Posting..." : "Post Contribution"}
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Comments list */}
        <div className="space-y-4">
          {isLoading ? (
            Array(2).fill(0).map((_, index) => (
              <Card key={`skeleton-${index}`} className="animate-pulse">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-muted h-10 w-10"></div>
                    <div className="flex-1">
                      <div className="h-5 bg-muted rounded w-1/4 mb-2"></div>
                      <div className="h-4 bg-muted rounded w-32 mb-4"></div>
                      <div className="h-4 bg-muted rounded w-full mb-2"></div>
                      <div className="h-4 bg-muted rounded w-5/6 mb-2"></div>
                      <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
                      <div className="flex items-center gap-2">
                        <div className="h-8 bg-muted rounded w-16"></div>
                        <div className="h-8 bg-muted rounded w-16"></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : comments.length > 0 ? (
            comments.map((item) => (
              <Card key={item.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <Avatar>
                      <AvatarImage src={item.authorAvatar || undefined} />
                      <AvatarFallback>{item.author.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium">{item.author}</h4>
                        <span className="text-sm text-muted-foreground">
                          {formatDate(item.createdAt)}
                        </span>
                      </div>
                      <p className="mb-4">{item.content}</p>
                      <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" className="flex items-center gap-1">
                          <ThumbsUp size={14} />
                          <span>{item.upvotes}</span>
                        </Button>
                        <Button variant="ghost" size="sm">Reply</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="p-8 text-center">
              <div className="flex justify-center mb-4">
                <div className="rounded-full bg-muted p-4">
                  <MessageSquare size={32} className="text-muted-foreground" />
                </div>
              </div>
              <h3 className="text-xl font-medium mb-2">No Comments Yet</h3>
              <p className="text-muted-foreground mb-4">Be the first to share your thoughts</p>
              {!user && (
                <Button asChild>
                  <a href="/auth">Sign In to Comment</a>
                </Button>
              )}
            </Card>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default ProblemDetail;
