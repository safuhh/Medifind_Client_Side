"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: "primary" | "secondary" | "ghost" | "destructive";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", isLoading = false, children, className = "", disabled, ...props }, ref) => {
    // Styling base
    let variantStyles = "";
    switch (variant) {
      case "primary":
        variantStyles = "bg-primary text-white hover:bg-primary-hover shadow-sm focus-visible:ring-primary/40";
        break;
      case "secondary":
        variantStyles = "bg-transparent text-ink border border-border hover:bg-surface focus-visible:ring-ink/20";
        break;
      case "ghost":
        variantStyles = "bg-transparent text-ink-muted hover:bg-surface hover:text-ink focus-visible:ring-ink/20";
        break;
      case "destructive":
        variantStyles = "bg-danger text-white hover:bg-red-600 shadow-sm focus-visible:ring-danger/40";
        break;
    }

    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: disabled || isLoading ? 1 : 0.97 }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
        disabled={disabled || isLoading}
        className={`inline-flex items-center justify-center rounded-sm font-semibold text-sm px-5 py-2.5 h-[44px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer ${variantStyles} ${className}`}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-current" />
            <span>Loading...</span>
          </span>
        ) : (
          children
        )}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
