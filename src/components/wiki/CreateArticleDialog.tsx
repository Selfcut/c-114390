
import React, { useState } from "react";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, 
  DialogDescription, DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BookOpen, Loader2 } from "lucide-react";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { categories } from "./CategorySidebar";
import { WikiArticle } from "./types";

interface CreateArticleDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (article: Omit<WikiArticle, "id" | "lastUpdated" | "contributors" | "views">) => void;
  isSubmitting: boolean;
}

export const CreateArticleDialog = ({ 
  isOpen, 
  onOpenChange, 
  onSubmit,
  isSubmitting 
}: CreateArticleDialogProps) => {
  const [newArticle, setNewArticle] = useState({
    title: "",
    description: "",
    category: "",
    content: ""
  });

  const handleSubmit = () => {
    onSubmit(newArticle);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Create New Wiki Article</DialogTitle>
          <DialogDescription>
            Contribute to the community's knowledge base. Add a comprehensive, well-researched article.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh]">
          <div className="space-y-4 p-1">
            <div className="space-y-2">
              <Label htmlFor="article-title">Title</Label>
              <Input
                id="article-title"
                placeholder="Enter a descriptive title"
                value={newArticle.title}
                onChange={(e) => setNewArticle({...newArticle, title: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="article-description">Brief Description</Label>
              <Input
                id="article-description"
                placeholder="A short summary of this article (1-2 sentences)"
                value={newArticle.description}
                onChange={(e) => setNewArticle({...newArticle, description: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="article-category">Category</Label>
              <Select 
                value={newArticle.category} 
                onValueChange={(value) => setNewArticle({...newArticle, category: value})}
              >
                <SelectTrigger id="article-category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center gap-2">
                        {category.icon}
                        <span>{category.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="article-content">Content</Label>
              <Textarea
                id="article-content"
                placeholder="Write your article content here..."
                className="min-h-[300px]"
                value={newArticle.content}
                onChange={(e) => setNewArticle({...newArticle, content: e.target.value})}
              />
              <p className="text-xs text-muted-foreground">
                You can use Markdown syntax for formatting. *italic* for italic text, **bold** for bold text, etc.
              </p>
            </div>
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting || !newArticle.title || !newArticle.description || !newArticle.category || !newArticle.content}
            className="flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Publishing...</span>
              </>
            ) : (
              <>
                <BookOpen size={16} />
                <span>Publish Article</span>
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
