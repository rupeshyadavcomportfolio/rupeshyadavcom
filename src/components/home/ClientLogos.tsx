import React from 'react';
import { Client } from '@/types/portfolio';
import { ExternalLink } from 'lucide-react';

export function ClientLogos({ clients }: { clients: Client[] }) {
  const activeClients = clients.filter((c) => c.enabled);

  if (activeClients.length === 0) {
    return null;
  }

  return (
    <section className="w-full py-16 md:py-24 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/30 dark:bg-black/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <span className="text-xs uppercase tracking-widest font-bold text-neutral-400 dark:text-neutral-500">
            Trust & Partnerships
          </span>
          <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight text-neutral-950 dark:text-white mt-1">
            CLIENTS & COLLABORATIONS
          </h2>
          <p className="text-xs md:text-sm text-neutral-600 dark:text-neutral-400 mt-2">
            Brands and businesses I've had the opportunity to work with.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {activeClients.map((client) => {
            const Content = (
              <div className="h-28 p-5 bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 flex flex-col items-center justify-center text-center hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors">
                <span className="text-base font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">
                  {client.company || client.name}
                </span>
                <span className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider mt-1">
                  {client.industry}
                </span>
              </div>
            );

            if (client.website_url) {
              return (
                <a
                  key={client.id}
                  href={client.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group"
                >
                  {Content}
                </a>
              );
            }

            return <div key={client.id}>{Content}</div>;
          })}
        </div>
      </div>
    </section>
  );
}
