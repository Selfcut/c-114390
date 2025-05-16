
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { FileVideo, FileImage, File, Youtube, Upload, Loader2 } from 'lucide-react';

interface CreatePostDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (postData: any) => void;
  isSubmitting: boolean;
}

export const CreatePostDialog = ({ isOpen, onOpenChange, onSubmit, isSubmitting }: CreatePostDialogProps) => {
  const [postType, setPostType] = useState('video');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files && e.target.files[0];
    if (!selectedFile) return;
    
    setFile(selectedFile);
    
    // Create a preview URL for images
    if (selectedFile.type.startsWith('image/')) {
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(objectUrl);
    } else {
      setPreviewUrl('');
    }
  };

  const handleSubmit = () => {
    // Validate based on post type
    if (!title) {
      alert('Please add a title for your post');
      return;
    }
    
    if (postType === 'youtube' && !youtubeUrl) {
      alert('Please add a YouTube URL');
      return;
    }
    
    if (postType !== 'youtube' && !file) {
      alert('Please upload a file');
      return;
    }
    
    onSubmit({
      type: postType,
      title,
      content,
      file,
      youtubeUrl
    });
  };

  const handleTypeChange = (value: string) => {
    setPostType(value);
    setFile(null);
    setYoutubeUrl('');
    setPreviewUrl('');
  };

  // Reset form when dialog closes
  React.useEffect(() => {
    if (!isOpen) {
      setTitle('');
      setContent('');
      setFile(null);
      setYoutubeUrl('');
      setPreviewUrl('');
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Share Media Content</DialogTitle>
          <DialogDescription>
            Upload videos, images, documents, or share YouTube links with the community.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="video" value={postType} onValueChange={handleTypeChange} className="mt-4">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="video" className="flex gap-2 items-center">
              <FileVideo className="h-4 w-4" />
              <span>Video</span>
            </TabsTrigger>
            <TabsTrigger value="image" className="flex gap-2 items-center">
              <FileImage className="h-4 w-4" />
              <span>Image</span>
            </TabsTrigger>
            <TabsTrigger value="document" className="flex gap-2 items-center">
              <File className="h-4 w-4" />
              <span>Document</span>
            </TabsTrigger>
            <TabsTrigger value="youtube" className="flex gap-2 items-center">
              <Youtube className="h-4 w-4" />
              <span>YouTube</span>
            </TabsTrigger>
          </TabsList>
          
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input 
                id="title" 
                placeholder="Add a title for your post" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="content">Description (optional)</Label>
              <Textarea 
                id="content" 
                placeholder="Add a description for your post" 
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
            
            <TabsContent value="video" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="videoUpload">Upload Video</Label>
                <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center">
                  <FileVideo className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Drag and drop video files here or click to browse
                  </p>
                  <Input 
                    id="videoUpload" 
                    type="file" 
                    accept="video/*"
                    className="mt-2 max-w-sm"
                    onChange={handleFileChange}
                  />
                  {file && (
                    <p className="text-sm mt-2">Selected: {file.name}</p>
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="image" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="imageUpload">Upload Image</Label>
                <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center">
                  <FileImage className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Drag and drop image files here or click to browse
                  </p>
                  <Input 
                    id="imageUpload" 
                    type="file" 
                    accept="image/*"
                    className="mt-2 max-w-sm"
                    onChange={handleFileChange}
                  />
                  {previewUrl && (
                    <div className="mt-4 max-w-xs">
                      <img 
                        src={previewUrl} 
                        alt="Preview" 
                        className="rounded-md max-h-40 object-contain"
                      />
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="document" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="documentUpload">Upload Document</Label>
                <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center">
                  <File className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Drag and drop document files here or click to browse
                  </p>
                  <Input 
                    id="documentUpload" 
                    type="file" 
                    accept=".pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx"
                    className="mt-2 max-w-sm"
                    onChange={handleFileChange}
                  />
                  {file && (
                    <p className="text-sm mt-2">Selected: {file.name}</p>
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="youtube" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="youtubeUrl">YouTube URL</Label>
                <Input 
                  id="youtubeUrl" 
                  placeholder="https://www.youtube.com/watch?v=..." 
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Share a YouTube video by pasting the URL here
                </p>
              </div>
            </TabsContent>
          </div>
        </Tabs>
        
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting || (!title) || (postType === 'youtube' && !youtubeUrl) || (postType !== 'youtube' && !file)}
            className="flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                <span>Share</span>
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
