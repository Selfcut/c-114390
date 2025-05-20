
import { useState } from "react";
import { X, Send } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Button } from "./ui/button";
import { toast } from "./ui/use-toast";
import { createQuoteSubmission, QuoteSubmission } from "@/lib/quotes-service";
import { QuoteForm } from "@/components/quotes/QuoteForm";

interface QuoteSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onQuoteAdded?: () => void;
  onSubmit?: () => Promise<void>;
  onSuccess?: () => void;
}

export const QuoteSubmissionModal = ({ 
  isOpen, 
  onClose,
  onQuoteAdded,
  onSubmit: externalSubmitHandler,
  onSuccess
}: QuoteSubmissionModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isAuthenticated } = useAuth();

  const handleSubmitQuote = async (quoteSubmission: QuoteSubmission) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to submit quotes",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Create the quote using the renamed service function
      const success = await createQuoteSubmission(quoteSubmission);
      
      if (success) {
        // Notify parent component
        if (onQuoteAdded) {
          onQuoteAdded();
        }
        
        // Call external submit handler if provided
        if (externalSubmitHandler) {
          await externalSubmitHandler();
        }
        
        // Call success handler if provided (for backward compatibility)
        if (onSuccess) {
          onSuccess();
        }
        
        // Close modal
        onClose();
        
        toast({
          title: "Quote submitted successfully",
          description: "Your quote has been added to the collection"
        });
      }
    } catch (err) {
      console.error("Error submitting quote:", err);
      toast({
        title: "Failed to submit quote",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-background rounded-lg max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Submit a Quote</h2>
          <button 
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground p-1 rounded-full hover:bg-muted/30"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4 overflow-y-auto flex-1">
          <QuoteForm 
            onSubmit={handleSubmitQuote}
            isSubmitting={isSubmitting}
          />
        </div>
        
        <div className="p-4 border-t flex justify-end">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="mr-2"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};
