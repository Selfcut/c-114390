
import React from 'react';
import { FileText, FileSpreadsheet, FilePresentationBox, FileQuestion } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DocumentCardProps {
  url: string;
  title: string;
}

export const DocumentCard = ({ url, title }: DocumentCardProps) => {
  const getDocumentIcon = () => {
    const fileExt = url.split('.').pop()?.toLowerCase();
    
    switch (fileExt) {
      case 'pdf':
        return <FileText size={48} className="text-red-500" />;
      case 'doc':
      case 'docx':
        return <FileText size={48} className="text-blue-500" />;
      case 'xls':
      case 'xlsx':
        return <FileSpreadsheet size={48} className="text-green-500" />;
      case 'ppt':
      case 'pptx':
        return <FilePresentationBox size={48} className="text-amber-500" />;
      default:
        return <FileQuestion size={48} className="text-muted-foreground" />;
    }
  };

  const getFileExtension = () => {
    return url.split('.').pop()?.toUpperCase() || 'FILE';
  };

  return (
    <div className="border rounded-md p-6 flex flex-col items-center max-w-md mx-auto">
      {getDocumentIcon()}
      <h4 className="font-medium mt-2 text-center">{title}</h4>
      <p className="text-xs text-muted-foreground mt-1 mb-3">{getFileExtension()} Document</p>
      <Button 
        variant="secondary" 
        size="sm" 
        asChild
      >
        <a href={url} target="_blank" rel="noopener noreferrer">
          View Document
        </a>
      </Button>
    </div>
  );
};
