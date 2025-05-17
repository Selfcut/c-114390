
import React from 'react';
import { MessageSquare, PenSquare } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/lib/auth';
import { useToast } from "@/hooks/use-toast";

interface ForumHeaderProps {
  onCreateDiscussion: () => void;
}

export const ForumHeader = ({ onCreateDiscussion }: ForumHeaderProps) => {
  const { user } = useAuth();
  const isAuthenticated = !!user;
  const { toast } = useToast();

  const handleCreateDiscussion = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to create a new discussion",
        variant: "destructive"
      });
      return;
    }
    
    onCreateDiscussion();
  };

  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold flex items-center gap-3">
        <MessageSquare size={28} />
        Forum
      </h1>
      <Button 
        className="flex items-center gap-2"
        onClick={handleCreateDiscussion}
      >
        <PenSquare size={18} />
        <span>New Discussion</span>
      </Button>
    </div>
  );
};
