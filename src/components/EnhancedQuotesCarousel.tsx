import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Quote, Heart, Share2, BookOpen } from 'lucide-react';
import { LoadingScreen } from '@/components/LoadingScreen';

interface QuoteType {
  id: number;
  text: string;
  author: string;
  likes: number;
  shares: number;
  isLiked: boolean;
}

const mockQuotes: QuoteType[] = [
  {
    id: 1,
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
    likes: 120,
    shares: 30,
    isLiked: false,
  },
  {
    id: 2,
    text: "Innovation distinguishes between a leader and a follower.",
    author: "Steve Jobs",
    likes: 150,
    shares: 45,
    isLiked: true,
  },
  {
    id: 3,
    text: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt",
    likes: 90,
    shares: 20,
    isLiked: false,
  },
  {
    id: 4,
    text: "Strive not to be a success, but rather to be of value.",
    author: "Albert Einstein",
    likes: 180,
    shares: 60,
    isLiked: true,
  },
];

const EnhancedQuotesCarousel = () => {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [quotes, setQuotes] = useState<QuoteType[]>(mockQuotes);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, []);

  const goToPreviousQuote = () => {
    setCurrentQuoteIndex((prevIndex) =>
      prevIndex === 0 ? quotes.length - 1 : prevIndex - 1
    );
  };

  const goToNextQuote = () => {
    setCurrentQuoteIndex((prevIndex) =>
      prevIndex === quotes.length - 1 ? 0 : prevIndex + 1
    );
  };

  const toggleLike = (id: number) => {
    setQuotes((prevQuotes) =>
      prevQuotes.map((quote) =>
        quote.id === id ? { ...quote, isLiked: !quote.isLiked, likes: quote.isLiked ? quote.likes - 1 : quote.likes + 1 } : quote
      )
    );
  };

  const shareQuote = (id: number) => {
    setQuotes((prevQuotes) =>
      prevQuotes.map((quote) =>
        quote.id === id ? { ...quote, shares: quote.shares + 1 } : quote
      )
    );
  };

  const currentQuote = quotes[currentQuoteIndex];

  if (isLoading) {
    return (
      <LoadingScreen 
        fullScreen={false} 
        message="Loading inspiring quotes..." 
        className="min-h-[400px]"
      />
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto my-8">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" size="icon" onClick={goToPreviousQuote}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={goToNextQuote}>
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
        <div className="text-lg italic text-muted-foreground mb-4">
          <Quote className="inline-block h-4 w-4 mr-2" />
          {currentQuote.text}
        </div>
        <div className="text-right font-medium">- {currentQuote.author}</div>
        <div className="flex items-center justify-between mt-6">
          <Button variant="ghost" onClick={() => toggleLike(currentQuote.id)}>
            <Heart className={`h-4 w-4 mr-2 ${currentQuote.isLiked ? 'text-red-500' : ''}`} />
            <span>{currentQuote.likes} Likes</span>
          </Button>
          <Button variant="ghost" onClick={() => shareQuote(currentQuote.id)}>
            <Share2 className="h-4 w-4 mr-2" />
            <span>{currentQuote.shares} Shares</span>
          </Button>
          <Button variant="link">
            <BookOpen className="h-4 w-4 mr-2" />
            Learn More
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedQuotesCarousel;
