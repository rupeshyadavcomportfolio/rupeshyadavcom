'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  FolderKanban,
  PlusCircle,
  Image as ImageIcon,
  Building2,
  MessageSquareQuote,
  Inbox,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
} from 'lucide-react';

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'All Projects', href: '/admin/projects', icon: FolderKanban },
    { label: '+ Add New Work', href: '/admin/projects/new', icon: PlusCircle, highlight: true },
    { label: 'Media Library', href: '/admin/media', icon: ImageIcon },
    { label: 'Clients & Brands', href: '/admin/clients', icon: Building2 },
    { label: 'Client Reviews', href: '/admin/reviews', icon: MessageSquareQuote },
    { label: 'Inquiries', href: '/admin/messages', icon: Inbox },
    { label: 'Site Settings', href: '/admin/settings', icon: Settings },
  ];

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  const NavContent = (
    <div className="flex flex-col h-full justify-between">
      <div className="space-y-6">
        {/* Brand */}
        <div className="flex items-center justify-between px-2 pt-2">
          <div>
            <span className="text-xs uppercase tracking-widest font-black text-neutral-400">
              CMS DASHBOARD
            </span>
            <h2 className="text-sm font-bold uppercase tracking-tight text-neutral-950 dark:text-white">
              RUPESH YADAV
            </h2>
          </div>
          <Link
            href="/"
            target="_blank"
            title="View Live Website"
            className="p-1.5 text-neutral-400 hover:text-neutral-950 dark:hover:text-white"
          >
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>

        {/* Links */}
        <nav className="space-y-1">
          {links.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-sm transition-colors ${
                  active
                    ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950'
                    : item.highlight
                    ? 'bg-neutral-200/70 dark:bg-neutral-800 text-neutral-900 dark:text-white hover:bg-neutral-200 dark:hover:bg-neutral-700'
                    : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200/50 dark:hover:bg-neutral-800 hover:text-neutral-950 dark:hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer User Info & Sign Out */}
      <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800 space-y-3 px-2">
        <div className="flex items-center gap-2 text-xs">
          <div className="w-7 h-7 rounded-full bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 flex items-center justify-center font-bold text-[10px]">
            RY
          </div>
          <div className="truncate">
            <span className="block font-bold truncate">Rupesh Yadav</span>
            <span className="block text-[10px] text-neutral-500">Super Admin</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-500/10 rounded-sm cursor-pointer transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>SIGN OUT</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Top App Bar */}
      <div className="md:hidden w-full bg-white dark:bg-[#121212] border-b border-neutral-200 dark:border-neutral-800 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Admin</span>
          <h2 className="text-sm font-bold uppercase text-neutral-950 dark:text-white">Rupesh Yadav CMS</h2>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/projects/new"
            className="px-2.5 py-1.5 text-xs font-bold uppercase bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 rounded-xs"
          >
            + Add
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-1.5 text-neutral-700 dark:text-neutral-300"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Panel */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-x-0 top-[57px] bottom-0 z-50 bg-white dark:bg-[#121212] p-6 overflow-y-auto animate-in fade-in duration-150">
          {NavContent}
        </div>
      )}

      {/* Desktop Sticky Sidebar */}
      <aside className="hidden md:flex flex-col w-64 shrink-0 bg-white dark:bg-[#111111] border-r border-neutral-200 dark:border-neutral-800 p-6 min-h-screen sticky top-0">
        {NavContent}
      </aside>
    </>
  );
}
