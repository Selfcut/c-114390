
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MoreHorizontal, MessageSquare, FolderPlus, Check } from 'lucide-react';

import { QuoteWithUser } from '@/lib/quotes/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { QuoteCollection } from '@/hooks/useSavedQuotes';

interface SavedQuoteCardProps {
  quote: QuoteWithUser;
  collections: QuoteCollection[];
  quoteCollections: string[];
  onRemoveFromCollection?: (quoteId: string, collectionId: string) => void;
  onAddToCollection?: (quoteId: string, collectionId: string) => void;
}

export function SavedQuoteCard({ 
  quote, 
  collections,
  quoteCollections,
  onRemoveFromCollection,
  onAddToCollection
}: SavedQuoteCardProps) {
  const navigate = useNavigate();
  const [isCollectionDialogOpen, setIsCollectionDialogOpen] = useState(false);
  
  const handleQuoteClick = () => {
    navigate(`/quotes/${quote.id}`);
  };
  
  return (
    <>
      <Card className="hover:shadow-md transition-all duration-200 cursor-pointer" onClick={handleQuoteClick}>
        <CardContent className="p-4">
          <div className="mb-3">
            <p className="text-lg font-serif italic relative">
              <span className="absolute -left-2 -top-1 text-xl text-primary/30">"</span>
              {quote.text}
              <span className="text-xl text-primary/30">"</span>
            </p>
          </div>
          
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="font-medium text-sm">{quote.author}</p>
              {quote.source && <p className="text-xs text-muted-foreground">{quote.source}</p>}
            </div>
            {quote.category && (
              <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
                {quote.category}
              </Badge>
            )}
          </div>
          
          {quote.tags && quote.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {quote.tags.map((tag, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="text-xs hover:bg-secondary/80"
                  onClick={(e) => e.stopPropagation()}
                >
                  #{tag}
                </Badge>
              ))}
            </div>
          )}
          
          <div className="flex items-center justify-between mt-3 pt-3 border-t">
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                {quote.user?.avatar_url ? (
                  <AvatarImage src={quote.user.avatar_url} alt={quote.user.name || ''} />
                ) : (
                  <AvatarImage 
                    src={`https://api.dicebear.com/7.x/personas/svg?seed=${quote.user?.username || quote.user_id}`} 
                    alt={quote.user?.name || ''}
                  />
                )}
                <AvatarFallback>
                  {(quote.user?.name?.[0] || quote.user?.username?.[0] || 'U').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs font-medium">
                {quote.user?.name || quote.user?.username || 'Unknown User'}
              </span>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/quotes/${quote.id}?openComments=true`);
                }}
              >
                <MessageSquare className="h-4 w-4" />
                <span className="sr-only">Comments</span>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">More options</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                  <DropdownMenuItem onClick={(e) => {
                    e.stopPropagation();
                    setIsCollectionDialogOpen(true);
                  }}>
                    <FolderPlus className="h-4 w-4 mr-2" />
                    Manage Collections
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/quotes/${quote.id}`);
                  }}>
                    View Quote Details
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Dialog open={isCollectionDialogOpen} onOpenChange={setIsCollectionDialogOpen}>
        <DialogContent onClick={(e) => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle>Manage Collections</DialogTitle>
            <DialogDescription>
              Add or remove this quote from your collections.
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="max-h-[50vh]">
            {collections.length === 0 ? (
              <div className="py-6 text-center text-muted-foreground">
                <p>You haven't created any collections yet.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {collections.map((collection) => {
                  const isInCollection = quoteCollections.includes(collection.id);
                  
                  return (
                    <div
                      key={collection.id}
                      className="flex items-center justify-between p-2 rounded-md hover:bg-muted"
                    >
                      <div>
                        <p className="font-medium">{collection.name}</p>
                        {collection.description && (
                          <p className="text-xs text-muted-foreground">{collection.description}</p>
                        )}
                      </div>
                      
                      {isInCollection ? (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => onRemoveFromCollection && onRemoveFromCollection(quote.id, collection.id)}
                        >
                          Remove
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-primary hover:text-primary hover:bg-primary/10"
                          onClick={() => onAddToCollection && onAddToCollection(quote.id, collection.id)}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Add
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}
