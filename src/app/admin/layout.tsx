import React from 'react';
import { isAuthenticated } from '@/lib/auth';
import { AdminNav } from '@/components/admin/AdminNav';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth = await isAuthenticated();

  return (
    <div className="min-h-screen bg-neutral-100/60 dark:bg-[#080808] transition-colors">
      {auth ? (
        <div className="flex flex-col md:flex-row min-h-screen">
          {/* Admin Navigation */}
          <AdminNav />

          {/* Main Workspace Area */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto overflow-y-auto">
            {children}
          </main>
        </div>
      ) : (
        <div className="w-full">{children}</div>
      )}
    </div>
  );
}
