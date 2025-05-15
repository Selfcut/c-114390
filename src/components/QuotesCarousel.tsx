
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Sample quotes data
const quotes = [
  {
    text: "The unexamined life is not worth living.",
    author: "Socrates"
  },
  {
    text: "As above, so below; as within, so without.",
    author: "Hermes Trismegistus"
  },
  {
    text: "Know thyself and thou shalt know all the mysteries of the gods and of the universe.",
    author: "Ancient Greek Aphorism"
  },
  {
    text: "The journey of a thousand miles begins with a single step.",
    author: "Lao Tzu"
  },
  {
    text: "The cave you fear to enter holds the treasure you seek.",
    author: "Joseph Campbell"
  }
];

export const QuotesCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const nextQuote = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentIndex((prev) => (prev + 1) % quotes.length);
      setTimeout(() => setIsAnimating(false), 500);
    }
  };
  
  const prevQuote = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentIndex((prev) => (prev - 1 + quotes.length) % quotes.length);
      setTimeout(() => setIsAnimating(false), 500);
    }
  };
  
  // Auto-rotate quotes every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      nextQuote();
    }, 8000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="bg-[#1A1A1A] rounded-lg p-6 relative overflow-hidden">
      <div className={`transition-opacity duration-500 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
        <blockquote className="text-white text-lg md:text-xl font-medium italic mb-4 quote-highlight">
          "{quotes[currentIndex].text}"
        </blockquote>
        <p className="text-gray-400">— {quotes[currentIndex].author}</p>
      </div>
      
      <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between px-4 opacity-0 hover:opacity-100 transition-opacity">
        <button 
          onClick={prevQuote}
          className="p-2 bg-gray-800 bg-opacity-80 rounded-full text-white hover:bg-opacity-100 transition-all"
        >
          <ChevronLeft size={20} />
        </button>
        <button 
          onClick={nextQuote}
          className="p-2 bg-gray-800 bg-opacity-80 rounded-full text-white hover:bg-opacity-100 transition-all"
        >
          <ChevronRight size={20} />
        </button>
      </div>
      
      <div className="flex justify-center mt-4 gap-1.5">
        {quotes.map((_, index) => (
          <button 
            key={index} 
            className={`w-2 h-2 rounded-full transition-all ${
              currentIndex === index ? 'bg-white w-4' : 'bg-gray-600'
            }`}
            onClick={() => {
              setIsAnimating(true);
              setCurrentIndex(index);
              setTimeout(() => setIsAnimating(false), 500);
            }}
          ></button>
        ))}
      </div>
    </div>
  );
};
