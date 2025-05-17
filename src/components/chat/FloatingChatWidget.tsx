
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare, X, Minimize, Maximize, Send } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/auth";

type Message = {
  id: string;
  content: string;
  sender: string;
  timestamp: Date;
  isUser: boolean;
};

export const FloatingChatWidget = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! How can I help you today?",
      sender: "Assistant",
      timestamp: new Date(),
      isUser: false
    }
  ]);

  const toggleChat = () => {
    if (isOpen && isMinimized) {
      setIsMinimized(false);
    } else {
      setIsOpen(!isOpen);
      setIsMinimized(false);
    }
  };

  const handleMinimize = () => {
    setIsMinimized(true);
  };

  const handleMaximize = () => {
    setIsMinimized(false);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: message,
      sender: user?.name || "You",
      timestamp: new Date(),
      isUser: true
    };
    
    setMessages(prev => [...prev, userMessage]);
    setMessage("");
    
    // Simulate response (in a real app, this would be an API call)
    setTimeout(() => {
      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        content: "Thanks for your message! This is a demo chat widget. In a real implementation, this would connect to your backend services.",
        sender: "Assistant",
        timestamp: new Date(),
        isUser: false
      };
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      <Button
        className="fixed bottom-5 right-5 h-14 w-14 rounded-full shadow-lg"
        onClick={toggleChat}
      >
        <MessageSquare size={24} />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, height: isMinimized ? "60px" : "500px" }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              height: isMinimized ? "60px" : "500px",
              width: isMinimized ? "300px" : "350px" 
            }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-5 bg-background rounded-lg shadow-xl border overflow-hidden z-50"
          >
            <div className="bg-primary/10 p-2 flex justify-between items-center border-b">
              <div className="flex items-center">
                <MessageSquare size={18} className="mr-2 text-primary" />
                <h3 className="font-medium text-sm">Chat</h3>
              </div>
              <div className="flex items-center space-x-1">
                {isMinimized ? (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleMaximize}
                    className="h-7 w-7"
                  >
                    <Maximize size={14} />
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleMinimize}
                    className="h-7 w-7"
                  >
                    <Minimize size={14} />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleClose}
                  className="h-7 w-7"
                >
                  <X size={14} />
                </Button>
              </div>
            </div>
            
            {!isMinimized && (
              <>
                <div className="flex flex-col h-[380px] overflow-y-auto p-3 gap-3">
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
                      <div className={`flex ${msg.isUser ? 'flex-row-reverse' : 'flex-row'} gap-2 max-w-[80%]`}>
                        <Avatar className="h-8 w-8 flex-shrink-0">
                          {msg.isUser ? (
                            user?.avatar_url ? (
                              <AvatarImage src={user.avatar_url} alt="User" />
                            ) : (
                              <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
                            )
                          ) : (
                            <AvatarFallback>A</AvatarFallback>
                          )}
                        </Avatar>
                        <div className={`${msg.isUser ? 'bg-primary text-primary-foreground' : 'bg-muted'} rounded-lg p-3`}>
                          <p className="text-sm">{msg.content}</p>
                          <p className="text-xs opacity-70 mt-1">{formatTime(msg.timestamp)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t">
                  <div className="flex gap-2">
                    <Textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="resize-none h-10 min-h-0 py-2"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    <Button
                      size="icon"
                      onClick={handleSendMessage}
                      disabled={!message.trim()}
                    >
                      <Send size={16} />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
