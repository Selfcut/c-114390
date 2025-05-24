
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface QuotesHeaderProps {
  onSubmitClick: () => void;
}

export const QuotesHeader: React.FC<QuotesHeaderProps> = ({ onSubmitClick }) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold">Quotes</h1>
        <p className="text-muted-foreground mt-2">
          Discover and share inspiring quotes from great minds
        </p>
      </div>
      <Button onClick={onSubmitClick} className="flex items-center gap-2">
        <Plus size={16} />
        Submit Quote
      </Button>
    </div>
  );
};
