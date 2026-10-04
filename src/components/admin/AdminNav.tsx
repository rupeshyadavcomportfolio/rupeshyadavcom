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
  ArrowLeft,
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
    if (href === '/admin/projects') return pathname === '/admin/projects';
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
            <h2 className="text-sm font-bold uppercase tracking-tight text-neutral-950">
              RUPESH YADAV
            </h2>
          </div>
          <Link
            href="/"
            target="_blank"
            title="View Live Website"
            className="p-1.5 text-neutral-500 hover:text-neutral-950"
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
                className={`flex items-center gap-3 px-3.5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-colors ${
                  active
                    ? 'bg-neutral-950 text-white shadow-xs'
                    : item.highlight
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/80 hover:bg-emerald-100'
                    : 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-950'
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
      <div className="pt-6 border-t border-neutral-200 space-y-3 px-2">
        <div className="flex items-center gap-2 text-xs">
          <div className="w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold text-xs">
            RY
          </div>
          <div className="truncate">
            <span className="block font-bold text-neutral-900 truncate">Rupesh Yadav</span>
            <span className="block text-[11px] text-neutral-500">Super Admin</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl cursor-pointer transition-colors"
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
      <div className="md:hidden w-full bg-white border-b border-neutral-200 px-4 py-3 flex items-center justify-between sticky top-0 z-40 shadow-xs">
        <div className="flex items-center gap-2">
          {pathname !== '/admin' && (
            <button
              type="button"
              onClick={() => {
                if (typeof window !== 'undefined' && window.history.length > 1) {
                  router.back();
                } else {
                  router.push('/admin');
                }
              }}
              title="Go back"
              aria-label="Go back"
              className="p-1.5 -ml-1 text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Admin</span>
            <h2 className="text-sm font-bold uppercase text-neutral-950">Rupesh Yadav CMS</h2>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/projects/new"
            className="px-3 py-1.5 text-xs font-bold uppercase bg-neutral-950 text-white rounded-lg shadow-xs"
          >
            + Add
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-1.5 text-neutral-800"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Panel */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-x-0 top-[57px] bottom-0 z-50 bg-white p-6 overflow-y-auto animate-in fade-in duration-150 shadow-xl border-b border-neutral-200">
          {NavContent}
        </div>
      )}

      {/* Desktop Fixed/Sticky Sidebar (locked in place, does not scroll with content) */}
      <aside className="hidden md:flex flex-col w-64 fixed top-0 left-0 bottom-0 h-screen z-30 bg-white border-r border-neutral-200 p-6 overflow-y-auto shadow-xs">
        {NavContent}
      </aside>
    </>
  );
}
