
import React from 'react';
import Header from '@/components/Header';

interface PageLayoutProps {
  children: React.ReactNode;
  hideHeader?: boolean;
  allowGuests?: boolean;
}

export const PageLayout: React.FC<PageLayoutProps> = ({ 
  children,
  hideHeader = false,
  allowGuests = false
}) => {
  return (
    <div className="min-h-screen">
      {!hideHeader && <Header />}
      <div className={hideHeader ? "p-4" : "p-4 pt-0"}>
        {children}
      </div>
    </div>
  );
};
