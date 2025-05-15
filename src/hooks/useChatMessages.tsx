
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ChatMessage, Conversation } from "@/components/chat/types";

export const useChatMessages = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState("global"); // Default to Global Chat
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const messagesSubscriptionRef = useRef<any>(null);

  // Format time for chat messages
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat("en", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(date);
  };

  // Fetch conversations
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const { data, error } = await supabase
          .from('conversations')
          .select('*')
          .order('is_global', { ascending: false })
          .order('created_at', { ascending: false });
        
        if (error) {
          throw error;
        }
        
        if (data && data.length > 0) {
          const formattedConversations = data.map(convo => ({
            id: convo.id,
            name: convo.name,
            avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${convo.name}`,
            lastMessage: convo.last_message || "No messages yet",
            unread: 0,
            isGlobal: convo.is_global,
            isGroup: convo.is_group
          }));
          setConversations(formattedConversations);
        }
      } catch (err) {
        console.error("Error fetching conversations:", err);
      }
    };

    fetchConversations();

    // Subscribe to changes in conversations table
    const conversationsSubscription = supabase
      .channel('conversations_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'conversations' },
        () => {
          fetchConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(conversationsSubscription);
    };
  }, []);

  // Fetch messages for the selected conversation
  useEffect(() => {
    const fetchMessages = async () => {
      setIsLoading(true);
      
      try {
        // Fetch messages for the selected conversation
        const { data, error } = await supabase
          .from('chat_messages')
          .select(`
            id,
            content,
            created_at,
            user_id,
            sender_name,
            conversation_id
          `)
          .eq("conversation_id", selectedConversation)
          .order("created_at", { ascending: true })
          .limit(50);

        if (error) {
          console.error("Error fetching messages:", error);
          toast({
            title: "Failed to load messages",
            description: error.message,
            variant: "destructive",
          });
          return;
        }

        // Transform data into ChatMessage format
        const messagesWithProfiles = await Promise.all(data.map(async (msg) => {
          let userName = msg.sender_name || "Anonymous User";
          let avatarUrl = `https://api.dicebear.com/7.x/personas/svg?seed=${msg.user_id || msg.sender_name || "anonymous"}`;
          
          // If we have a user_id, try to fetch their profile
          if (msg.user_id) {
            const { data: profileData } = await supabase
              .from('profiles')
              .select('name, avatar_url')
              .eq('id', msg.user_id)
              .maybeSingle();
              
            if (profileData) {
              userName = profileData.name || userName;
              avatarUrl = profileData.avatar_url || avatarUrl;
            }
          }
          
          return {
            id: msg.id,
            sender: {
              id: msg.user_id,
              name: userName,
              avatar: avatarUrl,
            },
            content: msg.content,
            timestamp: new Date(msg.created_at)
          } as ChatMessage;
        }));

        setMessages(messagesWithProfiles);
      } catch (err) {
        console.error("Error in messages fetch:", err);
      } finally {
        setIsLoading(false);
      }
    };

    // Only fetch messages if we have a selected conversation
    if (selectedConversation) {
      fetchMessages();
      
      // Set up real-time subscription for new messages
      if (messagesSubscriptionRef.current) {
        messagesSubscriptionRef.current.unsubscribe();
      }
      
      messagesSubscriptionRef.current = supabase
        .channel(`chat_${selectedConversation}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'chat_messages',
            filter: `conversation_id=eq.${selectedConversation}`
          },
          async (payload) => {
            // Fetch user profile for the new message
            let userName = payload.new.sender_name || "Anonymous User";
            let avatarUrl = `https://api.dicebear.com/7.x/personas/svg?seed=${payload.new.user_id || payload.new.sender_name || "anonymous"}`;
            
            if (payload.new.user_id) {
              const { data: profileData } = await supabase
                .from('profiles')
                .select('name, avatar_url')
                .eq('id', payload.new.user_id)
                .maybeSingle();
                
              if (profileData) {
                userName = profileData.name || userName;
                avatarUrl = profileData.avatar_url || avatarUrl;
              }
            }
            
            // Add the new message to the state
            const newMessage: ChatMessage = {
              id: payload.new.id,
              sender: {
                id: payload.new.user_id,
                name: userName,
                avatar: avatarUrl,
              },
              content: payload.new.content,
              timestamp: new Date(payload.new.created_at)
            };
            
            setMessages(prev => [...prev, newMessage]);
          }
        )
        .subscribe();
    }
    
    // Cleanup subscription on unmount or when conversation changes
    return () => {
      if (messagesSubscriptionRef.current) {
        messagesSubscriptionRef.current.unsubscribe();
      }
    };
  }, [selectedConversation, toast]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    try {
      // For authenticated users, send with their ID
      if (isAuthenticated && user) {
        const { error } = await supabase
          .from('chat_messages')
          .insert({
            conversation_id: selectedConversation,
            user_id: user.id,
            content: message
          });

        if (error) {
          console.error("Error sending message:", error);
          toast({
            title: "Failed to send message",
            description: error.message,
            variant: "destructive",
          });
          return;
        }
      } else {
        // For guests, send as anonymous
        // First, generate a random guest name if one doesn't exist
        const randomGuestId = localStorage.getItem('guestId') || 
          `guest_${Math.random().toString(36).substring(2, 10)}`;
        
        const guestDisplayName = `Guest_${randomGuestId.substring(6, 10)}`;
        
        localStorage.setItem('guestId', randomGuestId);
        localStorage.setItem('guestName', guestDisplayName);
        
        const { error } = await supabase
          .from('chat_messages')
          .insert({
            conversation_id: selectedConversation,
            sender_name: guestDisplayName,
            content: message,
          });

        if (error) {
          console.error("Error sending message:", error);
          toast({
            title: "Failed to send message",
            description: error.message,
            variant: "destructive",
          });
          return;
        }
      }

      // Update last message in conversation
      await supabase
        .from('conversations')
        .update({ last_message: message })
        .eq('id', selectedConversation);

      // Clear input after successful send
      setMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSelectConversation = (id: string) => {
    setSelectedConversation(id);
  };

  return {
    conversations,
    selectedConversation,
    message,
    setMessage,
    messages,
    isLoading,
    formatTime,
    handleSendMessage,
    handleKeyDown,
    handleSelectConversation
  };
};
