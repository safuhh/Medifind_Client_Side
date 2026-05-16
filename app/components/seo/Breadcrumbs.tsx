import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { JsonLd } from './JsonLd';

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://medifind.com"
      },
      ...items.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 2,
        "name": item.label,
        "item": `https://medifind.com${item.href}`
      }))
    ]
  };

  return (
    <>
      <JsonLd data={schemaData} />
      <nav className="flex mb-6" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-2">
          <li className="inline-flex items-center">
            <Link href="/" className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-emerald-700 transition-colors">
              <Home className="w-3.5 h-3.5 mr-1.5" />
              Home
            </Link>
          </li>
          {items.map((item, index) => (
            <li key={index} className="flex items-center">
              <ChevronRight className="w-4 h-4 text-slate-300 mx-1" />
              <Link
                href={item.href}
                className={`text-xs font-semibold transition-colors ${
                  index === items.length - 1
                    ? 'text-emerald-800 cursor-default pointer-events-none'
                    : 'text-slate-500 hover:text-emerald-700'
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
};
