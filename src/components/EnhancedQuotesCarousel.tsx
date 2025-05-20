import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Quote, Heart } from 'lucide-react';
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";
import { fetchQuotes, likeQuote, checkUserLikedQuote } from "@/lib/quotes-service";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";

interface EnhancedQuotesCarouselProps {
  className?: string;
}

export const EnhancedQuotesCarousel = ({ className }: EnhancedQuotesCarouselProps) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [likedQuotes, setLikedQuotes] = useState<string[]>([]);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const carouselRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const { isAuthenticated } = useAuth();
  
  useEffect(() => {
    const loadQuotes = async () => {
      setIsLoading(true);
      try {
        const fetchedQuotes = await fetchQuotes();
        if (fetchedQuotes.length > 0) {
          setQuotes(fetchedQuotes);
          
          // Check which quotes the user has liked
          if (isAuthenticated) {
            const likedIds = await Promise.all(
              fetchedQuotes.map(async (quote) => {
                const isLiked = await checkUserLikedQuote(quote.id);
                return isLiked ? quote.id : null;
              })
            );
            setLikedQuotes(likedIds.filter(Boolean) as string[]);
          }
        } else {
          // Fallback to some default quotes if none in database
          setQuotes([
            {
              id: "1",
              text: "The cave you fear to enter holds the treasure you seek.",
              author: "Joseph Campbell",
              source: "The Hero with a Thousand Faces",
              likes: 156
            },
            {
              id: "2",
              text: "The Kingdom of Heaven is within you; and whosoever shall know themselves shall find it.",
              author: "Ancient Egyptian Proverb",
              source: "Hermetic Texts",
              likes: 243
            },
            {
              id: "3",
              text: "As above, so below; as within, so without; as the universe, so the soul.",
              author: "Hermes Trismegistus",
              source: "The Emerald Tablet",
              likes: 321
            },
          ]);
        }
      } catch (error) {
        console.error("Error loading quotes for carousel:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadQuotes();
    
    // Auto-rotate quotes every 8 seconds if not interacted with recently
    const interval = setInterval(() => {
      if (!isAnimating && quotes.length > 1) {
        nextSlide();
      }
    }, 8000);
    
    return () => clearInterval(interval);
  }, [isAuthenticated]);
  
  const goToSlide = (index: number) => {
    if (isAnimating || quotes.length === 0) return;
    setIsAnimating(true);
    setActiveSlide(index);
    
    // Reset animation state after transition completes
    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };
  
  const prevSlide = () => {
    if (quotes.length <= 1) return;
    const newIndex = activeSlide === 0 ? quotes.length - 1 : activeSlide - 1;
    goToSlide(newIndex);
  };
  
  const nextSlide = () => {
    if (quotes.length <= 1) return;
    const newIndex = activeSlide === quotes.length - 1 ? 0 : activeSlide + 1;
    goToSlide(newIndex);
  };
  
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    
    // Require at least 50px swipe distance to register
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextSlide(); // Swipe left, go to next
      } else {
        prevSlide(); // Swipe right, go to previous
      }
    }
    
    touchStartX.current = null;
  };
  
  const handleLike = async (id: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to like quotes",
        variant: "destructive"
      });
      return;
    }
    
    const { data } = await supabase.auth.getSession();
    const userId = data?.session?.user?.id;
    
    if (!userId) {
      toast({
        title: "Authentication error",
        description: "Unable to identify user. Please try logging in again.",
        variant: "destructive"
      });
      return;
    }
    
    const result = await likeQuote(id, userId);
    
    // Update local state
    if (result) {
      setLikedQuotes(prev => [...prev, id]);
      // Update quote likes in UI
      setQuotes(prevQuotes => 
        prevQuotes.map(quote => 
          quote.id === id ? { ...quote, likes: (quote.likes || 0) + 1 } : quote
        )
      );
    } else {
      setLikedQuotes(prev => prev.filter(quoteId => quoteId !== id));
      // Update quote likes in UI
      setQuotes(prevQuotes => 
        prevQuotes.map(quote => 
          quote.id === id ? { ...quote, likes: Math.max(0, (quote.likes || 0) - 1) } : quote
        )
      );
    }
  };
  
  if (quotes.length === 0 && !isLoading) {
    return null;
  }
  
  const activeQuote = quotes[activeSlide];
  
  return (
    <div 
      className={cn(
        "bg-[#1A1A1A] border border-gray-800 rounded-lg overflow-hidden relative",
        className
      )}
    >
      <div 
        className="flex justify-between items-center p-4 border-b border-gray-800"
      >
        <h3 className="text-lg font-medium text-white flex items-center gap-2">
          <Quote size={18} />
          Wisdom Quotes
        </h3>
        <div className="flex gap-1">
          {quotes.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                index === activeSlide ? 'bg-[#6E59A5]' : 'bg-gray-700'
              }`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to quote ${index + 1}`}
            />
          ))}
        </div>
      </div>
      
      <div 
        ref={carouselRef}
        className="relative h-[280px] overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6E59A5]"></div>
          </div>
        ) : (
          <div 
            className="absolute inset-0 flex items-center justify-center p-8 transition-opacity duration-500"
            style={{ 
              opacity: isAnimating ? 0 : 1
            }}
          >
            <div className="max-w-2xl mx-auto text-center">
              <div className="text-[#6E59A5] mb-4">
                <Quote size={30} className="mx-auto" />
              </div>
              <p className="text-white text-lg md:text-xl mb-6 italic">
                {activeQuote?.text}
              </p>
              <div className="flex flex-col items-center">
                <p className="text-gray-300 font-medium">{activeQuote?.author}</p>
                {activeQuote?.user?.name && (
                  <p className="text-gray-400 text-sm mt-1">Shared by {activeQuote.user.name}</p>
                )}
                {activeQuote?.source && (
                  <p className="text-gray-500 text-xs mt-2">{activeQuote.source}</p>
                )}
              </div>
              
              <button 
                className={cn(
                  "mt-6 flex items-center gap-2 mx-auto transition-colors",
                  likedQuotes.includes(activeQuote?.id)
                    ? "text-red-400"
                    : "text-gray-400 hover:text-red-400"
                )}
                onClick={() => activeQuote && handleLike(activeQuote.id)}
              >
                <Heart 
                  size={16} 
                  className={likedQuotes.includes(activeQuote?.id) ? "fill-red-400" : ""} 
                />
                <span>{activeQuote?.likes || 0} likes</span>
              </button>
            </div>
          </div>
        )}
        
        {quotes.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-black bg-opacity-30 hover:bg-opacity-50 text-white p-2 rounded-r-md transition-all transform hover:scale-105"
              aria-label="Previous quote"
            >
              <ChevronLeft size={20} />
            </button>
            
            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-black bg-opacity-30 hover:bg-opacity-50 text-white p-2 rounded-l-md transition-all transform hover:scale-105"
              aria-label="Next quote"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>
      
      <div className="p-4 border-t border-gray-800 flex justify-between items-center">
        <p className="text-gray-400 text-sm">
          {activeSlide + 1} of {quotes.length}
        </p>
        <a 
          href="/quotes" 
          className="text-[#6E59A5] hover:text-[#7E69AB] text-sm font-medium transition-colors"
        >
          View All Quotes
        </a>
      </div>
    </div>
  );
};
