import { Metadata } from 'next';
import { getProjects } from '@/lib/db';
import { SearchClientView } from '@/components/search/SearchClientView';

export const metadata: Metadata = {
  title: 'Search Creative Projects — Rupesh Yadav',
  description: 'Search through graphic design, video production, motion graphics, and web projects by Rupesh Yadav.',
};

export default async function SearchPage() {
  const projects = await getProjects({ status: 'published' });

  return (
    <div className="w-full py-12 md:py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <span className="text-xs uppercase tracking-widest font-bold text-neutral-400 dark:text-neutral-500">
            Archive Explorer
          </span>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-neutral-950 dark:text-white mt-1">
            SEARCH WORK
          </h1>
        </div>

        <SearchClientView projects={projects} />
      </div>
    </div>
  );
}
