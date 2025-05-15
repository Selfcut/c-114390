
import { Search } from "lucide-react";
import { polymathToast } from "@/components/ui/use-toast";

export const WelcomeExploration = () => {
  return (
    <section className="mb-12">
      <div className="bg-gradient-to-br from-[#1A1A1A] to-[#222222] rounded-lg p-8 border border-gray-800">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Discover Timeless Wisdom
          </h2>
          
          <p className="text-gray-300 text-lg mb-8">
            Our community preserves and shares meaningful texts and knowledge that explore the deeper aspects of consciousness and existence.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-[#1A1A1A] p-5 rounded-lg fade-in" style={{ animationDelay: "0.1s" }}>
              <h3 className="font-semibold text-white mb-2">Authentic Collection</h3>
              <p className="text-gray-400 text-sm">
                Access to our carefully curated collection of texts focused on consciousness and ancient wisdom.
              </p>
            </div>
            
            <div className="bg-[#1A1A1A] p-5 rounded-lg fade-in" style={{ animationDelay: "0.2s" }}>
              <h3 className="font-semibold text-white mb-2">Community Sharing</h3>
              <p className="text-gray-400 text-sm">
                Share insights and discuss interpretations with like-minded individuals in our growing community.
              </p>
            </div>
            
            <div className="bg-[#1A1A1A] p-5 rounded-lg fade-in" style={{ animationDelay: "0.3s" }}>
              <h3 className="font-semibold text-white mb-2">Guided Exploration</h3>
              <p className="text-gray-400 text-sm">
                Find your path through organized categories and thoughtfully structured content.
              </p>
            </div>
          </div>
          
          <div className="relative max-w-lg mx-auto mb-6">
            <input 
              type="text" 
              placeholder="Search for wisdom topics..." 
              className="w-full bg-[#333333] border border-gray-700 rounded-lg py-3 pl-12 pr-4 text-white focus:border-gray-600 transition-colors"
              onKeyDown={(e) => e.key === 'Enter' && polymathToast.searchComplete(Math.floor(Math.random() * 20) + 10)}
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          </div>
          
          <button 
            className="bg-[#6E59A5] hover:bg-[#7E69AB] text-white px-6 py-3 rounded-md transition-colors mt-4 button-hover-effect"
            onClick={() => polymathToast.contentRecommended()}
          >
            Begin Your Journey
          </button>
        </div>
      </div>
    </section>
  );
};
