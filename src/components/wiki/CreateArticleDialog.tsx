
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/auth';
import { createWikiArticle } from '@/utils/wikiUtils';
import { WikiArticle } from './types';
import { Loader2 } from 'lucide-react';
import { categories } from './CategorySidebar';

interface CreateArticleDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (article: WikiArticle) => void;
}

export const CreateArticleDialog: React.FC<CreateArticleDialogProps> = ({
  isOpen,
  onOpenChange,
  onSuccess
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    category: 'Philosophy',
    tagsInput: '',
    imageUrl: ''
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, category: value }));
  };
  
  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be signed in to create an article",
        variant: "destructive"
      });
      return;
    }
    
    if (!formData.title || !formData.description || !formData.content || !formData.category) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Process tags
      const tags = formData.tagsInput
        ? formData.tagsInput.split(',').map(tag => tag.trim().toLowerCase())
        : [];
      
      // Create article - Fixed: renamed imageUrl to image_url
      const { article, error } = await createWikiArticle({
        title: formData.title,
        description: formData.description,
        content: formData.content,
        category: formData.category,
        tags,
        user_id: user.id,
        image_url: formData.imageUrl || undefined
      });
      
      if (error) throw error;
      
      if (article) {
        toast({
          title: "Article Created",
          description: "Your article has been published successfully!",
        });
        
        // Convert the returned article to the expected format
        const newArticle: WikiArticle = {
          ...article,
          created_at: new Date(article.created_at),
          last_updated: new Date(article.last_updated),
          author_name: user.name || user.username || 'Anonymous'
        };
        
        onSuccess(newArticle);
        onOpenChange(false);
        resetForm();
      }
    } catch (err: any) {
      console.error('Error creating article:', err);
      toast({
        title: "Error",
        description: err.message || "Failed to create article",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      content: '',
      category: 'Philosophy',
      tagsInput: '',
      imageUrl: ''
    });
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Create New Article</DialogTitle>
          <DialogDescription>
            Share your knowledge with the community. Fill in the details below to create a new article.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              name="title"
              placeholder="Enter article title"
              value={formData.title}
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="A brief description of the article (1-2 sentences)"
              value={formData.description}
              onChange={handleChange}
              rows={2}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select value={formData.category} onValueChange={handleSelectChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories
                  .filter(cat => cat.value !== null) // Filter out "All Categories"
                  .map((cat) => (
                    <SelectItem key={cat.value} value={cat.value as string}>
                      {cat.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="tagsInput">Tags (comma-separated)</Label>
            <Input
              id="tagsInput"
              name="tagsInput"
              placeholder="philosophy, knowledge, etc."
              value={formData.tagsInput}
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="imageUrl">Cover Image URL (optional)</Label>
            <Input
              id="imageUrl"
              name="imageUrl"
              placeholder="https://example.com/image.jpg"
              value={formData.imageUrl}
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content">Content *</Label>
            <Textarea
              id="content"
              name="content"
              placeholder="Write your article content here. Markdown formatting is supported."
              value={formData.content}
              onChange={handleChange}
              rows={10}
              className="font-mono"
            />
            <p className="text-xs text-muted-foreground">
              Use markdown formatting: # for headings, ** for bold, * for italic, - for lists.
            </p>
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => {
              resetForm();
              onOpenChange(false);
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting || !formData.title || !formData.description || !formData.content}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Article'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
