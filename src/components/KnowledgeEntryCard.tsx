
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatTimeAgo } from "../lib/discussions-utils";
import { Book, Calendar, User, Clock, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import { CustomTooltip } from "@/components/ui/CustomTooltip";

export interface KnowledgeEntryCardProps {
  title: string;
  author: string;
  readTime?: string;
  createdAt: Date;
  summary: string;
  categories?: string[];
  coverImage?: string;
  onClick?: () => void;
  className?: string;
  variant?: "default" | "compact";
}

export const KnowledgeEntryCard = ({
  title,
  author,
  readTime,
  createdAt,
  summary,
  categories = [],
  coverImage,
  onClick,
  className,
  variant = "default"
}: KnowledgeEntryCardProps) => {
  const [imageError, setImageError] = useState(false);
  
  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <Card 
      className={cn(
        "h-full flex flex-col hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden hover:border-primary/50 w-full",
        variant === "compact" && "max-w-sm",
        className
      )}
      onClick={onClick}
    >
      {coverImage && !imageError && (
        <div className={cn("w-full overflow-hidden", variant === "default" ? "h-40" : "h-32")}>
          <img 
            src={coverImage} 
            alt={title}
            className="w-full h-full object-cover transition-transform duration-200 hover:scale-105"
            onError={handleImageError}
          />
        </div>
      )}
      
      <CardHeader className={cn("pb-2", variant === "compact" && "p-4")}>
        <div className="flex justify-between items-start w-full">
          <div className="space-y-1 w-full">
            <h3 className={cn(
              "font-semibold line-clamp-2 text-foreground",
              variant === "default" ? "text-lg" : "text-base"
            )}>
              {title}
            </h3>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className={cn(
        "pb-2 flex-grow",
        variant === "compact" && "p-4 pt-0"
      )}>
        <p className={cn(
          "text-muted-foreground mb-4",
          variant === "default" ? "text-sm line-clamp-3" : "text-xs line-clamp-2"
        )}>
          {summary}
        </p>
        
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {categories.map((category, i) => (
              <Badge key={i} variant="outline" className="text-xs">
                <Tag className="w-3 h-3 mr-1" />
                {category}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      
      <CardFooter className={cn(
        "pt-2 text-xs text-muted-foreground border-t",
        variant === "compact" && "p-4 pt-2"
      )}>
        <div className="flex items-center justify-between w-full">
          <CustomTooltip content={`Author: ${author}`}>
            <div className="flex items-center gap-2">
              <User size={12} />
              <span>{author}</span>
            </div>
          </CustomTooltip>
          <div className="flex items-center gap-3">
            {readTime && (
              <CustomTooltip content={`Reading time: ${readTime}`}>
                <div className="flex items-center gap-1">
                  <Clock size={12} />
                  <span>{readTime}</span>
                </div>
              </CustomTooltip>
            )}
            <CustomTooltip content={createdAt.toLocaleDateString()}>
              <div className="flex items-center gap-1">
                <Calendar size={12} />
                <span>{formatTimeAgo(createdAt)}</span>
              </div>
            </CustomTooltip>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};
