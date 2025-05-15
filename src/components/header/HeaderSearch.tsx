
import React, { useState } from "react";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlobalSearch } from "@/components/GlobalSearch";

export const HeaderSearch = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      {/* Global Search component */}
      <div className="relative flex-1 max-w-md hidden md:block">
        <GlobalSearch />
      </div>
      
      {/* Mobile search trigger */}
      <Button 
        variant="ghost" 
        size="icon" 
        className="md:hidden"
        onClick={() => setIsSearchOpen(true)}
      >
        <Search className="h-4 w-4" />
      </Button>
      
      {/* Mobile search modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 p-4 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Search</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <GlobalSearch />
        </div>
      )}
    </>
  );
};
