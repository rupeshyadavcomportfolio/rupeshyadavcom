'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SiteSettings } from '@/types/portfolio';

export function Footer({ settings }: { settings: SiteSettings }) {
  const pathname = usePathname();

  // Do not render public footer on admin panel
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="w-full border-t border-neutral-200 bg-neutral-50/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16">
          {/* Brand & Tagline */}
          <div className="md:col-span-7 space-y-4">
            <Link
              href="/"
              className="text-2xl font-bold tracking-tight text-neutral-950 uppercase"
            >
              RUPESH YADAV
            </Link>
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              {settings.professional_title}
            </p>
            <p className="text-sm text-neutral-600 max-w-md pt-2 leading-relaxed">
              {settings.footer_text}
            </p>
            <div className="pt-2">
              <a
                href={`tel:${settings.phone}`}
                className="inline-block text-sm font-medium text-neutral-900 hover:underline"
              >
                +91 {settings.phone}
              </a>
              <span className="mx-2 text-neutral-400">•</span>
              <a
                href={`mailto:${settings.email}`}
                className="inline-block text-sm font-medium text-neutral-900 hover:underline"
              >
                {settings.email}
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-5 md:flex md:justify-end space-y-3">
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-400">
                Navigation
              </h4>
              <ul className="space-y-2.5">
                <li>
                  <Link
                    href="/"
                    className="text-sm font-medium text-neutral-700 hover:text-neutral-950 transition-colors"
                  >
                    HOME
                  </Link>
                </li>
                <li>
                  <Link
                    href="/work"
                    className="text-sm font-medium text-neutral-700 hover:text-neutral-950 transition-colors"
                  >
                    WORK
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="text-sm font-medium text-neutral-700 hover:text-neutral-950 transition-colors"
                  >
                    ABOUT
                  </Link>
                </li>
                <li>
                  <Link
                    href="/services"
                    className="text-sm font-medium text-neutral-700 hover:text-neutral-950 transition-colors"
                  >
                    SERVICES
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-sm font-medium text-neutral-700 hover:text-neutral-950 transition-colors"
                  >
                    CONTACT
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="mt-16 pt-8 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-4">
          <p>© 2026 Rupesh Yadav. All rights reserved.</p>
          <div className="flex items-center space-x-6">
            <Link href="/privacy-policy" className="hover:underline">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:underline">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
