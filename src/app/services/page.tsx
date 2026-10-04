import { Metadata } from 'next';
import Link from 'next/link';
import { getSiteSettings } from '@/lib/db';
import { ArrowUpRight, CheckCircle2, MessageSquare, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Services — Graphic Design, Video Editing & Web Development',
  description:
    'Creative and technical services offered by Rupesh Yadav: Graphic Design, Social Media Ads, Video Editing, Reels, Motion Graphics, and Fast Websites.',
};

export default async function ServicesPage() {
  const settings = await getSiteSettings();

  return (
    <div className="w-full py-10 md:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Page Title & Intro */}
        <div className="border-b border-neutral-200 pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-neutral-100 text-neutral-800 text-xs font-bold uppercase tracking-wider rounded-full mb-3">
            <Sparkles className="w-3.5 h-3.5 text-neutral-600" />
            Creative Offerings & Solutions
          </div>
          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-neutral-950 mt-1">
            SERVICES
          </h1>
          <p className="text-base sm:text-lg text-neutral-700 mt-2 max-w-2xl leading-relaxed">
            Focused, multidisciplinary creative execution across graphic design, high-retention video editing, and modern web development.
          </p>
        </div>

        {/* Services List */}
        <div className="space-y-6">
          {settings.services
            .filter((s) => s.enabled)
            .map((service, index) => {
              const whatsappUrl = `https://wa.me/91${settings.phone}?text=Hi%20Rupesh,%20I%20am%20interested%20in%20your%20${encodeURIComponent(
                service.title
              )}%20services!`;

              return (
                <div
                  key={service.title}
                  className="p-6 md:p-8 bg-white border border-neutral-200 rounded-2xl shadow-xs hover:border-neutral-300 transition-all grid grid-cols-1 md:grid-cols-12 gap-6 items-start"
                >
                  {/* Service Number */}
                  <div className="md:col-span-1 text-base font-black font-mono text-neutral-400">
                    {(index + 1).toString().padStart(2, '0')}
                  </div>

                  {/* Service Info */}
                  <div className="md:col-span-6 space-y-3">
                    <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-neutral-950">
                      {service.title}
                    </h2>
                    <p className="text-sm sm:text-base text-neutral-700 leading-relaxed">
                      {service.short_description}
                    </p>
                    <div className="pt-2 flex flex-wrap items-center gap-3">
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold uppercase tracking-wider bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors shadow-xs"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        Inquire on WhatsApp
                      </a>
                      <Link
                        href={`/contact?service=${encodeURIComponent(service.title)}`}
                        className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-neutral-700 hover:text-neutral-950 hover:underline px-2 py-2"
                      >
                        Project Form
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>

                  {/* Sample Deliverables Card */}
                  <div className="md:col-span-5 bg-neutral-50/80 p-5 border border-neutral-200/90 rounded-xl">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-neutral-500 block mb-3">
                      Sample Deliverables
                    </span>
                    <ul className="text-xs space-y-2 text-neutral-800 font-medium">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Production-ready source files & assets</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Platform-specific format exports (1:1, 9:16, 16:9)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Revisions & optimization for high conversion</span>
                      </li>
                    </ul>
                  </div>
                </div>
              );
            })}
        </div>

        {/* Bottom CTA Box - Clean, friendly, professional */}
        <div className="p-8 sm:p-10 bg-neutral-100 border border-neutral-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-neutral-950">
              Need a custom scope or ongoing retainer?
            </h3>
            <p className="text-sm text-neutral-600">
              Bundle visual design, video editing reels, and modern web development for an integrated launch.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={`https://wa.me/91${settings.phone}?text=Hi%20Rupesh,%20I%20want%20to%20discuss%20a%20custom%20scope%20project!`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-wider bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-xs transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              WhatsApp Us
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-wider bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl transition-colors"
            >
              Contact Form
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
