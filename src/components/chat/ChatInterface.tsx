
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Smile,
  PaperclipIcon,
  Send,
  Image,
  FileIcon,
  Mic,
  Video,
  Gif,
  ChevronDown,
  Search,
  VideoIcon,
  Phone,
  Info,
  User,
  UserPlus,
  Settings,
  Users,
} from "lucide-react";
import { ChatMessage } from "./ChatMessage";
import { UserStatus } from "@/types/user";

// Emoji data for quick selection
const emojiCategories = [
  {
    name: "Smileys",
    emojis: ["😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇", "🙂", "🙃"]
  },
  {
    name: "Hands",
    emojis: ["👍", "👎", "👌", "✌️", "🤞", "🤟", "🤙", "👋", "🤚", "🖐️", "✋", "👏"]
  },
  {
    name: "Animals",
    emojis: ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🦁", "🐸", "🐵", "🐔"]
  },
  {
    name: "Food",
    emojis: ["🍏", "🍎", "🍐", "🍊", "🍋", "🍌", "🍉", "🍇", "🍓", "🍈", "🍒", "🍑"]
  }
];

// GIF categories for quick selection
const gifCategories = [
  { name: "Trending", preview: "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExamY3ZHcyemlnN3JlaDhqOTd2cjBtbnI1MGJzOXUyanUzN3lxenNraCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3NtY188QaxDdC/giphy_s.gif" },
  { name: "Reactions", preview: "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExejdobmdxMTlwMm1sZ2RqNWpnYnluanlyYnp2Nmg3ajVqdGd2c3I1dSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l3q2Z6S6n38zjPswo/giphy_s.gif" },
  { name: "Memes", preview: "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExNmVjcXR4amZ6ajhzNnRnNm9lcjcyNmF1dWg5dm03cDVsMTNxZnR1aSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/QMHoU66sBXqqLqYvGO/giphy_s.gif" },
  { name: "Cats", preview: "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExYmFmM205OTBwcXk2cTExa3lpYW51aTFhZjNxbHM1eWJ2cWY0cGVjciZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ICOgUNjpvO0PC/giphy_s.gif" },
];

// Mock messages data
const generateMockMessages = () => {
  const now = new Date();
  
  return [
    {
      id: "msg1",
      content: "Hey there! How's it going?",
      sender: {
        id: "user2",
        name: "Jane Smith",
        username: "janesmith",
        avatar: "https://api.dicebear.com/7.x/personas/svg?seed=Jane",
        status: "online" as UserStatus
      },
      timestamp: new Date(now.getTime() - 60 * 60 * 1000), // 1 hour ago
      reactions: [
        { emoji: "👍", count: 2, users: ["user1", "user3"] },
        { emoji: "❤️", count: 1, users: ["user1"] }
      ]
    },
    {
      id: "msg2",
      content: "I'm doing well, thanks for asking! Just working on some new ideas.",
      sender: {
        id: "user1",
        name: "John Doe",
        username: "johndoe",
        avatar: "https://api.dicebear.com/7.x/personas/svg?seed=John",
        status: "online" as UserStatus
      },
      timestamp: new Date(now.getTime() - 55 * 60 * 1000), // 55 mins ago
      reactions: []
    },
    {
      id: "msg3",
      content: "That's great to hear! What kind of ideas are you working on?",
      sender: {
        id: "user2",
        name: "Jane Smith",
        username: "janesmith",
        avatar: "https://api.dicebear.com/7.x/personas/svg?seed=Jane",
        status: "online" as UserStatus
      },
      timestamp: new Date(now.getTime() - 50 * 60 * 1000), // 50 mins ago
      reactions: []
    },
    {
      id: "msg4",
      content: "I've been exploring some concepts around consciousness and how it relates to artificial intelligence. It's fascinating to think about the parallels and differences between human and machine cognition.",
      sender: {
        id: "user1",
        name: "John Doe",
        username: "johndoe",
        avatar: "https://api.dicebear.com/7.x/personas/svg?seed=John",
        status: "online" as UserStatus
      },
      timestamp: new Date(now.getTime() - 45 * 60 * 1000), // 45 mins ago
      reactions: [
        { emoji: "🤔", count: 1, users: ["user2"] }
      ]
    },
    {
      id: "msg5",
      content: "That sounds really interesting! Have you read any good papers on the topic lately?",
      sender: {
        id: "user2",
        name: "Jane Smith",
        username: "janesmith",
        avatar: "https://api.dicebear.com/7.x/personas/svg?seed=Jane",
        status: "online" as UserStatus
      },
      timestamp: new Date(now.getTime() - 40 * 60 * 1000), // 40 mins ago
      reactions: []
    },
    {
      id: "msg6",
      content: "Yes! I just finished reading a paper by @davidchalmers on the 'hard problem' of consciousness. I can share it with you if you're interested.",
      sender: {
        id: "user1",
        name: "John Doe",
        username: "johndoe",
        avatar: "https://api.dicebear.com/7.x/personas/svg?seed=John",
        status: "online" as UserStatus
      },
      timestamp: new Date(now.getTime() - 35 * 60 * 1000), // 35 mins ago
      mentions: ["davidchalmers"],
      reactions: [
        { emoji: "👍", count: 1, users: ["user2"] }
      ]
    },
    {
      id: "msg7",
      content: "That would be great! I've been meaning to explore that topic more deeply.",
      sender: {
        id: "user2",
        name: "Jane Smith",
        username: "janesmith",
        avatar: "https://api.dicebear.com/7.x/personas/svg?seed=Jane",
        status: "online" as UserStatus
      },
      timestamp: new Date(now.getTime() - 30 * 60 * 1000), // 30 mins ago
      reactions: []
    },
    {
      id: "msg8",
      content: "Here's the link: https://example.com/consciousness-paper. Let me know what you think after reading it!",
      sender: {
        id: "user1",
        name: "John Doe",
        username: "johndoe",
        avatar: "https://api.dicebear.com/7.x/personas/svg?seed=John",
        status: "online" as UserStatus
      },
      timestamp: new Date(now.getTime() - 25 * 60 * 1000), // 25 mins ago
      reactions: [
        { emoji: "🙏", count: 1, users: ["user2"] }
      ]
    },
    {
      id: "msg9",
      content: "Thanks! I'll check it out and get back to you. Also, have you seen the latest research on quantum consciousness by Penrose?",
      sender: {
        id: "user2",
        name: "Jane Smith",
        username: "janesmith",
        avatar: "https://api.dicebear.com/7.x/personas/svg?seed=Jane",
        status: "online" as UserStatus
      },
      timestamp: new Date(now.getTime() - 20 * 60 * 1000), // 20 mins ago
      reactions: []
    },
    {
      id: "msg10",
      content: "I have! The Orchestrated Objective Reduction theory is quite fascinating, though controversial. I'm not entirely convinced by all aspects of it yet.",
      sender: {
        id: "user1",
        name: "John Doe",
        username: "johndoe",
        avatar: "https://api.dicebear.com/7.x/personas/svg?seed=John",
        status: "online" as UserStatus
      },
      timestamp: new Date(now.getTime() - 15 * 60 * 1000), // 15 mins ago
      reactions: []
    },
    {
      id: "msg11",
      content: "I agree. It's an interesting approach, but needs more empirical evidence. Maybe we can discuss it more after I read this paper you shared!",
      sender: {
        id: "user2",
        name: "Jane Smith",
        username: "janesmith",
        avatar: "https://api.dicebear.com/7.x/personas/svg?seed=Jane",
        status: "online" as UserStatus
      },
      timestamp: new Date(now.getTime() - 10 * 60 * 1000), // 10 mins ago
      reactions: [
        { emoji: "👍", count: 1, users: ["user1"] }
      ]
    }
  ];
};

// Props for the ChatInterface component
interface ChatInterfaceProps {
  // For direct chats
  recipientId?: string;
  recipientName?: string;
  recipientAvatar?: string;
  recipientStatus?: UserStatus;
  
  // For group chats
  groupId?: string;
  groupName?: string;
  groupAvatar?: string;
  groupMembers?: Array<{
    id: string;
    name: string;
    avatar: string;
    status: UserStatus;
  }>;
  
  // Type of chat
  chatType: 'direct' | 'group' | 'global';
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  recipientId,
  recipientName,
  recipientAvatar,
  recipientStatus,
  groupId,
  groupName,
  groupAvatar,
  groupMembers,
  chatType
}) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(generateMockMessages());
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [isAttachmentMenuOpen, setIsAttachmentMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<{
    id: string;
    content: string;
    sender: { name: string };
  } | null>(null);
  const [isMicRecording, setIsMicRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const currentUserId = "user1"; // Normally this would come from auth context

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      const messageToEdit = messages.find((msg) => msg.id === isEditing);
      if (messageToEdit) {
        setMessage(messageToEdit.content);
        textareaRef.current.focus();
      }
    }
  }, [isEditing, messages]);

  // Send message handler
  const handleSendMessage = () => {
    if (!message.trim()) return;

    if (isEditing) {
      // Edit existing message
      setMessages(
        messages.map((msg) =>
          msg.id === isEditing
            ? { ...msg, content: message, isEdited: true }
            : msg
        )
      );
      setIsEditing(null);
    } else {
      // Add new message
      const newMessage = {
        id: `msg${Date.now()}`,
        content: message,
        sender: {
          id: currentUserId,
          name: "John Doe",
          username: "johndoe",
          avatar: "https://api.dicebear.com/7.x/personas/svg?seed=John",
          status: "online" as UserStatus
        },
        timestamp: new Date(),
        reactions: [],
        ...(replyingTo && { replyTo: replyingTo })
      };

      setMessages([...messages, newMessage]);
      setReplyingTo(null);
    }

    setMessage("");
  };

  // Handle message edit
  const handleEditMessage = (messageId: string) => {
    setIsEditing(messageId);
    setReplyingTo(null);
  };

  // Handle message delete
  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((msg) => msg.id !== messageId));
    if (isEditing === messageId) {
      setIsEditing(null);
      setMessage("");
    }
  };

  // Handle reply to message
  const handleReplyMessage = (messageId: string) => {
    const messageToReply = messages.find((msg) => msg.id === messageId);
    if (messageToReply) {
      setReplyingTo({
        id: messageToReply.id,
        content: messageToReply.content,
        sender: { name: messageToReply.sender.name }
      });
      textareaRef.current?.focus();
    }
  };

  // Handle adding reaction
  const handleAddReaction = (messageId: string, emoji: string) => {
    setMessages(
      messages.map((msg) => {
        if (msg.id !== messageId) return msg;

        const existingReaction = msg.reactions?.find((r) => r.emoji === emoji);

        if (existingReaction && existingReaction.users.includes(currentUserId)) {
          return msg; // Already reacted with this emoji
        }

        let updatedReactions = [...(msg.reactions || [])];
        
        if (existingReaction) {
          // Update existing reaction
          updatedReactions = updatedReactions.map((r) => 
            r.emoji === emoji 
              ? { ...r, count: r.count + 1, users: [...r.users, currentUserId] }
              : r
          );
        } else {
          // Add new reaction
          updatedReactions.push({
            emoji,
            count: 1,
            users: [currentUserId]
          });
        }

        return { ...msg, reactions: updatedReactions };
      })
    );
  };

  // Handle removing reaction
  const handleRemoveReaction = (messageId: string, emoji: string) => {
    setMessages(
      messages.map((msg) => {
        if (msg.id !== messageId) return msg;

        const existingReaction = msg.reactions?.find((r) => r.emoji === emoji);
        
        if (!existingReaction || !existingReaction.users.includes(currentUserId)) {
          return msg; // No reaction to remove
        }

        // Update the reaction
        let updatedReactions = msg.reactions?.map((r) => {
          if (r.emoji !== emoji) return r;
          
          const updatedUsers = r.users.filter((user) => user !== currentUserId);
          
          if (updatedUsers.length === 0) {
            return null; // Remove reaction completely
          }
          
          return { ...r, count: r.count - 1, users: updatedUsers };
        }).filter(Boolean) as typeof msg.reactions;

        return { ...msg, reactions: updatedReactions };
      })
    );
  };

  // Handle inserting emoji into message
  const handleInsertEmoji = (emoji: string) => {
    setMessage((prev) => prev + emoji);
    setIsEmojiPickerOpen(false);
    textareaRef.current?.focus();
  };

  // Handle key press for sending
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Send message with Enter (without shift for new line)
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }

    // Cancel editing or replying with Escape
    if (e.key === "Escape") {
      if (isEditing) {
        setIsEditing(null);
        setMessage("");
      }
      if (replyingTo) {
        setReplyingTo(null);
      }
    }
  };

  // Get status indicator color
  const getStatusIndicator = (status: UserStatus) => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "away":
        return "bg-yellow-500";
      case "do-not-disturb":
        return "bg-red-500";
      case "invisible":
      case "offline":
      default:
        return "bg-gray-500";
    }
  };
  
  // Format status text
  const formatStatus = (status: UserStatus) => {
    switch (status) {
      case "do-not-disturb":
        return "Do Not Disturb";
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat header */}
      <div className="border-b p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {chatType === "direct" ? (
            <>
              <div className="relative">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={recipientAvatar} alt={recipientName} />
                  <AvatarFallback>{recipientName?.charAt(0)}</AvatarFallback>
                </Avatar>
                {recipientStatus && (
                  <span
                    className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background ${getStatusIndicator(
                      recipientStatus
                    )}`}
                  ></span>
                )}
              </div>
              <div>
                <h3 className="font-medium text-sm">{recipientName}</h3>
                <p className="text-xs text-muted-foreground">{formatStatus(recipientStatus || "offline")}</p>
              </div>
            </>
          ) : (
            <>
              <div className="relative">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={groupAvatar} alt={groupName} />
                  <AvatarFallback>{groupName?.charAt(0)}</AvatarFallback>
                </Avatar>
              </div>
              <div>
                <h3 className="font-medium text-sm flex items-center gap-1">
                  {groupName}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-5 w-5 ml-1 hover:bg-accent rounded-full">
                        <ChevronDown size={12} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-60">
                      <div className="p-2 space-y-2">
                        <p className="text-xs font-medium text-muted-foreground">Members ({groupMembers?.length || 0})</p>
                        <div className="max-h-40 overflow-y-auto space-y-1">
                          {groupMembers?.map((member) => (
                            <div key={member.id} className="flex items-center justify-between p-1 rounded-md hover:bg-accent">
                              <div className="flex items-center gap-2">
                                <div className="relative">
                                  <Avatar className="h-6 w-6">
                                    <AvatarImage src={member.avatar} alt={member.name} />
                                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <span
                                    className={`absolute bottom-0 right-0 h-2 w-2 rounded-full border-[1px] border-background ${getStatusIndicator(
                                      member.status
                                    )}`}
                                  ></span>
                                </div>
                                <span className="text-xs">{member.name}</span>
                              </div>
                              <span className="text-xs text-muted-foreground">{formatStatus(member.status)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </h3>
                <p className="text-xs text-muted-foreground">{groupMembers?.filter(m => m.status === "online").length || 0} online</p>
              </div>
            </>
          )}
        </div>

        <div className="flex items-center gap-1">
          {chatType === "direct" && (
            <>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                <Phone size={16} />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                <VideoIcon size={16} />
              </Button>
            </>
          )}
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
            <Search size={16} />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                <Info size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {chatType === "direct" ? (
                <>
                  <DropdownMenuItem className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>View Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Chat Settings</span>
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem className="cursor-pointer">
                    <Users className="mr-2 h-4 w-4" />
                    <span>Group Info</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <UserPlus className="mr-2 h-4 w-4" />
                    <span>Add Members</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Group Settings</span>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Messages area */}
      <ScrollArea className="flex-1 p-0">
        <div className="flex flex-col pt-4 pb-2">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              id={message.id}
              content={message.content}
              sender={message.sender}
              isCurrentUser={message.sender.id === currentUserId}
              timestamp={message.timestamp}
              isEdited={message.isEdited}
              reactions={message.reactions}
              replyTo={message.replyTo}
              mentions={message.mentions}
              onEdit={handleEditMessage}
              onDelete={handleDeleteMessage}
              onReply={handleReplyMessage}
              onReactionAdd={handleAddReaction}
              onReactionRemove={handleRemoveReaction}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input area */}
      <div className="border-t p-3">
        {/* Reply indicator */}
        {replyingTo && (
          <div className="mb-2 p-2 bg-muted/30 rounded-md border flex items-start justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">
                Replying to <span className="font-medium">{replyingTo.sender.name}</span>
              </span>
              <p className="text-xs truncate max-w-xs">{replyingTo.content}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5"
              onClick={() => setReplyingTo(null)}
            >
              <span className="text-lg leading-none">&times;</span>
            </Button>
          </div>
        )}

        {/* Edit indicator */}
        {isEditing && (
          <div className="mb-2 p-2 bg-muted/30 rounded-md border flex items-start justify-between">
            <div>
              <span className="text-xs text-muted-foreground">
                Editing message
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5"
              onClick={() => {
                setIsEditing(null);
                setMessage("");
              }}
            >
              <span className="text-lg leading-none">&times;</span>
            </Button>
          </div>
        )}

        {/* Input container */}
        <div className="flex items-end gap-2">
          {/* Attachment button */}
          <Popover
            open={isAttachmentMenuOpen}
            onOpenChange={setIsAttachmentMenuOpen}
          >
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-full flex-shrink-0"
              >
                <PaperclipIcon size={20} />
              </Button>
            </PopoverTrigger>
            <PopoverContent side="top" align="start" className="w-56 p-2">
              <div className="grid grid-cols-2 gap-1">
                <Button
                  variant="outline"
                  className="justify-start font-normal gap-2"
                  onClick={() => setIsAttachmentMenuOpen(false)}
                >
                  <Image size={16} />
                  <span>Image</span>
                </Button>
                <Button
                  variant="outline"
                  className="justify-start font-normal gap-2"
                  onClick={() => setIsAttachmentMenuOpen(false)}
                >
                  <FileIcon size={16} />
                  <span>Document</span>
                </Button>
                <Button
                  variant="outline"
                  className="justify-start font-normal gap-2"
                  onClick={() => setIsAttachmentMenuOpen(false)}
                >
                  <Video size={16} />
                  <span>Video</span>
                </Button>
                <Button
                  variant="outline"
                  className="justify-start font-normal gap-2"
                  onClick={() => setIsAttachmentMenuOpen(false)}
                >
                  <Gif size={16} />
                  <span>GIF</span>
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          {/* Main input area */}
          <div className="flex-1 bg-muted/30 rounded-md border overflow-hidden">
            <Textarea
              ref={textareaRef}
              placeholder={isEditing ? "Edit your message..." : "Type a message..."}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              className="min-h-[40px] max-h-[200px] resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
              rows={1}
              style={{ height: 'auto' }}
            />
          </div>

          {/* Emoji picker */}
          <Popover
            open={isEmojiPickerOpen}
            onOpenChange={setIsEmojiPickerOpen}
          >
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-full flex-shrink-0"
              >
                <Smile size={20} />
              </Button>
            </PopoverTrigger>
            <PopoverContent side="top" align="end" className="w-64 p-0">
              <Tabs defaultValue="smileys" className="w-full">
                <div className="flex items-center justify-between p-2 border-b">
                  <TabsList className="grid grid-cols-4">
                    {emojiCategories.map((category) => (
                      <TabsTrigger
                        key={category.name}
                        value={category.name.toLowerCase()}
                        className="px-2 py-1"
                      >
                        {category.emojis[0]}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  <div className="relative w-20 h-7">
                    <Input
                      placeholder="Search"
                      className="h-7 text-xs"
                    />
                    <Search className="h-3 w-3 absolute right-2 top-2 text-muted-foreground" />
                  </div>
                </div>
                
                {emojiCategories.map((category) => (
                  <TabsContent
                    key={category.name}
                    value={category.name.toLowerCase()}
                    className="p-2"
                  >
                    <div className="grid grid-cols-8 gap-1">
                      {category.emojis.map((emoji) => (
                        <button
                          key={emoji}
                          className="h-6 w-6 flex items-center justify-center text-lg hover:bg-accent rounded"
                          onClick={() => handleInsertEmoji(emoji)}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </PopoverContent>
          </Popover>

          {/* GIF button */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-full flex-shrink-0"
              >
                <Gif size={20} />
              </Button>
            </PopoverTrigger>
            <PopoverContent side="top" align="end" className="w-72 p-2">
              <div className="space-y-2">
                <div className="relative">
                  <Input
                    placeholder="Search GIFs..."
                    className="pr-8"
                  />
                  <Search className="h-4 w-4 absolute right-2 top-2 text-muted-foreground" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {gifCategories.map((category) => (
                    <div
                      key={category.name}
                      className="relative h-20 overflow-hidden rounded cursor-pointer hover:opacity-80 transition-opacity"
                    >
                      <img
                        src={category.preview}
                        alt={category.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <span className="text-white font-medium">{category.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Voice message button */}
          <Button
            variant={isMicRecording ? "destructive" : "ghost"}
            size="icon"
            className={`h-9 w-9 rounded-full flex-shrink-0 ${
              isMicRecording ? "animate-pulse" : ""
            }`}
            onClick={() => setIsMicRecording(!isMicRecording)}
          >
            <Mic size={20} />
          </Button>

          {/* Send button */}
          <Button
            size="icon"
            className="h-9 w-9 rounded-full flex-shrink-0"
            disabled={!message.trim() && !isMicRecording}
            onClick={handleSendMessage}
          >
            <Send size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
};
