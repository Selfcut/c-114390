
import React, { useState } from 'react';
import { CollapsibleSidebar } from "@/components/CollapsibleSidebar";
import Header from "@/components/Header";
import { BookReviewsHeader } from "@/components/bookreviews/BookReviewsHeader";
import { BookReviewsFilters } from "@/components/bookreviews/BookReviewsFilters";
import { BookReviewsList } from "@/components/bookreviews/BookReviewsList";

const BookReviews = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  
  return (
    <div className="flex min-h-screen bg-background">
      <CollapsibleSidebar />
      <div className="flex-1 flex flex-col w-[calc(100vw-var(--sidebar-width))]">
        <Header />
        <main className="flex-1 overflow-auto p-6">
          <div className="container mx-auto max-w-7xl">
            <BookReviewsHeader onCreateReview={() => {
              // Add your create book review logic here
              alert('Create book review feature coming soon');
            }} />
            <BookReviewsFilters 
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedGenre={selectedGenre}
              onGenreChange={setSelectedGenre}
            />
            <BookReviewsList 
              searchQuery={searchQuery}
              selectedGenre={selectedGenre}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default BookReviews;
