
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageLayout } from '@/components/layouts/PageLayout';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Book } from '../components/bookreviews/types';

const BookReviewDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [book, setBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (id) {
      fetchBookDetails(id);
    }
  }, [id]);
  
  const fetchBookDetails = async (bookId: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('id', bookId)
        .single();
      
      if (error) {
        throw error;
      }
      
      setBook(data);
    } catch (error: any) {
      console.error('Error fetching book details:', error);
      toast.error(`Failed to load book details: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGoBack = () => {
    navigate('/book-reviews');
  };
  
  if (isLoading) {
    return (
      <PageLayout>
        <div className="container mx-auto py-8 px-4 max-w-4xl">
          <Button variant="ghost" onClick={handleGoBack} className="mb-6">
            <ArrowLeft size={16} className="mr-2" />
            Back to Books
          </Button>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <Skeleton className="aspect-[2/3] w-full rounded-lg" />
            </div>
            <div className="md:col-span-2">
              <Skeleton className="h-10 w-3/4 mb-4" />
              <Skeleton className="h-6 w-1/2 mb-6" />
              <Skeleton className="h-4 w-1/4 mb-2" />
              <Skeleton className="h-4 w-1/3 mb-8" />
              
              <Skeleton className="h-32 w-full mb-6" />
              <Skeleton className="h-24 w-full" />
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }
  
  if (!book) {
    return (
      <PageLayout>
        <div className="container mx-auto py-8 px-4 max-w-4xl">
          <Button variant="ghost" onClick={handleGoBack} className="mb-6">
            <ArrowLeft size={16} className="mr-2" />
            Back to Books
          </Button>
          
          <div className="text-center py-12 border rounded-lg">
            <h2 className="text-2xl font-bold mb-2">Book Not Found</h2>
            <p className="text-muted-foreground mb-6">
              The book you're looking for couldn't be found.
            </p>
            <Button onClick={handleGoBack}>
              Return to Book Reviews
            </Button>
          </div>
        </div>
      </PageLayout>
    );
  }
  
  return (
    <PageLayout>
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <Button variant="ghost" onClick={handleGoBack} className="mb-6">
          <ArrowLeft size={16} className="mr-2" />
          Back to Books
        </Button>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            {book.cover_image_url ? (
              <img 
                src={book.cover_image_url} 
                alt={book.title}
                className="w-full rounded-lg shadow-md"
              />
            ) : (
              <div className="w-full aspect-[2/3] bg-muted rounded-lg flex items-center justify-center">
                <span className="text-muted-foreground">No Cover Available</span>
              </div>
            )}
          </div>
          
          <div className="md:col-span-2">
            <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
            <p className="text-xl text-muted-foreground mb-4">by {book.author}</p>
            
            <div className="flex items-center gap-4 mb-6">
              {book.genre && (
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">
                  {book.genre}
                </span>
              )}
              {book.published_year && (
                <span className="text-muted-foreground">
                  Published: {book.published_year}
                </span>
              )}
            </div>
            
            <Separator className="my-6" />
            
            <div>
              <h2 className="text-xl font-semibold mb-3">Description</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                {book.description || "No description available for this book."}
              </p>
            </div>
            
            <Separator className="my-6" />
            
            <div>
              <h2 className="text-xl font-semibold mb-3">Reviews</h2>
              <div className="bg-muted/30 rounded-lg p-6 text-center">
                <p className="text-muted-foreground mb-4">
                  No reviews yet. Be the first to review this book!
                </p>
                <Button>Write a Review</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default BookReviewDetail;
