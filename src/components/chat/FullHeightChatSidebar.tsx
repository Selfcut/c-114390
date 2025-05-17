
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, MessageSquare } from 'lucide-react';

export const FullHeightChatSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Collapsed button that's always visible */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed right-4 bottom-4 h-12 w-12 rounded-full shadow-md z-40 bg-primary hover:bg-primary/90"
          aria-label="Open chat"
        >
          <MessageSquare size={20} />
        </Button>
      )}
      
      {/* Expanded sidebar */}
      <div 
        className={`fixed top-0 right-0 h-screen bg-background border-l shadow-lg transition-all duration-300 z-40 ${
          isOpen ? 'translate-x-0 w-80' : 'translate-x-full w-0'
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="p-4 border-b flex items-center justify-between">
            <h3 className="font-semibold">Chat</h3>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
            >
              <ChevronRight size={18} />
            </Button>
          </div>
          
          {/* Chat content would go here */}
          <div className="flex-1 overflow-auto p-4">
            <div className="space-y-4">
              <div className="flex justify-center py-8">
                <div className="text-center">
                  <div className="h-12 w-12 bg-primary/10 text-primary flex items-center justify-center rounded-full mx-auto mb-4">
                    <MessageSquare size={24} />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Chat Coming Soon</h3>
                  <p className="text-sm text-muted-foreground max-w-[200px] mx-auto">
                    Real-time messaging will be available in a future update.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
