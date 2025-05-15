
import { useState } from "react";
import { Link } from "react-router-dom";
import { PromoBar } from "../components/PromoBar";
import { Sidebar } from "../components/Sidebar";
import Header from "../components/Header";
import { QuoteCard } from "../components/QuoteCard";
import { QuoteSubmissionModal } from "../components/QuoteSubmissionModal";
import { Plus, Search, Filter, Quote, BookOpen } from "lucide-react";
import { polymathToast } from "../components/ui/use-toast";

// Mock data for quotes
const mockQuotes = [
  {
    id: "q1",
    text: "The unexamined life is not worth living.",
    author: "Socrates",
    source: "Plato's Apology",
    category: "Philosophy",
    likes: 128,
    comments: 14,
    imageUrl: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb"
  },
  {
    id: "q2",
    text: "As above, so below; as below, so above. By this knowledge alone you shall possess the glory of the whole universe.",
    author: "Hermes Trismegistus",
    source: "The Emerald Tablet",
    category: "Hermeticism",
    likes: 95,
    comments: 7,
    imageUrl: "https://images.unsplash.com/photo-1492321936769-b49830bc1d1e"
  },
  {
    id: "q3",
    text: "Know thyself and you shall know the universe and its gods.",
    author: "Inscription at Temple of Apollo",
    category: "Mysticism",
    likes: 210,
    comments: 19,
    imageUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6"
  },
  {
    id: "q4",
    text: "The stars incline us, they do not bind us.",
    author: "Paracelsus",
    category: "Astrology",
    likes: 76,
    comments: 5,
    imageUrl: "https://images.unsplash.com/photo-1500673922987-e212871fec22"
  },
  {
    id: "q5",
    text: "All things are numbers. Number rules the universe.",
    author: "Pythagoras",
    category: "Sacred Geometry",
    likes: 154,
    comments: 12,
    imageUrl: "https://images.unsplash.com/photo-1460574283810-2aab119d8511"
  },
  {
    id: "q6",
    text: "The kingdom of heaven is within you; and whosoever shall know himself shall find it.",
    author: "Gospel of Thomas",
    category: "Gnosticism",
    likes: 187,
    comments: 21
  },
];

const QuotesPage = () => {
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'newest' | 'popular'>('newest');
  
  const filteredQuotes = mockQuotes.filter(quote => {
    const matchesSearch = quote.text.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         quote.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory ? quote.category.toLowerCase() === selectedCategory.toLowerCase() : true;
    return matchesSearch && matchesCategory;
  });
  
  const sortedQuotes = [...filteredQuotes].sort((a, b) => {
    if (sortBy === 'popular') {
      return b.likes - a.likes;
    }
    // For now just use the order in the array as "newest"
    return 0;
  });

  const categories = ["Philosophy", "Mysticism", "Hermeticism", "Gnosticism", "Kabbalah", "Astrology", "Sacred Geometry"];

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
                <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                  <Quote className="text-[#FF3EA5]" />
                  Wisdom Collection
                </h1>
                <button
                  onClick={() => setIsSubmitModalOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 px-4 py-2 rounded-md transition-colors"
                >
                  <Plus size={18} />
                  Share Quote
                </button>
              </div>

              <div className="bg-[#1A1A1A] p-6 rounded-lg mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">
                  Discover Timeless Wisdom
                </h2>
                <p className="text-gray-300 mb-6">
                  Our community preserves and shares meaningful texts and knowledge that explore the deeper aspects of consciousness and existence.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-[#3A3600]">
                        <BookOpen size={20} className="text-[#FFD426]" />
                      </div>
                      <h3 className="font-semibold text-white">Authentic Collection</h3>
                    </div>
                    <p className="text-sm text-gray-400 pl-9">
                      Access to our carefully curated collection of texts focused on consciousness and ancient wisdom.
                    </p>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-[#00361F]">
                        <BookOpen size={20} className="text-[#00A67E]" />
                      </div>
                      <h3 className="font-semibold text-white">Community Sharing</h3>
                    </div>
                    <p className="text-sm text-gray-400 pl-9">
                      Share insights and discuss interpretations with like-minded individuals in our growing community.
                    </p>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-[#360036]">
                        <BookOpen size={20} className="text-[#FF3EA5]" />
                      </div>
                      <h3 className="font-semibold text-white">Guided Exploration</h3>
                    </div>
                    <p className="text-sm text-gray-400 pl-9">
                      Find your path through organized categories and thoughtfully structured content.
                    </p>
                  </div>
                </div>
              </div>

              {/* Search and filters */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search quotes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-10 text-white"
                  />
                </div>
                <div className="flex gap-2">
                  <select
                    value={selectedCategory || ''}
                    onChange={(e) => setSelectedCategory(e.target.value || null)}
                    className="bg-gray-800 border border-gray-700 rounded-md py-2 px-4 text-white appearance-none cursor-pointer"
                  >
                    <option value="">All Categories</option>
                    {categories.map(category => (
                      <option key={category} value={category.toLowerCase()}>
                        {category}
                      </option>
                    ))}
                  </select>
                  <div className="flex">
                    <button
                      onClick={() => setSortBy('newest')}
                      className={`px-3 py-2 rounded-l-md ${sortBy === 'newest' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300'}`}
                    >
                      Newest
                    </button>
                    <button
                      onClick={() => setSortBy('popular')}
                      className={`px-3 py-2 rounded-r-md ${sortBy === 'popular' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300'}`}
                    >
                      Popular
                    </button>
                  </div>
                </div>
              </div>

              {sortedQuotes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sortedQuotes.map((quote) => (
                    <QuoteCard
                      key={quote.id}
                      id={quote.id}
                      text={quote.text}
                      author={quote.author}
                      source={quote.source}
                      category={quote.category}
                      likes={quote.likes}
                      comments={quote.comments}
                      imageUrl={quote.imageUrl}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Quote size={48} className="mx-auto text-gray-600 mb-4" />
                  <h3 className="text-xl font-medium text-white">No quotes found</h3>
                  <p className="text-gray-400 mt-2">Try adjusting your search or filters</p>
                </div>
              )}
              
              <div className="mt-8 text-center">
                <button 
                  onClick={() => polymathToast.searchComplete(24)}
                  className="border border-gray-700 hover:bg-gray-800 transition-colors text-white px-6 py-2 rounded-md"
                >
                  Load More Quotes
                </button>
              </div>
            </main>
          </div>
        </div>
      </div>
      
      <QuoteSubmissionModal 
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
      />
    </div>
  );
};

export default QuotesPage;
