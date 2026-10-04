import React from 'react';
import Link from 'next/link';
import { SiteSettings } from '@/types/portfolio';
import { ArrowUpRight } from 'lucide-react';

export function Footer({ settings }: { settings: SiteSettings }) {
  return (
    <footer className="w-full border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-[#080808] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16">
          {/* Brand & Tagline */}
          <div className="md:col-span-5 space-y-4">
            <Link
              href="/"
              className="text-2xl font-bold tracking-tight text-neutral-950 dark:text-white uppercase"
            >
              RUPESH YADAV
            </Link>
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              {settings.professional_title}
            </p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-sm pt-2 leading-relaxed">
              {settings.footer_text}
            </p>
            <div className="pt-2">
              <a
                href={`tel:${settings.phone}`}
                className="inline-block text-sm font-medium text-neutral-900 dark:text-neutral-200 hover:underline"
              >
                +91 {settings.phone}
              </a>
              <span className="mx-2 text-neutral-400">•</span>
              <a
                href={`mailto:${settings.email}`}
                className="inline-block text-sm font-medium text-neutral-900 dark:text-neutral-200 hover:underline"
              >
                {settings.email}
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
              Navigation
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/work"
                  className="text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white transition-colors"
                >
                  WORK
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white transition-colors"
                >
                  ABOUT
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white transition-colors"
                >
                  SERVICES
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white transition-colors"
                >
                  CONTACT
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
              Connect ({settings.social_handle})
            </h4>
            <ul className="space-y-2.5">
              {settings.social_links.map((link) => (
                <li key={link.platform}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white transition-colors group"
                  >
                    <span>{link.platform}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="mt-16 pt-8 border-t border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 dark:text-neutral-500 gap-4">
          <p>© 2026 Rupesh Yadav. All rights reserved.</p>
          <div className="flex items-center space-x-6">
            <Link href="/privacy-policy" className="hover:underline">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:underline">
              Terms
            </Link>
            <Link href="/admin" className="opacity-40 hover:opacity-100 transition-opacity">
              CMS Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
