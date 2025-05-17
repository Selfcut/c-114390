
import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'  // Import index.css which will handle all CSS imports
import './App.css'    // App specific styles
import App from './App.tsx'

// Set document title
document.title = "Polymath - Intellectual Science Community";

// Initialize theme as early as possible to avoid flash of wrong theme
const initTheme = () => {
  try {
    const storedTheme = localStorage.getItem('app-theme') || 'dark';
    if (storedTheme === 'system') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList.add(isDark ? 'dark' : 'light');
    } else {
      document.documentElement.classList.add(storedTheme);
    }
  } catch (error) {
    // Fallback to dark mode if localStorage is not available
    document.documentElement.classList.add('dark');
    console.warn("Error accessing localStorage for theme, defaulting to dark mode");
  }
};

// Execute theme initialization immediately
initTheme();

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

// Create root and render app
const root = document.getElementById('root');
if (!root) {
  console.error('Root element not found!');
} else {
  // Add a loading indicator immediately
  root.innerHTML = `
    <div id="initial-loader" style="
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100vh;
      width: 100vw;
      position: fixed;
      top: 0;
      left: 0;
      z-index: 9999;
      background-color: var(--background, #000);
      color: var(--foreground, #fff);
      transition: opacity 0.3s ease;
    ">
      <div style="text-align: center;">
        <div style="width: 60px; height: 60px; margin: 0 auto 20px; border: 4px solid rgba(255,255,255,0.2); border-radius: 50%; border-top-color: var(--primary, #fff); animation: spin 1s linear infinite;"></div>
        <div>Loading Polymath...</div>
      </div>
    </div>
    <style>
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    </style>
  `;
  
  // Create and render the app
  createRoot(root).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  
  // Execute after initial render
  window.addEventListener('load', () => {
    // Remove the initial loader
    const loader = document.getElementById('initial-loader');
    if (loader) {
      loader.style.opacity = '0';
      setTimeout(() => {
        loader.remove();
      }, 300);
    }
    
    setTimeout(() => {
      initScrollAnimations();
      console.log('Application fully loaded: Styles and animations initialized');
    }, 100);
  });
}
