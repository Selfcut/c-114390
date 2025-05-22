import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/auth';
import { PostHeader } from './post/PostHeader';
import { PostContent } from './post/PostContent';
import { PostFooter } from './post/PostFooter';
import { PostNotFound } from './post/PostNotFound';
import { CommentItem } from './comments/CommentItem';
import { CommentForm } from './comments/CommentForm';
import { EmptyComments } from './comments/EmptyComments';
import { useForumPostDetails } from '@/hooks/forum/useForumPostDetails';

export const ForumPostDetail = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const isAuthenticated = !!user;
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  
  // Use our optimized hook
  const {
    discussion: post,
    comments,
    isLoading,
    isError,
    addComment,
    upvotePost
  } = useForumPostDetails(postId);
  
  const handleBack = () => {
    navigate('/forum');
  };
  
  const handleCommentSubmit = async (content: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to add a comment",
        variant: "destructive"
      });
      return;
    }
    
    if (!content.trim()) {
      toast({
        description: "Comment cannot be empty",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmittingComment(true);
    
    try {
      const success = await addComment(content, user.id);
      if (success) {
        setNewComment('');
        toast({
          description: "Comment added successfully",
        });
      }
    } finally {
      setIsSubmittingComment(false);
    }
  };
  
  const handleUpvote = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to upvote",
        variant: "destructive"
      });
      return;
    }
    
    await upvotePost(user.id);
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Button variant="ghost" className="mb-6" onClick={handleBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Forum
        </Button>
        
        <Card className="mb-8">
          <div className="p-6">
            <Skeleton className="h-7 w-3/4 mb-2" />
            <div className="flex items-center space-x-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <div className="px-6 pb-4">
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4 mb-4" />
            <div className="flex gap-2 mt-4">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          </div>
          <div className="px-6 py-4 border-t flex justify-between">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
        </Card>
        
        <div className="mb-6">
          <Skeleton className="h-6 w-40 mb-4" />
          <div className="space-y-4">
            {Array(3).fill(0).map((_, i) => (
              <Card key={i}>
                <div className="p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  if (isError || !post) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Button variant="ghost" className="mb-6" onClick={handleBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Forum
        </Button>
        
        <PostNotFound onBack={handleBack} />
      </div>
    );
  }
  
  // Adapt the post data for PostHeader component
  const adaptedPost = post ? {
    ...post,
    title: post.title || '',
    authorName: post.author || 'Anonymous',
    author: post.author || 'Anonymous', // Ensure both fields are set
    created_at: post.createdAt instanceof Date 
      ? post.createdAt.toISOString() 
      : typeof post.createdAt === 'string' 
        ? post.createdAt 
        : new Date().toISOString()
  } : { title: '', authorName: 'Anonymous', created_at: new Date().toISOString() };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <Button variant="ghost" className="mb-6" onClick={handleBack}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Forum
      </Button>
      
      <Card className="mb-8">
        <PostHeader post={adaptedPost} />
        {post && <PostContent content={post.content} tags={post.tags} />}
        {post && (
          <PostFooter 
            post={post} 
            isAuthenticated={isAuthenticated}
            onUpvote={handleUpvote}
          />
        )}
      </Card>
      
      {/* Comments Section */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">
          Comments {comments.length > 0 && `(${comments.length})`}
        </h2>
        
        {isAuthenticated && (
          <CommentForm
            onSubmit={handleCommentSubmit}
            isSubmitting={isSubmittingComment}
            isAuthenticated={isAuthenticated}
          />
        )}
        
        {comments.length > 0 ? (
          <div className="space-y-4">
            {comments.map((comment) => {
              // Adapt the comment data for CommentItem, ensuring all required properties are present
              const adaptedComment = {
                id: comment.id,
                content: comment.content || comment.comment || '',
                comment: comment.comment || comment.content || '',
                author: comment.author || 'Anonymous',
                authorName: comment.author || comment.authorName || 'Anonymous',
                authorAvatar: comment.authorAvatar || '',
                created_at: comment.createdAt instanceof Date 
                  ? comment.createdAt.toISOString() 
                  : typeof comment.createdAt === 'string'
                    ? comment.createdAt
                    : new Date().toISOString(),
                isAuthor: !!comment.isAuthor,
                upvotes: comment.upvotes || 0
              };
              
              return <CommentItem key={comment.id} comment={adaptedComment} />;
            })}
          </div>
        ) : (
          <EmptyComments isAuthenticated={isAuthenticated} />
        )}
      </div>
    </div>
  );
};

export default ForumPostDetail;
