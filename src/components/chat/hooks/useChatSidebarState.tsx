
import { useState, useEffect, useRef } from 'react';
import { ConversationItem } from '../types';

interface UseChatSidebarStateProps {
  isOpen?: boolean;
  messagesEndRef?: React.RefObject<HTMLDivElement>;
}

export const useChatSidebarState = (props?: UseChatSidebarStateProps) => {
  const [isOpen, setIsOpen] = useState(props?.isOpen || false);
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
  const messagesEndRef = props?.messagesEndRef || useRef<HTMLDivElement>(null);

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
