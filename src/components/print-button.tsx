'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

// We pass the onClick handler directly to a native button element.
// This component no longer uses forwardRef, simplifying it and avoiding
// the `findDOMNode` issue with react-to-print.
export function PrintButton({
  onClick,
  className,
  ...props
}: React.HTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      onClick={onClick}
      className={cn(buttonVariants(), className)}
      {...props}
    >
      Download PDF
    </button>
  );
}

PrintButton.displayName = 'PrintButton';