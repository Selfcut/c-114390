
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './styles/variables.css'  // Import CSS variables first
import './index.css'
import './App.css'

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
  }, 100);
});

// Debug styles
console.log('Styles loading check: index.css loaded');

// Force re-render to ensure styles are applied
createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
