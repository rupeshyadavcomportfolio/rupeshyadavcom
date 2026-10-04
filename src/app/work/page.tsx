import { Metadata } from 'next';
import { getProjects, getSiteSettings } from '@/lib/db';
import { PinterestFeed } from '@/components/home/PinterestFeed';

export const metadata: Metadata = {
  title: 'Work Gallery — Rupesh Yadav (@rupeshyadavcom)',
  description: 'Explore the creative visual portfolio of Rupesh Yadav across graphic design, vertical video reels, posters, and web experiences.',
};

export default async function WorkPage() {
  const [projects, settings] = await Promise.all([
    getProjects({ status: 'published' }),
    getSiteSettings(),
  ]);

  return (
    <div className="w-full pt-8 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-neutral-950">
          CREATIVE WORK ARCHIVE
        </h1>
        <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-neutral-500 mt-1">
          Graphic Design • Video Reels • Web Experiences • Brand Identities
        </p>
      </div>

      <PinterestFeed projects={projects} ownerPhone={settings.phone} />
    </div>
  );
}
