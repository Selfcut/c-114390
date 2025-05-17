
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tag } from 'lucide-react';

interface ForumPostDetailsProps {
  discussion: {
    title: string;
    content: string;
    author: string;
    authorAvatar?: string;
    createdAt: Date;
    tags: string[];
  };
  formatTimeAgo: (date: Date) => string;
}

export const ForumPostDetails = ({ discussion, formatTimeAgo }: ForumPostDetailsProps) => {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold mb-4">{discussion.title}</h1>
      
      <div className="flex items-center gap-4 mb-6">
        <Avatar className="h-10 w-10">
          <AvatarImage src={discussion.authorAvatar} alt={discussion.author} />
          <AvatarFallback>{discussion.author.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        
        <div>
          <p className="font-medium">{discussion.author}</p>
          <p className="text-sm text-muted-foreground">
            Posted {formatTimeAgo(discussion.createdAt)}
          </p>
        </div>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <div className="prose prose-stone dark:prose-invert max-w-none">
            {discussion.content.split('\n\n').map((paragraph: string, idx: number) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>
          
          <div className="flex flex-wrap gap-2 mt-6">
            {discussion.tags.map((tag: string) => (
              <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                <Tag size={12} />
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
