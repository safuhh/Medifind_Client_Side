"use client";

import React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "success" | "warning" | "danger" | "info" | "primary";
  children: React.ReactNode;
}

export const Badge = ({ variant = "primary", children, className = "", ...props }: BadgeProps) => {
  let styleClasses = "";

  switch (variant) {
    case "success":
      styleClasses = "bg-primary/10 text-primary border border-primary/20";
      break;
    case "warning":
      styleClasses = "bg-warning/10 text-warning border border-warning/20";
      break;
    case "danger":
      styleClasses = "bg-danger/10 text-danger border border-danger/20";
      break;
    case "info":
      styleClasses = "bg-ink-muted/10 text-ink-muted border border-ink-muted/20";
      break;
    case "primary":
      styleClasses = "bg-primary-subtle text-primary border border-primary/20";
      break;
  }

  return (
    <span
      className={`inline-flex items-center justify-center px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded-sm ${styleClasses} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

Badge.displayName = "Badge";
