import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { HeartIcon, BookmarkIcon, Share2Icon, MessageCircleIcon } from 'lucide-react';
import { QuoteWithUser } from '@/lib/quotes/types';
import { ShareQuoteDialog } from './ShareQuoteDialog';
import { QuoteComments } from './QuoteComments';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/lib/auth';
import { EditQuoteModal } from './EditQuoteModal';
import { DeleteQuoteDialog } from './DeleteQuoteDialog';
import { useUserContentInteractions } from '@/hooks/useUserContentInteractions';
import { ContentItemType } from '@/components/library/content-items/ContentItemTypes';

export function QuoteDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [quote, setQuote] = useState<QuoteWithUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('quote');

  // Use the unified content interactions hook
  const {
    isLiked,
    isBookmarked,
    likeCount,
    bookmarkCount,
    toggleLike,
    toggleBookmark
  } = useUserContentInteractions({
    contentId: id || '',
    contentType: 'quote',
    initialLikeCount: quote?.likes || 0,
    initialBookmarkCount: quote?.bookmarks || 0
  });
  
  // Fetch quote details
  useEffect(() => {
    if (!id) return;
    
    const fetchQuote = async () => {
      setIsLoading(true);
      try {
        // Fetch quote with user data
        const { data, error } = await supabase
          .from('quotes')
          .select(`
            *,
            user:profiles(id, username, name, avatar_url, status)
          `)
          .eq('id', id)
          .single();
        
        if (error) {
          console.error('Error fetching quote:', error);
          toast({
            title: 'Error',
            description: 'Quote not found',
            variant: 'destructive',
          });
          navigate('/quotes');
          return;
        }
        
        // Format the quote data with proper null safety
        const userData = data?.user || null;
        const userObj = userData && typeof userData === 'object'
          ? {
              id: (userData as any).id || 'unknown',
              username: (userData as any).username || 'unknown',
              name: (userData as any).name || 'Unknown User',
              avatar_url: (userData as any).avatar_url || null,
              status: (userData as any).status || 'offline'
            }
          : null;
        
        const formattedQuote: QuoteWithUser = {
          id: data.id,
          text: data.text,
          author: data.author,
          source: data.source,
          tags: data.tags || [],
          likes: data.likes || 0,
          comments: data.comments || 0,
          bookmarks: data.bookmarks || 0,
          created_at: data.created_at,
          updated_at: data.updated_at,
          user_id: data.user_id,
          category: data.category,
          featured_date: data.featured_date,
          user: userObj
        };
        
        setQuote(formattedQuote);
      } catch (err) {
        console.error('Error:', err);
        toast({
          title: 'Error',
          description: 'Failed to load quote',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchQuote();
  }, [id, navigate, toast]);
  
  // Handle like with the unified hook
  const handleLike = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to like quotes",
        variant: "destructive",
      });
      return;
    }
    
    const success = await toggleLike();
    
    // Update the quote state to reflect the new like count from the hook
    setQuote(prev => {
      if (!prev) return null;
      return { ...prev, likes: likeCount };
    });
  };
  
  // Handle bookmark with the unified hook
  const handleBookmark = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to bookmark quotes",
        variant: "destructive",
      });
      return;
    }
    
    const success = await toggleBookmark();
    
    // Update the quote state to reflect the new bookmark count from the hook
    setQuote(prev => {
      if (!prev) return null;
      return { ...prev, bookmarks: bookmarkCount };
    });
  };
  
  // Function to handle quote updates from the edit modal
  const handleQuoteUpdated = (updatedQuote: QuoteWithUser) => {
    setQuote(updatedQuote);
    setShowEditModal(false);
    toast({
      title: 'Success',
      description: 'Quote updated successfully',
    });
  };
  
  // Function to handle quote deletion
  const handleQuoteDeleted = () => {
    toast({
      title: 'Success',
      description: 'Quote deleted successfully',
    });
    navigate('/quotes');
  };

  // Function to update comment count
  const updateQuoteCommentCount = (increment: boolean) => {
    if (!quote) return;
    
    setQuote(prev => {
      if (!prev) return null;
      
      const newCount = increment 
        ? (prev.comments || 0) + 1 
        : Math.max(0, (prev.comments || 0) - 1);
        
      return {
        ...prev,
        comments: newCount
      };
    });
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4 animate-pulse">
        <Card className="p-6">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-4 w-3/4"></div>
          <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-1/2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
        </Card>
      </div>
    );
  }
  
  if (!quote) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card className="p-6 text-center">
          <h2 className="text-2xl font-bold mb-4">Quote Not Found</h2>
          <p className="mb-4">Sorry, the quote you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/quotes')}>Back to Quotes</Button>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="p-6 mb-6">
        {/* Quote Content */}
        <div className="mb-6">
          <blockquote className="text-2xl font-serif italic mb-4">
            "{quote?.text}"
          </blockquote>
          
          <div className="flex justify-between items-center">
            <div>
              <p className="text-lg font-semibold">— {quote?.author}</p>
              {quote?.source && (
                <p className="text-sm text-muted-foreground">from {quote.source}</p>
              )}
            </div>
            
            {user && quote?.user_id === user.id && (
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={() => setShowEditModal(true)}>
                  Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={() => setShowDeleteDialog(true)}>
                  Delete
                </Button>
              </div>
            )}
          </div>
        </div>
        
        {/* Actions & Stats */}
        <div className="flex flex-wrap justify-between items-center border-t pt-4 mt-4">
          <div className="flex items-center space-x-2 mb-2 sm:mb-0">
            <Button 
              variant={isLiked ? "default" : "outline"} 
              size="sm"
              onClick={handleLike}
              className="flex items-center space-x-1"
            >
              <HeartIcon size={16} className={isLiked ? "fill-white" : ""} />
              <span>{likeCount}</span>
            </Button>
            
            <Button 
              variant={isBookmarked ? "default" : "outline"} 
              size="sm"
              onClick={handleBookmark}
              className="flex items-center space-x-1"
            >
              <BookmarkIcon size={16} className={isBookmarked ? "fill-white" : ""} />
              <span>{bookmarkCount}</span>
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowShareDialog(true)}
              className="flex items-center space-x-1"
            >
              <Share2Icon size={16} />
              <span>Share</span>
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setActiveTab('comments')}
              className="flex items-center space-x-1"
            >
              <MessageCircleIcon size={16} />
              <span>{quote?.comments || 0}</span>
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {quote?.tags && quote.tags.map(tag => (
              <Badge key={tag} variant="secondary" className="mr-1">
                {tag}
              </Badge>
            ))}
            {quote?.category && (
              <Badge variant="outline" className="bg-primary/10 text-primary">
                {quote.category}
              </Badge>
            )}
          </div>
        </div>
        
        {/* User Info */}
        <div className="flex items-center mt-6 pt-4 border-t">
          <Avatar className="h-10 w-10">
            <AvatarImage src={quote?.user?.avatar_url ?? undefined} alt={quote?.user?.name ?? 'User'} />
            <AvatarFallback>{quote?.user?.name?.charAt(0) ?? 'U'}</AvatarFallback>
          </Avatar>
          <div className="ml-3">
            <p className="text-sm font-medium">{quote?.user?.name ?? 'Unknown User'}</p>
            <p className="text-xs text-muted-foreground">
              Shared {quote && formatDistanceToNow(new Date(quote.created_at), { addSuffix: true })}
            </p>
          </div>
        </div>
      </Card>
      
      {/* Tabs for Comments */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="quote">Quote</TabsTrigger>
          <TabsTrigger value="comments">Comments ({quote?.comments || 0})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="quote">
          {/* Additional quote context could go here */}
        </TabsContent>
        
        <TabsContent value="comments">
          {quote && (
            <QuoteComments 
              quoteId={quote.id} 
              updateQuoteCommentCount={updateQuoteCommentCount}
            />
          )}
        </TabsContent>
      </Tabs>
      
      {/* Share Dialog */}
      {quote && (
        <ShareQuoteDialog
          isOpen={showShareDialog}
          onClose={() => setShowShareDialog(false)}
          quote={quote}
        />
      )}
      
      {/* Edit Modal */}
      {showEditModal && quote && (
        <EditQuoteModal 
          isOpen={showEditModal} 
          onClose={() => setShowEditModal(false)} 
          quote={quote}
          onQuoteUpdated={handleQuoteUpdated}
        />
      )}
      
      {/* Delete Dialog */}
      {showDeleteDialog && quote && (
        <DeleteQuoteDialog
          isOpen={showDeleteDialog}
          onClose={() => setShowDeleteDialog(false)}
          quoteId={quote.id}
          onQuoteDeleted={handleQuoteDeleted}
        />
      )}
    </div>
  );
}
