import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { ChevronLeft, ChevronRight, Quote, Heart } from 'lucide-react';
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";
import { fetchQuotes, likeQuote, checkUserLikedQuote } from "@/lib/quotes-service";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { LoadingScreen } from './LoadingScreen';
import { QuoteWithUser } from '@/lib/quotes/types';

interface EnhancedQuotesCarouselProps {
  className?: string;
  autoRotateInterval?: number;
}

// Memoized carousel quote slide
const CarouselQuote = memo(({ quote, isLiked, onLike }: {
  quote: QuoteWithUser;
  isLiked: boolean;
  onLike: (id: string) => void;
}) => (
  <div className="max-w-2xl mx-auto text-center">
    <div className="text-[#6E59A5] mb-4">
      <Quote size={30} className="mx-auto" />
    </div>
    <p className="text-white text-lg md:text-xl mb-6 italic">
      {quote.text}
    </p>
    <div className="flex flex-col items-center">
      <p className="text-gray-300 font-medium">{quote.author}</p>
      {quote.user?.name && (
        <p className="text-gray-400 text-sm mt-1">Shared by {quote.user.name}</p>
      )}
      {quote.source && (
        <p className="text-gray-500 text-xs mt-2">{quote.source}</p>
      )}
    </div>
    
    <button 
      className={cn(
        "mt-6 flex items-center gap-2 mx-auto transition-colors",
        isLiked ? "text-red-400" : "text-gray-400 hover:text-red-400"
      )}
      onClick={() => onLike(quote.id)}
    >
      <Heart 
        size={16} 
        className={isLiked ? "fill-red-400" : ""} 
      />
      <span>{quote.likes || 0} likes</span>
    </button>
  </div>
));

export const EnhancedQuotesCarousel = ({ 
  className,
  autoRotateInterval = 8000 
}: EnhancedQuotesCarouselProps) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [likedQuotes, setLikedQuotes] = useState<string[]>([]);
  const [quotes, setQuotes] = useState<QuoteWithUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const carouselRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const autoRotateTimeoutRef = useRef<number | null>(null);
  const { isAuthenticated, user } = useAuth();
  
  // Memoized fetch quotes function to prevent unnecessary re-renders
  const loadQuotes = useCallback(async () => {
    setIsLoading(true);
    try {
      const fetchedQuotes = await fetchQuotes();
      if (fetchedQuotes.length > 0) {
        setQuotes(fetchedQuotes);
        
        // Check which quotes the user has liked
        if (isAuthenticated && user?.id) {
          const likedIds = await Promise.all(
            fetchedQuotes.map(async (quote) => {
              const isLiked = await checkUserLikedQuote(quote.id, user.id);
              return isLiked ? quote.id : null;
            })
          );
          setLikedQuotes(likedIds.filter(Boolean) as string[]);
        }
      } else {
        // Fallback quotes
        setQuotes([
          {
            id: "1",
            text: "The cave you fear to enter holds the treasure you seek.",
            author: "Joseph Campbell",
            source: "The Hero with a Thousand Faces",
            likes: 156,
            category: "Inspiration",
            tags: ["inspiration", "courage"],
            comments: 10,
            bookmarks: 5,
            created_at: new Date().toISOString(),
            user_id: "user1",
            user: {
              id: "user1",
              username: "josephc",
              name: "Joseph Campbell",
              avatar_url: null,
              status: "online"
            }
          },
          {
            id: "2",
            text: "The Kingdom of Heaven is within you; and whosoever shall know themselves shall find it.",
            author: "Ancient Egyptian Proverb",
            source: "Hermetic Texts",
            likes: 243,
            category: "Spirituality",
            tags: ["spirituality", "wisdom"],
            comments: 15,
            bookmarks: 8,
            created_at: new Date().toISOString(),
            user_id: "user2",
            user: {
              id: "user2",
              username: "egyptianwisdom",
              name: "Ancient Egyptian",
              avatar_url: null,
              status: "offline"
            }
          },
          {
            id: "3",
            text: "As above, so below; as within, so without; as the universe, so the soul.",
            author: "Hermes Trismegistus",
            source: "The Emerald Tablet",
            likes: 321,
            category: "Philosophy",
            tags: ["philosophy", "hermeticism"],
            comments: 20,
            bookmarks: 12,
            created_at: new Date().toISOString(),
            user_id: "user3",
            user: {
              id: "user3",
              username: "hermes",
              name: "Hermes",
              avatar_url: null,
              status: "online"
            }
          },
        ] as QuoteWithUser[]);
      }
    } catch (error) {
      console.error("Error loading quotes for carousel:", error);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user]);
  
  useEffect(() => {
    loadQuotes();
  }, [loadQuotes]);
  
  // Auto-rotate quotes with cleanup
  useEffect(() => {
    const startAutoRotate = () => {
      if (autoRotateTimeoutRef.current) {
        window.clearTimeout(autoRotateTimeoutRef.current);
      }
      
      if (!isAnimating && quotes.length > 1) {
        autoRotateTimeoutRef.current = window.setTimeout(() => {
          nextSlide();
        }, autoRotateInterval);
      }
    };
    
    startAutoRotate();
    
    return () => {
      if (autoRotateTimeoutRef.current) {
        window.clearTimeout(autoRotateTimeoutRef.current);
      }
    };
  }, [activeSlide, isAnimating, quotes.length, autoRotateInterval]);
  
  // Memoized slide navigation functions
  const goToSlide = useCallback((index: number) => {
    if (isAnimating || quotes.length === 0) return;
    setIsAnimating(true);
    setActiveSlide(index);
    
    // Reset animation state after transition completes
    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  }, [isAnimating, quotes.length]);
  
  const prevSlide = useCallback(() => {
    if (quotes.length <= 1) return;
    const newIndex = activeSlide === 0 ? quotes.length - 1 : activeSlide - 1;
    goToSlide(newIndex);
  }, [activeSlide, goToSlide, quotes.length]);
  
  const nextSlide = useCallback(() => {
    if (quotes.length <= 1) return;
    const newIndex = activeSlide === quotes.length - 1 ? 0 : activeSlide + 1;
    goToSlide(newIndex);
  }, [activeSlide, goToSlide, quotes.length]);
  
  // Touch event handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);
  
  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
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
  }, [nextSlide, prevSlide]);
  
  // Memoized like handler
  const handleLike = useCallback(async (id: string) => {
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
  }, [isAuthenticated]);
  
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
          <LoadingScreen fullScreen={false} message="Loading quotes..." size="sm" className="h-full" />
        ) : (
          <div 
            className="absolute inset-0 flex items-center justify-center p-8 transition-opacity duration-500"
            style={{ 
              opacity: isAnimating ? 0 : 1
            }}
          >
            {activeQuote && (
              <CarouselQuote 
                quote={activeQuote}
                isLiked={likedQuotes.includes(activeQuote.id)}
                onLike={handleLike}
              />
            )}
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
