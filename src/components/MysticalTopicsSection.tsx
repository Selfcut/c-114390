
import { useState } from "react";
import { Link } from "react-router-dom";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Book, BookOpen, ChevronDown, ChevronUp } from "lucide-react";

interface MysticalTopic {
  name: string;
  description: string;
  videoCount: number;
  path: string;
  className: string;
}

const topicsData: MysticalTopic[] = [
  {
    name: "Alchemy",
    description: "The ancient practice of transmutation and spiritual growth through manipulating matter.",
    videoCount: 3,
    path: "/topics/alchemy",
    className: "bg-[#3A3600] text-[#FFD426]"
  },
  {
    name: "Hermeticism",
    description: "The esoteric tradition based on writings attributed to Hermes Trismegistus.",
    videoCount: 3,
    path: "/topics/hermeticism",
    className: "bg-[#003619] text-[#00A67E]"
  },
  {
    name: "Gnosticism",
    description: "Ancient spiritual knowledge emphasizing direct experience of divinity within.",
    videoCount: 3,
    path: "/topics/gnosticism",
    className: "bg-[#360036] text-[#FF3EA5]"
  },
  {
    name: "Kabbalah",
    description: "Jewish mystical tradition offering a symbolic understanding of divine nature.",
    videoCount: 3,
    path: "/topics/kabbalah",
    className: "bg-[#00361F] text-[#00A67E]"
  },
  {
    name: "Astrology",
    description: "The study of celestial bodies' movements and their influence on human affairs.",
    videoCount: 3,
    path: "/topics/astrology",
    className: "bg-[#36003B] text-[#FF3EA5]"
  },
  {
    name: "Sacred Geometry",
    description: "Mathematical patterns that recur throughout the universe and in sacred art.",
    videoCount: 3,
    path: "/topics/sacred-geometry",
    className: "bg-[#3A3600] text-[#FFD426]"
  }
];

export const MysticalTopic = ({ topic }: { topic: MysticalTopic }) => {
  return (
    <div className="bg-[#1A1A1A] rounded-lg p-4 hover:bg-[#222222] transition-colors feature-card">
      <div className="flex items-start gap-3">
        <div className={`p-3 rounded-lg ${topic.className} mr-4 flex items-center justify-center`}>
          <Book size={20} className={topic.className.split(" ")[1]} />
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-white mb-2">{topic.name}</h3>
          <p className="text-sm text-gray-400 mb-3">{topic.description}</p>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">{topic.videoCount} videos</span>
            <Link 
              to={topic.path} 
              className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1 transition-colors"
            >
              Explore
              <BookOpen size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export const MysticalTopicsSection = () => {
  const [isOpen, setIsOpen] = useState(true);
  
  return (
    <section className="mb-12 animate-fade-in">
      <Collapsible 
        open={isOpen} 
        onOpenChange={setIsOpen}
        className="border border-gray-800 rounded-lg p-6 bg-[#1A1A1A]"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">
            Explore Mystical Topics
          </h2>
          <CollapsibleTrigger className="p-2 hover:bg-gray-800 rounded-md transition-colors">
            {isOpen ? (
              <ChevronUp size={20} className="text-gray-400" />
            ) : (
              <ChevronDown size={20} className="text-gray-400" />
            )}
          </CollapsibleTrigger>
        </div>
        
        <p className="text-gray-300 mb-6">
          Dive into our comprehensive collection organized by subjects and themes
        </p>
        
        <CollapsibleContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topicsData.map((topic) => (
              <MysticalTopic key={topic.name} topic={topic} />
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </section>
  );
};
