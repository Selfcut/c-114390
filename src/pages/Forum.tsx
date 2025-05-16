
import { useState, useEffect } from "react";
import { DiscussionTopicCard } from "../components/DiscussionTopicCard";
import { DiscussionFilters } from "../components/DiscussionFilters";
import { useToast } from "@/hooks/use-toast";
import { 
  DiscussionTopic, 
  mockDiscussions, 
  getSortedDiscussions,
  filterDiscussionsByTag
} from "../lib/discussions-utils";
import { MessageSquare, PenSquare, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";

const Forum = () => {
  const { user } = useAuth();
  const isAuthenticated = !!user;
  const { toast } = useToast();
  
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
    toast({
      title: "Opening Discussion",
      description: `Viewing "${discussion.title}"`,
    });
  };
  
  // Handle creating a new discussion
  const handleCreateDiscussion = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to create a new discussion",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Create Discussion",
      description: "Opening discussion creation form...",
    });
  };
  
  return (
    <div className="w-full py-8 px-4 sm:px-8 lg:px-12">
      <div className="flex justify-between items-center mb-8 stagger-fade animate-in">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <MessageSquare size={28} />
          Forum
        </h1>
        <Button 
          className="bg-[#6E59A5] hover:bg-[#7E69B5] text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors hover-lift"
          onClick={handleCreateDiscussion}
        >
          <PenSquare size={18} />
          <span>New Discussion</span>
        </Button>
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
          filteredDiscussions.map((discussion) => (
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
      
      {!isAuthenticated && (
        <div className="mt-8 border border-primary/20 bg-primary/5 rounded-lg p-6 text-center">
          <h3 className="text-lg font-medium mb-2">Join the conversation</h3>
          <p className="mb-4 text-muted-foreground">Sign in to create discussions and participate in the community.</p>
          <Button asChild>
            <a href="/auth">Sign In</a>
          </Button>
        </div>
      )}
    </div>
  );
};

export default Forum;
