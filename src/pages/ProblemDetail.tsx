
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Share2, AlertTriangle, Users, Lightbulb, MessageSquare } from 'lucide-react';
import { PageLayout } from '@/components/layouts/PageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { problemsData } from '@/data/problemsData';

// Placeholder component for Problem Discussions
const ProblemDiscussions = () => (
  <Card>
    <CardHeader>
      <div className="flex items-center gap-2">
        <MessageSquare size={18} />
        <h2 className="text-xl font-semibold">Discussion</h2>
      </div>
    </CardHeader>
    <CardContent className="text-center py-12">
      <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <MessageSquare size={24} className="text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium mb-2">Start the conversation</h3>
      <p className="text-muted-foreground mb-4 max-w-md mx-auto">
        Be the first to share your thoughts on this global problem and possible solutions
      </p>
      <Button>Start Discussion</Button>
    </CardContent>
  </Card>
);

const ProblemDetail = () => {
  const { problemId } = useParams();
  const navigate = useNavigate();
  
  const problem = problemsData.find(p => p.id === Number(problemId));
  
  // Handle case where problem is not found
  if (!problem) {
    return (
      <PageLayout>
        <div className="container mx-auto py-8 px-4">
          <Button variant="ghost" onClick={() => navigate('/problems')}>
            <ArrowLeft size={16} className="mr-2" /> Back to Problems
          </Button>
          
          <div className="text-center py-12 mt-8">
            <AlertTriangle size={48} className="mx-auto mb-4 text-muted-foreground" />
            <h1 className="text-2xl font-bold mb-2">Problem Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The problem you're looking for doesn't exist or has been removed
            </p>
            <Button onClick={() => navigate('/problems')}>View All Problems</Button>
          </div>
        </div>
      </PageLayout>
    );
  }
  
  return (
    <PageLayout>
      <div className="container mx-auto py-8 px-4">
        <Button variant="ghost" onClick={() => navigate('/problems')}>
          <ArrowLeft size={16} className="mr-2" /> Back to Problems
        </Button>
        
        <div className="mt-6">
          <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
            <div>
              <Badge variant={problem.severity > 7 ? "destructive" : "default"} className="mb-2">
                Rank #{problem.id}
              </Badge>
              <h1 className="text-3xl font-bold mb-2">{problem.title}</h1>
              <p className="text-lg text-muted-foreground">{problem.description}</p>
            </div>
            
            <Button variant="outline" size="sm" className="gap-1">
              <Share2 size={16} /> Share
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle size={18} className="text-red-500" />
                  <h3 className="font-semibold">Severity</h3>
                </div>
                <div className="text-3xl font-bold mb-2">{problem.severity}/10</div>
                <Progress value={problem.severity * 10} className="h-2 mb-2" />
                <p className="text-sm text-muted-foreground">
                  How significant the negative impact of this problem is
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <Users size={18} className="text-amber-500" />
                  <h3 className="font-semibold">Urgency</h3>
                </div>
                <div className="text-3xl font-bold mb-2">{problem.urgency}/10</div>
                <Progress value={problem.urgency * 10} className="h-2 mb-2" />
                <p className="text-sm text-muted-foreground">
                  How quickly this problem needs to be addressed
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <Lightbulb size={18} className="text-green-500" />
                  <h3 className="font-semibold">Solvability</h3>
                </div>
                <div className="text-3xl font-bold mb-2">{problem.solvability}/10</div>
                <Progress 
                  value={problem.solvability * 10} 
                  className="h-2 mb-2" 
                />
                <p className="text-sm text-muted-foreground">
                  How feasible it is to make progress on this problem (10 = very solvable)
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">About This Problem</h2>
            <div className="prose dark:prose-invert max-w-none">
              <p>{problem.longDescription}</p>
            </div>
            
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {problem.categories.map(category => (
                  <Badge key={category} variant="outline">{category}</Badge>
                ))}
              </div>
            </div>
          </div>
          
          {/* Discussion section */}
          <div className="mb-8">
            <ProblemDiscussions />
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default ProblemDetail;
