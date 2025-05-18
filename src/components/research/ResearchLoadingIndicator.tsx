
import React from 'react';

export const ResearchLoadingIndicator: React.FC = () => {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
        <p className="mt-4 text-muted-foreground">Fetching research papers...</p>
      </div>
    </div>
  );
};
