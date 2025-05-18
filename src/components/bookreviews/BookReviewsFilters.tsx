
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface BookReviewsFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedGenre: string | null;
  onGenreChange: (genre: string | null) => void;
}

const genres = [
  { id: 'all', label: 'All Genres' },
  { id: 'science', label: 'Science' },
  { id: 'philosophy', label: 'Philosophy' },
  { id: 'mathematics', label: 'Mathematics' },
  { id: 'history', label: 'History' },
  { id: 'psychology', label: 'Psychology' },
  { id: 'fiction', label: 'Fiction' },
];

export const BookReviewsFilters = ({ 
  searchQuery, 
  onSearchChange,
  selectedGenre,
  onGenreChange
}: BookReviewsFiltersProps) => {
  return (
    <div className="mb-6 space-y-4">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search books..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {genres.map((genre) => (
          <Button
            key={genre.id}
            variant={genre.id === (selectedGenre || 'all') ? "secondary" : "outline"}
            size="sm"
            onClick={() => onGenreChange(genre.id === 'all' ? null : genre.id)}
          >
            {genre.label}
          </Button>
        ))}
      </div>
    </div>
  );
};
