
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageLayout } from '@/components/layouts/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { MessageSquare, ThumbsUp, Tag, Clock, ArrowLeft, Eye, Send } from 'lucide-react';
import { useAuth } from '@/lib/auth';

interface Comment {
  id: string;
  content: string;
  author: string;
  authorAvatar?: string;
  createdAt: Date;
  isAuthor: boolean;
}

const ForumPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [discussion, setDiscussion] = useState<any>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Load post data
  useEffect(() => {
    const fetchDiscussion = async () => {
      setIsLoading(true);
      try {
        // For now, use simulated data
        // In production, this would be a database query
        setTimeout(() => {
          const simulatedDiscussion = {
            id,
            title: "The Relationship Between Consciousness and Quantum Mechanics",
            content: "Recent theories in quantum physics suggest consciousness might play a role in quantum wave function collapse. What are your thoughts on this intersection? This discussion aims to explore how observer effects in quantum mechanics might relate to theories of consciousness.\n\nSome interesting points to consider:\n- The measurement problem in quantum mechanics\n- Observer-dependent reality\n- Potential links to panpsychism\n- Implications for free will\n\nI'd love to hear perspectives from both physicists and philosophers on this topic.",
            author: "QuantumThinker",
            authorId: "user-123",
            authorAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=QuantumThinker`,
            createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
            tags: ["quantum-physics", "consciousness", "philosophy"],
            upvotes: 24,
            views: 142,
            comments: 8,
            isPinned: true
          };
          
          setDiscussion(simulatedDiscussion);
          
          // Simulated comments
          const simulatedComments = [
            {
              id: "c1",
              content: "I think this connection is often overstated. While there are interesting parallels, quantum decoherence can explain measurement without invoking consciousness.",
              author: "PhysicsProf",
              authorAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=PhysicsProf`,
              createdAt: new Date(Date.now() - 22 * 60 * 60 * 1000),
              isAuthor: false
            },
            {
              id: "c2",
              content: "The hard problem of consciousness and quantum measurement problem do seem to have interesting connections! Roger Penrose's theories on microtubules might be relevant here.",
              author: "ConsciousMind",
              authorAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=ConsciousMind`,
              createdAt: new Date(Date.now() - 18 * 60 * 60 * 1000),
              isAuthor: false
            },
            {
              id: "c3",
              content: "Thanks for the insights! I've been reading about the von Neumann–Wigner interpretation and it's fascinating how it places the observer at the center of quantum collapse.",
              author: "QuantumThinker",
              authorAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=QuantumThinker`,
              createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
              isAuthor: true
            }
          ];
          
          setComments(simulatedComments);
          setIsLoading(false);
        }, 800);
        
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load discussion",
          variant: "destructive"
        });
        setIsLoading(false);
      }
    };
    
    fetchDiscussion();
  }, [id, toast]);
  
  const handleSubmitComment = () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to comment",
        variant: "destructive"
      });
      return;
    }
    
    if (!newComment.trim()) {
      toast({
        title: "Empty Comment",
        description: "Please write something before posting",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate adding a comment
    setTimeout(() => {
      const newCommentObj = {
        id: `new-${Date.now()}`,
        content: newComment,
        author: user.username || user.name || "User",
        authorAvatar: user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`,
        createdAt: new Date(),
        isAuthor: false
      };
      
      setComments(prev => [newCommentObj, ...prev]);
      setNewComment('');
      setIsSubmitting(false);
      
      toast({
        title: "Comment Posted",
        description: "Your comment has been added to the discussion",
      });
      
    }, 500);
  };
  
  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    
    return "just now";
  };

  return (
    <PageLayout>
      <div className="container mx-auto py-8">
        <Button
          variant="ghost"
          className="mb-6 flex items-center gap-2"
          onClick={() => navigate('/forum')}
        >
          <ArrowLeft size={16} />
          Back to Forum
        </Button>
        
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-40 w-full" />
          </div>
        ) : discussion ? (
          <>
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-4">{discussion.title}</h1>
              
              <div className="flex items-center gap-4 mb-6">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={discussion.authorAvatar} alt={discussion.author} />
                  <AvatarFallback>{discussion.author.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                
                <div>
                  <p className="font-medium">{discussion.author}</p>
                  <p className="text-sm text-muted-foreground">
                    Posted {formatTimeAgo(discussion.createdAt)}
                  </p>
                </div>
              </div>
              
              <Card>
                <CardContent className="p-6">
                  <div className="prose prose-stone dark:prose-invert max-w-none">
                    {discussion.content.split('\n\n').map((paragraph: string, idx: number) => (
                      <p key={idx}>{paragraph}</p>
                    ))}
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-6">
                    {discussion.tags.map((tag: string) => (
                      <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                        <Tag size={12} />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Stats */}
            <div className="flex items-center gap-6 text-muted-foreground mb-6">
              <span className="flex items-center gap-1">
                <Eye size={18} /> {discussion.views} views
              </span>
              <span className="flex items-center gap-1">
                <MessageSquare size={18} /> {comments.length} replies
              </span>
              <span className="flex items-center gap-1">
                <ThumbsUp size={18} /> {discussion.upvotes} upvotes
              </span>
              <span className="flex items-center gap-1">
                <Clock size={18} /> {formatTimeAgo(discussion.createdAt)}
              </span>
            </div>
            
            {/* Add comment */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-lg">Join the Discussion</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Textarea
                    placeholder="Share your thoughts..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    disabled={!user || isSubmitting}
                    className="min-h-[120px]"
                  />
                  <div className="flex justify-end">
                    <Button 
                      onClick={handleSubmitComment}
                      disabled={!user || isSubmitting || !newComment.trim()}
                      className="flex items-center gap-2"
                    >
                      <Send size={16} />
                      {isSubmitting ? "Posting..." : "Post Reply"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Comments */}
            <h2 className="text-2xl font-semibold mb-4">Replies</h2>
            {comments.length > 0 ? (
              <div className="space-y-4">
                {comments.map((comment) => (
                  <Card key={comment.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={comment.authorAvatar} alt={comment.author} />
                          <AvatarFallback>{comment.author.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{comment.author}</span>
                              {comment.isAuthor && (
                                <Badge variant="outline" className="text-xs">Author</Badge>
                              )}
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {formatTimeAgo(comment.createdAt)}
                            </span>
                          </div>
                          
                          <p className="mt-2">{comment.content}</p>
                          
                          <div className="flex items-center gap-4 mt-4">
                            <Button variant="ghost" size="sm" className="text-muted-foreground flex items-center gap-1">
                              <ThumbsUp size={14} />
                              Like
                            </Button>
                            <Button variant="ghost" size="sm" className="text-muted-foreground flex items-center gap-1">
                              <MessageSquare size={14} />
                              Reply
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground">No replies yet. Be the first to respond!</p>
                </CardContent>
              </Card>
            )}
          </>
        ) : (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-red-500">Discussion not found or has been removed.</p>
              <Button 
                className="mt-4"
                onClick={() => navigate('/forum')}
              >
                Back to Forum
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </PageLayout>
  );
};

export default ForumPost;
