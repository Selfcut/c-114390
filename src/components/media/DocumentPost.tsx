
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Download } from 'lucide-react';

interface DocumentPostProps {
  url: string;
  title: string;
  className?: string;
}

export const DocumentPost: React.FC<DocumentPostProps> = ({ url, title, className = "" }) => {
  return (
    <div className={`relative aspect-video bg-muted/30 rounded-lg flex items-center justify-center p-8 ${className}`}>
      <div className="text-center space-y-4">
        <div className="bg-primary/10 p-6 rounded-full inline-flex">
          <FileText className="h-12 w-12 text-primary" />
        </div>
        <div className="space-y-2">
          <h3 className="font-semibold text-lg">{title}</h3>
          <div className="flex gap-2 justify-center">
            <Button asChild variant="default">
              <a href={url} target="_blank" rel="noopener noreferrer">
                View Document
              </a>
            </Button>
            <Button asChild variant="outline">
              <a href={url} download>
                <Download className="w-4 h-4 mr-2" />
                Download
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
