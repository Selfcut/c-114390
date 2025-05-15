import React, { useState, useEffect, useRef } from "react";
import { Send, Smile, Paperclip, Mic, Image, X, Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

type ChatMessage = {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'gif' | 'emoji' | 'voice';
  mediaUrl?: string;
};

type ChatInterfaceProps = {
  recipientId?: string;
  recipientName?: string;
  recipientAvatar?: string;
  isGroupChat?: boolean;
  groupName?: string;
  groupAvatar?: string;
};

const EMOJI_LIST = ['😀', '😂', '🥰', '😎', '🤔', '👍', '🙏', '🔥', '✨', '🎉', '💯', '👀', '🚀', '💡', '📚', '🌍'];
const GIF_CATEGORIES = ['trending', 'reactions', 'memes', 'science', 'philosophy', 'books'];

// Mock GIF data
const mockGifs = [
  { id: '1', url: 'https://media.giphy.com/media/3o7aCTPPm4OHfRLSH6/giphy.gif' },
  { id: '2', url: 'https://media.giphy.com/media/3o7buirYcmV5nSwIRW/giphy.gif' },
  { id: '3', url: 'https://media.giphy.com/media/xUPGcguWZHRC2HyBRS/giphy.gif' },
  { id: '4', url: 'https://media.giphy.com/media/l0HlNaQ6gWfllcjDO/giphy.gif' },
  { id: '5', url: 'https://media.giphy.com/media/3o7btPCcdNniyf0ArS/giphy.gif' },
  { id: '6', url: 'https://media.giphy.com/media/xT0xeJpnrWC4XWblEk/giphy.gif' },
];

export const ChatInterface = ({
  recipientId,
  recipientName = "Chat Partner",
  recipientAvatar,
  isGroupChat = false,
  groupName,
  groupAvatar,
}: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageText, setMessageText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [searchGif, setSearchGif] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  // Mock initial messages
  useEffect(() => {
    const initialMessages: ChatMessage[] = [
      {
        id: '1',
        senderId: 'other',
        senderName: recipientName || groupName || 'User',
        content: 'Hello! How are you today?',
        timestamp: new Date(Date.now() - 3600000),
        type: 'text',
      },
      {
        id: '2',
        senderId: 'self',
        senderName: 'You',
        content: 'I\'m doing great! Just exploring some interesting topics.',
        timestamp: new Date(Date.now() - 1800000),
        type: 'text',
      },
      {
        id: '3',
        senderId: 'other',
        senderName: recipientName || groupName || 'User',
        content: 'That sounds fascinating! What topics are you interested in?',
        timestamp: new Date(Date.now() - 900000),
        type: 'text',
      },
    ];
    
    setMessages(initialMessages);
  }, [recipientId, recipientName, groupName]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId: 'self',
      senderName: 'You',
      content: messageText.trim(),
      timestamp: new Date(),
      type: 'text',
    };
    
    setMessages([...messages, newMessage]);
    setMessageText('');
    
    // Simulate response after a delay
    setTimeout(() => {
      const responseMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        senderId: 'other',
        senderName: recipientName || groupName || 'User',
        senderAvatar: recipientAvatar || groupAvatar,
        content: getRandomResponse(),
        timestamp: new Date(),
        type: 'text',
      };
      
      setMessages(prev => [...prev, responseMessage]);
    }, 1500);
  };

  const handleSendEmoji = (emoji: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId: 'self',
      senderName: 'You',
      content: emoji,
      timestamp: new Date(),
      type: 'emoji',
    };
    
    setMessages([...messages, newMessage]);
  };

  const handleSendGif = (gifUrl: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId: 'self',
      senderName: 'You',
      content: '',
      timestamp: new Date(),
      type: 'gif',
      mediaUrl: gifUrl,
    };
    
    setMessages([...messages, newMessage]);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        const newMessage: ChatMessage = {
          id: Date.now().toString(),
          senderId: 'self',
          senderName: 'You',
          content: `Voice message (${recordingTime}s)`,
          timestamp: new Date(),
          type: 'voice',
          mediaUrl: audioUrl,
        };
        
        setMessages([...messages, newMessage]);
        
        // Clear recording state
        if (timerRef.current) clearInterval(timerRef.current);
        setRecordingTime(0);
        setIsRecording(false);
        
        // Stop all tracks on the stream
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      
      // Set up timer
      timerRef.current = window.setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Error starting voice recording:', error);
      toast({
        title: 'Microphone access error',
        description: 'Please allow microphone access to send voice messages.',
        variant: 'destructive',
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getRandomResponse = () => {
    const responses = [
      "That's fascinating!",
      "I've been thinking about that too.",
      "Could you tell me more about that?",
      "Interesting perspective!",
      "I'm not sure I agree, but I see your point.",
      "That reminds me of something I read recently.",
      "Let's explore that idea further.",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const filteredGifs = searchGif 
    ? mockGifs.filter((_, index) => index % 2 === 0) 
    : mockGifs;

  return (
    <div className="flex flex-col h-full bg-[#1A1A1A] rounded-lg border border-gray-800">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={isGroupChat ? groupAvatar : recipientAvatar} />
            <AvatarFallback>{isGroupChat ? groupName?.charAt(0) : recipientName?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium text-white">{isGroupChat ? groupName : recipientName}</h3>
            <p className="text-xs text-gray-400">
              {isGroupChat ? '5 members • 3 online' : 'Online'}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
            <Image size={18} />
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
            <Mic size={18} />
          </Button>
        </div>
      </div>
      
      {/* Message Area */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="flex flex-col gap-4 stagger-fade">
          {messages.map((message) => (
            <div 
              key={message.id}
              className={`flex ${message.senderId === 'self' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[70%] ${
                  message.senderId === 'self'
                    ? 'bg-[#6E59A5] text-white rounded-tl-lg rounded-tr-lg rounded-bl-lg'
                    : 'bg-[#333333] text-white rounded-tl-lg rounded-tr-lg rounded-br-lg'
                } p-3 animate-fade-in`}
              >
                {message.type === 'text' && (
                  <p>{message.content}</p>
                )}
                
                {message.type === 'emoji' && (
                  <span className="text-3xl">{message.content}</span>
                )}
                
                {message.type === 'gif' && message.mediaUrl && (
                  <img 
                    src={message.mediaUrl} 
                    alt="GIF" 
                    className="max-w-full rounded" 
                  />
                )}
                
                {message.type === 'voice' && message.mediaUrl && (
                  <div>
                    <p className="mb-1 text-sm">{message.content}</p>
                    <audio src={message.mediaUrl} controls className="w-full h-8" />
                  </div>
                )}
                
                <p className="text-xs text-gray-300 mt-1 text-right">
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </div>
          ))}
          <div ref={messageEndRef} />
        </div>
      </ScrollArea>
      
      {/* Input Area */}
      <div className="p-4 border-t border-gray-800">
        {isRecording ? (
          <div className="flex items-center gap-3 animate-pulse">
            <div className="h-3 w-3 bg-red-500 rounded-full"></div>
            <p className="text-white">Recording... {recordingTime}s</p>
            <Button 
              variant="destructive" 
              size="sm" 
              className="ml-auto"
              onClick={stopRecording}
            >
              <X size={16} className="mr-2" />
              Stop
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                  <Smile size={20} />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-2 bg-[#222222] border-gray-700" align="start">
                <div className="grid grid-cols-4 gap-2">
                  {EMOJI_LIST.map((emoji, index) => (
                    <button
                      key={index}
                      className="text-2xl h-10 w-10 flex items-center justify-center hover:bg-gray-800 rounded"
                      onClick={() => handleSendEmoji(emoji)}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                  <Image size={20} />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-4 bg-[#222222] border-gray-700" align="start">
                <Tabs defaultValue="trending">
                  <div className="mb-4">
                    <Input 
                      placeholder="Search GIFs..." 
                      value={searchGif}
                      onChange={(e) => setSearchGif(e.target.value)}
                      className="bg-gray-800 border-gray-700"
                    />
                  </div>
                  
                  <TabsList className="bg-gray-800 mb-4">
                    {GIF_CATEGORIES.slice(0, 3).map(category => (
                      <TabsTrigger key={category} value={category} className="data-[state=active]:bg-[#6E59A5]">
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  
                  {GIF_CATEGORIES.slice(0, 3).map(category => (
                    <TabsContent key={category} value={category}>
                      <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                        {filteredGifs.map(gif => (
                          <img
                            key={gif.id}
                            src={gif.url}
                            alt="GIF"
                            className="w-full h-24 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => handleSendGif(gif.url)}
                          />
                        ))}
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </PopoverContent>
            </Popover>
            
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
              <Paperclip size={20} />
            </Button>
            
            <Input
              placeholder="Type a message..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              className="bg-gray-800 border-gray-700 focus:border-[#6E59A5]"
            />
            
            {messageText ? (
              <Button 
                className="bg-[#6E59A5] hover:bg-[#7E69B5]" 
                size="icon"
                onClick={handleSendMessage}
              >
                <Send size={18} />
              </Button>
            ) : (
              <Button 
                className="bg-[#6E59A5] hover:bg-[#7E69B5]" 
                size="icon"
                onClick={startRecording}
              >
                <Mic size={18} />
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
