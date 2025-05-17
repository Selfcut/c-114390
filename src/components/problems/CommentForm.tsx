
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface CommentFormProps {
  problemId: number;
  problemTitle: string;
  problemCategories: string[];
  onCommentAdded: (newComment: Comment) => void;
}

interface Comment {
  id: string;
  author: string;
  authorAvatar?: string | null;
  authorId: string;
  content: string;
  createdAt: Date;
  upvotes: number;
}

export const CommentForm = ({ 
  problemId, 
  problemTitle, 
  problemCategories,
  onCommentAdded 
}: CommentFormProps) => {
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

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
    
    setIsSubmitting(true);
    
    try {
      // Create a new forum post connected to this problem
      const newPost = {
        title: `Contribution to Problem #${problemId}: ${problemTitle}`,
        content: comment.trim(),
        user_id: user.id,
        tags: [`Problem ${problemId}`, ...problemCategories.slice(0, 2)],
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
      
      // Create new comment object
      const newComment: Comment = {
        id: data?.[0]?.id || '',
        content: comment.trim(),
        author: profileData?.name || profileData?.username || user.name || user.email || 'Anonymous',
        authorAvatar: profileData?.avatar_url || user.avatar_url,
        authorId: user.id,
        createdAt: new Date(),
        upvotes: 0
      };
      
      // Call the callback to update parent component
      onCommentAdded(newComment);
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
      setIsSubmitting(false);
    }
  };

  return (
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
            disabled={!comment.trim() || isSubmitting}
          >
            {isSubmitting ? "Posting..." : "Post Contribution"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
