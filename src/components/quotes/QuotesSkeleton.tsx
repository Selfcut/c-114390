
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

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
        <div key={i} className="border rounded-lg p-4">
          <Skeleton className="h-24 w-full mb-4" />
          <Skeleton className="h-4 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ))}
    </div>
  );
};
