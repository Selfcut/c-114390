
import React, { useState } from 'react';
import { BookReviewsHeader } from "@/components/bookreviews/BookReviewsHeader";
import { BookReviewsFilters } from "@/components/bookreviews/BookReviewsFilters";
import { BookReviewsList } from "@/components/bookreviews/BookReviewsList";
import { PageLayout } from "@/components/layouts/PageLayout";

const BookReviews = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  
  const handleCreateReview = () => {
    // This is just a placeholder for demonstration purposes
    alert("Create book review feature coming soon!");
  };
  
  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <BookReviewsHeader onCreateReview={handleCreateReview} />
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
    </PageLayout>
  );
};

export default BookReviews;
