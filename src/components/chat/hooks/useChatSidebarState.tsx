
import { useState, useEffect, useRef } from 'react';
import { ConversationItem } from '../types';

export const useChatSidebarState = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState('global');
  const [conversations, setConversations] = useState<ConversationItem[]>([
    {
      id: 'global',
      name: 'Global Chat',
      lastMessage: 'Welcome to the community!',
      isGlobal: true,
      unreadCount: 0
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const onSelectConversation = (conversationId: string) => {
    setSelectedConversation(conversationId);
  };

  useEffect(() => {
    // Auto-scroll when new messages arrive
    scrollToBottom();
  }, []);

  return {
    isOpen,
    setIsOpen,
    selectedConversation,
    setSelectedConversation,
    conversations,
    setConversations,
    messagesEndRef,
    scrollToBottom,
    onSelectConversation
  };
};
