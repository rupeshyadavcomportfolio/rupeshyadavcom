import React from 'react';
import Link from 'next/link';
import { Project } from '@/types/portfolio';
import { ExternalLink, ArrowUpRight } from 'lucide-react';

export function WebsiteSection({ projects, limit }: { projects: Project[]; limit?: number }) {
  const allWebProjects = projects.filter((p) => p.type === 'website' && p.status === 'published');
  const webProjects = limit ? allWebProjects.slice(0, limit) : allWebProjects;

  return (
    <section id="website-work" className="w-full py-12 md:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-neutral-200 dark:border-neutral-800">
      <div className="flex items-center justify-between mb-8">
        <div>
          <span className="text-xs uppercase tracking-widest font-bold text-neutral-400">
            03 / Web Development
          </span>
          <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-neutral-950 dark:text-white mt-1">
            WEBSITE WORK
          </h2>
        </div>
        <Link
          href="/work/web"
          className="text-xs font-bold uppercase tracking-wider text-neutral-500 hover:text-neutral-950 dark:hover:text-white inline-flex items-center gap-1"
        >
          <span>All Websites</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {webProjects.map((project) => (
          <div
            key={project.id}
            className="group bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 rounded-xs overflow-hidden"
          >
            {/* Browser top chrome */}
            <div className="bg-neutral-100 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 px-4 py-2.5 flex items-center justify-between">
              <div className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                <span className="w-2 h-2 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                <span className="w-2 h-2 rounded-full bg-neutral-300 dark:bg-neutral-700" />
              </div>
              <span className="text-[11px] font-mono text-neutral-400">
                {project.slug}.com
              </span>
              <div className="w-4" />
            </div>

            {/* Visual Screenshot */}
            <Link
              href={`/work/web/${project.slug}`}
              className="relative block aspect-16/10 overflow-hidden bg-neutral-100 dark:bg-neutral-900"
            >
              <img
                src={project.desktop_screenshot || project.featured_image}
                alt={project.title}
                loading="lazy"
                className="w-full h-full object-cover object-top group-hover:scale-103 transition-transform duration-500"
              />
            </Link>

            {/* Clean bottom action bar */}
            <div className="p-4 flex items-center justify-between text-xs">
              <div>
                <h3 className="font-bold text-neutral-950 dark:text-white truncate">
                  {project.title}
                </h3>
                <span className="text-[11px] text-neutral-400 font-semibold uppercase">
                  {project.design_role || project.category}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href={`/work/web/${project.slug}`}
                  className="font-bold uppercase text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white"
                >
                  Case Details
                </Link>
                {project.website_url && (
                  <a
                    href={project.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 font-bold uppercase text-[11px] bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 rounded-xs"
                  >
                    <span>Visit Live</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
