
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { useContentNavigation } from "@/hooks/useContentNavigation";
import { WikiArticle } from "./types";

interface WikiArticleCardProps {
  article: WikiArticle;
  getCategoryIcon: (categoryId: string) => React.ReactNode;
}

export const WikiArticleCard = ({ article, getCategoryIcon }: WikiArticleCardProps) => {
  const { handleWikiClick } = useContentNavigation();

  const handleClick = () => {
    handleWikiClick(article.id);
  };

  return (
    <Card 
      className="hover:shadow-md transition-shadow w-full flex flex-col cursor-pointer" 
      onClick={handleClick}
    >
      <CardContent className="p-5 flex flex-col">
        <div className="flex items-start gap-3 w-full">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            {getCategoryIcon(article.category)}
          </div>
          <div className="flex-1 min-w-0 flex-grow">
            <div className="flex flex-wrap justify-between items-center gap-4 mb-1">
              <h3 className="font-medium text-lg truncate">{article.title}</h3>
              <div className="flex-shrink-0">
                <Button variant="ghost" size="sm" className="h-8">
                  <ChevronRight size={16} />
                </Button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {article.description}
            </p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <div>Last updated: {article.lastUpdated}</div>
              <div>{article.contributors} contributors</div>
              <div>{article.views} views</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
