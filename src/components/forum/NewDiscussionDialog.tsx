
import React, { useState } from 'react';
import { Send } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/lib/auth';
import { supabase } from "@/integrations/supabase/client";

interface NewDiscussionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (postId: string) => void;
}

export const NewDiscussionDialog = ({ 
  isOpen, 
  onClose, 
  onSuccess 
}: NewDiscussionDialogProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newDiscussion, setNewDiscussion] = useState({
    title: '',
    content: '',
    tags: ''
  });

  const handleSubmit = async () => {
    if (!newDiscussion.title || !newDiscussion.content) {
      toast({
        title: "Required Fields Missing",
        description: "Please provide a title and content for your discussion",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const tagsArray = newDiscussion.tags 
        ? newDiscussion.tags.split(',').map(tag => tag.trim()).filter(Boolean) 
        : [];

      // Insert new post to database with proper error handling
      const { data, error } = await supabase
        .from('forum_posts')
        .insert({
          title: newDiscussion.title,
          content: newDiscussion.content,
          user_id: user?.id,
          tags: tagsArray,
          upvotes: 0,
          views: 1,
          comments: 0,
          is_pinned: false
        })
        .select();
        
      if (error) {
        console.error('Forum post creation error:', error);
        throw error;
      }

      if (data && data[0]) {
        setNewDiscussion({ title: '', content: '', tags: '' });
        onClose();

        toast({
          title: "Discussion Created",
          description: "Your new discussion has been posted successfully!",
        });
        
        // Return the new post id to the parent component
        onSuccess(data[0].id);
      }
    } catch (err: any) {
      console.error('Error creating discussion:', err);
      toast({
        title: "Error",
        description: err.message || "Failed to create discussion",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Discussion</DialogTitle>
          <DialogDescription>
            Share your thoughts with the community. Be respectful and follow our community guidelines.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh]">
          <div className="space-y-4 p-1">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input 
                id="title" 
                placeholder="Add a descriptive title" 
                value={newDiscussion.title}
                onChange={(e) => setNewDiscussion({...newDiscussion, title: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea 
                id="content" 
                placeholder="Share your thoughts, questions, or ideas..."
                className="min-h-[200px]"
                value={newDiscussion.content}
                onChange={(e) => setNewDiscussion({...newDiscussion, content: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input 
                id="tags" 
                placeholder="philosophy, consciousness, etc."
                value={newDiscussion.tags}
                onChange={(e) => setNewDiscussion({...newDiscussion, tags: e.target.value})}
              />
            </div>
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting || !newDiscussion.title || !newDiscussion.content}
            className="flex items-center gap-2"
          >
            {isSubmitting ? "Posting..." : (
              <>
                <Send size={16} />
                <span>Post Discussion</span>
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
