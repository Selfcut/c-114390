
import React from "react";
import Header from "../Header";
import { CollapsibleSidebar } from "../CollapsibleSidebar";

interface PageLayoutProps {
  children: React.ReactNode;
  allowGuests?: boolean;
}

export const PageLayout = ({ children, allowGuests = false }: PageLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex">
        <CollapsibleSidebar />
        <main className="flex-1 ml-[var(--sidebar-width,256px)] transition-all duration-300">{children}</main>
      </div>
    </div>
  );
};
