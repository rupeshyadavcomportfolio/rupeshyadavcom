'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Project } from '@/types/portfolio';
import {
  Play,
  ArrowUpRight,
  Maximize2,
  X,
  Search,
  MessageSquare,
  ExternalLink,
  Layers,
  Wrench,
} from 'lucide-react';

export function PinterestFeed({
  projects,
  ownerPhone = '8839775265',
}: {
  projects: Project[];
  ownerPhone?: string;
}) {
  const publishedProjects = useMemo(() => {
    return projects.filter((p) => p.status === 'published');
  }, [projects]);

  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPin, setSelectedPin] = useState<Project | null>(null);

  const filterTabs = [
    { label: 'All Work', value: 'all' },
    { label: 'Graphic Design', value: 'type-graphic' },
    { label: 'Videos & Reels', value: 'type-video' },
    { label: 'Websites', value: 'type-website' },
    { label: '1:1 Square (Posts)', value: 'ratio-1:1' },
    { label: '4:5 Portrait', value: 'ratio-4:5' },
    { label: '9:16 Vertical (Story/Reel)', value: 'ratio-9:16' },
    { label: '3:4 Poster & Print', value: 'ratio-3:4' },
    { label: '16:9 Banner & YouTube', value: 'ratio-16:9' },
    { label: 'Branding', value: 'cat-Branding' },
  ];

  const filteredProjects = useMemo(() => {
    return publishedProjects.filter((p) => {
      // Tab filter
      if (activeTab === 'type-graphic' && p.type !== 'graphic') return false;
      if (activeTab === 'type-video' && p.type !== 'video') return false;
      if (activeTab === 'type-website' && p.type !== 'website') return false;
      if (activeTab === 'ratio-1:1' && p.aspect_ratio !== '1:1') return false;
      if (activeTab === 'ratio-4:5' && p.aspect_ratio !== '4:5') return false;
      if (activeTab === 'ratio-9:16' && p.aspect_ratio !== '9:16') return false;
      if (activeTab === 'ratio-3:4' && p.aspect_ratio !== '3:4') return false;
      if (activeTab === 'ratio-16:9' && p.aspect_ratio !== '16:9') return false;
      if (activeTab.startsWith('cat-') && !p.category?.toLowerCase().includes(activeTab.replace('cat-', '').toLowerCase())) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inTitle = p.title.toLowerCase().includes(q);
        const inCategory = p.category?.toLowerCase().includes(q);
        const inTools = p.tools?.some((t) => t.toLowerCase().includes(q));
        const inClient = p.client?.toLowerCase().includes(q);
        if (!inTitle && !inCategory && !inTools && !inClient) return false;
      }

      return true;
    });
  }, [publishedProjects, activeTab, searchQuery]);

  return (
    <div className="w-full">
      {/* Clean Light Floating Filter Chips */}
      <div className="sticky top-20 z-30 bg-white/95 backdrop-blur-md border-b border-neutral-200 py-3.5 mb-6 shadow-2xs transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Scrollable category pills (Scrollbar completely hidden) */}
          <div
            className="flex items-center gap-2 overflow-x-auto py-1 [&::-webkit-scrollbar]:hidden"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {filterTabs.map((tab) => {
              const isActive = activeTab === tab.value;
              return (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => setActiveTab(tab.value)}
                  className={`px-4 py-2 text-xs font-bold whitespace-nowrap rounded-full transition-all cursor-pointer ${
                    isActive
                      ? 'bg-neutral-950 text-white shadow-xs font-black scale-102'
                      : 'bg-neutral-100 border border-neutral-200/80 text-neutral-700 hover:bg-neutral-200 hover:text-neutral-950'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Quick Search */}
          <div className="relative shrink-0 w-full sm:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
            <input
              type="text"
              placeholder="Search creative work..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-full focus:outline-none focus:border-neutral-900 focus:bg-white text-neutral-900 placeholder:text-neutral-400 transition-all shadow-2xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-900 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Pinterest Masonry Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {filteredProjects.length === 0 ? (
          <div className="py-24 text-center border border-dashed border-neutral-200 rounded-2xl">
            <p className="text-sm text-neutral-500 font-medium">
              No pins found for "{searchQuery || activeTab}". Try another filter.
            </p>
          </div>
        ) : (
          <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-4">
            {filteredProjects.map((project) => {
              const isVideo = project.type === 'video';

              return (
                <div
                  key={project.id}
                  onClick={() => setSelectedPin(project)}
                  className="break-inside-avoid mb-4 group relative rounded-2xl overflow-hidden cursor-zoom-in bg-neutral-100 border border-neutral-200/80 shadow-xs hover:shadow-xl transition-all duration-300"
                >
                  {/* Pin Image */}
                  <img
                    src={project.featured_image}
                    alt={project.alt_text || project.title}
                    loading="lazy"
                    className="w-full h-auto block object-cover group-hover:scale-103 transition-transform duration-500"
                  />

                  {/* Top Ratio Tag */}
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                    <span className="px-2 py-0.5 text-[9px] font-black uppercase tracking-wider bg-black/70 text-white backdrop-blur-xs rounded-full">
                      {project.aspect_ratio || '16:9'}
                    </span>
                    {isVideo && (
                      <span className="px-1.5 py-0.5 text-[9px] font-black bg-rose-600 text-white rounded-full flex items-center gap-0.5">
                        <Play className="w-2.5 h-2.5 fill-current" />
                        {project.duration || 'Video'}
                      </span>
                    )}
                  </div>

                  {/* Center Play Button for Videos */}
                  {isVideo && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none group-hover:scale-110 transition-transform">
                      <div className="w-11 h-11 rounded-full bg-black/70 text-white flex items-center justify-center shadow-lg border border-white/20">
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      </div>
                    </div>
                  )}

                  {/* Pinterest-Style Hover Overlay (Dark Gradient + Title + Actions) */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3.5 text-white">
                    {/* Top right WhatsApp Hire button */}
                    <div className="flex justify-end">
                      <a
                        href={`https://wa.me/91${ownerPhone}?text=${encodeURIComponent(`Hi Rupesh, I saw your work "${project.title}" on your portfolio and want something similar.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        title="Inquire on WhatsApp"
                        className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-emerald-600 hover:bg-emerald-500 text-white rounded-full shadow-md flex items-center gap-1"
                      >
                        <MessageSquare className="w-3 h-3" />
                        <span>Hire</span>
                      </a>
                    </div>

                    {/* Bottom Info */}
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-300 block">
                        {project.category}
                      </span>
                      <h3 className="text-xs font-bold leading-snug line-clamp-2 mt-0.5 text-white">
                        {project.title}
                      </h3>
                      {project.client && (
                        <span className="text-[10px] text-neutral-400 block mt-0.5">
                          {project.client}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Pinterest-Style Pin Detail Modal */}
      {selectedPin && (
        <div
          onClick={() => setSelectedPin(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md p-4 sm:p-6 lg:p-10 flex items-center justify-center overflow-y-auto animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl max-h-[92vh] md:max-h-[90vh] bg-transparent md:bg-white rounded-3xl overflow-hidden shadow-2xl md:border md:border-neutral-200 flex flex-col md:flex-row my-auto items-center justify-center"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedPin(null)}
              aria-label="Close modal"
              className="absolute top-3 right-3 sm:top-4 sm:right-4 z-30 p-2.5 rounded-full bg-black/70 md:bg-white/90 text-white md:text-neutral-700 hover:bg-black/90 md:hover:bg-neutral-100 cursor-pointer shadow-xl border-0 md:border md:border-neutral-200 backdrop-blur-md transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Left Side: Large Visual Media */}
            <div className="w-full md:w-3/5 bg-transparent md:bg-neutral-950 flex items-center justify-center p-0 min-h-0 md:min-h-[320px] md:max-h-[85vh] shrink-0 md:overflow-hidden">
              {selectedPin.type === 'video' && selectedPin.video_url ? (
                <video
                  src={selectedPin.video_url}
                  poster={selectedPin.featured_image}
                  controls
                  autoPlay
                  className="w-auto h-auto max-w-full max-h-[85vh] md:max-h-[80vh] md:w-full md:h-full object-contain rounded-2xl md:rounded-none block mx-auto shadow-2xl md:shadow-none"
                />
              ) : (
                <img
                  src={selectedPin.featured_image}
                  alt={selectedPin.title}
                  className="w-auto h-auto max-w-full max-h-[85vh] md:max-h-[80vh] md:w-full md:h-full object-contain rounded-2xl md:rounded-none block mx-auto shadow-2xl md:shadow-none"
                />
              )}
            </div>

            {/* Right Side: Minimal Specs & Actions - Hidden on mobile, shown on desktop */}
            <div className="hidden md:flex md:w-2/5 p-6 sm:p-8 flex-col justify-between overflow-y-auto bg-white">
              <div className="space-y-4">
                {/* Creator info */}
                <div className="flex items-center gap-3 pb-3 border-b border-neutral-100">
                  <div className="w-10 h-10 rounded-full bg-neutral-900 text-white flex items-center justify-center font-black text-xs">
                    RY
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-neutral-950 leading-tight">
                      Rupesh Yadav
                    </h4>
                    <span className="text-[11px] text-neutral-500 font-medium">
                      @rupeshyadavcom
                    </span>
                  </div>
                </div>

                {/* Aspect ratio & Category pills */}
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider bg-neutral-100 text-neutral-800 rounded-full">
                    {selectedPin.aspect_ratio || '16:9'}
                  </span>
                  <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-neutral-100 text-neutral-800 rounded-full">
                    {selectedPin.category}
                  </span>
                  {selectedPin.format_name && (
                    <span className="px-2.5 py-1 text-[10px] font-medium border border-neutral-200 rounded-full text-neutral-600">
                      {selectedPin.format_name}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h2 className="text-xl sm:text-2xl font-black text-neutral-950 leading-tight">
                  {selectedPin.title}
                </h2>

                {/* Short specs */}
                <div className="text-xs text-neutral-600 space-y-1.5 pt-1">
                  {selectedPin.client && (
                    <p>
                      <strong>Client:</strong> {selectedPin.client}
                    </p>
                  )}
                  <p>
                    <strong>Year:</strong> {selectedPin.year}
                  </p>
                  {selectedPin.tools && selectedPin.tools.length > 0 && (
                    <div>
                      <strong>Tools:</strong> {selectedPin.tools.join(', ')}
                    </div>
                  )}
                </div>

                {selectedPin.short_description && (
                  <p className="text-xs text-neutral-600 leading-relaxed pt-2 border-t border-neutral-100">
                    {selectedPin.short_description}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-6 space-y-2.5">
                <a
                  href={`https://wa.me/91${ownerPhone}?text=${encodeURIComponent(`Hi Rupesh, I want to create a project similar to "${selectedPin.title}". Can we discuss?`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 text-xs font-bold uppercase tracking-wider bg-emerald-600 hover:bg-emerald-700 text-white rounded-full transition-colors shadow-md"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Order on WhatsApp</span>
                </a>

                <div className="flex gap-2">
                  <Link
                    href={
                      selectedPin.type === 'case_study'
                        ? `/case-study/${selectedPin.slug}`
                        : `/work/${selectedPin.type}/${selectedPin.slug}`
                    }
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold uppercase tracking-wider bg-neutral-900 text-white rounded-full hover:bg-neutral-800 transition-opacity"
                  >
                    <span>Full Case Details</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>

                  {selectedPin.website_url && (
                    <a
                      href={selectedPin.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 text-xs font-bold uppercase border border-neutral-300 rounded-full flex items-center gap-1 text-neutral-800 hover:bg-neutral-100"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
