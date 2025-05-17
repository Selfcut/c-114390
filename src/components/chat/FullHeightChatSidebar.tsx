
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, MessageSquare } from 'lucide-react';
import { useChatSidebarToggle } from '@/hooks/useChatSidebarToggle';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { Avatar } from '@/components/ui/avatar';
import { AvatarImage } from '@/components/ui/avatar';
import { AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatSidebarHeader } from './ChatSidebarHeader';
import { ChatMessageList } from './ChatMessageList';
import { ChatInputArea } from './ChatInputArea';
import { ChatMessage } from './types';

export const FullHeightChatSidebar = () => {
  const { isOpen, toggleSidebar } = useChatSidebarToggle();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

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
        conversationId: msg.conversation_id,
        userId: msg.user_id || 'anonymous',
        senderName: msg.sender_name || 'Anonymous',
        isCurrentUser: msg.user_id === user?.id
      })) || [];
      
      setMessages(formattedMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
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
    
    // Optimistically update UI
    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');
    
    try {
      // Save to database
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          content: inputMessage,
          user_id: user?.id,
          sender_name: user?.name || user?.email?.split('@')[0] || 'Anonymous',
          conversation_id: 'global' // For simplicity, using a single global conversation
        });
      
      if (error) throw error;
      
    } catch (error) {
      console.error('Error sending message:', error);
      // Remove the message if sending failed
      setMessages(prev => prev.filter(msg => msg.id !== newMessage.id));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
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
              currentUserId={user?.id}
            />
          )}
          
          <ChatInputArea 
            message={inputMessage}
            setMessage={setInputMessage}
            handleSendMessage={handleSendMessage}
            handleKeyDown={handleKeyDown}
          />
        </div>
      </div>
    </>
  );
};
