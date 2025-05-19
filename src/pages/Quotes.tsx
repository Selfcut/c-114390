
import React, { useState } from 'react';
import { PageLayout } from '@/components/layouts/PageLayout';
import { QuoteSubmissionModal } from "@/components/QuoteSubmissionModal";
import { useQuotes } from "@/hooks/useQuotes";
import { QuotesHeader } from "@/components/quotes/QuotesHeader";
import { QuotesSearch } from "@/components/quotes/QuotesSearch";
import { TagsFilter } from "@/components/quotes/TagsFilter";
import { QuotesGrid } from "@/components/quotes/QuotesGrid";
import { QuotePagination } from "@/components/quotes/QuotePagination";

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
    resetFilters,
    currentPage,
    totalPages,
    handlePageChange
  } = useQuotes({ initialLimit: 12 });

  // Handle successful quote submission
  const handleQuoteSubmitted = async () => {
    await refreshQuotes();
    setIsModalOpen(false);
  };
  
  return (
    <PageLayout>
      <main className="container mx-auto py-8 px-4">
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
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <QuotePagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
        
        {/* Quote submission modal */}
        {isModalOpen && (
          <QuoteSubmissionModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleQuoteSubmitted}
          />
        )}
      </main>
    </PageLayout>
  );
};

export default Quotes;
