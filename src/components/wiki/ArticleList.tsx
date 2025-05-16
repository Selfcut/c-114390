
import React from "react";
import { Button } from "@/components/ui/button";
import { BookOpen, Loader2 } from "lucide-react";
import { WikiArticleCard } from "./WikiArticleCard";
import { WikiArticle } from "./types";

interface ArticleListProps {
  filteredArticles: WikiArticle[];
  getCategoryIcon: (categoryId: string) => React.ReactNode;
  isLoading: boolean;
  loadMoreArticles: () => void;
  resetFilters: () => void;
}

export const ArticleList = ({ 
  filteredArticles,
  getCategoryIcon,
  isLoading,
  loadMoreArticles,
  resetFilters
}: ArticleListProps) => {
  if (isLoading && filteredArticles.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="border rounded-lg p-5 space-y-3 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-muted"></div>
              <div className="h-4 w-28 bg-muted rounded"></div>
            </div>
            <div className="h-4 w-full bg-muted rounded"></div>
            <div className="h-4 w-3/4 bg-muted rounded"></div>
            <div className="flex gap-2">
              <div className="h-3 w-20 bg-muted rounded"></div>
              <div className="h-3 w-20 bg-muted rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (filteredArticles.length === 0) {
    return (
      <div className="bg-muted/30 rounded-lg p-8 text-center w-full">
        <BookOpen size={48} className="text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground mb-4">No wiki articles found matching your criteria.</p>
        <Button onClick={resetFilters}>
          Clear Filters
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full stagger-fade animate-in">
        {filteredArticles.map(article => (
          <WikiArticleCard 
            key={article.id} 
            article={article} 
            getCategoryIcon={getCategoryIcon}
          />
        ))}
      </div>
      
      {/* Load More Button */}
      <div className="flex justify-center mt-6">
        <Button 
          variant="outline" 
          onClick={loadMoreArticles} 
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>Loading...</span>
            </>
          ) : (
            <span>Load More Articles</span>
          )}
        </Button>
      </div>
    </div>
  );
};
