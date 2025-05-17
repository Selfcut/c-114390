
import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Problem } from '@/data/problemsData';

interface ProblemsListProps {
  problems: Problem[];
  onProblemClick: (id: number) => void;
}

export const ProblemsList = ({ problems, onProblemClick }: ProblemsListProps) => {
  return (
    <div className="space-y-4">
      {problems.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold mb-2">No problems found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filters</p>
        </div>
      ) : (
        problems.map((problem) => (
          <Card 
            key={problem.id} 
            className="transition-all hover:border-primary/50 cursor-pointer"
            onClick={() => onProblemClick(problem.id)}
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between">
                <div>
                  <CardTitle>{problem.title}</CardTitle>
                  <CardDescription className="mt-1">{problem.description}</CardDescription>
                </div>
                <div className="hidden sm:block">
                  <Badge variant={problem.severity > 7 ? "destructive" : problem.severity > 4 ? "default" : "secondary"}>
                    Rank #{problem.id}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Severity</span>
                    <span className="text-sm font-medium">{problem.severity}/10</span>
                  </div>
                  <Progress value={problem.severity * 10} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Urgency</span>
                    <span className="text-sm font-medium">{problem.urgency}/10</span>
                  </div>
                  <Progress value={problem.urgency * 10} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Solvability</span>
                    <span className="text-sm font-medium">{problem.solvability}/10</span>
                  </div>
                  <Progress 
                    value={(10 - problem.solvability) * 10} 
                    className={`h-2 ${problem.solvability < 4 ? "bg-red-200" : problem.solvability < 7 ? "bg-amber-200" : "bg-green-200"}`} 
                  />
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-4">
                {problem.categories.map(category => (
                  <Badge key={category} variant="outline">{category}</Badge>
                ))}
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-between pt-2">
              <div className="flex gap-2 text-sm text-muted-foreground">
                <span>{problem.discussions} discussions</span>
                <span>•</span>
                <span>{problem.solutions} proposed solutions</span>
              </div>
              <Button variant="ghost" size="sm" className="gap-1">
                Discuss <ChevronRight size={16} />
              </Button>
            </CardFooter>
          </Card>
        ))
      )}
    </div>
  );
};
