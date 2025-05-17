
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/auth';
import { PostHeader } from './post/PostHeader';
import { PostContent } from './post/PostContent';
import { PostFooter } from './post/PostFooter';
import { PostNotFound } from './post/PostNotFound';
import { CommentItem } from './comments/CommentItem';
import { CommentForm } from './comments/CommentForm';
import { EmptyComments } from './comments/EmptyComments';

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
    fetchPost();
  }, [postId]);
  
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
      
      await fetchComments();
      
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
  
  const fetchComments = async () => {
    if (!postId) return;
    
    try {
      // Fetch comments
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
            // Fix: Properly check if profiles is not null before accessing properties
            const profiles = comment.profiles;
            // Use type assertion to tell TypeScript that profiles is not null
            // since we've already checked it above
            if (profiles !== null) {
              // Access safely with type assertion
              const typedProfiles = profiles as { name?: string; username?: string; avatar_url?: string };
              profileData.name = typedProfiles.name;
              profileData.username = typedProfiles.username;
              profileData.avatar_url = typedProfiles.avatar_url;
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
            authorName: name || username || 'Unknown User',
            authorAvatar: avatarUrl,
            createdAt: new Date(comment.created_at),
            upvotes: 0 // We don't track this in our DB currently
          };
        });
        
        setComments(mappedComments);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };
  
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
      // Insert the comment into the database
      const { data: commentData, error: commentError } = await supabase
        .from('content_comments')
        .insert({
          content_id: postId,
          content_type: 'forum',
          user_id: user.id,
          comment: content.trim()
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
        content: content.trim(),
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
  
  const handleUpvote = async () => {
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
  
  if (!post) {
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
  
  return (
    <div className="container mx-auto py-8 px-4">
      <Button variant="ghost" className="mb-6" onClick={handleBack}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Forum
      </Button>
      
      <Card className="mb-8">
        <PostHeader post={post} />
        <PostContent content={post.content} tags={post.tags} />
        <PostFooter 
          post={post} 
          isAuthenticated={isAuthenticated}
          onUpvote={handleUpvote}
        />
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
            {comments.map((comment) => (
              <CommentItem key={comment.id} comment={comment} />
            ))}
          </div>
        ) : (
          <EmptyComments isAuthenticated={isAuthenticated} />
        )}
      </div>
    </div>
  );
};

export default ForumPostDetail;
