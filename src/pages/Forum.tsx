
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
import { MessageSquare, PenSquare, Tag, Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const Forum = () => {
  const { user } = useAuth();
  const isAuthenticated = !!user;
  const { toast } = useToast();
  
  const [discussions, setDiscussions] = useState<DiscussionTopic[]>(mockDiscussions);
  const [filteredDiscussions, setFilteredDiscussions] = useState<DiscussionTopic[]>(mockDiscussions);
  const [sortOption, setSortOption] = useState<'popular' | 'new' | 'upvotes'>('popular');
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newDiscussion, setNewDiscussion] = useState({
    title: '',
    content: '',
    tags: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Extract unique tags from all discussions
  const allTags = Array.from(
    new Set(discussions.flatMap(discussion => discussion.tags))
  );
  
  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
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
    
    setIsCreateDialogOpen(true);
  };

  const handleSubmitDiscussion = () => {
    if (!newDiscussion.title || !newDiscussion.content) {
      toast({
        title: "Required Fields Missing",
        description: "Please provide a title and content for your discussion",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      const tagsArray = newDiscussion.tags 
        ? newDiscussion.tags.split(',').map(tag => tag.trim()) 
        : ['General'];

      const newPost: DiscussionTopic = {
        id: `discussion-${Date.now()}`,
        title: newDiscussion.title,
        content: newDiscussion.content,
        author: user?.name || 'Anonymous',
        authorAvatar: user?.avatar || '',
        createdAt: new Date(),
        tags: tagsArray,
        upvotes: 0,
        comments: 0,
        views: 0,
        isPopular: false,
        isPinned: false
      };

      setDiscussions(prevDiscussions => [newPost, ...prevDiscussions]);
      setIsCreateDialogOpen(false);
      setNewDiscussion({ title: '', content: '', tags: '' });
      setIsSubmitting(false);

      toast({
        title: "Discussion Created",
        description: "Your new discussion has been posted successfully!",
      });
    }, 1000);
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8 stagger-fade animate-in">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <MessageSquare size={28} />
          Forum
        </h1>
        <Button 
          className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors hover-lift"
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
        {isLoading ? (
          // Skeleton UI for loading state
          Array.from({ length: 5 }).map((_, index) => (
            <Card key={index} className="bg-[#1A1A1A] rounded-lg p-5">
              <div className="flex items-start gap-4">
                <Skeleton className="h-12 w-12 rounded-full bg-[#2A2A2A]" />
                <div className="flex-1">
                  <Skeleton className="h-6 w-3/4 mb-2 bg-[#2A2A2A]" />
                  <Skeleton className="h-4 w-full mb-2 bg-[#2A2A2A]" />
                  <Skeleton className="h-4 w-5/6 mb-3 bg-[#2A2A2A]" />
                  <div className="flex gap-2 mb-3">
                    <Skeleton className="h-6 w-20 rounded-full bg-[#2A2A2A]" />
                    <Skeleton className="h-6 w-24 rounded-full bg-[#2A2A2A]" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-5 w-24 bg-[#2A2A2A]" />
                    <Skeleton className="h-5 w-32 bg-[#2A2A2A]" />
                  </div>
                </div>
              </div>
            </Card>
          ))
        ) : filteredDiscussions.length > 0 ? (
          filteredDiscussions.map((discussion) => (
            <DiscussionTopicCard 
              key={discussion.id} 
              discussion={discussion} 
              onClick={() => handleDiscussionClick(discussion)}
            />
          ))
        ) : (
          <Card className="bg-card rounded-lg p-8 text-center">
            <CardContent className="pt-6">
              <div className="flex justify-center mb-4">
                <div className="rounded-full bg-gray-800 p-4">
                  <MessageSquare size={32} className="text-gray-400" />
                </div>
              </div>
              <p className="text-muted-foreground mb-4">No discussions found matching your criteria.</p>
              <Button 
                className="mt-4 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md transition-colors hover-lift"
                onClick={() => {
                  setSearchTerm('');
                  setActiveTag(null);
                }}
              >
                Reset Filters
              </Button>
            </CardContent>
          </Card>
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

      {/* Create Discussion Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Discussion</DialogTitle>
            <DialogDescription>
              Share your thoughts with the community. Be respectful and follow our community guidelines.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[70vh]">
            <div className="space-y-4 p-1">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input 
                  id="title" 
                  placeholder="Add a descriptive title" 
                  value={newDiscussion.title}
                  onChange={(e) => setNewDiscussion({...newDiscussion, title: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea 
                  id="content" 
                  placeholder="Share your thoughts, questions, or ideas..."
                  className="min-h-[200px]"
                  value={newDiscussion.content}
                  onChange={(e) => setNewDiscussion({...newDiscussion, content: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input 
                  id="tags" 
                  placeholder="philosophy, consciousness, etc."
                  value={newDiscussion.tags}
                  onChange={(e) => setNewDiscussion({...newDiscussion, tags: e.target.value})}
                />
              </div>
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleSubmitDiscussion}
              disabled={isSubmitting || !newDiscussion.title || !newDiscussion.content}
              className="flex items-center gap-2"
            >
              {isSubmitting ? "Posting..." : (
                <>
                  <Send size={16} />
                  <span>Post Discussion</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Forum;
