
import React from 'react';
import { Microscope } from "lucide-react";

export const ResearchDiscoveryNotice: React.FC = () => {
  return (
    <div className="mb-4 p-3 bg-primary/10 rounded-md border border-primary/20 text-sm flex items-start gap-3">
      <Microscope className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
      <div>
        <p className="font-medium">Research Auto-Discovery Active</p>
        <p className="text-muted-foreground">The system is automatically searching for new research papers every hour from arXiv.</p>
      </div>
    </div>
  );
};
