
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, MessageSquare } from 'lucide-react';
import { useChatSidebarToggle } from '@/hooks/useChatSidebarToggle';

export const FullHeightChatSidebar = () => {
  const { isOpen, toggleSidebar } = useChatSidebarToggle();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      {/* Collapsed button that's always visible when chat is closed */}
      {!isOpen && (
        <Button
          onClick={toggleSidebar}
          className="fixed right-4 bottom-4 h-12 w-12 rounded-full shadow-md z-40 bg-primary hover:bg-primary/90"
          aria-label="Open chat"
        >
          <MessageSquare size={20} />
        </Button>
      )}
      
      {/* Expanded sidebar */}
      <div 
        className={`fixed top-0 right-0 h-screen bg-background border-l border-border shadow-lg transition-all duration-300 z-40 ${
          isOpen ? 'translate-x-0 w-[var(--chat-sidebar-width)]' : 'translate-x-full w-0'
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h3 className="font-semibold">Community Chat</h3>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={toggleSidebar}
              aria-label="Close chat"
            >
              <ChevronLeft size={18} />
            </Button>
          </div>
          
          <div className="flex-1 overflow-auto p-4">
            <div className="flex flex-col h-full">
              <div className="flex-1 pb-4">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center h-40">
                    <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-2 text-sm text-muted-foreground">Loading chat...</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="h-14 w-14 bg-primary/10 text-primary flex items-center justify-center rounded-full mb-4">
                      <MessageSquare size={28} />
                    </div>
                    <h3 className="text-lg font-medium mb-2">Live Chat</h3>
                    <p className="text-sm text-muted-foreground max-w-[240px] mx-auto mb-6">
                      Connect with other community members in real-time discussions.
                    </p>
                    <Button 
                      onClick={() => setIsLoading(true)}
                      className="w-full mb-2"
                    >
                      Start a New Conversation
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => setIsLoading(true)}
                      className="w-full"
                    >
                      Browse Active Chats
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
