
import { Link } from "react-router-dom";
import { CollapsibleSection } from "../CollapsibleSection";
import { UpcomingEvents } from "../UpcomingEvents";
import { QuickSearch } from "../QuickSearch";

export const FooterSection = () => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Events */}
        <CollapsibleSection title="Upcoming Events" defaultOpen={false} className="animate-fade-in" style={{ animationDelay: "0.9s" }}>
          <UpcomingEvents />
        </CollapsibleSection>
        
        {/* Quick Search */}
        <CollapsibleSection title="Quick Search" defaultOpen={false} className="animate-fade-in" style={{ animationDelay: "1s" }}>
          <QuickSearch />
        </CollapsibleSection>
      </div>

      {/* Footer with logo */}
      <div className="border-t pt-8 mt-16">
        <div className="flex flex-col sm:flex-row items-center justify-between">
          <Link to="/" className="flex items-center gap-2 mb-4 sm:mb-0">
            <svg
              width="40"
              height="40"
              viewBox="0 0 100 100"
              xmlns="http://www.w3.org/2000/svg"
              className="text-primary"
              aria-label="Polymath Logo"
            >
              <title>Interactive Polymath Icon</title>

              <style>
                {`
                /* Base styles for elements */
                .footer-icon-group .line {
                  stroke: currentColor;
                  stroke-width: 5;
                  stroke-linecap: round;
                  transition: stroke-width 0.3s ease-out;
                }
                .footer-icon-group .node {
                  fill: currentColor;
                  transform-origin: center center;
                  transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55),
                              fill 0.3s ease-out;
                }
                .footer-icon-group .center-dot {
                  fill: currentColor;
                  transform-origin: center center;
                  transition: transform 0.3s ease-out, fill 0.3s ease-out;
                }

                /* Hover effects */
                svg:hover .footer-icon-group .node-1 {
                  transform: scale(1.2);
                }
                svg:hover .footer-icon-group .node-2 {
                  transform: scale(1.2);
                  transition-delay: 0.05s;
                }
                svg:hover .footer-icon-group .node-3 {
                  transform: scale(1.2);
                  transition-delay: 0.1s;
                }
                svg:hover .footer-icon-group .center-dot {
                  transform: scale(1.25);
                }
                svg:hover .footer-icon-group .line {
                  stroke-width: 6;
                }
                `}
              </style>

              <g className="footer-icon-group">
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
            </svg>
            <span className="font-bold text-xl">Polymath</span>
          </Link>
          
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Polymath. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
};
