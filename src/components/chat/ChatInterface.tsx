
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { UserHoverCard } from "../UserHoverCard";
import { EmojiPicker } from "./EmojiPicker";
import { GifPicker } from "./GifPicker";
import { MessageReactions } from "./MessageReactions";
import {
  Send,
  Paperclip,
  Mic,
  Video,
  Image,
  Smile,
  Gift,
  MoreHorizontal,
  Search,
  Phone,
  Users,
  Info,
  Pin,
  UserPlus,
  AtSign,
  Hash
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  timestamp: Date;
  status: "sent" | "delivered" | "read";
  isEdited?: boolean;
  reactions?: { emoji: string; count: number; users: string[] }[];
  attachments?: { type: "image" | "gif" | "file"; url: string }[];
  mentions?: string[];
}

interface ChatInterfaceProps {
  chatType: 'direct' | 'group' | 'global';
  recipientId?: string;
  recipientName?: string;
  recipientAvatar?: string;
  recipientStatus?: "online" | "offline" | "away" | "do_not_disturb";
  groupId?: string;
  groupName?: string;
  groupAvatar?: string;
  groupMembers?: number;
}

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
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [isGifPickerOpen, setIsGifPickerOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [activeUsers, setActiveUsers] = useState<string[]>([]);
  
  const messageEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Mock current user data (would come from auth context in a real app)
  const currentUser = {
    id: "current-user",
    name: "You",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=You"
  };

  // Load mock messages
  useEffect(() => {
    // Simulate API call to fetch messages
    const mockMessages: Message[] = [
      {
        id: "1",
        content: "Hi there! How's your research going?",
        senderId: chatType === 'direct' ? recipientId || '' : "user-1",
        senderName: chatType === 'direct' ? recipientName || 'User' : "Alex Morgan",
        senderAvatar: chatType === 'direct' ? recipientAvatar || '' : "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
        timestamp: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
        status: "read",
        reactions: [
          { emoji: "👍", count: 2, users: ["user-2", "user-3"] },
          { emoji: "❤️", count: 1, users: ["user-4"] }
        ]
      },
      {
        id: "2",
        content: "I'm making good progress on the quantum consciousness model.",
        senderId: currentUser.id,
        senderName: currentUser.name,
        senderAvatar: currentUser.avatar,
        timestamp: new Date(Date.now() - 55 * 60 * 1000), // 55 mins ago
        status: "read"
      },
      {
        id: "3",
        content: "That's fantastic! Would you like to discuss your findings over a call?",
        senderId: chatType === 'direct' ? recipientId || '' : "user-1",
        senderName: chatType === 'direct' ? recipientName || 'User' : "Alex Morgan",
        senderAvatar: chatType === 'direct' ? recipientAvatar || '' : "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
        timestamp: new Date(Date.now() - 45 * 60 * 1000), // 45 mins ago
        status: "read"
      },
      {
        id: "4",
        content: "Sure, that would be helpful. When are you available?",
        senderId: currentUser.id,
        senderName: currentUser.name,
        senderAvatar: currentUser.avatar,
        timestamp: new Date(Date.now() - 40 * 60 * 1000), // 40 mins ago
        status: "read"
      },
      {
        id: "5",
        content: "I'm free tomorrow afternoon. Would 3 PM work for you?",
        senderId: chatType === 'direct' ? recipientId || '' : "user-1",
        senderName: chatType === 'direct' ? recipientName || 'User' : "Alex Morgan",
        senderAvatar: chatType === 'direct' ? recipientAvatar || '' : "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
        timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 mins ago
        status: "read"
      },
      {
        id: "6",
        content: "Perfect! I'll send a calendar invite. By the way, check out this interesting paper I found.",
        senderId: currentUser.id,
        senderName: currentUser.name,
        senderAvatar: currentUser.avatar,
        timestamp: new Date(Date.now() - 25 * 60 * 1000), // 25 mins ago
        status: "read",
        attachments: [
          { type: "file", url: "/path-to-file/quantum-paper.pdf" }
        ]
      },
      {
        id: "7",
        content: "Thanks for sharing! This looks very relevant to our discussion.",
        senderId: chatType === 'direct' ? recipientId || '' : "user-1",
        senderName: chatType === 'direct' ? recipientName || 'User' : "Alex Morgan",
        senderAvatar: chatType === 'direct' ? recipientAvatar || '' : "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
        timestamp: new Date(Date.now() - 10 * 60 * 1000), // 10 mins ago
        status: "delivered",
        reactions: [
          { emoji: "🙏", count: 1, users: [currentUser.id] }
        ]
      }
    ];
    
    setMessages(mockMessages);
    
    // Simulate other users currently viewing this chat
    if (chatType !== 'direct') {
      setActiveUsers(["user-1", "user-2", "user-3"]);
    }
    
    // Scroll to bottom when messages change
    setTimeout(() => {
      scrollToBottom();
    }, 100);
  }, [chatType, recipientId, recipientName, recipientAvatar]);

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Handle message submission
  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!messageText.trim()) return;
    
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      content: messageText,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      timestamp: new Date(),
      status: "sent"
    };
    
    setMessages([...messages, newMessage]);
    setMessageText("");
    
    // Focus back on the input field
    inputRef.current?.focus();
    
    // Close emoji and GIF pickers
    setIsEmojiPickerOpen(false);
    setIsGifPickerOpen(false);
  };

  // Handle input changes and textarea auto-resize
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessageText(e.target.value);
    
    // Auto-resize textarea
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
    
    // Simulate typing indicator
    if (!isTyping && e.target.value) {
      setIsTyping(true);
      // In a real app, would emit typing event to other users
    } else if (isTyping && !e.target.value) {
      setIsTyping(false);
      // In a real app, would emit stopped typing event
    }
  };

  // Handle file upload
  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  // Process file selection
  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    // Here you would upload the file to a storage service
    // For demo, we'll just create a message with a mock attachment
    
    const file = files[0];
    const isImage = file.type.startsWith('image/');
    
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      content: isImage ? "" : `Shared a file: ${file.name}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      timestamp: new Date(),
      status: "sent",
      attachments: [
        { 
          type: isImage ? "image" : "file", 
          url: isImage 
            ? URL.createObjectURL(file) 
            : `/files/${file.name}`
        }
      ]
    };
    
    setMessages([...messages, newMessage]);
    
    // Reset the input
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Handle emoji selection
  const handleEmojiSelect = (emoji: string) => {
    setMessageText(prev => prev + emoji);
    setIsEmojiPickerOpen(false);
    inputRef.current?.focus();
  };

  // Handle GIF selection
  const handleGifSelect = (gifUrl: string) => {
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      content: "",
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      timestamp: new Date(),
      status: "sent",
      attachments: [{ type: "gif", url: gifUrl }]
    };
    
    setMessages([...messages, newMessage]);
    setIsGifPickerOpen(false);
  };

  // Handle reaction to a message
  const handleReactionAdd = (messageId: string, emoji: string) => {
    setMessages(prevMessages => 
      prevMessages.map(message => {
        if (message.id === messageId) {
          const reactions = message.reactions || [];
          const existingReaction = reactions.find(r => r.emoji === emoji);
          
          if (existingReaction) {
            // User already reacted with this emoji, toggle it off
            if (existingReaction.users.includes(currentUser.id)) {
              return {
                ...message,
                reactions: reactions.map(r => 
                  r.emoji === emoji 
                    ? { 
                        ...r, 
                        count: r.count - 1, 
                        users: r.users.filter(id => id !== currentUser.id)
                      }
                    : r
                ).filter(r => r.count > 0)
              };
            }
            
            // Add user to existing reaction
            return {
              ...message,
              reactions: reactions.map(r => 
                r.emoji === emoji 
                  ? { ...r, count: r.count + 1, users: [...r.users, currentUser.id] }
                  : r
              )
            };
          }
          
          // Add new reaction
          return {
            ...message,
            reactions: [...reactions, { emoji, count: 1, users: [currentUser.id] }]
          };
        }
        return message;
      })
    );
  };

  // Format timestamp for display
  const formatMessageTime = (timestamp: Date) => {
    const now = new Date();
    const messageDate = new Date(timestamp);
    
    // Same day - show time
    if (messageDate.toDateString() === now.toDateString()) {
      return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // Yesterday
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (messageDate.toDateString() === yesterday.toDateString()) {
      return `Yesterday ${messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    // Within a week
    const oneWeekAgo = new Date(now);
    oneWeekAgo.setDate(now.getDate() - 7);
    if (messageDate > oneWeekAgo) {
      const options: Intl.DateTimeFormatOptions = { weekday: 'short', hour: '2-digit', minute: '2-digit' };
      return messageDate.toLocaleString([], options);
    }
    
    // Older messages
    return messageDate.toLocaleDateString();
  };

  // Get status icon for messages
  const getStatusIcon = (status: "sent" | "delivered" | "read") => {
    switch (status) {
      case "sent":
        return <span className="text-gray-400">✓</span>;
      case "delivered":
        return <span className="text-gray-400">✓✓</span>;
      case "read":
        return <span className="text-blue-400">✓✓</span>;
      default:
        return null;
    }
  };

  // Handle key press in the input field
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Send message on Enter without Shift
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center">
          {chatType === 'direct' ? (
            <UserHoverCard 
              username={recipientName?.toLowerCase().replace(/\s+/g, '') || ""}
              avatar={recipientAvatar || ""}
              status={recipientStatus || "offline"}
              displayName={recipientName || ""}
            >
              <div className="flex items-center cursor-pointer">
                <div className="relative">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={recipientAvatar} alt={recipientName} />
                    <AvatarFallback>{recipientName?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {recipientStatus && (
                    <span 
                      className={cn(
                        "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background",
                        recipientStatus === "online" ? "bg-green-500" :
                        recipientStatus === "away" ? "bg-yellow-500" :
                        recipientStatus === "do_not_disturb" ? "bg-red-500" :
                        "bg-gray-500"
                      )}
                    ></span>
                  )}
                </div>
                <div className="ml-3">
                  <h2 className="font-semibold">{recipientName}</h2>
                  <p className="text-xs text-muted-foreground">
                    {recipientStatus === "online" ? "Online" : 
                     recipientStatus === "away" ? "Away" :
                     recipientStatus === "do_not_disturb" ? "Do not disturb" :
                     "Offline"}
                  </p>
                </div>
              </div>
            </UserHoverCard>
          ) : (
            <div className="flex items-center">
              <Avatar className="h-10 w-10">
                <AvatarImage src={groupAvatar} alt={groupName} />
                <AvatarFallback>{groupName?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="ml-3">
                <h2 className="font-semibold">{groupName}</h2>
                <p className="text-xs text-muted-foreground">
                  {groupMembers} members • {activeUsers.length} online
                </p>
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                  <Phone size={18} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Start voice call</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                  <Video size={18} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Start video call</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                  <Search size={18} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Search in conversation</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                  <Info size={18} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Conversation info</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                  <MoreHorizontal size={18} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>More options</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      
      {/* Chat Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => {
            const isOwnMessage = message.senderId === currentUser.id;
            
            return (
              <div 
                key={message.id} 
                className={cn(
                  "flex gap-2",
                  isOwnMessage ? "flex-row-reverse" : ""
                )}
              >
                <div className="flex-shrink-0 pt-1">
                  <UserHoverCard 
                    username={message.senderName.toLowerCase().replace(/\s+/g, '')}
                    avatar={message.senderAvatar}
                    status={isOwnMessage ? "online" : (recipientStatus || "offline")}
                    displayName={message.senderName}
                  >
                    <Avatar className="h-8 w-8 cursor-pointer">
                      <AvatarImage src={message.senderAvatar} alt={message.senderName} />
                      <AvatarFallback>{message.senderName.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </UserHoverCard>
                </div>
                
                <div 
                  className={cn(
                    "flex flex-col max-w-[80%]",
                    isOwnMessage ? "items-end" : ""
                  )}
                >
                  {!isOwnMessage && (
                    <div className="mb-1 flex items-center">
                      <span className="text-sm font-medium">{message.senderName}</span>
                      <span className="text-xs text-muted-foreground ml-2">
                        {formatMessageTime(message.timestamp)}
                      </span>
                    </div>
                  )}
                  
                  <div 
                    className={cn(
                      "rounded-lg py-2 px-3 relative group",
                      isOwnMessage
                        ? "bg-primary text-primary-foreground rounded-tr-none"
                        : "bg-muted text-foreground rounded-tl-none"
                    )}
                  >
                    {/* Message content */}
                    <div className="whitespace-pre-wrap break-words">{message.content}</div>
                    
                    {/* Message attachments */}
                    {message.attachments && message.attachments.map((attachment, index) => (
                      <div key={index} className="mt-2">
                        {attachment.type === 'image' && (
                          <div className="rounded-md overflow-hidden max-w-xs">
                            <img src={attachment.url} alt="Attachment" className="max-w-full h-auto" />
                          </div>
                        )}
                        {attachment.type === 'gif' && (
                          <div className="rounded-md overflow-hidden max-w-xs">
                            <img src={attachment.url} alt="GIF" className="max-w-full h-auto" />
                          </div>
                        )}
                        {attachment.type === 'file' && (
                          <div className="flex items-center bg-background/50 rounded p-2">
                            <Paperclip size={16} className="mr-2" />
                            <a href={attachment.url} target="_blank" rel="noopener noreferrer" className="text-sm hover:underline">
                              {attachment.url.split('/').pop()}
                            </a>
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {/* Reactions */}
                    {message.reactions && message.reactions.length > 0 && (
                      <MessageReactions 
                        reactions={message.reactions} 
                        messageId={message.id} 
                        onReactionAdd={handleReactionAdd}
                      />
                    )}
                    
                    {/* Message status for own messages */}
                    {isOwnMessage && (
                      <div className="absolute right-0 -bottom-5 text-xs text-muted-foreground flex items-center">
                        <span className="mr-1">{formatMessageTime(message.timestamp)}</span>
                        {getStatusIcon(message.status)}
                        {message.isEdited && <span className="ml-1">(edited)</span>}
                      </div>
                    )}
                    
                    {/* Message actions that appear on hover */}
                    <div className={cn(
                      "absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity",
                      isOwnMessage ? "right-0" : "left-0"
                    )}>
                      <div className="flex items-center gap-1 bg-popover rounded-full p-1 shadow-md">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleReactionAdd(message.id, '👍')}>
                                <span className="text-sm">👍</span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>React with 👍</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleReactionAdd(message.id, '❤️')}>
                                <span className="text-sm">❤️</span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>React with ❤️</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setIsEmojiPickerOpen(true)}>
                                <Smile size={14} />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Add reaction</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-7 w-7">
                                <Pin size={14} />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Pin message</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          
          {/* Typing indicator */}
          {isTyping && (
            <div className="flex gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={recipientAvatar} alt={recipientName} />
                <AvatarFallback>{recipientName?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="bg-muted rounded-lg py-2 px-3 text-muted-foreground flex items-center space-x-1">
                <div className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: "0ms" }}></div>
                <div className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: "100ms" }}></div>
                <div className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: "200ms" }}></div>
              </div>
            </div>
          )}
          
          {/* Active users indicator for groups */}
          {chatType !== 'direct' && activeUsers.length > 0 && (
            <div className="flex items-center gap-2 mt-4">
              <div className="flex -space-x-1">
                {activeUsers.slice(0, 3).map((userId, index) => (
                  <Avatar key={userId} className="h-5 w-5 border border-background">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`} />
                    <AvatarFallback>{userId.charAt(0)}</AvatarFallback>
                  </Avatar>
                ))}
              </div>
              <span className="text-xs text-muted-foreground">
                {activeUsers.length} {activeUsers.length === 1 ? 'person' : 'people'} viewing this conversation
              </span>
            </div>
          )}
          
          {/* This element helps scroll to bottom */}
          <div ref={messageEndRef} />
        </div>
      </ScrollArea>
      
      {/* Message Input */}
      <div className="p-4 border-t">
        <form onSubmit={handleSendMessage} className="flex flex-col gap-2">
          <div className="relative">
            <textarea
              ref={inputRef}
              value={messageText}
              onChange={handleInputChange}
              onKeyDown={handleKeyPress}
              placeholder={`Message ${recipientName || groupName || 'chat'}`}
              className="w-full resize-none overflow-hidden min-h-[40px] max-h-[200px] px-4 py-2 pr-12 rounded-md bg-muted focus:outline-none focus:ring-1 focus:ring-ring"
              rows={1}
            />
            <div className="absolute right-2 top-2 flex">
              {messageText && (
                <Button type="submit" size="icon" variant="ghost" className="h-7 w-7">
                  <Send size={16} />
                </Button>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button type="button" variant="ghost" size="icon" className="h-9 w-9 rounded-full" onClick={handleFileUpload}>
                    <Paperclip size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Add attachment</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button type="button" variant="ghost" size="icon" className="h-9 w-9 rounded-full" onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}>
                    <Smile size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Add emoji</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button type="button" variant="ghost" size="icon" className="h-9 w-9 rounded-full" onClick={() => setIsGifPickerOpen(!isGifPickerOpen)}>
                    <Gift size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Add GIF</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button type="button" variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                    <Mic size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Voice message</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button type="button" variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                    <AtSign size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Mention user</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            {chatType !== 'direct' && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button type="button" variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                      <Hash size={16} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Mention channel</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </form>
        
        {/* File input (hidden) */}
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileSelected}
          className="hidden"
        />
        
        {/* Emoji Picker Popover */}
        {isEmojiPickerOpen && (
          <div className="absolute bottom-20 right-4">
            <EmojiPicker onEmojiSelect={handleEmojiSelect} onClose={() => setIsEmojiPickerOpen(false)} />
          </div>
        )}
        
        {/* GIF Picker Popover */}
        {isGifPickerOpen && (
          <div className="absolute bottom-20 right-4">
            <GifPicker onGifSelect={handleGifSelect} onClose={() => setIsGifPickerOpen(false)} />
          </div>
        )}
      </div>
    </div>
  );
};
