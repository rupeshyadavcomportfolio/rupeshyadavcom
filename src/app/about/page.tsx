import { Metadata } from 'next';
import Link from 'next/link';
import { getSiteSettings } from '@/lib/db';
import { ArrowUpRight, Phone, Mail, AtSign, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Rupesh Yadav — Graphic Designer, Video Creator & Web Designer',
  description: 'Learn about Rupesh Yadav (@rupeshyadavcom) — creative background, design philosophy, verified contact details, and technical software stack.',
};

export default async function AboutPage() {
  const settings = await getSiteSettings();

  const toolCategories = [
    { title: 'Graphic & Visual Design', tools: ['Adobe Photoshop', 'Adobe Illustrator', 'Figma', 'Adobe InDesign'] },
    { title: 'Video Editing & Motion', tools: ['Adobe Premiere Pro', 'Adobe After Effects', 'DaVinci Resolve', 'CapCut Pro'] },
    { title: 'Web Design & Code', tools: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'HTML5/Semantic Web'] },
  ];

  return (
    <div className="w-full py-12 md:py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div>
          <span className="text-xs uppercase tracking-widest font-bold text-neutral-400 dark:text-neutral-500">
            About The Creator
          </span>
          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-neutral-950 dark:text-white mt-1">
            RUPESH YADAV
          </h1>
          <p className="text-sm font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mt-2">
            {settings.professional_title}
          </p>
        </div>

        {/* Hero Profile Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5">
            <div className="relative aspect-4/5 overflow-hidden bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
              <img
                src={settings.profile_photo || '/rupesh-yadav.png'}
                alt="Rupesh Yadav"
                className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Direct Contact Card */}
            <div className="mt-6 p-6 bg-neutral-50 dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                Verified Contact Details
              </h3>
              <div className="space-y-2 text-sm font-medium">
                <a
                  href={`tel:${settings.phone}`}
                  className="flex items-center gap-2 text-neutral-900 dark:text-neutral-100 hover:underline"
                >
                  <Phone className="w-4 h-4 text-neutral-400" />
                  <span>+91 {settings.phone}</span>
                </a>
                <a
                  href={`mailto:${settings.email}`}
                  className="flex items-center gap-2 text-neutral-900 dark:text-neutral-100 hover:underline"
                >
                  <Mail className="w-4 h-4 text-neutral-400" />
                  <span>{settings.email}</span>
                </a>
                <div className="flex items-center gap-2 text-neutral-900 dark:text-neutral-100">
                  <AtSign className="w-4 h-4 text-neutral-400" />
                  <span>{settings.social_handle}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-8">
            <div>
              <h2 className="text-2xl font-bold uppercase tracking-tight text-neutral-950 dark:text-white">
                Core Philosophy
              </h2>
              <p className="text-base text-neutral-700 dark:text-neutral-300 leading-relaxed mt-4">
                {settings.bio}
              </p>
              <p className="text-base text-neutral-700 dark:text-neutral-300 leading-relaxed mt-4">
                My approach to every project follows a simple rule: <strong>work first, credibility second, personal details third, and contact last</strong>. High visual standards must always be backed by functional outcomes — whether that is brand recall, video watch retention, or website speed.
              </p>
            </div>

            {/* How I Work */}
            <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800 space-y-4">
              <h3 className="text-lg font-bold uppercase tracking-tight text-neutral-950 dark:text-white">
                Working Principles
              </h3>
              <ul className="space-y-3 text-sm text-neutral-700 dark:text-neutral-300">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-neutral-950 dark:text-white mt-0.5 shrink-0" />
                  <span><strong>Work First:</strong> Clean visual executions and tangible deliverables speak louder than marketing slogans.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-neutral-950 dark:text-white mt-0.5 shrink-0" />
                  <span><strong>No Filler:</strong> Avoiding generic templates, unnecessary gradients, and exaggerated claims.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-neutral-950 dark:text-white mt-0.5 shrink-0" />
                  <span><strong>Mobile & Speed First:</strong> Ensuring media and web assets load effortlessly across any smartphone or screen.</span>
                </li>
              </ul>
            </div>

            {/* Software Tooling Stack */}
            <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800 space-y-6">
              <h3 className="text-lg font-bold uppercase tracking-tight text-neutral-950 dark:text-white">
                Production Stack
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {toolCategories.map((cat) => (
                  <div key={cat.title} className="p-4 bg-neutral-50 dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
                      {cat.title}
                    </h4>
                    <ul className="space-y-1 text-xs font-medium text-neutral-800 dark:text-neutral-200">
                      {cat.tools.map((t) => (
                        <li key={t}>• {t}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3.5 text-xs font-bold uppercase tracking-wider bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 rounded-sm hover:opacity-90"
              >
                START A CONVERSATION
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
