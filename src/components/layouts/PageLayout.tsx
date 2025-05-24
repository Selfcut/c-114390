
import React from 'react';
import { NavBar } from './NavBar';
import { Footer } from './Footer';

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
  hideHeader?: boolean;
  allowGuests?: boolean;
}

export const PageLayout: React.FC<PageLayoutProps> = ({ 
  children, 
  className = '',
  hideHeader = false,
  allowGuests = true 
}) => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {!hideHeader && <NavBar />}
      <main className={`flex-1 ${className}`}>
        {children}
      </main>
      <Footer />
    </div>
  );
};
