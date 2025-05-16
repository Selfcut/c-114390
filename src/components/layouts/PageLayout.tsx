
import React from "react";
import Header from "../Header";
import { Sidebar } from "./Sidebar";

interface PageLayoutProps {
  children: React.ReactNode;
  allowGuests?: boolean;
}

export const PageLayout = ({ children, allowGuests = false }: PageLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex">
        <Sidebar />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
};
