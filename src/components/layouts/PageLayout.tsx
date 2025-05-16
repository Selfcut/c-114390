
import React from "react";
import Header from "../Header";
import { CollapsibleSidebar } from "../CollapsibleSidebar";
import { useAuth } from "@/lib/auth";

interface PageLayoutProps {
  children: React.ReactNode;
  allowGuests?: boolean;
}

export const PageLayout = ({ children, allowGuests = false }: PageLayoutProps) => {
  const { user, isLoading } = useAuth();

  // Ensure sidebar width variable is set on mount
  React.useEffect(() => {
    const sidebarCollapsed = localStorage.getItem('sidebar-collapsed') === 'true';
    document.documentElement.style.setProperty(
      '--sidebar-width', 
      sidebarCollapsed ? '64px' : '256px'
    );
  }, []);

  // Handle protected routes
  if (!allowGuests && !isLoading && !user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center p-8 max-w-md">
          <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
          <p className="mb-6">Please sign in to access this content</p>
          <a href="/auth" className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90">
            Sign In
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex">
        <CollapsibleSidebar />
        <main className="flex-1 ml-[var(--sidebar-width,256px)] transition-all duration-300">
          {children}
        </main>
      </div>
    </div>
  );
};
