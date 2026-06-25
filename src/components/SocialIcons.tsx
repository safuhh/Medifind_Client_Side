"use client";

import Link from "next/link";

const icons = [
  { name: "fb", path: "M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8.01 9.8V15H8v-3h2.01V9.43c0-1.99 1.18-3.09 3-3.09.87 0 1.79.16 1.79.16V8.5h-1.01c-.99 0-1.3.62-1.3 1.25V12h2.25l-.36 3h-1.89v6.8c4.57-.93 8.01-4.96 8.01-9.8z" },
  { name: "tw", path: "M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" },
  { name: "ig", path: "M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z M17.5 6.5h.01 M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" },
  { name: "li", path: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z M2 9h4v12H2z M4 2a2 2 0 1 1-2 2 2 2 0 0 1 2-2z" }
];

export const SocialIcons = () => {
  return (
    <div className="flex items-center gap-3">
      {icons.map((icon, idx) => (
        <Link 
          key={idx} 
          href="#" 
          aria-label={`Follow us on ${icon.name}`}
          className="w-9 h-9 bg-white/5 hover:bg-emerald-400/20 rounded-full flex items-center justify-center transition-all border border-white/5 hover:border-emerald-400/30 text-white/50 hover:text-emerald-400"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d={icon.path} />
          </svg>
        </Link>
      ))}
    </div>
  );
};