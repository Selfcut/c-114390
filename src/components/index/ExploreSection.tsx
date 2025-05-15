
import { Link } from "react-router-dom";
import { CreationCard } from "../CreationCard";
import { WelcomeExploration } from "../WelcomeExploration";
import { Quote } from "lucide-react";

export const ExploreSection = () => {
  return (
    <>
      <h1 className="text-3xl font-bold text-white mb-8 animate-fade-in" style={{ animationDelay: "0.1s" }}>
        Explore Intellectual Frontiers
      </h1>
      
      {/* Welcome and Exploration Banner */}
      <WelcomeExploration />
      
      {/* Creation cards with hover lift effect */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 animate-fade-in" style={{ animationDelay: "0.2s" }}>
        <Link to="/forum" className="transform transition-transform hover:scale-102 hover:translate-y-[-4px]">
          <CreationCard type="discussion" />
        </Link>
        <Link to="/library" className="transform transition-transform hover:scale-102 hover:translate-y-[-4px]">
          <CreationCard type="knowledge" />
        </Link>
        <Link to="/quotes" className="transform transition-transform hover:scale-102 hover:translate-y-[-4px]">
          <div className="creation-card bg-gradient-to-br from-[#36003B] to-[#500056] rounded-lg p-6 h-full flex flex-col hover-lift">
            <div className="mb-4 p-3 rounded-full bg-[#FF3EA5]/20 w-fit">
              <Quote size={24} className="text-[#FF3EA5]" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Share a Quote</h3>
            <p className="text-gray-300 mb-6">Discover and contribute to our collection of timeless wisdom.</p>
            <div className="mt-auto">
              <span className="text-xs text-[#FF3EA5] bg-[#FF3EA5]/10 px-2 py-1 rounded">
                NEW FEATURE
              </span>
            </div>
          </div>
        </Link>
      </div>
    </>
  );
};
