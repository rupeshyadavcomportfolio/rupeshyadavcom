'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Project, ProjectType } from '@/types/portfolio';
import { Play, ArrowUpRight, Filter, X } from 'lucide-react';

export function WorkFilterView({
  initialProjects,
  initialType = 'all',
}: {
  initialProjects: Project[];
  initialType?: string;
}) {
  const [selectedType, setSelectedType] = useState<string>(initialType);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Extract unique categories and years
  const categories = useMemo(() => {
    const set = new Set<string>();
    initialProjects.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }, [initialProjects]);

  const years = useMemo(() => {
    const set = new Set<string>();
    initialProjects.forEach((p) => {
      if (p.year) set.add(p.year);
    });
    return Array.from(set).sort((a, b) => b.localeCompare(a));
  }, [initialProjects]);

  // Filtered projects
  const filteredProjects = useMemo(() => {
    return initialProjects.filter((project) => {
      if (project.status !== 'published') return false;

      if (selectedType !== 'all' && project.type !== selectedType) {
        return false;
      }

      if (selectedCategory !== 'all' && project.category !== selectedCategory) {
        return false;
      }

      if (selectedYear !== 'all' && project.year !== selectedYear) {
        return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = project.title.toLowerCase().includes(q);
        const matchesDesc = project.short_description?.toLowerCase().includes(q);
        const matchesTools = project.tools?.some((t) => t.toLowerCase().includes(q));
        const matchesClient = project.client?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesTools && !matchesClient) {
          return false;
        }
      }

      return true;
    });
  }, [initialProjects, selectedType, selectedCategory, selectedYear, searchQuery]);

  return (
    <div className="w-full space-y-8">
      {/* Filter Bar */}
      <div className="bg-white p-4 sm:p-6 border border-neutral-200 rounded-xl space-y-4 shadow-xs">
        {/* Type Selector Tabs */}
        <div className="flex flex-wrap gap-2 pb-3 border-b border-neutral-200">
          {[
            { label: 'ALL WORK', value: 'all' },
            { label: 'GRAPHIC', value: 'graphic' },
            { label: 'VIDEO', value: 'video' },
            { label: 'WEBSITE', value: 'website' },
            { label: 'CASE STUDY', value: 'case_study' },
          ].map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setSelectedType(tab.value)}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-full transition-all cursor-pointer ${
                selectedType === tab.value
                  ? 'bg-neutral-950 text-white shadow-xs'
                  : 'bg-neutral-100 border border-neutral-200/80 text-neutral-700 hover:bg-neutral-200 hover:text-neutral-950'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Secondary Filters */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 text-neutral-500 font-bold uppercase tracking-wider">
            <Filter className="w-3.5 h-3.5" />
            <span>Refine:</span>
          </div>

          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 bg-white border border-neutral-300 rounded-lg font-medium text-neutral-800"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Year Dropdown */}
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="px-3 py-1.5 bg-white border border-neutral-300 rounded-lg font-medium text-neutral-800"
          >
            <option value="all">All Years</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>

          {/* Search Box */}
          <input
            type="text"
            placeholder="Search keywords, tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-3 py-1.5 bg-white border border-neutral-300 rounded-lg font-medium text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900"
          />

          {(selectedCategory !== 'all' || selectedYear !== 'all' || searchQuery || selectedType !== 'all') && (
            <button
              type="button"
              onClick={() => {
                setSelectedType('all');
                setSelectedCategory('all');
                setSelectedYear('all');
                setSearchQuery('');
              }}
              className="inline-flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-950 dark:hover:text-white cursor-pointer ml-auto"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 px-1">
        <span>Showing {filteredProjects.length} {filteredProjects.length === 1 ? 'project' : 'projects'}</span>
      </div>

      {/* Grid */}
      {filteredProjects.length === 0 ? (
        <div className="py-20 text-center border border-dashed border-neutral-300 dark:border-neutral-800 rounded-sm">
          <p className="text-sm text-neutral-500">No projects match the current filter selection.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
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
                <Link
                  href={projectLink}
                  className="relative block aspect-16/10 overflow-hidden bg-neutral-100 dark:bg-neutral-900"
                >
                  <img
                    src={project.featured_image}
                    alt={project.alt_text || project.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500"
                  />

                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-black/80 text-white rounded-xs">
                      {project.type}
                    </span>
                    {project.type === 'video' && project.duration && (
                      <span className="px-2 py-0.5 text-[10px] font-medium bg-white/90 text-black rounded-xs flex items-center gap-1">
                        <Play className="w-2.5 h-2.5 fill-black" />
                        {project.duration}
                      </span>
                    )}
                  </div>

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
                    <span className="text-neutral-500">
                      {project.client ? project.client : 'Self-Initiated'}
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
  );
}
