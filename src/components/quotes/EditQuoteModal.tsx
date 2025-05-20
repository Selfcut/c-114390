
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { updateQuote } from '@/lib/quotes';
import { QuoteWithUser, QuoteSubmission, EditQuoteModalProps } from '@/lib/quotes/types';
import { QuoteForm } from './QuoteForm';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

export const EditQuoteModal: React.FC<EditQuoteModalProps> = ({
  quote,
  isOpen,
  onClose,
  onQuoteUpdated,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (formData: QuoteSubmission) => {
    setIsSubmitting(true);
    try {
      const success = await updateQuote(quote.id, formData);
      
      if (success) {
        toast({
          title: 'Quote updated',
          description: 'Your quote has been updated successfully',
        });
        
        // Create an updated quote object with the new data
        const updatedQuote: QuoteWithUser = {
          ...quote,
          ...formData,
          updated_at: new Date().toISOString()
        };
        
        onQuoteUpdated(updatedQuote);
      } else {
        toast({
          title: 'Error',
          description: 'Failed to update the quote',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error updating quote:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Quote</DialogTitle>
          <DialogDescription>
            Make changes to your quote. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        
        <QuoteForm
          initialValues={{
            text: quote.text,
            author: quote.author,
            source: quote.source || '',
            category: quote.category || 'Other',
            tags: quote.tags || [],
          }}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          submitLabel="Save Changes"
          cancelAction={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};
