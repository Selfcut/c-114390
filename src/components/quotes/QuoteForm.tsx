
import React, { useState } from 'react';
import { QuoteSubmission } from '@/lib/quotes/types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

const QUOTE_CATEGORIES = [
  'Philosophy',
  'Science',
  'Literature',
  'Motivation',
  'Life',
  'Humor',
  'Business',
  'Religion',
  'Politics',
  'Art',
  'Other',
];

interface QuoteFormProps {
  initialValues?: Partial<QuoteSubmission>;
  onSubmit: (data: QuoteSubmission) => void;
  isSubmitting: boolean;
  submitLabel?: string;
  cancelAction?: () => void;
}

export const QuoteForm: React.FC<QuoteFormProps> = ({
  initialValues = {},
  onSubmit,
  isSubmitting,
  submitLabel = 'Submit',
  cancelAction,
}) => {
  const [formData, setFormData] = useState<Partial<QuoteSubmission>>({
    text: '',
    author: '',
    source: '',
    category: 'Other',
    tags: [],
    ...initialValues,
  });
  
  const [tag, setTag] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      category: value,
    }));
  };

  const addTag = () => {
    if (!tag.trim()) return;
    
    const trimmedTag = tag.trim().toLowerCase();
    
    // Don't add duplicates
    if (formData.tags?.includes(trimmedTag)) {
      setTag('');
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      tags: [...(prev.tags || []), trimmedTag],
    }));
    
    setTag('');
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(t => t !== tagToRemove),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const newErrors: Record<string, string> = {};
    
    if (!formData.text?.trim()) {
      newErrors.text = 'Quote text is required';
    }
    
    if (!formData.author?.trim()) {
      newErrors.author = 'Author name is required';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Submit data if valid
    onSubmit(formData as QuoteSubmission);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Quote text */}
      <div className="space-y-2">
        <Label htmlFor="text">Quote Text <span className="text-destructive">*</span></Label>
        <Textarea
          id="text"
          name="text"
          placeholder="Enter the quote text"
          value={formData.text}
          onChange={handleChange}
          className={errors.text ? 'border-destructive' : ''}
        />
        {errors.text && <p className="text-destructive text-sm">{errors.text}</p>}
      </div>
      
      {/* Author */}
      <div className="space-y-2">
        <Label htmlFor="author">Author <span className="text-destructive">*</span></Label>
        <Input
          id="author"
          name="author"
          placeholder="Who said or wrote this quote?"
          value={formData.author}
          onChange={handleChange}
          className={errors.author ? 'border-destructive' : ''}
        />
        {errors.author && <p className="text-destructive text-sm">{errors.author}</p>}
      </div>
      
      {/* Source */}
      <div className="space-y-2">
        <Label htmlFor="source">Source</Label>
        <Input
          id="source"
          name="source"
          placeholder="Book, speech, movie, etc. (optional)"
          value={formData.source}
          onChange={handleChange}
        />
      </div>
      
      {/* Category */}
      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select 
          value={formData.category} 
          onValueChange={handleCategoryChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {QUOTE_CATEGORIES.map(category => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* Tags */}
      <div className="space-y-2">
        <Label htmlFor="tags">Tags</Label>
        <div className="flex gap-2">
          <Input
            id="tags"
            placeholder="Add tags (press Enter)"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addTag();
              }
            }}
            className="flex-grow"
          />
          <Button 
            type="button" 
            onClick={addTag}
            variant="outline"
          >
            Add
          </Button>
        </div>
        
        {/* Display tags */}
        <div className="flex flex-wrap gap-2 mt-2">
          {formData.tags?.map(tag => (
            <Badge 
              key={tag} 
              variant="secondary"
              className="flex items-center gap-1"
            >
              {tag}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0"
                onClick={() => removeTag(tag)}
              >
                <X size={12} />
                <span className="sr-only">Remove tag</span>
              </Button>
            </Badge>
          ))}
        </div>
      </div>
      
      {/* Form actions */}
      <div className="flex justify-end gap-2 pt-4">
        {cancelAction && (
          <Button 
            type="button" 
            variant="outline" 
            onClick={cancelAction}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        )}
        <Button 
          type="submit" 
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : submitLabel}
        </Button>
      </div>
    </form>
  );
};
