
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Set document title
document.title = "Polymath - Intellectual Science Community";

// Add a small animation to the body when the app loads
document.body.classList.add('fade-in');

createRoot(document.getElementById("root")!).render(<App />);
