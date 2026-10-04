import React from 'react';
import Link from 'next/link';
import { Project } from '@/types/portfolio';
import { ArrowUpRight, ArrowRight } from 'lucide-react';

export function GraphicSection({
  projects,
  limit = 6,
}: {
  projects: Project[];
  limit?: number;
}) {
  const graphicProjects = projects
    .filter((p) => p.type === 'graphic' && p.status === 'published')
    .slice(0, limit);

  // Helper for responsive aspect ratio styles
  const getAspectRatioClass = (ratio?: string) => {
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
    <section className="w-full py-16 md:py-24 border-t border-neutral-200 dark:border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-xs uppercase tracking-widest font-bold text-neutral-400 dark:text-neutral-500">
              Visual Communication & Branding
            </span>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-neutral-950 dark:text-white mt-1">
              GRAPHIC
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2 max-w-xl">
              Selected graphic design, advertising creatives, and visual identity projects crafted with high contrast and meticulous composition.
            </p>
          </div>

          <Link
            href="/work/graphic"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white hover:opacity-70 transition-opacity"
          >
            VIEW ALL GRAPHIC WORK
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Intelligent Grid preserving aspect ratios */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
          {graphicProjects.map((project) => {
            const aspectClass = getAspectRatioClass(project.aspect_ratio);

            return (
              <div
                key={project.id}
                className="group flex flex-col bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 overflow-hidden hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors"
              >
                <Link
                  href={`/work/graphic/${project.slug}`}
                  className={`relative block w-full overflow-hidden bg-neutral-100 dark:bg-neutral-900 ${aspectClass}`}
                >
                  <img
                    src={project.featured_image}
                    alt={project.alt_text || project.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                  />

                  {/* Format tag */}
                  {project.format_name && (
                    <span className="absolute top-3 left-3 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-black/80 text-white backdrop-blur-xs rounded-xs">
                      {project.format_name}
                    </span>
                  )}

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-neutral-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
                    <span className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold uppercase tracking-wider bg-white text-neutral-950 shadow-md">
                      VIEW PROJECT →
                    </span>
                  </div>
                </Link>

                <div className="p-4 flex flex-col flex-1 justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 mb-1">
                      <span className="uppercase tracking-wider font-semibold">{project.category}</span>
                      {project.client && <span>{project.client}</span>}
                    </div>
                    <Link href={`/work/graphic/${project.slug}`}>
                      <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 group-hover:underline line-clamp-1">
                        {project.title}
                      </h3>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile View All */}
        <div className="mt-10 text-center md:hidden">
          <Link
            href="/work/graphic"
            className="inline-flex items-center justify-center gap-2 w-full py-3.5 text-xs font-bold uppercase tracking-wider border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white"
          >
            VIEW ALL GRAPHIC WORK →
          </Link>
        </div>
      </div>
    </section>
  );
}
