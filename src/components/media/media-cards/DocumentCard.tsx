
import React from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { FileText, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DocumentCardProps {
  url: string;
  title: string;
  className?: string;
}

export const DocumentCard: React.FC<DocumentCardProps> = ({ url, title, className }) => {
  // Determine if it's a PDF that can be embedded
  const isPdf = url.toLowerCase().endsWith('.pdf');
  
  // Open document in new tab
  const openDocument = () => {
    window.open(url, '_blank');
  };

  return (
    <Card className={cn("overflow-hidden my-4", className)}>
      {isPdf ? (
        <div className="aspect-video">
          <iframe 
            src={url} 
            title={title}
            className="w-full h-full border-0"
          />
        </div>
      ) : (
        <div className="p-6 flex flex-col items-center justify-center">
          <FileText size={64} className="text-primary mb-4" />
          <h3 className="font-medium text-lg mb-4">{title}</h3>
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={openDocument}
          >
            <ExternalLink size={16} />
            <span>Open Document</span>
          </Button>
        </div>
      )}
    </Card>
  );
};
