
import { useState } from "react";
import { Tag, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { QuoteSubmission } from "@/lib/quotes-service";

interface QuoteFormProps {
  onSubmit: (quote: QuoteSubmission) => Promise<void>;
  isSubmitting: boolean;
}

export const QuoteForm = ({ onSubmit, isSubmitting }: QuoteFormProps) => {
  const [quoteText, setQuoteText] = useState("");
  const [author, setAuthor] = useState("");
  const [source, setSource] = useState("");
  const [category, setCategory] = useState("Philosophy");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);

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

  const handleSubmit = async () => {
    // Create the quote submission object
    const quoteSubmission: QuoteSubmission = {
      text: quoteText.trim(),
      author: author.trim(),
      source: source.trim() || undefined,
      category: category,
      tags: tags.length > 0 ? tags : undefined
    };
    
    await onSubmit(quoteSubmission);
    
    // Reset form fields
    setQuoteText("");
    setAuthor("");
    setSource("");
    setCategory("Philosophy");
    setTags([]);
  };

  // Available categories
  const categories = [
    "Philosophy", "Science", "Literature", "History", 
    "Psychology", "Mathematics", "Art", "Politics",
    "Religion", "Technology", "Education", "Other"
  ];

  return (
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
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>
      
      <Button 
        onClick={handleSubmit}
        disabled={!quoteText.trim() || !author.trim() || isSubmitting}
        className="w-full"
      >
        Submit Quote
      </Button>
    </div>
  );
};
