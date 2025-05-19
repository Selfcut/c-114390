
import React from 'react';
import { Button } from "@/components/ui/button";
import { Quote, Plus } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

interface QuotesHeaderProps {
  onSubmitClick: () => void;
}

export const QuotesHeader: React.FC<QuotesHeaderProps> = ({
  onSubmitClick
}) => {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  const handleSubmitClick = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to submit quotes",
        variant: "destructive"
      });
      return;
    }
    
    onSubmitClick();
  };
  
  return (
    <div className="flex justify-between items-center mb-8 stagger-fade animate-in">
      <h1 className="text-3xl font-bold flex items-center gap-3">
        <Quote size={28} className="text-primary" />
        Wisdom Quotes
      </h1>
      <Button 
        className="flex items-center gap-2 bg-primary hover:bg-primary/90"
        onClick={handleSubmitClick}
      >
        <Plus size={18} />
        <span>Submit Quote</span>
      </Button>
    </div>
  );
};
