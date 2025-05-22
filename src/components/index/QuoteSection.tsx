
import React, { Suspense, lazy } from "react";
import { LoadingScreen } from "../LoadingScreen";

// Lazy load EnhancedQuotesCarousel for better initial page load performance
const EnhancedQuotesCarousel = lazy(() => 
  import("../EnhancedQuotesCarousel").then(module => ({
    default: module.EnhancedQuotesCarousel
  }))
);

export const QuoteSection = () => {
  return (
    <div className="mb-12 animate-fade-in" style={{ animationDelay: "0.25s" }}>
      <Suspense fallback={<LoadingScreen fullScreen={false} message="Loading quotes..." />}>
        <EnhancedQuotesCarousel />
      </Suspense>
    </div>
  );
};
