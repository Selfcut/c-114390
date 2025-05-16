
import React from 'react';
import { Button } from '@/components/ui/button';
import { FormField } from './FormField';
import { Separator } from '@/components/ui/separator';

interface AIFormState {
  prompt: string;
  generatedContent: string;
  title: string;
}

interface AIGeneratorFormProps {
  formState: AIFormState;
  onChange: (updates: Partial<AIFormState>) => void;
  onGenerateContent: () => Promise<void>;
  isSubmitting: boolean;
}

export const AIGeneratorForm: React.FC<AIGeneratorFormProps> = ({
  formState,
  onChange,
  onGenerateContent,
  isSubmitting
}) => {
  return (
    <div className="space-y-4">
      <FormField
        id="ai-prompt"
        label="Prompt"
        placeholder="Enter a prompt for AI to generate content"
        value={formState.prompt}
        onChange={(e) => onChange({ prompt: e.target.value })}
        multiline
        rows={3}
        disabled={isSubmitting}
      />
      
      <Button 
        type="button" 
        onClick={onGenerateContent}
        disabled={isSubmitting || !formState.prompt}
        className="w-full"
      >
        {isSubmitting ? "Generating..." : "Generate Content"}
      </Button>
      
      {formState.generatedContent && (
        <>
          <Separator />
          
          <FormField
            id="ai-title"
            label="Title"
            placeholder="Title for the generated content"
            value={formState.title}
            onChange={(e) => onChange({ title: e.target.value })}
            disabled={isSubmitting}
          />
          
          <FormField
            id="ai-content"
            label="Generated Content"
            placeholder="AI-generated content will appear here"
            value={formState.generatedContent}
            onChange={(e) => onChange({ generatedContent: e.target.value })}
            multiline
            rows={8}
            disabled={isSubmitting}
          />
        </>
      )}
    </div>
  );
};
