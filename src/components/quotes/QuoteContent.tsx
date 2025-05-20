
import { Quote as QuoteIcon } from 'lucide-react';
import { QuoteWithUser } from '@/lib/quotes/types';

interface QuoteContentProps {
  quote: QuoteWithUser;
}

export function QuoteContent({ quote }: QuoteContentProps) {
  return (
    <>
      <blockquote className="relative italic text-lg">
        <QuoteIcon className="h-8 w-8 absolute -top-4 -left-2 text-primary/10" />
        <p className="pl-4">{quote.text}</p>
      </blockquote>
      <footer className="mt-2 text-right">
        <cite className="font-medium">{quote.author}</cite>
        {quote.source && (
          <p className="text-xs text-muted-foreground">{quote.source}</p>
        )}
      </footer>
    </>
  );
}
