
import React from "react";
import { PromoBar } from "../PromoBar";
import { Sidebar } from "../Sidebar";
import Header from "../Header";

interface PageLayoutProps {
  children: React.ReactNode;
  showPromo?: boolean;
  showSidebar?: boolean;
  showHeader?: boolean;
}

export const PageLayout = ({ 
  children, 
  showPromo = true, 
  showSidebar = true, 
  showHeader = true 
}: PageLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {showPromo && <PromoBar />}
      <div className="flex flex-1 relative">
        {showSidebar && <Sidebar />}
        <div className={`flex-1 flex flex-col ${showSidebar ? 'ml-64' : ''}`}>
          {showHeader && <Header />}
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};
