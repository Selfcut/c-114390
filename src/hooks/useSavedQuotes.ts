
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { QuoteWithUser } from '@/lib/quotes/types';

export interface QuoteCollection {
  id: string;
  name: string;
  description?: string | null;
  user_id: string;
  created_at: string;
  quote_count?: number;
}

export interface SavedQuoteWithCollection {
  quote: QuoteWithUser;
  collections: string[];
}

export const useSavedQuotes = () => {
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const [savedQuotes, setSavedQuotes] = useState<SavedQuoteWithCollection[]>([]);
  const [collections, setCollections] = useState<QuoteCollection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCollection, setActiveCollection] = useState<string | null>(null);

  // Fetch user's collections
  const fetchCollections = useCallback(async () => {
    if (!isAuthenticated || !user) return;
    
    try {
      const { data, error } = await supabase
        .from('quote_collections')
        .select('*');
        
      if (error) throw error;
      
      // Count quotes in each collection
      const collectionsWithCount: QuoteCollection[] = [];
      
      for (const collection of data) {
        // Count quotes in this collection
        const { count, error: countError } = await supabase
          .from('quote_collection_items')
          .select('*', { count: 'exact', head: true })
          .eq('collection_id', collection.id);
        
        if (countError) throw countError;
        
        collectionsWithCount.push({
          id: collection.id,
          name: collection.name,
          description: collection.description,
          user_id: collection.user_id,
          created_at: collection.created_at,
          quote_count: count || 0
        });
      }
      
      setCollections(collectionsWithCount);
    } catch (error) {
      console.error('Error fetching collections:', error);
      toast({
        title: 'Failed to load collections',
        description: 'Please try again later',
        variant: 'destructive'
      });
    }
  }, [isAuthenticated, user, toast]);

  // Fetch bookmarked quotes
  const fetchSavedQuotes = useCallback(async () => {
    if (!isAuthenticated || !user) {
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Fetch bookmarked quotes
      const { data: bookmarkData, error: bookmarkError } = await supabase
        .from('quote_bookmarks')
        .select('quote_id')
        .eq('user_id', user.id);
        
      if (bookmarkError) throw bookmarkError;
      
      if (!bookmarkData || bookmarkData.length === 0) {
        setSavedQuotes([]);
        setIsLoading(false);
        return;
      }
      
      // Extract quote IDs
      const quoteIds = bookmarkData.map(bookmark => bookmark.quote_id);
      
      // Fetch full quote data with user info
      const { data: quotesData, error: quotesError } = await supabase
        .from('quotes')
        .select(`
          *,
          user:profiles(
            id, 
            username, 
            name, 
            avatar_url, 
            status
          )
        `)
        .in('id', quoteIds);
        
      if (quotesError) throw quotesError;
      
      // Fetch collection assignments for these quotes
      const { data: collectionItems, error: collectionError } = await supabase
        .from('quote_collection_items')
        .select('quote_id, collection_id')
        .eq('user_id', user.id)
        .in('quote_id', quoteIds);
        
      if (collectionError) throw collectionError;
      
      // Map quotes to their collections
      const quotesWithCollections = quotesData.map(quote => {
        // Find all collection IDs this quote belongs to
        const quoteCollections = collectionItems
          ? collectionItems
              .filter(item => item.quote_id === quote.id)
              .map(item => item.collection_id)
          : [];
          
        return {
          quote: {
            ...quote,
            user: quote.user || null
          },
          collections: quoteCollections
        };
      });
      
      setSavedQuotes(quotesWithCollections);
    } catch (error) {
      console.error('Error fetching saved quotes:', error);
      toast({
        title: 'Failed to load saved quotes',
        description: 'Please try again later',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user, toast]);
  
  // Create a new collection
  const createCollection = async (name: string, description?: string) => {
    if (!isAuthenticated || !user) {
      toast({
        title: 'Authentication required',
        description: 'Please log in to create collections',
        variant: 'destructive'
      });
      return null;
    }
    
    try {
      const { data, error } = await supabase
        .from('quote_collections')
        .insert({
          name,
          description,
          user_id: user.id
        })
        .select()
        .single();
        
      if (error) throw error;
      
      // Add the new collection to state
      setCollections(prev => [...prev, {
        ...data,
        quote_count: 0
      }]);
      
      toast({
        title: 'Collection created',
        description: `"${name}" collection has been created`
      });
      
      return data.id;
    } catch (error) {
      console.error('Error creating collection:', error);
      toast({
        title: 'Failed to create collection',
        description: 'Please try again later',
        variant: 'destructive'
      });
      return null;
    }
  };
  
  // Add a quote to a collection
  const addQuoteToCollection = async (quoteId: string, collectionId: string) => {
    if (!isAuthenticated || !user) return false;
    
    try {
      // Check if quote is already in collection
      const { data: existingItem, error: checkError } = await supabase
        .from('quote_collection_items')
        .select()
        .eq('quote_id', quoteId)
        .eq('collection_id', collectionId)
        .eq('user_id', user.id)
        .maybeSingle();
        
      if (checkError) throw checkError;
      
      if (existingItem) {
        // Already in collection
        return true;
      }
      
      // Add to collection
      const { error } = await supabase
        .from('quote_collection_items')
        .insert({
          quote_id: quoteId,
          collection_id: collectionId,
          user_id: user.id
        });
        
      if (error) throw error;
      
      // Update state
      setSavedQuotes(prev => prev.map(item => {
        if (item.quote.id === quoteId) {
          return {
            ...item,
            collections: [...item.collections, collectionId]
          };
        }
        return item;
      }));
      
      // Update collection quote count
      setCollections(prev => prev.map(collection => {
        if (collection.id === collectionId) {
          return {
            ...collection,
            quote_count: (collection.quote_count || 0) + 1
          };
        }
        return collection;
      }));
      
      return true;
    } catch (error) {
      console.error('Error adding quote to collection:', error);
      return false;
    }
  };
  
  // Remove quote from collection
  const removeQuoteFromCollection = async (quoteId: string, collectionId: string) => {
    if (!isAuthenticated || !user) return false;
    
    try {
      const { error } = await supabase
        .from('quote_collection_items')
        .delete()
        .eq('quote_id', quoteId)
        .eq('collection_id', collectionId)
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      // Update state
      setSavedQuotes(prev => prev.map(item => {
        if (item.quote.id === quoteId) {
          return {
            ...item,
            collections: item.collections.filter(id => id !== collectionId)
          };
        }
        return item;
      }));
      
      // Update collection quote count
      setCollections(prev => prev.map(collection => {
        if (collection.id === collectionId) {
          return {
            ...collection,
            quote_count: Math.max((collection.quote_count || 1) - 1, 0)
          };
        }
        return collection;
      }));
      
      return true;
    } catch (error) {
      console.error('Error removing quote from collection:', error);
      return false;
    }
  };
  
  // Delete a collection
  const deleteCollection = async (collectionId: string) => {
    if (!isAuthenticated || !user) return false;
    
    try {
      // Delete collection (cascade will delete items)
      const { error } = await supabase
        .from('quote_collections')
        .delete()
        .eq('id', collectionId)
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      // Update collections state
      setCollections(prev => prev.filter(c => c.id !== collectionId));
      
      // Update saved quotes state to remove deleted collection
      setSavedQuotes(prev => prev.map(item => ({
        ...item,
        collections: item.collections.filter(id => id !== collectionId)
      })));
      
      if (activeCollection === collectionId) {
        setActiveCollection(null);
      }
      
      toast({
        title: 'Collection deleted',
        description: 'The collection has been deleted successfully'
      });
      
      return true;
    } catch (error) {
      console.error('Error deleting collection:', error);
      toast({
        title: 'Failed to delete collection',
        description: 'Please try again later',
        variant: 'destructive'
      });
      return false;
    }
  };

  // Filter quotes by collection
  const getFilteredQuotes = useCallback(() => {
    if (!activeCollection) return savedQuotes;
    
    return savedQuotes.filter(item => 
      item.collections.includes(activeCollection)
    );
  }, [savedQuotes, activeCollection]);

  // Initialize data
  useEffect(() => {
    fetchSavedQuotes();
    fetchCollections();
  }, [fetchSavedQuotes, fetchCollections]);

  return {
    savedQuotes,
    filteredQuotes: getFilteredQuotes(),
    collections,
    isLoading,
    activeCollection,
    setActiveCollection,
    createCollection,
    addQuoteToCollection,
    removeQuoteFromCollection,
    deleteCollection,
    refreshData: useCallback(() => {
      fetchSavedQuotes();
      fetchCollections();
    }, [fetchSavedQuotes, fetchCollections])
  };
};
