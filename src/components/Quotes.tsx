
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
  
  return (
    <main className="container mx-auto py-8">
      {/* Header with title and create button */}
      <QuotesHeader onSubmitClick={() => setIsModalOpen(true)} />
      
      {/* Search and filters */}
      <QuotesSearch 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filterTag={filterTag}
        onTagClear={() => setFilterTag(null)}
      />

      {/* Tags scroller */}
      <TagsFilter 
        tags={allTags}
        activeTag={filterTag}
        onTagClick={setFilterTag}
      />

      {/* Quotes grid */}
      <QuotesGrid 
        quotes={quotes}
        isLoading={isLoading}
        userLikes={userLikes}
        userBookmarks={userBookmarks}
        onLike={handleLike}
        onBookmark={handleBookmark}
        onTagClick={setFilterTag}
        onResetFilters={resetFilters}
      />
      
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
