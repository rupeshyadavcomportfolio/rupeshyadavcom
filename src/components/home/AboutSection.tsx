import React from 'react';
import Link from 'next/link';
import { SiteSettings } from '@/types/portfolio';
import { ArrowUpRight, Phone, AtSign, CheckCircle2 } from 'lucide-react';

export function AboutSection({ settings }: { settings: SiteSettings }) {
  return (
    <section id="about" className="w-full py-16 md:py-24 border-t border-neutral-200 dark:border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Portrait Image Column */}
          <div className="lg:col-span-5">
            <div className="relative aspect-4/5 w-full max-w-md mx-auto overflow-hidden bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
              <img
                src={settings.profile_photo}
                alt="Rupesh Yadav - Creative Designer & Developer"
                loading="lazy"
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute bottom-4 left-4 right-4 p-4 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-xs border border-neutral-200 dark:border-neutral-800">
                <p className="text-xs uppercase tracking-wider font-bold text-neutral-950 dark:text-white">
                  {settings.name}
                </p>
                <p className="text-[11px] font-medium text-neutral-500 uppercase tracking-widest mt-0.5">
                  {settings.social_handle}
                </p>
              </div>
            </div>
          </div>

          {/* Editorial Narrative Column */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="text-xs uppercase tracking-widest font-bold text-neutral-400 dark:text-neutral-500">
                Editorial Profile
              </span>
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-neutral-950 dark:text-white mt-1">
                ABOUT RUPESH
              </h2>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {settings.roles.map((role) => (
                <span
                  key={role}
                  className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-200 rounded-xs"
                >
                  {role}
                </span>
              ))}
            </div>

            <p className="text-base md:text-lg text-neutral-700 dark:text-neutral-300 leading-relaxed pt-2">
              {settings.bio}
            </p>

            {/* Disciplines Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center space-x-2 text-sm text-neutral-800 dark:text-neutral-200 font-medium">
                <CheckCircle2 className="w-4 h-4 text-neutral-950 dark:text-white" />
                <span>Visual Identity & Social Ads</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-neutral-800 dark:text-neutral-200 font-medium">
                <CheckCircle2 className="w-4 h-4 text-neutral-950 dark:text-white" />
                <span>Short-form Video & Motion</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-neutral-800 dark:text-neutral-200 font-medium">
                <CheckCircle2 className="w-4 h-4 text-neutral-950 dark:text-white" />
                <span>Modern Web & Next.js Builds</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-neutral-800 dark:text-neutral-200 font-medium">
                <CheckCircle2 className="w-4 h-4 text-neutral-950 dark:text-white" />
                <span>SEO & Performance Architecture</span>
              </div>
            </div>

            {/* Direct Verification Contacts */}
            <div className="pt-4 flex flex-wrap items-center gap-6 text-sm">
              <a
                href={`tel:${settings.phone}`}
                className="inline-flex items-center gap-2 font-semibold text-neutral-900 dark:text-neutral-100 hover:underline"
              >
                <Phone className="w-4 h-4" />
                <span>+91 {settings.phone}</span>
              </a>
              <span className="inline-flex items-center gap-2 font-semibold text-neutral-900 dark:text-neutral-100">
                <AtSign className="w-4 h-4" />
                <span>{settings.social_handle}</span>
              </span>
            </div>

            <div className="pt-2">
              <Link
                href="/about"
                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-950 dark:text-white hover:underline"
              >
                Read Full Profile & Tools
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
