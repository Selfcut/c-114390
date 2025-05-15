
import React, { useState } from "react";
import { MessageSquare, Users, User, Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

// Types
export type Conversation = {
  id: string;
  name: string;
  avatar?: string;
  status?: 'online' | 'offline' | 'away' | 'do_not_disturb';
  lastSeen?: string;
  unread?: number;
  memberCount?: number;
};

type ConversationListProps = {
  onSelectConversation: (conversation: Conversation, type: 'direct' | 'group' | 'global') => void;
  selectedConversationId?: string;
  conversationType: 'direct' | 'group' | 'global';
};

export const ConversationList = ({
  onSelectConversation,
  selectedConversationId,
  conversationType
}: ConversationListProps) => {
  const [activeTab, setActiveTab] = useState<'direct' | 'group' | 'global'>('direct');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock conversations data
  const mockDirectConversations = [
    { id: 'user1', name: 'Sarah Johnson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', status: 'online', unread: 3 },
    { id: 'user2', name: 'Michael Chen', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael', status: 'offline', lastSeen: '2h ago' },
    { id: 'user3', name: 'Emma Watson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma', status: 'away', lastSeen: '15m ago' },
    { id: 'user4', name: 'James Lee', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James', status: 'online' },
    { id: 'user5', name: 'Maria García', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria', status: 'do_not_disturb' }
  ];

  const mockGroupConversations = [
    { id: 'group1', name: 'Quantum Physics Study Group', avatar: undefined, memberCount: 12, unread: 5 },
    { id: 'group2', name: 'Psychology Enthusiasts', avatar: undefined, memberCount: 8 },
    { id: 'group3', name: 'Philosophy Book Club', avatar: undefined, memberCount: 6 }
  ];

  // Filter conversations based on search term
  const filteredDirectConversations = mockDirectConversations.filter(conv => 
    conv.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredGroupConversations = mockGroupConversations.filter(conv => 
    conv.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get online status indicator color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'offline': return 'bg-gray-400';
      case 'away': return 'bg-yellow-500';
      case 'do_not_disturb': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className="w-80 border-r flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center mb-4">
          <h2 className="text-xl font-bold">Messages</h2>
          <Button variant="ghost" size="icon" className="ml-auto">
            <Plus size={18} />
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div className="border-b">
        <nav className="flex items-center">
          <button
            className={`flex-1 p-3 text-sm font-medium text-center transition-colors ${
              activeTab === 'direct' 
                ? 'border-b-2 border-primary text-primary' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => setActiveTab('direct')}
          >
            <div className="flex justify-center items-center gap-1.5">
              <User size={16} />
              <span>Direct</span>
            </div>
          </button>
          <button
            className={`flex-1 p-3 text-sm font-medium text-center transition-colors ${
              activeTab === 'group' 
                ? 'border-b-2 border-primary text-primary' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => setActiveTab('group')}
          >
            <div className="flex justify-center items-center gap-1.5">
              <Users size={16} />
              <span>Groups</span>
            </div>
          </button>
          <button
            className={`flex-1 p-3 text-sm font-medium text-center transition-colors ${
              activeTab === 'global' 
                ? 'border-b-2 border-primary text-primary' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => setActiveTab('global')}
          >
            <div className="flex justify-center items-center gap-1.5">
              <MessageSquare size={16} />
              <span>Global</span>
            </div>
          </button>
        </nav>
      </div>
      
      <ScrollArea className="flex-1">
        {activeTab === 'direct' && (
          <div className="p-2">
            {filteredDirectConversations.length > 0 ? (
              filteredDirectConversations.map((conversation) => (
                <button
                  key={conversation.id}
                  className={`w-full text-left p-3 rounded-md mb-1 flex items-center gap-3 hover:bg-muted transition-colors ${
                    selectedConversationId === conversation.id && conversationType === 'direct'
                      ? 'bg-muted'
                      : ''
                  }`}
                  onClick={() => onSelectConversation(conversation, 'direct')}
                >
                  <div className="relative">
                    <Avatar>
                      <AvatarImage src={conversation.avatar} />
                      <AvatarFallback>{conversation.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span 
                      className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background ${getStatusColor(conversation.status || '')}`}
                    ></span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium truncate">{conversation.name}</p>
                      {conversation.unread && (
                        <Badge className="ml-auto bg-primary">{conversation.unread}</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {conversation.status === 'online' 
                        ? 'Online' 
                        : conversation.status === 'do_not_disturb'
                        ? 'Do not disturb'
                        : `Last seen ${conversation.lastSeen}`
                      }
                    </p>
                  </div>
                </button>
              ))
            ) : (
              <div className="p-8 text-center">
                <p className="text-sm text-muted-foreground">No conversations found</p>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'group' && (
          <div className="p-2">
            {filteredGroupConversations.length > 0 ? (
              filteredGroupConversations.map((conversation) => (
                <button
                  key={conversation.id}
                  className={`w-full text-left p-3 rounded-md mb-1 flex items-center gap-3 hover:bg-muted transition-colors ${
                    selectedConversationId === conversation.id && conversationType === 'group'
                      ? 'bg-muted'
                      : ''
                  }`}
                  onClick={() => onSelectConversation(conversation, 'group')}
                >
                  <Avatar>
                    <AvatarImage src={conversation.avatar} />
                    <AvatarFallback>{conversation.name.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium truncate">{conversation.name}</p>
                      {conversation.unread && (
                        <Badge className="ml-auto bg-primary">{conversation.unread}</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {conversation.memberCount} members
                    </p>
                  </div>
                </button>
              ))
            ) : (
              <div className="p-8 text-center">
                <p className="text-sm text-muted-foreground">No groups found</p>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'global' && (
          <div className="p-2">
            <button
              className={`w-full text-left p-3 rounded-md flex items-center gap-3 hover:bg-muted transition-colors ${
                conversationType === 'global' ? 'bg-muted' : ''
              }`}
              onClick={() => onSelectConversation({id: 'global', name: 'Global Chat'}, 'global')}
            >
              <Avatar>
                <AvatarImage src={undefined} />
                <AvatarFallback>GC</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">Global Chat</p>
                <p className="text-xs text-muted-foreground">
                  Community-wide discussion
                </p>
              </div>
            </button>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};
