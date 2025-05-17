
import React, { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { WikiArticle } from "./types";
import { useAuth } from "@/lib/auth";
import { updateWikiArticle } from "@/utils/wikiUtils";
import { categories } from "./CategorySidebar";

interface EditWikiArticleDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  article: WikiArticle;
  onSuccess: (article: WikiArticle) => void;
}

export const EditWikiArticleDialog = ({ 
  isOpen, 
  onOpenChange,
  article,
  onSuccess
}: EditWikiArticleDialogProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState(article.title);
  const [description, setDescription] = useState(article.description);
  const [content, setContent] = useState(article.content || "");
  const [category, setCategory] = useState(article.category);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to edit articles",
        variant: "destructive"
      });
      return;
    }

    if (!title || !description || !content || !category) {
      toast({
        title: "Required Fields Missing",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      const { article: updatedArticle, error } = await updateWikiArticle(
        article.id, 
        {
          title,
          description,
          content,
          category,
          tags: article.tags
        },
        user.id
      );
      
      if (error) throw new Error(error.toString());
      
      if (updatedArticle) {
        toast({
          title: "Article Updated",
          description: "The wiki article has been updated successfully!",
        });
        
        if (onSuccess) {
          onSuccess(updatedArticle);
        }
      }
    } catch (err: any) {
      console.error("Error updating article:", err);
      toast({
        title: "Error",
        description: err.message || "Failed to update article",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Wiki Article</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="Enter article title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Brief description of the article"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={2}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content">Content *</Label>
            <Textarea
              id="content"
              placeholder="The main content of your article. You can use Markdown formatting."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={10}
            />
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="flex items-center gap-2"
            >
              {isSubmitting && <Loader2 size={16} className="animate-spin" />}
              {isSubmitting ? "Updating..." : "Update Article"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
