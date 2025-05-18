
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Book } from './types';

interface BookReviewsListProps {
  books: Book[];
  isLoading: boolean;
  onBookClick: (id: string) => void;
}

export const BookReviewsList = ({ books, isLoading, onBookClick }: BookReviewsListProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <Card key={index} className="overflow-hidden">
            <div className="aspect-[3/4] relative">
              <Skeleton className="h-full w-full" />
            </div>
            <CardContent className="p-4">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-4" />
              <Skeleton className="h-20 w-full" />
            </CardContent>
            <CardFooter className="px-4 pb-4 pt-0 flex justify-between">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-1/4" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="text-center py-16 border rounded-lg">
        <h3 className="text-lg font-medium">No books found</h3>
        <p className="text-muted-foreground">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {books.map((book) => (
        <Card 
          key={book.id} 
          className="overflow-hidden hover:shadow-lg transition-all cursor-pointer"
          onClick={() => onBookClick(book.id)}
        >
          <div className="aspect-[3/4] relative overflow-hidden">
            {book.cover_image_url ? (
              <img 
                src={book.cover_image_url} 
                alt={book.title} 
                className="object-cover w-full h-full transition-transform hover:scale-105"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <span className="text-muted-foreground">No Cover</span>
              </div>
            )}
          </div>
          <CardContent className="p-4">
            <h3 className="font-bold text-lg mb-1 line-clamp-1">{book.title}</h3>
            <p className="text-muted-foreground mb-2">by {book.author}</p>
            <p className="line-clamp-3 text-sm">{book.description || 'No description available.'}</p>
          </CardContent>
          <CardFooter className="px-4 pb-4 pt-0 flex justify-between text-sm">
            <span className="bg-primary/10 text-primary px-2 py-1 rounded-full">{book.genre || 'Unknown'}</span>
            <span className="text-muted-foreground">{book.published_year || 'Unknown'}</span>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
