import React from 'react';
import Link from 'next/link';
import { SiteSettings } from '@/types/portfolio';
import { ArrowUpRight } from 'lucide-react';

export function ServicesSection({ settings }: { settings: SiteSettings }) {
  const activeServices = settings.services.filter((s) => s.enabled);

  return (
    <section id="services" className="w-full py-16 md:py-24 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-[#0c0c0c]/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-xs uppercase tracking-widest font-bold text-neutral-400 dark:text-neutral-500">
              Capabilities
            </span>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-neutral-950 dark:text-white mt-1">
              SERVICES
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2 max-w-lg">
              Specialized visual and digital execution across graphic, video, and web engineering.
            </p>
          </div>

          <Link
            href="/contact"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-950 dark:text-white hover:opacity-75 transition-opacity"
          >
            INQUIRE ABOUT A SERVICE
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {activeServices.map((service, index) => (
            <div
              key={service.title}
              className="p-6 bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 flex flex-col justify-between hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors group"
            >
              <div>
                <span className="text-xs font-mono text-neutral-400 dark:text-neutral-500">
                  {(index + 1).toString().padStart(2, '0')}
                </span>
                <h3 className="text-base font-bold text-neutral-950 dark:text-white mt-3 group-hover:underline">
                  {service.title}
                </h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-2 leading-relaxed">
                  {service.short_description}
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-neutral-100 dark:border-neutral-800">
                <Link
                  href={`/contact?service=${encodeURIComponent(service.title)}`}
                  className="text-[11px] font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-200 inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                >
                  Start Project
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
