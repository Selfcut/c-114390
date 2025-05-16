
import React from "react";
import { Header } from "../header/Header";
import { useLocation } from "react-router-dom";

interface PageLayoutProps {
  children: React.ReactNode;
  allowGuests?: boolean;
}

export const PageLayout = ({ children, allowGuests = false }: PageLayoutProps) => {
  const location = useLocation();
  
  // Check if we're on a page that has its own header
  const hasDedicatedHeader = ["/landing", "/auth", "/not-found"].includes(location.pathname);
  
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {!hasDedicatedHeader && <Header />}
      <main className="flex-1 w-full">
        {children}
      </main>
    </div>
  );
};
