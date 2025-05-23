
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';

interface QuoteSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onQuoteAdded: () => void;
}

export const QuoteSubmissionModal: React.FC<QuoteSubmissionModalProps> = ({
  isOpen,
  onClose,
  onQuoteAdded
}) => {
  const [formData, setFormData] = useState({
    text: '',
    author: '',
    source: '',
    category: 'inspirational',
    tags: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to submit quotes",
        variant: "destructive"
      });
      return;
    }

    if (!formData.text.trim() || !formData.author.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide both quote text and author",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('quotes')
        .insert({
          text: formData.text.trim(),
          author: formData.author.trim(),
          source: formData.source.trim() || null,
          category: formData.category,
          tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
          user_id: user.id
        });

      if (error) throw error;

      toast({
        title: "Quote submitted",
        description: "Your quote has been added successfully"
      });

      // Reset form
      setFormData({
        text: '',
        author: '',
        source: '',
        category: 'inspirational',
        tags: ''
      });

      onQuoteAdded();
      onClose();
    } catch (error) {
      console.error('Error submitting quote:', error);
      toast({
        title: "Error",
        description: "Failed to submit quote. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Submit a New Quote</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="text">Quote Text *</Label>
            <Textarea
              id="text"
              placeholder="Enter the quote text..."
              value={formData.text}
              onChange={(e) => handleInputChange('text', e.target.value)}
              className="min-h-[100px]"
              required
            />
          </div>

          <div>
            <Label htmlFor="author">Author *</Label>
            <Input
              id="author"
              placeholder="Quote author"
              value={formData.author}
              onChange={(e) => handleInputChange('author', e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="source">Source</Label>
            <Input
              id="source"
              placeholder="Book, speech, interview, etc. (optional)"
              value={formData.source}
              onChange={(e) => handleInputChange('source', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              <option value="inspirational">Inspirational</option>
              <option value="motivational">Motivational</option>
              <option value="wisdom">Wisdom</option>
              <option value="life">Life</option>
              <option value="success">Success</option>
              <option value="love">Love</option>
              <option value="friendship">Friendship</option>
              <option value="business">Business</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              placeholder="Enter tags separated by commas"
              value={formData.tags}
              onChange={(e) => handleInputChange('tags', e.target.value)}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Quote'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
