
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

const ProblemDetail = () => {
  const { problemId } = useParams<{ problemId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [problem, setProblem] = useState<any>(null);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<any[]>([]);
  
  useEffect(() => {
    // Find the problem by ID
    if (problemId) {
      const id = parseInt(problemId, 10);
      const foundProblem = problemsData.find(p => p.id === id);
      
      if (foundProblem) {
        setProblem(foundProblem);
        
        // For now, generate some sample comments
        // In a real application, these would come from a database
        setComments([
          {
            id: 1,
            author: "Researcher",
            authorAvatar: null,
            content: "This is a complex issue that requires international cooperation.",
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            upvotes: 5
          },
          {
            id: 2,
            author: "PolicyExpert",
            authorAvatar: null,
            content: "There are several promising approaches to addressing this problem that have been tested in various countries.",
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            upvotes: 3
          }
        ]);
      }
    }
  }, [problemId]);
  
  const handleBack = () => {
    navigate('/problems');
  };
  
  const handleCommentSubmit = () => {
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
    
    // Add the new comment
    const newComment = {
      id: comments.length + 1,
      author: user.name || user.email || "Anonymous",
      authorAvatar: user.avatar_url,
      content: comment,
      createdAt: new Date(),
      upvotes: 0
    };
    
    setComments([newComment, ...comments]);
    setComment('');
    
    toast({
      description: "Your input has been added to the discussion.",
    });
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
                disabled={!comment.trim()}
              >
                Post Contribution
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Comments list */}
        <div className="space-y-4">
          {comments.map((item) => (
            <Card key={item.id}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <Avatar>
                    <AvatarImage src={item.authorAvatar} />
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
          ))}
        </div>
      </div>
    </PageLayout>
  );
};

export default ProblemDetail;
