
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare, X, Smile, PaperclipIcon, SendIcon } from "lucide-react";
import { useChatSidebarToggle } from "@/hooks/useChatSidebarToggle";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Avatar } from "@/components/ui/avatar";
import { AvatarImage } from "@/components/ui/avatar";
import { AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatSidebarHeader } from "./ChatSidebarHeader";
import { ChatMessageList } from "./ChatMessageList";
import { ChatInputArea } from "./ChatInputArea";
import { ChatMessage } from "./types";
import { toast } from "sonner";

export const FullHeightChatSidebar = () => {
  const { isOpen, toggleSidebar } = useChatSidebarToggle();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [replyingToMessage, setReplyingToMessage] = useState<{
    id: string;
    content: string;
    senderName: string;
  } | null>(null);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Set up real-time subscription for chat messages
  useEffect(() => {
    if (!isOpen) return;

    const channel = supabase
      .channel('public:chat_messages')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'chat_messages' }, 
        (payload) => {
          const newMessage = payload.new as any;
          const chatMessage: ChatMessage = {
            id: newMessage.id,
            content: newMessage.content,
            createdAt: newMessage.created_at,
            conversationId: newMessage.conversation_id,
            userId: newMessage.user_id || 'anonymous',
            senderName: newMessage.sender_name || 'Anonymous',
            isCurrentUser: newMessage.user_id === user?.id
          };
          
          setMessages(prev => [...prev, chatMessage]);
          setTimeout(scrollToBottom, 100);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isOpen, user]);

  // Fetch messages when the sidebar is opened
  useEffect(() => {
    if (isOpen) {
      fetchMessages();
    }
  }, [isOpen]);

  const fetchMessages = async () => {
    if (!isOpen) return;
    
    setIsLoadingMessages(true);
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(50);
      
      if (error) throw error;
      
      const formattedMessages: ChatMessage[] = data?.map(msg => ({
        id: msg.id,
        content: msg.content,
        createdAt: msg.created_at,
        conversationId: msg.conversation_id || 'global',
        userId: msg.user_id || 'anonymous',
        senderName: msg.sender_name || 'Anonymous',
        isCurrentUser: msg.user_id === user?.id
      })) || [];
      
      setMessages(formattedMessages);
      setTimeout(scrollToBottom, 100);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    const newMessage: ChatMessage = {
      id: crypto.randomUUID(),
      content: inputMessage,
      createdAt: new Date().toISOString(),
      conversationId: 'global', // For simplicity, using a single global conversation
      userId: user?.id || 'anonymous',
      senderName: user?.name || user?.email?.split('@')[0] || 'Anonymous',
      isCurrentUser: true
    };
    
    // If replying to another message
    if (replyingToMessage) {
      newMessage.replyTo = {
        id: replyingToMessage.id,
        content: replyingToMessage.content,
        sender: { name: replyingToMessage.senderName }
      };
    }
    
    // Clear input and reply state
    setInputMessage('');
    setReplyingToMessage(null);
    
    try {
      // Save to database
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          content: inputMessage,
          user_id: user?.id,
          sender_name: user?.name || user?.email?.split('@')[0] || 'Anonymous',
          conversation_id: 'global', // For simplicity, using a single global conversation
          // Include reply info if applicable
          ...(replyingToMessage ? { 
            reply_to: replyingToMessage.id 
          } : {})
        });
      
      if (error) throw error;
      
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  const handleEditMessage = (messageId: string) => {
    const message = messages.find(msg => msg.id === messageId);
    if (message && message.isCurrentUser) {
      setEditingMessageId(messageId);
      setInputMessage(message.content);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('chat_messages')
        .delete()
        .eq('id', messageId)
        .eq('user_id', user?.id); // Only allow users to delete their own messages
      
      if (error) throw error;
      
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
      toast.success('Message deleted');
    } catch (error) {
      console.error('Error deleting message:', error);
      toast.error('Failed to delete message');
    }
  };

  const handleReplyToMessage = (messageId: string) => {
    const message = messages.find(msg => msg.id === messageId);
    if (message) {
      setReplyingToMessage({
        id: message.id,
        content: message.content,
        senderName: message.senderName
      });
    }
  };

  const handleReactionAdd = async (messageId: string, emoji: string) => {
    // In a real app, this would update a reactions table in the database
    // For now we'll just update the local state
    setMessages(prev => 
      prev.map(msg => {
        if (msg.id === messageId) {
          const existingReactions = msg.reactions || [];
          const existingReaction = existingReactions.find(r => r.emoji === emoji);
          
          let updatedReactions;
          if (existingReaction) {
            // Increase count if reaction exists
            updatedReactions = existingReactions.map(r => 
              r.emoji === emoji 
                ? { ...r, count: r.count + 1, users: [...r.users, user?.id || 'anonymous'] }
                : r
            );
          } else {
            // Add new reaction type
            updatedReactions = [
              ...existingReactions, 
              { emoji, count: 1, users: [user?.id || 'anonymous'] }
            ];
          }
          
          return { ...msg, reactions: updatedReactions };
        }
        return msg;
      })
    );
  };

  const handleReactionRemove = async (messageId: string, emoji: string) => {
    // Similar to add, but removing the reaction
    setMessages(prev => 
      prev.map(msg => {
        if (msg.id === messageId && msg.reactions) {
          const updatedReactions = msg.reactions.map(r => {
            if (r.emoji === emoji && r.users.includes(user?.id || 'anonymous')) {
              return {
                ...r,
                count: Math.max(0, r.count - 1),
                users: r.users.filter(id => id !== user?.id)
              };
            }
            return r;
          }).filter(r => r.count > 0);
          
          return { ...msg, reactions: updatedReactions };
        }
        return msg;
      })
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const cancelEdit = () => {
    setEditingMessageId(null);
    setInputMessage('');
  };

  const cancelReply = () => {
    setReplyingToMessage(null);
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

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
        className={`fixed top-0 right-0 h-screen bg-background border-l border-border shadow-lg transition-all duration-300 z-40 flex flex-col ${
          isOpen ? 'translate-x-0 w-[var(--chat-sidebar-width)]' : 'translate-x-full w-0'
        }`}
      >
        <ChatSidebarHeader toggleSidebar={toggleSidebar} />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          {isLoadingMessages ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <ChatMessageList 
              messages={messages}
              isLoading={false}
              formatTime={formatTime}
              onMessageEdit={handleEditMessage}
              onMessageDelete={handleDeleteMessage}
              onMessageReply={handleReplyToMessage}
              onReactionAdd={handleReactionAdd}
              onReactionRemove={handleReactionRemove}
              currentUserId={user?.id}
            />
          )}
          
          <ChatInputArea 
            message={inputMessage}
            setMessage={setInputMessage}
            handleSendMessage={handleSendMessage}
            handleKeyDown={handleKeyDown}
            editingMessage={editingMessageId}
            replyingToMessage={replyingToMessage}
            onCancelEdit={cancelEdit}
            onCancelReply={cancelReply}
          />
        </div>
      </div>
    </>
  );
};
