'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Search, ArrowUpRight } from 'lucide-react';


export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { label: 'HOME', href: '/' },
    { label: 'WORK', href: '/work' },
    { label: 'ABOUT', href: '/about' },
    { label: 'SERVICES', href: '/services' },
    { label: 'CONTACT', href: '/contact' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    if (href === '/work') return pathname.startsWith('/work') || pathname.startsWith('/case-study');
    return pathname.startsWith(href);
  };

  // Do not show public website header on admin panel
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-neutral-200 shadow-2xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand */}
        <Link
          href="/"
          className="text-lg md:text-xl font-black tracking-tight text-neutral-950 uppercase hover:opacity-80 transition-opacity flex items-center gap-2"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span>RUPESH YADAV</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-xs font-bold tracking-wider transition-colors uppercase py-1 ${
                  active
                    ? 'text-neutral-950 border-b-2 border-neutral-950 font-black'
                    : 'text-neutral-600 hover:text-neutral-950'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="hidden md:flex items-center space-x-4">
          <Link
            href="/search"
            aria-label="Search work"
            className="p-2.5 rounded-full text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100 transition-colors"
          >
            <Search className="w-4 h-4" />
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold tracking-wider uppercase bg-neutral-950 text-white rounded-full hover:bg-neutral-800 transition-all shadow-xs"
          >
            LET'S WORK TOGETHER
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center space-x-2 md:hidden">
          <Link
            href="/search"
            aria-label="Search work"
            className="p-2 text-neutral-700"
          >
            <Search className="w-4 h-4" />
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="p-2 text-neutral-950 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-neutral-200 bg-white px-6 py-8 space-y-6 animate-in slide-in-from-top duration-200 shadow-lg">
          <nav className="flex flex-col space-y-4">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-base font-bold tracking-wide uppercase ${
                  isActive(item.href)
                    ? 'text-neutral-950 font-black'
                    : 'text-neutral-600 hover:text-neutral-950'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="pt-4 border-t border-neutral-200 space-y-2.5">
            <a
              href="https://wa.me/918839775265?text=Hi%20Rupesh,%20I%20am%20interested%20in%20discussing%20a%20project!"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-3 text-xs font-bold tracking-wider uppercase bg-emerald-600 hover:bg-emerald-500 text-white rounded-full shadow-xs"
            >
              CHAT ON WHATSAPP
            </a>
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-3 text-xs font-bold tracking-wider uppercase bg-neutral-900 text-white rounded-full shadow-xs"
            >
              LET'S WORK TOGETHER
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
