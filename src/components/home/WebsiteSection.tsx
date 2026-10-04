import React from 'react';
import Link from 'next/link';
import { Project } from '@/types/portfolio';
import { ArrowUpRight, ArrowRight, ExternalLink } from 'lucide-react';

export function WebsiteSection({
  projects,
  limit = 4,
}: {
  projects: Project[];
  limit?: number;
}) {
  const webProjects = projects
    .filter((p) => p.type === 'website' && p.status === 'published')
    .slice(0, limit);

  return (
    <section className="w-full py-16 md:py-24 border-t border-neutral-200 dark:border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-xs uppercase tracking-widest font-bold text-neutral-400 dark:text-neutral-500">
              Digital Experiences
            </span>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-neutral-950 dark:text-white mt-1">
              WEBSITE
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2 max-w-xl">
              Websites and digital experiences designed and built for real projects. Clean typography, responsive layouts, and performance-first architecture.
            </p>
          </div>

          <Link
            href="/work/web"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white hover:opacity-70 transition-opacity"
          >
            VIEW ALL WEBSITE WORK
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Website Showcase Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {webProjects.map((project) => (
            <div
              key={project.id}
              className="group flex flex-col bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 overflow-hidden hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors"
            >
              {/* Browser Mockup Window */}
              <div className="bg-neutral-100 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 px-4 py-2.5 flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                  <span className="w-2.5 h-2.5 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                  <span className="w-2.5 h-2.5 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                </div>
                <span className="text-[11px] font-mono text-neutral-400 truncate max-w-[200px]">
                  {project.slug}.web
                </span>
                <div className="w-8" />
              </div>

              {/* Screenshot Area */}
              <Link
                href={`/work/web/${project.slug}`}
                className="relative block aspect-16/10 overflow-hidden bg-neutral-100 dark:bg-neutral-900"
              >
                <img
                  src={project.desktop_screenshot || project.featured_image}
                  alt={project.alt_text || project.title}
                  loading="lazy"
                  className="w-full h-full object-cover object-top group-hover:scale-102 transition-transform duration-500"
                />
              </Link>

              {/* Content Card */}
              <div className="p-6 flex flex-col flex-1 justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                      {project.category}
                    </span>
                    {(project.design_role || project.development_role) && (
                      <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 rounded-xs">
                        Role: {project.design_role || project.development_role}
                      </span>
                    )}
                  </div>

                  <Link href={`/work/web/${project.slug}`}>
                    <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 group-hover:underline">
                      {project.title}
                    </h3>
                  </Link>

                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2 line-clamp-2 leading-relaxed">
                    {project.short_description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                  <Link
                    href={`/work/web/${project.slug}`}
                    className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-100 hover:underline inline-flex items-center gap-1"
                  >
                    View Project Details
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  {project.website_url && (
                    <a
                      href={project.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold uppercase tracking-wider text-neutral-500 hover:text-neutral-950 dark:hover:text-white inline-flex items-center gap-1"
                    >
                      VISIT WEBSITE
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
