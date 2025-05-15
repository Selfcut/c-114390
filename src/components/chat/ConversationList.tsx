
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Plus, MessageSquare, Users, Globe, UserPlus, Settings } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export interface Conversation {
  id: string;
  name: string;
  avatar: string;
  status?: string;
  lastMessage?: string;
  unread?: number;
  timestamp?: Date;
  isOnline?: boolean;
  members?: Array<{ id: string; name: string; avatar: string }>;
}

interface ConversationListProps {
  onSelectConversation: (conversation: Conversation, type: 'direct' | 'group' | 'global') => void;
  selectedConversationId?: string;
  conversationType: 'direct' | 'group' | 'global';
}

// Mock direct conversations
const directConversations: Conversation[] = [
  {
    id: 'direct-user1',
    name: 'Jane Smith',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
    status: 'online',
    lastMessage: 'Hey! How are you doing today?',
    unread: 2,
    timestamp: new Date(Date.now() - 1000 * 60 * 10), // 10 minutes ago
    isOnline: true
  },
  {
    id: 'direct-user2',
    name: 'Alex Johnson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    status: 'away',
    lastMessage: 'Did you see that new research paper?',
    unread: 0,
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    isOnline: true
  },
  {
    id: 'direct-user3',
    name: 'Michael Chen',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
    status: 'offline',
    lastMessage: 'Let\'s meet tomorrow to discuss the project',
    unread: 0,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    isOnline: false
  },
  {
    id: 'direct-user4',
    name: 'Emily Wilson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
    status: 'do_not_disturb',
    lastMessage: 'Thanks for sharing that article',
    unread: 0,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
    isOnline: true
  }
];

// Mock group conversations
const groupConversations: Conversation[] = [
  {
    id: 'group-1',
    name: 'Quantum Physics Club',
    avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=quantum',
    lastMessage: 'Jane: Did anyone read the latest paper on quantum entanglement?',
    unread: 5,
    timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
    members: [
      { id: 'user1', name: 'Jane Smith', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane' },
      { id: 'user2', name: 'Alex Johnson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex' },
      { id: 'user3', name: 'Michael Chen', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael' },
      { id: 'user4', name: 'Emily Wilson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily' }
    ]
  },
  {
    id: 'group-2',
    name: 'Philosophy Discussion',
    avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=philosophy',
    lastMessage: 'Alex: Consciousness is an emergent property of complex systems',
    unread: 0,
    timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
    members: [
      { id: 'user2', name: 'Alex Johnson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex' },
      { id: 'user3', name: 'Michael Chen', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael' },
      { id: 'user5', name: 'Sarah Lee', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' }
    ]
  },
  {
    id: 'group-3',
    name: 'Math Enthusiasts',
    avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=math',
    lastMessage: 'You: I\'ll share my notes from the last lecture',
    unread: 0,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    members: [
      { id: 'user1', name: 'Jane Smith', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane' },
      { id: 'user4', name: 'Emily Wilson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily' },
      { id: 'user6', name: 'David Kim', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David' }
    ]
  }
];

// Global channels
const globalConversations: Conversation[] = [
  {
    id: 'global-general',
    name: 'General Discussion',
    avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=general',
    lastMessage: 'Emily: Welcome to all new members!',
    unread: 3,
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
  },
  {
    id: 'global-announcements',
    name: 'Announcements',
    avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=announcements',
    lastMessage: 'Admin: New features have been added to the platform',
    unread: 1,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
  },
  {
    id: 'global-help',
    name: 'Help & Support',
    avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=help',
    lastMessage: 'Support: Check out our FAQ section for common questions',
    unread: 0,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
  }
];

// Status badges
const getStatusBadge = (status: string) => {
  switch (status) {
    case 'online':
      return <div className="w-3 h-3 bg-green-500 rounded-full absolute bottom-0 right-0 border-2 border-background" />;
    case 'away':
      return <div className="w-3 h-3 bg-yellow-500 rounded-full absolute bottom-0 right-0 border-2 border-background" />;
    case 'do_not_disturb':
      return <div className="w-3 h-3 bg-red-500 rounded-full absolute bottom-0 right-0 border-2 border-background" />;
    default:
      return <div className="w-3 h-3 bg-gray-500 rounded-full absolute bottom-0 right-0 border-2 border-background" />;
  }
};

export const ConversationList: React.FC<ConversationListProps> = ({
  onSelectConversation,
  selectedConversationId,
  conversationType
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<'direct' | 'group' | 'global'>(conversationType);
  
  // Filter conversations based on search term
  const filteredDirects = directConversations.filter(
    conv => conv.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredGroups = groupConversations.filter(
    conv => conv.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredGlobals = globalConversations.filter(
    conv => conv.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value as 'direct' | 'group' | 'global');
  };
  
  // Format timestamp for display
  const formatTimestamp = (timestamp?: Date) => {
    if (!timestamp) return '';
    
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    
    // Less than a day
    if (diff < 1000 * 60 * 60 * 24) {
      return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // Less than a week
    if (diff < 1000 * 60 * 60 * 24 * 7) {
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      return days[timestamp.getDay()];
    }
    
    // More than a week
    return timestamp.toLocaleDateString();
  };

  // Truncate a message to a certain length
  const truncateMessage = (message?: string, length = 30) => {
    if (!message) return '';
    return message.length > length ? `${message.substring(0, length)}...` : message;
  };

  return (
    <div className="w-80 border-r flex flex-col h-full bg-muted/20">
      <div className="p-3 border-b">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-lg">Messages</h2>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                  <Settings size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Chat Settings</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search conversations..."
            className="pl-8 bg-muted/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <Tabs 
        defaultValue={activeTab} 
        value={activeTab}
        onValueChange={handleTabChange}
        className="flex-1 flex flex-col"
      >
        <div className="border-b">
          <TabsList className="grid grid-cols-3 p-0 h-auto">
            <TabsTrigger 
              value="direct" 
              className="py-2 px-0 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none"
              onClick={() => setActiveTab('direct')}
            >
              <MessageSquare size={16} className="mr-1" />
              Direct
            </TabsTrigger>
            
            <TabsTrigger 
              value="group" 
              className="py-2 px-0 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none"
              onClick={() => setActiveTab('group')}
            >
              <Users size={16} className="mr-1" />
              Groups
            </TabsTrigger>
            
            <TabsTrigger 
              value="global" 
              className="py-2 px-0 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none"
              onClick={() => setActiveTab('global')}
            >
              <Globe size={16} className="mr-1" />
              Global
            </TabsTrigger>
          </TabsList>
        </div>
        
        <div className="flex-1 overflow-hidden">
          <TabsContent value="direct" className="h-full m-0 p-0">
            <ScrollArea className="h-full">
              <div className="p-2">
                {/* Add contact button */}
                <Button 
                  variant="ghost" 
                  className="w-full justify-start mb-2 hover:bg-accent hover:text-accent-foreground"
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  <span>Add Contact</span>
                </Button>
                
                {/* Divider */}
                <div className="relative my-3">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-muted" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-muted/20 px-2 text-xs text-muted-foreground">
                      Recent Conversations
                    </span>
                  </div>
                </div>
                
                {/* Direct messages list */}
                {filteredDirects.length > 0 ? (
                  <div className="space-y-1">
                    {filteredDirects.map((conversation) => (
                      <button
                        key={conversation.id}
                        className={`w-full text-left flex items-center gap-3 p-2 rounded-md transition-colors ${
                          selectedConversationId === conversation.id && conversationType === 'direct'
                            ? 'bg-accent text-accent-foreground'
                            : 'hover:bg-muted'
                        }`}
                        onClick={() => onSelectConversation(conversation, 'direct')}
                      >
                        <div className="relative">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={conversation.avatar} />
                            <AvatarFallback>{conversation.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          {getStatusBadge(conversation.status || 'offline')}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center">
                            <h4 className="font-medium text-sm truncate">{conversation.name}</h4>
                            <span className="text-xs text-muted-foreground">
                              {formatTimestamp(conversation.timestamp)}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground truncate">
                            {truncateMessage(conversation.lastMessage)}
                          </p>
                        </div>
                        {conversation.unread && conversation.unread > 0 && (
                          <Badge className="ml-auto bg-primary text-white">{conversation.unread}</Badge>
                        )}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-4">
                    <p className="text-sm text-muted-foreground">No conversations found</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="group" className="h-full m-0 p-0">
            <ScrollArea className="h-full">
              <div className="p-2">
                {/* Create group button */}
                <Button 
                  variant="ghost" 
                  className="w-full justify-start mb-2 hover:bg-accent hover:text-accent-foreground"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  <span>Create Group</span>
                </Button>
                
                {/* Divider */}
                <div className="relative my-3">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-muted" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-muted/20 px-2 text-xs text-muted-foreground">
                      Your Groups
                    </span>
                  </div>
                </div>
                
                {/* Group conversations list */}
                {filteredGroups.length > 0 ? (
                  <div className="space-y-1">
                    {filteredGroups.map((conversation) => (
                      <button
                        key={conversation.id}
                        className={`w-full text-left flex items-center gap-3 p-2 rounded-md transition-colors ${
                          selectedConversationId === conversation.id && conversationType === 'group'
                            ? 'bg-accent text-accent-foreground'
                            : 'hover:bg-muted'
                        }`}
                        onClick={() => onSelectConversation(conversation, 'group')}
                      >
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={conversation.avatar} />
                          <AvatarFallback>{conversation.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center">
                            <h4 className="font-medium text-sm truncate">{conversation.name}</h4>
                            <span className="text-xs text-muted-foreground">
                              {formatTimestamp(conversation.timestamp)}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground truncate">
                            {truncateMessage(conversation.lastMessage)}
                          </p>
                        </div>
                        {conversation.unread && conversation.unread > 0 && (
                          <Badge className="ml-auto bg-primary text-white">{conversation.unread}</Badge>
                        )}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-4">
                    <p className="text-sm text-muted-foreground">No groups found</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="global" className="h-full m-0 p-0">
            <ScrollArea className="h-full">
              <div className="p-2">
                {/* Global channels list */}
                {filteredGlobals.length > 0 ? (
                  <div className="space-y-1">
                    {filteredGlobals.map((conversation) => (
                      <button
                        key={conversation.id}
                        className={`w-full text-left flex items-center gap-3 p-2 rounded-md transition-colors ${
                          selectedConversationId === conversation.id && conversationType === 'global'
                            ? 'bg-accent text-accent-foreground'
                            : 'hover:bg-muted'
                        }`}
                        onClick={() => onSelectConversation(conversation, 'global')}
                      >
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={conversation.avatar} />
                          <AvatarFallback>{conversation.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center">
                            <h4 className="font-medium text-sm truncate">{conversation.name}</h4>
                            <span className="text-xs text-muted-foreground">
                              {formatTimestamp(conversation.timestamp)}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground truncate">
                            {truncateMessage(conversation.lastMessage)}
                          </p>
                        </div>
                        {conversation.unread && conversation.unread > 0 && (
                          <Badge className="ml-auto bg-primary text-white">{conversation.unread}</Badge>
                        )}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-4">
                    <p className="text-sm text-muted-foreground">No channels found</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
