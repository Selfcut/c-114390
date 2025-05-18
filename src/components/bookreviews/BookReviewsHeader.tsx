
import React from 'react';
import { BookOpen, PenSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BookReviewsHeaderProps {
  onCreateReview: () => void;
}

export const BookReviewsHeader = ({ onCreateReview }: BookReviewsHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-8 stagger-fade w-full">
      <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
        <BookOpen size={28} />
        Book Reviews
      </h1>
      <Button 
        className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors hover-lift"
        onClick={onCreateReview}
      >
        <PenSquare size={18} />
        <span>Write a Review</span>
      </Button>
    </div>
  );
};
