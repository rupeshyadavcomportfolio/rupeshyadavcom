'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Project } from '@/types/portfolio';
import { Play, X, ArrowUpRight, MessageSquare } from 'lucide-react';

export function VideoPinterestWall({
  projects,
  ownerPhone = '8839775265',
}: {
  projects: Project[];
  ownerPhone?: string;
}) {
  const videoProjects = useMemo(() => {
    return projects
      .filter((p) => p.type === 'video' && p.status === 'published')
      .sort((a, b) => new Date(b.created_at || b.updated_at || 0).getTime() - new Date(a.created_at || a.updated_at || 0).getTime());
  }, [projects]);

  const [activeFilter, setActiveFilter] = useState<'all' | '9:16' | '16:9'>('all');
  const [activeModalVideo, setActiveModalVideo] = useState<{ url: string; title: string } | null>(null);

  const filtered = useMemo(() => {
    if (activeFilter === 'all') return videoProjects;
    return videoProjects.filter((p) => p.aspect_ratio === activeFilter);
  }, [videoProjects, activeFilter]);

  return (
    <section id="video-section" className="w-full py-10 md:py-14 bg-gradient-to-br from-slate-50 via-indigo-50/40 to-emerald-50/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Category Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between items-center md:items-end text-center md:text-left gap-4">
          <div className="flex flex-col items-center md:items-start">
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-neutral-950">
              VIDEO & MOTION
            </h2>
          </div>

          <Link
            href="/work/video"
            className="text-xs font-bold uppercase tracking-wider text-neutral-600 hover:text-neutral-950 inline-flex items-center justify-center gap-1"
          >
            <span>View All Videos</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Video Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2">
          {[
            { label: 'ALL VIDEOS', value: 'all' },
            { label: 'VERTICAL REELS / SHORTS (9:16)', value: '9:16' },
            { label: 'LANDSCAPE ADS & MOTION (16:9)', value: '16:9' },
          ].map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setActiveFilter(tab.value as any)}
              className={`px-4 py-2 text-xs font-bold whitespace-nowrap rounded-full transition-all cursor-pointer ${
                activeFilter === tab.value
                  ? 'bg-neutral-900 text-white shadow-sm scale-102'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Video Masonry Grid */}
        <div className="columns-2 sm:columns-2 md:columns-3 lg:columns-4 gap-4">
          {filtered.map((project) => {
            const isVertical = project.aspect_ratio === '9:16';

            return (
              <div
                key={project.id}
                onClick={() => {
                  if (project.video_url) {
                    setActiveModalVideo({ url: project.video_url, title: project.title });
                  }
                }}
                className="break-inside-avoid mb-4 group relative rounded-2xl overflow-hidden cursor-pointer bg-neutral-100 border border-neutral-200 shadow-xs hover:shadow-xl transition-all duration-300"
              >
                <img
                  src={project.featured_image}
                  alt={project.title}
                  loading="lazy"
                  className="w-full h-auto block object-cover group-hover:scale-104 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                />

                {/* Aspect ratio & duration tags */}
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                  <span className="px-2 py-0.5 text-[9px] font-black uppercase tracking-wider bg-black/75 text-white backdrop-blur-xs rounded-full">
                    {project.aspect_ratio || '16:9'}
                  </span>
                  {project.duration && (
                    <span className="px-2 py-0.5 text-[9px] font-bold bg-rose-600 text-white rounded-full">
                      {project.duration}
                    </span>
                  )}
                </div>

                {/* Center Big Play Button */}
                <div className="absolute inset-0 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <div className="w-12 h-12 rounded-full bg-black/70 text-white flex items-center justify-center shadow-lg border border-white/20 group-hover:bg-white group-hover:text-black transition-colors">
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </div>
                </div>

                {/* Pinterest Hover Info & WhatsApp Hire */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3.5 text-white">
                  <div className="flex justify-end">
                    <a
                      href={`https://wa.me/91${ownerPhone}?text=${encodeURIComponent(`Hi Rupesh, I want to edit a video like "${project.title}".`)}`}
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
                    <h3 className="text-xs font-bold leading-snug line-clamp-1 mt-0.5 text-white">
                      {project.title}
                    </h3>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Video Player Modal */}
      {activeModalVideo && (
        <div
          onClick={() => setActiveModalVideo(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl bg-neutral-950 rounded-2xl overflow-hidden border border-neutral-800"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800 text-white">
              <span className="text-xs font-bold uppercase tracking-wider truncate">
                {activeModalVideo.title}
              </span>
              <button
                type="button"
                onClick={() => setActiveModalVideo(null)}
                className="p-1 text-neutral-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="aspect-16/9 bg-black flex items-center justify-center">
              <video
                src={activeModalVideo.url}
                controls
                autoPlay
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
