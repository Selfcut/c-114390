
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft,
  MessageSquare,
  ThumbsUp,
  Calendar,
  Tag,
  Share,
  Flag,
  Bookmark,
  Send
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/auth';
import { formatDistanceToNow } from 'date-fns';

interface DiscussionComment {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  createdAt: Date;
  upvotes: number;
}

// Simulated post data for development
const simulatedPosts = [
  {
    id: "1",
    title: "The Relationship Between Consciousness and Quantum Mechanics",
    content: "Recent theories in quantum physics suggest consciousness might play a role in quantum wave function collapse. This intersection of physics and philosophy opens up fascinating questions about the nature of reality and our role as observers.\n\nSome researchers propose that consciousness might be an emergent property of quantum processes in the brain, while others argue that quantum mechanics itself might be incomplete without accounting for consciousness.\n\nWhat are your thoughts on these theories? Have you encountered any compelling evidence or arguments in either direction?",
    authorName: "QuantumThinker",
    authorId: "user-123",
    authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=QuantumThinker",
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    tags: ["quantum-physics", "consciousness", "philosophy"],
    upvotes: 24,
    views: 142,
    comments: 8,
    is_pinned: true
  },
  {
    id: "2",
    title: "Exploring Eastern Philosophy in Modern Context",
    content: "How can ancient Eastern philosophical concepts like non-attachment and mindfulness be meaningfully integrated into modern Western society? These concepts seem increasingly relevant to addressing contemporary problems like burnout, anxiety, and overconsumption.\n\nI've been studying both Buddhist and Taoist texts and finding remarkable similarities with modern psychological approaches to wellbeing. Yet there seems to be resistance to fully embracing these ideas in mainstream Western culture.\n\nDoes anyone have experience practicing Eastern philosophical principles in a Western context? What challenges or benefits have you found?",
    authorName: "PhilosophyExplorer",
    authorId: "user-456",
    authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=PhilosophyExplorer",
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    tags: ["eastern-philosophy", "mindfulness", "modern-society"],
    upvotes: 18,
    views: 97,
    comments: 12,
    is_pinned: false
  },
  {
    id: "3",
    title: "The Ethics of Artificial Intelligence Development",
    content: "As AI systems become more advanced, what ethical frameworks should guide their development and implementation? This question becomes increasingly urgent as AI is deployed in critical domains like healthcare, criminal justice, and autonomous vehicles.\n\nTraditional ethical frameworks like utilitarianism, deontology, and virtue ethics each provide different perspectives, but none seem fully adequate for the unique challenges AI presents.\n\nShould we be creating new ethical frameworks specifically for AI? How do we balance innovation with caution? And who should ultimately decide these standards?",
    authorName: "EthicalTech",
    authorId: "user-789",
    authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=EthicalTech",
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    tags: ["ethics", "artificial-intelligence", "technology"],
    upvotes: 32,
    views: 203,
    comments: 15,
    is_pinned: false
  }
];

// Simulated comments for development
const simulatedComments = {
  "1": [
    {
      id: "comment-1-1",
      authorId: "user-444",
      authorName: "PhysicsProfessor",
      authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=PhysicsProfessor",
      content: "This topic fascinates me. The observer effect in quantum mechanics doesn't necessarily imply consciousness is involved - it's more about measurement and interaction. But the questions this raises are profound and worthwhile.",
      createdAt: new Date(Date.now() - 20 * 60 * 60 * 1000),
      upvotes: 7
    },
    {
      id: "comment-1-2",
      authorId: "user-555",
      authorName: "MindExplorer",
      authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=MindExplorer",
      content: "I recommend looking into the work of Roger Penrose and Stuart Hameroff on quantum consciousness. Their Orchestrated Objective Reduction theory suggests quantum processes in microtubules within neurons could be the seat of consciousness.",
      createdAt: new Date(Date.now() - 18 * 60 * 60 * 1000),
      upvotes: 5
    },
    {
      id: "comment-1-3",
      authorId: "user-666",
      authorName: "SkepticalThinker",
      authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=SkepticalThinker",
      content: "While these ideas are interesting to think about, I remain skeptical that quantum effects play any significant role in consciousness. The brain is simply too warm and wet for quantum coherence to be maintained long enough to matter for neural processing.",
      createdAt: new Date(Date.now() - 10 * 60 * 60 * 1000),
      upvotes: 3
    }
  ],
  "2": [
    {
      id: "comment-2-1",
      authorId: "user-777",
      authorName: "ZenPractitioner",
      authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ZenPractitioner",
      content: "I've been practicing meditation and mindfulness for over a decade, and I've found that the key is to adapt these practices to your own cultural context rather than trying to adopt the entire Eastern philosophical framework.",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      upvotes: 9
    },
    {
      id: "comment-2-2",
      authorId: "user-888",
      authorName: "ComparativePhilosopher",
      authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ComparativePhilosopher",
      content: "There are actually many parallels between Eastern concepts and Western philosophical traditions that often go unnoticed. Stoicism, for instance, shares much in common with Buddhism regarding detachment and equanimity.",
      createdAt: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000),
      upvotes: 6
    }
  ],
  "3": [
    {
      id: "comment-3-1",
      authorId: "user-999",
      authorName: "AIResearcher",
      authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=AIResearcher",
      content: "The current approach of training AI on human-generated data often leads to systems reflecting and potentially amplifying societal biases. We need more diverse input in both AI development and ethical oversight.",
      createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      upvotes: 12
    },
    {
      id: "comment-3-2",
      authorId: "user-111",
      authorName: "EthicsScholar",
      authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=EthicsScholar",
      content: "I think we need a hybrid approach that combines existing ethical frameworks with new principles specific to AI. Transparency, fairness, non-maleficence, responsibility, and privacy should be foundational.",
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      upvotes: 8
    }
  ]
};

export const ForumPostDetail = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const isAuthenticated = !!user;
  
  const [isLoading, setIsLoading] = useState(true);
  const [post, setPost] = useState<any>(null);
  const [comments, setComments] = useState<DiscussionComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  
  useEffect(() => {
    const fetchPost = async () => {
      if (!postId) return;
      
      try {
        setIsLoading(true);
        
        // Use simulated data until forum_posts table is created
        setTimeout(() => {
          // Find the post in our simulated data
          const foundPost = simulatedPosts.find(p => p.id === postId);
          
          if (foundPost) {
            setPost(foundPost);
            
            // Get simulated comments for this post
            const postComments = simulatedComments[postId as keyof typeof simulatedComments] || [];
            setComments(postComments);
          } else if (postId.startsWith('new-')) {
            // Handle dynamically created posts from Forum.tsx
            setPost({
              id: postId,
              title: "New Discussion Topic",
              content: "This is a newly created discussion topic. In a production environment, this would be stored in the database.",
              authorName: user?.name || user?.username || "Anonymous",
              authorId: user?.id || "user-id",
              authorAvatar: user?.avatar || "",
              created_at: new Date().toISOString(),
              tags: ["discussion"],
              upvotes: 0,
              views: 1,
              comments: 0,
              is_pinned: false
            });
            setComments([]);
          }
          
          setIsLoading(false);
        }, 500); // Simulate network delay
        
      } catch (error) {
        console.error('Error fetching post:', error);
        toast({
          title: "Error",
          description: "Failed to load discussion post",
          variant: "destructive"
        });
        setIsLoading(false);
      }
    };
    
    fetchPost();
  }, [postId, toast, user]);
  
  const handleBack = () => {
    navigate('/forum');
  };
  
  const handleCommentSubmit = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to add a comment",
        variant: "destructive"
      });
      return;
    }
    
    if (!newComment.trim()) {
      toast({
        description: "Comment cannot be empty",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmittingComment(true);
    
    try {
      // Simulate adding a comment (until forum_comments table is created)
      const newCommentObj: DiscussionComment = {
        id: `comment-${Date.now()}`,
        authorId: user.id,
        authorName: user.name || user.username || 'Anonymous',
        authorAvatar: user.avatar,
        content: newComment.trim(),
        createdAt: new Date(),
        upvotes: 0
      };
      
      // Add to local state
      setComments(prev => [...prev, newCommentObj]);
      setNewComment('');
      
      // Update post comment count
      setPost(prev => ({
        ...prev,
        comments: (prev.comments || 0) + 1
      }));
      
      toast({
        description: "Comment added successfully",
      });
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive"
      });
    } finally {
      setIsSubmittingComment(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Button variant="ghost" className="mb-6" onClick={handleBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Forum
        </Button>
        
        <Card className="mb-8">
          <CardHeader>
            <Skeleton className="h-7 w-3/4 mb-2" />
            <div className="flex items-center space-x-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-4 w-32" />
            </div>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4 mb-4" />
            <div className="flex gap-2 mt-4">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4 flex justify-between">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
          </CardFooter>
        </Card>
        
        <div className="mb-6">
          <Skeleton className="h-6 w-40 mb-4" />
          <div className="space-y-4">
            {Array(3).fill(0).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  if (!post) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Button variant="ghost" className="mb-6" onClick={handleBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Forum
        </Button>
        
        <Card className="p-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-muted p-4">
              <MessageSquare size={32} className="text-muted-foreground" />
            </div>
          </div>
          <h3 className="text-xl font-medium mb-2">Discussion Not Found</h3>
          <p className="text-muted-foreground mb-4">The discussion post you're looking for doesn't exist or has been removed</p>
          <Button onClick={handleBack}>Return to Forum</Button>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <Button variant="ghost" className="mb-6" onClick={handleBack}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Forum
      </Button>
      
      <Card className="mb-8">
        <CardHeader>
          <div className="flex justify-between items-start">
            <h1 className="text-2xl font-bold">{post.title}</h1>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Bookmark size={16} className="mr-1" />
                Save
              </Button>
              <Button variant="outline" size="sm">
                <Share size={16} className="mr-1" />
                Share
              </Button>
            </div>
          </div>
          <div className="flex items-center space-x-2 mt-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={post.authorAvatar} alt={post.authorName} />
              <AvatarFallback>{post.authorName?.[0]?.toUpperCase() || 'A'}</AvatarFallback>
            </Avatar>
            <div>
              <span className="text-sm font-medium">{post.authorName}</span>
              <div className="flex items-center text-xs text-muted-foreground">
                <Calendar size={12} className="mr-1" />
                <span>{formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose dark:prose-invert max-w-none">
            <p className="whitespace-pre-line">{post.content}</p>
          </div>
          
          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6">
              {post.tags.map((tag: string, idx: number) => (
                <Badge key={idx} variant="secondary" className="flex items-center gap-1">
                  <Tag size={14} />
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter className="border-t pt-4 flex justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="flex items-center">
              <ThumbsUp size={16} className="mr-1" />
              <span>{post.upvotes || 0}</span>
            </Button>
            <div className="flex items-center">
              <MessageSquare size={16} className="mr-1" />
              <span>{post.comments || comments.length || 0}</span>
            </div>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <span>{post.views || 0} views</span>
          </div>
        </CardFooter>
      </Card>
      
      {/* Comments Section */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">
          Comments {comments.length > 0 && `(${comments.length})`}
        </h2>
        
        {isAuthenticated && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <Textarea 
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-[120px] mb-4"
              />
              <div className="flex justify-end">
                <Button 
                  onClick={handleCommentSubmit} 
                  disabled={isSubmittingComment || !newComment.trim()}
                  className="flex items-center gap-2"
                >
                  <Send size={16} />
                  {isSubmittingComment ? 'Posting...' : 'Post Comment'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        
        {comments.length > 0 ? (
          <div className="space-y-4">
            {comments.map((comment) => (
              <Card key={comment.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={comment.authorAvatar} alt={comment.authorName} />
                      <AvatarFallback>{comment.authorName?.[0]?.toUpperCase() || 'A'}</AvatarFallback>
                    </Avatar>
                    <div>
                      <span className="text-sm font-medium">{comment.authorName}</span>
                      <div className="text-xs text-muted-foreground">
                        {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{comment.content}</p>
                </CardContent>
                <CardFooter className="pt-0 flex justify-between">
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" className="h-8 px-2">
                      <ThumbsUp size={14} className="mr-1" />
                      <span>{comment.upvotes}</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 px-2">
                      Reply
                    </Button>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 px-2">
                    <Flag size={14} />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-muted p-4">
                <MessageSquare size={32} className="text-muted-foreground" />
              </div>
            </div>
            <h3 className="text-xl font-medium mb-2">No Comments Yet</h3>
            <p className="text-muted-foreground mb-4">Be the first to share your thoughts</p>
            {!isAuthenticated && (
              <Button asChild>
                <a href="/auth">Sign In to Comment</a>
              </Button>
            )}
          </Card>
        )}
      </div>
    </div>
  );
};

export default ForumPostDetail;
