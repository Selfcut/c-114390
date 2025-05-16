
import React from 'react';
import { FormField } from './FormField';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface MediaFormState {
  title: string;
  content: string;
  mediaType: 'image' | 'video' | 'document' | 'youtube' | 'text';
  mediaUrl: string;
  mediaFile: File | null;
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
    onChange({ mediaFile: e.target.files[0] });
  };
  
  // Handle media type change
  const handleMediaTypeChange = (value: string) => {
    onChange({ 
      mediaType: value as 'image' | 'video' | 'document' | 'youtube' | 'text',
      // Clear URL and file when changing types
      ...(value === 'text' ? { mediaUrl: '', mediaFile: null } : {})
    });
  };

  return (
    <div className="space-y-4">
      <FormField
        id="media-title"
        label="Title"
        placeholder="Media title"
        value={formState.title}
        onChange={(e) => onChange({ title: e.target.value })}
        required
        disabled={isSubmitting}
      />
      
      <FormField
        id="media-content"
        label="Description"
        placeholder="A brief description of this media"
        value={formState.content}
        onChange={(e) => onChange({ content: e.target.value })}
        multiline
        disabled={isSubmitting}
      />
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Media Type</label>
        <Select
          value={formState.mediaType}
          onValueChange={handleMediaTypeChange}
          disabled={isSubmitting}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select media type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="image">Image</SelectItem>
            <SelectItem value="video">Video</SelectItem>
            <SelectItem value="document">Document</SelectItem>
            <SelectItem value="youtube">YouTube</SelectItem>
            <SelectItem value="text">Text Only</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {formState.mediaType !== 'text' && (
        <>
          {formState.mediaType === 'youtube' ? (
            <FormField
              id="media-url"
              label="YouTube URL"
              placeholder="e.g. https://www.youtube.com/watch?v=example"
              value={formState.mediaUrl}
              onChange={(e) => onChange({ mediaUrl: e.target.value })}
              disabled={isSubmitting}
              helperText="Enter the full YouTube video URL"
            />
          ) : (
            <>
              <FormField
                id="media-url"
                label="Media URL (Optional)"
                placeholder="URL to external media"
                value={formState.mediaUrl}
                onChange={(e) => onChange({ mediaUrl: e.target.value })}
                disabled={isSubmitting}
                helperText="You can provide a URL or upload a file"
              />
              
              <div className="space-y-2">
                <label htmlFor="media-file" className="text-sm font-medium">
                  Upload Media
                </label>
                <input
                  id="media-file"
                  type="file"
                  accept={
                    formState.mediaType === 'image' ? 'image/*' :
                    formState.mediaType === 'video' ? 'video/*' :
                    formState.mediaType === 'document' ? '.pdf,.doc,.docx,.txt' :
                    '*/*'
                  }
                  onChange={handleFileChange}
                  disabled={isSubmitting}
                  className="w-full cursor-pointer rounded-md border border-input bg-background px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium"
                />
                {formState.mediaFile && (
                  <p className="text-xs text-muted-foreground">
                    Selected: {formState.mediaFile.name}
                  </p>
                )}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};
