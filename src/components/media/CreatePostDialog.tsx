
import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Image, Film, FileText, Youtube, Upload, Loader2, X } from "lucide-react";

interface CreatePostDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
}

export const CreatePostDialog = ({
  isOpen,
  onOpenChange,
  onSubmit,
  isSubmitting
}: CreatePostDialogProps) => {
  const [activeTab, setActiveTab] = useState<string>("text");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset form when closed
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      resetForm();
    }
    onOpenChange(open);
  };

  const resetForm = () => {
    setActiveTab("text");
    setTitle("");
    setContent("");
    setYoutubeUrl("");
    setSelectedFile(null);
    setFilePreview(null);
    setFileError(null);
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      setFileError(`File too large. Maximum size is 10MB.`);
      setSelectedFile(null);
      setFilePreview(null);
      return;
    }

    setFileError(null);
    setSelectedFile(file);

    // Create preview for images
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFilePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setFilePreview(null);
    }
  };

  // Handle form submission
  const handleSubmit = () => {
    if (!title) {
      return;
    }

    const postData: any = {
      title,
      type: activeTab,
    };

    switch (activeTab) {
      case "text":
        postData.content = content;
        break;
      case "image":
      case "video":
      case "document":
        postData.file = selectedFile;
        break;
      case "youtube":
        postData.youtubeUrl = youtubeUrl;
        break;
    }

    onSubmit(postData);
  };

  // Clear file selection
  const clearFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Get file type from activeTab
  const getMediaType = () => {
    switch (activeTab) {
      case "image":
        return "image/*";
      case "video":
        return "video/*";
      case "document":
        return ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx";
      default:
        return "";
    }
  };

  // Determine if form is valid
  const isFormValid = () => {
    if (!title) return false;

    switch (activeTab) {
      case "text":
        return !!content;
      case "image":
      case "video":
      case "document":
        return !!selectedFile && !fileError;
      case "youtube":
        return !!youtubeUrl;
      default:
        return false;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Post</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Add a title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1"
              required
            />
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-5">
              <TabsTrigger value="text" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Text</span>
              </TabsTrigger>
              <TabsTrigger value="image" className="flex items-center gap-2">
                <Image className="h-4 w-4" />
                <span className="hidden sm:inline">Image</span>
              </TabsTrigger>
              <TabsTrigger value="video" className="flex items-center gap-2">
                <Film className="h-4 w-4" />
                <span className="hidden sm:inline">Video</span>
              </TabsTrigger>
              <TabsTrigger value="document" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Document</span>
              </TabsTrigger>
              <TabsTrigger value="youtube" className="flex items-center gap-2">
                <Youtube className="h-4 w-4" />
                <span className="hidden sm:inline">YouTube</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="text" className="mt-4">
              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  placeholder="Share your thoughts..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="mt-1"
                  rows={6}
                />
              </div>
            </TabsContent>

            <TabsContent value="image" className="mt-4">
              <div className="space-y-4">
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 cursor-pointer hover:border-muted-foreground/50 transition-colors">
                  <Input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <Label htmlFor="image-upload" className="cursor-pointer w-full h-full">
                    {filePreview ? (
                      <div className="relative">
                        <img
                          src={filePreview}
                          alt="Preview"
                          className="max-h-60 mx-auto"
                        />
                        <Button
                          type="button"
                          size="icon"
                          variant="destructive"
                          className="absolute top-0 right-0 h-7 w-7"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            clearFile();
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                        <p>Click to upload an image</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          JPG, PNG, GIF up to 10MB
                        </p>
                      </div>
                    )}
                  </Label>
                </div>

                {fileError && (
                  <Alert variant="destructive">
                    <AlertDescription>{fileError}</AlertDescription>
                  </Alert>
                )}
              </div>
            </TabsContent>

            <TabsContent value="video" className="mt-4">
              <div className="space-y-4">
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 cursor-pointer hover:border-muted-foreground/50 transition-colors">
                  <Input
                    ref={fileInputRef}
                    type="file"
                    accept="video/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="video-upload"
                  />
                  <Label htmlFor="video-upload" className="cursor-pointer w-full h-full">
                    {selectedFile && selectedFile.type.startsWith("video/") ? (
                      <div className="relative flex items-center justify-center">
                        <Film className="h-20 w-20 text-muted-foreground mb-2" />
                        <p className="text-sm mt-2">
                          Selected: {selectedFile.name}
                        </p>
                        <Button
                          type="button"
                          size="icon"
                          variant="destructive"
                          className="absolute top-0 right-0 h-7 w-7"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            clearFile();
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                        <p>Click to upload a video</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          MP4, WebM up to 10MB
                        </p>
                      </div>
                    )}
                  </Label>
                </div>

                {fileError && (
                  <Alert variant="destructive">
                    <AlertDescription>{fileError}</AlertDescription>
                  </Alert>
                )}
              </div>
            </TabsContent>

            <TabsContent value="document" className="mt-4">
              <div className="space-y-4">
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 cursor-pointer hover:border-muted-foreground/50 transition-colors">
                  <Input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                    onChange={handleFileChange}
                    className="hidden"
                    id="document-upload"
                  />
                  <Label htmlFor="document-upload" className="cursor-pointer w-full h-full">
                    {selectedFile ? (
                      <div className="relative flex items-center justify-center">
                        <FileText className="h-20 w-20 text-muted-foreground mb-2" />
                        <p className="text-sm mt-2">
                          Selected: {selectedFile.name}
                        </p>
                        <Button
                          type="button"
                          size="icon"
                          variant="destructive"
                          className="absolute top-0 right-0 h-7 w-7"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            clearFile();
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                        <p>Click to upload a document</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          PDF, DOC, XLS, PPT up to 10MB
                        </p>
                      </div>
                    )}
                  </Label>
                </div>

                {fileError && (
                  <Alert variant="destructive">
                    <AlertDescription>{fileError}</AlertDescription>
                  </Alert>
                )}
              </div>
            </TabsContent>

            <TabsContent value="youtube" className="mt-4">
              <div>
                <Label htmlFor="youtube-url">YouTube URL</Label>
                <Input
                  id="youtube-url"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Paste a link to a YouTube video
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !isFormValid()}
            className="flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Creating Post...</span>
              </>
            ) : (
              <span>Create Post</span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
