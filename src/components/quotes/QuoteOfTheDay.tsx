
import { useNavigate } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { QuoteOfTheDaySkeleton } from '@/components/quotes/QuoteOfTheDaySkeleton';
import { QuoteContent } from '@/components/quotes/QuoteContent';
import { useQuoteOfTheDay } from '@/hooks/useQuoteOfTheDay';

export function QuoteOfTheDay() {
  const navigate = useNavigate();
  const { quote, isLoading } = useQuoteOfTheDay();

  if (isLoading) {
    return <QuoteOfTheDaySkeleton />;
  }
  
  if (!quote) {
    return null;
  }
  
  return (
    <Card className="shadow-md border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <Calendar className="h-5 w-5 mr-2 text-primary" />
          <h3 className="text-lg font-semibold">Quote of the Day</h3>
        </div>
        <QuoteContent quote={quote} />
      </CardContent>
      <CardFooter className="border-t px-6 py-3 flex justify-end">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => navigate(`/quotes/${quote.id}`)}
        >
          View Quote
        </Button>
      </CardFooter>
    </Card>
  );
}
