"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

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
