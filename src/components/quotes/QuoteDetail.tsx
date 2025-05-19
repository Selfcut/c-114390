
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Bookmark, Share, Edit, Trash2, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { fetchQuoteById, likeQuote, bookmarkQuote, checkUserLikedQuote, checkUserBookmarkedQuote } from '@/lib/quotes';
import { QuoteWithUser } from '@/lib/quotes/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { UserHoverCard } from '@/components/UserHoverCard';
import { useRealtimeQuotes } from '@/hooks/useRealtimeQuotes';

export const QuoteDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();

  const [quote, setQuote] = useState<QuoteWithUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [bookmarkCount, setBookmarkCount] = useState(0);

  // Fetch quote details
  useEffect(() => {
    const loadQuote = async () => {
      setIsLoading(true);
      if (!id) return;

      try {
        const quoteData = await fetchQuoteById(id);
        if (quoteData) {
          setQuote(quoteData);
          setLikeCount(quoteData.likes || 0);
          setBookmarkCount(quoteData.bookmarks || 0);

          // Check if user liked or bookmarked this quote
          if (isAuthenticated) {
            const [liked, bookmarked] = await Promise.all([
              checkUserLikedQuote(id),
              checkUserBookmarkedQuote(id)
            ]);
            setIsLiked(liked);
            setIsBookmarked(bookmarked);
          }
        }
      } catch (error) {
        console.error('Error loading quote:', error);
        toast({
          title: 'Error',
          description: 'Failed to load the quote',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadQuote();
  }, [id, isAuthenticated, toast]);

  // Subscribe to real-time updates
  const handleQuoteUpdate = (updatedQuote: QuoteWithUser) => {
    setQuote(prev => ({ ...prev, ...updatedQuote } as QuoteWithUser));
    setLikeCount(updatedQuote.likes || 0);
    setBookmarkCount(updatedQuote.bookmarks || 0);
  };

  const handleInteractionUpdate = (type: 'like' | 'bookmark', quoteId: string, isActive: boolean) => {
    if (id === quoteId) {
      if (type === 'like') {
        setIsLiked(isActive);
      } else if (type === 'bookmark') {
        setIsBookmarked(isActive);
      }
    }
  };

  useRealtimeQuotes({
    quoteId: id,
    onQuoteUpdate: handleQuoteUpdate,
    onInteractionUpdate: handleInteractionUpdate
  });

  // Handle like action
  const handleLike = async () => {
    if (!id || !isAuthenticated) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to like quotes',
        variant: 'destructive'
      });
      return;
    }

    try {
      const result = await likeQuote(id);
      setIsLiked(result);
      setLikeCount(prev => result ? prev + 1 : Math.max(prev - 1, 0));
    } catch (error) {
      console.error('Error liking quote:', error);
      toast({
        title: 'Error',
        description: 'Failed to like the quote',
        variant: 'destructive'
      });
    }
  };

  // Handle bookmark action
  const handleBookmark = async () => {
    if (!id || !isAuthenticated) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to bookmark quotes',
        variant: 'destructive'
      });
      return;
    }

    try {
      const result = await bookmarkQuote(id);
      setIsBookmarked(result);
      setBookmarkCount(prev => result ? prev + 1 : Math.max(prev - 1, 0));
    } catch (error) {
      console.error('Error bookmarking quote:', error);
      toast({
        title: 'Error',
        description: 'Failed to bookmark the quote',
        variant: 'destructive'
      });
    }
  };

  // Handle share action
  const handleShare = () => {
    if (!quote) return;
    
    const quoteText = `"${quote.text}" - ${quote.author}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Quote Share',
        text: quoteText,
        url: window.location.href
      }).catch(err => {
        console.error('Error sharing:', err);
        // Fallback to clipboard
        copyToClipboard();
      });
    } else {
      copyToClipboard();
    }
  };
  
  const copyToClipboard = () => {
    if (!quote) return;
    
    const textToCopy = `"${quote.text}" - ${quote.author}\n${window.location.href}`;
    navigator.clipboard.writeText(textToCopy);
    
    toast({
      title: 'Quote Copied',
      description: 'The quote has been copied to your clipboard'
    });
  };

  // Check if the current user is the owner of the quote
  const isOwner = quote && user && quote.user_id === user.id;

  // Handle back navigation
  const goBack = () => {
    navigate('/quotes');
  };

  if (isLoading) {
    return (
      <div className="container max-w-3xl mx-auto py-8 px-4">
        <div className="mb-6">
          <Button variant="ghost" size="sm" onClick={goBack} className="flex items-center gap-1">
            <ArrowLeft size={16} />
            Back to Quotes
          </Button>
        </div>
        
        <Card>
          <CardContent className="p-6 space-y-4">
            <Skeleton className="h-8 w-3/4 mb-2" />
            <Skeleton className="h-20 w-full" />
            <div className="flex items-center space-x-2">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div>
                <Skeleton className="h-4 w-40 mb-2" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          </CardContent>
          <CardFooter className="border-t p-4 flex justify-between">
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-28" />
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="container max-w-3xl mx-auto py-8 px-4">
        <div className="mb-6">
          <Button variant="ghost" size="sm" onClick={goBack} className="flex items-center gap-1">
            <ArrowLeft size={16} />
            Back to Quotes
          </Button>
        </div>
        
        <Card className="border-destructive">
          <CardContent className="p-6 flex flex-col items-center justify-center py-12 text-center">
            <AlertTriangle size={48} className="text-destructive mb-4" />
            <h2 className="text-2xl font-bold mb-2">Quote Not Found</h2>
            <p className="text-muted-foreground mb-6">The quote you're looking for doesn't exist or has been removed.</p>
            <Button onClick={goBack}>Return to Quotes</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-3xl mx-auto py-8 px-4 animate-fade-in">
      <div className="mb-6">
        <Button variant="ghost" size="sm" onClick={goBack} className="flex items-center gap-1">
          <ArrowLeft size={16} />
          Back to Quotes
        </Button>
      </div>
      
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          {/* Quote text */}
          <div className="relative mb-8 pt-6">
            <span className="absolute top-0 left-0 text-5xl text-primary/20 font-serif">"</span>
            <p className="text-2xl font-serif italic leading-relaxed">{quote.text}</p>
            <span className="absolute bottom-0 right-0 text-5xl text-primary/20 font-serif">"</span>
          </div>
          
          {/* Author info */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div>
                <h3 className="text-xl font-medium">{quote.author}</h3>
                {quote.source && <p className="text-sm text-muted-foreground">{quote.source}</p>}
              </div>
            </div>
            <Badge variant="outline" className="bg-primary/10 text-primary">
              {quote.category || 'Other'}
            </Badge>
          </div>
          
          {/* Tags */}
          {quote.tags && quote.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {quote.tags.map((tag, index) => (
                <Badge key={index} variant="secondary">
                  #{tag}
                </Badge>
              ))}
            </div>
          )}
          
          {/* User info */}
          {quote.user && (
            <div className="flex items-center border-t pt-4 mt-6">
              <Avatar className="h-10 w-10 mr-3">
                <AvatarImage src={quote.user.avatar_url || undefined} alt={quote.user.name} />
                <AvatarFallback>{quote.user.name?.charAt(0) || '?'}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">
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
                <div className="text-xs text-muted-foreground">
                  {new Date(quote.created_at).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="border-t p-4 flex justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className={isLiked ? 'text-red-500' : ''}
              onClick={handleLike}
            >
              <Heart size={16} className={`mr-1 ${isLiked ? 'fill-red-500' : ''}`} />
              {likeCount} {likeCount === 1 ? 'Like' : 'Likes'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={isBookmarked ? 'text-yellow-500' : ''}
              onClick={handleBookmark}
            >
              <Bookmark size={16} className={`mr-1 ${isBookmarked ? 'fill-yellow-500' : ''}`} />
              {bookmarkCount} {bookmarkCount === 1 ? 'Save' : 'Saves'}
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            {isOwner && (
              <>
                <Button variant="outline" size="sm">
                  <Edit size={16} className="mr-1" /> Edit
                </Button>
                <Button variant="outline" size="sm" className="text-destructive">
                  <Trash2 size={16} className="mr-1" /> Delete
                </Button>
              </>
            )}
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share size={16} className="mr-1" /> Share
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};
