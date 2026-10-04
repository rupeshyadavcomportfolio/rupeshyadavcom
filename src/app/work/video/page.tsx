import { Metadata } from 'next';
import Link from 'next/link';
import { getProjects } from '@/lib/db';
import { ArrowLeft } from 'lucide-react';
import { VideoSection } from '@/components/home/VideoSection';

export const metadata: Metadata = {
  title: 'Video Work — Reels, Commercial Ads & Motion Graphics',
  description: 'Explore video editing, commercials, motion design, and high-retention vertical reels created by Rupesh Yadav.',
};

export default async function VideoWorkPage() {
  const projects = await getProjects({ type: 'video', status: 'published' });

  return (
    <div className="w-full py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div>
          <Link
            href="/work"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-500 hover:text-neutral-950 dark:hover:text-white mb-4"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Work</span>
          </Link>
          <span className="block text-xs uppercase tracking-widest font-bold text-neutral-400 dark:text-neutral-500">
            Discipline Archive
          </span>
          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-neutral-950 dark:text-white mt-1">
            VIDEO & MOTION
          </h1>
          <p className="text-sm md:text-base text-neutral-600 dark:text-neutral-400 mt-2 max-w-2xl leading-relaxed">
            Short-form social edits, product films, brand commercials, and kinetic 2D motion graphics produced with rhythmic cuts and sound design.
          </p>
        </div>

        <VideoSection projects={projects} limit={100} />
      </div>
    </div>
  );
}
