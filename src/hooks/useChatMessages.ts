
import { useState, useCallback } from 'react';
import { useAuth } from '@/lib/auth';
import { ChatMessage } from '@/components/chat/types';
import { formatTime } from '@/components/chat/utils/formatTime';
import { useToast } from '@/hooks/use-toast';

export const useChatMessages = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  const fetchMessages = useCallback(async (conversationId: string) => {
    setIsLoadingMessages(true);
    try {
      // Simulate API call with mock data
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockMessages: ChatMessage[] = [
        {
          id: '1',
          content: 'Welcome to the community chat!',
          senderName: 'System',
          userId: 'system',
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          isCurrentUser: false,
          conversationId,
          effectType: 'announcement'
        },
        {
          id: '2',
          content: 'Hello everyone! Great to be here.',
          senderName: user?.name || 'User',
          userId: user?.id || 'user1',
          createdAt: new Date(Date.now() - 1800000).toISOString(),
          isCurrentUser: true,
          conversationId
        }
      ];
      
      setMessages(mockMessages);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive"
      });
    } finally {
      setIsLoadingMessages(false);
    }
  }, [user, toast]);

  const sendMessage = useCallback(async (
    content: string, 
    conversationId: string, 
    replyToId?: string
  ) => {
    if (!user || !content.trim()) return;

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      content: content.trim(),
      senderName: user.name || user.username || 'Anonymous',
      userId: user.id,
      createdAt: new Date().toISOString(),
      isCurrentUser: true,
      conversationId,
      replyTo: replyToId
    };

    setMessages(prev => [...prev, newMessage]);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 200));
      console.log('Message sent successfully');
    } catch (error) {
      console.error('Failed to send message:', error);
      // Remove message on error
      setMessages(prev => prev.filter(msg => msg.id !== newMessage.id));
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    }
  }, [user, toast]);

  const addMessage = useCallback((message: ChatMessage) => {
    setMessages(prev => [...prev, message]);
  }, []);

  return {
    messages,
    isLoadingMessages,
    fetchMessages,
    sendMessage,
    addMessage
  };
};
