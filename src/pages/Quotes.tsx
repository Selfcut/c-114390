import { useState, useEffect } from "react";
import { PromoBar } from "../components/PromoBar";
import { Sidebar } from "../components/Sidebar";
import Header from "../components/Header";
import { QuoteCard } from "../components/QuoteCard";
import { EnhancedQuoteSubmission } from "../components/EnhancedQuoteSubmission";
import { polymathToast } from "../components/ui/use-toast";
import { Quote, Filter, Search, PenSquare } from "lucide-react";

// Mock quotes data
const mockQuotes = [
  {
    id: "1",
    text: "The cave you fear to enter holds the treasure you seek.",
    author: "Joseph Campbell",
    category: "Mythology",
    likes: 156,
    submittedBy: "MythExplorer",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    comments: 12
  },
  {
    id: "2",
    text: "The Kingdom of Heaven is within you; and whosoever shall know themselves shall find it.",
    author: "Ancient Egyptian Proverb",
    category: "Spirituality",
    likes: 243,
    submittedBy: "EsotericScholar",
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  },
  {
    id: "3",
    text: "As above, so below; as within, so without; as the universe, so the soul.",
    author: "Hermes Trismegistus",
    category: "Hermeticism",
    likes: 321,
    submittedBy: "AlchemyAdept",
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
  },
  {
    id: "4",
    text: "The day science begins to study non-physical phenomena, it will make more progress in one decade than in all the previous centuries of its existence.",
    author: "Nikola Tesla",
    category: "Science",
    likes: 198,
    submittedBy: "TeslaVisionary",
    timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
  },
  {
    id: "5",
    text: "If you wish to understand the Universe, think of energy, frequency and vibration.",
    author: "Nikola Tesla",
    category: "Science",
    likes: 276,
    submittedBy: "VibrationTheory",
    timestamp: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000)
  },
  {
    id: "6",
    text: "The All is Mind; The Universe is Mental.",
    author: "The Kybalion",
    category: "Hermeticism",
    likes: 145,
    submittedBy: "MentalUniverse",
    timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
  }
];

// Extract unique categories
const categories = Array.from(new Set(mockQuotes.map(quote => quote.category)));

const Quotes = () => {
  const [quotes, setQuotes] = useState(mockQuotes);
  const [filteredQuotes, setFilteredQuotes] = useState(mockQuotes);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"recent" | "popular">("recent");
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);
  
  // Filter quotes based on search and category
  useEffect(() => {
    let result = [...quotes];
    
    if (searchTerm) {
      result = result.filter(quote => 
        quote.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (categoryFilter) {
      result = result.filter(quote => quote.category === categoryFilter);
    }
    
    // Sort quotes
    if (sortBy === "recent") {
      result.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    } else if (sortBy === "popular") {
      result.sort((a, b) => b.likes - a.likes);
    }
    
    setFilteredQuotes(result);
  }, [quotes, searchTerm, categoryFilter, sortBy]);
  
  const handleQuoteSubmit = (text: string, author: string, category: string) => {
    const newQuote = {
      id: (quotes.length + 1).toString(),
      text,
      author,
      category,
      likes: 0,
      submittedBy: "CurrentUser", // In a real app, this would be the logged-in user
      timestamp: new Date(),
      comments: 0
    };
    
    setQuotes(prev => [...prev, newQuote]);
    setShowSubmissionForm(false);
    polymathToast.contributionSaved();
  };
  
  const handleLike = (id: string) => {
    setQuotes(prev => 
      prev.map(quote => 
        quote.id === id ? { ...quote, likes: quote.likes + 1 } : quote
      )
    );
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <PromoBar />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <div className="flex-1 overflow-auto">
            <main className="py-8 px-12">
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                  <Quote size={28} />
                  Wisdom Quotes
                </h1>
                <button 
                  className="bg-[#6E59A5] hover:bg-[#7E69AB] text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
                  onClick={() => setShowSubmissionForm(true)}
                >
                  <PenSquare size={18} />
                  <span>Share a Quote</span>
                </button>
              </div>
              
              <div className="bg-[#1A1A1A] rounded-lg p-4 mb-8">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search quotes..."
                      className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 pl-10 pr-4 text-white"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Filter size={18} className="text-gray-400" />
                    <select
                      className="bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-white"
                      value={categoryFilter || ""}
                      onChange={(e) => setCategoryFilter(e.target.value || null)}
                    >
                      <option value="">All Categories</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setSortBy("recent")}
                      className={`px-3 py-1.5 text-sm rounded-md ${
                        sortBy === 'recent' ? 'bg-[#6E59A5] text-white' : 'bg-gray-800 text-gray-300'
                      }`}
                    >
                      Recent
                    </button>
                    <button 
                      onClick={() => setSortBy("popular")}
                      className={`px-3 py-1.5 text-sm rounded-md ${
                        sortBy === 'popular' ? 'bg-[#6E59A5] text-white' : 'bg-gray-800 text-gray-300'
                      }`}
                    >
                      Popular
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredQuotes.map((quote, index) => (
                  <QuoteCard 
                    key={quote.id}
                    id={quote.id}
                    text={quote.text}
                    author={quote.author}
                    category={quote.category}
                    likes={quote.likes}
                    comments={12}
                    onLike={() => handleLike(quote.id)}
                    animationDelay={`${index * 0.1}s`}
                  />
                ))}
              </div>
              
              {filteredQuotes.length === 0 && (
                <div className="bg-[#1A1A1A] rounded-lg p-8 text-center mt-6">
                  <Quote size={48} className="text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">No quotes found matching your search criteria.</p>
                  <button 
                    className="mt-4 bg-[#6E59A5] hover:bg-[#7E69AB] text-white px-4 py-2 rounded-md transition-colors"
                    onClick={() => {
                      setSearchTerm("");
                      setCategoryFilter(null);
                    }}
                  >
                    Reset Filters
                  </button>
                </div>
              )}
              
              {showSubmissionForm && (
                <EnhancedQuoteSubmission
                  onSubmit={handleQuoteSubmit}
                  onClose={() => setShowSubmissionForm(false)}
                  categories={categories}
                />
              )}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quotes;
