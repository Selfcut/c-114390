
import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { UserProfile } from '@/lib/auth/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

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
  
  const handleSubmit = () => {
    if (newComment.trim()) {
      onSubmit(newComment);
      setNewComment('');
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Submit on Ctrl+Enter or Cmd+Enter
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };
  
  return (
    <Card className="mb-8">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          {user && user.avatar_url && (
            <Avatar className="h-6 w-6">
              <AvatarImage src={user.avatar_url} alt={user.name} />
              <AvatarFallback>{user.name?.[0] || 'U'}</AvatarFallback>
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
        </div>
      </CardContent>
    </Card>
  );
};
