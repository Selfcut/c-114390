
import { useState, useEffect } from "react";
import { ChatInterface } from "../components/chat/ChatInterface";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const Chat = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [conversations, setConversations] = useState([]);

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 size={40} className="animate-spin text-primary" />
          <p className="text-lg">Loading conversations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <ChatInterface initialConversations={conversations} />
    </div>
  );
};

export default Chat;
