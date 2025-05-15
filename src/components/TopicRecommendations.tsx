
import { useState } from 'react';
import { BookOpen, ArrowRight, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { polymathToast } from '@/components/ui/use-toast';

interface Topic {
  id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  image: string;
  popularity: number;
  readTime: string;
}

interface TopicRecommendationsProps {
  className?: string;
}

export const TopicRecommendations = ({ className }: TopicRecommendationsProps) => {
  const [hoveredTopic, setHoveredTopic] = useState<string | null>(null);
  
  const topics: Topic[] = [
    {
      id: '1',
      title: 'Introduction to Alchemy',
      description: 'Learn the foundations of alchemical practices and their historical significance.',
      category: 'Alchemy',
      level: 'Beginner',
      image: '/lovable-uploads/b67f802d-430a-4e5a-8755-b61e10470d58.png',
      popularity: 94,
      readTime: '25 min'
    },
    {
      id: '2',
      title: 'Hermetic Principles',
      description: 'Explore the seven hermetic principles and their application to modern life.',
      category: 'Hermeticism',
      level: 'Intermediate',
      image: '/lovable-uploads/d8b5e246-d962-466e-ad7d-61985e448fb9.png',
      popularity: 88,
      readTime: '35 min'
    },
    {
      id: '3',
      title: 'Sacred Geometry Fundamentals',
      description: 'Discover the mathematical patterns found in nature and sacred architecture.',
      category: 'Sacred Geometry',
      level: 'Beginner',
      image: '/lovable-uploads/a3dc041f-fb55-4108-807b-ca52164461d8.png',
      popularity: 91,
      readTime: '20 min'
    }
  ];

  const handleTopicClick = (topic: Topic) => {
    // In a real app, this would navigate to the topic page
    polymathToast({
      title: `Topic selected: ${topic.title}`,
      description: 'Starting your learning journey.'
    });
  };
  
  return (
    <div className={cn('bg-[#1A1A1A] rounded-lg border border-gray-800 overflow-hidden', className)}>
      <div className="p-5 border-b border-gray-800">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <BookOpen className="text-[#6E59A5]" size={20} />
          Recommended For You
        </h3>
      </div>
      
      <div className="divide-y divide-gray-800">
        {topics.map((topic) => (
          <div
            key={topic.id}
            className="p-5 hover:bg-[#222] transition-colors relative overflow-hidden group"
            onMouseEnter={() => setHoveredTopic(topic.id)}
            onMouseLeave={() => setHoveredTopic(null)}
            onClick={() => handleTopicClick(topic)}
          >
            {/* Background reveal effect */}
            <div 
              className={cn(
                "absolute inset-0 opacity-0 bg-gradient-to-r from-[#1A1A1A] to-[#222222] transition-opacity duration-300",
                hoveredTopic === topic.id && "opacity-100"
              )}
            />
            
            <div className="relative z-10 flex gap-4">
              <div className="w-20 h-20 rounded overflow-hidden flex-shrink-0">
                <img 
                  src={topic.image} 
                  alt={topic.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-white font-medium mb-1">{topic.title}</h4>
                    <p className="text-gray-400 text-sm mb-2 line-clamp-2">{topic.description}</p>
                  </div>
                  
                  <div className={cn(
                    "w-8 h-8 rounded-full bg-[#6E59A5] text-white flex items-center justify-center opacity-0 transform translate-x-2 transition-all duration-300",
                    hoveredTopic === topic.id && "opacity-100 translate-x-0"
                  )}>
                    <ArrowRight size={16} />
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="bg-[#363636] text-xs text-gray-300 px-2 py-0.5 rounded-full">
                    {topic.category}
                  </span>
                  <span className="bg-[#363636] text-xs text-gray-300 px-2 py-0.5 rounded-full">
                    {topic.level}
                  </span>
                  <span className="bg-[#363636] text-xs text-gray-300 px-2 py-0.5 rounded-full">
                    {topic.readTime} read
                  </span>
                </div>
                
                <div className="flex items-center gap-1 mt-2">
                  <Star size={14} className="text-yellow-500" />
                  <span className="text-gray-400 text-xs">{topic.popularity}% positive reviews</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-4 border-t border-gray-800">
        <button 
          className="w-full py-2 bg-[#6E59A5] hover:bg-[#7E69AB] text-white rounded transition-colors flex items-center justify-center gap-2"
          onClick={() => {
            polymathToast({
              title: "More recommendations",
              description: "Loading personalized recommendations based on your interests."
            });
          }}
        >
          <span>Explore All Recommendations</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};
