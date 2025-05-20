
import { useState } from 'react';
import { PageLayout } from '@/components/layouts/PageLayout';
import { QuotesHeader } from '@/components/quotes/QuotesHeader';
import { QuotesGrid } from '@/components/quotes/QuotesGrid';
import { QuotePagination } from '@/components/quotes/QuotePagination';
import { QuotesSearch } from '@/components/quotes/QuotesSearch';
import { TagsFilter } from '@/components/quotes/TagsFilter';
import { QuotesSorting } from '@/components/quotes/QuotesSorting';
import { QuoteSubmissionModal } from '@/components/QuoteSubmissionModal';
import { useQuotes } from '@/hooks/useQuotes';
import { QuoteOfTheDay } from '@/components/quotes/QuoteOfTheDay';

const Quotes = () => {
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  
  const {
    quotes,
    allTags,
    isLoading,
    searchQuery,
    setSearchQuery,
    filterTag,
    setFilterTag,
    sortOption,
    setSortOption,
    userLikes,
    userBookmarks,
    handleLike,
    handleBookmark,
    refreshQuotes,
    resetFilters,
    currentPage,
    totalPages,
    handlePageChange
  } = useQuotes();

  return (
    <PageLayout>
      <div className="container mx-auto py-8 px-4">
        <QuotesHeader 
          onSubmitClick={() => setIsSubmitModalOpen(true)} 
        />
        
        {/* Add Quote of the Day at the top on larger screens */}
        <div className="hidden lg:block mb-8">
          <QuoteOfTheDay />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8">
          {/* Sidebar Filters */}
          <aside className="space-y-8">
            {/* Add Quote of the Day on mobile */}
            <div className="lg:hidden mb-4">
              <QuoteOfTheDay />
            </div>
            
            <QuotesSearch 
              search={searchQuery}
              onSearchChange={setSearchQuery}
            />
            
            <TagsFilter 
              tags={allTags}
              selectedTag={filterTag}
              onSelectTag={setFilterTag}
            />
            
            <QuotesSorting
              value={sortOption}
              onChange={setSortOption}
            />
            
            <div className="pt-4">
              <button
                onClick={resetFilters}
                className="text-sm text-primary hover:text-primary/80 transition-colors"
              >
                Reset all filters
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <div>
            <QuotesGrid
              quotes={quotes}
              isLoading={isLoading}
              userLikes={userLikes}
              userBookmarks={userBookmarks}
              onLike={handleLike}
              onBookmark={handleBookmark}
              onTagClick={setFilterTag}
            />
            
            <div className="mt-8">
              <QuotePagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        </div>
        
        <QuoteSubmissionModal
          isOpen={isSubmitModalOpen}
          onClose={() => setIsSubmitModalOpen(false)}
          onQuoteAdded={refreshQuotes}
        />
      </div>
    </PageLayout>
  );
};

export default Quotes;
