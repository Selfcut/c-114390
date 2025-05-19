import { PlusCircle, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

export const QuotesHeader = ({ onSubmitClick }: { onSubmitClick: () => void }) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-1">Quotes</h1>
        <p className="text-muted-foreground">
          Discover, share and save inspiring quotes from around the world
        </p>
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          onClick={() => navigate('/saved-quotes')}
        >
          <Bookmark className="h-4 w-4 mr-2" />
          Saved Quotes
        </Button>
        
        <Button onClick={onSubmitClick}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Submit Quote
        </Button>
      </div>
    </div>
  );
};
