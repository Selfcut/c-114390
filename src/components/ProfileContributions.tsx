
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, MessageSquare, Quote } from "lucide-react";

interface ProfileContributionsProps {
  userId: string;
}

export const ProfileContributions = ({ userId }: ProfileContributionsProps) => {
  const [quotes, setQuotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchContributions = async () => {
      try {
        setIsLoading(true);
        
        // Fetch quotes contributed by the user
        const { data: quotesData, error: quotesError } = await supabase
          .from('quotes')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });
          
        if (quotesError) throw quotesError;
        
        setQuotes(quotesData || []);
      } catch (err) {
        console.error("Error fetching contributions:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchContributions();
  }, [userId]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Contributions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="border rounded-lg p-4">
                <div className="flex justify-between mb-2">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-5 w-10" />
                </div>
                <Skeleton className="h-10 w-full mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (quotes.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Contributions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Quote className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No contributions yet.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contributions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quotes.map(quote => (
            <Card key={quote.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded font-medium">
                    {quote.category}
                  </span>
                  <div className="flex items-center text-muted-foreground text-xs gap-1">
                    <MessageSquare className="h-3 w-3" />
                    <span>{quote.comments || 0}</span>
                  </div>
                </div>
                <blockquote className="border-l-4 border-primary/30 pl-3 italic mb-2">
                  {quote.text.length > 100 
                    ? quote.text.substring(0, 100) + '...' 
                    : quote.text}
                </blockquote>
                <p className="text-xs text-muted-foreground">— {quote.author}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
