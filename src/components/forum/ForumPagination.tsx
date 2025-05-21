
import React from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface ForumPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export const ForumPagination: React.FC<ForumPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className = ''
}) => {
  if (totalPages <= 1) {
    return null;
  }

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      // Calculate start and end of visible middle section
      const middleStart = Math.max(2, currentPage - 1);
      const middleEnd = Math.min(totalPages - 1, currentPage + 1);
      
      // Add ellipsis after first page if needed
      if (middleStart > 2) {
        pages.push(-1); // Use -1 to represent ellipsis
      }
      
      // Add middle pages
      for (let i = middleStart; i <= middleEnd; i++) {
        pages.push(i);
      }
      
      // Add ellipsis before last page if needed
      if (middleEnd < totalPages - 1) {
        pages.push(-2); // Use -2 to represent ellipsis
      }
      
      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <Pagination className={className}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              if (currentPage > 1) onPageChange(currentPage - 1);
            }} 
            aria-disabled={currentPage === 1}
            tabIndex={currentPage === 1 ? -1 : 0}
            className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
          />
        </PaginationItem>
        
        {pageNumbers.map((pageNumber, index) => (
          <PaginationItem key={`page-${pageNumber}-${index}`}>
            {pageNumber < 0 ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink 
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onPageChange(pageNumber);
                }}
                isActive={pageNumber === currentPage}
              >
                {pageNumber}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}
        
        <PaginationItem>
          <PaginationNext 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              if (currentPage < totalPages) onPageChange(currentPage + 1);
            }} 
            aria-disabled={currentPage === totalPages}
            tabIndex={currentPage === totalPages ? -1 : 0}
            className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
