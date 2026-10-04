import { Metadata } from 'next';
import Link from 'next/link';
import { getSiteSettings } from '@/lib/db';
import {
  ArrowUpRight,
  Phone,
  Mail,
  AtSign,
  Share2,
  MessageSquare,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Rupesh Yadav — Graphic Designer, Video Creator & Web Designer',
  description:
    'Learn about Rupesh Yadav (@rupeshyadavcom) — verified Facebook, LinkedIn, Instagram profiles, creative background, and verified contact details.',
};

export default async function AboutPage() {
  const settings = await getSiteSettings();

  return (
    <div className="w-full py-10 md:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider rounded-full mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Verified Creative Professional
          </div>
          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-neutral-950 dark:text-white mt-1">
            RUPESH YADAV
          </h1>
          <p className="text-sm sm:text-base font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mt-2">
            Graphic Designer • Video Creator • Web Designer
          </p>
        </div>

        {/* Hero Profile Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left Column: Photo + Verified Profiles Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="relative aspect-4/5 overflow-hidden rounded-2xl bg-neutral-100 dark:bg-neutral-900 border-2 border-neutral-900 dark:border-neutral-700 shadow-xl group">
              <img
                src={settings.profile_photo || '/rupesh-yadav.png'}
                alt="Rupesh Yadav - Graphic Designer, Video Creator & Web Designer"
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute bottom-3 left-3 right-3 bg-white/95 dark:bg-black/90 backdrop-blur-md px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-xs font-bold">
                <span className="flex items-center gap-2 text-neutral-900 dark:text-white">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  Rupesh Yadav
                </span>
                <span className="text-neutral-500 uppercase tracking-wider">@rupeshyadavcom</span>
              </div>
            </div>

            {/* Verified Social Media Profiles */}
            <div className="p-6 bg-neutral-50 dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-wider text-neutral-950 dark:text-white flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-emerald-500" />
                  Official Social Profiles
                </h3>
                <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                  Verified
                </span>
              </div>

              <div className="space-y-2.5 text-xs font-bold">
                {/* Facebook */}
                <a
                  href="https://www.facebook.com/rupeshyadavcom"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl hover:border-blue-600 hover:text-blue-600 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black text-sm">
                      f
                    </span>
                    <div>
                      <div className="text-neutral-950 dark:text-white group-hover:text-blue-600">Facebook</div>
                      <div className="text-[11px] font-normal text-neutral-500">facebook.com/rupeshyadavcom</div>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </a>

                {/* LinkedIn */}
                <a
                  href="https://www.linkedin.com/in/rupeshyadavcom/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl hover:border-[#0A66C2] hover:text-[#0A66C2] transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-[#0A66C2] text-white flex items-center justify-center font-black text-xs">
                      in
                    </span>
                    <div>
                      <div className="text-neutral-950 dark:text-white group-hover:text-[#0A66C2]">LinkedIn</div>
                      <div className="text-[11px] font-normal text-neutral-500">linkedin.com/in/rupeshyadavcom</div>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </a>

                {/* Instagram */}
                <a
                  href="https://instagram.com/rupeshyadavcom"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl hover:border-pink-600 hover:text-pink-600 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-gradient-to-tr from-yellow-500 via-pink-600 to-purple-600 text-white flex items-center justify-center font-black text-xs">
                      IG
                    </span>
                    <div>
                      <div className="text-neutral-950 dark:text-white group-hover:text-pink-600">Instagram</div>
                      <div className="text-[11px] font-normal text-neutral-500">@rupeshyadavcom</div>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </a>
              </div>
            </div>

            {/* Direct Contact Box */}
            <div className="p-6 bg-neutral-50 dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 rounded-2xl space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                Direct Contact
              </h3>
              <div className="space-y-2.5 text-sm font-semibold">
                <a
                  href={`tel:${settings.phone}`}
                  className="flex items-center gap-3 text-neutral-900 dark:text-neutral-100 hover:text-emerald-500 transition-colors"
                >
                  <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>+91 {settings.phone}</span>
                </a>
                <a
                  href={`mailto:${settings.email}`}
                  className="flex items-center gap-3 text-neutral-900 dark:text-neutral-100 hover:text-emerald-500 transition-colors"
                >
                  <Mail className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{settings.email}</span>
                </a>
                <div className="flex items-center gap-3 text-neutral-900 dark:text-neutral-100">
                  <AtSign className="w-4 h-4 text-neutral-400 shrink-0" />
                  <span>{settings.social_handle}</span>
                </div>
              </div>

              <div className="pt-3">
                <a
                  href={`https://wa.me/91${settings.phone}?text=Hi%20Rupesh,%20I%20saw%20your%20portfolio%20and%20want%20to%20discuss%20a%20project!`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors shadow-sm"
                >
                  <MessageSquare className="w-4 h-4" />
                  Chat on WhatsApp
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Clean Bio & Direct CTAs */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-5">
              <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-neutral-950 dark:text-white">
                Hi, I'm Rupesh Yadav.
              </h2>
              <p className="text-base sm:text-lg text-neutral-700 dark:text-neutral-300 leading-relaxed">
                I am a dedicated <strong>Graphic Designer, Video Creator, and Web Designer</strong> based in India. I work directly with business owners, brands, creators, and agencies to deliver crisp, high-impact visuals that turn casual viewers into paying clients.
              </p>
              <p className="text-base sm:text-lg text-neutral-700 dark:text-neutral-300 leading-relaxed">
                Whether you need scroll-stopping social media creatives, high-retention video reels that keep audiences hooked, or a modern, fast website for your business — I handle everything with <strong>speed, precision, and direct communication</strong>.
              </p>
            </div>

            {/* Quick CTAs */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <a
                href={`https://wa.me/91${settings.phone}?text=Hi%20Rupesh,%20I%20am%20interested%20in%20working%20with%20you!`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-4 text-xs font-bold uppercase tracking-wider bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-all shadow-md hover:shadow-lg"
              >
                <MessageSquare className="w-4 h-4" />
                DIRECT WHATSAPP CHAT
              </a>
              <Link
                href="/work"
                className="inline-flex items-center gap-2 px-6 py-4 text-xs font-bold uppercase tracking-wider bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 rounded-xl hover:opacity-90 transition-opacity"
              >
                VIEW MY WORK
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
