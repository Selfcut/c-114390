
// Create a new file with fixed status values
import React, { useState } from 'react';
import { PageLayout } from "./layouts/PageLayout";
import { QuoteCard } from "./QuoteCard";
import { QuoteSubmissionModal } from "./QuoteSubmissionModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, Search, Filter, SlidersHorizontal, Heart, BookMarked, Bookmark, MessageSquare, Share2 } from "lucide-react";

// Define status type for consistency
type UserStatus = "online" | "offline" | "away" | "do-not-disturb" | "invisible";

// Mock quotes data
const quotesData = [
  {
    id: "1",
    text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
    author: "Aristotle",
    source: "Nicomachean Ethics",
    tags: ["philosophy", "excellence", "habit"],
    user: {
      id: "user1",
      name: "PhilosophyLover",
      avatar: "https://api.dicebear.com/7.x/personas/svg?seed=PhilosophyLover",
      status: "online" as UserStatus
    },
    likes: 248,
    bookmarks: 57,
    comments: 12,
    createdAt: new Date(2025, 4, 10),
  },
  {
    id: "2",
    text: "The unexamined life is not worth living.",
    author: "Socrates",
    source: "Apology by Plato",
    tags: ["philosophy", "wisdom", "reflection"],
    user: {
      id: "user2",
      name: "WisdomSeeker",
      avatar: "https://api.dicebear.com/7.x/personas/svg?seed=WisdomSeeker",
      status: "away" as UserStatus
    },
    likes: 189,
    bookmarks: 43,
    comments: 8,
    createdAt: new Date(2025, 4, 12),
  },
  {
    id: "3",
    text: "The only true wisdom is in knowing you know nothing.",
    author: "Socrates",
    source: "As quoted in Diogenes Laërtius",
    tags: ["philosophy", "wisdom", "knowledge"],
    user: {
      id: "user3",
      name: "KnowledgeExplorer",
      avatar: "https://api.dicebear.com/7.x/personas/svg?seed=KnowledgeExplorer",
      status: "do-not-disturb" as UserStatus
    },
    likes: 145,
    bookmarks: 32,
    comments: 6,
    createdAt: new Date(2025, 4, 14),
  },
  {
    id: "4",
    text: "Knowing yourself is the beginning of all wisdom.",
    author: "Aristotle",
    source: "Metaphysics",
    tags: ["philosophy", "self-knowledge", "wisdom"],
    user: {
      id: "user4",
      name: "AristotleFan",
      avatar: "https://api.dicebear.com/7.x/personas/svg?seed=AristotleFan",
      status: "offline" as UserStatus
    },
    likes: 132,
    bookmarks: 28,
    comments: 5,
    createdAt: new Date(2025, 4, 15),
  },
  {
    id: "5",
    text: "The energy of the mind is the essence of life.",
    author: "Aristotle",
    source: "De Anima",
    tags: ["philosophy", "mind", "energy", "life"],
    user: {
      id: "user5",
      name: "PhilosophicalMind",
      avatar: "https://api.dicebear.com/7.x/personas/svg?seed=PhilosophicalMind",
      status: "offline" as UserStatus
    },
    likes: 97,
    bookmarks: 18,
    comments: 3,
    createdAt: new Date(2025, 4, 13),
  },
];

const popularTags = [
  { id: "1", name: "philosophy", count: 524 },
  { id: "2", name: "wisdom", count: 328 },
  { id: "3", name: "knowledge", count: 287 },
  { id: "4", name: "science", count: 245 },
  { id: "5", name: "reflection", count: 193 },
  { id: "6", name: "excellence", count: 184 },
  { id: "7", name: "metaphysics", count: 142 },
  { id: "8", name: "ethics", count: 136 },
  { id: "9", name: "existence", count: 128 },
  { id: "10", name: "consciousness", count: 112 },
];

// Define contributors with consistent status type
const topContributors = [
  {
    id: "user1",
    name: "PhilosophyLover",
    avatar: "https://api.dicebear.com/7.x/personas/svg?seed=PhilosophyLover",
    quotesCount: 37,
    status: "online" as UserStatus
  },
  {
    id: "user2",
    name: "WisdomSeeker",
    avatar: "https://api.dicebear.com/7.x/personas/svg?seed=WisdomSeeker",
    quotesCount: 28,
    status: "away" as UserStatus
  },
  {
    id: "user3",
    name: "KnowledgeExplorer",
    avatar: "https://api.dicebear.com/7.x/personas/svg?seed=KnowledgeExplorer",
    quotesCount: 24,
    status: "invisible" as UserStatus
  },
  {
    id: "user4",
    name: "AristotleFan",
    avatar: "https://api.dicebear.com/7.x/personas/svg?seed=AristotleFan",
    quotesCount: 21,
    status: "offline" as UserStatus
  },
  {
    id: "user5",
    name: "PhilosophicalMind",
    avatar: "https://api.dicebear.com/7.x/personas/svg?seed=PhilosophicalMind",
    quotesCount: 18,
    status: "offline" as UserStatus
  },
];

export const Quotes = () => {
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const handleFilterChange = (value: string) => {
    setFilterType(value);
  };
  
  const filteredQuotes = quotesData.filter(quote => {
    // Search filtering
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      return (
        quote.text.toLowerCase().includes(searchLower) ||
        quote.author.toLowerCase().includes(searchLower) ||
        quote.source.toLowerCase().includes(searchLower) ||
        quote.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
        quote.user.name.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });
  
  return (
    <PageLayout>
      <div className="container py-6 max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Wisdom Quotes</h1>
            <p className="text-muted-foreground mt-1">
              Discover and share timeless wisdom from great thinkers
            </p>
          </div>
          
          <Button 
            onClick={() => setIsSubmitModalOpen(true)}
            className="md:self-end"
          >
            <Plus className="mr-2 h-4 w-4" />
            Submit Quote
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {/* Search and Filter Section */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search quotes..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </div>
              
              <div className="flex gap-2">
                <Select value={filterType} onValueChange={handleFilterChange}>
                  <SelectTrigger className="w-[140px]">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Quotes</SelectItem>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="recent">Most Recent</SelectItem>
                    <SelectItem value="bookmarked">Bookmarked</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button variant="outline" size="icon">
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Quotes Tabs */}
            <Tabs defaultValue="featured" className="mb-8">
              <TabsList>
                <TabsTrigger value="featured">Featured</TabsTrigger>
                <TabsTrigger value="trending">Trending</TabsTrigger>
                <TabsTrigger value="newest">Newest</TabsTrigger>
                <TabsTrigger value="classical">Classical</TabsTrigger>
              </TabsList>
            </Tabs>
            
            {/* Quotes List */}
            <div className="space-y-6">
              {filteredQuotes.length > 0 ? (
                filteredQuotes.map(quote => (
                  <QuoteCard
                    key={quote.id}
                    id={quote.id}
                    text={quote.text}
                    author={quote.author}
                    source={quote.source}
                    category={quote.tags[0] || ""} // Use first tag as category
                    tags={quote.tags}
                    likes={quote.likes}
                    comments={quote.comments}
                    user={quote.user}
                    isBookmarked={false}
                    onLike={() => {}}
                    onBookmark={() => {}}
                    onComment={() => {}}
                    onShare={() => {}}
                  />
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No quotes found matching your search.</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Top Contributors */}
            <div className="mb-8 bg-card p-4 rounded-lg border">
              <h3 className="font-semibold mb-4">Top Contributors</h3>
              <div className="space-y-3">
                {topContributors.map(contributor => (
                  <div key={contributor.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={contributor.avatar} alt={contributor.name} />
                          <AvatarFallback>{contributor.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <span 
                          className={`absolute bottom-0 right-0 w-2 h-2 rounded-full ${
                            contributor.status === 'online' ? 'bg-green-500' : 
                            contributor.status === 'away' ? 'bg-amber-500' :
                            contributor.status === 'do-not-disturb' ? 'bg-red-500' :
                            'bg-gray-400' // Default for offline or invisible
                          } ring-1 ring-white`}
                        />
                      </div>
                      <span className="text-sm">{contributor.name}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{contributor.quotesCount} quotes</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Popular Tags */}
            <div className="bg-card p-4 rounded-lg border">
              <h3 className="font-semibold mb-4">Popular Tags</h3>
              <ScrollArea className="h-64">
                <div className="space-y-2">
                  {popularTags.map(tag => (
                    <div key={tag.id} className="flex items-center justify-between">
                      <span className="text-sm">#{tag.name}</span>
                      <span className="text-xs text-muted-foreground">{tag.count}</span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
      </div>
      
      {/* Quote Submission Modal */}
      <QuoteSubmissionModal 
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
      />
    </PageLayout>
  );
};

export default Quotes;
