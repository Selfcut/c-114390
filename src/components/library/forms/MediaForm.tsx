
import React from 'react';
import { FormField } from './FormField';
import { Label } from '@/components/ui/label';

interface MediaFormState {
  title: string;
  content: string;
  type: 'image' | 'video' | 'document' | 'youtube' | 'text';
  file: File | null;
  youtubeUrl: string;
}

interface MediaFormProps {
  formState: MediaFormState;
  onChange: (updates: Partial<MediaFormState>) => void;
  isSubmitting: boolean;
}

export const MediaForm: React.FC<MediaFormProps> = ({
  formState,
  onChange,
  isSubmitting
}) => {
  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    onChange({ file: e.target.files[0] });
  };

  const getAcceptString = () => {
    switch (formState.type) {
      case 'image': return 'image/*';
      case 'video': return 'video/*';
      case 'document': return '.pdf,.doc,.docx';
      default: return '*';
    }
  };

  return (
    <div className="space-y-4">
      <FormField
        id="media-title"
        label="Title"
        placeholder="Media post title"
        value={formState.title}
        onChange={(e) => onChange({ title: e.target.value })}
        required
        disabled={isSubmitting}
      />
      
      <FormField
        id="media-content"
        label="Description"
        placeholder="Description of your media post"
        value={formState.content}
        onChange={(e) => onChange({ content: e.target.value })}
        multiline
        disabled={isSubmitting}
      />
      
      <div className="space-y-2">
        <Label htmlFor="media-type">Media Type</Label>
        <select 
          id="media-type"
          value={formState.type}
          onChange={(e) => onChange({ type: e.target.value as any })}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={isSubmitting}
        >
          <option value="image">Image</option>
          <option value="video">Video</option>
          <option value="document">Document</option>
          <option value="youtube">YouTube</option>
          <option value="text">Text Only</option>
        </select>
      </div>
      
      {formState.type === 'youtube' ? (
        <FormField
          id="media-youtube"
          label="YouTube URL"
          placeholder="https://www.youtube.com/watch?v=..."
          value={formState.youtubeUrl}
          onChange={(e) => onChange({ youtubeUrl: e.target.value })}
          disabled={isSubmitting}
        />
      ) : formState.type !== 'text' && (
        <FormField
          id="media-file"
          label="File"
          type="file"
          value=""
          accept={getAcceptString()}
          onChange={handleFileChange}
          disabled={isSubmitting}
        />
      )}
    </div>
  );
};
