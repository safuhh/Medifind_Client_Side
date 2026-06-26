"use client";

import React from "react";
import { Loader2, Inbox } from "lucide-react";

export const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
  ({ className = "", ...props }, ref) => (
    <div className="w-full overflow-x-auto rounded-md border border-border shadow-sm bg-white">
      <table ref={ref} className={`w-full border-collapse text-left text-sm ${className}`} {...props} />
    </div>
  )
);
Table.displayName = "Table";

export const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className = "", ...props }, ref) => (
    <thead ref={ref} className={`bg-surface border-b border-border sticky top-0 z-10 ${className}`} {...props} />
  )
);
TableHeader.displayName = "TableHeader";

export const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className = "", ...props }, ref) => (
    <tbody ref={ref} className={`divide-y divide-border ${className}`} {...props} />
  )
);
TableBody.displayName = "TableBody";

export const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className = "", ...props }, ref) => (
    <tr ref={ref} className={`hover:bg-surface/50 transition-colors ${className}`} {...props} />
  )
);
TableRow.displayName = "TableRow";

export const TableHead = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(
  ({ className = "", ...props }, ref) => (
    <th ref={ref} className={`p-4 text-xs font-bold text-ink-muted uppercase tracking-[0.02em] select-none ${className}`} {...props} />
  )
);
TableHead.displayName = "TableHead";

export const TableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
  ({ className = "", ...props }, ref) => (
    <td ref={ref} className={`p-4 text-ink align-middle font-medium ${className}`} {...props} />
  )
);
TableCell.displayName = "TableCell";

interface TableStateProps {
  isLoading?: boolean;
  isEmpty?: boolean;
  colSpan: number;
  emptyMessage?: string;
  loadingMessage?: string;
  children?: React.ReactNode;
}

export const TableState = ({
  isLoading,
  isEmpty,
  colSpan,
  emptyMessage = "No data available",
  loadingMessage = "Retrieving records...",
  children,
}: TableStateProps) => {
  if (isLoading) {
    return (
      <TableRow>
        <TableCell colSpan={colSpan} className="text-center py-10">
          <div className="flex flex-col items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
            <span className="text-sm font-semibold text-ink-muted">{loadingMessage}</span>
          </div>
        </TableCell>
      </TableRow>
    );
  }

  if (isEmpty) {
    return (
      <TableRow>
        <TableCell colSpan={colSpan} className="text-center py-12">
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="w-10 h-10 bg-surface rounded-full flex items-center justify-center text-ink-faint">
              <Inbox className="w-5 h-5" />
            </div>
            <span className="text-sm font-semibold text-ink-muted">{emptyMessage}</span>
          </div>
        </TableCell>
      </TableRow>
    );
  }

  return <>{children}</>;
};
TableState.displayName = "TableState";
