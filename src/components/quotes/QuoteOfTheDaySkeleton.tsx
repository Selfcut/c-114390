
import { Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export function QuoteOfTheDaySkeleton() {
  return (
    <Card className="shadow-md border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <Calendar className="h-5 w-5 mr-2 text-primary" />
          <h3 className="text-lg font-semibold">Quote of the Day</h3>
        </div>
        <div className="h-24 animate-pulse bg-muted rounded-md"></div>
        <div className="mt-2 flex justify-end">
          <div className="h-4 w-24 animate-pulse bg-muted rounded-md"></div>
        </div>
      </CardContent>
    </Card>
  );
}
