
import React from "react";

export const ChatAnimationStyles = () => {
  return (
    <style jsx global>{`
      @keyframes rainbow {
        0% { color: #ff0000; }
        16.67% { color: #ff8000; }
        33.33% { color: #ffff00; }
        50% { color: #00ff00; }
        66.67% { color: #0000ff; }
        83.33% { color: #8000ff; }
        100% { color: #ff0000; }
      }

      .rainbow-text {
        animation: rainbow 3s infinite;
      }

      @keyframes glow {
        0% { box-shadow: 0 0 5px rgba(255, 215, 0, 0.6); }
        50% { box-shadow: 0 0 20px rgba(255, 215, 0, 0.8); }
        100% { box-shadow: 0 0 5px rgba(255, 215, 0, 0.6); }
      }

      .highlight-glow {
        background-color: rgba(255, 215, 0, 0.1);
        animation: glow 2s infinite;
      }

      @keyframes shake {
        0% { transform: translate(0, 0); }
        10% { transform: translate(-2px, -2px); }
        20% { transform: translate(2px, -2px); }
        30% { transform: translate(-2px, 2px); }
        40% { transform: translate(2px, 2px); }
        50% { transform: translate(-2px, -2px); }
        60% { transform: translate(2px, -2px); }
        70% { transform: translate(-2px, 2px); }
        80% { transform: translate(2px, 2px); }
        90% { transform: translate(-2px, -2px); }
        100% { transform: translate(0, 0); }
      }

      .shake-animation {
        animation: shake 0.5s;
      }

      .announcement-message {
        background-color: rgba(59, 130, 246, 0.2);
        border-left: 4px solid rgb(59, 130, 246);
        font-weight: 500;
      }

      .system-alert-message {
        background-color: rgba(239, 68, 68, 0.2);
        border-left: 4px solid rgb(239, 68, 68);
        font-weight: 500;
      }

      .pinned-message {
        background-color: rgba(245, 158, 11, 0.2);
        border-left: 4px solid rgb(245, 158, 11);
        font-weight: 500;
      }
    `}</style>
  );
};
