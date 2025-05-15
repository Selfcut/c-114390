import React from 'react';
import { BookOpen, Flame, GraduationCap, Lightbulb, Rocket } from 'lucide-react';
import { cn } from "@/lib/utils";
// Update import for toast 
import { toast } from "@/components/ui/use-toast";

interface TopicRecommendationProps {
  topic: string;
  description: string;
  icon: React.ReactNode;
  onExplore: (topic: string) => void;
}

const TopicCard = ({ topic, description, icon, onExplore }: TopicRecommendationProps) => (
  <div 
    className="bg-[#1A1A1A] rounded-lg p-4 hover:bg-gray-800 transition-colors cursor-pointer"
    onClick={() => onExplore(topic)}
  >
    <div className="flex items-center gap-3 mb-2">
      <div className="p-2 rounded-full bg-gray-900/30">
        {icon}
      </div>
      <h4 className="text-white font-medium">{topic}</h4>
    </div>
    <p className="text-sm text-gray-400">{description}</p>
  </div>
);

interface TopicRecommendationsProps {
  className?: string;
}

export const TopicRecommendations = ({ className }: TopicRecommendationsProps) => {
  const topics = [
    {
      topic: "Alchemy",
      description: "Explore the ancient art of transformation.",
      icon: <Flame className="text-orange-400" size={20} />,
    },
    {
      topic: "Hermeticism",
      description: "Uncover the timeless wisdom of Hermes Trismegistus.",
      icon: <BookOpen className="text-blue-400" size={20} />,
    },
    {
      topic: "Gnosticism",
      description: "Delve into the mystical knowledge of Gnostic teachings.",
      icon: <Lightbulb className="text-yellow-400" size={20} />,
    },
    {
      topic: "Sacred Geometry",
      description: "Discover the hidden patterns of the universe.",
      icon: <GraduationCap className="text-purple-400" size={20} />,
    },
  ];
  
  const handleExplore = (topic: string) => {
    toast({
      title: "Exploring Topic",
      description: `Loading content for ${topic}`
    });
    
    // Simulate navigation or content loading
    console.log(`Exploring topic: ${topic}`);
  };

return (
  <div className={cn("space-y-4", className)}>
    <h3 className="text-xl font-bold text-white">Explore New Topics</h3>
    <p className="text-sm text-gray-400">
      Dive deeper into related subjects and expand your understanding.
    </p>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {topics.map((topic, index) => (
        <TopicCard
          key={index}
          topic={topic.topic}
          description={topic.description}
          icon={topic.icon}
          onExplore={handleExplore}
        />
      ))}
    </div>
    
    <button 
      onClick={() => {
        toast({
          title: "Loading More Topics",
          description: "Fetching additional recommendations"
        });
      }}
      className="w-full py-2 mt-4 bg-gray-800 hover:bg-gray-700 text-white rounded-md transition-colors"
    >
      Discover More Topics
    </button>
  </div>
);
};
