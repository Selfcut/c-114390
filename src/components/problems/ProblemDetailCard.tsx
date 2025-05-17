
import React, { memo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Share, MessageSquare, ThumbsUp } from 'lucide-react';

interface ProblemDetailCardProps {
  problem: any;
  commentsCount: number;
}

// Using memo to prevent unnecessary re-renders
export const ProblemDetailCard = memo(({ problem, commentsCount }: ProblemDetailCardProps) => {
  if (!problem) return null;
  
  return (
    <Card className="mb-8">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <AlertTriangle size={20} className="text-amber-500" />
              <Badge>{problem.categories[0]}</Badge>
            </div>
            <CardTitle className="text-3xl mb-2">{problem.title}</CardTitle>
            <CardDescription className="text-lg">
              Severity: {problem.severity}/10 | Urgency: {problem.urgency}/10 | 
              Solvability: {problem.solvability}/10 (lower is harder to solve)
            </CardDescription>
          </div>
          
          <Button variant="outline" size="sm">
            <Share size={16} className="mr-2" />
            Share
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg mb-4">{problem.description}</p>
          
          {problem.longDescription && (
            <p>{problem.longDescription}</p>
          )}
          
          {problem.impact && (
            <>
              <h3 className="text-xl font-semibold mt-6 mb-2">Impact</h3>
              <p>{problem.impact}</p>
            </>
          )}
          
          {problem.challenges && (
            <>
              <h3 className="text-xl font-semibold mt-6 mb-2">Challenges</h3>
              <p>{problem.challenges}</p>
            </>
          )}
          
          {problem.potentialSolutions && (
            <>
              <h3 className="text-xl font-semibold mt-6 mb-2">Potential Solutions</h3>
              <p>{problem.potentialSolutions}</p>
            </>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2 mt-6">
          {problem.categories.map((category: string, index: number) => (
            <Badge key={index} variant="secondary">{category}</Badge>
          ))}
        </div>
      </CardContent>
      
      <CardFooter className="border-t pt-4">
        <div className="w-full">
          <div className="text-sm text-muted-foreground mb-4">
            Join the discussion to explore solutions to this global challenge.
          </div>
          
          <div className="flex items-center gap-2">
            <MessageSquare size={16} />
            <span>{commentsCount} contributions</span>
            
            <span className="mx-2">•</span>
            
            <ThumbsUp size={16} />
            <span>0 endorsements</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
});

// Display name for debugging purposes
ProblemDetailCard.displayName = 'ProblemDetailCard';
