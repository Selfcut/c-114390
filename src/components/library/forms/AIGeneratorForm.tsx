
import React from 'react';
import { FormField } from './FormField';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface AIFormState {
  prompt: string;
  category: string;
  outputType: string;
}

interface AIGeneratorFormProps {
  formState: AIFormState;
  onChange: (updates: Partial<AIFormState>) => void;
  isSubmitting: boolean;
}

export const AIGeneratorForm: React.FC<AIGeneratorFormProps> = ({
  formState,
  onChange,
  isSubmitting
}) => {
  // Category options
  const categories = [
    'Philosophy', 'Science', 'Art', 'History', 'Technology',
    'Spirituality', 'Psychology', 'Literature', 'Other'
  ];
  
  return (
    <div className="space-y-6">
      <FormField
        id="ai-prompt"
        label="Prompt for AI"
        placeholder="Describe what content you want the AI to generate"
        value={formState.prompt}
        onChange={(e) => onChange({ prompt: e.target.value })}
        multiline
        rows={4}
        required
        disabled={isSubmitting}
        helperText="Be specific about the type of content you want to generate"
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
      
      <div className="space-y-3">
        <div className="text-sm font-medium">Output Type</div>
        <RadioGroup 
          value={formState.outputType} 
          onValueChange={(value) => onChange({ outputType: value })}
          className="flex flex-col space-y-1"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="knowledge" id="output-knowledge" disabled={isSubmitting} />
            <Label htmlFor="output-knowledge">Knowledge Entry</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="quote" id="output-quote" disabled={isSubmitting} />
            <Label htmlFor="output-quote">Quote</Label>
          </div>
        </RadioGroup>
        <p className="text-xs text-muted-foreground">
          Select the type of content you want the AI to generate
        </p>
      </div>
      
      <div className="p-3 bg-muted rounded-md">
        <p className="text-sm text-muted-foreground">
          <strong>Note:</strong> AI-generated content will be marked as such. You'll have a chance to review and edit the generated content before publishing.
        </p>
      </div>
    </div>
  );
};
