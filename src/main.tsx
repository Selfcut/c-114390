
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

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
  setTimeout(initScrollAnimations, 500);
});

createRoot(document.getElementById("root")!).render(<App />);
