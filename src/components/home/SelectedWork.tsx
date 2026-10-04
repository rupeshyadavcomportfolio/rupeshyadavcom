'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Project, ProjectType } from '@/types/portfolio';
import { ArrowUpRight, Play, Eye } from 'lucide-react';

export function SelectedWork({ projects }: { projects: Project[] }) {
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'GRAPHIC' | 'VIDEO' | 'WEBSITE'>('ALL');

  const filteredProjects = projects.filter((p) => {
    if (!p.featured || p.status !== 'published') return false;
    if (activeFilter === 'ALL') return true;
    if (activeFilter === 'GRAPHIC') return p.type === 'graphic';
    if (activeFilter === 'VIDEO') return p.type === 'video';
    if (activeFilter === 'WEBSITE') return p.type === 'website';
    return true;
  });

  return (
    <section id="selected-work" className="w-full py-16 md:py-24 border-t border-neutral-200 dark:border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-xs uppercase tracking-widest font-bold text-neutral-400 dark:text-neutral-500">
              Curated Showcase
            </span>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-neutral-950 dark:text-white mt-1">
              SELECTED WORK
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2 max-w-lg">
              A selection of creative projects I've designed, edited and built.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {(['ALL', 'GRAPHIC', 'VIDEO', 'WEBSITE'] as const).map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-sm transition-all cursor-pointer ${
                  activeFilter === filter
                    ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 shadow-sm'
                    : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Project Grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-neutral-300 dark:border-neutral-800 rounded-sm">
            <p className="text-neutral-500 text-sm">No featured projects found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => {
              const projectLink =
                project.type === 'case_study'
                  ? `/case-study/${project.slug}`
                  : `/work/${project.type}/${project.slug}`;

              return (
                <div
                  key={project.id}
                  className="group flex flex-col bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 overflow-hidden hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors"
                >
                  <Link href={projectLink} className="relative block overflow-hidden bg-neutral-100 dark:bg-neutral-900 aspect-16/10">
                    <img
                      src={project.featured_image}
                      alt={project.alt_text || project.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Badge */}
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-black/80 text-white backdrop-blur-xs rounded-xs">
                        {project.type}
                      </span>
                      {project.type === 'video' && project.duration && (
                        <span className="px-2 py-1 text-[10px] font-medium bg-white/90 text-black backdrop-blur-xs rounded-xs flex items-center gap-1">
                          <Play className="w-2.5 h-2.5 fill-black" />
                          {project.duration}
                        </span>
                      )}
                    </div>

                    {/* Hover CTA Overlay */}
                    <div className="absolute inset-0 bg-neutral-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold uppercase tracking-wider bg-white text-neutral-950 shadow-md">
                        VIEW PROJECT
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </Link>

                  <div className="p-5 flex flex-col flex-1 justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 mb-2">
                        <span className="uppercase tracking-wider font-semibold">{project.category}</span>
                        <span>{project.year}</span>
                      </div>
                      <Link href={projectLink}>
                        <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 group-hover:underline line-clamp-1">
                          {project.title}
                        </h3>
                      </Link>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-2 line-clamp-2 leading-relaxed">
                        {project.short_description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800/60 flex items-center justify-between text-xs">
                      <span className="text-neutral-500 dark:text-neutral-400">
                        {project.client ? `Client: ${project.client}` : 'Personal Project'}
                      </span>
                      <Link
                        href={projectLink}
                        className="font-bold text-neutral-900 dark:text-neutral-200 group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1"
                      >
                        Explore →
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
