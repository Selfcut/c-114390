
import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, MessageSquare, X, Send, SmilePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { publishChatSidebarToggle } from "@/lib/utils/event-utils";
import { useAuth } from "@/lib/auth-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface ChatMessage {
  id: string;
  sender: {
    id?: string;
    name: string;
    avatar: string;
    isSystem?: boolean;
  };
  content: string;
  timestamp: Date;
}

export interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  unread: number;
  isGlobal?: boolean;
  isGroup?: boolean;
}

export const FullHeightChatSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: "global",
      name: "Global Chat",
      avatar: "/placeholder.svg",
      lastMessage: "Welcome to the Polymath community!",
      unread: 0,
      isGlobal: true
    },
    {
      id: "philosophy", 
      name: "Philosophy Group",
      avatar: "/placeholder.svg",
      lastMessage: "What's everyone's take on existentialism?",
      unread: 0,
      isGroup: true
    }
  ]);
  const { user, isAuthenticated } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState("global"); // Default to Global Chat
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const messagesSubscriptionRef = useRef<any>(null);
  
  // Emoji data for quick selection
  const emojiCategories = [
    {
      name: "Smileys",
      emojis: ["😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇"]
    },
    {
      name: "Gestures",
      emojis: ["👍", "👎", "👌", "✌️", "🤞", "🤟", "🤙", "👋", "🤚", "✋"]
    },
    {
      name: "Objects",
      emojis: ["📚", "💡", "🔍", "🧠", "📝", "📊", "🌐", "💭", "🎓", "⏱️"]
    }
  ];

  // Toggle sidebar
  const toggleSidebar = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    publishChatSidebarToggle(newState);
  };
  
  // Fetch messages for the selected conversation
  useEffect(() => {
    const fetchMessages = async () => {
      setIsLoading(true);
      
      try {
        // Fetch messages for the selected conversation
        const { data, error } = await supabase
          .from('chat_messages')
          .select(`
            id,
            content,
            created_at,
            user_id,
            sender_name,
            conversation_id
          `)
          .eq("conversation_id", selectedConversation)
          .order("created_at", { ascending: true })
          .limit(50);

        if (error) {
          console.error("Error fetching messages:", error);
          toast({
            title: "Failed to load messages",
            description: error.message,
            variant: "destructive",
          });
          return;
        }

        // Transform data into ChatMessage format
        const messagesWithProfiles = await Promise.all(data.map(async (msg) => {
          let userName = msg.sender_name || "Anonymous User";
          let avatarUrl = `https://api.dicebear.com/7.x/personas/svg?seed=${msg.user_id || msg.sender_name || "anonymous"}`;
          
          // If we have a user_id, try to fetch their profile
          if (msg.user_id) {
            const { data: profileData } = await supabase
              .from('profiles')
              .select('name, avatar_url')
              .eq('id', msg.user_id)
              .maybeSingle();
              
            if (profileData) {
              userName = profileData.name || userName;
              avatarUrl = profileData.avatar_url || avatarUrl;
            }
          }
          
          return {
            id: msg.id,
            sender: {
              id: msg.user_id,
              name: userName,
              avatar: avatarUrl,
            },
            content: msg.content,
            timestamp: new Date(msg.created_at)
          } as ChatMessage;
        }));

        setMessages(messagesWithProfiles);
      } catch (err) {
        console.error("Error in messages fetch:", err);
      } finally {
        setIsLoading(false);
      }
    };

    // Only fetch messages if we have a selected conversation
    if (selectedConversation) {
      fetchMessages();
      
      // Set up real-time subscription for new messages
      if (messagesSubscriptionRef.current) {
        messagesSubscriptionRef.current.unsubscribe();
      }
      
      messagesSubscriptionRef.current = supabase
        .channel(`chat_${selectedConversation}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'chat_messages',
            filter: `conversation_id=eq.${selectedConversation}`
          },
          async (payload) => {
            // Fetch user profile for the new message
            let userName = payload.new.sender_name || "Anonymous User";
            let avatarUrl = `https://api.dicebear.com/7.x/personas/svg?seed=${payload.new.user_id || payload.new.sender_name || "anonymous"}`;
            
            if (payload.new.user_id) {
              const { data: profileData } = await supabase
                .from('profiles')
                .select('name, avatar_url')
                .eq('id', payload.new.user_id)
                .maybeSingle();
                
              if (profileData) {
                userName = profileData.name || userName;
                avatarUrl = profileData.avatar_url || avatarUrl;
              }
            }
            
            // Add the new message to the state
            const newMessage: ChatMessage = {
              id: payload.new.id,
              sender: {
                id: payload.new.user_id,
                name: userName,
                avatar: avatarUrl,
              },
              content: payload.new.content,
              timestamp: new Date(payload.new.created_at)
            };
            
            setMessages(prev => [...prev, newMessage]);
          }
        )
        .subscribe();
    }
    
    // Cleanup subscription on unmount or when conversation changes
    return () => {
      if (messagesSubscriptionRef.current) {
        messagesSubscriptionRef.current.unsubscribe();
      }
    };
  }, [selectedConversation]);

  // Scroll to bottom on new messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768 && isOpen) {
        setIsOpen(false);
        publishChatSidebarToggle(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    try {
      // For authenticated users, send with their ID
      if (isAuthenticated && user) {
        const { error } = await supabase
          .from('chat_messages')
          .insert({
            conversation_id: selectedConversation,
            user_id: user.id,
            content: message
          });

        if (error) {
          console.error("Error sending message:", error);
          toast({
            title: "Failed to send message",
            description: error.message,
            variant: "destructive",
          });
          return;
        }
      } else {
        // For guests, send as anonymous
        const { error } = await supabase
          .from('chat_messages')
          .insert({
            conversation_id: selectedConversation,
            user_id: "00000000-0000-0000-0000-000000000000", // Guest user ID
            content: message,
            sender_name: "Guest User"
          });

        if (error) {
          console.error("Error sending message:", error);
          toast({
            title: "Failed to send message",
            description: error.message,
            variant: "destructive",
          });
          return;
        }

        // For guests, we need to manually add the message since they may not have
        // subscription permissions to see their own messages in real-time
        const newMessage: ChatMessage = {
          id: `local-${Date.now()}`,
          sender: {
            name: "Guest User",
            avatar: "https://api.dicebear.com/7.x/personas/svg?seed=Guest"
          },
          content: message,
          timestamp: new Date()
        };
        
        setMessages([...messages, newMessage]);
      }

      // Clear input after successful send
      setMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat("en", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(date);
  };

  const handleInsertEmoji = (emoji: string) => {
    setMessage((prev) => prev + emoji);
  };

  const handleSelectConversation = (id: string) => {
    setSelectedConversation(id);
  };

  return (
    <>
      {/* Chat toggle button (visible when sidebar is closed) */}
      {!isOpen && (
        <Button
          onClick={toggleSidebar}
          className="fixed bottom-6 right-6 rounded-full h-14 w-14 shadow-lg z-50 bg-primary hover:bg-primary/90"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      )}

      {/* Chat sidebar */}
      <aside 
        className={`fixed top-0 right-0 h-full bg-background border-l border-border w-[350px] transform transition-transform duration-300 ease-in-out z-40 shadow-lg flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="border-b p-3 flex justify-between items-center">
          <h2 className="text-lg font-semibold flex items-center">
            <MessageSquare className="mr-2 h-5 w-5" />
            Community Chat
          </h2>
          <Button variant="ghost" size="icon" onClick={toggleSidebar}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Conversations list */}
        <div className="border-b p-2">
          <ScrollArea className="h-[120px]">
            <div className="space-y-2">
              {conversations.map((convo) => (
                <Card 
                  key={convo.id} 
                  className={`p-2 hover:bg-accent/30 cursor-pointer ${selectedConversation === convo.id ? 'bg-accent/50' : ''}`}
                  onClick={() => handleSelectConversation(convo.id)}
                >
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={convo.avatar} alt={convo.name} />
                      <AvatarFallback>{convo.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <div className="font-medium text-sm flex items-center">
                          {convo.name}
                          {convo.isGlobal && (
                            <Badge variant="secondary" className="ml-2 text-xs">Global</Badge>
                          )}
                          {convo.isGroup && (
                            <Badge variant="outline" className="ml-2 text-xs">Group</Badge>
                          )}
                        </div>
                        {convo.unread > 0 && (
                          <Badge className="bg-primary">{convo.unread}</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Messages area */}
        <ScrollArea className="flex-1 p-3">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-2 animate-pulse">
                  <div className="h-8 w-8 bg-muted rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-muted rounded w-24 mb-2"></div>
                    <div className="h-3 bg-muted rounded w-full"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : messages.length > 0 ? (
            <div className="space-y-3">
              {messages.map((msg) => (
                <div key={msg.id} className="flex gap-2">
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarImage src={msg.sender.avatar} />
                    <AvatarFallback>{msg.sender.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`font-medium text-sm ${msg.sender.isSystem ? 'text-primary' : ''}`}>
                        {msg.sender.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatTime(msg.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm break-words">{msg.content}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center p-4">
                <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4 opacity-50" />
                <h3 className="font-medium mb-1">No messages yet</h3>
                <p className="text-sm text-muted-foreground">Be the first to start the conversation!</p>
              </div>
            </div>
          )}
        </ScrollArea>

        {/* Input area */}
        <div className="border-t p-3">
          <div className="flex items-end gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full flex-shrink-0">
                  <SmilePlus size={20} />
                </Button>
              </PopoverTrigger>
              <PopoverContent side="top" align="start" className="w-64 p-0">
                <Tabs defaultValue="Smileys">
                  <TabsList className="grid grid-cols-3">
                    {emojiCategories.map((category) => (
                      <TabsTrigger key={category.name} value={category.name}>
                        {category.emojis[0]}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  {emojiCategories.map((category) => (
                    <TabsContent key={category.name} value={category.name} className="p-2">
                      <div className="grid grid-cols-8 gap-1">
                        {category.emojis.map((emoji) => (
                          <button
                            key={emoji}
                            className="h-8 w-8 flex items-center justify-center text-lg hover:bg-accent rounded"
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
            
            <Textarea
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              className="min-h-[40px] max-h-[120px] resize-none"
              rows={1}
            />
            
            <Button
              onClick={handleSendMessage}
              disabled={!message.trim()}
              size="icon"
              className="h-9 w-9 rounded-full flex-shrink-0"
            >
              <Send size={18} />
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
};
