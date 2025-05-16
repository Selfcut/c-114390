
import React from 'react';
import { FormField } from './FormField';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface QuoteFormState {
  text: string;
  author: string;
  source: string;
  category: string;
  tags: string;
}

interface QuoteFormProps {
  formState: QuoteFormState;
  onChange: (updates: Partial<QuoteFormState>) => void;
  isSubmitting: boolean;
}

export const QuoteForm: React.FC<QuoteFormProps> = ({
  formState,
  onChange,
  isSubmitting
}) => {
  // Quote categories
  const categories = [
    'Inspiration', 'Philosophy', 'Wisdom', 'Spiritual', 'Scientific',
    'Literary', 'Historical', 'Motivational', 'Humorous', 'Other'
  ];
  
  return (
    <div className="space-y-4">
      <FormField
        id="quote-text"
        label="Quote Text"
        placeholder="Enter the quote text"
        value={formState.text}
        onChange={(e) => onChange({ text: e.target.value })}
        multiline
        required
        disabled={isSubmitting}
      />
      
      <FormField
        id="quote-author"
        label="Author"
        placeholder="Who said or wrote this quote"
        value={formState.author}
        onChange={(e) => onChange({ author: e.target.value })}
        required
        disabled={isSubmitting}
      />
      
      <FormField
        id="quote-source"
        label="Source (Optional)"
        placeholder="Book, speech, article, etc."
        value={formState.source}
        onChange={(e) => onChange({ source: e.target.value })}
        disabled={isSubmitting}
      />
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Category</label>
        <Select
          value={formState.category}
          onValueChange={(value) => onChange({ category: value })}
          disabled={isSubmitting}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>{category}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <FormField
        id="quote-tags"
        label="Tags (Optional)"
        placeholder="Comma-separated tags (e.g. success, mindfulness)"
        value={formState.tags}
        onChange={(e) => onChange({ tags: e.target.value })}
        disabled={isSubmitting}
        helperText="Enter tags separated by commas"
      />
    </div>
  );
};
