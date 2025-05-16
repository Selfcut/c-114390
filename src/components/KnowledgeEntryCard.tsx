
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatTimeAgo } from "../lib/discussions-utils";
import { Book, Calendar, User } from "lucide-react";

interface KnowledgeEntryCardProps {
  title: string;
  author: string;
  readTime?: string;
  createdAt: Date;
  summary: string;
  categories?: string[];
  coverImage?: string;
  onClick?: () => void;
}

export const KnowledgeEntryCard = ({
  title,
  author,
  readTime,
  createdAt,
  summary,
  categories = [],
  coverImage,
  onClick
}: KnowledgeEntryCardProps) => {
  return (
    <Card 
      className="h-full flex flex-col hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden hover:border-primary/50 w-full"
      onClick={onClick}
    >
      {coverImage && (
        <div className="w-full h-40 overflow-hidden">
          <img 
            src={coverImage} 
            alt={title}
            className="w-full h-full object-cover transition-transform duration-200 hover:scale-105"
          />
        </div>
      )}
      
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start w-full">
          <div className="space-y-1">
            <h3 className="font-semibold text-lg line-clamp-2">{title}</h3>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pb-2 flex-grow">
        <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
          {summary}
        </p>
        
        <div className="flex flex-wrap gap-2 mt-2">
          {categories.map((category, i) => (
            <Badge key={i} variant="outline" className="text-xs">
              {category}
            </Badge>
          ))}
        </div>
      </CardContent>
      
      <CardFooter className="pt-2 text-xs text-muted-foreground border-t">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <User size={12} />
            <span>{author}</span>
          </div>
          <div className="flex items-center gap-3">
            {readTime && (
              <div className="flex items-center gap-1">
                <Book size={12} />
                <span>{readTime}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Calendar size={12} />
              <span>{formatTimeAgo(createdAt)}</span>
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};
