
import React from 'react';
import { NavBar } from './NavBar';
import { Footer } from './Footer';

interface SimpleLayoutProps {
  children: React.ReactNode;
  hideHeader?: boolean;
  hideFooter?: boolean;
  className?: string;
}

export const SimpleLayout: React.FC<SimpleLayoutProps> = ({ 
  children, 
  hideHeader = false,
  hideFooter = false,
  className = ''
}) => {
  return (
    <div className="min-h-screen bg-background flex flex-col w-full">
      {!hideHeader && <NavBar />}
      
      <main className={`flex-1 ${className}`}>
        {children}
      </main>
      
      {!hideFooter && <Footer />}
    </div>
  );
};
