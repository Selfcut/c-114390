
import React from "react";
import { Link } from "react-router-dom";

export const HeaderLogo = () => {
  return (
    <Link to="/" className="flex items-center gap-2 mr-4">
      <svg
        width="32"
        height="32"
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        className="text-primary"
        aria-label="Polymath Logo"
      >
        <title>Polymath Icon</title>

        {/* Central connecting lines */}
        <g stroke="currentColor" strokeWidth="5" strokeLinecap="round">
          <line x1="50" y1="50" x2="50" y2="25" />
          <line x1="50" y1="50" x2="28" y2="65" /> {/* Adjusted for symmetry */}
          <line x1="50" y1="50" x2="72" y2="65" /> {/* Adjusted for symmetry */}
        </g>

        {/* Nodes/Knowledge Areas */}
        <circle cx="50" cy="20" r="10" />
        <circle cx="22" cy="70" r="10" /> {/* Adjusted for visual balance */}
        <circle cx="78" cy="70" r="10" /> {/* Adjusted for visual balance */}

        {/* Optional: Small central point to emphasize connection origin */}
        <circle cx="50" cy="50" r="6" />
      </svg>
      <span className="font-bold text-xl hidden md:inline">Polymath</span>
    </Link>
  );
};
