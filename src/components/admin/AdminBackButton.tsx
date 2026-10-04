'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export function AdminBackButton() {
  const router = useRouter();
  const pathname = usePathname();

  // Only show on sub-pages (not on the main /admin dashboard root)
  if (pathname === '/admin') return null;

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push('/admin');
    }
  };

  return (
    <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40 pointer-events-none">
      <button
        type="button"
        onClick={handleBack}
        className="pointer-events-auto inline-flex items-center gap-2 px-6 py-2.5 bg-white/95 backdrop-blur-md hover:bg-white active:scale-95 text-neutral-900 font-bold text-xs uppercase tracking-wider rounded-full border border-neutral-300 shadow-lg hover:shadow-xl transition-all cursor-pointer group"
      >
        <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1 text-neutral-800" />
        <span>BACK</span>
      </button>
    </div>
  );
}
