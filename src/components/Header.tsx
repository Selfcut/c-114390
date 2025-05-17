
import React from "react";
import { HeaderSearch } from "./header/HeaderSearch";
import { HeaderActions } from "./header/HeaderActions";

const Header = () => {
  return (
    <header className="h-16 border-b bg-background shadow-sm sticky top-0 z-20">
      <div className="container h-full px-4 flex items-center justify-between">
        {/* Search Bar */}
        <div className="flex items-center flex-1 gap-4">
          <HeaderSearch />
        </div>
        
        {/* Right side actions */}
        <HeaderActions />
      </div>
    </header>
  );
};

export default Header;
