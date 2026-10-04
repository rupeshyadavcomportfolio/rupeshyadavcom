import React from 'react';
import { isAuthenticated } from '@/lib/auth';
import { AdminNav } from '@/components/admin/AdminNav';
import { AdminBackButton } from '@/components/admin/AdminBackButton';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth = await isAuthenticated();

  return (
    <div className="min-h-screen bg-neutral-100/70 text-neutral-900">
      {auth ? (
        <div className="min-h-screen flex flex-col">
          {/* Admin Navigation (Fixed Sidebar on Desktop, Mobile Bar on Mobile) */}
          <AdminNav />

          {/* Main Workspace Area */}
          <main className="flex-1 md:pl-64 min-w-0 flex flex-col relative">
            <div className="p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto flex-1 flex flex-col pb-24 md:pb-8">
              <div className="flex-1">{children}</div>
            </div>
            {/* Sticky / Floating Footer Area Back Button */}
            <AdminBackButton />
          </main>
        </div>
      ) : (
        <div className="w-full">{children}</div>
      )}
    </div>
  );
}
