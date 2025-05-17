
import { useState, useEffect } from "react";
import { PageLayout } from "@/components/layouts/PageLayout";
import { ChatInterface } from "../components/chat/ChatInterface";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Loader2 } from "lucide-react";
import { ConversationItem } from "../components/chat/types";
import { Card } from "@/components/ui/card";

const Chat = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [conversations, setConversations] = useState<ConversationItem[]>([]);

  // Fetch conversations from Supabase
  useEffect(() => {
    const fetchConversations = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('conversations')
          .select('*')
          .order('updated_at', { ascending: false });
        
        if (error) throw error;
        setConversations(data || []);
      } catch (error) {
        console.error('Error fetching conversations:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchConversations();
  }, [user]);

  return (
    <PageLayout>
      <div className="min-h-[calc(100vh-4rem)] w-full">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold mb-6">Chat</h1>
          <div className="bg-card rounded-lg border shadow-sm">
            {isLoading ? (
              <div className="flex items-center justify-center min-h-[calc(100vh-12rem)]">
                <div className="flex flex-col items-center gap-2">
                  <Loader2 size={40} className="animate-spin text-primary" />
                  <p className="text-lg">Loading conversations...</p>
                </div>
              </div>
            ) : conversations.length > 0 ? (
              <ChatInterface 
                initialConversations={conversations}
                chatType="direct" 
              />
            ) : (
              <div className="min-h-[calc(100vh-12rem)] flex items-center justify-center w-full p-4">
                <Card className="max-w-md p-8 text-center">
                  <div className="mb-4">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto text-muted-foreground">
                      <path d="M8 10h8M8 14h4m-7 4h14a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h3 className="text-xl font-medium mb-2">No conversations yet</h3>
                  <p className="text-muted-foreground mb-4">Start a new conversation to chat with others.</p>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Chat;
