import React from 'react';
import Link from 'next/link';
import { Project } from '@/types/portfolio';
import { ExternalLink, ArrowUpRight, MessageSquare } from 'lucide-react';

export function WebsitePinterestWall({
  projects,
  ownerPhone = '8839775265',
}: {
  projects: Project[];
  ownerPhone?: string;
}) {
  const webProjects = projects.filter((p) => p.type === 'website' && p.status === 'published');

  return (
    <section id="website-section" className="w-full py-10 md:py-14 border-t border-neutral-200 dark:border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Category Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest font-black text-emerald-500">
              CATEGORY 03
            </span>
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-neutral-950 dark:text-white mt-0.5">
              WEBSITES & WEB APPS
            </h2>
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mt-1">
              Next.js Applications • Editorial Portfolios • E-Commerce • UI/UX
            </p>
          </div>

          <Link
            href="/work/web"
            className="text-xs font-bold uppercase tracking-wider text-neutral-500 hover:text-neutral-950 dark:hover:text-white inline-flex items-center gap-1"
          >
            <span>View All Websites</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Website Pins Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {webProjects.map((project) => (
            <div
              key={project.id}
              className="group bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300"
            >
              {/* Browser Header Bar */}
              <div className="bg-neutral-100 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 px-4 py-2.5 flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                  <span className="w-2.5 h-2.5 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                  <span className="w-2.5 h-2.5 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                </div>
                <span className="text-[11px] font-mono text-neutral-400 truncate">
                  {project.slug}.com
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  {project.design_role || 'Live Web'}
                </span>
              </div>

              {/* Screenshot */}
              <Link
                href={`/work/web/${project.slug}`}
                className="relative block aspect-16/10 overflow-hidden bg-neutral-100 dark:bg-neutral-900"
              >
                <img
                  src={project.desktop_screenshot || project.featured_image}
                  alt={project.title}
                  loading="lazy"
                  className="w-full h-full object-cover object-top group-hover:scale-102 transition-transform duration-500"
                />
              </Link>

              {/* Clean Bottom Actions */}
              <div className="p-4 flex items-center justify-between text-xs">
                <div>
                  <h3 className="font-bold text-neutral-950 dark:text-white truncate">
                    {project.title}
                  </h3>
                  <span className="text-[11px] text-neutral-400 font-semibold uppercase">
                    {project.client ? `Client: ${project.client}` : project.category}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`https://wa.me/91${ownerPhone}?text=${encodeURIComponent(`Hi Rupesh, I want to build a website like "${project.title}".`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 font-bold uppercase text-[11px] bg-emerald-600 text-white rounded-full hover:bg-emerald-500 shadow-sm"
                  >
                    <MessageSquare className="w-3 h-3" />
                    <span>Hire</span>
                  </a>

                  {project.website_url && (
                    <a
                      href={project.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1.5 font-bold uppercase text-[11px] bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 rounded-full"
                    >
                      <span>Visit</span>
                      <ExternalLink className="w-3 h-3" />
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
