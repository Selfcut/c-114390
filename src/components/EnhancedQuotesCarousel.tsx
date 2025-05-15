
import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Quote, Heart } from 'lucide-react';
import { cn } from "@/lib/utils";
import { polymathToast } from "@/components/ui/use-toast";

interface QuoteItem {
  id: string;
  text: string;
  author: string;
  authorTitle?: string;
  source?: string;
  likes?: number;
}

interface EnhancedQuotesCarouselProps {
  className?: string;
}

export const EnhancedQuotesCarousel = ({ className }: EnhancedQuotesCarouselProps) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [likedQuotes, setLikedQuotes] = useState<string[]>([]);
  const carouselRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  
  const quotes: QuoteItem[] = [
    {
      id: "1",
      text: "The cave you fear to enter holds the treasure you seek.",
      author: "Joseph Campbell",
      authorTitle: "Mythologist",
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
      authorTitle: "Hermeticist",
      source: "The Emerald Tablet",
      likes: 321
    },
    {
      id: "4",
      text: "The day science begins to study non-physical phenomena, it will make more progress in one decade than in all the previous centuries of its existence.",
      author: "Nikola Tesla",
      authorTitle: "Inventor and Futurist",
      likes: 198
    },
    {
      id: "5",
      text: "If you wish to understand the Universe, think of energy, frequency and vibration.",
      author: "Nikola Tesla",
      authorTitle: "Inventor and Futurist",
      likes: 276
    }
  ];
  
  useEffect(() => {
    // Load liked quotes from local storage
    const stored = localStorage.getItem('likedQuotes');
    if (stored) {
      setLikedQuotes(JSON.parse(stored));
    }
    
    // Auto-rotate quotes every 8 seconds if not interacted with recently
    const interval = setInterval(() => {
      if (!isAnimating) {
        nextSlide();
      }
    }, 8000);
    
    return () => clearInterval(interval);
  }, [isAnimating]);
  
  const saveToLocalStorage = (updatedLikes: string[]) => {
    localStorage.setItem('likedQuotes', JSON.stringify(updatedLikes));
  };
  
  const goToSlide = (index: number) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveSlide(index);
    
    // Reset animation state after transition completes
    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };
  
  const prevSlide = () => {
    const newIndex = activeSlide === 0 ? quotes.length - 1 : activeSlide - 1;
    goToSlide(newIndex);
  };
  
  const nextSlide = () => {
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
  
  const handleLike = (id: string) => {
    if (likedQuotes.includes(id)) {
      const updated = likedQuotes.filter(quoteId => quoteId !== id);
      setLikedQuotes(updated);
      saveToLocalStorage(updated);
    } else {
      const updated = [...likedQuotes, id];
      setLikedQuotes(updated);
      saveToLocalStorage(updated);
      polymathToast({
        title: "Quote liked",
        description: "This quote has been added to your favorites."
      });
    }
  };
  
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
              {activeQuote?.authorTitle && (
                <p className="text-gray-400 text-sm mt-1">{activeQuote.authorTitle}</p>
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
              onClick={() => handleLike(activeQuote?.id)}
            >
              <Heart 
                size={16} 
                className={likedQuotes.includes(activeQuote?.id) ? "fill-red-400" : ""} 
              />
              <span>{activeQuote?.likes || 0} likes</span>
            </button>
          </div>
        </div>
        
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
