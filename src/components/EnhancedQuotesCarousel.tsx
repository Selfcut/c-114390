
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Quote, Heart, Share } from 'lucide-react';
import { LoadingScreen } from '@/components/LoadingScreen';
import { toast } from 'sonner';

interface Quote {
  id: string;
  text: string;
  author: string;
  category: string;
  likes: number;
}

interface EnhancedQuotesCarouselProps {
  className?: string;
}

export const EnhancedQuotesCarousel: React.FC<EnhancedQuotesCarouselProps> = ({ className = '' }) => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [likedQuotes, setLikedQuotes] = useState<Set<string>>(new Set());

  // Mock quotes data for now
  useEffect(() => {
    const mockQuotes: Quote[] = [
      {
        id: '1',
        text: 'The only way to do great work is to love what you do.',
        author: 'Steve Jobs',
        category: 'motivation',
        likes: 342
      },
      {
        id: '2',
        text: 'In the middle of difficulty lies opportunity.',
        author: 'Albert Einstein',
        category: 'wisdom',
        likes: 256
      },
      {
        id: '3',
        text: 'Success is not final, failure is not fatal: it is the courage to continue that counts.',
        author: 'Winston Churchill',
        category: 'perseverance',
        likes: 189
      }
    ];

    setTimeout(() => {
      setQuotes(mockQuotes);
      setIsLoading(false);
    }, 1000);
  }, []);

  const nextQuote = () => {
    setCurrentIndex((prev) => (prev + 1) % quotes.length);
  };

  const prevQuote = () => {
    setCurrentIndex((prev) => (prev - 1 + quotes.length) % quotes.length);
  };

  const handleLike = (quoteId: string) => {
    setLikedQuotes(prev => {
      const newLiked = new Set(prev);
      if (newLiked.has(quoteId)) {
        newLiked.delete(quoteId);
        toast.success('Quote unliked');
      } else {
        newLiked.add(quoteId);
        toast.success('Quote liked');
      }
      return newLiked;
    });
  };

  const handleShare = (quote: Quote) => {
    if (navigator.share) {
      navigator.share({
        title: 'Inspirational Quote',
        text: `"${quote.text}" - ${quote.author}`,
      });
    } else {
      navigator.clipboard.writeText(`"${quote.text}" - ${quote.author}`);
      toast.success('Quote copied to clipboard');
    }
  };

  if (isLoading) {
    return (
      <div className={`rounded-lg border bg-card ${className}`}>
        <LoadingScreen 
          fullScreen={false} 
          message="Loading inspiring quotes..."
        />
      </div>
    );
  }

  if (quotes.length === 0) {
    return (
      <div className={`rounded-lg border bg-card p-6 ${className}`}>
        <p className="text-center text-muted-foreground">No quotes available</p>
      </div>
    );
  }

  const currentQuote = quotes[currentIndex];

  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <Quote className="h-6 w-6 text-primary" />
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={prevQuote}
              disabled={quotes.length <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={nextQuote}
              disabled={quotes.length <= 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <blockquote className="text-lg font-medium leading-relaxed mb-4">
          "{currentQuote.text}"
        </blockquote>
        
        <div className="flex items-center justify-between">
          <cite className="text-sm text-muted-foreground">
            — {currentQuote.author}
          </cite>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleLike(currentQuote.id)}
              className={likedQuotes.has(currentQuote.id) ? 'text-red-500' : ''}
            >
              <Heart className={`h-4 w-4 ${likedQuotes.has(currentQuote.id) ? 'fill-current' : ''}`} />
              <span className="ml-1 text-xs">{currentQuote.likes}</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleShare(currentQuote)}
            >
              <Share className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {quotes.length > 1 && (
          <div className="flex justify-center mt-4 space-x-1">
            {quotes.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-primary' : 'bg-muted'
                }`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedQuotesCarousel;
