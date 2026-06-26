"use client";

import React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={id} className="text-[13px] font-medium text-ink-muted tracking-[0.02em] uppercase">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={`h-[44px] px-3.5 bg-bg text-ink border border-border rounded-sm shadow-sm placeholder:text-ink-faint focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all text-sm w-full ${className} ${
            error ? "border-danger focus:border-danger focus:ring-danger/20" : ""
          }`}
          {...props}
        />
        {error && <span className="text-[13px] text-danger font-medium mt-0.5">{error}</span>}
      </div>
    );
  }
);
Input.displayName = "Input";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  children: React.ReactNode;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, children, className = "", id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={id} className="text-[13px] font-medium text-ink-muted tracking-[0.02em] uppercase">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={id}
          className={`h-[44px] px-3.5 bg-bg text-ink border border-border rounded-sm shadow-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all text-sm w-full cursor-pointer ${className} ${
            error ? "border-danger focus:border-danger focus:ring-danger/20" : ""
          }`}
          {...props}
        >
          {children}
        </select>
        {error && <span className="text-[13px] text-danger font-medium mt-0.5">{error}</span>}
      </div>
    );
  }
);
Select.displayName = "Select";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = "", id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={id} className="text-[13px] font-medium text-ink-muted tracking-[0.02em] uppercase">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={id}
          className={`p-3.5 bg-bg text-ink border border-border rounded-sm shadow-sm placeholder:text-ink-faint focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all text-sm w-full min-h-[100px] resize-y ${className} ${
            error ? "border-danger focus:border-danger focus:ring-danger/20" : ""
          }`}
          {...props}
        />
        {error && <span className="text-[13px] text-danger font-medium mt-0.5">{error}</span>}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";
