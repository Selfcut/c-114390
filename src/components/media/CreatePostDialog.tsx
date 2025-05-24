
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Loader2, Upload } from 'lucide-react';
import { CreatePostData } from '@/hooks/media/types';

interface CreatePostDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreatePostData) => Promise<any>;
  isSubmitting?: boolean;
}

export const CreatePostDialog: React.FC<CreatePostDialogProps> = ({
  isOpen,
  onOpenChange,
  onSubmit,
  isSubmitting = false
}) => {
  const [formData, setFormData] = useState<{
    title: string;
    content: string;
    type: string;
    url: string;
    file: File | null;
  }>({
    title: '',
    content: '',
    type: 'text',
    url: '',
    file: null
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) return;

    try {
      await onSubmit({
        title: formData.title,
        content: formData.content,
        type: formData.type,
        url: formData.url || undefined,
        file: formData.file || undefined,
        user_id: '', // This will be set in the hook
        tags: []
      });
      
      // Reset form
      setFormData({
        title: '',
        content: '',
        type: 'text',
        url: '',
        file: null
      });
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, file: e.target.files![0] }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Media Post</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter post title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Description</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Add a description (optional)"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Media Type</Label>
            <Select 
              value={formData.type} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Text Only</SelectItem>
                <SelectItem value="image">Image</SelectItem>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="document">Document</SelectItem>
                <SelectItem value="youtube">YouTube Video</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.type === 'youtube' ? (
            <div className="space-y-2">
              <Label htmlFor="url">YouTube URL</Label>
              <Input
                id="url"
                value={formData.url}
                onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                placeholder="https://www.youtube.com/watch?v=..."
              />
            </div>
          ) : formData.type !== 'text' ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="url">Media URL (Optional)</Label>
                <Input
                  id="url"
                  value={formData.url}
                  onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                  placeholder="Or provide a direct URL"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="file">Upload File</Label>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
                  <input
                    id="file"
                    type="file"
                    onChange={handleFileChange}
                    accept={
                      formData.type === 'image' ? 'image/*' :
                      formData.type === 'video' ? 'video/*' :
                      formData.type === 'document' ? '.pdf,.doc,.docx,.txt' :
                      '*/*'
                    }
                    className="w-full cursor-pointer"
                  />
                  {formData.file && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Selected: {formData.file.name}
                    </p>
                  )}
                </div>
              </div>
            </>
          ) : null}

          <div className="flex justify-end space-x-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !formData.title.trim()}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Create Post
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
