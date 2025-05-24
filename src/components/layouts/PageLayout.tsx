
import React from 'react';
import { NavBar } from './NavBar';
import { Footer } from './Footer';

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const PageLayout: React.FC<PageLayoutProps> = ({ children, className = '' }) => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <NavBar />
      <main className={`flex-1 ${className}`}>
        {children}
      </main>
      <Footer />
    </div>
  );
};
