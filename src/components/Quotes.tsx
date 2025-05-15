
import React, { useState, useEffect } from 'react';
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
import { 
  fetchQuotes, 
  fetchQuotesWithFilters, 
  QuoteWithUser, 
  fetchUserBookmarkedQuotes,
  createQuote 
} from "@/lib/quotes-service";
import { useAuth } from "@/lib/auth-context";
import { Button } from "./ui/button";
import { QuoteSubmissionModal } from "./QuoteSubmissionModal";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "./ui/skeleton";

const Quotes = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<'popular' | 'new' | 'comments'>('popular');
  const [quotes, setQuotes] = useState<QuoteWithUser[]>([]);
  const [bookmarkedQuotes, setBookmarkedQuotes] = useState<QuoteWithUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isBookmarksLoading, setIsBookmarksLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [popularTags, setPopularTags] = useState<{id: string, name: string, count: number}[]>([]);
  const [topContributors, setTopContributors] = useState<{id: string, name: string, avatar: string, quotesCount: number, status: UserStatus}[]>([]);
  
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  // Load quotes based on filters
  useEffect(() => {
    const loadQuotes = async () => {
      setIsLoading(true);
      try {
        const data = await fetchQuotesWithFilters(searchTerm, tagFilter, sortOption);
        setQuotes(data);
        
        // Extract popular tags from fetched quotes
        const tagsMap = new Map();
        data.forEach(quote => {
          if (quote.tags && Array.isArray(quote.tags)) {
            quote.tags.forEach(tag => {
              tagsMap.set(tag, (tagsMap.get(tag) || 0) + 1);
            });
          }
        });
        
        const extractedTags = Array.from(tagsMap.entries())
          .map(([name, count]) => ({ 
            id: name, 
            name, 
            count: count as number 
          }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10);
          
        setPopularTags(extractedTags);
        
        // Extract top contributors
        const contributorsMap = new Map();
        data.forEach(quote => {
          if (quote.user) {
            const userId = quote.user_id;
            contributorsMap.set(userId, {
              id: userId,
              name: quote.user.name || quote.user.username,
              avatar: quote.user.avatar_url || `https://api.dicebear.com/7.x/personas/svg?seed=${quote.user.username}`,
              quotesCount: (contributorsMap.get(userId)?.quotesCount || 0) + 1,
              status: quote.user.status as UserStatus || 'offline'
            });
          }
        });
        
        const extractedContributors = Array.from(contributorsMap.values())
          .sort((a: any, b: any) => b.quotesCount - a.quotesCount)
          .slice(0, 5);
          
        setTopContributors(extractedContributors);
      } catch (error) {
        console.error("Error loading quotes:", error);
        toast({
          title: "Error loading quotes",
          description: "Please try again later",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadQuotes();
  }, [searchTerm, tagFilter, sortOption, toast]);
  
  // Load bookmarked quotes for authenticated users
  useEffect(() => {
    const loadBookmarkedQuotes = async () => {
      if (!isAuthenticated) {
        setIsBookmarksLoading(false);
        return;
      }
      
      try {
        setIsBookmarksLoading(true);
        const data = await fetchUserBookmarkedQuotes();
        setBookmarkedQuotes(data);
      } catch (error) {
        console.error("Error loading bookmarked quotes:", error);
      } finally {
        setIsBookmarksLoading(false);
      }
    };
    
    loadBookmarkedQuotes();
  }, [isAuthenticated]);
  
  // Handle quote interactions
  const handleLikeQuote = (id: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to like quotes",
        variant: "destructive"
      });
      return;
    }
  };
  
  const handleCommentQuote = (id: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to comment on quotes",
        variant: "destructive"
      });
      return;
    }
  };
  
  const handleBookmarkQuote = (id: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to bookmark quotes",
        variant: "destructive"
      });
      return;
    }
  };
  
  const handleShareQuote = (quote: QuoteWithUser) => {
    navigator.clipboard.writeText(`"${quote.text}" - ${quote.author}`);
    toast({
      title: "Quote copied to clipboard",
      description: "You can now share it anywhere",
    });
  };
  
  const handleQuoteSubmit = async () => {
    setIsModalOpen(false);
    // Refresh quotes list after submission
    const refreshedQuotes = await fetchQuotesWithFilters(searchTerm, tagFilter, sortOption);
    setQuotes(refreshedQuotes);
    
    toast({
      title: "Quote submitted successfully",
      description: "Your quote is now visible to everyone",
    });
  };
  
  // Get status indicator color based on user status
  const getStatusIndicator = (status: UserStatus) => {
    switch(status) {
      case "online":
        return "bg-green-500";
      case "away":
        return "bg-yellow-500";
      case "do-not-disturb":
        return "bg-red-500";
      case "invisible":
      case "offline":
      default:
        return "bg-gray-500";
    }
  };

  // Configure tabs for the page
  const tabs = [
    {
      id: "popular",
      label: "Popular",
      icon: <Heart size={16} />,
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array(6).fill(0).map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-5">
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3" />
                    <div className="flex justify-between mt-6">
                      <Skeleton className="h-4 w-1/4" />
                      <Skeleton className="h-4 w-1/4" />
                    </div>
                  </div>
                  <div className="bg-muted/30 p-3 flex items-center justify-between">
                    <div className="flex gap-2">
                      <Skeleton className="h-6 w-6 rounded-full" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                    <Skeleton className="h-4 w-16" />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : quotes.length > 0 ? (
            quotes.map((quote) => (
              <QuoteCard 
                key={quote.id}
                id={quote.id}
                text={quote.text}
                author={quote.author}
                source={quote.source || ""}
                category={quote.category}
                tags={quote.tags || []}
                likes={quote.likes}
                comments={quote.comments}
                bookmarks={quote.bookmarks}
                createdAt={new Date(quote.created_at)}
                user={{
                  name: quote.user?.name || "Unknown User",
                  avatar: quote.user?.avatar_url || `https://api.dicebear.com/7.x/personas/svg?seed=${quote.user?.username || "unknown"}`,
                  status: quote.user?.status as UserStatus || "offline"
                }}
                onLike={() => handleLikeQuote(quote.id)}
                onComment={() => handleCommentQuote(quote.id)}
                onBookmark={() => handleBookmarkQuote(quote.id)}
                onShare={() => handleShareQuote(quote)}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-20">
              <MessageSquare size={48} className="mx-auto text-muted-foreground opacity-20 mb-4" />
              <h2 className="text-2xl font-medium mb-2">No quotes found</h2>
              <p className="text-muted-foreground mb-6">Try adjusting your search or filters</p>
              <Button onClick={() => { setSearchTerm(""); setTagFilter(null); }}>
                Clear filters
              </Button>
            </div>
          )}
        </div>
      )
    },
    {
      id: "recent",
      label: "Recent",
      icon: <Plus size={16} />,
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array(6).fill(0).map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-5">
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3" />
                    <div className="flex justify-between mt-6">
                      <Skeleton className="h-4 w-1/4" />
                      <Skeleton className="h-4 w-1/4" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : quotes.length > 0 ? (
            [...quotes] // Create a copy to avoid mutating the original
              .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
              .map((quote) => (
                <QuoteCard 
                  key={quote.id}
                  id={quote.id}
                  text={quote.text}
                  author={quote.author}
                  source={quote.source || ""}
                  category={quote.category}
                  tags={quote.tags || []}
                  likes={quote.likes}
                  comments={quote.comments}
                  bookmarks={quote.bookmarks}
                  createdAt={new Date(quote.created_at)}
                  user={{
                    name: quote.user?.name || "Unknown User",
                    avatar: quote.user?.avatar_url || `https://api.dicebear.com/7.x/personas/svg?seed=${quote.user?.username || "unknown"}`,
                    status: quote.user?.status as UserStatus || "offline"
                  }}
                  onLike={() => handleLikeQuote(quote.id)}
                  onComment={() => handleCommentQuote(quote.id)}
                  onBookmark={() => handleBookmarkQuote(quote.id)}
                  onShare={() => handleShareQuote(quote)}
                />
              ))
          ) : (
            <div className="col-span-full text-center py-20">
              <MessageSquare size={48} className="mx-auto text-muted-foreground opacity-20 mb-4" />
              <h2 className="text-2xl font-medium mb-2">No quotes found</h2>
              <p className="text-muted-foreground mb-6">Try adjusting your search or filters</p>
              <Button onClick={() => { setSearchTerm(""); setTagFilter(null); }}>
                Clear filters
              </Button>
            </div>
          )}
        </div>
      )
    },
    {
      id: "bookmarked",
      label: "Bookmarked",
      icon: <BookMarked size={16} />,
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {!isAuthenticated ? (
            <div className="col-span-full text-center py-20">
              <BookMarked size={48} className="mx-auto text-muted-foreground opacity-20 mb-4" />
              <h2 className="text-2xl font-medium mb-2">Authentication required</h2>
              <p className="text-muted-foreground mb-6">Please log in to access your bookmarks</p>
              <Button variant="default" onClick={() => window.location.href = "/auth"}>
                Log in
              </Button>
            </div>
          ) : isBookmarksLoading ? (
            Array(3).fill(0).map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-5">
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : bookmarkedQuotes.length > 0 ? (
            bookmarkedQuotes.map((quote) => (
              <QuoteCard 
                key={quote.id}
                id={quote.id}
                text={quote.text}
                author={quote.author}
                source={quote.source || ""}
                category={quote.category}
                tags={quote.tags || []}
                likes={quote.likes}
                comments={quote.comments}
                bookmarks={quote.bookmarks}
                hasBookmarked={true}
                createdAt={new Date(quote.created_at)}
                user={{
                  name: quote.user?.name || "Unknown User",
                  avatar: quote.user?.avatar_url || `https://api.dicebear.com/7.x/personas/svg?seed=${quote.user?.username || "unknown"}`,
                  status: quote.user?.status as UserStatus || "offline"
                }}
                onLike={() => handleLikeQuote(quote.id)}
                onComment={() => handleCommentQuote(quote.id)}
                onBookmark={() => handleBookmarkQuote(quote.id)}
                onShare={() => handleShareQuote(quote)}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-20">
              <BookMarked size={48} className="mx-auto text-muted-foreground opacity-20 mb-4" />
              <h2 className="text-2xl font-medium mb-2">No bookmarked quotes</h2>
              <p className="text-muted-foreground mb-6">Save your favorite quotes to access them later</p>
              <Button variant="default" onClick={() => document.getElementById('popular-tab')?.click()}>
                Browse quotes
              </Button>
            </div>
          )}
        </div>
      )
    }
  ];

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
            <Button variant="outline" size="icon">
              <Filter size={20} />
            </Button>
            <Button 
              variant="default" 
              className="flex items-center gap-2" 
              onClick={() => setIsModalOpen(true)}
              disabled={!isAuthenticated}
            >
              <Plus size={16} />
              <span>Add Quote</span>
            </Button>
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
                  {popularTags.length > 0 ? (
                    popularTags.map(tag => (
                      <Button
                        key={tag.id}
                        variant="ghost"
                        size="sm"
                        className={`text-xs px-2 py-1 h-auto ${tagFilter === tag.name ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-muted/50 hover:bg-accent'}`}
                        onClick={() => setTagFilter(tagFilter === tag.name ? null : tag.name)}
                      >
                        #{tag.name} <span className="text-muted-foreground ml-1">{tag.count}</span>
                      </Button>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No tags available</p>
                  )}
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
                  {topContributors.length > 0 ? (
                    topContributors.map(contributor => (
                      <div key={contributor.id} className="flex items-center justify-between px-6 py-2 hover:bg-muted/30 cursor-pointer transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={contributor.avatar} />
                              <AvatarFallback>{contributor.name[0].toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <span className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-background ${getStatusIndicator(contributor.status)}`}></span>
                          </div>
                          <span className="text-sm font-medium">{contributor.name}</span>
                        </div>
                        <div className="text-xs bg-muted/50 text-muted-foreground px-2 py-1 rounded-md">
                          {contributor.quotesCount} quotes
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-6 py-4 text-center text-sm text-muted-foreground">
                      No contributors data available
                    </div>
                  )}
                </div>
              </CardContent>
              {topContributors.length > 5 && (
                <CardFooter className="pt-0">
                  <Button variant="ghost" className="w-full text-center text-sm text-muted-foreground">
                    Show more
                  </Button>
                </CardFooter>
              )}
            </Card>

            {/* Stats */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Quotes</span>
                  <span className="font-medium">{quotes.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Contributors</span>
                  <span className="font-medium">{topContributors.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Categories</span>
                  <span className="font-medium">{new Set(quotes.map(q => q.category)).size}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Last 30 Days</span>
                  <span className="font-medium">
                    {quotes.filter(q => {
                      const date = new Date(q.created_at);
                      const now = new Date();
                      const diff = now.getTime() - date.getTime();
                      return diff <= 30 * 24 * 60 * 60 * 1000;
                    }).length}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {isModalOpen && (
        <QuoteSubmissionModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleQuoteSubmit}
        />
      )}
    </PageLayout>
  );
};

export default Quotes;
