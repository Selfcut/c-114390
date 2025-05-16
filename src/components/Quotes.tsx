import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Quote, Search, Filter, Heart, Share, Bookmark, Plus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserHoverCard } from "../components/UserHoverCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  fetchQuotes, 
  fetchQuotesWithFilters, 
  likeQuote, 
  bookmarkQuote, 
  checkUserLikedQuote, 
  checkUserBookmarkedQuote,
  QuoteWithUser
} from "@/lib/quotes-service";
import { QuoteSubmissionModal } from "@/components/QuoteSubmissionModal";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

interface QuoteCardProps {
  quote: QuoteWithUser;
  isLiked: boolean;
  isBookmarked: boolean;
  onLike: () => void;
  onBookmark: () => void;
  onTagClick: (tag: string) => void;
}

const QuoteCard: React.FC<QuoteCardProps> = ({ 
  quote, 
  isLiked, 
  isBookmarked, 
  onLike, 
  onBookmark,
  onTagClick 
}) => {
  return (
    <Card key={quote.id} className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        <div className="p-6">
          <Quote size={18} className="text-primary mb-2" />
          <p className="text-lg mb-4">{quote.text}</p>
          
          <div className="flex items-center mb-4">
            <Avatar className="h-8 w-8 mr-3">
              <AvatarImage src={quote.user?.avatar_url} alt={quote.user?.name} />
              <AvatarFallback>{quote.author.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{quote.author}</div>
              {quote.source && (
                <div className="text-xs text-muted-foreground">{quote.source}</div>
              )}
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {quote.tags && quote.tags.map(tag => (
              <Badge 
                key={tag} 
                variant="outline"
                className="hover:bg-muted cursor-pointer"
                onClick={() => onTagClick(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
          
          {quote.user && (
            <div className="text-xs text-muted-foreground mb-4 flex items-center">
              <span className="mr-2">Submitted by</span>
              <UserHoverCard
                username={quote.user.username}
                displayName={quote.user.name}
                avatar={quote.user.avatar_url || ""}
                isOnline={quote.user.status === "online"}
              >
                <span className="font-medium cursor-pointer hover:text-foreground">
                  {quote.user.name}
                </span>
              </UserHoverCard>
            </div>
          )}
        </div>
        
        <div className="border-t px-6 py-3 flex justify-between">
          <Button 
            variant="ghost" 
            size="sm"
            className={isLiked ? "text-red-500" : ""}
            onClick={onLike}
          >
            <Heart
              size={18} 
              className={`mr-1 ${isLiked ? "fill-red-500" : ""}`}
            />
            {quote.likes}
          </Button>
          
          <div className="flex gap-1">
            <Button
              variant="ghost" 
              size="sm"
              className={isBookmarked ? "text-yellow-500" : ""}
              onClick={onBookmark}
            >
              <Bookmark 
                size={18}
                className={isBookmarked ? "fill-yellow-500" : ""}
              />
            </Button>
            <Button variant="ghost" size="sm">
              <Share size={18} />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const Quotes = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTag, setFilterTag] = useState<string | null>(null);
  const [quotes, setQuotes] = useState<QuoteWithUser[]>([]);
  const [filteredQuotes, setFilteredQuotes] = useState<QuoteWithUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userLikes, setUserLikes] = useState<Record<string, boolean>>({});
  const [userBookmarks, setUserBookmarks] = useState<Record<string, boolean>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  // Extract all unique tags
  const allTags = Array.from(
    new Set(quotes.flatMap(quote => quote.tags || []))
  );

  // Fetch quotes on component mount
  useEffect(() => {
    const loadQuotes = async () => {
      setIsLoading(true);
      try {
        const data = await fetchQuotes();
        setQuotes(data);
        setFilteredQuotes(data);
        
        // Check user likes and bookmarks
        const likesObj: Record<string, boolean> = {};
        const bookmarksObj: Record<string, boolean> = {};
        
        if (isAuthenticated) {
          await Promise.all(data.map(async (quote) => {
            likesObj[quote.id] = await checkUserLikedQuote(quote.id);
            bookmarksObj[quote.id] = await checkUserBookmarkedQuote(quote.id);
          }));
        }
        
        setUserLikes(likesObj);
        setUserBookmarks(bookmarksObj);
      } catch (error) {
        console.error("Error loading quotes:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadQuotes();
  }, [isAuthenticated]);
  
  // Filter quotes based on search and tag filter
  useEffect(() => {
    if (searchQuery || filterTag) {
      const filtered = quotes.filter(quote => {
        const matchesSearch = searchQuery ? 
          quote.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
          quote.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (quote.tags && quote.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
          : true;
            
        const matchesTag = filterTag ? 
          quote.tags && quote.tags.includes(filterTag)
          : true;
            
        return matchesSearch && matchesTag;
      });
      setFilteredQuotes(filtered);
    } else {
      setFilteredQuotes(quotes);
    }
  }, [searchQuery, filterTag, quotes]);

  // Handle like button click
  const handleLike = async (quoteId: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to like quotes",
        variant: "destructive"
      });
      return;
    }
    
    const result = await likeQuote(quoteId);
    
    // Update local state
    setUserLikes(prev => ({
      ...prev,
      [quoteId]: result
    }));
    
    // Update quote likes count in UI
    setQuotes(prevQuotes => 
      prevQuotes.map(quote => 
        quote.id === quoteId 
          ? { 
              ...quote, 
              likes: result ? quote.likes + 1 : quote.likes - 1
            }
          : quote
      )
    );
  };

  // Handle bookmark button click
  const handleBookmark = async (quoteId: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to bookmark quotes",
        variant: "destructive"
      });
      return;
    }
    
    const result = await bookmarkQuote(quoteId);
    
    // Update local state
    setUserBookmarks(prev => ({
      ...prev,
      [quoteId]: result
    }));
    
    // Update quote bookmark count in UI
    setQuotes(prevQuotes => 
      prevQuotes.map(quote => 
        quote.id === quoteId 
          ? { 
              ...quote, 
              bookmarks: result ? quote.bookmarks + 1 : quote.bookmarks - 1
            }
          : quote
      )
    );
  };
  
  // Handle successful quote submission
  const handleQuoteSubmitted = async () => {
    // Refresh quotes list
    const refreshedQuotes = await fetchQuotes();
    setQuotes(refreshedQuotes);
    setFilteredQuotes(refreshedQuotes);
    setIsModalOpen(false);
  };

  return (
    <main className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8 stagger-fade animate-in">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Quote size={28} className="text-primary" />
          Wisdom Quotes
        </h1>
        <Button 
          className="flex items-center gap-2 bg-primary hover:bg-primary/90"
          onClick={() => {
            if (!isAuthenticated) {
              toast({
                title: "Authentication required",
                description: "Please log in to submit quotes",
                variant: "destructive"
              });
              return;
            }
            setIsModalOpen(true);
          }}
        >
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
        {isLoading ? (
          // Loading placeholders
          Array(6).fill(0).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="h-4 w-12 bg-muted rounded mb-4"></div>
                <div className="h-20 bg-muted rounded mb-4"></div>
                <div className="flex items-center mb-4">
                  <div className="h-8 w-8 bg-muted rounded-full mr-3"></div>
                  <div>
                    <div className="h-4 w-24 bg-muted rounded"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : filteredQuotes.length > 0 ? (
          filteredQuotes.map(quote => (
            <QuoteCard
              key={quote.id}
              quote={quote}
              isLiked={!!userLikes[quote.id]}
              isBookmarked={!!userBookmarks[quote.id]}
              onLike={() => handleLike(quote.id)}
              onBookmark={() => handleBookmark(quote.id)}
              onTagClick={(tag) => setFilterTag(tag)}
            />
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
      
      {/* Quote submission modal */}
      {isModalOpen && (
        <QuoteSubmissionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleQuoteSubmitted}
        />
      )}
    </main>
  );
};

export default Quotes;
