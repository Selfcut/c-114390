import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';
import { Eye, Clock, Users, BookOpen } from 'lucide-react';
import { WikiArticle } from './types';
import { formatDate, truncateText } from './WikiUtils';

interface ArticleListProps {
  filteredArticles: WikiArticle[];
  getCategoryIcon: (category: string) => React.ReactNode;
  isLoading: boolean;
  loadMoreArticles: () => void;
  resetFilters: () => void;
}

export const ArticleList: React.FC<ArticleListProps> = ({
  filteredArticles,
  getCategoryIcon,
  isLoading,
  loadMoreArticles,
  resetFilters
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <Card key={item}>
            <CardContent className="p-0">
              <Skeleton className="h-48 rounded-t-lg" />
              <div className="p-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-5/6 mb-4" />
                <div className="flex gap-2 mb-4">
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (filteredArticles.length === 0) {
    const BookOpenIcon = BookOpen;
    return (
      <Card className="text-center p-12">
        <div className="mx-auto rounded-full bg-primary/10 p-3 w-14 h-14 flex items-center justify-center mb-4">
          <BookOpenIcon className="h-7 w-7 text-primary" />
        </div>
        <h3 className="text-xl font-semibold mb-2">No articles found</h3>
        <p className="text-muted-foreground mb-6">
          We couldn't find any articles matching your criteria.
        </p>
        <Button onClick={resetFilters}>Clear filters</Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArticles.map((article) => (
          <Link to={`/wiki/${article.id}`} key={article.id}>
            <Card className="hover:shadow-md transition-shadow overflow-hidden h-full flex flex-col bg-card hover:bg-accent/50">
              <CardContent className="p-0 flex-grow">
                {article.image_url ? (
                  <div className="aspect-video w-full overflow-hidden">
                    <img 
                      src={article.image_url} 
                      alt={article.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="aspect-video w-full bg-muted flex items-center justify-center">
                    <BookOpen className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
                
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="flex items-center gap-1 bg-primary/5">
                      {getCategoryIcon(article.category)}
                      <span>{article.category}</span>
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{article.title}</h3>
                  <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
                    {truncateText(article.description, 120)}
                  </p>
                </div>
              </CardContent>
              
              <CardFooter className="px-4 pb-4 pt-0 flex justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock size={12} />
                  <span>{formatDate(article.last_updated)}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Users size={12} />
                    {article.contributors}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye size={12} />
                    {article.views}
                  </span>
                </div>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
      
      {filteredArticles.length >= 6 && (
        <div className="flex justify-center mt-6">
          <Button variant="outline" onClick={loadMoreArticles}>
            Load More Articles
          </Button>
        </div>
      )}
    </div>
  );
};
