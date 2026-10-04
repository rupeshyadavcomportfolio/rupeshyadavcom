'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowDown, MessageSquare } from 'lucide-react';

export function Hero({ phone = '8839775265' }: { phone?: string }) {
  return (
    <section className="w-full pt-8 pb-10 md:pt-14 md:pb-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs uppercase tracking-widest font-semibold text-neutral-500 dark:text-neutral-400">
              AVAILABLE FOR NEW PROJECTS • @rupeshyadavcom
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-neutral-950 dark:text-white uppercase leading-none">
            RUPESH YADAV
          </h1>
          <p className="text-base sm:text-lg font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mt-2">
            Graphic Designer • Video Creator • Web Designer
          </p>
        </div>

        {/* Quick Jump & WhatsApp action */}
        <div className="flex flex-wrap items-center gap-2.5">
          <a
            href="#graphic-work"
            className="px-3.5 py-2 text-xs font-bold uppercase tracking-wider bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white hover:bg-neutral-950 hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors rounded-xs"
          >
            Graphic Work ↓
          </a>
          <a
            href="#video-work"
            className="px-3.5 py-2 text-xs font-bold uppercase tracking-wider bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white hover:bg-neutral-950 hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors rounded-xs"
          >
            Video Work ↓
          </a>
          <a
            href="#website-work"
            className="px-3.5 py-2 text-xs font-bold uppercase tracking-wider bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white hover:bg-neutral-950 hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors rounded-xs"
          >
            Websites ↓
          </a>
          <a
            href={`https://wa.me/91${phone}?text=Hi%20Rupesh,%20I%20saw%20your%20portfolio%20and%20want%20to%20hire%20you.`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold uppercase tracking-wider bg-emerald-600 text-white hover:bg-emerald-700 transition-colors rounded-xs"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>
    </section>
  );
}
