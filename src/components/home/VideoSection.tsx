'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Project } from '@/types/portfolio';
import { Play, X, ArrowUpRight } from 'lucide-react';

export function VideoSection({ projects, limit }: { projects: Project[]; limit?: number }) {
  const allVideoProjects = projects.filter((p) => p.type === 'video' && p.status === 'published');
  const videoProjects = limit ? allVideoProjects.slice(0, limit) : allVideoProjects;
  const [activeModalVideo, setActiveModalVideo] = useState<{ url: string; title: string } | null>(null);

  return (
    <section id="video-work" className="w-full py-12 md:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-neutral-200 dark:border-neutral-800">
      <div className="flex items-center justify-between mb-8">
        <div>
          <span className="text-xs uppercase tracking-widest font-bold text-neutral-400">
            02 / Motion & Video
          </span>
          <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-neutral-950 dark:text-white mt-1">
            VIDEO WORK
          </h2>
        </div>
        <Link
          href="/work/video"
          className="text-xs font-bold uppercase tracking-wider text-neutral-500 hover:text-neutral-950 dark:hover:text-white inline-flex items-center gap-1"
        >
          <span>All Videos</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {videoProjects.map((project) => {
          const isVertical = project.aspect_ratio === '9:16';

          return (
            <div
              key={project.id}
              className="group bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 rounded-xs overflow-hidden"
            >
              {/* Video Thumbnail with Instant Play */}
              <div
                onClick={() => {
                  if (project.video_url) {
                    setActiveModalVideo({ url: project.video_url, title: project.title });
                  }
                }}
                className={`relative cursor-pointer overflow-hidden bg-neutral-900 ${
                  isVertical ? 'aspect-9/16 sm:aspect-4/5 lg:aspect-9/16' : 'aspect-16/9'
                }`}
              >
                <img
                  src={project.featured_image}
                  alt={project.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                />

                {/* Big Center Play Icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-black/75 border border-white/30 text-white flex items-center justify-center group-hover:scale-110 group-hover:bg-white group-hover:text-black transition-all shadow-xl">
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </div>
                </div>

                <div className="absolute top-2.5 left-2.5">
                  <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-black/80 text-white rounded-xs">
                    {project.video_type || project.category}
                  </span>
                </div>

                {project.duration && (
                  <div className="absolute bottom-2.5 right-2.5">
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-black/80 text-white rounded-xs">
                      {project.duration}
                    </span>
                  </div>
                )}
              </div>

              {/* Minimal Bottom Info */}
              <div className="p-3.5 flex items-center justify-between text-xs">
                <span className="font-bold text-neutral-900 dark:text-neutral-100 truncate pr-2">
                  {project.title}
                </span>
                <Link
                  href={`/work/video/${project.slug}`}
                  className="text-[11px] font-bold uppercase text-neutral-500 hover:text-neutral-950 dark:hover:text-white shrink-0"
                >
                  Details →
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Video Player Modal */}
      {activeModalVideo && (
        <div
          onClick={() => setActiveModalVideo(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl bg-neutral-950 rounded-xs overflow-hidden border border-neutral-800"
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
