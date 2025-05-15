
import { useState } from 'react';
import { BookOpen, Search, Filter } from 'lucide-react';
import { polymathToast } from "@/components/ui/use-toast";
import { useTheme } from "@/lib/theme-context";

const categories = [
  "Alchemy", "Hermeticism", "Gnosticism", "Kabbalah", 
  "Astrology", "Sacred Geometry", "Mysticism", "Numerology",
  "Tarot", "Divination", "Meditation", "Ancient Texts"
];

const difficultiesOptions = ["Beginner", "Intermediate", "Advanced", "Scholar"];
const timePeriodsOptions = ["Ancient", "Medieval", "Renaissance", "Modern", "Contemporary"];

export const KnowledgeBrowser = () => {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [difficulties, setDifficulties] = useState<string[]>([]);
  const [timePeriods, setTimePeriods] = useState<string[]>([]);

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleSearch = () => {
    const totalFilters = selectedCategories.length + difficulties.length + timePeriods.length;
    const resultsCount = Math.floor(Math.random() * 30) + (totalFilters > 0 ? 5 : 20);
    polymathToast.searchComplete(resultsCount);
  };

  const handleDifficultyToggle = (difficulty: string) => {
    setDifficulties(prev => 
      prev.includes(difficulty) 
        ? prev.filter(d => d !== difficulty)
        : [...prev, difficulty]
    );
  };

  const handleTimePeriodToggle = (period: string) => {
    setTimePeriods(prev => 
      prev.includes(period) 
        ? prev.filter(p => p !== period)
        : [...prev, period]
    );
  };

  const isDark = theme === 'dark';

  return (
    <div className={`knowledge-browser ${isDark ? 'bg-[#1A1A1A] border-gray-800' : 'bg-white border-gray-200'} rounded-lg p-6 border`}>
      <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-800'} mb-4`}>Knowledge Explorer</h3>
      
      <div className="relative mb-6">
        <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} size={18} />
        <input 
          type="text"
          className={`w-full ${
            isDark 
              ? 'bg-gray-800 border-gray-700 text-white focus:border-gray-600' 
              : 'bg-gray-100 border-gray-300 text-gray-800 focus:border-gray-400'
          } border rounded-md py-2 pl-10 pr-4 transition-colors`}
          placeholder="Search knowledge base..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
      </div>
      
      <div className="flex items-center justify-between mb-4">
        <h4 className={isDark ? 'text-white' : 'text-gray-800'}>Categories</h4>
        <button 
          className={`flex items-center gap-1 ${
            isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-800'
          } transition-colors text-sm`}
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter size={16} />
          <span>Filters</span>
        </button>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => handleCategoryToggle(category)}
            className={`px-3 py-2 rounded-md text-sm transition-all duration-200 ${
              selectedCategories.includes(category)
                ? isDark 
                  ? 'bg-gray-700 text-white'
                  : 'bg-blue-100 text-blue-800'
                : isDark
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
      
      {showFilters && (
        <div className="space-y-4 mb-6 animate-fade-in border-t border-gray-800 pt-4">
          <div>
            <h4 className={isDark ? 'text-white' : 'text-gray-800'}>Difficulty Level</h4>
            <div className="flex flex-wrap gap-2 mt-2">
              {difficultiesOptions.map(difficulty => (
                <button
                  key={difficulty}
                  onClick={() => handleDifficultyToggle(difficulty)}
                  className={`px-3 py-1 rounded-md text-xs transition-all duration-200 ${
                    difficulties.includes(difficulty)
                      ? isDark 
                        ? 'bg-gray-700 text-white'
                        : 'bg-blue-100 text-blue-800'
                      : isDark
                        ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {difficulty}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className={isDark ? 'text-white' : 'text-gray-800'}>Time Period</h4>
            <div className="flex flex-wrap gap-2 mt-2">
              {timePeriodsOptions.map(period => (
                <button
                  key={period}
                  onClick={() => handleTimePeriodToggle(period)}
                  className={`px-3 py-1 rounded-md text-xs transition-all duration-200 ${
                    timePeriods.includes(period)
                      ? isDark 
                        ? 'bg-gray-700 text-white'
                        : 'bg-blue-100 text-blue-800'
                      : isDark
                        ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      
      <button
        onClick={handleSearch}
        className={`w-full ${isDark ? 'bg-blue-700 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-500'} text-white py-2 rounded-md transition-colors flex items-center justify-center gap-2`}
      >
        <BookOpen size={18} />
        <span>Explore Knowledge</span>
      </button>
    </div>
  );
};
