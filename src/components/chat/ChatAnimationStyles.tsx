
import React from "react";

export const ChatAnimationStyles = () => {
  return (
    <style jsx global>{`
      /* Add base animation styles */
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      @keyframes slideIn {
        from { transform: translateY(10px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
      
      @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
      }
      
      @keyframes shake {
        0% { transform: translateX(0); }
        25% { transform: translateX(5px); }
        50% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
        100% { transform: translateX(0); }
      }
      
      @keyframes rainbow {
        0% { color: #ff0000; }
        14% { color: #ff7f00; }
        28% { color: #ffff00; }
        42% { color: #00ff00; }
        57% { color: #0000ff; }
        71% { color: #4b0082; }
        85% { color: #9400d3; }
        100% { color: #ff0000; }
      }
      
      @keyframes confetti {
        0% { background-position: 0 0; }
        100% { background-position: 100% 100%; }
      }
      
      /* Message reaction styles */
      .message-reactions:hover .reaction-picker {
        display: flex;
        animation: fadeIn 0.2s ease-in-out;
      }
      
      .message-reactions .existing-reactions {
        transition: all 0.2s ease;
      }
      
      :root {
        --chat-sidebar-width: 350px;
      }
      
      /* Add specific animation classes */
      .animate-fade-in {
        animation: fadeIn 0.3s ease-in-out;
      }
      
      .animate-slide-in {
        animation: slideIn 0.3s ease-in-out;
      }
      
      .animate-pulse {
        animation: pulse 2s infinite;
      }
      
      .animate-shake {
        animation: shake 0.5s;
      }
      
      .animate-rainbow {
        animation: rainbow 3s infinite;
      }
      
      .hover-lift {
        transition: transform 0.2s ease;
      }
      
      .hover-lift:hover {
        transform: translateY(-3px);
      }
    `}</style>
  );
};
