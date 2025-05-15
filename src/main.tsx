
import React from 'react'
import { createRoot } from 'react-dom/client'
import './styles/variables.css'  // Import CSS variables first
import './styles/tailwind.css'   // Load Tailwind before other styles
import './styles/base.css'       // Base styles
import './styles/layout.css'     // Layout styles
import './styles/components.css'  // Component styles
import './styles/animations.css'  // Animation styles
import './styles/effects.css'    // Effects styles
import './styles/stagger.css'    // Stagger styles
import './styles/light-mode.css' // Light mode styles
import './App.css'               // App specific styles
import App from './App.tsx'

// Set document title
document.title = "Polymath - Intellectual Science Community";

// Add a small animation to the body when the app loads
document.body.classList.add('fade-in');

// Initialize Intersection Observer for scroll animations
const initScrollAnimations = () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    root: null,
    threshold: 0.1,
    rootMargin: '0px'
  });

  // Apply to all elements with slide-up class
  document.querySelectorAll('.slide-up').forEach(el => {
    observer.observe(el);
  });
};

// Force CSS reload if needed
const forceStylesReload = () => {
  const links = document.querySelectorAll('link[rel="stylesheet"]');
  links.forEach(link => {
    const href = link.getAttribute('href');
    if (href) {
      const newHref = href.includes('?') ? 
        `${href}&forceReload=${Date.now()}` : 
        `${href}?forceReload=${Date.now()}`;
      link.setAttribute('href', newHref);
    }
  });
};

// Execute after initial render
window.addEventListener('load', () => {
  setTimeout(() => {
    initScrollAnimations();
    forceStylesReload();
    console.log('Styles loaded: Tailwind and CSS initialized');
  }, 100);
});

// Debug styles
console.log('Styles loading check: index.css loaded');

// Create root and render app
const root = document.getElementById('root');
if (!root) {
  console.error('Root element not found!');
} else {
  createRoot(root).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
