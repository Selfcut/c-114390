
import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, MessageSquare, X, Send, SmilePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { publishChatSidebarToggle } from "@/lib/utils/event-utils";
import { useAuth } from "@/lib/auth-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  const [selectedConversation, setSelectedConversation] = useState("1"); // Default to Global Chat
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      id: "msg1",
      sender: {
        name: "System",
        avatar: "/placeholder.svg",
        isSystem: true
      },
      content: "Welcome to the Polymath Global Chat!",
      timestamp: new Date(Date.now() - 3600000)
    },
    {
      id: "msg2",
      sender: {
        name: "Alex Thompson",
        avatar: "https://api.dicebear.com/7.x/personas/svg?seed=Alex",
      },
      content: "Hi everyone! Just joined Polymath and excited to connect with fellow knowledge enthusiasts.",
      timestamp: new Date(Date.now() - 2400000)
    },
    {
      id: "msg3",
      sender: {
        name: "Maya Patel",
        avatar: "https://api.dicebear.com/7.x/personas/svg?seed=Maya",
      },
      content: "Welcome Alex! What topics are you most interested in exploring?",
      timestamp: new Date(Date.now() - 1800000)
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Emoji data for quick selection
  const emojiCategories = [
    {
      name: "Smileys",
      emojis: ["😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇"]
    },
    {
      name: "Gestures",
      emojis: ["👍", "👎", "👌", "✌️", "🤞", "🤟", "🤙", "👋", "🤚", "✋"]
    },
    {
      name: "Objects",
      emojis: ["📚", "💡", "🔍", "🧠", "📝", "📊", "🌐", "💭", "🎓", "⏱️"]
    }
  ];

  // Toggle sidebar
  const toggleSidebar = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    publishChatSidebarToggle(newState);
  };

  // Scroll to bottom on new messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;

    // Create new message
    const newMessage = {
      id: `msg${Date.now()}`,
      sender: {
        name: isAuthenticated ? (user?.name || "Anonymous User") : "Guest User",
        avatar: isAuthenticated ? (user?.avatar || "https://api.dicebear.com/7.x/personas/svg?seed=User") : "https://api.dicebear.com/7.x/personas/svg?seed=Guest",
      },
      content: message,
      timestamp: new Date()
    };

    // Add message to chat
    setMessages([...messages, newMessage]);
    setMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat("en", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(date);
  };

  const handleInsertEmoji = (emoji: string) => {
    setMessage((prev) => prev + emoji);
  };

  const handleSelectConversation = (id: string) => {
    setSelectedConversation(id);
    // In a real app, you would fetch messages for the selected conversation here
  };

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
        className={`fixed top-0 right-0 h-full bg-background border-l border-border w-[350px] transform transition-transform duration-300 ease-in-out z-40 shadow-lg flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="border-b p-3 flex justify-between items-center">
          <h2 className="text-lg font-semibold flex items-center">
            <MessageSquare className="mr-2 h-5 w-5" />
            Community Chat
          </h2>
          <Button variant="ghost" size="icon" onClick={toggleSidebar}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Conversations list */}
        <div className="border-b p-2">
          <ScrollArea className="h-[120px]">
            <div className="space-y-2">
              {conversations.map((convo) => (
                <Card 
                  key={convo.id} 
                  className={`p-2 hover:bg-accent/30 cursor-pointer ${selectedConversation === convo.id ? 'bg-accent/50' : ''}`}
                  onClick={() => handleSelectConversation(convo.id)}
                >
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={convo.avatar} alt={convo.name} />
                      <AvatarFallback>{convo.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <div className="font-medium text-sm flex items-center">
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
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Messages area */}
        <ScrollArea className="flex-1 p-3">
          <div className="space-y-3">
            {messages.map((msg) => (
              <div key={msg.id} className="flex gap-2">
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarImage src={msg.sender.avatar} />
                  <AvatarFallback>{msg.sender.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`font-medium text-sm ${msg.sender.isSystem ? 'text-primary' : ''}`}>
                      {msg.sender.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatTime(msg.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm break-words">{msg.content}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input area */}
        <div className="border-t p-3">
          <div className="flex items-end gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full flex-shrink-0">
                  <SmilePlus size={20} />
                </Button>
              </PopoverTrigger>
              <PopoverContent side="top" align="start" className="w-64 p-0">
                <Tabs defaultValue="smileys">
                  <TabsList className="grid grid-cols-3">
                    {emojiCategories.map((category) => (
                      <TabsTrigger key={category.name} value={category.name.toLowerCase()}>
                        {category.emojis[0]}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  {emojiCategories.map((category) => (
                    <TabsContent key={category.name} value={category.name.toLowerCase()} className="p-2">
                      <div className="grid grid-cols-8 gap-1">
                        {category.emojis.map((emoji) => (
                          <button
                            key={emoji}
                            className="h-8 w-8 flex items-center justify-center text-lg hover:bg-accent rounded"
                            onClick={() => handleInsertEmoji(emoji)}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </PopoverContent>
            </Popover>
            
            <Textarea
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              className="min-h-[40px] max-h-[120px] resize-none"
              rows={1}
            />
            
            <Button
              onClick={handleSendMessage}
              disabled={!message.trim()}
              size="icon"
              className="h-9 w-9 rounded-full flex-shrink-0"
            >
              <Send size={18} />
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
};
