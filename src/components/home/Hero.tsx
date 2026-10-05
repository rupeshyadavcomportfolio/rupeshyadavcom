'use client';

import React from 'react';
import { MessageSquare, Phone, ArrowDown } from 'lucide-react';

export function Hero({
  phone = '8839775265',
  photo = '/rupesh-yadav.png',
}) {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-br from-slate-50 via-indigo-50/40 to-emerald-50/40">
      {/* Dynamic Ambient Gradient Orbs (Professional Lighting) */}
      <div 
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden select-none"
        aria-hidden="true"
      >
        {/* Soft Indigo / Violet Glow Top-Right */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-gradient-to-br from-indigo-200/40 to-violet-200/20 blur-3xl" />

        {/* Soft Emerald / Teal Glow Bottom-Left */}
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-gradient-to-tr from-emerald-200/40 to-teal-200/20 blur-3xl" />

        {/* Subtle Designer Grid Pattern */}
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.045] text-neutral-900"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="hero-grid-pattern"
              width="48"
              height="48"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 48 0 L 0 0 0 48"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              />
              <circle cx="48" cy="0" r="1.5" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-grid-pattern)" />
        </svg>

        {/* Abstract Creative Bezier & Wave Vector Lines (Graphic & Video Editing Motif) */}
        <svg
          className="absolute -top-10 -right-10 w-[550px] h-[280px] opacity-[0.07] text-neutral-900"
          viewBox="0 0 600 300"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M 0 180 C 150 80, 300 240, 450 120 S 600 60, 650 140"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M 0 120 C 180 220, 320 60, 480 180 S 620 100, 650 200"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray="6 6"
          />
          <path
            d="M 50 60 C 200 150, 350 40, 520 140"
            stroke="currentColor"
            strokeWidth="1"
          />
          {/* Keyframe / Anchor Points */}
          <rect x="145" y="105" width="10" height="10" transform="rotate(45 150 110)" stroke="currentColor" strokeWidth="2" fill="white" />
          <rect x="445" y="115" width="10" height="10" transform="rotate(45 450 120)" stroke="currentColor" strokeWidth="2" fill="white" />
          <circle cx="300" cy="180" r="5" stroke="currentColor" strokeWidth="2" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-8 md:pt-12 md:pb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Profile Avatar + Name + Roles */}
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Rupesh's Authentic Profile Image */}
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-white shadow-lg shrink-0 bg-white ring-2 ring-neutral-200/80">
              <img
                src={photo || '/rupesh-yadav.png'}
                alt="Rupesh Yadav"
                className="w-full h-full object-cover object-top"
              />
              <span
                title="Available for projects"
                className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white shadow-sm"
              />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] uppercase tracking-widest font-black text-neutral-600">
                  AVAILABLE FOR NEW WORK • @rupeshyadavcom
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-neutral-950 uppercase leading-none">
                RUPESH YADAV
              </h1>
              <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-neutral-600 mt-1.5">
                Graphic Designer • Video Editor • Web Designer
              </p>
            </div>
          </div>

          {/* Quick Category Anchors & WhatsApp */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 w-full md:w-auto">
            <a
              href="#graphic-section"
              className="px-3.5 py-2 text-xs font-bold uppercase tracking-wider bg-white/90 backdrop-blur-xs border border-neutral-200/90 text-neutral-800 hover:bg-white hover:text-neutral-950 hover:border-neutral-300 transition-all rounded-full shadow-2xs"
            >
              Graphic Work ↓
            </a>
            <a
              href="#video-section"
              className="px-3.5 py-2 text-xs font-bold uppercase tracking-wider bg-white/90 backdrop-blur-xs border border-neutral-200/90 text-neutral-800 hover:bg-white hover:text-neutral-950 hover:border-neutral-300 transition-all rounded-full shadow-2xs"
            >
              Video Work ↓
            </a>
            <a
              href="#website-section"
              className="px-3.5 py-2 text-xs font-bold uppercase tracking-wider bg-white/90 backdrop-blur-xs border border-neutral-200/90 text-neutral-800 hover:bg-white hover:text-neutral-950 hover:border-neutral-300 transition-all rounded-full shadow-2xs"
            >
              Websites ↓
            </a>
            <a
              href={`https://wa.me/91${phone}?text=Hi%20Rupesh,%20I%20saw%20your%20portfolio%20and%20want%20to%20hire%20you.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold uppercase tracking-wider bg-emerald-600 text-white hover:bg-emerald-700 transition-colors rounded-full shadow-md hover:shadow-lg"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
