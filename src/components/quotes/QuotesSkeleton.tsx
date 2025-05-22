
import React from "react";
import { SkeletonCard } from "@/components/ui/skeleton";

interface QuotesSkeletonProps {
  count?: number;
  layout?: "grid" | "list";
}

export const QuotesSkeleton: React.FC<QuotesSkeletonProps> = ({
  count = 8,
  layout = "grid"
}) => {
  return (
    <div 
      className={layout === "grid" 
        ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" 
        : "space-y-4"
      }
    >
      {Array(count).fill(0).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
};
