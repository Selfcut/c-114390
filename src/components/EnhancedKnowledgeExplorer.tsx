
import { useState, useEffect } from 'react';
import { Search, Filter, BookOpen, ChevronRight, Star, Clock, Users } from 'lucide-react';
import { polymathToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

interface CategoryOption {
  id: string;
  name: string;
  description: string;
  count: number;
  icon?: string;
}

interface KnowledgeItem {
  id: string;
  title: string;
  author: string;
  category: string;
  difficulty: string;
  period: string;
  readTime: string;
  popularity: number;
  readers: number;
  isNew: boolean;
  isRecommended?: boolean;
}

interface EnhancedKnowledgeExplorerProps {
  className?: string;
  onItemSelect?: (item: KnowledgeItem) => void;
}

export const EnhancedKnowledgeExplorer = ({ className, onItemSelect }: EnhancedKnowledgeExplorerProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<string | null>(null);
  const [selectedSort, setSelectedSort] = useState<'popularity'|'recent'|'readers'>("popularity");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<KnowledgeItem[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  // Mock categories
  const categories: CategoryOption[] = [
    { id: "alchemy", name: "Alchemy", description: "Transformative art and early chemistry", count: 24, icon: "flask" },
    { id: "hermeticism", name: "Hermeticism", description: "Esoteric tradition and philosophy", count: 18, icon: "scroll" },
    { id: "gnosticism", name: "Gnosticism", description: "Ancient spiritual knowledge", count: 15, icon: "book" },
    { id: "kabbalah", name: "Kabbalah", description: "Jewish mystical tradition", count: 12, icon: "tree" },
    { id: "astrology", name: "Astrology", description: "Celestial influence on human affairs", count: 20, icon: "star" },
    { id: "sacred-geometry", name: "Sacred Geometry", description: "Mathematical patterns in nature", count: 16, icon: "circle" },
    { id: "mysticism", name: "Mysticism", description: "Direct knowledge of ultimate reality", count: 22, icon: "eye" },
    { id: "numerology", name: "Numerology", description: "Mystical relationships with numbers", count: 14, icon: "hash" },
    { id: "tarot", name: "Tarot", description: "Symbolic card reading", count: 19, icon: "layers" },
    { id: "divination", name: "Divination", description: "Seeking knowledge through supernatural means", count: 17, icon: "crystal" },
    { id: "meditation", name: "Meditation", description: "Mental practices for consciousness", count: 21, icon: "brain" },
    { id: "ancient-texts", name: "Ancient Texts", description: "Historical esoteric writings", count: 26, icon: "scroll" }
  ];

  // Mock difficulty levels
  const difficultyLevels = ["Beginner", "Intermediate", "Advanced", "Scholar"];
  
  // Mock time periods
  const timePeriods = ["Ancient", "Medieval", "Renaissance", "Modern", "Contemporary"];

  // Mock knowledge items - normally would come from database
  const mockItems: KnowledgeItem[] = [
    {
      id: "1",
      title: "The Emerald Tablet of Hermes",
      author: "Hermes Trismegistus",
      category: "hermeticism",
      difficulty: "Advanced",
      period: "Ancient",
      readTime: "25 min",
      popularity: 98,
      readers: 1245,
      isNew: false,
      isRecommended: true
    },
    {
      id: "2",
      title: "Introduction to Alchemical Symbols",
      author: "Maria Prophetissa",
      category: "alchemy",
      difficulty: "Beginner",
      period: "Medieval",
      readTime: "15 min",
      popularity: 85,
      readers: 967,
      isNew: true
    },
    {
      id: "3",
      title: "The Tree of Life: Structure and Symbolism",
      author: "Isaac Luria",
      category: "kabbalah",
      difficulty: "Intermediate",
      period: "Renaissance",
      readTime: "35 min",
      popularity: 92,
      readers: 1089,
      isNew: false
    },
    {
      id: "4",
      title: "Celestial Movements and Human Affairs",
      author: "Claudius Ptolemy",
      category: "astrology",
      difficulty: "Intermediate",
      period: "Ancient",
      readTime: "40 min",
      popularity: 78,
      readers: 834,
      isNew: false
    },
    {
      id: "5",
      title: "The Vesica Piscis in Sacred Architecture",
      author: "Eleonora Mathis",
      category: "sacred-geometry",
      difficulty: "Advanced",
      period: "Modern",
      readTime: "30 min",
      popularity: 88,
      readers: 723,
      isNew: true,
      isRecommended: true
    },
    {
      id: "6",
      title: "The Gospel of Thomas: Hidden Wisdom",
      author: "Elaine Pagels",
      category: "gnosticism",
      difficulty: "Scholar",
      period: "Ancient",
      readTime: "45 min",
      popularity: 95,
      readers: 1352,
      isNew: false
    }
  ];

  // Handle search functionality
  const handleSearch = () => {
    setIsLoading(true);
    setHasSearched(true);
    
    // Simulate API delay
    setTimeout(() => {
      let filtered = [...mockItems];
      
      // Apply search term filter
      if (searchTerm) {
        filtered = filtered.filter(item => 
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.author.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      // Apply category filter
      if (selectedCategory) {
        filtered = filtered.filter(item => item.category === selectedCategory);
      }
      
      // Apply difficulty filter
      if (selectedDifficulty) {
        filtered = filtered.filter(item => item.difficulty === selectedDifficulty);
      }
      
      // Apply period filter
      if (selectedPeriod) {
        filtered = filtered.filter(item => item.period === selectedPeriod);
      }
      
      // Apply sorting
      switch (selectedSort) {
        case 'popularity':
          filtered.sort((a, b) => b.popularity - a.popularity);
          break;
        case 'readers':
          filtered.sort((a, b) => b.readers - a.readers);
          break;
        case 'recent':
          filtered.sort((a, b) => (a.isNew === b.isNew) ? 0 : a.isNew ? -1 : 1);
          break;
      }
      
      setResults(filtered);
      setIsLoading(false);
      
      // Show toast with results count
      polymathToast({
        title: "Search complete",
        description: `Found ${filtered.length} resources matching your criteria.`
      });
    }, 800);
  };
  
  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory(null);
    setSelectedDifficulty(null);
    setSelectedPeriod(null);
    setSelectedSort("popularity");
    setResults([]);
    setHasSearched(false);
  };
  
  // Handle item selection
  const handleItemClick = (item: KnowledgeItem) => {
    if (onItemSelect) {
      onItemSelect(item);
    } else {
      polymathToast({
        title: "Resource selected",
        description: `You selected "${item.title}"`
      });
    }
  };
  
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && document.activeElement === document.getElementById('knowledge-search')) {
        handleSearch();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchTerm, selectedCategory, selectedDifficulty, selectedPeriod]);

  return (
    <div className={cn("bg-[#1A1A1A] rounded-lg border border-gray-800", className)}>
      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <BookOpen className="text-[#6E59A5]" size={20} />
          Knowledge Explorer
        </h3>
        
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input 
            id="knowledge-search"
            type="text"
            className="w-full bg-[#222] border border-gray-700 rounded-md py-2 pl-10 pr-4 text-white focus:border-gray-600 focus:ring-1 focus:ring-[#6E59A5] focus:outline-none transition-colors"
            placeholder="Search knowledge base..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.slice(0, 8).map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
              className={`px-3 py-2 rounded-md text-sm flex items-center gap-1 transition-all duration-200 ${
                selectedCategory === category.id
                  ? 'bg-gray-700 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              {category.name}
              <span className="text-xs text-gray-400">{category.count}</span>
            </button>
          ))}
          
          <button 
            className="px-3 py-2 rounded-md text-sm bg-gray-800 text-gray-300 hover:bg-gray-700 flex items-center gap-1"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={14} />
            {showFilters ? "Hide Filters" : "More Filters"}
          </button>
        </div>
        
        {showFilters && (
          <div className="space-y-4 mb-6 animate-fade-in border-t border-gray-800 pt-4">
            <div>
              <h4 className="text-white font-medium mb-2">Difficulty Level</h4>
              <div className="flex flex-wrap gap-2">
                {difficultyLevels.map(level => (
                  <button
                    key={level}
                    onClick={() => setSelectedDifficulty(selectedDifficulty === level ? null : level)}
                    className={`px-3 py-1 rounded-md text-xs transition-all duration-200 ${
                      selectedDifficulty === level
                        ? 'bg-gray-700 text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-medium mb-2">Time Period</h4>
              <div className="flex flex-wrap gap-2">
                {timePeriods.map(period => (
                  <button
                    key={period}
                    onClick={() => setSelectedPeriod(selectedPeriod === period ? null : period)}
                    className={`px-3 py-1 rounded-md text-xs transition-all duration-200 ${
                      selectedPeriod === period
                        ? 'bg-gray-700 text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-medium mb-2">Sort By</h4>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedSort('popularity')}
                  className={`px-3 py-1 rounded-md text-xs flex items-center gap-1 ${
                    selectedSort === 'popularity'
                      ? 'bg-gray-700 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <Star size={12} /> Popularity
                </button>
                <button
                  onClick={() => setSelectedSort('recent')}
                  className={`px-3 py-1 rounded-md text-xs flex items-center gap-1 ${
                    selectedSort === 'recent'
                      ? 'bg-gray-700 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <Clock size={12} /> Recent
                </button>
                <button
                  onClick={() => setSelectedSort('readers')}
                  className={`px-3 py-1 rounded-md text-xs flex items-center gap-1 ${
                    selectedSort === 'readers'
                      ? 'bg-gray-700 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <Users size={12} /> Most Read
                </button>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex flex-wrap gap-2 justify-between items-center">
          <button
            onClick={handleSearch}
            className="bg-[#6E59A5] hover:bg-[#7E69AB] text-white py-2 px-4 rounded-md transition-colors flex items-center justify-center gap-2 flex-1 md:flex-none"
          >
            <Search size={16} />
            <span>Search Knowledge</span>
          </button>
          
          <button
            onClick={clearFilters}
            className="text-gray-300 hover:text-white transition-colors text-sm underline"
          >
            Clear Filters
          </button>
        </div>
        
        {isLoading && (
          <div className="mt-6 flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-t-2 border-[#6E59A5]"></div>
          </div>
        )}
        
        {hasSearched && !isLoading && (
          <div className="mt-6 space-y-4">
            <h4 className="text-white font-medium border-b border-gray-800 pb-2">
              {results.length > 0 ? `${results.length} Results` : 'No Results Found'}
            </h4>
            
            {results.length > 0 ? (
              <div className="divide-y divide-gray-800">
                {results.map((item) => (
                  <div 
                    key={item.id}
                    className="py-4 hover:bg-[#222] px-2 -mx-2 rounded cursor-pointer transition-colors"
                    onClick={() => handleItemClick(item)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className="text-white font-medium">{item.title}</h5>
                          {item.isNew && (
                            <span className="bg-green-900 text-green-300 text-xs px-2 py-0.5 rounded">New</span>
                          )}
                          {item.isRecommended && (
                            <span className="bg-blue-900 text-blue-300 text-xs px-2 py-0.5 rounded">Recommended</span>
                          )}
                        </div>
                        <p className="text-gray-400 text-sm">{item.author}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <span className="bg-gray-800 text-xs text-gray-300 px-2 py-0.5 rounded">
                            {categories.find(c => c.id === item.category)?.name}
                          </span>
                          <span className="bg-gray-800 text-xs text-gray-300 px-2 py-0.5 rounded">
                            {item.difficulty}
                          </span>
                          <span className="bg-gray-800 text-xs text-gray-300 px-2 py-0.5 rounded">
                            {item.period}
                          </span>
                          <span className="bg-gray-800 text-xs text-gray-300 px-2 py-0.5 rounded">
                            {item.readTime} read
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center text-gray-400 hover:text-white">
                        <ChevronRight size={20} />
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex items-center gap-1 text-gray-400 text-xs">
                        <Star size={12} className="text-yellow-500" />
                        <span>{item.popularity}% positive</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-400 text-xs">
                        <Users size={12} />
                        <span>{item.readers} readers</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-32 bg-[#222] rounded-lg">
                <BookOpen size={32} className="text-gray-600 mb-2" />
                <p className="text-gray-400 text-center">No resources found matching your criteria.</p>
                <p className="text-gray-500 text-sm mt-1">Try adjusting your search filters.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
