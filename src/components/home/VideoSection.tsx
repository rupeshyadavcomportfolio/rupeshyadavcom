'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Project } from '@/types/portfolio';
import { Play, ArrowRight, X } from 'lucide-react';

export function VideoSection({
  projects,
  limit = 4,
}: {
  projects: Project[];
  limit?: number;
}) {
  const videoProjects = projects
    .filter((p) => p.type === 'video' && p.status === 'published')
    .slice(0, limit);

  const [activeModalVideo, setActiveModalVideo] = useState<{
    url: string;
    title: string;
  } | null>(null);

  return (
    <section className="w-full py-16 md:py-24 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-[#0c0c0c]/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-xs uppercase tracking-widest font-bold text-neutral-400 dark:text-neutral-500">
              Motion & Editing
            </span>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-neutral-950 dark:text-white mt-1">
              VIDEO
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2 max-w-xl">
              Short-form videos, advertisements, motion graphics and high-retention reel edits engineered for organic and paid reach.
            </p>
          </div>

          <Link
            href="/work/video"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white hover:opacity-70 transition-opacity"
          >
            VIEW ALL VIDEO WORK
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {videoProjects.map((project) => {
            const isVertical = project.aspect_ratio === '9:16';

            return (
              <div
                key={project.id}
                className="group flex flex-col bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 overflow-hidden hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors"
              >
                {/* Thumbnail with Play Trigger */}
                <div
                  onClick={() => {
                    if (project.video_url) {
                      setActiveModalVideo({
                        url: project.video_url,
                        title: project.title,
                      });
                    }
                  }}
                  className={`relative cursor-pointer overflow-hidden bg-neutral-900 ${
                    isVertical ? 'aspect-9/16 sm:aspect-4/5 lg:aspect-9/16' : 'aspect-16/9'
                  }`}
                >
                  <img
                    src={project.featured_image}
                    alt={project.alt_text || project.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                  />

                  {/* Play Button Badge */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-black/70 border border-white/30 text-white flex items-center justify-center group-hover:scale-110 group-hover:bg-white group-hover:text-black transition-all shadow-lg">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-black/80 text-white rounded-xs">
                      {project.video_type || project.category}
                    </span>
                  </div>

                  {project.duration && (
                    <div className="absolute bottom-3 right-3">
                      <span className="px-2 py-0.5 text-[10px] font-semibold bg-black/80 text-white rounded-xs">
                        {project.duration}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col flex-1 justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 mb-1">
                      <span className="uppercase tracking-wider font-semibold">{project.category}</span>
                      {project.client && <span>{project.client}</span>}
                    </div>
                    <Link href={`/work/video/${project.slug}`}>
                      <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 group-hover:underline line-clamp-1">
                        {project.title}
                      </h3>
                    </Link>
                  </div>

                  <div className="mt-3 pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs">
                    <Link
                      href={`/work/video/${project.slug}`}
                      className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white"
                    >
                      Case details →
                    </Link>
                    {project.video_url && (
                      <button
                        type="button"
                        onClick={() =>
                          setActiveModalVideo({
                            url: project.video_url!,
                            title: project.title,
                          })
                        }
                        className="font-bold text-neutral-900 dark:text-neutral-200 hover:underline cursor-pointer"
                      >
                        Play Now
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Video Player Modal */}
        {activeModalVideo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-4xl bg-neutral-950 rounded-sm overflow-hidden border border-neutral-800">
              <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800 text-white">
                <span className="text-sm font-bold truncate">{activeModalVideo.title}</span>
                <button
                  type="button"
                  onClick={() => setActiveModalVideo(null)}
                  className="p-1 text-neutral-400 hover:text-white"
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
      </div>
    </section>
  );
}
