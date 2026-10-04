import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getProjectBySlug, getProjects, getSiteSettings } from '@/lib/db';
import { generateCreativeWorkSchema, generateBreadcrumbSchema, BASE_URL } from '@/lib/seo';
import { ArrowLeft, ArrowUpRight, ExternalLink, Calendar, User, Wrench, Layers } from 'lucide-react';

interface Props {
  params: Promise<{ type: string; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return { title: 'Project Not Found' };
  }

  const title = project.seo?.seo_title || `${project.title} | Rupesh Yadav`;
  const description = project.seo?.seo_description || project.short_description;
  const canonicalUrl = `${BASE_URL}/work/${project.type}/${project.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      images: [
        {
          url: project.seo?.og_image || project.featured_image,
          width: 1200,
          height: 630,
          alt: project.alt_text || project.title,
        },
      ],
    },
    robots: {
      index: !project.seo?.no_index,
      follow: !project.seo?.no_index,
    },
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { type, slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project || project.status === 'private') {
    notFound();
  }

  const [settings, allProjects] = await Promise.all([
    getSiteSettings(),
    getProjects({ status: 'published' }),
  ]);

  const creativeWorkSchema = generateCreativeWorkSchema(project, settings);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Work', url: '/work' },
    { name: project.type.toUpperCase(), url: `/work/${project.type}` },
    { name: project.title, url: `/work/${project.type}/${project.slug}` },
  ]);

  // Find related projects (same type or shared category)
  const relatedProjects = allProjects
    .filter((p) => p.id !== project.id && (p.type === project.type || p.category === project.category))
    .slice(0, 3);

  return (
    <article className="w-full py-10 md:py-16">
      {/* Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorkSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Navigation & Breadcrumbs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-6 text-xs">
          <Link
            href={`/work/${project.type}`}
            className="inline-flex items-center gap-1.5 font-bold uppercase tracking-wider text-neutral-500 hover:text-neutral-950 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to {project.type} Work</span>
          </Link>

          <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-neutral-400">
            <Link href="/" className="hover:underline">Home</Link>
            <span>/</span>
            <Link href="/work" className="hover:underline">Work</Link>
            <span>/</span>
            <span className="uppercase">{project.type}</span>
            <span>/</span>
            <span className="text-neutral-900 dark:text-neutral-200 truncate max-w-[200px]">
              {project.title}
            </span>
          </nav>
        </div>

        {/* Header Block */}
        <header className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 text-xs font-bold uppercase tracking-wider bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 rounded-xs">
              {project.category}
            </span>
            {project.format_name && (
              <span className="px-2.5 py-1 text-xs font-medium uppercase tracking-wider border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 rounded-xs">
                {project.format_name}
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-neutral-950 dark:text-white uppercase leading-tight">
            {project.title}
          </h1>

          <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 max-w-3xl leading-relaxed">
            {project.short_description}
          </p>
        </header>

        {/* Featured Media Container */}
        <div className="w-full overflow-hidden bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-sm">
          {project.type === 'video' && project.video_url ? (
            <div className="w-full bg-black flex items-center justify-center p-2 sm:p-6">
              <div
                className={`w-full overflow-hidden rounded-md bg-black ${
                  project.aspect_ratio === '9:16'
                    ? 'aspect-9/16 max-w-sm'
                    : project.aspect_ratio === '4:5'
                    ? 'aspect-4/5 max-w-md'
                    : project.aspect_ratio === '1:1'
                    ? 'aspect-square max-w-lg'
                    : project.aspect_ratio === '21:9'
                    ? 'aspect-21/9 max-w-5xl'
                    : 'aspect-16/9 max-w-5xl'
                }`}
              >
                <video
                  src={project.video_url}
                  poster={project.featured_image}
                  controls
                  playsInline
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          ) : (
            <img
              src={project.featured_image}
              alt={project.alt_text || project.title}
              className="w-full h-auto object-cover max-h-[750px]"
            />
          )}

          {project.caption && (
            <div className="p-3 bg-neutral-50 dark:bg-neutral-950 border-t border-neutral-200 dark:border-neutral-800 text-xs text-neutral-500 text-center italic">
              {project.caption}
            </div>
          )}
        </div>

        {/* Project Meta Information Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 p-6 bg-neutral-50 dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800">
          <div>
            <span className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-1">
              Client
            </span>
            <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              {project.client || 'Self-Commissioned'}
            </span>
          </div>

          <div>
            <span className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-1">
              Year
            </span>
            <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              {project.year}
            </span>
          </div>

          <div>
            <span className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-1">
              Format / Ratio
            </span>
            <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              {project.aspect_ratio || '16:9'}
            </span>
          </div>

          <div>
            <span className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-1">
              Discipline
            </span>
            <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 capitalize">
              {project.type}
            </span>
          </div>
        </div>

        {/* Project Narrative & Tools */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start pt-4">
          <div className="md:col-span-8 space-y-6">
            <h2 className="text-xl font-bold uppercase tracking-tight text-neutral-950 dark:text-white">
              Project Overview
            </h2>
            <div className="prose dark:prose-invert max-w-none text-sm md:text-base text-neutral-700 dark:text-neutral-300 leading-relaxed whitespace-pre-line">
              {project.description}
            </div>

            {project.website_url && (
              <div className="pt-4">
                <a
                  href={project.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 text-xs font-bold uppercase tracking-wider bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 rounded-sm hover:opacity-90"
                >
                  VISIT LIVE WEBSITE
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}
          </div>

          <div className="md:col-span-4 space-y-6 p-6 border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950">
            {/* Tools */}
            {project.tools && project.tools.length > 0 && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-3 flex items-center gap-1.5">
                  <Wrench className="w-3.5 h-3.5" />
                  Software & Tools
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {project.tools.map((tool) => (
                    <span
                      key={tool}
                      className="px-2.5 py-1 text-xs font-medium bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Services */}
            {project.services && project.services.length > 0 && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-3 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" />
                  Services Provided
                </h3>
                <ul className="space-y-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-300">
                  {project.services.map((service) => (
                    <li key={service} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
                      <span>{service}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Gallery Section */}
        {project.gallery && project.gallery.length > 0 && (
          <div className="pt-8 border-t border-neutral-200 dark:border-neutral-800 space-y-6">
            <h2 className="text-xl font-bold uppercase tracking-tight text-neutral-950 dark:text-white">
              Visual Gallery
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {project.gallery.map((item, idx) => (
                <div
                  key={idx}
                  className="overflow-hidden bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-sm"
                >
                  <img
                    src={item.url}
                    alt={item.alt || `${project.title} gallery asset ${idx + 1}`}
                    loading="lazy"
                    className="w-full h-auto object-cover"
                  />
                  {item.caption && (
                    <div className="p-3 bg-neutral-50 dark:bg-neutral-950 border-t border-neutral-200 dark:border-neutral-800 text-xs text-neutral-500 text-center">
                      {item.caption}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom CTA Block */}
        <div className="p-8 md:p-12 bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <h3 className="text-xl md:text-2xl font-bold uppercase tracking-tight">
              HAVE A SIMILAR PROJECT IN MIND?
            </h3>
            <p className="text-xs md:text-sm text-neutral-400 dark:text-neutral-600">
              Let's discuss how we can create something exceptional together.
            </p>
          </div>
          <Link
            href={`/contact?service=${encodeURIComponent(project.category)}`}
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-xs font-bold uppercase tracking-wider bg-white text-neutral-950 dark:bg-neutral-950 dark:text-white hover:opacity-90 transition-opacity"
          >
            LET'S WORK TOGETHER
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Related Projects */}
        {relatedProjects.length > 0 && (
          <div className="pt-10 border-t border-neutral-200 dark:border-neutral-800 space-y-6">
            <h3 className="text-base font-bold uppercase tracking-wider text-neutral-400">
              More Projects
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedProjects.map((p) => (
                <Link
                  key={p.id}
                  href={`/work/${p.type}/${p.slug}`}
                  className="group block bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 overflow-hidden hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors"
                >
                  <div className="aspect-16/10 overflow-hidden bg-neutral-100 dark:bg-neutral-900">
                    <img
                      src={p.featured_image}
                      alt={p.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                      {p.category}
                    </span>
                    <h4 className="text-sm font-bold text-neutral-950 dark:text-white truncate group-hover:underline">
                      {p.title}
                    </h4>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
