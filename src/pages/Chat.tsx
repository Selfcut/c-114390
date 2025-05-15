
import { useState } from "react";
import { PromoBar } from "../components/PromoBar";
import { Sidebar } from "../components/Sidebar";
import Header from "../components/Header";
import { ChatInterface } from "../components/chat/ChatInterface";
import { Search, Users, User, ChevronRight, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

type ChatContact = {
  id: string;
  name: string;
  avatar?: string;
  status: 'online' | 'offline' | 'away';
  lastMessage?: string;
  unreadCount?: number;
  lastActive?: Date;
  isGroup?: boolean;
  memberCount?: number;
};

const mockContacts: ChatContact[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice',
    status: 'online',
    lastMessage: 'Looking forward to our discussion tomorrow!',
    unreadCount: 2,
    lastActive: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
  },
  {
    id: '2',
    name: 'Robert Chen',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Robert',
    status: 'online',
    lastMessage: 'I found that article we were talking about',
    lastActive: new Date(Date.now() - 1000 * 60 * 20), // 20 minutes ago
  },
  {
    id: '3',
    name: 'Philosophy Circle',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Philosophy',
    status: 'online',
    lastMessage: 'Sarah: Has anyone read Heidegger?',
    isGroup: true,
    memberCount: 8,
    lastActive: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
  },
  {
    id: '4',
    name: 'Daniel Wright',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Daniel',
    status: 'away',
    lastMessage: 'Let me think about that and get back to you',
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
  },
  {
    id: '5',
    name: 'Quantum Mechanics Study Group',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Quantum',
    status: 'online',
    lastMessage: 'Michael: The double-slit experiment shows...',
    isGroup: true,
    memberCount: 5,
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
  },
  {
    id: '6',
    name: 'Emma Patterson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
    status: 'offline',
    lastMessage: 'Thanks for the book recommendation!',
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
  },
];

const Chat = () => {
  const [contacts, setContacts] = useState<ChatContact[]>(mockContacts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'direct' | 'groups'>('direct');
  const { toast } = useToast();

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = activeTab === 'direct' ? !contact.isGroup : contact.isGroup;
    return matchesSearch && matchesType;
  });

  const selectedContact = contacts.find(c => c.id === selectedContactId);

  const formatLastActive = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const handleCreateChat = () => {
    toast({
      title: "Coming Soon",
      description: "This feature will be available in the next update."
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <PromoBar />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <div className="flex-1 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-3 h-full">
              {/* Contacts sidebar */}
              <div className="md:col-span-1 border-r border-gray-800 bg-[#1A1A1A] p-4 flex flex-col">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white">Messages</h2>
                  <Button
                    size="sm"
                    className="bg-[#6E59A5] hover:bg-[#7E69B5] text-white"
                    onClick={handleCreateChat}
                  >
                    <Plus size={16} className="mr-1" />
                    New
                  </Button>
                </div>

                <div className="relative mb-4">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search conversations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 bg-gray-800 border-gray-700"
                  />
                </div>

                <div className="flex border-b border-gray-800 mb-4">
                  <button
                    className={`flex-1 pb-2 text-sm font-medium ${
                      activeTab === 'direct'
                        ? 'text-white border-b-2 border-[#6E59A5]'
                        : 'text-gray-400'
                    }`}
                    onClick={() => setActiveTab('direct')}
                  >
                    <User size={16} className="inline mr-1" />
                    Direct Messages
                  </button>
                  <button
                    className={`flex-1 pb-2 text-sm font-medium ${
                      activeTab === 'groups'
                        ? 'text-white border-b-2 border-[#6E59A5]'
                        : 'text-gray-400'
                    }`}
                    onClick={() => setActiveTab('groups')}
                  >
                    <Users size={16} className="inline mr-1" />
                    Group Chats
                  </button>
                </div>

                <ScrollArea className="flex-1">
                  <div className="space-y-1 stagger-fade">
                    {filteredContacts.length > 0 ? (
                      filteredContacts.map((contact) => (
                        <div
                          key={contact.id}
                          className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors hover:bg-gray-800 ${
                            selectedContactId === contact.id ? 'bg-gray-800' : ''
                          }`}
                          onClick={() => setSelectedContactId(contact.id)}
                        >
                          <div className="relative">
                            <Avatar>
                              <AvatarImage src={contact.avatar} />
                              <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            {contact.status === 'online' && (
                              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#1A1A1A]"></span>
                            )}
                            {contact.status === 'away' && (
                              <span className="absolute bottom-0 right-0 w-3 h-3 bg-yellow-500 rounded-full border-2 border-[#1A1A1A]"></span>
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-baseline">
                              <h4 className="font-medium text-white truncate">{contact.name}</h4>
                              {contact.lastActive && (
                                <span className="text-xs text-gray-400 whitespace-nowrap">
                                  {formatLastActive(contact.lastActive)}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-400 truncate">
                              {contact.lastMessage || 'No messages yet'}
                            </p>
                          </div>
                          
                          {contact.unreadCount && contact.unreadCount > 0 && (
                            <div className="min-w-[20px] h-5 bg-[#6E59A5] rounded-full flex items-center justify-center">
                              <span className="text-xs text-white">{contact.unreadCount}</span>
                            </div>
                          )}
                          
                          <ChevronRight size={16} className="text-gray-500" />
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-400">No conversations found</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>
              
              {/* Chat interface */}
              <div className="md:col-span-2 flex flex-col h-full">
                {selectedContact ? (
                  <ChatInterface 
                    recipientId={selectedContact.id}
                    recipientName={selectedContact.name}
                    recipientAvatar={selectedContact.avatar}
                    isGroupChat={selectedContact.isGroup}
                    groupName={selectedContact.isGroup ? selectedContact.name : undefined}
                    groupAvatar={selectedContact.isGroup ? selectedContact.avatar : undefined}
                  />
                ) : (
                  <div className="flex-1 flex items-center justify-center bg-[#1A1A1A] rounded-lg">
                    <div className="text-center p-8 max-w-md">
                      <Users size={48} className="mx-auto text-gray-500 mb-4" />
                      <h3 className="text-xl font-bold text-white mb-2">No Conversation Selected</h3>
                      <p className="text-gray-400 mb-6">
                        Select a conversation from the sidebar or start a new one to begin chatting.
                      </p>
                      <Button 
                        className="bg-[#6E59A5] hover:bg-[#7E69B5]"
                        onClick={handleCreateChat}
                      >
                        <Plus size={16} className="mr-2" />
                        Start New Conversation
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
