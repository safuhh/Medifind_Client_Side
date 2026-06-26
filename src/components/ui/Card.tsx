"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";

interface CardProps extends HTMLMotionProps<"div"> {
  children?: React.ReactNode;
  variant?: "base" | "interactive";
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, variant = "base", className = "", ...props }, ref) => {
    const baseStyles = "bg-white border border-border rounded-md shadow-sm p-6";

    if (variant === "interactive") {
      return (
        <motion.div
          ref={ref}
          whileHover={{ y: -4, boxShadow: "var(--shadow-md)" }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className={`${baseStyles} hover:shadow-md hover:border-primary/20 transition-colors duration-200 cursor-pointer ${className}`}
          {...props}
        >
          {children}
        </motion.div>
      );
    }

    return (
      <motion.div ref={ref} className={`${baseStyles} ${className}`} {...props}>
        {children}
      </motion.div>
    );
  }
);
Card.displayName = "Card";

interface StatCardProps {
  label: string;
  value: string | number;
  trend?: {
    value: string;
    direction: "up" | "down";
  };
  className?: string;
}

export const StatCard = ({ label, value, trend, className = "" }: StatCardProps) => {
  return (
    <Card className={`p-6 flex flex-col justify-between ${className}`}>
      <span className="text-[13px] font-bold text-ink-muted uppercase tracking-[0.02em]">{label}</span>
      <div className="flex items-baseline justify-between mt-3">
        <span className="text-3xl font-bold text-ink tracking-tight">{value}</span>
        {trend && (
          <span
            className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-sm ${
              trend.direction === "up" ? "bg-emerald-50 text-primary" : "bg-red-50 text-danger"
            }`}
          >
            {trend.direction === "up" ? "↑" : "↓"} {trend.value}
          </span>
        )}
      </div>
    </Card>
  );
};
StatCard.displayName = "StatCard";
