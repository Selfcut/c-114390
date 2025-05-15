
import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'  // Import index.css which will handle all CSS imports
import './App.css'    // App specific styles
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

// Execute after initial render
window.addEventListener('load', () => {
  setTimeout(() => {
    initScrollAnimations();
    console.log('Styles loaded: Tailwind and CSS initialized');
    
    // Set theme class on document
    const storedTheme = localStorage.getItem('polymath-ui-theme') || 'dark';
    if (storedTheme === 'system') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList.add(isDark ? 'dark' : 'light');
    } else {
      document.documentElement.classList.add(storedTheme);
    }
  }, 100);
});

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
