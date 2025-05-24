
import React, { useState } from 'react';
import { QuoteSubmissionModal } from "@/components/QuoteSubmissionModal";
import { useQuotes } from "@/hooks/useQuotes";
import { QuotesHeader } from "@/components/quotes/QuotesHeader";
import { QuotesSearch } from "@/components/quotes/QuotesSearch";
import { TagsFilter } from "@/components/quotes/TagsFilter";
import { QuotesGrid } from "@/components/quotes/QuotesGrid";

const Quotes = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const {
    quotes,
    allTags,
    isLoading,
    searchQuery,
    setSearchQuery,
    filterTag,
    setFilterTag,
    userLikes,
    userBookmarks,
    handleLike,
    handleBookmark,
    refreshQuotes,
    resetFilters
  } = useQuotes();

  // Handle successful quote submission
  const handleQuoteSubmitted = async () => {
    await refreshQuotes();
    setIsModalOpen(false);
  };
  
  // Wrapper functions to handle the boolean return value from useQuotes hook
  const onLike = async (quoteId: string) => {
    return await handleLike(quoteId);
  };
  
  const onBookmark = async (quoteId: string) => {
    return await handleBookmark(quoteId);
  };
  
  return (
    <main className="container mx-auto py-8">
      {/* Header with title and create button */}
      <QuotesHeader onSubmitClick={() => setIsModalOpen(true)} />
      
      {/* Search and filters */}
      <QuotesSearch 
        search={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Tags scroller */}
      <TagsFilter 
        tags={allTags}
        selectedTag={filterTag}
        onSelectTag={setFilterTag}
      />

      {/* Quotes grid */}
      <QuotesGrid 
        quotes={quotes}
        isLoading={isLoading}
        userLikes={userLikes}
        userBookmarks={userBookmarks}
        onLike={onLike}
        onBookmark={onBookmark}
        onTagClick={setFilterTag}
      />
      
      {/* Quote submission modal */}
      {isModalOpen && (
        <QuoteSubmissionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onQuoteAdded={refreshQuotes}
        />
      )}
    </main>
  );
};

export default Quotes;
