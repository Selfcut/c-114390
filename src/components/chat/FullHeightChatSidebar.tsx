
import React, { useState, useEffect } from "react";
import { ChevronLeft, MessageSquare, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { publishChatSidebarToggle } from "@/lib/utils/event-utils";
import { useAuth } from "@/lib/auth-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export const FullHeightChatSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [conversations, setConversations] = useState([
    {
      id: "1",
      name: "Global Chat",
      avatar: "/placeholder.svg",
      lastMessage: "Welcome to the Polymath community!",
      unread: 2,
      isGlobal: true
    },
    {
      id: "2", 
      name: "Philosophy Group",
      avatar: "/placeholder.svg",
      lastMessage: "What's everyone's take on existentialism?",
      unread: 0,
      isGroup: true
    }
  ]);
  const { user, isAuthenticated } = useAuth();

  // Toggle sidebar
  const toggleSidebar = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    publishChatSidebarToggle(newState);
  };

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768 && isOpen) {
        setIsOpen(false);
        publishChatSidebarToggle(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen]);

  return (
    <>
      {/* Chat toggle button (visible when sidebar is closed) */}
      {!isOpen && (
        <Button
          onClick={toggleSidebar}
          className="fixed bottom-6 right-6 rounded-full h-14 w-14 shadow-lg z-50 bg-primary hover:bg-primary/90"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      )}

      {/* Chat sidebar */}
      <aside 
        className={`fixed top-0 right-0 h-full bg-background border-l border-border w-[400px] transform transition-transform duration-300 ease-in-out z-40 shadow-lg ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="border-b p-4 flex justify-between items-center">
            <h2 className="text-lg font-semibold flex items-center">
              <MessageSquare className="mr-2 h-5 w-5" />
              Chat
            </h2>
            <Button variant="ghost" size="icon" onClick={toggleSidebar}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Chat content */}
          <div className="flex-1 flex flex-col">
            {isAuthenticated ? (
              <ScrollArea className="flex-1">
                <div className="p-4 space-y-4">
                  {conversations.map((convo) => (
                    <Card key={convo.id} className="p-3 hover:bg-accent/30 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={convo.avatar} alt={convo.name} />
                          <AvatarFallback>{convo.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center">
                            <div className="font-medium flex items-center">
                              {convo.name}
                              {convo.isGlobal && (
                                <Badge variant="secondary" className="ml-2 text-xs">Global</Badge>
                              )}
                              {convo.isGroup && (
                                <Badge variant="outline" className="ml-2 text-xs">Group</Badge>
                              )}
                            </div>
                            {convo.unread > 0 && (
                              <Badge className="bg-primary">{convo.unread}</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground truncate">
                            {convo.lastMessage}
                          </p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="flex-1 flex items-center justify-center p-6">
                <div className="text-center">
                  <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-4" />
                  <h3 className="font-medium mb-2">Sign in to chat</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Join the conversation by signing in to your account
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => window.location.href = '/auth'}
                    className="mx-auto"
                  >
                    Sign In / Register
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
