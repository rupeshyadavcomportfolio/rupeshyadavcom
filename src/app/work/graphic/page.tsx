import { Metadata } from 'next';
import Link from 'next/link';
import { getProjects } from '@/lib/db';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Graphic Design Work — Social Media, Branding & Posters',
  description: 'Selected graphic design, social media campaigns, visual branding, and print posters created by Rupesh Yadav.',
};

export default async function GraphicWorkPage() {
  const projects = await getProjects({ type: 'graphic', status: 'published' });

  const getAspectClass = (ratio?: string) => {
    switch (ratio) {
      case '1:1':
        return 'aspect-square';
      case '4:5':
        return 'aspect-4/5';
      case '9:16':
        return 'aspect-9/16';
      case '3:4':
        return 'aspect-3/4';
      case '4:3':
        return 'aspect-4/3';
      case '16:9':
      default:
        return 'aspect-16/9';
    }
  };

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
            GRAPHIC DESIGN
          </h1>
          <p className="text-sm md:text-base text-neutral-600 dark:text-neutral-400 mt-2 max-w-2xl leading-relaxed">
            High-contrast visual design, advertising creatives, brand identity packages, and print collateral engineered for clarity and emotional resonance.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
          {projects.map((project) => (
            <div
              key={project.id}
              className="group flex flex-col bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 overflow-hidden hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors"
            >
              <Link
                href={`/work/graphic/${project.slug}`}
                className={`relative block w-full overflow-hidden bg-neutral-100 dark:bg-neutral-900 ${getAspectClass(
                  project.aspect_ratio
                )}`}
              >
                <img
                  src={project.featured_image}
                  alt={project.alt_text || project.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                />

                {project.format_name && (
                  <span className="absolute top-3 left-3 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-black/80 text-white rounded-xs">
                    {project.format_name}
                  </span>
                )}

                <div className="absolute inset-0 bg-neutral-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
                  <span className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold uppercase tracking-wider bg-white text-neutral-950 shadow-md">
                    VIEW PROJECT
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>

              <div className="p-4 flex flex-col flex-1 justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 mb-1">
                    <span className="uppercase tracking-wider font-semibold">{project.category}</span>
                    <span>{project.year}</span>
                  </div>
                  <Link href={`/work/graphic/${project.slug}`}>
                    <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 group-hover:underline line-clamp-1">
                      {project.title}
                    </h2>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
