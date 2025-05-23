
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';

interface ContentSubmissionModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTab?: string;
  onSubmitSuccess?: () => void;
}

export const ContentSubmissionModal: React.FC<ContentSubmissionModalProps> = ({
  isOpen,
  onOpenChange,
  defaultTab = 'knowledge',
  onSubmitSuccess
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitKnowledge = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    
    try {
      const { error } = await supabase
        .from('knowledge_entries')
        .insert({
          title: formData.get('title') as string,
          summary: formData.get('summary') as string,
          content: formData.get('content') as string,
          categories: (formData.get('categories') as string).split(',').map(c => c.trim()),
          user_id: user.id
        });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Knowledge entry created successfully!'
      });
      
      onOpenChange(false);
      onSubmitSuccess?.();
    } catch (error) {
      console.error('Error creating knowledge entry:', error);
      toast({
        title: 'Error',
        description: 'Failed to create knowledge entry',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitQuote = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    
    try {
      const { error } = await supabase
        .from('quotes')
        .insert({
          text: formData.get('text') as string,
          author: formData.get('author') as string,
          source: formData.get('source') as string,
          category: formData.get('category') as string,
          tags: (formData.get('tags') as string).split(',').map(t => t.trim()),
          user_id: user.id
        });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Quote added successfully!'
      });
      
      onOpenChange(false);
      onSubmitSuccess?.();
    } catch (error) {
      console.error('Error creating quote:', error);
      toast({
        title: 'Error',
        description: 'Failed to add quote',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Content</DialogTitle>
          <DialogDescription>
            Share your knowledge with the community
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="knowledge">Knowledge</TabsTrigger>
            <TabsTrigger value="quote">Quote</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
            <TabsTrigger value="forum">Forum</TabsTrigger>
          </TabsList>

          <TabsContent value="knowledge" className="space-y-4">
            <form onSubmit={handleSubmitKnowledge} className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" required />
              </div>
              <div>
                <Label htmlFor="summary">Summary</Label>
                <Textarea id="summary" name="summary" required />
              </div>
              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea id="content" name="content" rows={6} />
              </div>
              <div>
                <Label htmlFor="categories">Categories (comma-separated)</Label>
                <Input id="categories" name="categories" placeholder="science, technology, health" />
              </div>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Knowledge Entry'}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="quote" className="space-y-4">
            <form onSubmit={handleSubmitQuote} className="space-y-4">
              <div>
                <Label htmlFor="text">Quote Text</Label>
                <Textarea id="text" name="text" required />
              </div>
              <div>
                <Label htmlFor="author">Author</Label>
                <Input id="author" name="author" required />
              </div>
              <div>
                <Label htmlFor="source">Source (optional)</Label>
                <Input id="source" name="source" />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Input id="category" name="category" required />
              </div>
              <div>
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input id="tags" name="tags" placeholder="motivation, life, success" />
              </div>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Adding...' : 'Add Quote'}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="media" className="space-y-4">
            <div className="text-center py-8 text-muted-foreground">
              Media submission coming soon...
            </div>
          </TabsContent>

          <TabsContent value="forum" className="space-y-4">
            <div className="text-center py-8 text-muted-foreground">
              Forum post creation coming soon...
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
