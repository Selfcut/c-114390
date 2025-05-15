
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PromoBar } from "../components/PromoBar";
import { Sidebar } from "../components/Sidebar";
import Header from "../components/Header";
import { DiscussionTopicCard } from "../components/DiscussionTopicCard";
import { DiscussionFilters } from "../components/DiscussionFilters";
import { polymathToast } from "../components/ui/use-toast";
import { 
  DiscussionTopic, 
  mockDiscussions, 
  getSortedDiscussions,
  filterDiscussionsByTag
} from "../lib/discussions-utils";
import { MessageSquare, PenSquare } from "lucide-react";

const Forum = () => {
  const [discussions, setDiscussions] = useState<DiscussionTopic[]>(mockDiscussions);
  const [filteredDiscussions, setFilteredDiscussions] = useState<DiscussionTopic[]>(mockDiscussions);
  const [sortOption, setSortOption] = useState<'popular' | 'new' | 'upvotes'>('popular');
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Extract unique tags from all discussions
  const allTags = Array.from(
    new Set(mockDiscussions.flatMap(discussion => discussion.tags))
  );
  
  // Apply sorting and filtering whenever dependencies change
  useEffect(() => {
    let result = [...discussions];
    
    // Apply tag filtering
    if (activeTag) {
      result = filterDiscussionsByTag(result, activeTag);
    }
    
    // Apply search filtering
    if (searchTerm) {
      result = result.filter(discussion => 
        discussion.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        discussion.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        discussion.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Apply sorting
    result = getSortedDiscussions(result, sortOption);
    
    setFilteredDiscussions(result);
  }, [discussions, sortOption, activeTag, searchTerm]);
  
  // Handle discussion click
  const handleDiscussionClick = (discussion: DiscussionTopic) => {
    // In a real app, this would navigate to the discussion detail page
    console.log('Discussion clicked:', discussion);
    polymathToast.discussionCreated();
  };
  
  // Handle creating a new discussion
  const handleCreateDiscussion = () => {
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
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                  <MessageSquare size={28} />
                  Discussion Forum
                </h1>
                <button 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
                  onClick={handleCreateDiscussion}
                >
                  <PenSquare size={18} />
                  <span>New Discussion</span>
                </button>
              </div>
              
              <DiscussionFilters 
                onSortChange={setSortOption}
                onFilterChange={setActiveTag}
                onSearchChange={setSearchTerm}
                availableTags={allTags}
              />
              
              <div className="grid grid-cols-1 gap-4">
                {filteredDiscussions.length > 0 ? (
                  filteredDiscussions.map(discussion => (
                    <DiscussionTopicCard 
                      key={discussion.id} 
                      discussion={discussion} 
                      onClick={() => handleDiscussionClick(discussion)}
                    />
                  ))
                ) : (
                  <div className="bg-[#1A1A1A] rounded-lg p-8 text-center">
                    <p className="text-gray-400">No discussions found matching your criteria.</p>
                    <button 
                      className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
                      onClick={() => {
                        setSearchTerm('');
                        setActiveTag(null);
                      }}
                    >
                      Reset Filters
                    </button>
                  </div>
                )}
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Forum;
