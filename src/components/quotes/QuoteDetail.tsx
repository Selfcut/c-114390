
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ChevronLeft, 
  Heart, 
  MessageSquare, 
  Share2, 
  Bookmark, 
  BookmarkCheck,
  Calendar,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/lib/auth";
import { 
  fetchQuoteById, 
  likeQuote, 
  bookmarkQuote, 
  checkUserLikedQuote, 
  checkUserBookmarkedQuote,
  QuoteWithUser
} from "@/lib/quotes";
import { QuoteCommentModal } from "@/components/QuoteCommentModal";
import { formatDistance } from "date-fns";

export const QuoteDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [quote, setQuote] = useState<QuoteWithUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [bookmarkCount, setBookmarkCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    
    const fetchQuote = async () => {
      try {
        setIsLoading(true);
        const quoteData = await fetchQuoteById(id);
        
        if (quoteData) {
          setQuote(quoteData);
          setLikeCount(quoteData.likes || 0);
          setBookmarkCount(quoteData.bookmarks || 0);
          setCommentCount(quoteData.comments || 0);
          
          if (isAuthenticated) {
            const liked = await checkUserLikedQuote(id);
            const bookmarked = await checkUserBookmarkedQuote(id);
            setIsLiked(liked);
            setIsBookmarked(bookmarked);
          }
        }
      } catch (error) {
        console.error("Error fetching quote:", error);
        toast({
          title: "Failed to load quote",
          description: "Could not load the quote details.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchQuote();
  }, [id, isAuthenticated]);

  const handleLike = async () => {
    if (!isAuthenticated || !id) {
      toast({
        title: "Authentication required",
        description: "Please log in to like quotes",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const result = await likeQuote(id);
      setIsLiked(result);
      setLikeCount(prev => result ? prev + 1 : prev - 1);
    } catch (error) {
      console.error("Error liking quote:", error);
      toast({
        title: "Action failed",
        description: "Could not process like action",
        variant: "destructive"
      });
    }
  };

  const handleBookmark = async () => {
    if (!isAuthenticated || !id) {
      toast({
        title: "Authentication required",
        description: "Please log in to bookmark quotes",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const result = await bookmarkQuote(id);
      setIsBookmarked(result);
      setBookmarkCount(prev => result ? prev + 1 : prev - 1);
    } catch (error) {
      console.error("Error bookmarking quote:", error);
      toast({
        title: "Action failed",
        description: "Could not process bookmark action",
        variant: "destructive"
      });
    }
  };
  
  const handleShare = () => {
    if (!quote) return;
    
    navigator.clipboard.writeText(`"${quote.text}" - ${quote.author}`);
    toast({
      title: "Quote copied to clipboard",
      description: "You can now share it anywhere"
    });
  };
  
  const handleCommentAdded = () => {
    setCommentCount(prev => prev + 1);
  };
  
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatDistance(date, new Date(), { addSuffix: true });
    } catch (error) {
      return "Unknown date";
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-3xl py-8 px-4">
        <div className="flex items-center gap-2 mb-8">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>
        
        <Card className="p-6">
          <Skeleton className="h-8 w-3/4 mb-4" />
          <Skeleton className="h-4 w-1/4 mb-8" />
          <Skeleton className="h-24 w-full mb-6" />
          <div className="flex gap-2 mb-4">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-16" />
          </div>
          <Skeleton className="h-12 w-full" />
        </Card>
      </div>
    );
  }
  
  if (!quote) {
    return (
      <div className="container mx-auto max-w-3xl py-8 px-4">
        <div className="flex items-center gap-2 mb-8">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>
        
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Quote Not Found</h2>
          <p className="text-muted-foreground mb-6">The quote you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/quotes')}>Go Back to Quotes</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-3xl py-8 px-4">
      <div className="flex items-center gap-2 mb-8">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Quotes
        </Button>
      </div>
      
      <Card className="overflow-hidden">
        <div className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <Badge variant="outline" className="px-3 py-1 bg-primary/10 text-primary">
              {quote.category}
            </Badge>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(quote.created_at)}</span>
            </div>
          </div>
          
          <div className="mb-8">
            <p className="text-2xl font-serif italic relative leading-relaxed">
              <span className="absolute -left-4 -top-2 text-5xl text-primary/30">"</span>
              {quote.text}
              <span className="absolute text-5xl text-primary/30">"</span>
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-10 pt-6 border-t">
            <div>
              <h3 className="text-lg font-semibold">{quote.author}</h3>
              {quote.source && <p className="text-sm text-muted-foreground">{quote.source}</p>}
            </div>
            
            {quote.user && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Shared by:</span>
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={quote.user.avatar_url || undefined} />
                    <AvatarFallback>{quote.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{quote.user.name}</span>
                </div>
              </div>
            )}
          </div>
          
          {quote.tags && quote.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6">
              {quote.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  #{tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
        
        <div className="bg-muted/30 p-4 border-t flex flex-wrap gap-4 justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className={`flex items-center gap-1 ${
                isLiked ? "text-red-500" : "text-muted-foreground hover:text-red-500"
              }`}
              onClick={handleLike}
            >
              <Heart size={18} className={isLiked ? "fill-current" : ""} />
              <span>{likeCount}</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
              onClick={() => setIsCommentModalOpen(true)}
            >
              <MessageSquare size={18} />
              <span>{commentCount}</span>
            </Button>
          </div>
          
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className={`flex items-center gap-1 ${
                isBookmarked ? "text-primary" : "text-muted-foreground hover:text-primary"
              }`}
              onClick={handleBookmark}
            >
              {isBookmarked ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
              <span>{bookmarkCount}</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
              onClick={handleShare}
            >
              <Share2 size={18} />
              <span>Share</span>
            </Button>
          </div>
        </div>
      </Card>
      
      {isCommentModalOpen && id && (
        <QuoteCommentModal
          quoteId={id}
          isOpen={isCommentModalOpen}
          onClose={() => setIsCommentModalOpen(false)}
          onCommentAdded={handleCommentAdded}
        />
      )}
    </div>
  );
};
