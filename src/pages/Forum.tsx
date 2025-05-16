
import React, { useState, useEffect } from 'react';
import { PageLayout } from '@/components/layouts/PageLayout';
import { 
  Search, 
  Filter, 
  Plus, 
  MessageSquare,
  PenSquare,
  Send,
} from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { DiscussionTopicCard } from "../components/DiscussionTopicCard";
import { DiscussionFilters } from "../components/DiscussionFilters";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from 'react-router-dom';

interface DiscussionTopic {
  id: string;
  title: string;
  content: string;
  author: string;
  authorId: string;
  authorAvatar?: string;
  createdAt: Date;
  tags?: string[];
  upvotes: number;
  views: number;
  comments: number;
  isPinned: boolean;
  isPopular: boolean;
}

const Forum = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAuthenticated = !!user;
  const { toast } = useToast();
  
  const [discussions, setDiscussions] = useState<DiscussionTopic[]>([]);
  const [filteredDiscussions, setFilteredDiscussions] = useState<DiscussionTopic[]>([]);
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
  const [allTags, setAllTags] = useState<string[]>([]);
  
  // Fetch discussions (using simulated data until forum_posts table is created)
  useEffect(() => {
    const fetchDiscussions = async () => {
      try {
        setIsLoading(true);
        
        // Simulated forum data until the forum_posts table is created
        const simulatedDiscussions: DiscussionTopic[] = [
          {
            id: "1",
            title: "The Relationship Between Consciousness and Quantum Mechanics",
            content: "Recent theories in quantum physics suggest consciousness might play a role in quantum wave function collapse. What are your thoughts on this intersection?",
            author: "QuantumThinker",
            authorId: "user-123",
            authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=QuantumThinker",
            createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
            tags: ["quantum-physics", "consciousness", "philosophy"],
            upvotes: 24,
            views: 142,
            comments: 8,
            isPinned: true,
            isPopular: true
          },
          {
            id: "2",
            title: "Exploring Eastern Philosophy in Modern Context",
            content: "How can ancient Eastern philosophical concepts like non-attachment and mindfulness be meaningfully integrated into modern Western society?",
            author: "PhilosophyExplorer",
            authorId: "user-456",
            authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=PhilosophyExplorer",
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
            tags: ["eastern-philosophy", "mindfulness", "modern-society"],
            upvotes: 18,
            views: 97,
            comments: 12,
            isPinned: false,
            isPopular: true
          },
          {
            id: "3",
            title: "The Ethics of Artificial Intelligence Development",
            content: "As AI systems become more advanced, what ethical frameworks should guide their development and implementation?",
            author: "EthicalTech",
            authorId: "user-789",
            authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=EthicalTech",
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            tags: ["ethics", "artificial-intelligence", "technology"],
            upvotes: 32,
            views: 203,
            comments: 15,
            isPinned: false,
            isPopular: true
          },
          {
            id: "4",
            title: "Art as a Gateway to Spiritual Experience",
            content: "Throughout history, art has been used as a means to transcend ordinary consciousness. Let's discuss how different art forms achieve this effect.",
            author: "ArtisticSoul",
            authorId: "user-101",
            authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ArtisticSoul",
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
            tags: ["art", "spirituality", "consciousness"],
            upvotes: 21,
            views: 89,
            comments: 7,
            isPinned: false,
            isPopular: false
          },
          {
            id: "5",
            title: "Understanding the Nature of Time",
            content: "Is time a fundamental aspect of reality or merely a construct of human perception? Let's examine philosophical and scientific perspectives.",
            author: "TimeExplorer",
            authorId: "user-202",
            authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=TimeExplorer",
            createdAt: new Date(Date.now() - 10 * 60 * 60 * 1000),
            tags: ["time", "philosophy", "physics"],
            upvotes: 14,
            views: 76,
            comments: 9,
            isPinned: false,
            isPopular: false
          }
        ];
        
        // Extract unique tags from simulated discussions
        const tags = Array.from(
          new Set(simulatedDiscussions.flatMap(post => post.tags || []))
        );
        setAllTags(tags);
        
        setDiscussions(simulatedDiscussions);
        
        toast({
          description: "Using simulated forum data for development",
          variant: "default"
        });
        
      } catch (err) {
        console.error('Error fetching discussions:', err);
        toast({
          title: "Error",
          description: "Failed to load forum discussions",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDiscussions();
  }, [toast]);
  
  // Filter and sort discussions
  useEffect(() => {
    let result = [...discussions];
    
    // Apply tag filtering
    if (activeTag) {
      result = result.filter(discussion => 
        discussion.tags && discussion.tags.includes(activeTag)
      );
    }
    
    // Apply search filtering
    if (searchTerm) {
      result = result.filter(discussion => 
        discussion.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        discussion.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (discussion.tags && discussion.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
      );
    }
    
    // Apply sorting
    switch (sortOption) {
      case 'new':
        result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        break;
      case 'upvotes':
        result.sort((a, b) => b.upvotes - a.upvotes);
        break;
      case 'popular':
      default:
        // Sort by pinned first, then by a combination of comments, views and upvotes
        result.sort((a, b) => {
          if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
          const aPopularity = a.comments * 3 + a.views + a.upvotes * 2;
          const bPopularity = b.comments * 3 + b.views + b.upvotes * 2;
          return bPopularity - aPopularity;
        });
        break;
    }
    
    setFilteredDiscussions(result);
  }, [discussions, sortOption, activeTag, searchTerm]);
  
  // Handle discussion click
  const handleDiscussionClick = (discussion: DiscussionTopic) => {
    navigate(`/forum/${discussion.id}`);
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

  const handleSubmitDiscussion = async () => {
    if (!newDiscussion.title || !newDiscussion.content) {
      toast({
        title: "Required Fields Missing",
        description: "Please provide a title and content for your discussion",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const tagsArray = newDiscussion.tags 
        ? newDiscussion.tags.split(',').map(tag => tag.trim()).filter(Boolean) 
        : [];

      // Simulate adding a new post (until forum_posts table is created)
      const newPost: DiscussionTopic = {
        id: `new-${Date.now()}`,
        title: newDiscussion.title,
        content: newDiscussion.content,
        author: user?.name || user?.username || 'Anonymous',
        authorId: user?.id || '',
        authorAvatar: user?.avatar,
        createdAt: new Date(),
        tags: tagsArray,
        upvotes: 0,
        views: 1,
        comments: 0,
        isPinned: false,
        isPopular: false
      };

      // Add to local state (simulating database storage)
      setDiscussions(prevDiscussions => [newPost, ...prevDiscussions]);
      setIsCreateDialogOpen(false);
      setNewDiscussion({ title: '', content: '', tags: '' });

      toast({
        title: "Discussion Created",
        description: "Your new discussion has been posted successfully!",
      });
      
      // Navigate to the new post
      navigate(`/forum/${newPost.id}`);
    } catch (err) {
      console.error('Error creating discussion:', err);
      toast({
        title: "Error",
        description: "Failed to create discussion",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <MessageSquare size={28} />
          Forum
        </h1>
        <Button 
          className="flex items-center gap-2"
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
          <Badge className="flex items-center gap-1">
            {activeTag}
            <button
              className="ml-2 hover:text-foreground"
              onClick={() => setActiveTag(null)}
            >
              ×
            </button>
          </Badge>
        </div>
      )}
      
      <div className="grid grid-cols-1 gap-4">
        {isLoading ? (
          // Skeleton UI for loading state
          Array.from({ length: 5 }).map((_, index) => (
            <Card key={index} className="bg-card rounded-lg p-5">
              <div className="flex items-start gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-5/6 mb-3" />
                  <div className="flex gap-2 mb-3">
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <Skeleton className="h-6 w-24 rounded-full" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-5 w-32" />
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
                <div className="rounded-full bg-muted p-4">
                  <MessageSquare size={32} className="text-muted-foreground" />
                </div>
              </div>
              <p className="text-muted-foreground mb-4">No discussions found matching your criteria.</p>
              <Button 
                className="mt-4"
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
