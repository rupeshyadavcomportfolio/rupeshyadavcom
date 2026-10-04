import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service — Rupesh Yadav',
  description: 'Terms of service for rupeshyadav.com.',
};

export default function TermsPage() {
  return (
    <div className="w-full py-16 md:py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-neutral-950 dark:text-white">
          TERMS OF SERVICE
        </h1>
        <p className="text-xs text-neutral-500 uppercase tracking-wider">
          Last updated: October 2026
        </p>

        <div className="prose dark:prose-invert text-sm leading-relaxed text-neutral-700 dark:text-neutral-300 space-y-4">
          <p>
            All creative works, images, videos, trademarks, and code showcased on this web application belong to Rupesh Yadav and the respective associated clients.
          </p>
          <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100 uppercase">Usage Rights</h2>
          <p>
            You may not reproduce, redistribute, or reuse portfolio assets for commercial purposes without prior explicit written permission from Rupesh Yadav.
          </p>
          <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100 uppercase">Project Inquiries</h2>
          <p>
            Project quotes, timelines, and deliverables are defined individually through written agreements before commencement.
          </p>
        </div>
      </div>
    </div>
  );
}
