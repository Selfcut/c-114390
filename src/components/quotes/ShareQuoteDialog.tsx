
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Check, Twitter, Facebook, Linkedin, Mail, Link } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { QuoteWithUser } from '@/lib/quotes/types';
import { trackEvent } from '@/lib/analytics';

interface ShareQuoteDialogProps {
  quote: QuoteWithUser;
  isOpen: boolean;
  onClose: () => void;
}

export function ShareQuoteDialog({ quote, isOpen, onClose }: ShareQuoteDialogProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('links');

  const quoteText = `"${quote.text}" - ${quote.author}`;
  const quoteUrl = `${window.location.origin}/quotes/${quote.id}`;

  const handleCopyQuote = () => {
    navigator.clipboard.writeText(quoteText);
    setCopied(true);
    toast({
      title: 'Copied to clipboard',
      description: 'The quote has been copied to your clipboard',
    });
    
    // Track this event
    trackEvent('share_content', {
      contentType: 'quote',
      contentId: quote.id,
      shareMethod: 'copy_text'
    });
    
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(quoteUrl);
    setCopied(true);
    toast({
      title: 'Copied to clipboard',
      description: 'The link has been copied to your clipboard',
    });
    
    // Track this event
    trackEvent('share_content', {
      contentType: 'quote',
      contentId: quote.id,
      shareMethod: 'copy_link'
    });
    
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSocialShare = (platform: string) => {
    let shareUrl = '';
    const encodedText = encodeURIComponent(quoteText);
    const encodedUrl = encodeURIComponent(quoteUrl);

    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=Check%20out%20this%20quote&body=${encodedText}%0A%0A${encodedUrl}`;
        break;
    }

    // Track this event
    trackEvent('share_content', {
      contentType: 'quote',
      contentId: quote.id,
      shareMethod: platform
    });

    if (shareUrl) {
      window.open(shareUrl, '_blank');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share this quote</DialogTitle>
          <DialogDescription>
            Choose how you want to share this inspiring quote.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="links" className="w-full" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="links">Share Links</TabsTrigger>
            <TabsTrigger value="social">Social Media</TabsTrigger>
          </TabsList>
          
          <TabsContent value="links" className="space-y-4">
            <div className="space-y-2">
              <div className="font-medium text-sm">Quote Text</div>
              <div className="rounded-md bg-muted p-3 text-sm italic">
                {quoteText}
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full flex items-center justify-center gap-2"
                onClick={handleCopyQuote}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                Copy Quote
              </Button>
            </div>
            
            <div className="space-y-2">
              <div className="font-medium text-sm">Quote Link</div>
              <div className="flex gap-2">
                <Input 
                  value={quoteUrl}
                  readOnly 
                  onClick={(e) => e.currentTarget.select()} 
                />
                <Button 
                  size="icon" 
                  variant="secondary"
                  onClick={handleCopyLink}
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="social" className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                className="flex items-center gap-2 h-10"
                onClick={() => handleSocialShare('twitter')}
              >
                <Twitter className="h-4 w-4 text-blue-500" />
                Twitter
              </Button>
              <Button 
                variant="outline" 
                className="flex items-center gap-2 h-10"
                onClick={() => handleSocialShare('facebook')}
              >
                <Facebook className="h-4 w-4 text-blue-700" />
                Facebook
              </Button>
              <Button 
                variant="outline" 
                className="flex items-center gap-2 h-10"
                onClick={() => handleSocialShare('linkedin')}
              >
                <Linkedin className="h-4 w-4 text-blue-800" />
                LinkedIn
              </Button>
              <Button 
                variant="outline" 
                className="flex items-center gap-2 h-10"
                onClick={() => handleSocialShare('email')}
              >
                <Mail className="h-4 w-4 text-gray-600" />
                Email
              </Button>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end mt-4">
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
