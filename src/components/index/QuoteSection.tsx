
import React from 'react';
import EnhancedQuotesCarousel from '@/components/EnhancedQuotesCarousel';

export const QuoteSection = () => {
  return (
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Daily Inspiration
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover thought-provoking quotes from great minds throughout history.
            Let wisdom guide your intellectual journey.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <EnhancedQuotesCarousel className="shadow-lg" />
        </div>
      </div>
    </section>
  );
};
