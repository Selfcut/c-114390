
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface BookReviewsFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedGenre: string | null;
  onGenreChange: (genre: string | null) => void;
  genres?: string[];
}

export const BookReviewsFilters = ({
  searchQuery,
  onSearchChange,
  selectedGenre,
  onGenreChange,
  genres = []
}: BookReviewsFiltersProps) => {
  return (
    <div className="mb-6 flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search books by title or author..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <Select
        value={selectedGenre || ""}
        onValueChange={(value) => onGenreChange(value || null)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="All Genres" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All Genres</SelectItem>
          {genres.map((genre) => (
            <SelectItem key={genre} value={genre}>
              {genre}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
