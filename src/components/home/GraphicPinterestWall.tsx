'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Project } from '@/types/portfolio';
import { MessageSquare, ArrowUpRight, X, ExternalLink } from 'lucide-react';

export function GraphicPinterestWall({
  projects,
  ownerPhone = '8839775265',
}: {
  projects: Project[];
  ownerPhone?: string;
}) {
  const graphicProjects = useMemo(() => {
    return projects.filter((p) => p.type === 'graphic' && p.status === 'published');
  }, [projects]);

  const [sizeFilter, setSizeFilter] = useState<string>('all');
  const [selectedPin, setSelectedPin] = useState<Project | null>(null);

  const sizeOptions = [
    { label: 'ALL GRAPHICS', value: 'all' },
    { label: '1:1 SQUARE (Post)', value: '1:1' },
    { label: '4:5 PORTRAIT (Instagram)', value: '4:5' },
    { label: '9:16 STORY (Vertical)', value: '9:16' },
    { label: '3:4 POSTER (Print)', value: '3:4' },
    { label: '16:9 BANNER', value: '16:9' },
  ];

  const filtered = useMemo(() => {
    if (sizeFilter === 'all') return graphicProjects;
    return graphicProjects.filter((p) => p.aspect_ratio === sizeFilter);
  }, [graphicProjects, sizeFilter]);

  return (
    <section id="graphic-section" className="w-full py-10 md:py-14 border-t border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Category Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest font-black text-rose-500">
              CATEGORY 01
            </span>
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-neutral-950 mt-0.5">
              GRAPHIC DESIGN
            </h2>
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mt-1">
              Social Media Ads • Posters • Branding • Print • Banners
            </p>
          </div>

          <Link
            href="/work/graphic"
            className="text-xs font-bold uppercase tracking-wider text-neutral-600 hover:text-neutral-950 inline-flex items-center gap-1"
          >
            <span>View All Graphics</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Pinterest Size-Wise Filter Pills (Saamne Diya Hai) */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2">
          {sizeOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setSizeFilter(opt.value)}
              className={`px-4 py-2 text-xs font-bold whitespace-nowrap rounded-full transition-all cursor-pointer ${
                sizeFilter === opt.value
                  ? 'bg-neutral-900 text-white shadow-sm scale-102'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              {opt.label}
            </button>
          ))}
          <span className="text-xs text-neutral-500 ml-auto shrink-0 hidden sm:inline">
            {filtered.length} {filtered.length === 1 ? 'Pin' : 'Pins'}
          </span>
        </div>

        {/* Pinterest Masonry Columns (Only Graphics) */}
        {filtered.length === 0 ? (
          <div className="py-20 text-center border border-dashed border-neutral-200 rounded-2xl">
            <p className="text-xs text-neutral-500 font-semibold uppercase">
              No graphic projects found in this format.
            </p>
          </div>
        ) : (
          <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-4">
            {filtered.map((project) => (
              <div
                key={project.id}
                onClick={() => setSelectedPin(project)}
                className="break-inside-avoid mb-4 group relative rounded-2xl overflow-hidden cursor-zoom-in bg-neutral-100 border border-neutral-200/80 shadow-xs hover:shadow-xl transition-all duration-300"
              >
                {/* Visual Pin Image in its natural aspect ratio */}
                <img
                  src={project.featured_image}
                  alt={project.title}
                  loading="lazy"
                  className="w-full h-auto block object-cover group-hover:scale-103 transition-transform duration-500"
                />

                {/* Aspect ratio pill tag */}
                <div className="absolute top-2.5 left-2.5">
                  <span className="px-2 py-0.5 text-[9px] font-black uppercase tracking-wider bg-black/75 text-white backdrop-blur-xs rounded-full">
                    {project.aspect_ratio || '16:9'}
                  </span>
                </div>

                {/* Pinterest Hover Overlay with Quick WhatsApp Button */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3.5 text-white">
                  <div className="flex justify-end">
                    <a
                      href={`https://wa.me/91${ownerPhone}?text=${encodeURIComponent(`Hi Rupesh, I want a graphic design like "${project.title}".`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-emerald-600 hover:bg-emerald-500 text-white rounded-full shadow-md flex items-center gap-1 cursor-pointer"
                    >
                      <MessageSquare className="w-3 h-3" />
                      <span>Hire</span>
                    </a>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-300 block">
                      {project.category}
                    </span>
                    <h3 className="text-xs font-bold leading-snug line-clamp-2 mt-0.5 text-white">
                      {project.title}
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pin Detail Modal */}
      {selectedPin && (
        <div
          onClick={() => setSelectedPin(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md p-4 sm:p-6 lg:p-10 flex items-center justify-center overflow-y-auto animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-[#121212] rounded-3xl overflow-hidden shadow-2xl border border-neutral-200 dark:border-neutral-800 flex flex-col md:flex-row my-auto"
          >
            <button
              type="button"
              onClick={() => setSelectedPin(null)}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 cursor-pointer shadow-md"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Large Visual Image */}
            <div className="md:w-3/5 bg-neutral-950 flex items-center justify-center overflow-hidden min-h-[300px] max-h-[70vh] md:max-h-[85vh]">
              <img
                src={selectedPin.featured_image}
                alt={selectedPin.title}
                className="w-full h-full object-contain max-h-[80vh]"
              />
            </div>

            {/* Minimal Info & Quick Actions */}
            <div className="md:w-2/5 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
              <div className="space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b border-neutral-100 dark:border-neutral-800">
                  <div className="w-10 h-10 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-black flex items-center justify-center font-black text-xs">
                    RY
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-neutral-950 dark:text-white leading-tight">
                      Rupesh Yadav
                    </h4>
                    <span className="text-[11px] text-neutral-500 font-medium">
                      @rupeshyadavcom
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 rounded-full">
                    {selectedPin.aspect_ratio || '16:9'}
                  </span>
                  <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 rounded-full">
                    {selectedPin.category}
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-black text-neutral-950 dark:text-white leading-tight">
                  {selectedPin.title}
                </h2>

                <div className="text-xs text-neutral-600 dark:text-neutral-400 space-y-1 pt-1">
                  {selectedPin.client && (
                    <p>
                      <strong>Client:</strong> {selectedPin.client}
                    </p>
                  )}
                  {selectedPin.tools && selectedPin.tools.length > 0 && (
                    <p>
                      <strong>Tools:</strong> {selectedPin.tools.join(', ')}
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-6 space-y-2.5">
                <a
                  href={`https://wa.me/91${ownerPhone}?text=${encodeURIComponent(`Hi Rupesh, I want to create a graphic design like "${selectedPin.title}".`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 text-xs font-bold uppercase tracking-wider bg-emerald-600 hover:bg-emerald-700 text-white rounded-full transition-colors shadow-md"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Order on WhatsApp</span>
                </a>

                <Link
                  href={`/work/graphic/${selectedPin.slug}`}
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold uppercase tracking-wider bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 rounded-full hover:opacity-90 transition-opacity"
                >
                  <span>Project Page</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
