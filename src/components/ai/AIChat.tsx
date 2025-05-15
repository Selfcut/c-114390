
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Send, Bot, User, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export function AIChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const sendMessage = async () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    
    try {
      // Track user activity
      if (user) {
        try {
          await supabase.functions.invoke('track-user-activity', {
            body: {
              event: 'ai_chat_message',
              userId: user.id,
              metadata: { message: input }
            }
          });
        } catch (error) {
          console.error('Failed to track activity:', error);
        }
      }
      
      // Get AI response
      const response = await supabase.functions.invoke('generate-with-ai', {
        body: { prompt: input }
      });
      
      const responseData = response.data as { generatedText: string } | undefined;
      
      if (responseData?.generatedText) {
        const aiMessage: Message = {
          role: "assistant",
          content: responseData.generatedText,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, aiMessage]);
      } else {
        throw new Error('Invalid response from AI');
      }
    } catch (error) {
      console.error('Error getting AI response:', error);
      toast({
        title: "Error",
        description: "Failed to get response from AI assistant.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };
  
  return (
    <Card className="flex flex-col h-[600px]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot size={20} className="text-primary" />
          AI Research Assistant
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-y-auto pb-0">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <Bot size={40} className="mx-auto mb-3 text-primary/40" />
              <p>Ask me anything about science, research, or knowledge.</p>
              <p className="text-sm mt-2">I'm here to assist with your intellectual pursuits.</p>
            </div>
          ) : (
            messages.map((message, index) => (
              <div 
                key={index}
                className={`flex gap-3 ${message.role === "user" ? "justify-end" : ""}`}
              >
                {message.role === "assistant" && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/20 text-primary">AI</AvatarFallback>
                  </Avatar>
                )}
                
                <div className={`rounded-lg px-4 py-3 max-w-[85%] ${
                  message.role === "user" 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-muted"
                }`}>
                  {message.content}
                </div>
                
                {message.role === "user" && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback>
                      {user?.name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>
      
      <CardFooter className="pt-4 pb-4">
        <div className="flex gap-2 w-full">
          <Textarea 
            placeholder="Ask me anything..." 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            className="min-h-[60px] resize-none"
          />
          <Button 
            onClick={sendMessage} 
            disabled={!input.trim() || isLoading}
            className="self-end"
          >
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
