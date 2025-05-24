
import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-background border-t border-border py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">Polymath</h3>
            <p className="text-muted-foreground text-sm">
              Building a community of interdisciplinary thinkers and learners.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Community</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/forum" className="text-muted-foreground hover:text-foreground">Forum</Link></li>
              <li><Link to="/chat" className="text-muted-foreground hover:text-foreground">Chat</Link></li>
              <li><Link to="/events" className="text-muted-foreground hover:text-foreground">Events</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/library" className="text-muted-foreground hover:text-foreground">Library</Link></li>
              <li><Link to="/research" className="text-muted-foreground hover:text-foreground">Research</Link></li>
              <li><Link to="/wiki" className="text-muted-foreground hover:text-foreground">Wiki</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Content</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/quotes" className="text-muted-foreground hover:text-foreground">Quotes</Link></li>
              <li><Link to="/media" className="text-muted-foreground hover:text-foreground">Media</Link></li>
              <li><Link to="/problems" className="text-muted-foreground hover:text-foreground">Problems</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 Polymath Community. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
