
import React, { useState, useEffect } from 'react';
import { ChatMessage } from './types';
import { MessageBubble } from './MessageBubble';
import { ChatInputSection } from './ChatInputSection';
import { useAuth } from '@/lib/auth';
import { useChatMessages } from '@/hooks/useChatMessages';
import { Loader2, Send, MessageCircle } from 'lucide-react';

export const ChatSidebar = () => {
  const { user } = useAuth();
  const { messages, isLoadingMessages, fetchMessages, sendMessage, addMessage } = useChatMessages();
  const [inputMessage, setInputMessage] = useState('');
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [replyingToMessage, setReplyingToMessage] = useState<{
    id: string;
    content: string;
    senderName: string;
  } | null>(null);
  const [isSending, setIsSending] = useState(false);

  // Fetch messages when component mounts
  useEffect(() => {
    fetchMessages('global');
  }, [fetchMessages]);

  // Scroll to bottom when messages change
  useEffect(() => {
    const messagesContainer = document.getElementById('messages-container');
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }, [messages]);

  // Handle sending a message
  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !user) return;
    
    setIsSending(true);
    try {
      if (editingMessageId) {
        // Edit functionality would be implemented in a real app
        // This is a placeholder
        console.log('Editing message:', editingMessageId, inputMessage);
        // Reset editing state
        setEditingMessageId(null);
      } else {
        // Send new message
        await sendMessage(
          inputMessage, 
          'global',
          replyingToMessage?.id
        );
        
        // Reset reply state if replying
        if (replyingToMessage) {
          setReplyingToMessage(null);
        }
      }
      
      // Clear input
      setInputMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSending(false);
    }
  };

  // Handle key down for Enter to send message
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Handle message edits
  const handleMessageEdit = (messageId: string) => {
    const messageToEdit = messages.find(msg => msg.id === messageId);
    if (messageToEdit && messageToEdit.isCurrentUser) {
      setEditingMessageId(messageId);
      setInputMessage(messageToEdit.content);
    }
  };

  // Handle message reply
  const handleMessageReply = (messageId: string) => {
    const messageToReply = messages.find(msg => msg.id === messageId);
    if (messageToReply) {
      setReplyingToMessage({
        id: messageToReply.id,
        content: messageToReply.content,
        senderName: messageToReply.senderName || 'Anonymous'
      });
    }
  };

  // Handle emoji select
  const handleEmojiSelect = (emoji: string) => {
    setInputMessage(prev => prev + emoji);
  };

  // Handle GIF select
  const handleGifSelect = (gif: { url: string; alt: string }) => {
    const gifMarkdown = `![${gif.alt}](${gif.url})`;
    setInputMessage(prev => prev + " " + gifMarkdown);
  };

  // Handle admin effects (if user is admin)
  const handleAdminEffectSelect = (effectType: string, content?: string) => {
    if (!user?.isAdmin) return;
    
    // In a real app, this would call an API to apply the effect
    console.log('Applying admin effect:', effectType, content);
    
    // If content is not provided, use the current input message
    const effectContent = content || inputMessage;
    
    if (effectContent) {
      // In a real app, this would be implemented properly
      const effectMessage: ChatMessage = {
        id: `effect-${Date.now()}`,
        content: effectContent,
        senderName: user.name || 'Admin',
        userId: user.id,
        createdAt: new Date().toISOString(),
        isCurrentUser: true,
        effectType,
        conversationId: 'global'
      };
      
      addMessage(effectMessage);
      
      // Clear the input if we used it
      if (!content) {
        setInputMessage('');
      }
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat header */}
      <div className="p-3 border-b flex items-center">
        <MessageCircle size={18} className="mr-2 text-primary" />
        <h3 className="font-medium">Community Chat</h3>
      </div>
      
      {/* Messages container */}
      <div 
        id="messages-container"
        className="flex-1 overflow-y-auto p-3 space-y-4 bg-muted/30"
      >
        {isLoadingMessages ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : messages.length > 0 ? (
          messages.map(message => (
            <MessageBubble 
              key={message.id} 
              message={message} 
              onEdit={handleMessageEdit}
              onReply={handleMessageReply}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
            <MessageCircle size={40} className="mb-2 opacity-50" />
            <p className="text-sm">No messages yet</p>
            <p className="text-xs">Be the first to say hello!</p>
          </div>
        )}
      </div>
      
      {/* Input area */}
      <div className="mt-auto">
        <ChatInputSection 
          message={inputMessage}
          setMessage={setInputMessage}
          handleSendMessage={handleSendMessage}
          handleKeyDown={handleKeyDown}
          isSubmitting={isSending}
          editingMessageId={editingMessageId}
          replyingToMessage={replyingToMessage}
          onCancelEdit={() => {
            setEditingMessageId(null);
            setInputMessage('');
          }}
          onCancelReply={() => setReplyingToMessage(null)}
          isAdmin={user?.isAdmin || false}
          onAdminEffectSelect={handleAdminEffectSelect}
          onEmojiSelect={handleEmojiSelect}
          onGifSelect={handleGifSelect}
        />
      </div>
    </div>
  );
};
