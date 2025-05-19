
import { PlusCircle } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { QuoteCollection } from '@/hooks/useSavedQuotes';

interface CollectionSelectorProps {
  collections: QuoteCollection[];
  activeCollection: string | null;
  onCollectionChange: (collectionId: string | null) => void;
  onCreateCollection: (name: string, description?: string) => Promise<string | null>;
}

export function CollectionSelector({
  collections,
  activeCollection,
  onCollectionChange,
  onCreateCollection
}: CollectionSelectorProps) {
  const [isCreatingCollection, setIsCreatingCollection] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [newCollectionDescription, setNewCollectionDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleCreateCollection = async () => {
    if (!newCollectionName.trim()) return;
    
    setIsSubmitting(true);
    const collectionId = await onCreateCollection(
      newCollectionName.trim(), 
      newCollectionDescription.trim() || undefined
    );
    setIsSubmitting(false);
    
    if (collectionId) {
      setNewCollectionName('');
      setNewCollectionDescription('');
      setIsCreatingCollection(false);
      onCollectionChange(collectionId);
    }
  };
  
  return (
    <>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium">Collections</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0" 
          onClick={() => setIsCreatingCollection(true)}
        >
          <PlusCircle className="h-4 w-4" />
          <span className="sr-only">Add collection</span>
        </Button>
      </div>
      
      <div className="space-y-1">
        <Button
          variant={activeCollection === null ? "secondary" : "ghost"}
          size="sm"
          className="w-full justify-start font-normal"
          onClick={() => onCollectionChange(null)}
        >
          All Saved Quotes
        </Button>
        
        {collections.length > 0 && (
          <ScrollArea className="h-[300px]">
            <div className="space-y-1 pr-2">
              {collections.map((collection) => (
                <Button
                  key={collection.id}
                  variant={activeCollection === collection.id ? "secondary" : "ghost"}
                  size="sm"
                  className="w-full justify-start font-normal"
                  onClick={() => onCollectionChange(collection.id)}
                >
                  <span className="truncate">{collection.name}</span>
                  <span className="ml-auto text-xs text-muted-foreground">
                    {collection.quote_count || 0}
                  </span>
                </Button>
              ))}
            </div>
            <Separator className="my-2" />
          </ScrollArea>
        )}
      </div>
      
      <Dialog open={isCreatingCollection} onOpenChange={setIsCreatingCollection}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Collection</DialogTitle>
            <DialogDescription>
              Create a new collection to organize your saved quotes.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="name">Collection Name</Label>
              <Input 
                id="name"
                value={newCollectionName} 
                onChange={(e) => setNewCollectionName(e.target.value)} 
                placeholder="My Favorite Quotes"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea 
                id="description"
                value={newCollectionDescription} 
                onChange={(e) => setNewCollectionDescription(e.target.value)} 
                placeholder="A collection of quotes that inspire me"
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsCreatingCollection(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCreateCollection}
              disabled={!newCollectionName.trim() || isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Collection'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
