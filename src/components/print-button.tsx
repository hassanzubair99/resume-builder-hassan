'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

interface PrintButtonProps extends React.HTMLAttributes<HTMLButtonElement> {}

export const PrintButton = React.forwardRef<HTMLButtonElement, PrintButtonProps>(
  ({ onClick, className, ...props }, ref) => {
    return (
      <button
        onClick={onClick}
        ref={ref}
        className={cn(buttonVariants(), className)}
        {...props}
      >
        Download PDF
      </button>
    );
  }
);

PrintButton.displayName = 'PrintButton';
