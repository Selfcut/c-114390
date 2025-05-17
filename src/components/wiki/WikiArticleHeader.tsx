
import React from "react";
import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";
import { Pencil } from "lucide-react";
import { getCategoryIcon } from "@/components/wiki/WikiUtils";

interface WikiArticleHeaderProps {
  title: string;
  description: string;
  category: string;
  isUserAuthenticated: boolean;
  onEditClick: () => void;
}

export const WikiArticleHeader: React.FC<WikiArticleHeaderProps> = ({
  title,
  description,
  category,
  isUserAuthenticated,
  onEditClick,
}) => {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            {getCategoryIcon(category)}
          </div>
          <span className="text-sm text-muted-foreground capitalize">{category}</span>
        </div>
        <CardTitle className="text-3xl mb-2">{title}</CardTitle>
        <p className="text-muted-foreground">{description}</p>
      </div>
      
      {isUserAuthenticated && (
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-2"
          onClick={onEditClick}
        >
          <Pencil size={14} />
          <span>Edit Article</span>
        </Button>
      )}
    </div>
  );
};
