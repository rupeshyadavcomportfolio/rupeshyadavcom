import React from 'react';
import Link from 'next/link';
import { ArrowDown, ArrowUpRight } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative w-full pt-16 pb-20 md:pt-28 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col justify-center">
      {/* Eyebrow */}
      <div className="flex items-center gap-2 mb-6">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-xs uppercase tracking-widest font-semibold text-neutral-500 dark:text-neutral-400">
          RUPESH YADAV • AVAILABLE FOR SELECTIVE COMMISSIONS
        </span>
      </div>

      {/* Main Headline */}
      <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-neutral-950 dark:text-white uppercase leading-[1.05] max-w-5xl">
        I DESIGN.
        <br />
        <span className="text-neutral-400 dark:text-neutral-500">I CREATE.</span>
        <br />
        I BUILD.
      </h1>

      {/* Subheadline & Description */}
      <div className="mt-8 md:mt-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-baseline border-t border-neutral-200 dark:border-neutral-800 pt-8">
        <div className="md:col-span-4">
          <p className="text-sm md:text-base font-semibold uppercase tracking-wider text-neutral-900 dark:text-neutral-200">
            Graphic Design • Video • Website
          </p>
        </div>
        <div className="md:col-span-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <p className="text-sm md:text-base text-neutral-600 dark:text-neutral-400 max-w-xl leading-relaxed">
            Selected creative work across graphic design, video, advertising and digital experiences. Focused on craft, visual clarity, and real-world conversion.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="#selected-work"
              className="inline-flex items-center gap-2 px-5 py-3 text-xs font-bold tracking-wider uppercase bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 rounded-sm hover:opacity-90 transition-opacity"
            >
              <span>VIEW MY WORK</span>
              <ArrowDown className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-1.5 px-5 py-3 text-xs font-bold tracking-wider uppercase border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 rounded-sm hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
            >
              <span>LET'S WORK TOGETHER</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
