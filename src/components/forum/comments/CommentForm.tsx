
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Send } from 'lucide-react';

interface CommentFormProps {
  onSubmit: (content: string) => Promise<void>;
  isSubmitting: boolean;
  isAuthenticated: boolean;
}

export const CommentForm = ({ onSubmit, isSubmitting, isAuthenticated }: CommentFormProps) => {
  const [content, setContent] = useState('');

  const handleSubmit = async () => {
    await onSubmit(content);
    setContent('');
  };

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <Textarea 
          placeholder="Add a comment..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[120px] mb-4"
          disabled={!isAuthenticated || isSubmitting}
        />
        <div className="flex justify-end">
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting || !content.trim() || !isAuthenticated}
            className="flex items-center gap-2"
          >
            <Send size={16} />
            {isSubmitting ? 'Posting...' : 'Post Comment'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
