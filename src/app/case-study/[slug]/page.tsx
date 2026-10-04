import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getProjectBySlug, getSiteSettings } from '@/lib/db';
import { generateCreativeWorkSchema, generateBreadcrumbSchema, BASE_URL } from '@/lib/seo';
import { ArrowLeft, ArrowUpRight, CheckCircle2, Target, Lightbulb, Compass, BarChart3, Wrench } from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) return { title: 'Case Study Not Found' };

  const title = project.seo?.seo_title || `Case Study: ${project.title} | Rupesh Yadav`;
  const description = project.seo?.seo_description || project.short_description;
  const canonicalUrl = `${BASE_URL}/case-study/${project.slug}`;

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      images: [{ url: project.featured_image, width: 1200, height: 630 }],
    },
  };
}

export default async function CaseStudyDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project || project.status === 'private') {
    notFound();
  }

  const settings = await getSiteSettings();
  const cs = project.case_study || {};

  const schema = generateCreativeWorkSchema(project, settings);
  const breadcrumbs = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Work', url: '/work' },
    { name: 'Case Studies', url: '/work?type=case_study' },
    { name: project.title, url: `/case-study/${project.slug}` },
  ]);

  return (
    <article className="w-full py-12 md:py-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Back Link */}
        <Link
          href="/work?type=case_study"
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-500 hover:text-neutral-950 dark:hover:text-white"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Case Studies</span>
        </Link>

        {/* Case Study Hero */}
        <header className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 rounded-xs">
              In-Depth Case Study
            </span>
            <span className="text-xs font-medium uppercase tracking-wider text-neutral-500">
              {project.category}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-neutral-950 dark:text-white leading-tight">
            {project.title}
          </h1>

          <p className="text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed pt-2">
            {project.short_description}
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 border-y border-neutral-200 dark:border-neutral-800 text-xs mt-6">
            <div>
              <span className="block text-neutral-400 font-bold uppercase">Client</span>
              <span className="font-semibold text-neutral-900 dark:text-neutral-100">{project.client || 'Aura Audio Lab'}</span>
            </div>
            <div>
              <span className="block text-neutral-400 font-bold uppercase">Timeline</span>
              <span className="font-semibold text-neutral-900 dark:text-neutral-100">{project.year}</span>
            </div>
            <div>
              <span className="block text-neutral-400 font-bold uppercase">Roles</span>
              <span className="font-semibold text-neutral-900 dark:text-neutral-100">{project.services?.join(', ') || 'Creative Direction'}</span>
            </div>
            <div>
              <span className="block text-neutral-400 font-bold uppercase">Lead Creative</span>
              <span className="font-semibold text-neutral-900 dark:text-neutral-100">Rupesh Yadav</span>
            </div>
          </div>
        </header>

        {/* Hero Visual */}
        <div className="overflow-hidden bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
          <img
            src={project.featured_image}
            alt={project.alt_text || project.title}
            className="w-full h-auto object-cover max-h-[600px]"
          />
        </div>

        {/* Narrative Flow */}
        <div className="space-y-12 divide-y divide-neutral-200 dark:divide-neutral-800 text-neutral-800 dark:text-neutral-200">
          {/* Overview */}
          {cs.overview && (
            <section className="pt-8 space-y-3">
              <h2 className="text-xl font-bold uppercase tracking-tight text-neutral-950 dark:text-white flex items-center gap-2">
                <Compass className="w-5 h-5 text-neutral-400" />
                Project Overview
              </h2>
              <p className="text-base leading-relaxed text-neutral-700 dark:text-neutral-300">
                {cs.overview}
              </p>
            </section>
          )}

          {/* Problem & Goal */}
          {(cs.problem || cs.goal) && (
            <section className="pt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              {cs.problem && (
                <div className="p-6 bg-neutral-50 dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 space-y-2">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-950 dark:text-white flex items-center gap-2">
                    <Target className="w-4 h-4 text-red-500" />
                    The Challenge
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    {cs.problem}
                  </p>
                </div>
              )}

              {cs.goal && (
                <div className="p-6 bg-neutral-50 dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 space-y-2">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-950 dark:text-white flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    Strategic Goal
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    {cs.goal}
                  </p>
                </div>
              )}
            </section>
          )}

          {/* Research & Strategy */}
          {(cs.research || cs.strategy) && (
            <section className="pt-8 space-y-6">
              <h2 className="text-xl font-bold uppercase tracking-tight text-neutral-950 dark:text-white flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-neutral-400" />
                Research & Strategy
              </h2>
              {cs.research && (
                <p className="text-base leading-relaxed text-neutral-700 dark:text-neutral-300">
                  {cs.research}
                </p>
              )}
              {cs.strategy && (
                <p className="text-base leading-relaxed text-neutral-700 dark:text-neutral-300">
                  {cs.strategy}
                </p>
              )}
            </section>
          )}

          {/* Creative Direction & Process */}
          {(cs.creative_direction || cs.design_process) && (
            <section className="pt-8 space-y-6">
              <h2 className="text-xl font-bold uppercase tracking-tight text-neutral-950 dark:text-white">
                Creative Direction & Execution
              </h2>
              {cs.creative_direction && (
                <p className="text-base leading-relaxed text-neutral-700 dark:text-neutral-300">
                  {cs.creative_direction}
                </p>
              )}
              {cs.design_process && (
                <p className="text-base leading-relaxed text-neutral-700 dark:text-neutral-300">
                  {cs.design_process}
                </p>
              )}
            </section>
          )}

          {/* Results */}
          {cs.results && (
            <section className="pt-8 space-y-3">
              <h2 className="text-xl font-bold uppercase tracking-tight text-neutral-950 dark:text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-neutral-400" />
                Real Impact & Outcomes
              </h2>
              <div className="p-6 bg-neutral-50 dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800">
                <p className="text-base leading-relaxed text-neutral-800 dark:text-neutral-200">
                  {cs.results}
                </p>
              </div>
            </section>
          )}
        </div>

        {/* Tools Used */}
        {project.tools && project.tools.length > 0 && (
          <div className="pt-8 border-t border-neutral-200 dark:border-neutral-800 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
              <Wrench className="w-3.5 h-3.5" />
              Software & Production Stack
            </h3>
            <div className="flex flex-wrap gap-2">
              {project.tools.map((t) => (
                <span
                  key={t}
                  className="px-3 py-1.5 text-xs font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 rounded-xs"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="p-8 bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold uppercase tracking-tight">Need a Comprehensive Creative Solution?</h3>
            <p className="text-xs text-neutral-400 dark:text-neutral-600 mt-1">
              From visual branding to high-converting video and web execution.
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3.5 text-xs font-bold uppercase tracking-wider bg-white text-neutral-950 dark:bg-neutral-950 dark:text-white hover:opacity-90"
          >
            DISCUSS YOUR PROJECT
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}
