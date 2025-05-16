
import { FileText, Download, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DocumentCardProps {
  url: string;
  title: string;
}

export const DocumentCard = ({ url, title }: DocumentCardProps) => {
  const isPDF = url.toLowerCase().endsWith(".pdf");
  
  const getFileIconClass = () => {
    if (url.toLowerCase().endsWith(".pdf")) return "text-red-500";
    if (url.toLowerCase().endsWith(".doc") || url.toLowerCase().endsWith(".docx")) return "text-blue-500";
    if (url.toLowerCase().endsWith(".xls") || url.toLowerCase().endsWith(".xlsx")) return "text-green-500";
    if (url.toLowerCase().endsWith(".ppt") || url.toLowerCase().endsWith(".pptx")) return "text-orange-500";
    return "text-gray-500";
  };
  
  const getFileName = () => {
    try {
      const urlParts = new URL(url).pathname.split("/");
      return urlParts[urlParts.length - 1];
    } catch (e) {
      return url.split("/").pop() || "document";
    }
  };

  if (isPDF) {
    return (
      <div className="rounded-md overflow-hidden border">
        <div className="aspect-[4/3] overflow-hidden">
          <object
            data={url}
            type="application/pdf"
            className="w-full h-full"
          >
            <div className="w-full h-full flex items-center justify-center bg-muted p-8">
              <div className="text-center">
                <FileText className="h-10 w-10 mx-auto mb-2 text-red-500" />
                <p className="mb-4">PDF preview not available</p>
                <div className="flex gap-2 justify-center">
                  <Button size="sm" asChild>
                    <a href={url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Open PDF
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </object>
        </div>
      </div>
    );
  }
  
  return (
    <div className="rounded-md border p-6">
      <div className="flex flex-col items-center text-center">
        <FileText className={`h-16 w-16 mb-4 ${getFileIconClass()}`} />
        <h3 className="font-medium mb-2">{getFileName()}</h3>
        <p className="text-sm text-muted-foreground mb-4">
          {title}
        </p>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" asChild>
            <a href={url} download>
              <Download className="mr-2 h-4 w-4" />
              Download
            </a>
          </Button>
          <Button size="sm" asChild>
            <a href={url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" />
              Open
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
};
