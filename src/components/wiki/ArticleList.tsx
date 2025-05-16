
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
    <div className="space-y-4 stagger-fade animate-in w-full">
      {filteredArticles.map(article => (
        <WikiArticleCard 
          key={article.id} 
          article={article} 
          getCategoryIcon={getCategoryIcon}
        />
      ))}
      
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
