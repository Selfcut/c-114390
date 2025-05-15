
import React from 'react';
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  type: 'messages' | 'notifications' | 'discussions' | 'library' | 'search' | 'events';
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  type,
  title,
  description,
  actionLabel,
  onAction
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="mb-6">
        {getIllustration(type)}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6 max-w-md">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} className="bg-[#6E59A5] hover:bg-[#7E69B5]">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

function getIllustration(type: EmptyStateProps['type']) {
  switch (type) {
    case 'messages':
      return (
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="20" y="30" width="80" height="60" rx="4" fill="#6E59A5" opacity="0.1" />
          <path d="M20 40L60 65L100 40" stroke="#6E59A5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M92 75H28" stroke="#6E59A5" strokeWidth="2" strokeLinecap="round" />
          <path d="M92 65H28" stroke="#6E59A5" strokeWidth="2" strokeLinecap="round" />
          <path d="M92 55H28" stroke="#6E59A5" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 'notifications':
      return (
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M60 35V45" stroke="#6E59A5" strokeWidth="2" strokeLinecap="round" />
          <path d="M60 85C63.866 85 67 81.866 67 78H53C53 81.866 56.134 85 60 85Z" fill="#6E59A5" opacity="0.2" />
          <path d="M81 78H39C39 78 42 72 42 65V53C42 41.954 50.954 33 62 33C73.046 33 82 41.954 82 53V65C82 72 81 78 81 78Z" stroke="#6E59A5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'discussions':
      return (
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M35 55H65" stroke="#6E59A5" strokeWidth="2" strokeLinecap="round" />
          <path d="M35 65H55" stroke="#6E59A5" strokeWidth="2" strokeLinecap="round" />
          <path d="M30 40H70C73.3137 40 76 42.6863 76 46V74C76 77.3137 73.3137 80 70 80H40L30 90V40Z" fill="#6E59A5" fillOpacity="0.1" stroke="#6E59A5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M80 55H85C88.3137 55 91 57.6863 91 61V85L81 75H50" stroke="#6E59A5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'library':
      return (
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="30" y="40" width="15" height="50" rx="1" fill="#6E59A5" fillOpacity="0.1" stroke="#6E59A5" strokeWidth="2" />
          <rect x="50" y="40" width="15" height="50" rx="1" fill="#6E59A5" fillOpacity="0.1" stroke="#6E59A5" strokeWidth="2" />
          <rect x="70" y="40" width="20" height="50" rx="1" fill="#6E59A5" fillOpacity="0.1" stroke="#6E59A5" strokeWidth="2" />
          <path d="M25 90H95" stroke="#6E59A5" strokeWidth="2" strokeLinecap="round" />
          <path d="M55 50H60" stroke="#6E59A5" strokeWidth="2" strokeLinecap="round" />
          <path d="M75 50H85" stroke="#6E59A5" strokeWidth="2" strokeLinecap="round" />
          <path d="M35 50H40" stroke="#6E59A5" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 'search':
      return (
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="55" cy="55" r="20" fill="#6E59A5" fillOpacity="0.1" stroke="#6E59A5" strokeWidth="2" />
          <path d="M70 70L85 85" stroke="#6E59A5" strokeWidth="2" strokeLinecap="round" />
          <path d="M45 55H65" stroke="#6E59A5" strokeWidth="2" strokeLinecap="round" />
          <path d="M55 45V65" stroke="#6E59A5" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 'events':
      return (
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="30" y="40" width="60" height="50" rx="4" fill="#6E59A5" fillOpacity="0.1" stroke="#6E59A5" strokeWidth="2" />
          <path d="M30 55H90" stroke="#6E59A5" strokeWidth="2" />
          <path d="M45 35V45" stroke="#6E59A5" strokeWidth="2" strokeLinecap="round" />
          <path d="M75 35V45" stroke="#6E59A5" strokeWidth="2" strokeLinecap="round" />
          <path d="M45 65H50" stroke="#6E59A5" strokeWidth="2" strokeLinecap="round" />
          <path d="M60 65H65" stroke="#6E59A5" strokeWidth="2" strokeLinecap="round" />
          <path d="M75 65H80" stroke="#6E59A5" strokeWidth="2" strokeLinecap="round" />
          <path d="M45 75H50" stroke="#6E59A5" strokeWidth="2" strokeLinecap="round" />
          <path d="M60 75H65" stroke="#6E59A5" strokeWidth="2" strokeLinecap="round" />
          <path d="M75 75H80" stroke="#6E59A5" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    default:
      return (
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="30" fill="#6E59A5" fillOpacity="0.1" stroke="#6E59A5" strokeWidth="2" />
          <path d="M50 60H70" stroke="#6E59A5" strokeWidth="2" strokeLinecap="round" />
          <path d="M60 50V70" stroke="#6E59A5" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
  }
}
