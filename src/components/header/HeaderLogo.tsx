
import React from "react";

export const HeaderLogo = () => {
  return (
    <div className="flex items-center gap-2">
      <svg
        width="280"
        height="100"
        viewBox="0 0 280 100"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        className="h-8 w-auto text-primary"
        aria-label="Polymath Logo"
      >
        <title>Polymath Platform Logo</title>

        <style>
          {`
          /* Base styles for icon elements */
          .polymath-icon-group .line {
            stroke: currentColor;
            stroke-width: 5;
            stroke-linecap: round;
            transition: stroke-width 0.3s ease-out;
          }
          .polymath-icon-group .node {
            fill: currentColor;
            transform-origin: center center;
            transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55),
                        fill 0.3s ease-out;
          }
          .polymath-icon-group .center-dot {
            fill: currentColor;
            transform-origin: center center;
            transition: transform 0.3s ease-out, fill 0.3s ease-out;
          }

          /* Hover effects for the icon part (triggered by hovering the whole SVG) */
          svg:hover .polymath-icon-group .node-1 {
            transform: scale(1.2);
          }
          svg:hover .polymath-icon-group .node-2 {
            transform: scale(1.2);
            transition-delay: 0.05s;
          }
          svg:hover .polymath-icon-group .node-3 {
            transform: scale(1.2);
            transition-delay: 0.1s;
          }
          svg:hover .polymath-icon-group .center-dot {
            transform: scale(1.25);
          }
          svg:hover .polymath-icon-group .line {
            stroke-width: 6;
          }

          /* Style for the brand text */
          .polymath-brand-text {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"; /* Common system font stack */
            font-size: 32px; /* Adjust as needed for balance */
            font-weight: 600; /* Semi-bold */
            fill: currentColor; /* Inherits color from SVG */
            dominant-baseline: middle; /* Helps with vertical alignment */
          }
          `}
        </style>

        {/* Icon Group - positioned on the left side of the new viewBox */}
        <g className="polymath-icon-group" transform="translate(0, 0)">
          {/* Connecting lines */}
          <g className="lines">
            <line className="line line-top" x1="50" y1="50" x2="50" y2="25" />
            <line className="line line-left" x1="50" y1="50" x2="28" y2="65" />
            <line className="line line-right" x1="50" y1="50" x2="72" y2="65" />
          </g>

          {/* Nodes/Knowledge Areas */}
          <g className="nodes">
            <circle className="node node-1" cx="50" cy="20" r="10" />
            <circle className="node node-2" cx="22" cy="70" r="10" />
            <circle className="node node-3" cx="78" cy="70" r="10" />
          </g>

          {/* Central point */}
          <circle className="center-dot" cx="50" cy="50" r="6" />
        </g>

        {/* Brand Text */}
        <text x="115" y="50" className="polymath-brand-text">
          Polymath
        </text>
      </svg>
    </div>
  );
};
