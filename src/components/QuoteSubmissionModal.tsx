import { useState } from "react";
import { X, Send, Tag, Plus } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { toast } from "./ui/use-toast";
import { Badge } from "./ui/badge";
import { createQuote } from "@/lib/quotes-service";

interface QuoteSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onQuoteAdded?: () => void;
}

export const QuoteSubmissionModal = ({ 
  isOpen, 
  onClose,
  onQuoteAdded 
}: QuoteSubmissionModalProps) => {
  const [quoteText, setQuoteText] = useState("");
  const [author, setAuthor] = useState("");
  const [source, setSource] = useState("");
  const [category, setCategory] = useState("Philosophy");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isAuthenticated } = useAuth();

  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    
    // Don't add duplicate tags
    if (!tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
    }
    
    setTagInput("");
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmitQuote = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to submit quotes",
        variant: "destructive"
      });
      return;
    }
    
    if (!quoteText.trim() || !author.trim()) {
      toast({
        title: "Required fields missing",
        description: "Please provide both the quote text and author",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Create the quote using the service function
      const success = await createQuote(
        quoteText.trim(),
        author.trim(),
        source.trim(),
        category,
        tags
      );
      
      if (success) {
        // Reset form
        setQuoteText("");
        setAuthor("");
        setSource("");
        setCategory("Philosophy");
        setTags([]);
        
        // Notify parent component
        if (onQuoteAdded) {
          onQuoteAdded();
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

  // Available categories
  const categories = [
    "Philosophy", "Science", "Literature", "History", 
    "Psychology", "Mathematics", "Art", "Politics",
    "Religion", "Technology", "Education", "Other"
  ];

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
          <div className="space-y-4">
            <div>
              <Label htmlFor="quote-text">Quote Text</Label>
              <Textarea
                id="quote-text"
                value={quoteText}
                onChange={(e) => setQuoteText(e.target.value)}
                placeholder="Enter the quote text..."
                className="resize-none w-full mt-1"
                rows={4}
                disabled={isSubmitting}
              />
            </div>
            
            <div>
              <Label htmlFor="author">Author</Label>
              <Input
                id="author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Who said or wrote this quote?"
                className="w-full mt-1"
                disabled={isSubmitting}
              />
            </div>
            
            <div>
              <Label htmlFor="source">Source (Optional)</Label>
              <Input
                id="source"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder="Book, article, speech, etc."
                className="w-full mt-1"
                disabled={isSubmitting}
              />
            </div>
            
            <div>
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full mt-1 p-2 rounded-md border border-input bg-background"
                disabled={isSubmitting}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            
            <div>
              <Label htmlFor="tags">Tags (Optional)</Label>
              <div className="flex mt-1">
                <Input
                  id="tags"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Add a tag..."
                  className="flex-1"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  disabled={isSubmitting}
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  className="ml-2"
                  onClick={handleAddTag}
                  disabled={!tagInput.trim() || isSubmitting}
                >
                  <Plus size={16} />
                </Button>
              </div>
              
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      <Tag size={12} />
                      {tag}
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 text-muted-foreground hover:text-foreground"
                        disabled={isSubmitting}
                      >
                        <X size={12} />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
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
          <Button 
            onClick={handleSubmitQuote}
            disabled={!quoteText.trim() || !author.trim() || isSubmitting}
          >
            <Send size={16} className="mr-2" />
            {isSubmitting ? 'Submitting...' : 'Submit Quote'}
          </Button>
        </div>
      </div>
    </div>
  );
};
