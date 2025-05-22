
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent,
  CardFooter, 
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Calendar, 
  Eye, 
  EyeOff, 
  Pencil, 
  Trash2 
} from 'lucide-react';
import { Word } from '@/hooks/useWords';
import { format } from 'date-fns';

interface WordDetailProps {
  word: Word;
  onDelete: (id: string) => void;
  onToggleVisibility: (id: string, isPublic: boolean) => void;
  isCurrentUser: boolean;
}

export const WordDetail: React.FC<WordDetailProps> = ({ 
  word,
  onDelete,
  onToggleVisibility,
  isCurrentUser
}) => {
  const navigate = useNavigate();
  
  const formattedDate = format(new Date(word.created_at), 'MMMM d, yyyy');
  
  const formattedContent = word.content.split('\n').map((line, i) => (
    <React.Fragment key={i}>
      {line}
      <br />
    </React.Fragment>
  ));

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/words')}
            className="mb-2"
          >
            <ArrowLeft size={16} className="mr-2" /> Back to all writings
          </Button>
          
          {isCurrentUser && (
            <Button 
              variant={word.is_public ? "default" : "outline"}
              size="sm"
              onClick={() => onToggleVisibility(word.id, !word.is_public)}
              className="mb-2"
            >
              {word.is_public ? (
                <>
                  <Eye size={16} className="mr-2" /> Public
                </>
              ) : (
                <>
                  <EyeOff size={16} className="mr-2" /> Private
                </>
              )}
            </Button>
          )}
        </div>
        
        <CardTitle className="text-3xl font-bold">{word.title}</CardTitle>
        
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Calendar size={14} className="mr-1" />
            {formattedDate}
          </div>
          
          <Badge variant="secondary" className="capitalize">
            {word.category}
          </Badge>
          
          {word.tags && word.tags.map(tag => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="prose dark:prose-invert max-w-none">
          {formattedContent}
        </div>
      </CardContent>
      
      {isCurrentUser && (
        <CardFooter className="flex justify-end gap-2">
          <Button 
            variant="destructive" 
            size="sm"
            onClick={() => {
              if (confirm('Are you sure you want to delete this writing?')) {
                onDelete(word.id);
              }
            }}
          >
            <Trash2 size={16} className="mr-2" /> Delete
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate(`/words/${word.id}/edit`)}
          >
            <Pencil size={16} className="mr-2" /> Edit
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};
