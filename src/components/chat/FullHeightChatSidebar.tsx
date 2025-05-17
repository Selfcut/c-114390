
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare, X } from "lucide-react";
import { useChatSidebarToggle } from "@/hooks/useChatSidebarToggle";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatSidebarHeader } from "./ChatSidebarHeader";
import { ChatMessageList } from "./ChatMessageList";
import { ChatInputArea } from "./ChatInputArea";
import { ChatMessage } from "./types";
import { toast } from "sonner";
import { scheduleAutomatedMessages, getRandomAutomatedMessage } from "./AutomatedMessages";
import confetti from 'canvas-confetti';

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
  const [isAdmin, setIsAdmin] = useState(false); // For demo purposes. In real app, check user roles

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Check if user is admin
  useEffect(() => {
    // For demo purposes, we'll consider any user with email containing "admin" as an admin
    // In a real application, this would be a proper role check
    if (user?.email?.includes('admin')) {
      setIsAdmin(true);
    }
  }, [user]);

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
            isCurrentUser: newMessage.user_id === user?.id,
            isAdmin: newMessage.is_admin || false, // Corrected: using is_admin from database
            effectType: newMessage.effect_type // Corrected: using effect_type from database
          };
          
          setMessages(prev => [...prev, chatMessage]);
          
          // If there's a special effect, handle it
          if (chatMessage.effectType) {
            handleSpecialEffect(chatMessage.effectType);
          }
          
          setTimeout(scrollToBottom, 100);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isOpen, user]);

  // Schedule automated messages
  useEffect(() => {
    if (!isOpen) return;
    
    // Add an initial message when chat is first opened
    if (messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: `welcome-${Date.now()}`,
        content: "Welcome to the chat! This is a space to discuss consciousness, philosophy, and STEM topics. I'll occasionally share interesting facts and insights. Feel free to join the conversation!",
        senderName: "Neural Network",
        userId: "system",
        createdAt: new Date().toISOString(),
        isSystem: true
      };
      
      setMessages([welcomeMessage]);
      
      // Add a first automated message after 10 seconds
      setTimeout(() => {
        const firstAutomatedMessage = getRandomAutomatedMessage();
        setMessages(prev => [...prev, firstAutomatedMessage]);
      }, 10000);
    }
    
    // Schedule recurring automated messages
    const cleanup = scheduleAutomatedMessages((msg) => {
      setMessages(prev => [...prev, msg]);
      setTimeout(scrollToBottom, 100);
    }, 60000, 180000); // Between 1-3 minutes
    
    return cleanup;
  }, [isOpen, messages.length]);

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
        isCurrentUser: msg.user_id === user?.id,
        isAdmin: msg.is_admin || false, // Corrected: using is_admin from database
        effectType: msg.effect_type // Corrected: using effect_type from database
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

  // Handle special effects for admin messages
  const handleSpecialEffect = (effectType: string) => {
    switch (effectType) {
      case 'confetti':
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
        break;
      case 'shake':
        const chatContainer = document.querySelector('.chat-container');
        if (chatContainer) {
          chatContainer.classList.add('shake-animation');
          setTimeout(() => {
            chatContainer.classList.remove('shake-animation');
          }, 1000);
        }
        break;
      // Additional effects could be implemented here
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
      isCurrentUser: true,
      isAdmin: isAdmin
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
          is_admin: isAdmin,
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

  const handleAdminEffectSelect = async (effectType: string, content?: string) => {
    if (!isAdmin) return;
    
    const messageContent = content || inputMessage;
    if (!messageContent.trim()) return;
    
    try {
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          content: messageContent,
          user_id: user?.id,
          sender_name: user?.name || user?.email?.split('@')[0] || 'Anonymous',
          conversation_id: 'global',
          is_admin: true,
          effect_type: effectType
        });
      
      if (error) throw error;
      
      // Clear input if we used it
      if (!content) {
        setInputMessage('');
      }
      
      // Apply effect locally too
      handleSpecialEffect(effectType);
      
    } catch (error) {
      console.error('Error sending admin message:', error);
      toast.error('Failed to send message with effect');
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
    setMessages(prev => 
      prev.map(msg => {
        if (msg.id === messageId) {
          const existingReactions = msg.reactions || [];
          const existingReaction = existingReactions.find(r => r.emoji === emoji);
          
          let updatedReactions;
          if (existingReaction) {
            // Increase count if reaction exists and user hasn't already reacted
            if (!existingReaction.users.includes(user?.id || 'anonymous')) {
              updatedReactions = existingReactions.map(r => 
                r.emoji === emoji 
                  ? { ...r, count: r.count + 1, users: [...r.users, user?.id || 'anonymous'] }
                  : r
              );
            } else {
              // User already reacted with this emoji
              updatedReactions = existingReactions;
            }
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

  const handleEmojiSelect = (emoji: string) => {
    setInputMessage(inputMessage + emoji);
  };

  const handleGifSelect = (gif: { url: string; alt: string }) => {
    const gifMarkdown = `![${gif.alt}](${gif.url})`;
    setInputMessage(inputMessage + " " + gifMarkdown);
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
        className={`fixed top-0 right-0 h-screen bg-background border-l border-border shadow-lg transition-all duration-300 z-40 flex flex-col chat-container ${
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
            <ScrollArea className="flex-1">
              <ChatMessageList 
                messages={messages}
                isLoading={isLoading}
                formatTime={formatTime}
                onMessageEdit={handleEditMessage}
                onMessageDelete={handleDeleteMessage}
                onMessageReply={handleReplyToMessage}
                onReactionAdd={handleReactionAdd}
                onReactionRemove={handleReactionRemove}
                currentUserId={user?.id}
                messagesEndRef={messagesEndRef}
              />
            </ScrollArea>
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
            onEmojiSelect={handleEmojiSelect}
            onGifSelect={handleGifSelect}
            isAdmin={isAdmin}
            onAdminEffectSelect={handleAdminEffectSelect}
          />
        </div>
        
        {/* Add some CSS for our shake animation */}
        <style>
          {`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
          }
          .shake-animation {
            animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
          }
          `}
        </style>
      </div>
    </>
  );
};

