
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Eye, EyeOff, Pencil, Trash2 } from 'lucide-react';
import { Word } from '@/hooks/useWords';
import { formatDistanceToNow } from 'date-fns';

interface WordCardProps {
  word: Word;
  onDelete: (id: string) => void;
  onToggleVisibility: (id: string, isPublic: boolean) => void;
}

export const WordCard: React.FC<WordCardProps> = ({ word, onDelete, onToggleVisibility }) => {
  const truncateContent = (content: string, maxLength: number = 100) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };
  
  const timeAgo = formatDistanceToNow(new Date(word.updated_at), { addSuffix: true });

  return (
    <Card className="h-full flex flex-col overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-lg line-clamp-1">{word.title}</CardTitle>
          <Badge variant={word.is_public ? "default" : "outline"}>
            {word.is_public ? "Public" : "Private"}
          </Badge>
        </div>
        <div className="text-xs text-muted-foreground flex items-center">
          <Clock size={14} className="mr-1" />
          {timeAgo}
        </div>
      </CardHeader>
      
      <CardContent className="flex-grow pb-2">
        <div className="text-sm line-clamp-4 h-20">
          {truncateContent(word.content)}
        </div>
        
        <div className="flex flex-wrap gap-1 mt-4">
          {word.category && (
            <Badge variant="secondary" className="capitalize">
              {word.category}
            </Badge>
          )}
          
          {word.tags && word.tags.slice(0, 3).map(tag => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          
          {word.tags && word.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{word.tags.length - 3}
            </Badge>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between pt-2">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => onToggleVisibility(word.id, !word.is_public)}
          title={word.is_public ? "Make private" : "Make public"}
        >
          {word.is_public ? <EyeOff size={16} /> : <Eye size={16} />}
        </Button>
        
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(word.id)}
            title="Delete"
          >
            <Trash2 size={16} />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            asChild
            title="Edit"
          >
            <Link to={`/words/${word.id}/edit`}>
              <Pencil size={16} />
            </Link>
          </Button>
          
          <Button
            variant="default"
            size="sm"
            asChild
          >
            <Link to={`/words/${word.id}`}>View</Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
