
import React from "react";
import { Link } from "react-router-dom";

export const HeaderLogo = () => {
  return (
    <Link to="/" className="flex items-center gap-2 mr-4">
      <img src="/logo.svg" alt="Polymath Logo" className="h-8 w-8" />
      <span className="font-bold text-xl hidden md:inline">Polymath</span>
    </Link>
  );
};
