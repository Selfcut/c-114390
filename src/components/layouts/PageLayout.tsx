
import React, { useState, useEffect } from "react";
import { PromoBar } from "../PromoBar";
import { Sidebar } from "../Sidebar";
import Header from "../Header";
import { subscribeToChatSidebarToggle } from "@/lib/utils/event-utils";
import { useTrackSectionView } from "@/hooks/use-track-section-view";

interface PageLayoutProps {
  children: React.ReactNode;
  showPromo?: boolean;
  showSidebar?: boolean;
  showHeader?: boolean;
  sectionName?: string;
}

export const PageLayout = ({ 
  children, 
  showPromo = true, 
  showSidebar = true, 
  showHeader = true,
  sectionName
}: PageLayoutProps) => {
  // Create a state to track if the chat sidebar is open
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  // Track section view if section name is provided
  useEffect(() => {
    if (sectionName) {
      useTrackSectionView(sectionName);
    }
  }, [sectionName]);

  // Listen to chat sidebar toggle events
  useEffect(() => {
    const unsubscribe = subscribeToChatSidebarToggle((isOpen) => {
      setIsChatOpen(isOpen);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {showPromo && <PromoBar />}
      <div className={`flex flex-1 relative transition-all duration-300 ${isChatOpen ? 'mr-[400px]' : ''}`}>
        {showSidebar && <Sidebar />}
        <div className={`flex-1 flex flex-col ${showSidebar ? 'ml-64' : ''} transition-all duration-300`}>
          {showHeader && <Header />}
          <main className="flex-1 overflow-auto p-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};
