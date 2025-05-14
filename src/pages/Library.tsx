
import { useState } from "react";
import { PromoBar } from "../components/PromoBar";
import { Sidebar } from "../components/Sidebar";
import Header from "../components/Header";
import { Book, BookOpen, Search, Plus, Library as LibraryIcon, Bookmark } from "lucide-react";
import { polymathToast } from "../components/ui/use-toast";

// Mock library entries
const mockLibraryEntries = [
  {
    id: 1,
    title: "Introduction to Systems Thinking",
    author: "ComplexityScholar",
    category: "Interdisciplinary",
    tags: ["systems theory", "complexity", "holistic thinking"],
    lastUpdated: "2 days ago",
    readTime: "15 min"
  },
  {
    id: 2,
    title: "The Mathematics of Music: Harmony and Frequency",
    author: "HarmonicsExpert",
    category: "Mathematics & Music",
    tags: ["harmonics", "frequency ratios", "musical theory"],
    lastUpdated: "1 week ago",
    readTime: "12 min"
  },
  {
    id: 3,
    title: "Neural Networks: From Biology to Computation",
    author: "BioComputation",
    category: "Computer Science & Biology",
    tags: ["neural networks", "cognition", "artificial intelligence"],
    lastUpdated: "3 days ago",
    readTime: "20 min"
  },
  {
    id: 4,
    title: "Historical Development of Economic Thought",
    author: "EconomicHistorian",
    category: "History & Economics",
    tags: ["economic theory", "historical analysis", "societal evolution"],
    lastUpdated: "5 days ago",
    readTime: "18 min"
  },
  {
    id: 5,
    title: "Philosophical Implications of Quantum Mechanics",
    author: "QuantumThinker",
    category: "Physics & Philosophy",
    tags: ["quantum theory", "metaphysics", "observer effect"],
    lastUpdated: "1 day ago",
    readTime: "25 min"
  }
];

const Library = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  
  const handleSaveResource = () => {
    polymathToast.resourceBookmarked();
  };

  const handleContribution = () => {
    polymathToast.contributionSaved();
  };
  
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
              
              <div className="bg-[#1A1A1A] rounded-lg p-4 mb-6">
                <p className="text-gray-300">
                  Our community-maintained knowledge repository features in-depth articles, research summaries, and learning pathways
                  across multiple disciplines. Find connections between different fields and deepen your understanding.
                </p>
              </div>
              
              <div className="flex gap-6">
                <div className="w-1/4">
                  <div className="bg-[#1A1A1A] rounded-lg p-4">
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
                  </div>
                </div>
                
                <div className="w-3/4">
                  <div className="relative mb-6">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      placeholder="Search the library..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-[#1A1A1A] border border-gray-800 rounded-md py-2 pl-10 pr-4 text-white"
                    />
                  </div>
                  
                  <div className="space-y-4">
                    {mockLibraryEntries.map(entry => (
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
                              <p className="text-sm text-gray-400 mt-1">by {entry.author} • {entry.readTime} read</p>
                              <div className="flex gap-2 mt-2">
                                {entry.tags.map(tag => (
                                  <span key={tag} className="bg-gray-700/50 text-gray-300 px-2 py-0.5 rounded-full text-xs">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                          <button 
                            onClick={handleSaveResource}
                            className="text-gray-400 hover:text-white transition-colors p-2"
                          >
                            <Bookmark size={18} />
                          </button>
                        </div>
                        <div className="mt-4 flex justify-between items-center">
                          <span className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs">
                            {entry.category}
                          </span>
                          <span className="text-gray-400 text-sm">Last updated {entry.lastUpdated}</span>
                        </div>
                      </div>
                    ))}
                  </div>
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
