import { useState, useRef, useEffect } from 'react';
import { Send, ArrowUp, RotateCcw, Download, X, Plus, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const AIChat = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: "Hello! I'm here to help you explore the depths of knowledge. Ask me anything!"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [selectedModel, setSelectedModel] = useState('gpt-3.5-turbo');
  const [availableModels, setAvailableModels] = useState([
    { id: 'gpt-3.5-turbo', name: 'GPT 3.5 Turbo' },
    { id: 'gpt-4', name: 'GPT 4' }
  ]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Scroll to bottom on new messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // Function to scroll to the bottom of the chat
  const scrollToBottom = () => {
    chatContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  };

  // Handle sending a message
  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: input
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      // Simulate API call
      const response = await simulateAICall(input, selectedModel);
      
      const aiMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: response
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("AI call failed:", error);
      toast({
        title: "AI Interaction Failed",
        description: "There was an error communicating with the AI. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Simulate AI API call
  const simulateAICall = (message: string, model: string): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const responses = {
          'gpt-3.5-turbo': `Response from GPT 3.5 Turbo: ${message}`,
          'gpt-4': `Response from GPT 4: ${message}`
        };
        resolve(responses[model] || 'AI Response');
      }, 1500);
    });
  };

  // Handle clearing the conversation
  const handleClearConversation = () => {
    setMessages([]);
    toast({
      title: "Conversation cleared",
      description: "You have cleared the current conversation."
    });
  };

  // Handle downloading the conversation
  const handleDownloadConversation = () => {
    const element = document.createElement("a");
    const file = new Blob([JSON.stringify(messages, null, 2)], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "ai_conversation.txt";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Chat Header */}
      <div className="border-b p-4 flex justify-between items-center">
        <h2 className="text-lg font-semibold">AI Chat</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={() => setIsSettingsOpen(true)}>
            <MoreVertical size={16} />
          </Button>
          <Button variant="outline" size="icon" onClick={handleClearConversation}>
            <RotateCcw size={16} />
          </Button>
          <Button variant="outline" size="icon" onClick={handleDownloadConversation}>
            <Download size={16} />
          </Button>
        </div>
      </div>
      
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4" ref={chatContainerRef}>
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`rounded-lg p-3 w-fit max-w-[80%] ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="rounded-lg p-3 bg-muted animate-pulse">
                Thinking...
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Chat Input */}
      <div className="p-4 border-t">
        <div className="flex items-center gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 resize-none"
            rows={1}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <Button onClick={handleSend} disabled={isLoading}>
            <Send size={16} />
            Send
          </Button>
        </div>
      </div>
      
      {/* Settings Modal */}
      <AlertDialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>AI Chat Settings</AlertDialogTitle>
            <AlertDialogDescription>
              Configure the AI Chat settings to your preferences.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="model" className="text-right">
                AI Model
              </Label>
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a model" />
                </SelectTrigger>
                <SelectContent>
                  {availableModels.map(model => (
                    <SelectItem key={model.id} value={model.id}>{model.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsSettingsOpen(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => setIsSettingsOpen(false)}>Okay</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AIChat;
