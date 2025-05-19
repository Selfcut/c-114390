
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Lightbulb, MessageSquare, Loader2 } from 'lucide-react';

interface CommentFormData {
  content: string;
}

interface CommentFormProps {
  problemId: number;
  problemTitle: string;
  problemCategories: string[];
  onCommentAdded: (comment: any) => void;
}

export const CommentForm = ({ 
  problemId, 
  problemTitle,
  problemCategories,
  onCommentAdded 
}: CommentFormProps) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CommentFormData>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [commentType, setCommentType] = useState<'discussion' | 'solution'>('discussion');
  const { user } = useAuth();
  const { toast } = useToast();

  const onSubmit = async (data: CommentFormData) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to post a comment",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Prepare tags for the post
      const tags = [
        `Problem ${problemId}`,
        ...problemCategories,
        commentType === 'solution' ? 'solution' : 'discussion'
      ];
      
      // Create a new forum post with the problem tag
      const { data: post, error } = await supabase
        .from('forum_posts')
        .insert({
          title: commentType === 'solution' 
            ? `Solution for: ${problemTitle}` 
            : `Discussion on: ${problemTitle}`,
          content: data.content,
          user_id: user.id,
          tags: tags
        })
        .select('id, content, created_at, user_id')
        .single();
      
      if (error) throw error;
      
      // Fetch the user's profile to add to the comment data
      const { data: profileData } = await supabase
        .from('profiles')
        .select('name, username, avatar_url')
        .eq('id', user.id)
        .single();
      
      // Format the comment with the user data
      const newComment = {
        id: post.id,
        content: post.content,
        author: profileData?.name || profileData?.username || 'Anonymous',
        authorAvatar: profileData?.avatar_url,
        authorId: post.user_id,
        createdAt: new Date(post.created_at),
        upvotes: 0
      };
      
      // Add the comment to the local state
      onCommentAdded(newComment);
      
      // Reset the form
      reset();
      setCommentType('discussion');
      
      // Show success toast
      toast({
        title: "Comment posted",
        description: commentType === 'solution' 
          ? "Your solution has been shared" 
          : "Your comment has been posted"
      });
    } catch (error) {
      console.error("Error posting comment:", error);
      toast({
        title: "Error",
        description: "Failed to post your comment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="mb-8">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <div className="flex items-center space-x-2 mb-2">
              <Button 
                type="button"
                variant={commentType === 'discussion' ? "default" : "outline"}
                size="sm"
                onClick={() => setCommentType('discussion')}
                className="flex items-center"
              >
                <MessageSquare size={16} className="mr-2" />
                Discussion
              </Button>
              <Button 
                type="button"
                variant={commentType === 'solution' ? "default" : "outline"}
                size="sm"
                onClick={() => setCommentType('solution')}
                className="flex items-center"
              >
                <Lightbulb size={16} className="mr-2" />
                Proposed Solution
              </Button>
            </div>
            
            <Textarea
              placeholder={commentType === 'solution' 
                ? "Share your solution to this problem..." 
                : "Join the discussion..."}
              {...register("content", { 
                required: "Comment content is required",
                minLength: {
                  value: 10,
                  message: "Comment must be at least 10 characters"
                }
              })}
              rows={5}
              className={errors.content ? "border-red-500" : ""}
            />
            {errors.content && (
              <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>
            )}
          </div>
          
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="mr-2 animate-spin" />
                Posting...
              </>
            ) : commentType === 'solution' ? (
              <>
                <Lightbulb size={16} className="mr-2" />
                Post Solution
              </>
            ) : (
              <>
                <MessageSquare size={16} className="mr-2" />
                Post Comment
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
