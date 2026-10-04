import { Metadata } from 'next';
import Link from 'next/link';
import { getSiteSettings, getProjects } from '@/lib/db';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Services — Graphic Design, Video & Website Development',
  description: 'Creative and technical services offered by Rupesh Yadav: social media design, advertising creatives, vertical reel edits, motion graphics, and Next.js websites.',
};

export default async function ServicesPage() {
  const settings = await getSiteSettings();
  const projects = await getProjects({ status: 'published' });

  return (
    <div className="w-full py-12 md:py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div>
          <span className="text-xs uppercase tracking-widest font-bold text-neutral-400 dark:text-neutral-500">
            Creative Offerings
          </span>
          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-neutral-950 dark:text-white mt-1">
            SERVICES
          </h1>
          <p className="text-sm md:text-base text-neutral-600 dark:text-neutral-400 mt-2 max-w-2xl leading-relaxed">
            Focused, multidisciplinary creative execution across graphic design, motion video, and modern web development.
          </p>
        </div>

        {/* Services List */}
        <div className="space-y-8 divide-y divide-neutral-200 dark:divide-neutral-800">
          {settings.services.filter((s) => s.enabled).map((service, index) => {
            const related = projects.filter(
              (p) =>
                p.category.toLowerCase().includes(service.title.toLowerCase()) ||
                service.title.toLowerCase().includes(p.category.toLowerCase()) ||
                p.services?.some((srv) => srv.toLowerCase().includes(service.title.toLowerCase()))
            ).slice(0, 2);

            return (
              <div
                key={service.title}
                className="pt-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-start"
              >
                <div className="md:col-span-1 text-sm font-mono text-neutral-400">
                  {(index + 1).toString().padStart(2, '0')}
                </div>

                <div className="md:col-span-6 space-y-2">
                  <h2 className="text-xl font-bold uppercase tracking-tight text-neutral-950 dark:text-white">
                    {service.title}
                  </h2>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    {service.short_description}
                  </p>
                  <div className="pt-2">
                    <Link
                      href={`/contact?service=${encodeURIComponent(service.title)}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-950 dark:text-white hover:underline"
                    >
                      Inquire About {service.title}
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                <div className="md:col-span-5 bg-neutral-50 dark:bg-[#111111] p-4 border border-neutral-200 dark:border-neutral-800 rounded-sm">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-2">
                    Sample Deliverables
                  </span>
                  <ul className="text-xs space-y-1.5 text-neutral-700 dark:text-neutral-300">
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                      <span>Production-ready source files & assets</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                      <span>Platform-specific format exports (1:1, 9:16, 16:9)</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                      <span>Revisions & optimization for conversion</span>
                    </li>
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="p-8 md:p-12 bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-bold uppercase tracking-tight">Need a custom scope?</h3>
            <p className="text-xs text-neutral-400 dark:text-neutral-600 mt-1">
              Bundle visual design, motion video, and website build for an integrated launch.
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3.5 text-xs font-bold uppercase tracking-wider bg-white text-neutral-950 dark:bg-neutral-950 dark:text-white"
          >
            LET'S WORK TOGETHER
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
