
import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  centered?: boolean;
  text?: string;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  centered = false,
  text,
  className = ''
}) => {
  // Determine size classes
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-3'
  };

  // Wrapper classes for positioning
  const wrapperClasses = centered 
    ? 'flex flex-col items-center justify-center' 
    : 'flex flex-col items-start';

  return (
    <div className={`${wrapperClasses} ${className}`}>
      <div 
        className={`${sizeClasses[size]} inline-block rounded-full border-t-primary border-r-transparent border-b-transparent border-l-transparent animate-spin`} 
        role="status" 
        aria-label="Loading"
      />
      {text && <p className="mt-2 text-sm text-muted-foreground">{text}</p>}
    </div>
  );
};
