
import React from "react";
import { HeaderSearch } from "./header/HeaderSearch";
import { HeaderActions } from "./header/HeaderActions";

const Header = () => {
  return (
    <header className="border-b bg-background">
      <div className="container px-4 h-16 flex items-center justify-between">
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
