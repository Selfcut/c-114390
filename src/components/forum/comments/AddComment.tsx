
import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { User } from '@supabase/supabase-js';

interface AddCommentProps {
  onSubmit: (comment: string) => void;
  isSubmitting: boolean;
  user: User | null;
}

export const AddComment: React.FC<AddCommentProps> = ({ 
  onSubmit, 
  isSubmitting, 
  user 
}) => {
  const [newComment, setNewComment] = useState('');

  const handleSubmit = () => {
    onSubmit(newComment);
    setNewComment('');
  };
  
  return (
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
