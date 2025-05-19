
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { deleteQuote } from '@/lib/quotes';

interface DeleteQuoteDialogProps {
  quoteId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const DeleteQuoteDialog: React.FC<DeleteQuoteDialogProps> = ({
  quoteId,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const success = await deleteQuote(quoteId);
      
      if (success) {
        toast({
          title: 'Quote deleted',
          description: 'The quote has been deleted successfully',
        });
        onSuccess();
      } else {
        toast({
          title: 'Error',
          description: 'Failed to delete the quote',
          variant: 'destructive',
        });
        onClose();
      }
    } catch (error) {
      console.error('Error deleting quote:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
      onClose();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the quote and remove it from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
