'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Client } from '@/types/portfolio';
import { Award, ChevronLeft, ChevronRight } from 'lucide-react';

export function ClientLogos({ clients }: { clients: Client[] }) {
  const activeClients = [...clients]
    .filter((c) => c.enabled)
    .sort((a, b) => {
      const dateA = new Date(a.created_at || 0).getTime();
      const dateB = new Date(b.created_at || 0).getTime();
      return dateB - dateA;
    });
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [activeClients]);

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const scrollAmount = 300;
    el.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  if (activeClients.length === 0) {
    return null;
  }

  return (
    <section className="w-full py-14 md:py-20 border-t border-neutral-200 bg-neutral-50/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Title and Scroll Arrows */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold uppercase tracking-wider rounded-full mb-2.5">
              <Award className="w-3.5 h-3.5 text-amber-600" />
              Verified Client Work
            </div>
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-neutral-950">
              OUR CLIENTS
            </h2>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              aria-label="Scroll left"
              className={`p-2.5 rounded-full border transition-all ${
                canScrollLeft
                  ? 'border-neutral-300 bg-white text-neutral-900 hover:bg-neutral-100 shadow-sm cursor-pointer'
                  : 'border-neutral-200 bg-neutral-100/70 text-neutral-400 cursor-not-allowed'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              aria-label="Scroll right"
              className={`p-2.5 rounded-full border transition-all ${
                canScrollRight
                  ? 'border-neutral-300 bg-white text-neutral-900 hover:bg-neutral-100 shadow-sm cursor-pointer'
                  : 'border-neutral-200 bg-neutral-100/70 text-neutral-400 cursor-not-allowed'
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Horizontal Scrollable Carousel Bar */}
        <div
          ref={scrollContainerRef}
          onScroll={checkScroll}
          className="flex items-stretch gap-4 md:gap-5 overflow-x-auto pb-4 pt-1 no-scrollbar scroll-smooth snap-x snap-mandatory cursor-grab active:cursor-grabbing"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {activeClients.map((client) => {
            const Content = (
              <div className="w-[200px] sm:w-[220px] md:w-[240px] h-40 p-4 bg-white border border-neutral-200 rounded-2xl flex flex-col items-center justify-between text-center hover:border-neutral-400 hover:shadow-md transition-all duration-300 group shrink-0 snap-start shadow-xs">
                {/* Logo Box */}
                <div className="w-full flex-1 flex items-center justify-center p-2 bg-white rounded-xl">
                  {client.logo ? (
                    <img
                      src={client.logo}
                      alt={`${client.company || client.name} Logo`}
                      className="max-h-16 max-w-[130px] w-auto h-auto object-contain transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <span className="text-sm font-black text-neutral-800">
                      {client.company || client.name}
                    </span>
                  )}
                </div>

                {/* Company Name & Industry */}
                <div className="w-full pt-2 border-t border-neutral-100">
                  <h3 className="text-xs font-bold text-neutral-900 tracking-tight truncate">
                    {client.company || client.name}
                  </h3>
                  <p className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider truncate mt-0.5">
                    {client.industry}
                  </p>
                </div>
              </div>
            );

            if (client.website_url) {
              return (
                <a
                  key={client.id}
                  href={client.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block shrink-0 group snap-start"
                >
                  {Content}
                </a>
              );
            }

            return (
              <div key={client.id} className="shrink-0 snap-start">
                {Content}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
