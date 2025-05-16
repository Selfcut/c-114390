import React from "react";
import { Button } from "@/components/ui/button";
import { BookOpen, Plus } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

interface WikiHeaderProps {
  onCreateArticle: () => void;
}

export const WikiHeader = ({ onCreateArticle }: WikiHeaderProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const isAuthenticated = !!user;
  
  const handleCreateArticle = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to create new wiki articles",
        variant: "destructive"
      });
      return;
    }
    onCreateArticle();
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 stagger-fade animate-in">
      <h1 className="text-3xl font-bold flex items-center gap-3">
        <BookOpen size={28} className="text-primary" />
        Knowledge Wiki
      </h1>
      <Button 
        className="flex items-center gap-2 bg-primary hover:bg-primary/90 w-full md:w-auto"
        onClick={handleCreateArticle}
      >
        <Plus size={18} />
        <span>New Article</span>
      </Button>
    </div>
  );
};
