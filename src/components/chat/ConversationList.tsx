
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Search, Plus, Users, Globe, User } from "lucide-react";
import { cn } from "@/lib/utils";

export type Conversation = {
  id: string;
  name: string;
  avatar: string;
  status: "online" | "offline" | "away" | "do_not_disturb";
  lastMessage?: string;
  lastMessageTime?: string;
  unread?: number;
  isPinned?: boolean;
  members?: number;
  description?: string;
};

interface ConversationListProps {
  onSelectConversation: (conversation: Conversation, type: 'direct' | 'group' | 'global') => void;
  selectedConversationId?: string;
  conversationType: 'direct' | 'group' | 'global';
}

export const ConversationList = ({ 
  onSelectConversation, 
  selectedConversationId,
  conversationType
}: ConversationListProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [directConversations, setDirectConversations] = useState<Conversation[]>([]);
  const [groupConversations, setGroupConversations] = useState<Conversation[]>([]);
  const [globalConversations, setGlobalConversations] = useState<Conversation[]>([]);
  const [activeTab, setActiveTab] = useState<'direct' | 'group' | 'global'>(conversationType);

  // Mock data - would be fetched from an API in a real app
  useEffect(() => {
    // Direct conversations
    setDirectConversations([
      {
        id: "1",
        name: "Alex Morgan",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
        status: "online",
        lastMessage: "Let's discuss that research paper",
        lastMessageTime: "10:42 AM",
        unread: 2,
        isPinned: true
      },
      {
        id: "2",
        name: "Samantha Lee",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Samantha",
        status: "away",
        lastMessage: "I found some interesting resources on quantum computing",
        lastMessageTime: "Yesterday",
        isPinned: false
      },
      {
        id: "3",
        name: "Marcus Chen",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus",
        status: "offline",
        lastMessage: "Thanks for sharing your insights",
        lastMessageTime: "2d ago",
        isPinned: false
      }
    ]);

    // Group conversations
    setGroupConversations([
      {
        id: "g1",
        name: "Quantum Physics Study",
        avatar: "https://api.dicebear.com/7.x/identicon/svg?seed=Quantum",
        status: "online",
        lastMessage: "I think that experiment could work...",
        lastMessageTime: "11:30 AM",
        members: 12,
        description: "A group for discussing quantum mechanics"
      },
      {
        id: "g2",
        name: "Philosophy Circle",
        avatar: "https://api.dicebear.com/7.x/identicon/svg?seed=Philosophy",
        status: "online",
        lastMessage: "Interesting point about consciousness...",
        lastMessageTime: "Yesterday",
        members: 28,
        description: "Discussion of philosophical topics"
      }
    ]);

    // Global conversations
    setGlobalConversations([
      {
        id: "global-1",
        name: "General",
        avatar: "https://api.dicebear.com/7.x/identicon/svg?seed=General",
        status: "online",
        lastMessage: "Welcome to the community!",
        lastMessageTime: "12:05 PM",
        members: 324,
        description: "Public chat for all members"
      },
      {
        id: "global-2",
        name: "Knowledge Sharing",
        avatar: "https://api.dicebear.com/7.x/identicon/svg?seed=Knowledge",
        status: "online",
        lastMessage: "Check out this interesting article...",
        lastMessageTime: "3h ago",
        members: 256,
        description: "Share interesting resources"
      }
    ]);
  }, []);

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value as 'direct' | 'group' | 'global');
  };

  // Filter conversations based on search query
  const filteredDirectConversations = directConversations.filter(conversation =>
    conversation.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredGroupConversations = groupConversations.filter(conversation =>
    conversation.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredGlobalConversations = globalConversations.filter(conversation =>
    conversation.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Function to determine the color of the status indicator
  const getStatusColor = (status: "online" | "offline" | "away" | "do_not_disturb") => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "offline":
        return "bg-gray-500";
      case "away":
        return "bg-yellow-500";
      case "do_not_disturb":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="w-80 border-r bg-muted/10 flex flex-col h-full">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Messages</h2>
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-accent hover:text-accent-foreground">
            <Plus size={18} />
          </Button>
        </div>
        <div className="relative">
          <Search size={16} className="absolute left-2.5 top-2.5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search conversations..."
            className="pl-8 bg-background"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <Tabs defaultValue={activeTab} onValueChange={handleTabChange} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="direct" className="flex items-center gap-1">
            <User size={14} />
            <span className="hidden sm:inline">Direct</span>
          </TabsTrigger>
          <TabsTrigger value="group" className="flex items-center gap-1">
            <Users size={14} />
            <span className="hidden sm:inline">Groups</span>
          </TabsTrigger>
          <TabsTrigger value="global" className="flex items-center gap-1">
            <Globe size={14} />
            <span className="hidden sm:inline">Global</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="direct" className="flex-1 m-0 overflow-hidden">
          <ScrollArea className="h-full">
            {filteredDirectConversations.length > 0 ? (
              <div className="py-2">
                {filteredDirectConversations.map((conversation) => (
                  <Button
                    key={conversation.id}
                    variant="ghost"
                    className={cn(
                      "flex items-center justify-start w-full p-3 gap-3 h-auto",
                      selectedConversationId === conversation.id && activeTab === "direct"
                        ? "bg-accent text-accent-foreground"
                        : "hover:bg-accent/50"
                    )}
                    onClick={() => onSelectConversation(conversation, 'direct')}
                  >
                    <div className="relative flex-shrink-0">
                      <Avatar>
                        <AvatarImage src={conversation.avatar} alt={conversation.name} />
                        <AvatarFallback>{conversation.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span 
                        className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background ${getStatusColor(conversation.status)}`}
                      ></span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between">
                        <span className="font-medium truncate">{conversation.name}</span>
                        <span className="text-xs text-muted-foreground">{conversation.lastMessageTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <p className="text-sm text-muted-foreground truncate max-w-[120px]">
                          {conversation.lastMessage}
                        </p>
                        {conversation.unread && (
                          <span className="flex items-center justify-center h-5 min-w-5 rounded-full bg-primary text-primary-foreground text-xs">
                            {conversation.unread}
                          </span>
                        )}
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full p-4 text-center">
                <div className="flex flex-col items-center">
                  <User size={32} className="text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">No conversations found</p>
                </div>
              </div>
            )}
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="group" className="flex-1 m-0 overflow-hidden">
          <ScrollArea className="h-full">
            {filteredGroupConversations.length > 0 ? (
              <div className="py-2">
                {filteredGroupConversations.map((conversation) => (
                  <Button
                    key={conversation.id}
                    variant="ghost"
                    className={cn(
                      "flex items-center justify-start w-full p-3 gap-3 h-auto",
                      selectedConversationId === conversation.id && activeTab === "group"
                        ? "bg-accent text-accent-foreground"
                        : "hover:bg-accent/50"
                    )}
                    onClick={() => onSelectConversation(conversation, 'group')}
                  >
                    <Avatar>
                      <AvatarImage src={conversation.avatar} alt={conversation.name} />
                      <AvatarFallback>{conversation.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between">
                        <span className="font-medium truncate">{conversation.name}</span>
                        <span className="text-xs text-muted-foreground">{conversation.lastMessageTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Users size={12} className="mr-1" />
                          <span>{conversation.members} members</span>
                        </div>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full p-4 text-center">
                <div className="flex flex-col items-center">
                  <Users size={32} className="text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">No group chats found</p>
                  <Button variant="outline" size="sm" className="mt-4">
                    <Plus size={14} className="mr-1" />
                    Create Group
                  </Button>
                </div>
              </div>
            )}
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="global" className="flex-1 m-0 overflow-hidden">
          <ScrollArea className="h-full">
            {filteredGlobalConversations.length > 0 ? (
              <div className="py-2">
                {filteredGlobalConversations.map((conversation) => (
                  <Button
                    key={conversation.id}
                    variant="ghost"
                    className={cn(
                      "flex items-center justify-start w-full p-3 gap-3 h-auto",
                      selectedConversationId === conversation.id && activeTab === "global"
                        ? "bg-accent text-accent-foreground"
                        : "hover:bg-accent/50"
                    )}
                    onClick={() => onSelectConversation(conversation, 'global')}
                  >
                    <Avatar>
                      <AvatarImage src={conversation.avatar} alt={conversation.name} />
                      <AvatarFallback>{conversation.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between">
                        <span className="font-medium truncate">{conversation.name}</span>
                        <span className="text-xs text-muted-foreground">{conversation.lastMessageTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <p className="text-sm text-muted-foreground truncate max-w-[150px]">
                          {conversation.description}
                        </p>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full p-4 text-center">
                <div className="flex flex-col items-center">
                  <Globe size={32} className="text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">No global chats found</p>
                </div>
              </div>
            )}
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};
