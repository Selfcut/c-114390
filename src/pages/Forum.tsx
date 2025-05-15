
import { useState, useEffect } from "react";
import { PageLayout } from "../components/layouts/PageLayout";
import { DiscussionTopicCard } from "../components/DiscussionTopicCard";
import { DiscussionFilters } from "../components/DiscussionFilters";
import { polymathToast } from "../components/ui/use-toast";
import { 
  DiscussionTopic, 
  mockDiscussions, 
  getSortedDiscussions,
  filterDiscussionsByTag
} from "../lib/discussions-utils";
import { MessageSquare, PenSquare, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
    <PageLayout>
      <main className="py-8 px-12">
        <div className="flex justify-between items-center mb-8 stagger-fade animate-in">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <MessageSquare size={28} />
            Forum
          </h1>
          <button 
            className="bg-[#6E59A5] hover:bg-[#7E69B5] text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors hover-lift"
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
        
        {activeTag && (
          <div className="mb-4 flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Active Filter:</span>
            <Badge className="flex items-center gap-1 px-2 py-1 bg-primary/20 text-primary hover:bg-primary/40">
              <Tag size={14} />
              {activeTag}
              <button
                className="ml-2 hover:text-white"
                onClick={() => setActiveTag(null)}
              >
                ×
              </button>
            </Badge>
          </div>
        )}
        
        <div className="grid grid-cols-1 gap-4 stagger-fade animate-in">
          {filteredDiscussions.length > 0 ? (
            filteredDiscussions.map((discussion, index) => (
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
                className="mt-4 bg-[#6E59A5] hover:bg-[#7E69B5] text-white px-4 py-2 rounded-md transition-colors hover-lift"
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
    </PageLayout>
  );
};

export default Forum;
