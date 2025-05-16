
import React from 'react';
import { FormField } from './FormField';

interface QuoteFormState {
  text: string;
  author: string;
  source: string;
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
  return (
    <div className="space-y-4">
      <FormField
        id="quote-text"
        label="Quote"
        placeholder="Enter the quote text"
        value={formState.text}
        onChange={(e) => onChange({ text: e.target.value })}
        multiline
        rows={4}
        required
        disabled={isSubmitting}
      />
      
      <FormField
        id="quote-author"
        label="Author"
        placeholder="Quote author"
        value={formState.author}
        onChange={(e) => onChange({ author: e.target.value })}
        required
        disabled={isSubmitting}
      />
      
      <FormField
        id="quote-source"
        label="Source (Optional)"
        placeholder="Book, speech, etc."
        value={formState.source}
        onChange={(e) => onChange({ source: e.target.value })}
        disabled={isSubmitting}
      />
      
      <FormField
        id="quote-tags"
        label="Tags"
        placeholder="Comma-separated tags (e.g. Inspiration, Philosophy)"
        value={formState.tags}
        onChange={(e) => onChange({ tags: e.target.value })}
        disabled={isSubmitting}
      />
    </div>
  );
};
