
import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-background border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold text-lg mb-4">Polymath</h3>
            <p className="text-muted-foreground text-sm">
              A platform for interdisciplinary learning and knowledge sharing.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Explore</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/forum" className="text-muted-foreground hover:text-foreground">Forum</Link></li>
              <li><Link to="/library" className="text-muted-foreground hover:text-foreground">Library</Link></li>
              <li><Link to="/wiki" className="text-muted-foreground hover:text-foreground">Wiki</Link></li>
              <li><Link to="/quotes" className="text-muted-foreground hover:text-foreground">Quotes</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Community</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/media" className="text-muted-foreground hover:text-foreground">Media</Link></li>
              <li><Link to="/research" className="text-muted-foreground hover:text-foreground">Research</Link></li>
              <li><Link to="/problems" className="text-muted-foreground hover:text-foreground">Problems</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-foreground">Help Center</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground">Contact</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground">Privacy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 Polymath. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
