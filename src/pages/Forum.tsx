
import { useState, useEffect } from "react";
import { PromoBar } from "../components/PromoBar";
import { Sidebar } from "../components/Sidebar";
import Header from "../components/Header";
import { MessageSquare, BookOpen, Search, Filter, ArrowUp, ArrowDown, User, Clock, Eye, Star } from "lucide-react";
import { polymathToast } from "../components/ui/use-toast";

// Mock forum topics
const mockTopics = [
  {
    id: 1,
    title: "Connections between quantum physics and consciousness",
    author: "PhilosophicalMind",
    replies: 24,
    views: 342,
    category: "Physics",
    timestamp: "2 hours ago",
    isHot: true,
    upvotes: 47,
    tags: ["quantum", "consciousness", "physics"]
  },
  {
    id: 2,
    title: "Mathematical beauty in natural patterns",
    author: "FibonacciExplorer",
    replies: 18,
    views: 205,
    category: "Mathematics",
    timestamp: "5 hours ago",
    isHot: false,
    upvotes: 31,
    tags: ["mathematics", "patterns", "nature"]
  },
  {
    id: 3,
    title: "The role of linguistics in artificial intelligence",
    author: "LanguageProcessor",
    replies: 32,
    views: 418,
    category: "Computer Science",
    timestamp: "8 hours ago",
    isHot: true,
    upvotes: 52,
    tags: ["linguistics", "AI", "computational-language"]
  },
  {
    id: 4,
    title: "Historical perspectives on scientific revolutions",
    author: "ParadigmShift",
    replies: 15,
    views: 187,
    category: "History",
    timestamp: "12 hours ago",
    isHot: false,
    upvotes: 23,
    tags: ["history", "science", "paradigm-shifts"]
  },
  {
    id: 5,
    title: "Ethical considerations in biotechnology advancements",
    author: "MoralCompass",
    replies: 29,
    views: 276,
    category: "Philosophy",
    timestamp: "1 day ago",
    isHot: false,
    upvotes: 38,
    tags: ["ethics", "biotechnology", "philosophy"]
  }
];

// Available categories
const categories = [
  { id: "all", name: "All Topics" },
  { id: "physics", name: "Physics" },
  { id: "mathematics", name: "Mathematics" },
  { id: "computer-science", name: "Computer Science" },
  { id: "philosophy", name: "Philosophy" },
  { id: "history", name: "History" },
  { id: "biology", name: "Biology" },
];

const Forum = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [filteredTopics, setFilteredTopics] = useState(mockTopics);
  const [showNewDiscussionForm, setShowNewDiscussionForm] = useState(false);
  const [newDiscussion, setNewDiscussion] = useState({ title: '', category: '', content: '' });
  
  // Filter topics based on search query and category
  useEffect(() => {
    let filtered = [...mockTopics];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(topic => 
        topic.title.toLowerCase().includes(query) || 
        topic.author.toLowerCase().includes(query) ||
        topic.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    if (selectedCategory !== "all") {
      filtered = filtered.filter(topic => 
        topic.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }
    
    // Apply sorting
    if (sortOrder === "newest") {
      // Already sorted by newest in mock data
    } else if (sortOrder === "popular") {
      filtered = [...filtered].sort((a, b) => b.upvotes - a.upvotes);
    } else if (sortOrder === "active") {
      filtered = [...filtered].sort((a, b) => b.replies - a.replies);
    }
    
    setFilteredTopics(filtered);
  }, [searchQuery, selectedCategory, sortOrder]);
  
  // Simulate creating a new discussion
  const handleNewDiscussion = () => {
    setShowNewDiscussionForm(!showNewDiscussionForm);
  };
  
  const handleDiscussionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form fields
    if (!newDiscussion.title || !newDiscussion.category || !newDiscussion.content) {
      return;
    }
    
    // In a real app, you'd submit this to your backend
    console.log("New discussion:", newDiscussion);
    
    // Show success toast
    polymathToast.discussionCreated();
    
    // Reset form
    setNewDiscussion({ title: '', category: '', content: '' });
    setShowNewDiscussionForm(false);
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
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-white">Discussion Forum</h1>
                <button 
                  onClick={handleNewDiscussion}
                  className="transition-colors text-white flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium bg-blue-700 hover:bg-blue-600"
                >
                  <MessageSquare size={16} />
                  {showNewDiscussionForm ? 'Cancel' : 'New Discussion'}
                </button>
              </div>
              
              {showNewDiscussionForm ? (
                <div className="bg-[#1A1A1A] rounded-lg p-6 mb-8 animate-fade-in">
                  <h2 className="font-semibold text-white text-xl mb-4">Start a New Discussion</h2>
                  <form onSubmit={handleDiscussionSubmit}>
                    <div className="mb-4">
                      <label className="block text-gray-400 mb-2 text-sm">Title</label>
                      <input 
                        type="text"
                        placeholder="Enter a clear, specific title for your discussion"
                        className="w-full bg-[#262626] border border-gray-800 rounded-md py-2 px-4 text-white"
                        value={newDiscussion.title}
                        onChange={(e) => setNewDiscussion({...newDiscussion, title: e.target.value})}
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-gray-400 mb-2 text-sm">Category</label>
                      <select 
                        className="w-full bg-[#262626] border border-gray-800 rounded-md py-2 px-4 text-white"
                        value={newDiscussion.category}
                        onChange={(e) => setNewDiscussion({...newDiscussion, category: e.target.value})}
                      >
                        <option value="">Select a category</option>
                        {categories.filter(cat => cat.id !== "all").map(category => (
                          <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-gray-400 mb-2 text-sm">Content</label>
                      <textarea 
                        placeholder="Share your thoughts, questions, or insights..."
                        className="w-full bg-[#262626] border border-gray-800 rounded-md py-2 px-4 text-white h-32"
                        value={newDiscussion.content}
                        onChange={(e) => setNewDiscussion({...newDiscussion, content: e.target.value})}
                      />
                    </div>
                    
                    <div className="flex justify-end">
                      <button 
                        type="submit"
                        className="transition-colors text-white px-6 py-2 rounded-md text-sm font-medium bg-blue-700 hover:bg-blue-600"
                      >
                        Post Discussion
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="bg-[#1A1A1A] rounded-lg p-4 mb-6">
                  <p className="text-gray-300">
                    Welcome to the Polymath discussion forum. This is a space for thoughtful, intellectual discourse across multiple disciplines.
                    Please keep conversations respectful and evidence-based.
                  </p>
                </div>
              )}
              
              <div className="flex gap-6 mb-8">
                <div className="w-1/4">
                  <div className="bg-[#1A1A1A] rounded-lg p-4">
                    <h3 className="font-medium text-white mb-4">Categories</h3>
                    <ul className="space-y-1">
                      {categories.map(category => (
                        <li key={category.id}>
                          <button
                            className={`w-full text-left px-3 py-2 rounded ${selectedCategory === category.id ? 'bg-blue-900/30 text-blue-400' : 'text-gray-300 hover:bg-gray-800'}`}
                            onClick={() => setSelectedCategory(category.id)}
                          >
                            {category.name}
                          </button>
                        </li>
                      ))}
                    </ul>
                    
                    <h3 className="font-medium text-white mt-6 mb-4">Popular Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {["physics", "mathematics", "ai", "ethics", "biology", "consciousness", "philosophy"].map(tag => (
                        <span key={tag} className="bg-gray-800 text-gray-300 px-2 py-1 rounded-full text-xs cursor-pointer hover:bg-gray-700">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="w-3/4">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="relative flex-grow">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="text"
                        placeholder="Search discussions..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-[#1A1A1A] border border-gray-800 rounded-md py-2 pl-10 pr-4 text-white"
                      />
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Filter size={18} className="text-gray-400" />
                      <select 
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        className="bg-[#1A1A1A] border border-gray-800 rounded-md py-2 px-3 text-white"
                      >
                        <option value="newest">Newest First</option>
                        <option value="popular">Most Popular</option>
                        <option value="active">Recently Active</option>
                      </select>
                    </div>
                  </div>
                  
                  {filteredTopics.length === 0 ? (
                    <div className="bg-[#1A1A1A] rounded-lg p-8 text-center">
                      <MessageSquare size={48} className="mx-auto text-gray-600 mb-4" />
                      <p className="text-gray-400">No discussions found matching your criteria.</p>
                      <button 
                        onClick={() => {
                          setSearchQuery('');
                          setSelectedCategory('all');
                          setSortOrder('newest');
                        }}
                        className="mt-4 text-blue-400 hover:underline"
                      >
                        Clear all filters
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredTopics.map(topic => (
                        <div key={topic.id} className="bg-[#1A1A1A] rounded-lg p-4 hover:bg-gray-800 transition-colors">
                          <div className="flex">
                            <div className="mr-4 flex flex-col items-center">
                              <button className="text-gray-400 hover:text-blue-400">
                                <ArrowUp size={18} />
                              </button>
                              <span className="text-white my-1">{topic.upvotes}</span>
                              <button className="text-gray-400 hover:text-blue-400">
                                <ArrowDown size={18} />
                              </button>
                            </div>
                            
                            <div className="flex-grow">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="bg-gray-700/50 text-gray-300 px-2 py-1 rounded text-xs">
                                  {topic.category}
                                </span>
                                {topic.isHot && (
                                  <span className="bg-red-900/50 text-red-400 px-2 py-1 rounded text-xs">
                                    Hot
                                  </span>
                                )}
                              </div>
                              
                              <h3 className="font-medium text-white text-lg hover:text-blue-400 transition-colors cursor-pointer">
                                {topic.title}
                              </h3>
                              
                              <div className="flex flex-wrap gap-2 mt-2">
                                {topic.tags.map(tag => (
                                  <span key={tag} className="bg-gray-800/80 text-gray-400 px-2 py-0.5 rounded-full text-xs hover:bg-gray-700 cursor-pointer">
                                    #{tag}
                                  </span>
                                ))}
                              </div>
                              
                              <div className="flex justify-between items-center mt-4">
                                <div className="flex items-center gap-4 text-sm">
                                  <div className="flex items-center gap-1 text-gray-400">
                                    <User size={14} />
                                    <span>{topic.author}</span>
                                  </div>
                                  <div className="flex items-center gap-1 text-gray-400">
                                    <MessageSquare size={14} />
                                    <span>{topic.replies}</span>
                                  </div>
                                  <div className="flex items-center gap-1 text-gray-400">
                                    <Eye size={14} />
                                    <span>{topic.views}</span>
                                  </div>
                                </div>
                                
                                <div className="flex items-center gap-1 text-gray-400 text-sm">
                                  <Clock size={14} />
                                  <span>{topic.timestamp}</span>
                                </div>
                              </div>
                            </div>
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

export default Forum;
