
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Loader2, Upload, AlertCircle, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CreatePostData } from '@/hooks/media/types';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { useUploadProgress } from '@/hooks/useUploadProgress';
import { validatePostData, validateMediaFile, validateYouTubeUrl } from '@/utils/contentValidation';

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
  const { user } = useAuth();
  const { toast } = useToast();
  const uploadProgress = useUploadProgress();
  
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

  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const validateForm = () => {
    const validation = validatePostData(formData);
    setValidationErrors(validation.errors);
    return validation.isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) {
      toast({
        title: "Authentication Required",
        description: "Please log in to create a post",
        variant: "destructive"
      });
      return;
    }
    
    if (!validateForm()) {
      return;
    }

    try {
      uploadProgress.startUpload();
      uploadProgress.updateProgress(25);

      await onSubmit({
        title: formData.title,
        content: formData.content,
        type: formData.type,
        url: formData.url || undefined,
        file: formData.file || undefined,
        user_id: user.id,
        tags: []
      });
      
      uploadProgress.completeUpload();
      
      // Reset form on success
      setFormData({
        title: '',
        content: '',
        type: 'text',
        url: '',
        file: null
      });
      setValidationErrors([]);
      
      onOpenChange(false);
      
      toast({
        title: "Success",
        description: "Your media post has been created successfully"
      });
    } catch (error: any) {
      console.error('Error creating post:', error);
      uploadProgress.failUpload(error.message || "Failed to create post");
      toast({
        title: "Error",
        description: error.message || "Failed to create post. Please try again.",
        variant: "destructive"
      });
    } finally {
      setTimeout(() => uploadProgress.resetUpload(), 2000);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      const validation = validateMediaFile(file);
      if (!validation.isValid) {
        toast({
          title: "Invalid File",
          description: validation.error,
          variant: "destructive"
        });
        return;
      }
      
      setFormData(prev => ({ ...prev, file }));
    }
  };

  const handleUrlChange = (value: string) => {
    setFormData(prev => ({ ...prev, url: value }));
    
    if (formData.type === 'youtube' && value) {
      const validation = validateYouTubeUrl(value);
      if (!validation.isValid) {
        setValidationErrors([validation.error || 'Invalid YouTube URL']);
      } else {
        setValidationErrors([]);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      type: 'text',
      url: '',
      file: null
    });
    setValidationErrors([]);
    uploadProgress.resetUpload();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      onOpenChange(open);
      if (!open) resetForm();
    }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Media Post</DialogTitle>
        </DialogHeader>
        
        {validationErrors.length > 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <ul className="list-disc list-inside space-y-1">
                {validationErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {uploadProgress.error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{uploadProgress.error}</AlertDescription>
          </Alert>
        )}

        {uploadProgress.isUploading && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Uploading...</span>
              <span>{uploadProgress.progress}%</span>
            </div>
            <Progress value={uploadProgress.progress} className="w-full" />
          </div>
        )}

        {uploadProgress.progress === 100 && !uploadProgress.isUploading && !uploadProgress.error && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>Post created successfully!</AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter post title"
              required
              disabled={isSubmitting || uploadProgress.isUploading}
              maxLength={200}
            />
            <p className="text-xs text-muted-foreground">
              {formData.title.length}/200 characters
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Description</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Add a description (optional)"
              rows={3}
              disabled={isSubmitting || uploadProgress.isUploading}
              maxLength={5000}
            />
            <p className="text-xs text-muted-foreground">
              {formData.content.length}/5000 characters
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Media Type</Label>
            <Select 
              value={formData.type} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, type: value, url: '', file: null }))}
              disabled={isSubmitting || uploadProgress.isUploading}
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
              <Label htmlFor="url">YouTube URL *</Label>
              <Input
                id="url"
                value={formData.url}
                onChange={(e) => handleUrlChange(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                disabled={isSubmitting || uploadProgress.isUploading}
                required
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
                  disabled={isSubmitting || uploadProgress.isUploading}
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
                    disabled={isSubmitting || uploadProgress.isUploading}
                  />
                  {formData.file && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Selected: {formData.file.name} ({(formData.file.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">
                    Maximum file size: 10MB
                  </p>
                </div>
              </div>
            </>
          ) : null}

          <div className="flex justify-end space-x-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting || uploadProgress.isUploading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || uploadProgress.isUploading || !formData.title.trim() || validationErrors.length > 0}
            >
              {isSubmitting || uploadProgress.isUploading ? (
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
