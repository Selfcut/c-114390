
import React, { useState } from 'react';
import { PageLayout } from "./layouts/PageLayout";
import { TabNav } from "./TabNav";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter 
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, Search, Filter, SlidersHorizontal, Heart, BookMarked, Bookmark, MessageSquare, Share2 } from "lucide-react";
import { QuoteCard } from "./QuoteCard";
import { UserStatus } from "@/types/user";

// Mock quotes data
const quotesData = [
  {
    id: "1",
    text: "The unexamined life is not worth living.",
    author: "Socrates",
    source: "Plato's Apology",
    category: "Philosophy",
    tags: ["wisdom", "reflection", "philosophy"],
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    user: {
      id: "user1",
      name: "PhilosophyLover",
      avatar: "https://api.dicebear.com/7.x/personas/svg?seed=PhilosophyLover",
      status: "online" as UserStatus
    },
    likes: 248,
    bookmarks: 57,
    comments: 42
  },
  {
    id: "2",
    text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
    author: "Aristotle",
    source: "Nicomachean Ethics",
    category: "Ethics",
    tags: ["excellence", "habits", "philosophy"],
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    user: {
      id: "user2",
      name: "WisdomSeeker",
      avatar: "https://api.dicebear.com/7.x/personas/svg?seed=WisdomSeeker",
      status: "away" as UserStatus
    },
    likes: 189,
    bookmarks: 43,
    comments: 31
  },
  {
    id: "3",
    text: "I think, therefore I am.",
    author: "René Descartes",
    source: "Discourse on the Method",
    category: "Philosophy",
    tags: ["existence", "consciousness", "philosophy"],
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    user: {
      id: "user3",
      name: "KnowledgeExplorer",
      avatar: "https://api.dicebear.com/7.x/personas/svg?seed=KnowledgeExplorer",
      status: "do-not-disturb" as UserStatus
    },
    likes: 145,
    bookmarks: 32,
    comments: 25
  },
  {
    id: "4",
    text: "One cannot step twice in the same river.",
    author: "Heraclitus",
    source: "Fragments",
    category: "Metaphysics",
    tags: ["change", "time", "philosophy"],
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    user: {
      id: "user4",
      name: "AristotleFan",
      avatar: "https://api.dicebear.com/7.x/personas/svg?seed=AristotleFan",
      status: "offline" as UserStatus
    },
    likes: 132,
    bookmarks: 28,
    comments: 19
  },
  {
    id: "5",
    text: "The only true wisdom is in knowing you know nothing.",
    author: "Socrates",
    source: "Plato's Apology",
    category: "Epistemology",
    tags: ["knowledge", "wisdom", "philosophy"],
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
    user: {
      id: "user5",
      name: "PhilosophicalMind",
      avatar: "https://api.dicebear.com/7.x/personas/svg?seed=PhilosophicalMind",
      status: "offline" as UserStatus
    },
    likes: 97,
    bookmarks: 18,
    comments: 14
  }
];

// Popular tags
const popularTags = [
  { id: "1", name: "philosophy", count: 487 },
  { id: "2", name: "wisdom", count: 365 },
  { id: "3", name: "knowledge", count: 298 },
  { id: "4", name: "ethics", count: 245 },
  { id: "5", name: "metaphysics", count: 197 },
  { id: "6", name: "epistemology", count: 175 },
  { id: "7", name: "existence", count: 156 },
  { id: "8", name: "logic", count: 143 },
  { id: "9", name: "reality", count: 128 },
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

// Configurable tabs for the page
const tabs = [
  {
    id: "popular",
    label: "Popular",
    icon: <Heart size={16} />,
    content: (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quotesData.map((quote) => (
          <QuoteCard 
            key={quote.id}
            id={quote.id}
            text={quote.text}
            author={quote.author}
            source={quote.source}
            category={quote.category}
            tags={quote.tags}
            likes={quote.likes}
            comments={quote.comments}
            bookmarks={quote.bookmarks}
            createdAt={quote.createdAt}
            user={quote.user}
            onLike={(id) => console.log(`Liked quote ${id}`)}
            onComment={(id) => console.log(`Comment on quote ${id}`)}
            onBookmark={(id) => console.log(`Bookmarked quote ${id}`)}
            onShare={() => console.log("Sharing quote")}
          />
        ))}
      </div>
    )
  },
  {
    id: "recent",
    label: "Recent",
    icon: <Plus size={16} />,
    content: (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quotesData
          .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
          .map((quote) => (
            <QuoteCard 
              key={quote.id}
              id={quote.id}
              text={quote.text}
              author={quote.author}
              source={quote.source}
              category={quote.category}
              tags={quote.tags}
              likes={quote.likes}
              comments={quote.comments}
              bookmarks={quote.bookmarks}
              createdAt={quote.createdAt}
              user={quote.user}
              onLike={(id) => console.log(`Liked quote ${id}`)}
              onComment={(id) => console.log(`Comment on quote ${id}`)}
              onBookmark={(id) => console.log(`Bookmarked quote ${id}`)}
              onShare={() => console.log("Sharing quote")}
            />
          ))}
      </div>
    )
  },
  {
    id: "bookmarked",
    label: "Bookmarked",
    icon: <BookMarked size={16} />,
    content: (
      <div className="text-center py-20">
        <BookMarked size={48} className="mx-auto text-muted-foreground opacity-20 mb-4" />
        <h2 className="text-2xl font-medium mb-2">No bookmarked quotes</h2>
        <p className="text-muted-foreground mb-6">Save your favorite quotes to access them later</p>
        <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90">
          Browse quotes
        </button>
      </div>
    )
  }
];

const Quotes = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Get status indicator color based on user status
  const getStatusIndicator = (status: UserStatus) => {
    switch(status) {
      case "online":
        return "bg-green-500";
      case "away":
        return "bg-yellow-500";
      case "do-not-disturb":
        return "bg-red-500";
      case "offline":
      case "invisible":
      default:
        return "bg-gray-500";
    }
  };

  return (
    <PageLayout>
      <div className="py-8 px-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Quotes</h1>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
              <input
                type="text"
                placeholder="Search quotes..."
                className="w-60 bg-muted/30 border border-input pl-10 pr-4 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="bg-muted/30 border border-input p-2 rounded-md hover:bg-accent transition-colors">
              <Filter size={20} />
            </button>
            <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md flex items-center gap-2 hover:bg-primary/90 transition-colors">
              <Plus size={16} />
              <span>Add Quote</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-3/4">
            <TabNav tabs={tabs} defaultTab="popular" className="mb-6" />
          </div>

          <div className="lg:w-1/4 space-y-6">
            {/* Popular Tags */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Popular Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {popularTags.map(tag => (
                    <button
                      key={tag.id}
                      className="bg-muted/50 text-xs px-2 py-1 rounded-md hover:bg-accent transition-colors"
                    >
                      #{tag.name} <span className="text-muted-foreground ml-1">{tag.count}</span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Contributors */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Top Contributors</CardTitle>
              </CardHeader>
              <CardContent className="px-0">
                <div className="space-y-1">
                  {topContributors.map(contributor => (
                    <div key={contributor.id} className="flex items-center justify-between px-6 py-2 hover:bg-muted/30 cursor-pointer transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={contributor.avatar} />
                            <AvatarFallback>{contributor.name[0]}</AvatarFallback>
                          </Avatar>
                          <span className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-background ${getStatusIndicator(contributor.status)}`}></span>
                        </div>
                        <span className="text-sm font-medium">{contributor.name}</span>
                      </div>
                      <div className="text-xs bg-muted/50 text-muted-foreground px-2 py-1 rounded-md">
                        {contributor.quotesCount} quotes
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <button className="w-full text-center text-sm text-muted-foreground hover:text-primary transition-colors">
                  Show more
                </button>
              </CardFooter>
            </Card>

            {/* Stats */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Quotes</span>
                  <span className="font-medium">3,458</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Contributors</span>
                  <span className="font-medium">782</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Categories</span>
                  <span className="font-medium">24</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">This Month</span>
                  <span className="font-medium">+187</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

export default Quotes;
