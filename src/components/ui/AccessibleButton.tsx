
import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AccessibleButtonProps extends ButtonProps {
  loading?: boolean;
  loadingText?: string;
  ariaLabel?: string;
  children: React.ReactNode;
}

export const AccessibleButton: React.FC<AccessibleButtonProps> = ({
  loading = false,
  loadingText = 'Loading...',
  ariaLabel,
  children,
  disabled,
  className,
  ...props
}) => {
  return (
    <Button
      {...props}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      aria-disabled={disabled || loading}
      className={cn(
        'transition-all duration-200',
        'focus:ring-2 focus:ring-offset-2 focus:ring-primary',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        className
      )}
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          {loadingText}
        </>
      ) : (
        children
      )}
    </Button>
  );
};
