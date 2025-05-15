
import { useState } from "react";
import { Link } from "react-router-dom";
import { PromoBar } from "../components/PromoBar";
import { Sidebar } from "../components/Sidebar";
import Header from "../components/Header";
import { QuoteCard } from "../components/QuoteCard";
import { EnhancedQuoteSubmission } from "../components/EnhancedQuoteSubmission";
import { Plus, Search, Filter, Quote, BookOpen, MessageSquare, Users, Star } from "lucide-react";
import { polymathToast } from "../components/ui/use-toast";
import { TopicCard } from "../components/TopicCard";
import { CommunityCircleCard } from "../components/CommunityCircleCard";

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
    comments: 21,
    imageUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6"
  },
];

// Topics for esoteric knowledge
const esotericTopics = [
  {
    title: "Alchemy",
    description: "The ancient practice of transmutation and spiritual growth through manipulating matter.",
    videoCount: 3,
    icon: <BookOpen size={20} className="text-[#FF3EA5]" />
  },
  {
    title: "Hermeticism",
    description: "The esoteric tradition based on writings attributed to Hermes Trismegistus.",
    videoCount: 3,
    icon: <BookOpen size={20} className="text-[#FF3EA5]" />
  },
  {
    title: "Gnosticism",
    description: "Ancient spiritual knowledge emphasizing direct experience of divinity within.",
    videoCount: 3,
    icon: <BookOpen size={20} className="text-[#FF3EA5]" />
  },
  {
    title: "Kabbalah",
    description: "Jewish mystical tradition offering a symbolic understanding of divine nature.",
    videoCount: 3,
    icon: <BookOpen size={20} className="text-[#FF3EA5]" />
  },
  {
    title: "Astrology",
    description: "The study of celestial bodies' movements and their influence on human affairs.",
    videoCount: 3,
    icon: <BookOpen size={20} className="text-[#FF3EA5]" />
  },
  {
    title: "Sacred Geometry",
    description: "Mathematical patterns that recur throughout the universe and in sacred art.",
    videoCount: 3,
    icon: <BookOpen size={20} className="text-[#FF3EA5]" />
  }
];

const QuotesPage = () => {
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'newest' | 'popular'>('newest');
  const [activeTab, setActiveTab] = useState<'quotes' | 'topics' | 'community'>('quotes');
  
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
                        <MessageSquare size={20} className="text-[#00A67E]" />
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
                        <Users size={20} className="text-[#FF3EA5]" />
                      </div>
                      <h3 className="font-semibold text-white">Guided Exploration</h3>
                    </div>
                    <p className="text-sm text-gray-400 pl-9">
                      Find your path through organized categories and thoughtfully structured content.
                    </p>
                  </div>
                </div>
              </div>

              {/* Tabs for different sections */}
              <div className="flex border-b border-gray-800 mb-6">
                <button
                  className={`py-2 px-4 font-medium ${activeTab === 'quotes' ? 'text-white border-b-2 border-blue-600' : 'text-gray-400 hover:text-gray-300'}`}
                  onClick={() => setActiveTab('quotes')}
                >
                  Quotes
                </button>
                <button
                  className={`py-2 px-4 font-medium ${activeTab === 'topics' ? 'text-white border-b-2 border-blue-600' : 'text-gray-400 hover:text-gray-300'}`}
                  onClick={() => setActiveTab('topics')}
                >
                  Topics
                </button>
                <button
                  className={`py-2 px-4 font-medium ${activeTab === 'community' ? 'text-white border-b-2 border-blue-600' : 'text-gray-400 hover:text-gray-300'}`}
                  onClick={() => setActiveTab('community')}
                >
                  Community
                </button>
              </div>

              {/* Quotes Section */}
              {activeTab === 'quotes' && (
                <>
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
                </>
              )}

              {/* Topics Section */}
              {activeTab === 'topics' && (
                <>
                  <h2 className="text-2xl font-bold text-white mb-6">
                    Explore Topics
                  </h2>
                  <p className="text-gray-300 mb-6">
                    Dive into our comprehensive collection organized by subjects and themes
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {esotericTopics.map((topic, index) => (
                      <TopicCard
                        key={index}
                        title={topic.title}
                        description={topic.description}
                        icon={topic.icon}
                        videoCount={topic.videoCount}
                        onClick={() => polymathToast.contentRecommended()}
                      />
                    ))}
                  </div>

                  <div className="bg-[#1A1A1A] rounded-lg p-6 mt-8">
                    <h3 className="text-xl font-bold text-white mb-4">Featured Books</h3>
                    <p className="text-gray-300 mb-6">
                      Explore our curated collection of books offering deep insights into esoteric knowledge.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-gray-800 rounded-lg p-4">
                        <h4 className="font-semibold text-white">The Alchemist's Path</h4>
                        <div className="flex items-center text-yellow-400 my-1">
                          <Star size={14} className="fill-yellow-400" />
                          <Star size={14} className="fill-yellow-400" />
                          <Star size={14} className="fill-yellow-400" />
                          <Star size={14} className="fill-yellow-400" />
                          <Star size={14} className="fill-yellow-400 opacity-80" />
                          <span className="ml-1 text-sm">4.8</span>
                        </div>
                        <p className="text-gray-400 text-xs mb-2">By Alexandria Hermes</p>
                        <p className="text-sm text-gray-300 mb-3">
                          A modern guide to practical alchemy and spiritual transformation.
                        </p>
                        <button className="text-blue-400 text-sm hover:underline">
                          View Details
                        </button>
                      </div>

                      <div className="bg-gray-800 rounded-lg p-4">
                        <h4 className="font-semibold text-white">Shadows of Anubis</h4>
                        <div className="flex items-center text-yellow-400 my-1">
                          <Star size={14} className="fill-yellow-400" />
                          <Star size={14} className="fill-yellow-400" />
                          <Star size={14} className="fill-yellow-400" />
                          <Star size={14} className="fill-yellow-400" />
                          <Star size={14} className="fill-yellow-400 opacity-90" />
                          <span className="ml-1 text-sm">4.9</span>
                        </div>
                        <p className="text-gray-400 text-xs mb-2">By Imhotep Khai</p>
                        <p className="text-sm text-gray-300 mb-3">
                          Journey through the Egyptian afterlife and the mysteries of death and rebirth.
                        </p>
                        <button className="text-blue-400 text-sm hover:underline">
                          View Details
                        </button>
                      </div>

                      <div className="bg-gray-800 rounded-lg p-4">
                        <h4 className="font-semibold text-white">The Ninth Dot</h4>
                        <div className="flex items-center text-yellow-400 my-1">
                          <Star size={14} className="fill-yellow-400" />
                          <Star size={14} className="fill-yellow-400" />
                          <Star size={14} className="fill-yellow-400" />
                          <Star size={14} className="fill-yellow-400" />
                          <Star size={14} className="fill-yellow-400 opacity-70" />
                          <span className="ml-1 text-sm">4.7</span>
                        </div>
                        <p className="text-gray-400 text-xs mb-2">By Sophia Luz</p>
                        <p className="text-sm text-gray-300 mb-3">
                          Exploring the Council of Nine Dots and their influence throughout history.
                        </p>
                        <button className="text-blue-400 text-sm hover:underline">
                          View Details
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-center mt-6">
                      <button
                        onClick={() => polymathToast.searchComplete(15)}
                        className="border border-gray-700 hover:bg-gray-800 transition-colors text-white px-6 py-2 rounded-md"
                      >
                        View All Books
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* Community Section */}
              {activeTab === 'community' && (
                <>
                  <h2 className="text-2xl font-bold text-white mb-6">
                    Join Our Mystical Circle
                  </h2>
                  <p className="text-gray-300 mb-6">
                    Connect with fellow seekers, share knowledge, art, and experiences in our thriving community of mystics and wisdom keepers.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <CommunityCircleCard
                      title="Discord Community"
                      description="Join our active Discord server where members discuss esoteric topics, share resources, and support each other on their spiritual journeys."
                      icon={<MessageSquare size={20} className="text-[#FF3EA5]" />}
                      buttonText="Join Discord"
                      buttonAction={() => polymathToast.joinedStudyGroup()}
                    />

                    <CommunityCircleCard
                      title="YouTube Channel"
                      description="Explore our video lectures, guided meditations, and discussions on alchemical transformations, ancient knowledge, and spiritual practices."
                      icon={<BookOpen size={20} className="text-[#FF3EA5]" />}
                      buttonText="Watch Videos"
                      buttonAction={() => polymathToast.contentRecommended()}
                    />

                    <CommunityCircleCard
                      title="Art & Poetry Circles"
                      description="Share your creative expressions inspired by mystical experiences and esoteric wisdom, and connect with like-minded artists and poets."
                      icon={<Users size={20} className="text-[#FF3EA5]" />}
                      buttonText="Explore Creations"
                      buttonAction={() => polymathToast.searchComplete(12)}
                    />
                  </div>

                  <div className="bg-[#1A1A1A] rounded-lg p-6">
                    <h3 className="text-xl font-bold text-white mb-4">Join Our Community</h3>
                    <p className="text-gray-300 mb-4">
                      We're a gathering of seekers dedicated to preserving and discussing the knowledge that mainstream institutions often overlook.
                    </p>

                    <ul className="space-y-2 mb-6">
                      <li className="flex items-start gap-2 text-gray-300">
                        <div className="mt-1 min-w-4">•</div>
                        <div>Access to our authentic collection</div>
                      </li>
                      <li className="flex items-start gap-2 text-gray-300">
                        <div className="mt-1 min-w-4">•</div>
                        <div>Join discussions with like-minded individuals</div>
                      </li>
                      <li className="flex items-start gap-2 text-gray-300">
                        <div className="mt-1 min-w-4">•</div>
                        <div>Share your own insights and discoveries</div>
                      </li>
                      <li className="flex items-start gap-2 text-gray-300">
                        <div className="mt-1 min-w-4">•</div>
                        <div>Participate in regular community events</div>
                      </li>
                    </ul>

                    <button
                      onClick={() => polymathToast.joinedStudyGroup()}
                      className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors font-medium"
                    >
                      Become a Member
                    </button>
                  </div>
                </>
              )}
            </main>
          </div>
        </div>
      </div>
      
      <EnhancedQuoteSubmission 
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
      />
    </div>
  );
};

export default QuotesPage;
