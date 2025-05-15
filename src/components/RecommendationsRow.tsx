import { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, BookOpen, MessageSquare } from "lucide-react";
import { polymathToast } from "@/components/ui/use-toast";

interface Recommendation {
  id: string;
  title: string;
  description: string;
  type: 'book' | 'article' | 'discussion' | 'video';
  image?: string;
  author?: string;
  estimatedTime?: string;
}

const mockRecommendations: Recommendation[] = [
  {
    id: '1',
    title: 'The Quantum Self',
    description: 'Explore the intersection of quantum physics and consciousness',
    type: 'book',
    author: 'Danah Zohar',
    image: '/lovable-uploads/a3dc041f-fb55-4108-807b-ca52164461d8.png',
    estimatedTime: '8 min read'
  },
  {
    id: '2',
    title: 'Systems Thinking for Social Change',
    description: 'A practical guide to solving complex problems',
    type: 'article',
    author: 'David Peter Stroh',
    image: '/lovable-uploads/739ab3ed-442e-42fb-9219-25ee697b73ba.png',
    estimatedTime: '15 min read'
  },
  {
    id: '3',
    title: 'Consciousness and Neural Networks',
    description: 'Can artificial neural networks develop consciousness?',
    type: 'discussion',
    author: 'Multiple contributors',
    estimatedTime: '20+ posts'
  },
  {
    id: '4',
    title: 'The Role of Mathematics in Understanding Reality',
    description: 'Mathematical platonism and physical realism',
    type: 'article',
    author: 'Roger Penrose',
    image: '/lovable-uploads/92333427-5a32-4cf8-b110-afc5b57c9f27.png',
    estimatedTime: '12 min read'
  },
  {
    id: '5',
    title: 'The Emergent Mind',
    description: 'How complexity gives rise to intelligence',
    type: 'book',
    author: 'Michael Levin',
    image: '/lovable-uploads/d8b5e246-d962-466e-ad7d-61985e448fb9.png',
    estimatedTime: '10 min read'
  }
];

export function RecommendationsRow() {
  const [recommendations] = useState<Recommendation[]>(mockRecommendations);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const scrollAmount = 300;

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      handleScroll(); // Check initial scroll position
      return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const currentScroll = scrollContainerRef.current.scrollLeft;
      const newScroll = direction === 'left' 
        ? currentScroll - scrollAmount 
        : currentScroll + scrollAmount;
      
      scrollContainerRef.current.scrollTo({
        left: newScroll,
        behavior: 'smooth'
      });
    }
  };

  const getIconForType = (type: string) => {
    switch(type) {
      case 'book':
      case 'article':
        return <BookOpen size={18} />;
      case 'discussion':
        return <MessageSquare size={18} />;
      default:
        return <BookOpen size={18} />;
    }
  };

  const getBgColorForType = (type: string) => {
    switch(type) {
      case 'book':
        return 'bg-[#00361F]';
      case 'article':
        return 'bg-[#360036]';
      case 'discussion':
        return 'bg-[#3A3600]';
      default:
        return 'bg-[#00361F]';
    }
  };

  const getTextColorForType = (type: string) => {
    switch(type) {
      case 'book':
        return 'text-[#00A67E]';
      case 'article':
        return 'text-[#FF3EA5]';
      case 'discussion':
        return 'text-[#FFD426]';
      default:
        return 'text-[#00A67E]';
    }
  };

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white">Recommended for You</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            disabled={!canScrollLeft}
            onClick={() => scroll('left')}
            className={`border-gray-700 ${canScrollLeft ? 'hover:bg-gray-800 hover:text-white' : 'opacity-50'}`}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            disabled={!canScrollRight}
            onClick={() => scroll('right')}
            className={`border-gray-700 ${canScrollRight ? 'hover:bg-gray-800 hover:text-white' : 'opacity-50'}`}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div 
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto scrollbar-none pb-2 stagger-fade"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {recommendations.map((rec, index) => (
          <Card 
            key={rec.id} 
            className="flex-shrink-0 w-[280px] bg-[#1A1A1A] border-gray-800 hover:border-gray-700 transition-all hover-lift"
            onClick={() => polymathToast.contentRecommended()}
          >
            <CardContent className="p-0">
              {rec.image ? (
                <div className="h-36 overflow-hidden">
                  <img
                    src={rec.image}
                    alt={rec.title}
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                  />
                </div>
              ) : (
                <div className="h-36 bg-gray-800 flex items-center justify-center">
                  {getIconForType(rec.type)}
                </div>
              )}
              
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`p-1.5 rounded-full ${getBgColorForType(rec.type)}`}>
                    <div className={getTextColorForType(rec.type)}>
                      {getIconForType(rec.type)}
                    </div>
                  </div>
                  <span className="text-sm text-gray-400 capitalize">{rec.type}</span>
                </div>
                
                <h3 className="font-medium text-white mb-1">{rec.title}</h3>
                <p className="text-sm text-gray-400 mb-3 line-clamp-2">{rec.description}</p>
                
                <div className="flex justify-between items-center text-xs text-gray-400">
                  <span>{rec.author}</span>
                  <span>{rec.estimatedTime}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
