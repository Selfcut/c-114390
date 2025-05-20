import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  ChangeEvent,
} from 'react';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Smile, ImagePlus, Loader2, Edit, Reply } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { ChatMessage, ChatUser, MessageReaction } from '@/components/chat/types';
import { useMessageHandlers } from '@/hooks/chat/useMessageHandlers';
import { useConversations } from '@/hooks/chat/useConversations';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { EmojiPicker } from './EmojiPicker';
import { GifPicker } from './GifPicker';
import { cn } from '@/lib/utils';

interface ChatInterfaceProps {
  conversationId: string;
  users: ChatUser[];
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ conversationId, users }) => {
  const { user } = useAuth();
  const { activeConversationId } = useConversations();
  const { messages, isEditing, replyingTo, sendMessage, handleEditMessage, handleReplyMessage } = useMessageHandlers(conversationId);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showGifPicker, setShowGifPicker] = useState(false);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      await handleSendMessage();
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() && !isEditing) return;

    setIsLoading(true);
    try {
      await sendMessage(input);
      setInput('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReactionClick = (messageId: string, emoji: string) => {
    // Find if the same reaction already exists
    const message = messages.find(msg => msg.id === messageId);
    if (!message) return;

    // Create a proper reaction object with all required properties
    const reaction: MessageReaction = {
      id: `reaction-${Date.now()}`,
      emoji: emoji,
      userId: user?.id || 'anonymous',
      username: user?.name || 'Anonymous',
      messageId: messageId,
      users: [user?.id || 'anonymous'], // Using array of user IDs
      count: 1 // Add count property
    };

    // Add to message
    addReaction(messageId, reaction);
  };

  const addReaction = async (messageId: string, reaction: MessageReaction) => {
    // Optimistically update the UI
    setMessages(prevMessages => {
      return prevMessages.map(msg => {
        if (msg.id === messageId) {
          const existingReactions = msg.reactions || [];
          return { ...msg, reactions: [...existingReactions, reaction] };
        }
        return msg;
      });
    });
  };

  const handleEmojiSelect = (emoji: string) => {
    setInput(prevInput => prevInput + emoji);
    setShowEmojiPicker(false);
  };

  const handleSendGif = (gifUrl: string) => {
    if (!user || !activeConversationId) return;
    
    const gifMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      content: gifUrl,
      userId: user.id,
      conversationId: activeConversationId,
      createdAt: new Date().toISOString(),
      senderName: user.name,
      isCurrentUser: true,
      avatarUrl: user.avatarUrl,
      reactions: [], // Initialize reactions array
      // mentions: [] // Add mentions array if needed
    };
    
    // Send message
    sendMessage(gifMessage);
  };

  const handleReplyToMessage = (messageId: string) => {
    const messageToReply = messages.find(msg => msg.id === messageId);
    if (messageToReply) {
      setReplyingTo({
        id: messageToReply.id,
        content: messageToReply.content,
        senderName: messageToReply.senderName || 'Unknown'
      });
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Messages */}
      <div className="flex-1 p-4 space-y-2 overflow-y-auto">
        {messages.map(message => {
          const isCurrentUser = message.userId === user?.id;
          const sender = users.find(u => u.id === message.userId);
          const isReplying = replyingTo?.id === message.id;

          return (
            <div key={message.id} className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'}`}>
              {/* Replied Message */}
              {message.replyTo && (
                <div className="mb-1 p-2 rounded-md bg-secondary text-secondary-foreground text-sm">
                  Replying to: {message.replyTo.senderName}
                  <p className="italic">{message.replyTo.content}</p>
                </div>
              )}
              <div className={`flex items-start space-x-2 ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}>
                <Avatar>
                  <AvatarImage src={sender?.avatarUrl} alt={sender?.name} />
                  <AvatarFallback>{sender?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <div className="text-sm font-bold">{sender?.name}</div>
                  <div
                    className={`relative rounded-md p-2 break-words ${isCurrentUser ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}
                  >
                    {message.content.startsWith('https://media.tenor.com') ? (
                      <img src={message.content} alt="GIF" className="max-w-xs rounded-md" />
                    ) : (
                      <p>{message.content}</p>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="absolute right-2 top-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditMessage(message.id)}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleReplyMessage(message.id)}>
                          Reply
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  {/* Reactions */}
                  {message.reactions && message.reactions.length > 0 && (
                    <div className="flex items-center space-x-1">
                      {message.reactions.map(reaction => (
                        <Button
                          key={reaction.id}
                          variant="outline"
                          size="xs"
                          onClick={() => handleReactionClick(message.id, reaction.emoji)}
                        >
                          {reaction.emoji} {reaction.count}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={chatBottomRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t">
        {replyingTo && (
          <div className="mb-2 p-2 rounded-md bg-secondary text-secondary-foreground">
            Replying to: {replyingTo.senderName}
            <p className="italic">{replyingTo.content}</p>
            <Button variant="ghost" size="sm" onClick={() => setReplyingTo(null)}>
              Cancel
            </Button>
          </div>
        )}
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
            <Smile className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setShowGifPicker(!showGifPicker)}>
            <ImagePlus className="h-5 w-5" />
          </Button>
          <Input
            placeholder="Type a message..."
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
          />
          <Button onClick={handleSendMessage} disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            Send
          </Button>
        </div>
        {showEmojiPicker && (
          <EmojiPicker onEmojiSelect={handleEmojiSelect} className="mt-2" />
        )}
        {showGifPicker && (
          <GifPicker onGifSelect={handleSendGif} className="mt-2" />
        )}
      </div>
    </div>
  );
};

export default ChatInterface;
