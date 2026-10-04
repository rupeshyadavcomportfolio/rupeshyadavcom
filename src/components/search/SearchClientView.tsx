'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Project } from '@/types/portfolio';
import { Search, X, ArrowUpRight } from 'lucide-react';

export function SearchClientView({ projects }: { projects: Project[] }) {
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const filtered = useMemo(() => {
    return projects.filter((project) => {
      if (project.status !== 'published') return false;

      if (typeFilter !== 'all' && project.type !== typeFilter) {
        return false;
      }

      if (!query.trim()) return true;

      const q = query.toLowerCase();
      const matchTitle = project.title.toLowerCase().includes(q);
      const matchDesc = project.short_description?.toLowerCase().includes(q);
      const matchCat = project.category?.toLowerCase().includes(q);
      const matchClient = project.client?.toLowerCase().includes(q);
      const matchTools = project.tools?.some((t) => t.toLowerCase().includes(q));
      const matchTags = project.tags?.some((t) => t.toLowerCase().includes(q));

      return matchTitle || matchDesc || matchCat || matchClient || matchTools || matchTags;
    });
  }, [projects, query, typeFilter]);

  return (
    <div className="w-full space-y-8">
      {/* Search Input Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
        <input
          type="text"
          autoFocus
          placeholder="Search by title, tool (e.g. Photoshop, Figma, Next.js), category, or client..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-12 pr-10 py-4 text-base sm:text-lg bg-neutral-50 dark:bg-[#141414] border border-neutral-300 dark:border-neutral-800 rounded-sm focus:outline-none focus:border-neutral-950 dark:focus:border-white transition-colors"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-950 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {['all', 'graphic', 'video', 'website', 'case_study'].map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => setTypeFilter(type)}
            className={`px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider rounded-sm transition-all cursor-pointer ${
              typeFilter === type
                ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950'
                : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400'
            }`}
          >
            {type.replace('_', ' ')}
          </button>
        ))}
        <span className="text-xs text-neutral-400 ml-auto">
          Found {filtered.length} {filtered.length === 1 ? 'result' : 'results'}
        </span>
      </div>

      {/* Results List */}
      {filtered.length === 0 ? (
        <div className="py-20 text-center border border-dashed border-neutral-200 dark:border-neutral-800 rounded-sm">
          <p className="text-sm text-neutral-500">
            No projects found matching "{query}". Try searching for Photoshop, Video, Branding, or Website.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p) => {
            const link =
              p.type === 'case_study'
                ? `/case-study/${p.slug}`
                : `/work/${p.type}/${p.slug}`;

            return (
              <Link
                key={p.id}
                href={link}
                className="group flex flex-col bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 overflow-hidden hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors"
              >
                <div className="relative aspect-16/10 overflow-hidden bg-neutral-100 dark:bg-neutral-900">
                  <img
                    src={p.featured_image}
                    alt={p.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                  />
                  <span className="absolute top-2.5 left-2.5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-black/80 text-white rounded-xs">
                    {p.type}
                  </span>
                </div>

                <div className="p-4 flex flex-col flex-1 justify-between">
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-neutral-500 mb-1">
                      <span className="uppercase tracking-wider font-semibold">{p.category}</span>
                      <span>{p.year}</span>
                    </div>
                    <h3 className="text-sm font-bold text-neutral-950 dark:text-white group-hover:underline line-clamp-1">
                      {p.title}
                    </h3>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 line-clamp-2">
                      {p.short_description}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-neutral-100 dark:border-neutral-800 text-[11px] font-bold text-neutral-900 dark:text-neutral-200 flex items-center justify-between">
                    <span>{p.client ? `Client: ${p.client}` : 'Self-Initiated'}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
