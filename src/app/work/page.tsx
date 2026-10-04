import { Metadata } from 'next';
import { getProjects } from '@/lib/db';
import { WorkFilterView } from '@/components/work/WorkFilterView';

export const metadata: Metadata = {
  title: 'Work — Selected Creative Projects',
  description: 'Explore the complete creative archive of Rupesh Yadav across graphic design, short-form video production, and modern web applications.',
};

export default async function WorkPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await searchParams;
  const projects = await getProjects({ status: 'published' });

  return (
    <div className="w-full py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div>
          <span className="text-xs uppercase tracking-widest font-bold text-neutral-400 dark:text-neutral-500">
            Portfolio Archive
          </span>
          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-neutral-950 dark:text-white mt-1">
            WORK
          </h1>
          <p className="text-sm md:text-base text-neutral-600 dark:text-neutral-400 mt-2 max-w-2xl leading-relaxed">
            A comprehensive collection of graphic design, video editing, and web development projects created for brands and businesses.
          </p>
        </div>

        <WorkFilterView initialProjects={projects} initialType={type || 'all'} />
      </div>
    </div>
  );
}
