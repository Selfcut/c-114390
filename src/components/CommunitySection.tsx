
import { Link } from "react-router-dom";
import { MessageSquare, Users, Youtube } from "lucide-react";

export const CommunitySection = () => {
  return (
    <section className="mb-12 animate-fade-in">
      <h2 className="text-2xl font-bold text-white mb-6">
        Join Our Mystical Circle
      </h2>
      
      <p className="text-gray-300 mb-6">
        Connect with fellow seekers, share knowledge, art, and experiences in our thriving community of mystics and wisdom keepers.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#1A1A1A] p-6 rounded-lg feature-card">
          <div className="p-3 rounded-full bg-[#360036] w-fit mb-4">
            <MessageSquare size={24} className="text-[#FF3EA5]" />
          </div>
          
          <h3 className="text-xl font-semibold text-white mb-2">Discord Community</h3>
          <p className="text-gray-400 mb-4">
            Join our active Discord server where members discuss esoteric topics, share resources, and support each other on their spiritual journeys.
          </p>
          
          <Link 
            to="/discord"
            className="inline-block bg-[#5865F2] hover:bg-[#4752C4] text-white py-2 px-4 rounded-md transition-colors flex items-center gap-2 w-fit"
          >
            <Users size={16} />
            <span>Join Discord</span>
          </Link>
        </div>
        
        <div className="bg-[#1A1A1A] p-6 rounded-lg feature-card">
          <div className="p-3 rounded-full bg-[#3A3600] w-fit mb-4">
            <Youtube size={24} className="text-[#FFD426]" />
          </div>
          
          <h3 className="text-xl font-semibold text-white mb-2">YouTube Channel</h3>
          <p className="text-gray-400 mb-4">
            Explore our video lectures, guided meditations, and discussions on alchemical transformations, ancient knowledge, and spiritual practices.
          </p>
          
          <Link 
            to="/youtube"
            className="inline-block bg-[#FF0000] hover:bg-[#D90000] text-white py-2 px-4 rounded-md transition-colors flex items-center gap-2 w-fit"
          >
            <Youtube size={16} />
            <span>Watch Videos</span>
          </Link>
        </div>
        
        <div className="bg-[#1A1A1A] p-6 rounded-lg feature-card">
          <div className="p-3 rounded-full bg-[#00361F] w-fit mb-4">
            <MessageSquare size={24} className="text-[#00A67E]" />
          </div>
          
          <h3 className="text-xl font-semibold text-white mb-2">Art & Poetry Circles</h3>
          <p className="text-gray-400 mb-4">
            Share your creative expressions inspired by mystical experiences and esoteric wisdom, and connect with like-minded artists and poets.
          </p>
          
          <Link 
            to="/art-poetry"
            className="inline-block bg-gradient-to-r from-[#00A67E] to-[#00816A] hover:from-[#008C6A] hover:to-[#006D59] text-white py-2 px-4 rounded-md transition-colors flex items-center gap-2 w-fit"
          >
            <MessageSquare size={16} />
            <span>Explore Creations</span>
          </Link>
        </div>
      </div>
    </section>
  );
};
