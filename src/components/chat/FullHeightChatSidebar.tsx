
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare, X, ChevronRight } from "lucide-react";
import { ChatInterface } from "./ChatInterface";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/auth-context";
import { trackActivity } from "@/lib/activity-tracker";
import { dispatchChatSidebarToggle } from "@/lib/utils/event-utils";

// Define type for conversation type
type ConversationType = "direct" | "group" | "global";

export const FullHeightChatSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const [conversationType, setConversationType] = useState<ConversationType>('direct');
  const { user } = useAuth();

  // Default conversation (for demo purposes - normally this would be the last active conversation)
  useEffect(() => {
    if (!selectedConversation) {
      setSelectedConversation({
        id: 'direct-user1',
        name: 'Jane Smith',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
        status: 'online',
        isOnline: true
      });
      setConversationType('direct');
    }
  }, [selectedConversation]);

  // Track chat visibility changes and notify layout
  useEffect(() => {
    if (user && isOpen) {
      trackActivity(user.id, 'view', {
        section: 'chat',
        action: 'open_sidebar',
        timestamp: new Date().toISOString()
      });
    }
    
    // Dispatch event so other components can adjust layout
    dispatchChatSidebarToggle(isOpen);
  }, [isOpen, user]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      {!isOpen && (
        <Button
          className="fixed right-5 top-20 z-50 h-10 w-10 rounded-full shadow-lg"
          onClick={toggleChat}
        >
          <MessageSquare size={20} />
        </Button>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 350 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 350 }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 right-0 bottom-0 z-50 flex flex-col bg-background border-l border-border shadow-xl w-[400px]"
          >
            <div className="bg-primary/10 p-3 flex justify-between items-center border-b">
              <div className="flex items-center">
                <MessageSquare size={18} className="mr-2 text-primary" />
                <h3 className="font-medium text-sm">
                  {selectedConversation 
                    ? `Chat with ${selectedConversation.name}` 
                    : "Select a conversation"}
                </h3>
              </div>
              <div className="flex items-center space-x-1">
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
            
            {selectedConversation && (
              <div className="flex-1 overflow-hidden">
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
                    selectedConversation.members.map((member: any) => ({
                      ...member,
                      status: member.status || 'offline'
                    })) : 
                    undefined}
                />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
