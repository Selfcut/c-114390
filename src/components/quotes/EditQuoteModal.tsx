
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { QuoteWithUser } from '@/lib/quotes/types';
import { updateQuote } from '@/lib/quotes';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';

const quoteFormSchema = z.object({
  text: z
    .string()
    .min(3, 'Quote must be at least 3 characters')
    .max(1000, 'Quote cannot exceed 1000 characters'),
  author: z
    .string()
    .min(2, 'Author name must be at least 2 characters')
    .max(100, 'Author name cannot exceed 100 characters'),
  source: z
    .string()
    .max(200, 'Source cannot exceed 200 characters')
    .optional(),
  category: z
    .string()
    .min(1, 'Please select a category'),
  tags: z
    .array(z.string())
    .max(5, 'Cannot have more than 5 tags')
    .optional(),
});

type FormData = z.infer<typeof quoteFormSchema>;

interface EditQuoteModalProps {
  quote: QuoteWithUser;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const EditQuoteModal: React.FC<EditQuoteModalProps> = ({ 
  quote, 
  isOpen, 
  onClose, 
  onSuccess 
}) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [tags, setTags] = React.useState<string[]>(quote.tags || []);
  const [tagInput, setTagInput] = React.useState('');

  const form = useForm<FormData>({
    resolver: zodResolver(quoteFormSchema),
    defaultValues: {
      text: quote.text,
      author: quote.author,
      source: quote.source || '',
      category: quote.category || 'Other',
      tags: quote.tags || [],
    },
  });

  const handleSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const success = await updateQuote(quote.id, {
        ...data,
        tags
      });
      
      if (success) {
        toast({
          title: 'Quote updated',
          description: 'Your quote has been updated successfully',
        });
        onSuccess();
      } else {
        toast({
          title: 'Error',
          description: 'Failed to update quote',
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

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim().toLowerCase();
    if (trimmedTag && !tags.includes(trimmedTag) && tags.length < 5) {
      setTags([...tags, trimmedTag]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput) {
      e.preventDefault();
      handleAddTag();
    }
  };

  const categories = [
    'Inspiration',
    'Philosophy',
    'Science',
    'Literature',
    'Motivation',
    'Humor',
    'Wisdom',
    'Life',
    'History',
    'Other'
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Quote</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quote Text</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter the quote text" 
                      className="resize-none" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="author"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Author</FormLabel>
                  <FormControl>
                    <Input placeholder="Who said this quote?" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="source"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Source (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Book, speech, etc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormItem>
              <FormLabel>Tags (up to 5)</FormLabel>
              <div className="flex items-center space-x-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Add a tag"
                  disabled={tags.length >= 5}
                />
                <Button 
                  type="button" 
                  onClick={handleAddTag}
                  disabled={!tagInput.trim() || tags.length >= 5}
                >
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <div key={tag} className="flex items-center bg-secondary text-secondary-foreground rounded px-2 py-1 text-sm">
                    {tag}
                    <button
                      type="button"
                      className="ml-1 focus:outline-none"
                      onClick={() => handleRemoveTag(tag)}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </FormItem>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Updating...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
