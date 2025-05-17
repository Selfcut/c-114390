
import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { UserProfile } from '@/lib/auth/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';

interface AddCommentProps {
  onSubmit: (comment: string) => void;
  isSubmitting: boolean;
  user: UserProfile | null;
}

export const AddComment: React.FC<AddCommentProps> = ({ 
  onSubmit, 
  isSubmitting, 
  user 
}) => {
  const [newComment, setNewComment] = useState('');
  const { toast } = useToast();
  
  const handleSubmit = () => {
    if (newComment.trim()) {
      onSubmit(newComment);
      setNewComment('');
    } else if (!newComment.trim() && user) {
      toast({
        title: "Comment can't be empty",
        description: "Please write something before posting",
        variant: "destructive"
      });
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Submit on Ctrl+Enter or Cmd+Enter
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  const getAvatarFallback = () => {
    if (!user) return 'G';
    if (user.name) return user.name[0].toUpperCase();
    if (user.email) return user.email[0].toUpperCase();
    return 'U';
  };
  
  return (
    <Card className="mb-8">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          {user && (
            <Avatar className="h-6 w-6">
              <AvatarImage src={user.avatar_url} alt={user.name || 'User'} />
              <AvatarFallback>{getAvatarFallback()}</AvatarFallback>
            </Avatar>
          )}
          Join the Discussion
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Textarea
            placeholder={user ? "Share your thoughts..." : "Sign in to comment"}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={!user || isSubmitting}
            className="min-h-[120px] resize-y"
          />
          <div className="flex justify-end">
            <Button 
              onClick={handleSubmit}
              disabled={!user || isSubmitting || !newComment.trim()}
              className="flex items-center gap-2"
            >
              <Send size={16} />
              {isSubmitting ? "Posting..." : "Post Reply"}
            </Button>
          </div>
          {!user && (
            <p className="text-sm text-muted-foreground text-center mt-2">
              Please sign in to join the discussion
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
