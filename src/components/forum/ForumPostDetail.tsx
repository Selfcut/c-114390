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
  Send,
  Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/auth';
import { formatDistanceToNow } from 'date-fns';

interface Comment {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  createdAt: Date;
  upvotes: number;
}

// Add a type for the profile data from Supabase
interface ProfileData {
  name?: string;
  username?: string;
  avatar_url?: string;
}

export const ForumPostDetail = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const isAuthenticated = !!user;
  
  const [isLoading, setIsLoading] = useState(true);
  const [post, setPost] = useState<any>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  
  useEffect(() => {
    const fetchPost = async () => {
      if (!postId) return;
      
      try {
        setIsLoading(true);
        
        // Using maybeSingle instead of single to handle cases where post might not exist
        const { data: postData, error: postError } = await supabase
          .from('forum_posts')
          .select('*')
          .eq('id', postId)
          .maybeSingle();
        
        if (postError) {
          console.error('Error fetching post:', postError);
          throw postError;
        }
        
        if (!postData) {
          // Post not found, set loading to false and return early
          setIsLoading(false);
          return;
        }
        
        // After getting the post, fetch the author's profile separately
        let authorName = 'Unknown User';
        let authorAvatar = undefined;
        
        if (postData.user_id) {
          const { data: userData } = await supabase
            .from('profiles')
            .select('name, username, avatar_url')
            .eq('id', postData.user_id)
            .maybeSingle();
            
          if (userData) {
            authorName = userData.name || userData.username || 'Unknown User';
            authorAvatar = userData.avatar_url;
          }
        }
        
        // Process post data
        const processedPost = {
          id: postData.id,
          title: postData.title,
          content: postData.content,
          authorName,
          authorId: postData.user_id,
          authorAvatar,
          created_at: postData.created_at,
          tags: postData.tags || [],
          upvotes: postData.upvotes || 0,
          views: postData.views || 0,
          comments: postData.comments || 0,
          is_pinned: postData.is_pinned || false
        };
        
        setPost(processedPost);
        
        // Increment view count for the post
        try {
          await supabase.rpc('increment_counter_fn', {
            row_id: postId,
            column_name: 'views',
            table_name: 'forum_posts'
          });
        } catch (err) {
          console.error('Error incrementing view count:', err);
        }
        
        // Fetch comments - Fix the query to properly join with profiles table
        const { data: commentsData, error: commentsError } = await supabase
          .from('content_comments')
          .select(`
            id,
            comment,
            user_id,
            created_at,
            profiles:user_id (name, username, avatar_url)
          `)
          .eq('content_id', postId)
          .eq('content_type', 'forum')
          .order('created_at', { ascending: true });
        
        if (commentsError) {
          console.error('Error fetching comments:', commentsError);
        } else if (commentsData) {
          // Map comments data to our Comment interface
          const mappedComments: Comment[] = commentsData.map(comment => {
            // Fix: Initialize profileData with default empty values
            const profileData: ProfileData = {
              name: undefined,
              username: undefined,
              avatar_url: undefined
            };
            
            // Only assign profile data if it exists and is an object (not null)
            if (comment.profiles && typeof comment.profiles === 'object') {
              // Fix: The key line that checks if profiles is not null before accessing
              if (comment.profiles !== null) {
                profileData.name = comment.profiles.name;
                profileData.username = comment.profiles.username;
                profileData.avatar_url = comment.profiles.avatar_url;
              }
            }
            
            // Use these safely extracted values
            const name = profileData.name;
            const username = profileData.username;
            const avatarUrl = profileData.avatar_url;
            
            return {
              id: comment.id,
              content: comment.comment,
              authorId: comment.user_id,
              authorName: name || username || 'Unknown',
              authorAvatar: avatarUrl,
              createdAt: new Date(comment.created_at),
              upvotes: 0 // We don't track this in our DB currently
            };
          });
          
          setComments(mappedComments);
        }
        
        setIsLoading(false);
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
  }, [postId, toast]);
  
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
      // Insert the comment into the database
      const { data: commentData, error: commentError } = await supabase
        .from('content_comments')
        .insert({
          content_id: postId,
          content_type: 'forum',
          user_id: user.id,
          comment: newComment.trim()
        })
        .select()
        .single();
      
      if (commentError) {
        throw commentError;
      }
      
      // Create a new comment object for the UI
      const newCommentObj: Comment = {
        id: commentData.id,
        authorId: user.id,
        authorName: user.name || user.email || 'Anonymous',
        authorAvatar: user.avatar_url,
        content: newComment.trim(),
        createdAt: new Date(),
        upvotes: 0
      };
      
      // Add to local state
      setComments(prev => [...prev, newCommentObj]);
      setNewComment('');
      
      // Update post comment count in local state
      setPost(prev => prev ? {
        ...prev,
        comments: (prev.comments || 0) + 1
      } : null);
      
      // Update comment count in database
      await supabase.rpc('increment_counter_fn', {
        row_id: postId,
        column_name: 'comments',
        table_name: 'forum_posts'
      });
      
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
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex items-center"
              onClick={async () => {
                if (!isAuthenticated) {
                  toast({
                    title: "Authentication Required",
                    description: "Please sign in to upvote",
                    variant: "destructive"
                  });
                  return;
                }
                
                try {
                  await supabase.rpc('increment_counter_fn', {
                    row_id: post.id,
                    column_name: 'upvotes',
                    table_name: 'forum_posts'
                  });
                  
                  setPost(prev => ({
                    ...prev,
                    upvotes: prev.upvotes + 1
                  }));
                } catch (error) {
                  console.error('Error upvoting:', error);
                  toast({
                    title: "Error",
                    description: "Failed to upvote",
                    variant: "destructive"
                  });
                }
              }}
            >
              <ThumbsUp size={16} className="mr-1" />
              <span>{post.upvotes}</span>
            </Button>
            <div className="flex items-center">
              <MessageSquare size={16} className="mr-1" />
              <span>{post.comments}</span>
            </div>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Eye size={16} className="mr-1" />
            <span>{post.views} views</span>
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
