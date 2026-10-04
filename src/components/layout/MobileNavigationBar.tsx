'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { MessageCircle } from 'lucide-react';

interface MobileNavigationBarProps {
  phone: string;
}

export function MobileNavigationBar({ phone }: MobileNavigationBarProps) {
  const pathname = usePathname();

  // Hide on admin routes
  if (pathname.startsWith('/admin')) {
    return null;
  }

  const whatsappUrl = `https://wa.me/91${phone}?text=Hi%20Rupesh,%20I%20am%20visiting%20your%20portfolio%20and%20want%20to%20discuss%20a%20project!`;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-neutral-200/90 p-3 shadow-[0_-4px_24px_rgba(0,0,0,0.08)]">
      <div className="max-w-lg mx-auto">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-extrabold text-sm uppercase tracking-wider rounded-2xl shadow-md transition-all cursor-pointer"
          aria-label="Direct WhatsApp Chat"
        >
          <MessageCircle className="w-5 h-5 fill-white/20 stroke-[2.4]" />
          <span>CHAT ON WHATSAPP</span>
        </a>
      </div>
    </div>
  );
}
