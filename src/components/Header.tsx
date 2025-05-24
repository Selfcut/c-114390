
import React from 'react';
import { HeaderActions } from '@/components/header/HeaderActions';
import { HeaderLogo } from '@/components/header/HeaderLogo';
import { HeaderSearch } from '@/components/header/HeaderSearch';

const Header = () => {
  return (
    <header className="header flex items-center justify-between px-4 h-16 border-b border-border sticky top-0 z-10 bg-background">
      <div className="flex items-center">
        <HeaderLogo />
        <HeaderSearch />
      </div>
      <HeaderActions />
    </header>
  );
};

export default Header;
