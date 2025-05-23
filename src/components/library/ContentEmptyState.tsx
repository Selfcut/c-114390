
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Image, MessageSquare, BookOpen, Users, Brain, RefreshCw } from 'lucide-react';
import { ContentType } from '@/types/unified-content-types';

interface ContentEmptyStateProps {
  contentType: ContentType;
  onRefresh: () => void;
  onCreateContent?: () => void;
}

export const ContentEmptyState: React.FC<ContentEmptyStateProps> = ({
  contentType,
  onRefresh,
  onCreateContent
}) => {
  const getEmptyStateConfig = () => {
    switch (contentType) {
      case ContentType.Quote:
        return {
          icon: <FileText className="h-16 w-16 text-gray-300" />,
          title: "No quotes found",
          description: "Be the first to share an inspiring quote with the community.",
          actionText: "Share a Quote"
        };
      case ContentType.Media:
        return {
          icon: <Image className="h-16 w-16 text-gray-300" />,
          title: "No media found",
          description: "Upload images, videos, or documents to share with others.",
          actionText: "Upload Media"
        };
      case ContentType.Forum:
        return {
          icon: <MessageSquare className="h-16 w-16 text-gray-300" />,
          title: "No forum posts found",
          description: "Start a discussion or ask a question to engage with the community.",
          actionText: "Create Post"
        };
      case ContentType.Knowledge:
        return {
          icon: <BookOpen className="h-16 w-16 text-gray-300" />,
          title: "No knowledge entries found",
          description: "Share your expertise by creating detailed knowledge articles.",
          actionText: "Create Article"
        };
      case ContentType.AI:
        return {
          icon: <Brain className="h-16 w-16 text-gray-300" />,
          title: "No AI content found",
          description: "Generate content using AI or explore AI-powered features.",
          actionText: "Generate Content"
        };
      default:
        return {
          icon: <Users className="h-16 w-16 text-gray-300" />,
          title: "No content found",
          description: "No content matches your current filters. Try adjusting your search criteria.",
          actionText: "Create Content"
        };
    }
  };

  const config = getEmptyStateConfig();

  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12">
        {config.icon}
        <h3 className="text-xl font-semibold text-gray-700 mt-4 mb-2">
          {config.title}
        </h3>
        <p className="text-gray-500 text-center mb-6 max-w-md">
          {config.description}
        </p>
        <div className="flex gap-3">
          <Button onClick={onRefresh} variant="outline" className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          {onCreateContent && (
            <Button onClick={onCreateContent}>
              {config.actionText}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
