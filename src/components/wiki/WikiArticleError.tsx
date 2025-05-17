
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { ErrorMessage } from "@/components/ui/ErrorMessage";

interface WikiArticleErrorProps {
  error: string | null;
  onBack: () => void;
  onRetry: () => void;
}

export const WikiArticleError: React.FC<WikiArticleErrorProps> = ({ 
  error, 
  onBack, 
  onRetry 
}) => {
  return (
    <div className="container mx-auto py-8 px-4">
      <Button variant="ghost" className="mb-6" onClick={onBack}>
        <ArrowLeft size={16} className="mr-2" /> Back to Wiki
      </Button>
      
      <Card>
        <CardContent className="p-12">
          <ErrorMessage
            title="Article Not Found"
            message={error || "The article you're looking for doesn't exist or has been removed."}
            retry={onRetry}
            action={
              <Button onClick={onBack}>
                Return to Wiki
              </Button>
            }
          />
        </CardContent>
      </Card>
    </div>
  );
};
