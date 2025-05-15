
import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Paperclip, Mic, MicOff } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EmojiPicker } from "./EmojiPicker";
import { GifPicker } from "./GifPicker";
import { ChatMessage } from "./ChatMessage";
import { Reaction } from "./MessageReactions";

interface ChatInterfaceProps {
  chatType: 'direct' | 'group' | 'global';
  recipientId?: string;
  recipientName?: string;
  recipientAvatar?: string;
  recipientStatus?: string;
  groupId?: string;
  groupName?: string;
  groupAvatar?: string;
  groupMembers?: Array<{ id: string; name: string; avatar: string; status: string }>;
}

// Define a proper interface for the message type
interface MessageType {
  id: string;
  content: string;
  sender: {
    id: string;
    name: string;
    username: string;
    avatar: string;
    status: "online" | "offline" | "away" | "do_not_disturb";
  };
  timestamp: Date;
  reactions: Reaction[];
  isCurrentUser: boolean;
  mentions?: Array<{ id: string; name: string }>;
  attachments?: Array<{ id: string; type: 'image' | 'gif' | 'file'; url: string; name?: string }>;
}

// Mock messages for demonstration
const generateMockMessages = (): MessageType[] => {
  const currentTime = new Date();
  
  return [
    {
      id: '1',
      content: 'Hey! How are you doing today?',
      sender: {
        id: 'user-2',
        name: 'Jane Smith',
        username: 'janesmith',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
        status: 'online',
      },
      timestamp: new Date(currentTime.getTime() - 1000 * 60 * 30), // 30 minutes ago
      reactions: [
        { emoji: '👍', count: 2, users: ['current-user', 'user-3'] },
        { emoji: '❤️', count: 1, users: ['user-4'] }
      ],
      isCurrentUser: false,
    },
    {
      id: '2',
      content: 'I\'m doing well! Just finished reading that book you recommended.',
      sender: {
        id: 'current-user',
        name: 'John Doe',
        username: 'johndoe',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
        status: 'online',
      },
      timestamp: new Date(currentTime.getTime() - 1000 * 60 * 25), // 25 minutes ago
      reactions: [],
      isCurrentUser: true,
    },
    {
      id: '3',
      content: 'What did you think of it? I loved the part about quantum consciousness!',
      sender: {
        id: 'user-2',
        name: 'Jane Smith',
        username: 'janesmith',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
        status: 'online',
      },
      timestamp: new Date(currentTime.getTime() - 1000 * 60 * 20), // 20 minutes ago
      reactions: [],
      isCurrentUser: false,
    },
    {
      id: '4',
      content: 'It was fascinating! I especially enjoyed the discussion on emergent properties of complex systems.',
      sender: {
        id: 'current-user',
        name: 'John Doe',
        username: 'johndoe',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
        status: 'online',
      },
      timestamp: new Date(currentTime.getTime() - 1000 * 60 * 15), // 15 minutes ago
      reactions: [
        { emoji: '🧠', count: 1, users: ['user-2'] },
      ],
      isCurrentUser: true,
      mentions: [{ id: 'user-2', name: 'Jane' }],
      attachments: [
        { 
          id: 'att-1', 
          type: 'image', 
          url: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb',
          name: 'quantum-diagram.jpg' 
        }
      ]
    },
    {
      id: '5',
      content: 'Yes! That was my favorite chapter too. We should discuss this more during our study group tomorrow @John',
      sender: {
        id: 'user-2',
        name: 'Jane Smith',
        username: 'janesmith',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
        status: 'online',
      },
      timestamp: new Date(currentTime.getTime() - 1000 * 60 * 5), // 5 minutes ago
      reactions: [],
      isCurrentUser: false,
      mentions: [{ id: 'current-user', name: 'John' }],
    }
  ];
};

export const ChatInterface = ({
  chatType,
  recipientId,
  recipientName,
  recipientAvatar,
  recipientStatus,
  groupId,
  groupName,
  groupAvatar,
  groupMembers
}: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<MessageType[]>(generateMockMessages());
  const [messageInput, setMessageInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Group messages by sender and time
  const groupedMessages = React.useMemo(() => {
    const groups: Array<{
      sender: MessageType['sender'];
      messages: Array<MessageType & {
        isFirstInGroup: boolean;
        isLastInGroup: boolean;
      }>;
    }> = [];

    messages.forEach((message, i) => {
      const prevMessage = messages[i - 1];
      const isSameSenderAsPrev = prevMessage && prevMessage.sender.id === message.sender.id;
      const isWithinTimeWindow = prevMessage && 
        (message.timestamp.getTime() - prevMessage.timestamp.getTime() < 1000 * 60 * 5); // 5 minutes

      if (isSameSenderAsPrev && isWithinTimeWindow) {
        // Add to the last group
        const lastGroup = groups[groups.length - 1];
        
        // Mark the previous message as not last in group
        if (lastGroup.messages.length > 0) {
          lastGroup.messages[lastGroup.messages.length - 1].isLastInGroup = false;
        }
        
        lastGroup.messages.push({
          ...message,
          isFirstInGroup: false,
          isLastInGroup: true
        });
      } else {
        // Create a new group
        groups.push({
          sender: message.sender,
          messages: [{
            ...message,
            isFirstInGroup: true,
            isLastInGroup: true
          }]
        });
      }
    });

    return groups;
  }, [messages]);

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;

    const newMessage: MessageType = {
      id: `msg-${Date.now()}`,
      content: messageInput,
      sender: {
        id: 'current-user',
        name: 'John Doe',
        username: 'johndoe',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
        status: 'online',
      },
      timestamp: new Date(),
      reactions: [],
      isCurrentUser: true,
      mentions: [],
      attachments: [],
    };
    
    setMessages([...messages, newMessage]);
    setMessageInput("");
    setReplyingTo(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setMessageInput(prev => prev + emoji);
  };

  const handleGifSelect = (gif: { url: string; alt: string }) => {
    // In a real app, this would send a message with a GIF attachment
    const newMessage: MessageType = {
      id: `msg-${Date.now()}`,
      content: "",
      sender: {
        id: 'current-user',
        name: 'John Doe',
        username: 'johndoe',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
        status: 'online',
      },
      timestamp: new Date(),
      reactions: [],
      isCurrentUser: true,
      attachments: [{
        id: `gif-${Date.now()}`,
        type: 'gif',
        url: gif.url,
        name: gif.alt
      }]
    };
    
    setMessages([...messages, newMessage]);
  };

  const handleReactionAdd = (messageId: string, emoji: string) => {
    setMessages(prev => prev.map(message => {
      if (message.id === messageId) {
        // Check if reaction already exists
        const existingReaction = message.reactions.find(r => r.emoji === emoji);
        
        if (existingReaction) {
          // If user has already reacted, don't add again
          if (existingReaction.users.includes('current-user')) {
            return message;
          }
          
          // Add user to existing reaction
          return {
            ...message,
            reactions: message.reactions.map(r => 
              r.emoji === emoji 
                ? { ...r, count: r.count + 1, users: [...r.users, 'current-user'] }
                : r
            )
          };
        }
        
        // Add new reaction
        return {
          ...message,
          reactions: [
            ...message.reactions,
            { emoji, count: 1, users: ['current-user'] }
          ]
        };
      }
      return message;
    }));
  };

  const handleReactionRemove = (messageId: string, emoji: string) => {
    setMessages(prev => prev.map(message => {
      if (message.id === messageId) {
        const updatedReactions = message.reactions.map(r => {
          if (r.emoji === emoji && r.users.includes('current-user')) {
            // Remove current user from the reaction
            const updatedUsers = r.users.filter(userId => userId !== 'current-user');
            return {
              ...r,
              count: r.count - 1,
              users: updatedUsers
            };
          }
          return r;
        }).filter(r => r.count > 0); // Remove reactions with zero count
        
        return {
          ...message,
          reactions: updatedReactions
        };
      }
      return message;
    }));
  };

  const handleDeleteMessage = (messageId: string) => {
    setMessages(prev => prev.filter(message => message.id !== messageId));
  };

  const toggleVoiceRecording = () => {
    // In a real app, this would handle voice recording permissions and recording logic
    setIsRecording(!isRecording);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat header */}
      <div className="border-b py-3 px-4 flex justify-between items-center">
        <div className="flex items-center">
          {chatType === 'direct' && recipientName ? (
            <div className="flex items-center">
              <Avatar className="h-8 w-8 mr-2">
                <AvatarImage src={recipientAvatar} />
                <AvatarFallback>{recipientName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium text-sm">{recipientName}</h3>
                <p className="text-xs text-muted-foreground">
                  {recipientStatus === 'online' ? 'Online' : 'Offline'}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center">
              <Avatar className="h-8 w-8 mr-2">
                <AvatarImage src={groupAvatar} />
                <AvatarFallback>{groupName?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium text-sm">{groupName}</h3>
                <p className="text-xs text-muted-foreground">
                  {groupMembers?.length} members
                </p>
              </div>
            </div>
          )}
        </div>
        <div>
          {groupMembers && groupMembers.length > 0 && (
            <div className="flex -space-x-2">
              {groupMembers.slice(0, 3).map(member => (
                <Avatar key={member.id} className="h-6 w-6 border-2 border-background">
                  <AvatarImage src={member.avatar} />
                  <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                </Avatar>
              ))}
              {groupMembers.length > 3 && (
                <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-xs">
                  +{groupMembers.length - 3}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Chat messages */}
      <ScrollArea className="flex-1 p-0">
        <div className="flex flex-col py-4">
          {groupedMessages.map((group, groupIndex) => (
            <div key={groupIndex} className="mb-1">
              {group.messages.map(message => (
                <ChatMessage
                  key={message.id}
                  id={message.id}
                  content={message.content}
                  sender={message.sender}
                  timestamp={message.timestamp}
                  reactions={message.reactions}
                  isCurrentUser={message.isCurrentUser}
                  isFirstInGroup={message.isFirstInGroup}
                  isLastInGroup={message.isLastInGroup}
                  mentions={message.mentions}
                  attachments={message.attachments}
                  onReply={(msgId) => setReplyingTo(msgId)}
                  onDelete={handleDeleteMessage}
                  onReactionAdd={handleReactionAdd}
                  onReactionRemove={handleReactionRemove}
                />
              ))}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      
      {/* Reply indicator */}
      {replyingTo && (
        <div className="border-t border-border bg-muted/50 px-4 py-2 flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-1 h-8 bg-primary rounded mr-2"></div>
            <div>
              <p className="text-xs text-muted-foreground">Replying to</p>
              <p className="text-sm truncate max-w-[200px]">
                {messages.find(m => m.id === replyingTo)?.content || ""}
              </p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setReplyingTo(null)}
          >
            Cancel
          </Button>
        </div>
      )}
      
      {/* Message input */}
      <div className="border-t p-3">
        <div className="flex items-center bg-muted/50 rounded-md">
          <div className="flex items-center px-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 rounded-full hover:bg-accent hover:text-accent-foreground"
            >
              <Paperclip size={18} />
            </Button>
            <EmojiPicker onEmojiSelect={handleEmojiSelect} />
            <GifPicker onGifSelect={handleGifSelect} />
          </div>
          
          <Input
            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
            placeholder={`Message ${
              chatType === 'direct' ? recipientName : groupName
            }...`}
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          
          <div className="flex items-center px-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full hover:bg-accent hover:text-accent-foreground"
              onClick={toggleVoiceRecording}
            >
              {isRecording ? (
                <MicOff size={18} className="text-red-500" />
              ) : (
                <Mic size={18} />
              )}
            </Button>
            <Button
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={handleSendMessage}
              disabled={!messageInput.trim() && !isRecording}
            >
              <Send size={16} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
