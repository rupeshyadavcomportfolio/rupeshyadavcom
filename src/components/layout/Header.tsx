'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Search, ArrowUpRight } from 'lucide-react';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { label: 'WORK', href: '/work' },
    { label: 'ABOUT', href: '/about' },
    { label: 'SERVICES', href: '/services' },
    { label: 'CONTACT', href: '/contact' },
  ];

  const isActive = (href: string) => {
    if (href === '/work') return pathname.startsWith('/work') || pathname.startsWith('/case-study');
    return pathname === href;
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/90 dark:bg-[#0c0c0c]/90 border-b border-neutral-200 dark:border-neutral-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand */}
        <Link
          href="/"
          className="text-lg md:text-xl font-bold tracking-tight text-neutral-950 dark:text-white uppercase hover:opacity-80 transition-opacity"
        >
          RUPESH YADAV
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-xs font-semibold tracking-wider transition-colors uppercase ${
                isActive(item.href)
                  ? 'text-neutral-950 dark:text-white border-b-2 border-neutral-950 dark:border-white pb-1'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="hidden md:flex items-center space-x-4">
          <Link
            href="/search"
            aria-label="Search work"
            className="p-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white transition-colors"
          >
            <Search className="w-4 h-4" />
          </Link>
          <ThemeToggle />
          <Link
            href="/contact"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold tracking-wider uppercase bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 rounded-sm hover:opacity-90 transition-opacity"
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
            className="p-2 text-neutral-600 dark:text-neutral-400"
          >
            <Search className="w-4 h-4" />
          </Link>
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="p-2 text-neutral-950 dark:text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#0c0c0c] px-6 py-8 space-y-6 animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col space-y-4">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-lg font-bold tracking-wide uppercase ${
                  isActive(item.href)
                    ? 'text-neutral-950 dark:text-white'
                    : 'text-neutral-500 dark:text-neutral-400'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800">
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-3.5 text-xs font-bold tracking-wider uppercase bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 rounded-sm"
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
