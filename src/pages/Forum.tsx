
import { useState } from "react";
import { PromoBar } from "../components/PromoBar";
import { Sidebar } from "../components/Sidebar";
import Header from "../components/Header";
import { MessageSquare, BookOpen, Search, Filter, ArrowUp, ArrowDown } from "lucide-react";
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
    timestamp: "2 hours ago"
  },
  {
    id: 2,
    title: "Mathematical beauty in natural patterns",
    author: "FibonacciExplorer",
    replies: 18,
    views: 205,
    category: "Mathematics",
    timestamp: "5 hours ago"
  },
  {
    id: 3,
    title: "The role of linguistics in artificial intelligence",
    author: "LanguageProcessor",
    replies: 32,
    views: 418,
    category: "Computer Science",
    timestamp: "8 hours ago"
  },
  {
    id: 4,
    title: "Historical perspectives on scientific revolutions",
    author: "ParadigmShift",
    replies: 15,
    views: 187,
    category: "History",
    timestamp: "12 hours ago"
  },
  {
    id: 5,
    title: "Ethical considerations in biotechnology advancements",
    author: "MoralCompass",
    replies: 29,
    views: 276,
    category: "Philosophy",
    timestamp: "1 day ago"
  }
];

const Forum = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  
  // Simulate creating a new discussion
  const handleNewDiscussion = () => {
    polymathToast.discussionCreated();
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
                  New Discussion
                </button>
              </div>
              
              <div className="bg-[#1A1A1A] rounded-lg p-4 mb-6">
                <p className="text-gray-300">
                  Welcome to the Polymath discussion forum. This is a space for thoughtful, intellectual discourse across multiple disciplines.
                  Please keep conversations respectful and evidence-based.
                </p>
              </div>
              
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
              
              <div className="bg-[#1A1A1A] rounded-lg overflow-hidden">
                <div className="grid grid-cols-12 gap-4 border-b border-gray-800 py-3 px-4 text-gray-400 text-sm">
                  <div className="col-span-6">Topic</div>
                  <div className="col-span-2">Category</div>
                  <div className="col-span-1 text-center">Replies</div>
                  <div className="col-span-1 text-center">Views</div>
                  <div className="col-span-2 text-right">Posted</div>
                </div>
                
                {mockTopics.map(topic => (
                  <div key={topic.id} className="grid grid-cols-12 gap-4 border-b border-gray-800 py-4 px-4 hover:bg-gray-800 transition-colors">
                    <div className="col-span-6">
                      <div className="flex items-start">
                        <div className="bg-blue-900/30 rounded-full p-2 mr-3">
                          <MessageSquare size={20} className="text-blue-400" />
                        </div>
                        <div>
                          <h3 className="font-medium text-white hover:text-blue-400 transition-colors cursor-pointer">
                            {topic.title}
                          </h3>
                          <p className="text-sm text-gray-400 mt-1">by {topic.author}</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-span-2 self-center">
                      <span className="bg-gray-700/50 text-gray-300 px-2 py-1 rounded text-xs">
                        {topic.category}
                      </span>
                    </div>
                    <div className="col-span-1 text-center self-center text-gray-300">{topic.replies}</div>
                    <div className="col-span-1 text-center self-center text-gray-300">{topic.views}</div>
                    <div className="col-span-2 text-right self-center text-gray-400 text-sm">{topic.timestamp}</div>
                  </div>
                ))}
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Forum;
