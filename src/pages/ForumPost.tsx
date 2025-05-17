
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageLayout } from '@/components/layouts/PageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Send } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { ForumSkeleton } from '@/components/forum/post/ForumSkeleton';
import { ForumPostDetails } from '@/components/forum/post/ForumPostDetails';
import { ForumPostStats } from '@/components/forum/post/ForumPostStats';
import { CommentsList } from '@/components/forum/comments/CommentsList';
import { NotFoundCard } from '@/components/forum/post/NotFoundCard';
import { supabase } from '@/integrations/supabase/client';

interface Comment {
  id: string;
  content: string;
  author: string;
  authorAvatar?: string;
  createdAt: Date;
  isAuthor: boolean;
}

interface UserProfile {
  username?: string;
  name?: string;
  avatar_url?: string | null;
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
  
  // Load post data from Supabase
  useEffect(() => {
    const fetchDiscussion = async () => {
      setIsLoading(true);
      try {
        if (!id) return;

        // Fetch the forum post
        const { data: postData, error: postError } = await supabase
          .from('forum_posts')
          .select(`
            id, title, content, tags, upvotes, views, comments, is_pinned,
            created_at, user_id,
            profiles:user_id (name, username, avatar_url)
          `)
          .eq('id', id)
          .single();
          
        if (postError) {
          console.error("Error fetching forum post:", postError);
          setIsLoading(false);
          return;
        }
        
        if (!postData) {
          setIsLoading(false);
          return;
        }

        // Process the data
        const authorInfo = postData.profiles || {};
        const authorName = authorInfo.name || authorInfo.username || 'Unknown User';
        const authorAvatar = authorInfo.avatar_url || 
          `https://api.dicebear.com/7.x/avataaars/svg?seed=${authorName}`;
          
        const processedPost = {
          id: postData.id,
          title: postData.title,
          content: postData.content,
          author: authorName,
          authorId: postData.user_id,
          authorAvatar,
          createdAt: new Date(postData.created_at),
          tags: postData.tags || [],
          upvotes: postData.upvotes || 0,
          views: postData.views || 0,
          comments: postData.comments || 0,
          isPinned: postData.is_pinned || false
        };
        
        setDiscussion(processedPost);
        
        // Fetch comments
        const { data: commentsData, error: commentsError } = await supabase
          .from('content_comments')
          .select(`
            id, comment, user_id, created_at,
            profiles:user_id (name, username, avatar_url)
          `)
          .eq('content_id', id)
          .eq('content_type', 'forum')
          .order('created_at', { ascending: false });
          
        if (commentsError) {
          console.error("Error fetching comments:", commentsError);
        } else if (commentsData) {
          // Process comments
          const processedComments: Comment[] = commentsData.map(comment => {
            const commentAuthorInfo = comment.profiles || {};
            const commentAuthorName = commentAuthorInfo.name || commentAuthorInfo.username || 'Unknown User';
            const commentAuthorAvatar = commentAuthorInfo.avatar_url || 
              `https://api.dicebear.com/7.x/avataaars/svg?seed=${commentAuthorName}`;
              
            return {
              id: comment.id,
              content: comment.comment,
              author: commentAuthorName,
              authorAvatar: commentAuthorAvatar,
              createdAt: new Date(comment.created_at),
              isAuthor: comment.user_id === postData.user_id
            };
          });
          
          setComments(processedComments);
        }
        
        // Update view count
        try {
          await supabase.rpc('increment_counter_fn', {
            row_id: id,
            column_name: 'views',
            table_name: 'forum_posts'
          });
        } catch (err) {
          console.error('Error incrementing view count:', err);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error in fetchDiscussion:", error);
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
  
  const handleSubmitComment = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to comment",
        variant: "destructive"
      });
      return;
    }
    
    if (!newComment.trim() || !id) {
      toast({
        title: "Empty Comment",
        description: "Please write something before posting",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Add the comment to Supabase
      const { data: commentData, error: commentError } = await supabase
        .from('content_comments')
        .insert({
          content_id: id,
          content_type: 'forum',
          user_id: user.id,
          comment: newComment.trim()
        })
        .select()
        .single();
        
      if (commentError) throw commentError;
      
      const userProfile = user as unknown as UserProfile;
      const avatarSeed = userProfile.username || user.id;
      
      // Create the comment object for the UI
      const newCommentObj = {
        id: commentData.id,
        content: newComment,
        author: userProfile.username || userProfile.name || "User",
        authorAvatar: userProfile.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}`,
        createdAt: new Date(),
        isAuthor: user.id === discussion?.authorId
      };
      
      // Update the UI
      setComments(prev => [newCommentObj, ...prev]);
      setNewComment('');
      
      // Update comment count
      if (discussion) {
        setDiscussion({
          ...discussion,
          comments: (discussion.comments || 0) + 1
        });
        
        // Update the comment count in the database
        await supabase.rpc('increment_counter_fn', {
          row_id: id,
          column_name: 'comments',
          table_name: 'forum_posts'
        });
      }
      
      toast({
        title: "Comment Posted",
        description: "Your comment has been added to the discussion",
      });
    } catch (error) {
      console.error("Error posting comment:", error);
      toast({
        title: "Error",
        description: "Failed to post your comment",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleUpvote = async () => {
    if (!user || !id) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to upvote",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Check if user already liked this post
      const { data: existingLike } = await supabase
        .from('content_likes')
        .select()
        .eq('content_id', id)
        .eq('content_type', 'forum')
        .eq('user_id', user.id)
        .maybeSingle();
        
      if (existingLike) {
        toast({
          description: "You've already upvoted this post",
        });
        return;
      }
      
      // Add the like
      await supabase
        .from('content_likes')
        .insert({
          content_id: id,
          content_type: 'forum',
          user_id: user.id
        });
        
      // Increment the upvote count
      await supabase.rpc('increment_counter_fn', {
        row_id: id,
        column_name: 'upvotes',
        table_name: 'forum_posts'
      });
      
      // Update local state
      if (discussion) {
        setDiscussion({
          ...discussion,
          upvotes: (discussion.upvotes || 0) + 1
        });
      }
      
      toast({
        description: "Upvoted successfully",
      });
    } catch (error) {
      console.error("Error upvoting:", error);
      toast({
        title: "Error",
        description: "Failed to upvote",
        variant: "destructive"
      });
    }
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
          <ForumSkeleton />
        ) : discussion ? (
          <>
            <ForumPostDetails 
              discussion={discussion} 
              formatTimeAgo={formatTimeAgo} 
            />
            
            <ForumPostStats
              views={discussion.views}
              comments={comments.length}
              upvotes={discussion.upvotes}
              createdAt={discussion.createdAt}
              formatTimeAgo={formatTimeAgo}
            />
            
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
            <CommentsList 
              comments={comments}
              formatTimeAgo={formatTimeAgo}
            />
          </>
        ) : (
          <NotFoundCard onNavigateBack={() => navigate('/forum')} />
        )}
      </div>
    </PageLayout>
  );
};

export default ForumPost;
