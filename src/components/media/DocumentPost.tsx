
import React from 'react';
import { FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DocumentPostProps {
  url: string;
  title: string;
}

export const DocumentPost = ({ url, title }: DocumentPostProps) => {
  // Get file extension
  const getFileExtension = () => {
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      const extension = pathname.split('.').pop()?.toLowerCase() || 'doc';
      return extension;
    } catch (e) {
      return 'doc';
    }
  };
  
  // Get document type label based on extension
  const getDocumentType = () => {
    const ext = getFileExtension();
    
    switch (ext) {
      case 'pdf':
        return 'PDF Document';
      case 'doc':
      case 'docx':
        return 'Word Document';
      case 'xls':
      case 'xlsx':
        return 'Excel Spreadsheet';
      case 'ppt':
      case 'pptx':
        return 'PowerPoint Presentation';
      default:
        return 'Document';
    }
  };

  return (
    <div className="w-full aspect-video bg-muted/30 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 bg-primary/10 flex items-center justify-center rounded-full mb-4">
        <FileText className="h-8 w-8 text-primary" />
      </div>
      <h3 className="text-lg font-medium mb-2 line-clamp-1">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4">{getDocumentType()}</p>
      <Button asChild size="sm">
        <a href={url} target="_blank" rel="noopener noreferrer">
          View Document
        </a>
      </Button>
    </div>
  );
};
