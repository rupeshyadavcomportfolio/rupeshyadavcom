import React from 'react';
import { Client } from '@/types/portfolio';
import { ExternalLink, Award } from 'lucide-react';

export function ClientLogos({ clients }: { clients: Client[] }) {
  const activeClients = clients.filter((c) => c.enabled);

  if (activeClients.length === 0) {
    return null;
  }

  return (
    <section className="w-full py-16 md:py-24 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-[#0c0c0c]/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 text-xs font-bold uppercase tracking-wider rounded-full mb-3">
            <Award className="w-3.5 h-3.5 text-amber-500" />
            Verified Client Partnerships
          </div>
          <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight text-neutral-950 dark:text-white mt-1">
            CLIENTS & COLLABORATIONS
          </h2>
          <p className="text-xs md:text-sm text-neutral-600 dark:text-neutral-400 mt-2">
            Brands, local businesses, and enterprises I've crafted designs, videos, and web solutions for.
          </p>
        </div>

        {/* 5-column responsive logo grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 md:gap-5">
          {activeClients.map((client) => {
            const Content = (
              <div className="h-40 p-4 bg-white dark:bg-[#141414] border border-neutral-200 dark:border-neutral-800 rounded-2xl flex flex-col items-center justify-between text-center hover:border-neutral-400 dark:hover:border-neutral-600 hover:shadow-md transition-all duration-300 group">
                {/* Logo Image Box */}
                <div className="w-full flex-1 flex items-center justify-center p-2">
                  {client.logo ? (
                    <img
                      src={client.logo}
                      alt={`${client.company || client.name} Logo`}
                      className="max-h-16 max-w-[130px] w-auto h-auto object-contain transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <span className="text-sm font-black text-neutral-800 dark:text-neutral-200">
                      {client.company || client.name}
                    </span>
                  )}
                </div>

                {/* Company Name & Industry */}
                <div className="w-full pt-2 border-t border-neutral-100 dark:border-neutral-800/80">
                  <h3 className="text-xs font-bold text-neutral-900 dark:text-neutral-100 tracking-tight truncate">
                    {client.company || client.name}
                  </h3>
                  <p className="text-[10px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider truncate mt-0.5">
                    {client.industry}
                  </p>
                </div>
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
