"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NotFound() {
  const router = useRouter();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white px-6 py-24">
      <div className="text-center">
        {/* Decorative Element */}
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-green-50 mb-8">
          <svg 
            className="h-12 w-12 text-green-600" 
            fill="none" 
            viewBox="0 0 24 24" 
            strokeWidth="1.5" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        </div>

        <p className="text-sm font-bold tracking-widest text-green-600 uppercase">
          Error 404
        </p>
        
        <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-6xl">
          Page not found
        </h1>
        
        <p className="mt-6 text-lg leading-7 text-gray-500 max-w-lg mx-auto">
          The page you are looking for doesn't exist or has been moved. 
          Try going back or return to the dashboard.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => router.back()}
            className="w-full sm:w-auto px-8 py-3 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all active:scale-95"
          >
            Go Back
          </button>
          
          <Link
            href="/"
            className="w-full sm:w-auto px-8 py-3 text-sm font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 shadow-md hover:shadow-lg transition-all active:scale-95"
          >
            Take Me Home
          </Link>
        </div>
      </div>
    </main>
  );
}