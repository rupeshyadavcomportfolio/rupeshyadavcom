'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Project } from '@/types/portfolio';
import { ArrowUpRight, Maximize2, X } from 'lucide-react';

export function GraphicSection({ projects }: { projects: Project[] }) {
  const graphicProjects = useMemo(() => {
    return projects.filter((p) => p.type === 'graphic' && p.status === 'published');
  }, [projects]);

  // Size / Aspect ratio filter
  const [selectedSize, setSelectedSize] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [lightboxProject, setLightboxProject] = useState<Project | null>(null);

  const sizeOptions = [
    { label: 'ALL SIZES', value: 'all' },
    { label: '1:1 SQUARE', value: '1:1' },
    { label: '4:5 PORTRAIT', value: '4:5' },
    { label: '9:16 STORY / VERTICAL', value: '9:16' },
    { label: '16:9 BANNER', value: '16:9' },
    { label: '3:4 POSTER', value: '3:4' },
  ];

  // Unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    graphicProjects.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }, [graphicProjects]);

  const filtered = useMemo(() => {
    return graphicProjects.filter((p) => {
      if (selectedSize !== 'all') {
        const ratio = p.aspect_ratio || '16:9';
        if (selectedSize === '1:1' && ratio !== '1:1') return false;
        if (selectedSize === '4:5' && ratio !== '4:5') return false;
        if (selectedSize === '9:16' && ratio !== '9:16') return false;
        if (selectedSize === '16:9' && ratio !== '16:9') return false;
        if (selectedSize === '3:4' && ratio !== '3:4') return false;
      }
      if (selectedCategory !== 'all' && p.category !== selectedCategory) {
        return false;
      }
      return true;
    });
  }, [graphicProjects, selectedSize, selectedCategory]);

  const getAspectStyle = (ratio?: string) => {
    switch (ratio) {
      case '1:1':
        return 'aspect-square';
      case '4:5':
        return 'aspect-4/5';
      case '9:16':
        return 'aspect-9/16';
      case '3:4':
        return 'aspect-3/4';
      case '4:3':
        return 'aspect-4/3';
      case '16:9':
      default:
        return 'aspect-16/9';
    }
  };

  return (
    <section id="graphic-work" className="w-full py-12 md:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <span className="text-xs uppercase tracking-widest font-bold text-neutral-400">
            01 / Creative Visuals
          </span>
          <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-neutral-950 dark:text-white mt-1">
            GRAPHIC DESIGN
          </h2>
        </div>

        {/* Category dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-neutral-400 font-bold uppercase">Category:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 text-xs font-semibold bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xs text-neutral-800 dark:text-neutral-200 cursor-pointer"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* SIZE-WISE FILTER BAR (Front & Center) */}
      <div className="bg-neutral-50 dark:bg-[#141414] p-3 sm:p-4 border border-neutral-200 dark:border-neutral-800 rounded-xs mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
            Filter By Aspect Ratio / Size:
          </span>

          <div className="flex flex-wrap gap-1.5">
            {sizeOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setSelectedSize(opt.value)}
                className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-xs transition-all cursor-pointer ${
                  selectedSize === opt.value
                    ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 shadow-sm'
                    : 'bg-white dark:bg-[#1e1e1e] border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Pure Visual Graphics Grid (No long blog cards) */}
      {filtered.length === 0 ? (
        <div className="py-20 text-center border border-dashed border-neutral-200 dark:border-neutral-800 rounded-xs">
          <p className="text-sm text-neutral-500">No graphics found with this size filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
          {filtered.map((project) => {
            const aspectClass = getAspectStyle(project.aspect_ratio);

            return (
              <div
                key={project.id}
                className="group relative bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 overflow-hidden rounded-xs"
              >
                {/* Visual Image container */}
                <div className={`relative w-full overflow-hidden ${aspectClass}`}>
                  <img
                    src={project.featured_image}
                    alt={project.alt_text || project.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500"
                  />

                  {/* Size badge */}
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-black/80 text-white rounded-xs">
                      {project.aspect_ratio || '16:9'}
                    </span>
                    {project.format_name && (
                      <span className="px-2 py-0.5 text-[10px] font-semibold bg-white/90 text-black rounded-xs">
                        {project.format_name}
                      </span>
                    )}
                  </div>

                  {/* Hover Quick View / Expand */}
                  <div className="absolute inset-0 bg-neutral-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-4 text-white">
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => setLightboxProject(project)}
                        className="p-1.5 bg-white/20 hover:bg-white hover:text-black rounded-xs transition-colors cursor-pointer"
                        title="View Fullscreen"
                      >
                        <Maximize2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-300">
                        {project.category}
                      </span>
                      <h3 className="text-sm font-bold truncate mt-0.5">
                        {project.title}
                      </h3>
                      {project.client && (
                        <p className="text-[11px] text-neutral-300">Client: {project.client}</p>
                      )}

                      <div className="mt-3 pt-2 border-t border-white/20 flex items-center justify-between">
                        <Link
                          href={`/work/graphic/${project.slug}`}
                          className="text-xs font-bold uppercase tracking-wider text-white hover:underline inline-flex items-center gap-1"
                        >
                          Project Page
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => setLightboxProject(project)}
                          className="text-xs font-bold uppercase text-white/80 hover:text-white cursor-pointer"
                        >
                          Quick View
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Clean Bottom Label */}
                <div className="p-3 bg-white dark:bg-[#111111] flex items-center justify-between text-xs">
                  <span className="font-bold text-neutral-900 dark:text-neutral-100 truncate pr-2">
                    {project.title}
                  </span>
                  <span className="text-[11px] font-semibold text-neutral-400 uppercase shrink-0">
                    {project.aspect_ratio || '16:9'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxProject && (
        <div
          onClick={() => setLightboxProject(null)}
          className="fixed inset-0 z-50 bg-black/95 p-4 flex flex-col items-center justify-center backdrop-blur-sm animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-5xl max-h-[90vh] flex flex-col items-center"
          >
            <button
              type="button"
              onClick={() => setLightboxProject(null)}
              className="absolute -top-10 right-0 text-white hover:text-neutral-300 p-2 cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            <img
              src={lightboxProject.featured_image}
              alt={lightboxProject.title}
              className="max-h-[80vh] w-auto object-contain rounded-xs shadow-2xl"
            />

            <div className="mt-4 flex items-center justify-between w-full text-white text-xs px-2">
              <div>
                <span className="font-bold block text-sm">{lightboxProject.title}</span>
                <span className="text-neutral-400">
                  {lightboxProject.format_name || lightboxProject.aspect_ratio} • {lightboxProject.category}
                </span>
              </div>
              <Link
                href={`/work/graphic/${lightboxProject.slug}`}
                className="px-3 py-1.5 font-bold uppercase bg-white text-black rounded-xs"
              >
                View Full Details →
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
