
import { Search } from "lucide-react";
import { polymathToast } from "./ui/use-toast";

export const QuickSearch = () => {
  return (
    <div className="bg-[#1A1A1A] rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white">Quick Search</h3>
        <Search size={18} className="text-gray-400" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button 
          onClick={() => polymathToast.searchComplete(15)}
          className="bg-gray-800 hover:bg-gray-700 p-3 rounded-md text-sm text-white text-left transition-colors"
        >
          Quantum Computing
        </button>
        <button 
          onClick={() => polymathToast.searchComplete(28)}
          className="bg-gray-800 hover:bg-gray-700 p-3 rounded-md text-sm text-white text-left transition-colors"
        >
          Cognitive Biases
        </button>
        <button 
          onClick={() => polymathToast.searchComplete(23)}
          className="bg-gray-800 hover:bg-gray-700 p-3 rounded-md text-sm text-white text-left transition-colors"
        >
          Game Theory
        </button>
        <button 
          onClick={() => polymathToast.searchComplete(17)}
          className="bg-gray-800 hover:bg-gray-700 p-3 rounded-md text-sm text-white text-left transition-colors"
        >
          Epistemology
        </button>
        <button 
          onClick={() => polymathToast.searchComplete(11)}
          className="bg-gray-800 hover:bg-gray-700 p-3 rounded-md text-sm text-white text-left transition-colors"
        >
          Network Science
        </button>
        <button 
          onClick={() => polymathToast.searchComplete(34)}
          className="bg-gray-800 hover:bg-gray-700 p-3 rounded-md text-sm text-white text-left transition-colors"
        >
          Complex Systems
        </button>
        <button 
          onClick={() => polymathToast.searchComplete(19)}
          className="bg-gray-800 hover:bg-gray-700 p-3 rounded-md text-sm text-white text-left transition-colors"
        >
          Information Theory
        </button>
        <button 
          onClick={() => polymathToast.searchComplete(22)}
          className="bg-gray-800 hover:bg-gray-700 p-3 rounded-md text-sm text-white text-left transition-colors"
        >
          Linguistics
        </button>
      </div>
      <div className="mt-6">
        <input 
          type="text" 
          placeholder="Search all topics..." 
          className="w-full bg-gray-800 border border-gray-700 rounded-md p-3 text-white"
          onKeyDown={(e) => e.key === 'Enter' && polymathToast.searchComplete(Math.floor(Math.random() * 50) + 10)}
        />
      </div>
    </div>
  );
};
