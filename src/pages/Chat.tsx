import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import Header from "@/components/Header";
import { PromoBar } from "@/components/PromoBar";
import { Sidebar } from "@/components/Sidebar";
import { supabase } from "@/integrations/supabase/client";
import { Send, Smile, Image, Mic, MicOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

// Mock data for online users and chat messages
const onlineUsers = [
  { id: 1, name: "Alice Smith", avatar: "AS", status: "online" },
  { id: 2, name: "Bob Johnson", avatar: "BJ", status: "online" },
  { id: 3, name: "Charlie Brown", avatar: "CB", status: "away" },
  { id: 4, name: "Diana Prince", avatar: "DP", status: "online" },
  { id: 5, name: "Edward Norton", avatar: "EN", status: "offline" },
];

const chatChannels = [
  { id: "general", name: "General", unread: 0 },
  { id: "philosophy", name: "Philosophy", unread: 3 },
  { id: "mysticism", name: "Mysticism", unread: 0 },
  { id: "science", name: "Science & Discovery", unread: 5 },
  { id: "history", name: "History", unread: 0 },
];

interface Message {
  id: string;
  sender: string;
  senderId: string;
  avatar: string;
  content: string;
  timestamp: string;
  type: 'text' | 'image' | 'gif';
  isCurrentUser: boolean;
}

const initialMessages: Message[] = [
  {
    id: '1',
    sender: 'Alice Smith',
    senderId: '1',
    avatar: 'AS',
    content: 'Has anyone read the new article on quantum consciousness?',
    timestamp: '10:30 AM',
    type: 'text',
    isCurrentUser: false,
  },
  {
    id: '2',
    sender: 'Bob Johnson',
    senderId: '2',
    avatar: 'BJ',
    content: 'Yes, it was fascinating! Especially the part about quantum entanglement and its potential role in brain function.',
    timestamp: '10:32 AM',
    type: 'text',
    isCurrentUser: false,
  },
  {
    id: '3',
    sender: 'You',
    senderId: 'current',
    avatar: 'ME',
    content: 'I haven\'t had a chance to read it yet. Could someone share the link?',
    timestamp: '10:34 AM',
    type: 'text',
    isCurrentUser: true,
  },
  {
    id: '4',
    sender: 'Diana Prince',
    senderId: '4',
    avatar: 'DP',
    content: 'Here you go: https://example.com/quantum-consciousness-article',
    timestamp: '10:36 AM',
    type: 'text',
    isCurrentUser: false,
  },
];

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const [activeChannel, setActiveChannel] = useState("general");
  const [isRecording, setIsRecording] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is authenticated
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/auth');
      }
    };
    
    checkSession();
  }, [navigate]);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;
    
    const newMsg: Message = {
      id: Date.now().toString(),
      sender: 'You',
      senderId: 'current',
      avatar: 'ME',
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'text',
      isCurrentUser: true,
    };
    
    setMessages([...messages, newMsg]);
    setNewMessage("");
  };

  const handleToggleMic = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      toast({
        title: "Voice recording started",
        description: "Speak clearly into your microphone"
      });
    } else {
      toast({
        title: "Voice recording stopped",
      });
    }
  };

  const handleOpenGifSelector = () => {
    toast({
      title: "GIF selector",
      description: "GIF selection feature coming soon"
    });
  };

  const handleOpenEmojiPicker = () => {
    toast({
      title: "Emoji picker",
      description: "Emoji selection feature coming soon"
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
            <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] h-full">
              {/* Sidebar with channels and users */}
              <div className="border-r border-border">
                <Tabs defaultValue="channels">
                  <TabsList className="w-full">
                    <TabsTrigger value="channels" className="flex-1">Channels</TabsTrigger>
                    <TabsTrigger value="direct" className="flex-1">Direct</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="channels" className="p-0">
                    <ScrollArea className="h-[calc(100vh-180px)]">
                      <div className="p-4 space-y-2">
                        {chatChannels.map((channel) => (
                          <Button
                            key={channel.id}
                            variant={activeChannel === channel.id ? "secondary" : "ghost"}
                            className="w-full justify-start"
                            onClick={() => setActiveChannel(channel.id)}
                          >
                            # {channel.name}
                            {channel.unread > 0 && (
                              <span className="ml-auto bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">
                                {channel.unread}
                              </span>
                            )}
                          </Button>
                        ))}
                      </div>
                    </ScrollArea>
                  </TabsContent>
                  
                  <TabsContent value="direct" className="p-0">
                    <ScrollArea className="h-[calc(100vh-180px)]">
                      <div className="p-4 space-y-2">
                        {onlineUsers.map((user) => (
                          <div
                            key={user.id}
                            className="flex items-center p-2 hover:bg-accent rounded-md cursor-pointer"
                          >
                            <div className="relative">
                              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                                {user.avatar}
                              </div>
                              <span 
                                className={`absolute bottom-0 right-0 w-2 h-2 rounded-full ${
                                  user.status === 'online' ? 'bg-green-500' : 
                                  user.status === 'away' ? 'bg-yellow-500' : 'bg-gray-500'
                                }`}
                              />
                            </div>
                            <span className="ml-2">{user.name}</span>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </TabsContent>
                </Tabs>
              </div>
              
              {/* Main chat area */}
              <div className="flex flex-col h-full">
                <div className="border-b border-border p-4">
                  <h2 className="text-lg font-medium">#{activeChannel === 'general' ? 'General' : 
                    activeChannel === 'philosophy' ? 'Philosophy' : 
                    activeChannel === 'mysticism' ? 'Mysticism' : 
                    activeChannel === 'science' ? 'Science & Discovery' : 'History'}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {activeChannel === 'general' ? 'Community discussions for all topics' : 
                     activeChannel === 'philosophy' ? 'Deep discussions on philosophical concepts' :
                     activeChannel === 'mysticism' ? 'Exploring mystical traditions and practices' :
                     activeChannel === 'science' ? 'Scientific discoveries and theories' :
                     'Historical knowledge and research'}
                  </p>
                </div>
                
                <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                  <div className="space-y-4">
                    {messages.map((msg) => (
                      <div 
                        key={msg.id}
                        className={`flex ${msg.isCurrentUser ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`flex max-w-[80%] ${msg.isCurrentUser ? 'flex-row-reverse' : ''}`}>
                          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                            {msg.avatar}
                          </div>
                          <div className={`mx-2 ${msg.isCurrentUser ? 'text-right' : ''}`}>
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">{msg.sender}</span>
                              <span className="text-xs text-muted-foreground">{msg.timestamp}</span>
                            </div>
                            <div 
                              className={`mt-1 p-2 rounded-lg ${
                                msg.isCurrentUser 
                                  ? 'bg-primary text-primary-foreground' 
                                  : 'bg-muted'
                              }`}
                            >
                              {msg.type === 'text' ? (
                                <p>{msg.content}</p>
                              ) : msg.type === 'image' || msg.type === 'gif' ? (
                                <img src={msg.content} alt="Shared media" className="max-w-full rounded" />
                              ) : null}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                
                <form onSubmit={handleSendMessage} className="p-4 border-t border-border">
                  <div className="flex items-center space-x-2">
                    <Button 
                      type="button" 
                      size="icon" 
                      variant="ghost"
                      onClick={handleOpenEmojiPicker}
                    >
                      <Smile className="h-5 w-5" />
                    </Button>
                    <Button 
                      type="button" 
                      size="icon" 
                      variant="ghost"
                      onClick={handleOpenGifSelector}
                    >
                      <Image className="h-5 w-5" />
                    </Button>
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1"
                    />
                    <Button 
                      type="button" 
                      size="icon" 
                      variant="ghost"
                      onClick={handleToggleMic}
                      className={isRecording ? "text-red-500" : ""}
                    >
                      {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                    </Button>
                    <Button type="submit" size="icon">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
