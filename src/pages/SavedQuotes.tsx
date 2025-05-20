
import { useState } from 'react';
import { PageLayout } from '@/components/layouts/PageLayout';
import { Button } from '@/components/ui/button';
import { CollectionSelector } from '@/components/saved-quotes/CollectionSelector';
import { SavedQuotesGrid } from '@/components/saved-quotes/SavedQuotesGrid';
import { CollectionManagement } from '@/components/saved-quotes/CollectionManagement';
import { useSavedQuotes } from '@/hooks/useSavedQuotes';
import { useAuth } from '@/lib/auth';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, BookmarkIcon, Home } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const SavedQuotes = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const {
    savedQuotes,
    filteredQuotes,
    collections,
    isLoading,
    activeCollection,
    setActiveCollection,
    createCollection,
    addQuoteToCollection,
    removeQuoteFromCollection,
    deleteCollection,
    refreshData
  } = useSavedQuotes();
  
  // Find active collection object
  const activeCollectionObject = collections.find(c => c.id === activeCollection);
  
  if (!isAuthenticated && !authLoading) {
    return (
      <PageLayout>
        <div className="container mx-auto py-12 px-4">
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <h1 className="text-3xl font-bold tracking-tight mb-4">Saved Quotes</h1>
            <p className="text-muted-foreground mb-8 max-w-md">
              Sign in to save your favorite quotes and organize them into collections.
            </p>
            <Button onClick={() => navigate('/auth')}>
              Sign In
            </Button>
          </div>
        </div>
      </PageLayout>
    );
  }
  
  return (
    <PageLayout>
      <div className="container mx-auto py-8 px-4">
        {/* Breadcrumbs */}
        <nav className="flex items-center text-sm text-muted-foreground mb-6">
          <Button 
            variant="link" 
            onClick={() => navigate('/')}
            className="p-0 h-auto font-normal"
          >
            <Home className="h-4 w-4 mr-1" />
            Home
          </Button>
          <ChevronRight className="h-4 w-4 mx-1" />
          <Button 
            variant="link" 
            onClick={() => navigate('/quotes')}
            className="p-0 h-auto font-normal"
          >
            Quotes
          </Button>
          <ChevronRight className="h-4 w-4 mx-1" />
          <span className="font-medium text-foreground flex items-center">
            <BookmarkIcon className="h-4 w-4 mr-1" />
            Saved Quotes
          </span>
        </nav>
        
        <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8">
          {/* Sidebar */}
          <div className="md:border-r pr-4">
            <h2 className="text-xl font-semibold mb-4">Saved Quotes</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Browse your saved quotes or organize them into collections.
            </p>
            
            <div className="space-y-6">
              <CollectionSelector
                collections={collections}
                activeCollection={activeCollection}
                onCollectionChange={setActiveCollection}
                onCreateCollection={createCollection}
              />
              
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate('/quotes')}
              >
                Browse All Quotes
              </Button>
            </div>
          </div>
          
          {/* Main Content */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">
                {activeCollectionObject 
                  ? activeCollectionObject.name 
                  : 'All Saved Quotes'}
              </h2>
              
              {activeCollectionObject && (
                <CollectionManagement
                  collection={activeCollectionObject}
                  onCollectionDeleted={() => {
                    deleteCollection(activeCollectionObject.id);
                    setActiveCollection(null);
                  }}
                  onCollectionUpdated={refreshData}
                />
              )}
            </div>
            
            {activeCollectionObject?.description && (
              <p className="text-muted-foreground mb-6">
                {activeCollectionObject.description}
              </p>
            )}
            
            <SavedQuotesGrid
              quotes={filteredQuotes}
              collections={collections}
              isLoading={isLoading || authLoading}
              onAddToCollection={addQuoteToCollection}
              onRemoveFromCollection={removeQuoteFromCollection}
            />
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default SavedQuotes;
