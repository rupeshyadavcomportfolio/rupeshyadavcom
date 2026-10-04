'use client';

import React from 'react';
import { MessageSquare, Phone, ArrowDown } from 'lucide-react';

export function Hero({
  phone = '8839775265',
  photo = '/rupesh-yadav.png',
}: {
  phone?: string;
  photo?: string;
}) {
  return (
    <section className="w-full pt-8 pb-10 md:pt-12 md:pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-neutral-200 dark:border-neutral-800">
        {/* Profile Avatar + Name + Roles */}
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Rupesh's Authentic Profile Image */}
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-neutral-900 dark:border-white shadow-xl shrink-0 bg-neutral-100 dark:bg-neutral-800">
            <img
              src={photo || '/rupesh-yadav.png'}
              alt="Rupesh Yadav"
              className="w-full h-full object-cover object-top"
            />
            <span
              title="Available for projects"
              className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-black"
            />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] uppercase tracking-widest font-black text-neutral-500 dark:text-neutral-400">
                AVAILABLE FOR NEW WORK • @rupeshyadavcom
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-neutral-950 dark:text-white uppercase leading-none">
              RUPESH YADAV
            </h1>
            <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mt-1.5">
              Graphic Designer • Video Creator • Web Designer
            </p>
          </div>
        </div>

        {/* Quick Category Anchors & WhatsApp */}
        <div className="flex flex-wrap items-center gap-2">
          <a
            href="#graphic-section"
            className="px-3.5 py-2 text-xs font-bold uppercase tracking-wider bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white hover:bg-neutral-950 hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors rounded-full"
          >
            Graphic Work ↓
          </a>
          <a
            href="#video-section"
            className="px-3.5 py-2 text-xs font-bold uppercase tracking-wider bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white hover:bg-neutral-950 hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors rounded-full"
          >
            Video Work ↓
          </a>
          <a
            href="#website-section"
            className="px-3.5 py-2 text-xs font-bold uppercase tracking-wider bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white hover:bg-neutral-950 hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors rounded-full"
          >
            Websites ↓
          </a>
          <a
            href={`https://wa.me/91${phone}?text=Hi%20Rupesh,%20I%20saw%20your%20portfolio%20and%20want%20to%20hire%20you.`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold uppercase tracking-wider bg-emerald-600 text-white hover:bg-emerald-700 transition-colors rounded-full shadow-md"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>
    </section>
  );
}
