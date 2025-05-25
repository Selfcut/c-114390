import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Chat = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simple loading simulation
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-[calc(100vh-4rem)] w-full">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Chat</h1>
        <div className="bg-card rounded-lg border shadow-sm p-6">
          {isLoading ? (
            <div className="flex items-center justify-center min-h-[calc(100vh-16rem)]">
              <div className="flex flex-col items-center gap-2">
                <Loader2 size={40} className="animate-spin text-primary" />
                <p className="text-lg">Loading chat information...</p>
              </div>
            </div>
          ) : (
            <div className="min-h-[calc(100vh-16rem)] flex flex-col items-center justify-center w-full">
              <Card className="max-w-lg p-8 text-center">
                <div className="mb-4">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto text-primary">
                    <path d="M8 10h8M8 14h4m-7 4h14a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="text-xl font-medium mb-2">Chat Sidebar Ready</h3>
                <p className="text-muted-foreground mb-6">
                  The chat feature is available in the sidebar. Click the chat button in the bottom-right corner to start chatting.
                </p>
                <div className="flex justify-center">
                  <Button onClick={() => {
                    const toggleEvent = new CustomEvent('chatSidebarToggle', { 
                      detail: true
                    });
                    window.dispatchEvent(toggleEvent);
                  }}>
                    Open Chat Sidebar
                  </Button>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
