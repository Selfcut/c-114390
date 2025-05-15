
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
    <div className="min-h-screen flex flex-col">
      {showPromo && <PromoBar />}
      <div className="flex flex-1">
        {showSidebar && <Sidebar />}
        <div className={`flex-1 flex flex-col ${showSidebar ? 'ml-64' : ''}`}>
          {showHeader && <Header />}
          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
