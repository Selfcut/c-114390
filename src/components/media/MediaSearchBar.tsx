
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks/useDebounce";

interface MediaSearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export const MediaSearchBar: React.FC<MediaSearchBarProps> = ({
  searchTerm,
  setSearchTerm
}) => {
  const [inputValue, setInputValue] = useState(searchTerm);
  const debouncedValue = useDebounce(inputValue, 300);
  
  // Update search term when debounced value changes
  useEffect(() => {
    setSearchTerm(debouncedValue);
  }, [debouncedValue, setSearchTerm]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };
  
  const clearSearch = () => {
    setInputValue("");
    setSearchTerm("");
  };

  return (
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
      <Input
        placeholder="Search media..."
        value={inputValue}
        onChange={handleInputChange}
        className="pl-10 pr-10"
      />
      {inputValue && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
          onClick={clearSearch}
          aria-label="Clear search"
        >
          <X size={16} />
        </Button>
      )}
    </div>
  );
};
