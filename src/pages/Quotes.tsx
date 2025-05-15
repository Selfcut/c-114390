
import React, { useState } from "react";
import { PageLayout } from "../components/layouts/PageLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Quote, Search, Filter, Heart, Share, Bookmark, Plus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserHoverCard } from "../components/UserHoverCard";
import { ScrollArea } from "@/components/ui/scroll-area";

interface QuoteData {
  id: string;
  text: string;
  author: {
    name: string;
    avatar?: string;
  };
  source?: string;
  tags: string[];
  likes: number;
  isLiked: boolean;
  isBookmarked: boolean;
  submittedBy?: {
    name: string;
    username: string;
    avatar?: string;
    status: "online" | "offline" | "away" | "do_not_disturb";
  };
}

const Quotes = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTag, setFilterTag] = useState<string | null>(null);
  const [quotes, setQuotes] = useState<QuoteData[]>([
    {
      id: "1",
      text: "The cosmos is within us. We are made of star-stuff. We are a way for the universe to know itself.",
      author: {
        name: "Carl Sagan",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carl"
      },
      source: "Cosmos",
      tags: ["Science", "Astronomy", "Philosophy"],
      likes: 254,
      isLiked: true,
      isBookmarked: false,
    },
    {
      id: "2",
      text: "The unexamined life is not worth living.",
      author: {
        name: "Socrates"
      },
      tags: ["Philosophy", "Wisdom", "Ancient"],
      likes: 189,
      isLiked: false,
      isBookmarked: true,
      submittedBy: {
        name: "Alex Morgan",
        username: "alexmorgan",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
        status: "online"
      }
    },
    {
      id: "3",
      text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
      author: {
        name: "Aristotle"
      },
      tags: ["Philosophy", "Excellence", "Habit"],
      likes: 327,
      isLiked: false,
      isBookmarked: false,
    },
    {
      id: "4",
      text: "The most incomprehensible thing about the world is that it is comprehensible.",
      author: {
        name: "Albert Einstein",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Albert"
      },
      tags: ["Science", "Physics", "Philosophy"],
      likes: 218,
      isLiked: false,
      isBookmarked: true,
      submittedBy: {
        name: "Samantha Lee",
        username: "samlee",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Samantha",
        status: "away"
      }
    },
  ]);

  // Extract all unique tags
  const allTags = Array.from(
    new Set(quotes.flatMap(quote => quote.tags))
  );

  // Filter quotes based on search and tag filter
  const filteredQuotes = quotes.filter(quote => {
    const matchesSearch = searchQuery ? 
      quote.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quote.author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quote.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      : true;
      
    const matchesTag = filterTag ? 
      quote.tags.includes(filterTag)
      : true;
      
    return matchesSearch && matchesTag;
  });

  // Toggle like status for a quote
  const toggleLike = (id: string) => {
    setQuotes(prevQuotes => 
      prevQuotes.map(quote => 
        quote.id === id 
          ? { 
              ...quote, 
              isLiked: !quote.isLiked,
              likes: quote.isLiked ? quote.likes - 1 : quote.likes + 1
            }
          : quote
      )
    );
  };

  // Toggle bookmark status for a quote
  const toggleBookmark = (id: string) => {
    setQuotes(prevQuotes => 
      prevQuotes.map(quote => 
        quote.id === id 
          ? { ...quote, isBookmarked: !quote.isBookmarked }
          : quote
      )
    );
  };

  return (
    <PageLayout>
      <main className="py-8 px-6 md:px-12">
        <div className="flex justify-between items-center mb-8 stagger-fade animate-in">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Quote size={28} className="text-primary" />
            Wisdom Quotes
          </h1>
          <Button className="flex items-center gap-2 bg-primary hover:bg-primary/90">
            <Plus size={18} />
            <span>Submit Quote</span>
          </Button>
        </div>

        {/* Search and filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              placeholder="Search quotes..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            {filterTag && (
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 flex items-center gap-1">
                {filterTag}
                <button onClick={() => setFilterTag(null)} className="ml-1 hover:text-white">
                  ×
                </button>
              </Badge>
            )}
          </div>
        </div>

        {/* Tags scroller */}
        <div className="mb-6">
          <h2 className="text-sm font-medium mb-2 flex items-center">
            <Filter size={14} className="mr-2" />
            Filter by Tag
          </h2>
          <ScrollArea className="whitespace-nowrap pb-4">
            <div className="flex gap-2">
              {allTags.map(tag => (
                <Button
                  key={tag}
                  variant={filterTag === tag ? "default" : "outline"} 
                  size="sm"
                  className="h-8"
                  onClick={() => setFilterTag(filterTag === tag ? null : tag)}
                >
                  {tag}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Quotes grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-fade animate-in">
          {filteredQuotes.length > 0 ? (
            filteredQuotes.map(quote => (
              <Card key={quote.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-0">
                  <div className="p-6">
                    <Quote size={18} className="text-primary mb-2" />
                    <p className="text-lg mb-4">{quote.text}</p>
                    
                    <div className="flex items-center mb-4">
                      <Avatar className="h-8 w-8 mr-3">
                        <AvatarImage src={quote.author.avatar} alt={quote.author.name} />
                        <AvatarFallback>{quote.author.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{quote.author.name}</div>
                        {quote.source && (
                          <div className="text-xs text-muted-foreground">{quote.source}</div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {quote.tags.map(tag => (
                        <Badge 
                          key={tag} 
                          variant="outline"
                          className="hover:bg-muted cursor-pointer"
                          onClick={() => setFilterTag(tag)}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    {quote.submittedBy && (
                      <div className="text-xs text-muted-foreground mb-4 flex items-center">
                        <span className="mr-2">Submitted by</span>
                        <UserHoverCard
                          username={quote.submittedBy.username}
                          displayName={quote.submittedBy.name}
                          avatar={quote.submittedBy.avatar || ""}
                          status={quote.submittedBy.status}
                        >
                          <span className="font-medium cursor-pointer hover:text-foreground">
                            {quote.submittedBy.name}
                          </span>
                        </UserHoverCard>
                      </div>
                    )}
                  </div>
                  
                  <div className="border-t px-6 py-3 flex justify-between">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className={quote.isLiked ? "text-red-500" : ""}
                      onClick={() => toggleLike(quote.id)}
                    >
                      <Heart
                        size={18} 
                        className={`mr-1 ${quote.isLiked ? "fill-red-500" : ""}`}
                      />
                      {quote.likes}
                    </Button>
                    
                    <div className="flex gap-1">
                      <Button
                        variant="ghost" 
                        size="icon"
                        className={quote.isBookmarked ? "text-yellow-500" : ""}
                        onClick={() => toggleBookmark(quote.id)}
                      >
                        <Bookmark 
                          size={18}
                          className={quote.isBookmarked ? "fill-yellow-500" : ""}
                        />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Share size={18} />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-1 md:col-span-2 lg:col-span-3">
              <div className="bg-muted/30 rounded-lg p-8 text-center">
                <Quote size={48} className="text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">No quotes found matching your criteria.</p>
                <Button onClick={() => { setSearchQuery(""); setFilterTag(null); }}>
                  Clear Filters
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </PageLayout>
  );
};

export default Quotes;
