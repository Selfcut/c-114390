
import React from 'react';
import { AlertTriangle, Info } from 'lucide-react';

export const ProblemsHeader = () => {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <AlertTriangle size={28} className="text-amber-500" />
        <h1 className="text-3xl font-bold">Global Problems Directory</h1>
      </div>
      
      <div className="bg-muted p-4 rounded-lg flex items-start gap-3">
        <Info className="text-primary mt-1 flex-shrink-0" />
        <div>
          <h2 className="font-medium mb-1">About This Directory</h2>
          <p className="text-muted-foreground">
            This is a curated list of the world's most pressing problems, organized by severity, urgency, and solvability.
            Click on any problem to join or start a discussion about potential solutions. Together, we can work towards
            addressing these global challenges.
          </p>
        </div>
      </div>
    </div>
  );
};
