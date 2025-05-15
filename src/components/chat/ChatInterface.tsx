
import React, { useState, useRef, useEffect } from "react";
import { Send, Paperclip, Mic, Image, Smile, X, MessageSquare, Filter } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Message type definition
interface Message {
  id: string;
  content: string;
  sender: string;
  senderName: string;
  senderAvatar?: string;
  timestamp: Date;
  isRead: boolean;
  attachments?: {
    type: 'image' | 'gif' | 'file';
    url: string;
    name?: string;
  }[];
}

// Chat interface props
interface ChatInterfaceProps {
  chatType: 'global' | 'direct' | 'group';
  recipientId?: string;
  recipientName?: string;
  recipientAvatar?: string;
  groupId?: string;
  groupName?: string;
  groupAvatar?: string;
  groupMembers?: Array<{id: string, name: string, avatar?: string}>;
}

// Mock user data - will be replaced with real data from Supabase
const currentUser = {
  id: 'current-user-id',
  name: 'You',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=current-user'
};

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  chatType,
  recipientId,
  recipientName,
  recipientAvatar,
  groupId,
  groupName,
  groupAvatar,
  groupMembers
}) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [isAttachingFile, setIsAttachingFile] = useState(false);
  const [isSearchingGif, setIsSearchingGif] = useState(false);
  const [gifSearchTerm, setGifSearchTerm] = useState("");
  const [gifResults, setGifResults] = useState<any[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isVoiceCallActive, setIsVoiceCallActive] = useState(false);
  const [userPreferences, setUserPreferences] = useState({
    doNotDisturb: false,
    ghostMode: false
  });
  
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Load mock messages
  useEffect(() => {
    // This would be replaced with a Supabase query in production
    const loadMessages = async () => {
      // Simulate loading delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Generate mock messages based on chat type
      const mockMessages: Message[] = [];
      
      if (chatType === 'global') {
        // Global chat mock data
        mockMessages.push(
          {
            id: '1',
            content: 'Welcome to the global chat!',
            sender: 'system',
            senderName: 'System',
            timestamp: new Date(Date.now() - 3600000),
            isRead: true
          },
          {
            id: '2',
            content: 'Hi everyone! I just joined this platform.',
            sender: 'user-1',
            senderName: 'Sarah',
            senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
            timestamp: new Date(Date.now() - 1800000),
            isRead: true
          },
          {
            id: '3',
            content: 'Welcome Sarah! Glad to have you here.',
            sender: 'user-2',
            senderName: 'Michael',
            senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
            timestamp: new Date(Date.now() - 1700000),
            isRead: true
          }
        );
      } else if (chatType === 'direct' && recipientId) {
        // Direct chat mock data
        mockMessages.push(
          {
            id: '1',
            content: `Hi there! How are you doing today?`,
            sender: recipientId,
            senderName: recipientName || 'User',
            senderAvatar: recipientAvatar,
            timestamp: new Date(Date.now() - 3600000),
            isRead: true
          },
          {
            id: '2',
            content: "I'm doing well, thanks for asking! How about you?",
            sender: currentUser.id,
            senderName: currentUser.name,
            senderAvatar: currentUser.avatar,
            timestamp: new Date(Date.now() - 3500000),
            isRead: true
          },
          {
            id: '3',
            content: "Great! I was wondering if you'd be interested in joining our study group?",
            sender: recipientId,
            senderName: recipientName || 'User',
            senderAvatar: recipientAvatar,
            timestamp: new Date(Date.now() - 3400000),
            isRead: true
          }
        );
      } else if (chatType === 'group' && groupId) {
        // Group chat mock data
        mockMessages.push(
          {
            id: '1',
            content: `Welcome to ${groupName || 'the group'}!`,
            sender: 'system',
            senderName: 'System',
            timestamp: new Date(Date.now() - 86400000),
            isRead: true
          },
          {
            id: '2',
            content: 'Hi everyone! Excited to be part of this group.',
            sender: 'user-1',
            senderName: 'Emma',
            senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
            timestamp: new Date(Date.now() - 3600000),
            isRead: true
          },
          {
            id: '3',
            content: "I've shared some interesting resources in the library.",
            sender: 'user-2',
            senderName: 'James',
            senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
            timestamp: new Date(Date.now() - 1800000),
            isRead: true
          }
        );
      }
      
      setMessages(mockMessages);
    };
    
    loadMessages();
  }, [chatType, recipientId, recipientName, recipientAvatar, groupId, groupName]);
  
  // Auto scroll to bottom when new messages come in
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);
  
  // Send a message
  const handleSendMessage = () => {
    if (!message.trim() && !isAttachingFile) return;
    
    // Demo implementation - would be replaced with actual Supabase message sending
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      content: message,
      sender: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      timestamp: new Date(),
      isRead: false
    };
    
    setMessages([...messages, newMessage]);
    setMessage("");
    
    // Show toast notification for demonstration
    if (!userPreferences.doNotDisturb) {
      toast({
        title: "Message sent",
        description: "Your message was delivered.",
      });
    }
  };
  
  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  // Simulate voice recording
  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      toast({
        title: "Voice recording sent",
        description: "Your voice message was delivered.",
      });
      
      // Add voice message to chat
      const newMessage: Message = {
        id: `voice-${Date.now()}`,
        content: "[Voice Message]",
        sender: currentUser.id,
        senderName: currentUser.name,
        senderAvatar: currentUser.avatar,
        timestamp: new Date(),
        isRead: false,
        attachments: [
          {
            type: 'file',
            url: '#',
            name: 'voice-message.mp3'
          }
        ]
      };
      
      setMessages([...messages, newMessage]);
    } else {
      setIsRecording(true);
      toast({
        title: "Recording started",
        description: "Speak now. Click again to stop and send.",
      });
    }
  };
  
  // Handle emoji selection
  const handleEmojiSelect = (emoji: any) => {
    setMessage(prev => prev + emoji.native);
    setIsEmojiPickerOpen(false);
  };
  
  // Handle file attachment
  const handleFileAttachment = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    // In a real implementation, we would upload the file to storage
    // For demo purposes, just show a toast
    toast({
      title: "File attached",
      description: `${files[0].name} added to your message.`,
    });
    
    // Add file message to chat
    const newMessage: Message = {
      id: `file-${Date.now()}`,
      content: "[File Attachment]",
      sender: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      timestamp: new Date(),
      isRead: false,
      attachments: [
        {
          type: 'file',
          url: '#',
          name: files[0].name
        }
      ]
    };
    
    setMessages([...messages, newMessage]);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // Search for GIFs using Tenor
  const searchGifs = async () => {
    if (!gifSearchTerm) return;
    
    // In a real implementation, we would call the Tenor API
    // For demo purposes, use mock data
    const mockGifs = [
      { id: '1', url: 'https://media.tenor.com/images/sample1.gif', preview: 'https://media.tenor.com/images/sample1_preview.gif' },
      { id: '2', url: 'https://media.tenor.com/images/sample2.gif', preview: 'https://media.tenor.com/images/sample2_preview.gif' },
      { id: '3', url: 'https://media.tenor.com/images/sample3.gif', preview: 'https://media.tenor.com/images/sample3_preview.gif' },
    ];
    
    setGifResults(mockGifs);
  };
  
  // Select a GIF
  const selectGif = (gif: any) => {
    // Add GIF message to chat
    const newMessage: Message = {
      id: `gif-${Date.now()}`,
      content: "[GIF]",
      sender: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      timestamp: new Date(),
      isRead: false,
      attachments: [
        {
          type: 'gif',
          url: gif.url
        }
      ]
    };
    
    setMessages([...messages, newMessage]);
    setIsSearchingGif(false);
    setGifSearchTerm("");
  };
  
  // Simulate voice call
  const toggleVoiceCall = () => {
    setIsVoiceCallActive(!isVoiceCallActive);
    
    if (!isVoiceCallActive) {
      toast({
        title: "Voice call started",
        description: `Calling ${recipientName || groupName || 'Chat'}...`,
      });
    } else {
      toast({
        title: "Call ended",
        description: "Voice call has ended.",
      });
    }
  };
  
  // Toggle do not disturb mode
  const toggleDoNotDisturb = () => {
    setUserPreferences(prev => ({
      ...prev,
      doNotDisturb: !prev.doNotDisturb
    }));
    
    toast({
      title: userPreferences.doNotDisturb ? "Notifications enabled" : "Do not disturb enabled",
      description: userPreferences.doNotDisturb 
        ? "You will now receive notifications." 
        : "Notifications are now silenced.",
    });
  };
  
  // Toggle ghost mode
  const toggleGhostMode = () => {
    setUserPreferences(prev => ({
      ...prev,
      ghostMode: !prev.ghostMode
    }));
    
    toast({
      title: userPreferences.ghostMode ? "Ghost mode disabled" : "Ghost mode enabled",
      description: userPreferences.ghostMode 
        ? "Your online status is now visible." 
        : "Your online status is now hidden.",
    });
  };
  
  // Get chat header title based on chat type
  const getChatHeaderTitle = () => {
    if (chatType === 'global') return 'Global Chat';
    if (chatType === 'direct') return recipientName || 'Direct Message';
    if (chatType === 'group') return groupName || 'Group Chat';
    return 'Chat';
  };
  
  // Get chat header avatar based on chat type
  const getChatHeaderAvatar = () => {
    if (chatType === 'direct') return recipientAvatar;
    if (chatType === 'group') return groupAvatar;
    return undefined;
  };
  
  return (
    <div className="flex flex-col h-full">
      {/* Chat header */}
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={getChatHeaderAvatar()} />
            <AvatarFallback>
              {chatType === 'global' ? 'GC' : chatType === 'direct' ? (recipientName?.charAt(0) || 'DM') : (groupName?.charAt(0) || 'GR')}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium">{getChatHeaderTitle()}</h3>
            {chatType === 'direct' && (
              <p className="text-xs text-muted-foreground">
                {userPreferences.ghostMode ? 'Status hidden' : 'Online'}
              </p>
            )}
            {chatType === 'group' && groupMembers && (
              <p className="text-xs text-muted-foreground">
                {groupMembers.length} members
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {chatType === 'direct' && (
            <Button 
              variant="ghost" 
              size="icon"
              className={isVoiceCallActive ? "bg-red-500 text-white hover:bg-red-700" : ""}
              onClick={toggleVoiceCall}
              title={isVoiceCallActive ? "End call" : "Start voice call"}
            >
              <Mic size={18} />
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Filter size={18} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={toggleDoNotDisturb}>
                {userPreferences.doNotDisturb ? "Enable notifications" : "Do not disturb"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={toggleGhostMode}>
                {userPreferences.ghostMode ? "Show online status" : "Enable ghost mode"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast({ title: "Search clicked" })}>
                Search in conversation
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast({ title: "Clear clicked" })}>
                Clear conversation
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Chat messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <MessageSquare size={24} className="text-primary" />
            </div>
            <h3 className="font-medium mb-2">No messages yet</h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              Start a conversation by sending a message below.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex ${msg.sender === currentUser.id ? 'justify-end' : 'justify-start'}`}
              >
                <div className="flex gap-2 max-w-[70%]">
                  {msg.sender !== currentUser.id && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={msg.senderAvatar} />
                      <AvatarFallback>{msg.senderName.charAt(0)}</AvatarFallback>
                    </Avatar>
                  )}
                  <div>
                    {msg.sender !== currentUser.id && (
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium">{msg.senderName}</span>
                        <span className="text-xs text-muted-foreground">
                          {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    )}
                    <div 
                      className={`rounded-lg p-3 ${
                        msg.sender === currentUser.id 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted'
                      }`}
                    >
                      {msg.content}
                      {msg.attachments && msg.attachments.length > 0 && (
                        <div className="mt-2">
                          {msg.attachments.map((attachment, index) => (
                            <div key={index}>
                              {attachment.type === 'image' && (
                                <img 
                                  src={attachment.url} 
                                  alt="attachment" 
                                  className="w-full max-h-60 object-cover rounded"
                                />
                              )}
                              {attachment.type === 'gif' && (
                                <img 
                                  src={attachment.url} 
                                  alt="GIF" 
                                  className="w-full max-h-60 object-cover rounded"
                                />
                              )}
                              {attachment.type === 'file' && (
                                <div className="flex items-center gap-2 p-2 bg-background/50 rounded">
                                  <Paperclip size={16} />
                                  <span className="text-sm">{attachment.name || "File attachment"}</span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    {msg.sender === currentUser.id && (
                      <div className="flex justify-end mt-1">
                        <span className="text-xs text-muted-foreground">
                          {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          {msg.isRead && (
                            <span className="ml-1 text-primary">✓</span>
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
      
      {/* Chat input */}
      <div className="p-4 border-t">
        {isVoiceCallActive && (
          <div className="bg-red-500 text-white p-3 rounded-lg mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mic size={18} />
              <span>Call in progress</span>
            </div>
            <Button variant="ghost" size="sm" className="text-white hover:text-white hover:bg-red-700" onClick={toggleVoiceCall}>
              End Call
            </Button>
          </div>
        )}
        
        {isSearchingGif && (
          <div className="border rounded-lg p-3 mb-3">
            <div className="flex items-center gap-2 mb-3">
              <Input
                type="text"
                placeholder="Search for GIFs..."
                value={gifSearchTerm}
                onChange={(e) => setGifSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && searchGifs()}
              />
              <Button size="sm" onClick={searchGifs}>Search</Button>
              <Button size="icon" variant="ghost" onClick={() => setIsSearchingGif(false)}>
                <X size={16} />
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto">
              {gifResults.map((gif) => (
                <div 
                  key={gif.id}
                  className="aspect-square bg-muted rounded cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => selectGif(gif)}
                >
                  <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                    [GIF Preview]
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <Input
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              className="pr-10"
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8" 
                onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
              >
                <Smile size={16} />
              </Button>
            </div>
            {isEmojiPickerOpen && (
              <div className="absolute bottom-full right-0 mb-2 z-10">
                <Picker 
                  data={data} 
                  onEmojiSelect={handleEmojiSelect} 
                  theme="dark"
                />
              </div>
            )}
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" onClick={() => setIsSearchingGif(true)}>
                <Image size={16} />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Search GIFs</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4">
                <Input
                  placeholder="Search GIFs..."
                  value={gifSearchTerm}
                  onChange={(e) => setGifSearchTerm(e.target.value)}
                />
                <Button onClick={searchGifs}>Search</Button>
                <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto">
                  {/* This would be populated with actual GIF results */}
                  <div className="aspect-video bg-muted rounded"></div>
                  <div className="aspect-video bg-muted rounded"></div>
                  <div className="aspect-video bg-muted rounded"></div>
                  <div className="aspect-video bg-muted rounded"></div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          <input 
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
          <Button variant="ghost" size="icon" onClick={handleFileAttachment}>
            <Paperclip size={16} />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon"
            className={isRecording ? "text-red-500" : ""}
            onClick={toggleRecording}
          >
            <Mic size={16} />
            {isRecording && (
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
            )}
          </Button>
          
          <Button onClick={handleSendMessage}>
            <Send size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};
