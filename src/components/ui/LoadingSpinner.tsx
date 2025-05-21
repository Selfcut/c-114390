
import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
  fullPage?: boolean;
  centered?: boolean;
  variant?: 'default' | 'primary' | 'secondary';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className,
  text,
  fullPage = false,
  centered = false,
  variant = 'default'
}) => {
  const sizeMap = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  const variantMap = {
    default: 'text-primary',
    primary: 'text-primary',
    secondary: 'text-muted-foreground'
  };

  const spinnerElement = (
    <div className={cn(
      'flex flex-col items-center justify-center',
      fullPage ? 'h-[calc(100vh-4rem)]' : '',
      centered && !fullPage ? 'flex items-center justify-center my-8' : '',
      className
    )}>
      <Loader2 className={cn(
        "animate-spin",
        variantMap[variant],
        sizeMap[size]
      )} />
      {text && (
        <p className="mt-2 text-sm text-muted-foreground">{text}</p>
      )}
    </div>
  );

  return spinnerElement;
};
