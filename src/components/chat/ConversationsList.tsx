
import React, { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { ConversationItem } from "./ConversationItem";
import { ConversationItem as ConversationType } from "./types";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Plus, MessageSquarePlus, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

interface ConversationsListProps {
  conversations: ConversationType[];
  selectedConversation: string;
  onSelectConversation: (id: string) => void;
  isLoading?: boolean;
}

export const ConversationsList = ({
  conversations,
  selectedConversation,
  onSelectConversation,
  isLoading = false
}: ConversationsListProps) => {
  // Start collapsed by default
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [showNewRoomInput, setShowNewRoomInput] = useState(false);
  const { user } = useAuth();
  
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  
  const handleCreateRoom = async () => {
    if (!newRoomName.trim()) return;
    if (!user) {
      toast.error("You need to be logged in to create a chat room");
      return;
    }

    try {
      setIsCreatingRoom(true);
      
      // Generate a unique ID for the conversation
      const roomId = crypto.randomUUID();
      
      // Create a new conversation in Supabase
      const { error } = await supabase
        .from('conversations')
        .insert({
          id: roomId,
          name: newRoomName.trim(),
          is_global: false,
          is_group: true,
          last_message: `${user.name || 'Someone'} created this chat room`,
          updated_at: new Date().toISOString(),
          created_at: new Date().toISOString()
        });
        
      if (error) throw error;
      
      // Reset the input
      setNewRoomName("");
      setShowNewRoomInput(false);
      
      // Select the newly created conversation
      onSelectConversation(roomId);
      
      toast.success(`Chat room "${newRoomName}" created successfully!`);
    } catch (error: any) {
      console.error('Error creating chat room:', error);
      toast.error('Failed to create chat room: ' + (error.message || 'Unknown error'));
    } finally {
      setIsCreatingRoom(false);
    }
  };

  const handleNewRoomClick = () => {
    setShowNewRoomInput(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCreateRoom();
    } else if (e.key === 'Escape') {
      setShowNewRoomInput(false);
      setNewRoomName("");
    }
  };
  
  return (
    <div className="flex flex-col space-y-2">
      <div 
        className="flex items-center justify-between px-2 cursor-pointer" 
        onClick={toggleExpand}
      >
        <h3 className="text-sm font-medium">Rooms</h3>
        <div className="flex items-center space-x-1">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 w-7 p-0"
            title="Create new chat room"
            onClick={(e) => {
              e.stopPropagation();
              handleNewRoomClick();
            }}
          >
            <Plus size={16} />
            <span className="sr-only">Create new chat room</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 w-7 p-0"
            title={isExpanded ? "Collapse" : "Expand"}
            onClick={(e) => {
              e.stopPropagation();
              toggleExpand();
            }}
          >
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </Button>
        </div>
      </div>
      
      {showNewRoomInput && (
        <div className="px-2 flex items-center space-x-2 animate-fadeIn">
          <input
            type="text"
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Room name"
            className="flex-1 h-8 px-2 py-1 text-sm rounded-md border border-input bg-background"
            autoFocus
            disabled={isCreatingRoom}
          />
          <Button
            size="sm"
            className="h-8 px-2"
            onClick={handleCreateRoom}
            disabled={!newRoomName.trim() || isCreatingRoom}
          >
            {isCreatingRoom ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus size={14} />}
          </Button>
        </div>
      )}
      
      {isExpanded && (
        <ScrollArea className="h-[240px]">
          <div className="space-y-2 p-2">
            {isLoading ? (
              // Loading state
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex items-center space-x-2 p-2">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="space-y-1 flex-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
              ))
            ) : conversations.length > 0 ? (
              conversations.map((convo) => (
                <ConversationItem 
                  key={convo.id}
                  conversation={convo}
                  isSelected={selectedConversation === convo.id}
                  onSelect={onSelectConversation}
                />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-6 px-2 text-center space-y-3">
                <MessageSquarePlus className="h-10 w-10 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground mb-2">No chat rooms yet</p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-xs"
                    onClick={handleNewRoomClick}
                  >
                    <Plus size={14} className="mr-1" />
                    Create your first chat room
                  </Button>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};
