
import { useState, useEffect } from "react";
import { PromoBar } from "../components/PromoBar";
import { Sidebar } from "../components/Sidebar";
import Header from "../components/Header";
import { Book, BookOpen, Search, Plus, Library as LibraryIcon, Bookmark, Grid, List, SlidersHorizontal, Filter, Star, Clock } from "lucide-react";
import { polymathToast } from "../components/ui/use-toast";
import { ReadingProgressTracker } from "../components/ReadingProgressTracker";

// Mock library entries
const mockLibraryEntries = [
  {
    id: 1,
    title: "Introduction to Systems Thinking",
    author: "ComplexityScholar",
    category: "Interdisciplinary",
    tags: ["systems theory", "complexity", "holistic thinking"],
    lastUpdated: "2 days ago",
    readTime: "15 min",
    abstract: "An exploration of systems thinking as a conceptual framework for understanding complex interactions across disciplines.",
    difficulty: "Intermediate",
    rating: 4.8,
    reads: 547
  },
  {
    id: 2,
    title: "The Mathematics of Music: Harmony and Frequency",
    author: "HarmonicsExpert",
    category: "Mathematics & Music",
    tags: ["harmonics", "frequency ratios", "musical theory"],
    lastUpdated: "1 week ago",
    readTime: "12 min",
    abstract: "Discover the mathematical relationships underpinning musical harmony and frequency patterns.",
    difficulty: "Beginner",
    rating: 4.6,
    reads: 423
  },
  {
    id: 3,
    title: "Neural Networks: From Biology to Computation",
    author: "BioComputation",
    category: "Computer Science & Biology",
    tags: ["neural networks", "cognition", "artificial intelligence"],
    lastUpdated: "3 days ago",
    readTime: "20 min",
    abstract: "This article bridges biological neural networks with their computational counterparts, exploring similarities and differences.",
    difficulty: "Advanced",
    rating: 4.9,
    reads: 812
  },
  {
    id: 4,
    title: "Historical Development of Economic Thought",
    author: "EconomicHistorian",
    category: "History & Economics",
    tags: ["economic theory", "historical analysis", "societal evolution"],
    lastUpdated: "5 days ago",
    readTime: "18 min",
    abstract: "A chronological examination of how economic theories have evolved alongside societal changes.",
    difficulty: "Intermediate",
    rating: 4.3,
    reads: 356
  },
  {
    id: 5,
    title: "Philosophical Implications of Quantum Mechanics",
    author: "QuantumThinker",
    category: "Physics & Philosophy",
    tags: ["quantum theory", "metaphysics", "observer effect"],
    lastUpdated: "1 day ago",
    readTime: "25 min",
    abstract: "Exploring how quantum mechanical principles challenge traditional philosophical concepts of reality and observation.",
    difficulty: "Advanced",
    rating: 4.7,
    reads: 629
  }
];

// User's reading progress (in a real app this would come from a database)
const readingProgress = [
  { id: 1, title: "Neural Networks: From Biology to Computation", progress: 45, lastRead: "yesterday", timeToComplete: "11 min" },
  { id: 2, title: "Philosophical Implications of Quantum Mechanics", progress: 30, lastRead: "3 days ago", timeToComplete: "18 min" },
  { id: 3, title: "Introduction to Systems Thinking", progress: 80, lastRead: "1 week ago", timeToComplete: "3 min" }
];

const Library = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [filteredEntries, setFilteredEntries] = useState(mockLibraryEntries);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [showFilters, setShowFilters] = useState(false);
  const [difficultyFilter, setDifficultyFilter] = useState<string[]>([]);
  const [showContributeForm, setShowContributeForm] = useState(false);
  
  const handleSaveResource = () => {
    polymathToast.resourceBookmarked();
  };

  const handleContribution = () => {
    setShowContributeForm(!showContributeForm);
  };
  
  const submitContribution = (e: React.FormEvent) => {
    e.preventDefault();
    polymathToast.contributionSaved();
    setShowContributeForm(false);
  };
  
  // Filter entries based on search and category
  useEffect(() => {
    let filtered = [...mockLibraryEntries];
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(entry => 
        entry.title.toLowerCase().includes(query) || 
        entry.author.toLowerCase().includes(query) ||
        entry.tags.some(tag => tag.toLowerCase().includes(query)) ||
        entry.abstract.toLowerCase().includes(query)
      );
    }
    
    // Filter by category
    if (activeCategory !== "All") {
      filtered = filtered.filter(entry => 
        entry.category.includes(activeCategory)
      );
    }
    
    // Filter by difficulty
    if (difficultyFilter.length > 0) {
      filtered = filtered.filter(entry => 
        difficultyFilter.includes(entry.difficulty)
      );
    }
    
    setFilteredEntries(filtered);
  }, [searchQuery, activeCategory, difficultyFilter]);
  
  const categories = ["All", "Interdisciplinary", "Mathematics", "Philosophy", "Biology", "Physics", "Computer Science", "History", "Psychology", "Economics", "Arts & Literature"];

  return (
    <div className="min-h-screen flex flex-col">
      <PromoBar />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <div className="flex-1 overflow-auto">
            <main className="py-8 px-12">
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-white">Knowledge Library</h1>
                <button 
                  onClick={handleContribution}
                  className="transition-colors text-white flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium bg-blue-700 hover:bg-blue-600"
                >
                  <Plus size={16} />
                  Contribute
                </button>
              </div>
              
              {showContributeForm ? (
                <div className="bg-[#1A1A1A] rounded-lg p-6 mb-8 animate-fade-in">
                  <h2 className="font-semibold text-white text-xl mb-4">Contribute to the Knowledge Library</h2>
                  <form onSubmit={submitContribution}>
                    <div className="mb-4">
                      <label className="block text-gray-400 mb-2 text-sm">Title</label>
                      <input 
                        type="text"
                        placeholder="A clear, descriptive title for your contribution"
                        className="w-full bg-[#262626] border border-gray-800 rounded-md py-2 px-4 text-white"
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-gray-400 mb-2 text-sm">Category</label>
                      <select 
                        className="w-full bg-[#262626] border border-gray-800 rounded-md py-2 px-4 text-white"
                      >
                        <option value="">Select a category</option>
                        {categories.filter(cat => cat !== "All").map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-gray-400 mb-2 text-sm">Difficulty Level</label>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2 text-gray-300">
                          <input type="radio" name="difficulty" value="beginner" className="accent-blue-500" />
                          Beginner
                        </label>
                        <label className="flex items-center gap-2 text-gray-300">
                          <input type="radio" name="difficulty" value="intermediate" className="accent-blue-500" />
                          Intermediate
                        </label>
                        <label className="flex items-center gap-2 text-gray-300">
                          <input type="radio" name="difficulty" value="advanced" className="accent-blue-500" />
                          Advanced
                        </label>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-gray-400 mb-2 text-sm">Abstract</label>
                      <textarea 
                        placeholder="Brief summary of your contribution (max 250 words)"
                        className="w-full bg-[#262626] border border-gray-800 rounded-md py-2 px-4 text-white h-24"
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-gray-400 mb-2 text-sm">Full Content</label>
                      <textarea 
                        placeholder="Full content of your knowledge contribution"
                        className="w-full bg-[#262626] border border-gray-800 rounded-md py-2 px-4 text-white h-64"
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-gray-400 mb-2 text-sm">Tags (comma separated)</label>
                      <input 
                        type="text"
                        placeholder="e.g., quantum mechanics, philosophy, reality"
                        className="w-full bg-[#262626] border border-gray-800 rounded-md py-2 px-4 text-white"
                      />
                    </div>
                    
                    <div className="flex justify-end">
                      <button 
                        onClick={() => setShowContributeForm(false)}
                        className="transition-colors text-gray-300 border border-gray-700 px-4 py-2 rounded-md text-sm font-medium mr-3"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit"
                        className="transition-colors text-white px-6 py-2 rounded-md text-sm font-medium bg-blue-700 hover:bg-blue-600"
                      >
                        Submit Contribution
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="bg-[#1A1A1A] rounded-lg p-4 mb-6">
                  <p className="text-gray-300">
                    Our community-maintained knowledge repository features in-depth articles, research summaries, and learning pathways
                    across multiple disciplines. Find connections between different fields and deepen your understanding.
                  </p>
                </div>
              )}

              <div className="mb-6">
                <h2 className="text-xl font-semibold text-white mb-4">Continue Learning</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {readingProgress.map(item => (
                    <ReadingProgressTracker
                      key={item.id}
                      title={item.title}
                      progress={item.progress}
                      lastRead={item.lastRead}
                      timeToComplete={item.timeToComplete}
                    />
                  ))}
                </div>
              </div>
              
              <div className="flex gap-6">
                <div className="w-1/4">
                  <div className="bg-[#1A1A1A] rounded-lg p-4 sticky top-4">
                    <h3 className="font-medium text-white mb-4">Categories</h3>
                    <ul className="space-y-2">
                      {categories.map(category => (
                        <li key={category}>
                          <button
                            className={`w-full text-left px-2 py-1.5 rounded ${activeCategory === category ? 'bg-blue-900/30 text-blue-400' : 'text-gray-300 hover:bg-gray-800'}`}
                            onClick={() => setActiveCategory(category)}
                          >
                            {category}
                          </button>
                        </li>
                      ))}
                    </ul>
                    
                    <div className="mt-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-medium text-white">Filters</h3>
                        <button 
                          onClick={() => setShowFilters(!showFilters)}
                          className="text-sm text-blue-400 hover:text-blue-300"
                        >
                          {showFilters ? 'Hide' : 'Show'}
                        </button>
                      </div>
                      
                      {showFilters && (
                        <div className="animate-fade-in">
                          <h4 className="text-sm font-medium text-gray-300 mb-2">Difficulty</h4>
                          <div className="space-y-2">
                            {["Beginner", "Intermediate", "Advanced"].map(level => (
                              <label key={level} className="flex items-center gap-2 text-gray-300 text-sm">
                                <input 
                                  type="checkbox" 
                                  className="accent-blue-500"
                                  checked={difficultyFilter.includes(level)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setDifficultyFilter([...difficultyFilter, level]);
                                    } else {
                                      setDifficultyFilter(difficultyFilter.filter(d => d !== level));
                                    }
                                  }}
                                />
                                {level}
                              </label>
                            ))}
                          </div>
                          
                          <h4 className="text-sm font-medium text-gray-300 mt-4 mb-2">Reading Time</h4>
                          <div className="space-y-2">
                            <label className="flex items-center gap-2 text-gray-300 text-sm">
                              <input type="checkbox" className="accent-blue-500" />
                              Under 10 minutes
                            </label>
                            <label className="flex items-center gap-2 text-gray-300 text-sm">
                              <input type="checkbox" className="accent-blue-500" />
                              10-20 minutes
                            </label>
                            <label className="flex items-center gap-2 text-gray-300 text-sm">
                              <input type="checkbox" className="accent-blue-500" />
                              Over 20 minutes
                            </label>
                          </div>
                          
                          <button className="w-full mt-4 py-1.5 text-sm text-center text-gray-400 hover:text-white hover:bg-gray-800 rounded-md transition-colors">
                            Clear All Filters
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="w-3/4">
                  <div className="flex justify-between items-center mb-6">
                    <div className="relative flex-grow mr-4">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="text"
                        placeholder="Search the library..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-[#1A1A1A] border border-gray-800 rounded-md py-2 pl-10 pr-4 text-white"
                      />
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setViewMode("list")} 
                        className={`p-2 rounded ${viewMode === "list" ? "bg-gray-800 text-white" : "text-gray-400 hover:text-white"}`}
                      >
                        <List size={18} />
                      </button>
                      <button 
                        onClick={() => setViewMode("grid")} 
                        className={`p-2 rounded ${viewMode === "grid" ? "bg-gray-800 text-white" : "text-gray-400 hover:text-white"}`}
                      >
                        <Grid size={18} />
                      </button>
                    </div>
                  </div>
                  
                  {filteredEntries.length === 0 ? (
                    <div className="bg-[#1A1A1A] rounded-lg p-8 text-center">
                      <Book size={48} className="mx-auto text-gray-600 mb-4" />
                      <p className="text-gray-400">No knowledge entries found matching your criteria.</p>
                      <button 
                        onClick={() => {
                          setSearchQuery('');
                          setActiveCategory('All');
                          setDifficultyFilter([]);
                        }}
                        className="mt-4 text-blue-400 hover:underline"
                      >
                        Clear all filters
                      </button>
                    </div>
                  ) : viewMode === "list" ? (
                    <div className="space-y-4">
                      {filteredEntries.map(entry => (
                        <div key={entry.id} className="bg-[#1A1A1A] rounded-lg p-4 hover:bg-gray-800 transition-colors">
                          <div className="flex justify-between">
                            <div className="flex items-start">
                              <div className="bg-blue-900/30 rounded-full p-2 mr-3">
                                <BookOpen size={20} className="text-blue-400" />
                              </div>
                              <div>
                                <h3 className="font-medium text-white hover:text-blue-400 transition-colors cursor-pointer">
                                  {entry.title}
                                </h3>
                                <p className="text-sm text-gray-400 mt-1">by {entry.author} • {entry.readTime} read • {entry.reads} reads</p>
                                <p className="text-sm text-gray-300 mt-2">{entry.abstract}</p>
                                <div className="flex gap-2 mt-3">
                                  {entry.tags.map(tag => (
                                    <span key={tag} className="bg-gray-700/50 text-gray-300 px-2 py-0.5 rounded-full text-xs">
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col items-end">
                              <div className="flex items-center mb-2">
                                <div className="flex items-center text-yellow-400 mr-1">
                                  {Array(5).fill(0).map((_, i) => (
                                    <Star key={i} size={14} className={i < Math.floor(entry.rating) ? "fill-yellow-400" : "text-gray-600"} />
                                  ))}
                                </div>
                                <span className="text-gray-300 text-sm">{entry.rating}</span>
                              </div>
                              <button 
                                onClick={handleSaveResource}
                                className="text-gray-400 hover:text-white transition-colors p-2"
                              >
                                <Bookmark size={18} />
                              </button>
                            </div>
                          </div>
                          <div className="mt-4 flex justify-between items-center">
                            <span className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs">
                              {entry.category}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-1 rounded text-xs ${
                                entry.difficulty === 'Beginner' ? 'bg-green-900/30 text-green-400' : 
                                entry.difficulty === 'Intermediate' ? 'bg-yellow-900/30 text-yellow-400' : 
                                'bg-red-900/30 text-red-400'
                              }`}>
                                {entry.difficulty}
                              </span>
                              <div className="flex items-center text-gray-400 text-xs gap-1">
                                <Clock size={12} />
                                <span>{entry.lastUpdated}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-6">
                      {filteredEntries.map(entry => (
                        <div key={entry.id} className="bg-[#1A1A1A] rounded-lg p-4 hover:bg-gray-800 transition-colors">
                          <div className="flex items-start gap-3 mb-3">
                            <div className="bg-blue-900/30 rounded-full p-2">
                              <BookOpen size={20} className="text-blue-400" />
                            </div>
                            <div className="flex-grow">
                              <h3 className="font-medium text-white hover:text-blue-400 transition-colors cursor-pointer">
                                {entry.title}
                              </h3>
                              <p className="text-xs text-gray-400 mt-1">
                                by {entry.author} • {entry.readTime} read
                              </p>
                            </div>
                            <button 
                              onClick={handleSaveResource}
                              className="text-gray-400 hover:text-white transition-colors"
                            >
                              <Bookmark size={16} />
                            </button>
                          </div>
                          
                          <div className="flex justify-between items-center mt-3">
                            <span className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs">
                              {entry.category}
                            </span>
                            <span className={`px-2 py-1 rounded text-xs ${
                              entry.difficulty === 'Beginner' ? 'bg-green-900/30 text-green-400' : 
                              entry.difficulty === 'Intermediate' ? 'bg-yellow-900/30 text-yellow-400' : 
                              'bg-red-900/30 text-red-400'
                            }`}>
                              {entry.difficulty}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Library;
