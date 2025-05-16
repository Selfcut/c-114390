
import React from 'react';
import { FormField } from './FormField';

interface KnowledgeFormState {
  title: string;
  summary: string;
  content: string;
  categories: string;
  coverImage: File | null;
}

interface KnowledgeEntryFormProps {
  formState: KnowledgeFormState;
  onChange: (updates: Partial<KnowledgeFormState>) => void;
  isSubmitting: boolean;
}

export const KnowledgeEntryForm: React.FC<KnowledgeEntryFormProps> = ({
  formState,
  onChange,
  isSubmitting
}) => {
  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    onChange({ coverImage: e.target.files[0] });
  };

  return (
    <div className="space-y-4">
      <FormField
        id="knowledge-title"
        label="Title"
        placeholder="Knowledge entry title"
        value={formState.title}
        onChange={(e) => onChange({ title: e.target.value })}
        required
        disabled={isSubmitting}
      />
      
      <FormField
        id="knowledge-summary"
        label="Summary"
        placeholder="A brief summary of this knowledge entry"
        value={formState.summary}
        onChange={(e) => onChange({ summary: e.target.value })}
        multiline
        required
        disabled={isSubmitting}
      />
      
      <FormField
        id="knowledge-content"
        label="Content"
        placeholder="The full content of your knowledge entry"
        value={formState.content}
        onChange={(e) => onChange({ content: e.target.value })}
        multiline
        rows={6}
        disabled={isSubmitting}
      />
      
      <FormField
        id="knowledge-categories"
        label="Categories"
        placeholder="Comma-separated categories (e.g. Philosophy, Science)"
        value={formState.categories}
        onChange={(e) => onChange({ categories: e.target.value })}
        disabled={isSubmitting}
      />
      
      <FormField
        id="knowledge-cover"
        label="Cover Image"
        type="file"
        value=""
        accept="image/*"
        onChange={handleFileChange}
        disabled={isSubmitting}
      />
    </div>
  );
};
