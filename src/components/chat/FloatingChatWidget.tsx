import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare, X, Minimize, Maximize } from "lucide-react";
import { ChatInterface } from "./ChatInterface";
import { motion, AnimatePresence } from "framer-motion";

export const FloatingChatWidget = ({ currentUser }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [conversationType, setConversationType] = useState('direct');

  // Default conversation (for demo purposes - normally this would be the last active conversation)
  useEffect(() => {
    setSelectedConversation({
      id: 'direct-user1',
      name: 'Jane Smith',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
      status: 'online',
      isOnline: true
    });
    setConversationType('direct');
  }, []);

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
                <h3 className="font-medium text-sm">
                  {isMinimized 
                    ? "Chat" 
                    : selectedConversation 
                      ? `Chat with ${selectedConversation.name}` 
                      : "Select a conversation"}
                </h3>
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
            
            {!isMinimized && selectedConversation && (
              <ChatInterface
                chatType={conversationType}
                recipientId={conversationType === 'direct' ? selectedConversation.id : undefined}
                recipientName={conversationType === 'direct' ? selectedConversation.name : undefined}
                recipientAvatar={conversationType === 'direct' ? selectedConversation.avatar : undefined}
                recipientStatus={conversationType === 'direct' ? selectedConversation.status : undefined}
                groupId={conversationType === 'group' ? selectedConversation.id : undefined}
                groupName={conversationType === 'group' ? selectedConversation.name : undefined}
                groupAvatar={conversationType === 'group' ? selectedConversation.avatar : undefined}
                groupMembers={conversationType === 'group' && selectedConversation.members ? 
                  selectedConversation.members.map(member => ({
                    ...member,
                    // Add a default status for each member
                    status: 'offline'
                  })) : 
                  undefined}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
